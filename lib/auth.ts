import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Spotify from 'next-auth/providers/spotify';
import type { Provider } from '@auth/core/providers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const providers: Provider[] = [
  Credentials({
    name: 'Email e password',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const email = typeof credentials?.email === 'string' ? credentials.email : undefined;
      const password = typeof credentials?.password === 'string' ? credentials.password : undefined;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name };
    },
  }),
];

// Only registered when real OAuth credentials are supplied — see .env.example.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })
  );
}

// Reuses the same Spotify app used for the public catalogue API (see
// spotify-service.ts) — just add /api/auth/callback/spotify to that app's
// Redirect URIs in the Spotify Developer Dashboard to enable it.
if (process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
  providers.push(
    Spotify({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth providers: create the local User row on first login.
      if (account?.provider !== 'credentials') {
        if (!user.email) return false;
        await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name ?? undefined },
          create: { email: user.email, name: user.name ?? undefined },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) token.userId = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
  },
});
