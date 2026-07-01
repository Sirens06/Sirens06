'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { SCORING } from '@/lib/constants';
import { useSubmitScore } from '@/hooks/useSubmitScore';

interface ComparisonResponse {
  current: { id: string; label: string; value: number; unit: string };
  nextId: string;
  correctAnswer: 'higher' | 'lower';
}

export default function HigherLower() {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [guess, setGuess] = useState<'higher' | 'lower' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const submitScore = useSubmitScore('higher-lower');

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    setLoading(true);
    setGuess(null);
    setIsCorrect(null);
    const response = await axios.get<ComparisonResponse>('/api/games-data/higher-lower');
    setData(response.data);
    setLoading(false);
  };

  const handleGuess = (choice: 'higher' | 'lower') => {
    if (!data || guess) return;
    setGuess(choice);
    const correct = choice === data.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + SCORING.higherLower.base);
      setStreak((s) => s + 1);
      submitScore(SCORING.higherLower.base);
    } else {
      setStreak(0);
    }
  };

  if (loading || !data) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={score} />
        <div className="text-sm text-white/70">🔥 Streak: {streak}</div>
      </div>

      <div className="p-5 rounded-lg bg-white/5 border border-white/10 mb-6 text-center">
        <p className="text-white/60 text-sm mb-1">{data.current.unit}</p>
        <h3 className="text-lg font-bold mb-2">{data.current.label}</h3>
        <p className="text-4xl font-extrabold text-blue-400">{data.current.value}</p>
      </div>

      <p className="text-center text-white/70 mb-4">
        Il prossimo valore sarà più alto o più basso?
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleGuess('higher')}
          disabled={guess !== null}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          ↑ Più alto
        </button>
        <button
          onClick={() => handleGuess('lower')}
          disabled={guess !== null}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          ↓ Più basso
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
              onClick={fetchComparison}
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
