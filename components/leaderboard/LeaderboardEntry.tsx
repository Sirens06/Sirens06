'use client';

import { motion } from 'framer-motion';

interface LeaderboardEntryProps {
  rank: number;
  userId: string;
  totalScore: number;
  isCurrentUser: boolean;
}

export function LeaderboardEntry({ rank, userId, totalScore, isCurrentUser }: LeaderboardEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank, 10) * 0.05 }}
      className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
        isCurrentUser ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg w-6 text-center">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
        </span>
        <span className="text-white/80 truncate max-w-[10rem]">
          {isCurrentUser ? 'Tu' : `Giocatore ${userId.slice(0, 6)}`}
        </span>
      </div>
      <span className="font-bold text-xl">{totalScore}</span>
    </motion.div>
  );
}
