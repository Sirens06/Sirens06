'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { SCORING } from '@/lib/constants';
import { useSubmitScore } from '@/hooks/useSubmitScore';

interface MusicStatsRound {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  popularity: number;
  correctDirection: 'up' | 'down';
}

export default function MusicStats() {
  const [round, setRound] = useState<MusicStatsRound | null>(null);
  const [guess, setGuess] = useState<'up' | 'down' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const submitScore = useSubmitScore('music-stats');

  useEffect(() => {
    fetchRound();
  }, []);

  const fetchRound = async () => {
    setLoading(true);
    setGuess(null);
    setIsCorrect(null);
    const response = await axios.get<MusicStatsRound>('/api/games-data/music-stats');
    setRound(response.data);
    setLoading(false);
  };

  const handleGuess = (direction: 'up' | 'down') => {
    if (!round || guess) return;
    setGuess(direction);
    const correct = direction === round.correctDirection;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + SCORING.musicStats.base);
      setStreak((s) => s + 1);
      submitScore(SCORING.musicStats.base);
    } else {
      setStreak(0);
    }
  };

  if (loading || !round) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-teal-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={score} />
        <div className="text-sm text-white/70">🔥 Streak: {streak}</div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-5 rounded-lg bg-white/5 border border-white/10 mb-6 text-center"
      >
        <img
          src={round.imageUrl}
          alt={round.name}
          className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
        />
        <h3 className="text-lg font-bold text-white">{round.name}</h3>
        <p className="text-white/60 text-sm mb-2">{round.artist}</p>
        <p className="text-white/60 text-xs mb-1">Punteggio in classifica oggi</p>
        <p className="text-4xl font-extrabold text-teal-400">{round.popularity}</p>
      </motion.div>

      <p className="text-center text-white/70 mb-4">
        Domani la posizione in classifica salirà o scenderà?
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleGuess('up')}
          disabled={guess !== null}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          Salirà ↑
        </button>
        <button
          onClick={() => handleGuess('down')}
          disabled={guess !== null}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          Scenderà ↓
        </button>
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-6 p-4 rounded-lg text-center ${
              isCorrect
                ? 'bg-green-500/20 border border-green-500 text-green-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}
          >
            <p className="font-bold mb-4">{isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}</p>
            <button
              onClick={fetchRound}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
            >
              Prossimo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
