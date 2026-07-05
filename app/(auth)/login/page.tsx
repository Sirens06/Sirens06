import { LoginForm } from './LoginForm';

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const spotifyEnabled = Boolean(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <LoginForm googleEnabled={googleEnabled} spotifyEnabled={spotifyEnabled} />
    </main>
  );
}
