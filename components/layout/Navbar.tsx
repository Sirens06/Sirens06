'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useGameStore } from '@/store/gameStore';
import { StreakDisplay } from '@/components/leaderboard/StreakDisplay';

export function Navbar() {
  const { data: session, status } = useSession();
  const { profile, refreshProfile } = useGameStore();

  useEffect(() => {
    if (status === 'authenticated') refreshProfile();
  }, [status, refreshProfile]);

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur border-b border-white/10">
      <Link href="/dashboard" className="font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Multi-Game Platform
      </Link>

      <div className="flex items-center gap-4 text-sm">
        {status === 'authenticated' ? (
          <>
            <Link href="/dashboard" className="text-white/70 hover:text-white transition">
              Giochi
            </Link>
            <Link href="/leaderboard" className="text-white/70 hover:text-white transition">
              Classifica
            </Link>
            <Link href="/shop" className="text-white/70 hover:text-white transition">
              Shop
            </Link>
            {profile && <StreakDisplay streak={profile.streak} />}
            {profile && <span className="text-white/50">🪙 {profile.currency}</span>}
            <span className="text-white/40 hidden sm:inline">{session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white/70 hover:text-white transition"
            >
              Esci
            </button>
          </>
        ) : (
          <Link href="/login" className="text-white/70 hover:text-white transition">
            Accedi
          </Link>
        )}
      </div>
    </nav>
  );
}
