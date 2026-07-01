'use client';

import { useState } from 'react';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export default function LeaderboardPage() {
  const [scope, setScope] = useState<'weekly' | 'all-time'>('weekly');

  return (
    <main className="min-h-screen px-6 py-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Classifica</h1>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setScope('weekly')}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            scope === 'weekly' ? 'bg-purple-500 border-purple-400' : 'border-white/20 text-white/60'
          }`}
        >
          Questa settimana
        </button>
        <button
          onClick={() => setScope('all-time')}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            scope === 'all-time' ? 'bg-purple-500 border-purple-400' : 'border-white/20 text-white/60'
          }`}
        >
          Sempre
        </button>
      </div>

      <LeaderboardTable scope={scope} />
    </main>
  );
}
