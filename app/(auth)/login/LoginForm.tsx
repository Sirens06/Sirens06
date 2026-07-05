'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  googleEnabled: boolean;
  spotifyEnabled: boolean;
}

export function LoginForm({ googleEnabled, spotifyEnabled }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError('Email o password errati');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white/5 border border-white/10 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Accedi</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Accesso...' : 'Accedi'}
        </button>
      </form>

      {(googleEnabled || spotifyEnabled) && (
        <div className="mt-6 space-y-2">
          <p className="text-center text-xs text-white/40">oppure</p>
          {googleEnabled && (
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-lg font-bold transition"
            >
              Continua con Google
            </button>
          )}
          {spotifyEnabled && (
            <button
              onClick={() => signIn('spotify', { callbackUrl: '/dashboard' })}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition"
            >
              Continua con Spotify
            </button>
          )}
        </div>
      )}

      <p className="text-center text-sm text-white/60 mt-6">
        Non hai un account?{' '}
        <Link href="/register" className="text-purple-400 hover:underline">
          Registrati
        </Link>
      </p>
    </div>
  );
}
