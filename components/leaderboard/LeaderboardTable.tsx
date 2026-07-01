'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LeaderboardEntry } from './LeaderboardEntry';
import { useGameStore } from '@/store/gameStore';

interface LeaderboardRow {
  userId: string;
  totalScore: number;
  rank: number;
}

interface LeaderboardTableProps {
  scope: 'weekly' | 'all-time';
}

export function LeaderboardTable({ scope }: LeaderboardTableProps) {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const { profile, refreshProfile } = useGameStore();

  useEffect(() => {
    refreshProfile();
    axios.get(`/api/leaderboard/${scope}`).then((response) => {
      setRows(response.data.leaderboard);
    });
  }, [scope, refreshProfile]);

  if (!rows) return <div className="text-center text-white/70 py-8">Loading...</div>;

  if (rows.length === 0) {
    return (
      <div className="text-center text-white/50 py-12">
        Nessun punteggio ancora — gioca una partita per apparire in classifica!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <LeaderboardEntry
          key={row.userId}
          rank={row.rank}
          userId={row.userId}
          totalScore={row.totalScore}
          isCurrentUser={row.userId === profile?.id}
        />
      ))}
    </div>
  );
}
