'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { scoreSquad, SquadScoreBreakdown } from '@/lib/game-engine/football-simulator';
import { useSubmitScore } from '@/hooks/useSubmitScore';

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  rating: number;
  goals: number;
  assists: number;
}

const SQUAD_SIZE = 5;
const ROUND_SECONDS = 60;

export default function FootballManager() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState<SquadScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, locked);
  const submitScore = useSubmitScore('football-manager');

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !locked && players.length > 0) {
      lockSquad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const fetchPlayers = async () => {
    setLoading(true);
    const response = await axios.get<{ players: Player[] }>('/api/games-data/football-manager');
    setPlayers(response.data.players);
    setSelectedIds([]);
    setLocked(false);
    setResult(null);
    setLoading(false);
    reset();
  };

  const togglePlayer = (id: string) => {
    if (locked) return;
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= SQUAD_SIZE) return prev;
      return [...prev, id];
    });
  };

  const lockSquad = () => {
    if (locked) return;
    const chosen = players.filter((p) => selectedIds.includes(p.id));
    const breakdown = scoreSquad(chosen, SQUAD_SIZE);
    setResult(breakdown);
    setLocked(true);
    submitScore(Math.max(0, Math.round(breakdown.totalScore)));
  };

  if (loading || players.length === 0) {
    return <div className="text-center text-white/70 py-12">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-green-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={result?.totalScore ?? 0} label="Punteggio Rosa" />
        <Timer seconds={timeLeft} warnAt={10} />
      </div>

      <p className="text-center text-white/80 mb-4 font-medium">
        Scegli {SQUAD_SIZE} giocatori per la tua rosa ({selectedIds.length}/{SQUAD_SIZE})
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {players.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          return (
            <button
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              disabled={locked}
              className={`text-left p-3 rounded-lg border transition disabled:opacity-50 ${
                isSelected
                  ? 'bg-emerald-500/30 border-emerald-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="font-bold text-white">{player.name}</p>
              <p className="text-xs text-white/60">
                {player.team} · {player.position} · Rating {player.rating}
              </p>
              <p className="text-xs text-white/50">
                ⚽ {player.goals} gol · 🎯 {player.assists} assist
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={lockSquad}
        disabled={locked || selectedIds.length !== SQUAD_SIZE}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
      >
        Conferma Rosa
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-6 p-4 rounded-lg text-center bg-emerald-500/20 border border-emerald-500 text-emerald-300"
          >
            <p className="font-bold mb-2">🏆 Rosa Completata!</p>
            <p className="text-sm mb-1">Rating totale: {result.totalRating}</p>
            <p className="text-sm mb-1">Bonus diversità squadre: +{result.teamDiversityBonus}</p>
            <p className="text-sm mb-1">
              Bonus bilanciamento ruoli: +{result.positionBalanceBonus}
            </p>
            {result.incompleteSquadPenalty > 0 && (
              <p className="text-sm mb-1 text-red-400">
                Penalità rosa incompleta: -{result.incompleteSquadPenalty}
              </p>
            )}
            <p className="text-lg font-extrabold mt-2 mb-4">
              Punteggio finale: {result.totalScore}
            </p>
            <button
              onClick={fetchPlayers}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
            >
              Gioca di nuovo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
