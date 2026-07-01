'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { useSubmitScore } from '@/hooks/useSubmitScore';

const ROUND_SECONDS = 15;
const BASE_SCORE = 100;

interface ConsoleRound {
  id: string;
  imageUrl: string;
  options: string[];
}

interface ConsoleValidateResult {
  correct: boolean;
  name: string;
  year: number;
  generation: number;
  unitsSoldMillions: number;
}

export default function GameConsoleEvolution() {
  const [round, setRound] = useState<ConsoleRound | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const [result, setResult] = useState<ConsoleValidateResult | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, result !== null);
  const submitScore = useSubmitScore('game-console');

  useEffect(() => {
    fetchRound();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && result === null && round) {
      handleGuess('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const fetchRound = async () => {
    setLoading(true);
    setGuess(null);
    setResult(null);
    const response = await axios.get<ConsoleRound>('/api/games-data/game-console');
    setRound(response.data);
    reset();
    setLoading(false);
  };

  const handleGuess = async (choice: string) => {
    if (!round || result) return;
    setGuess(choice);
    const response = await axios.post<ConsoleValidateResult>('/api/games-data/game-console/validate', {
      id: round.id,
      guess: choice,
    });
    setResult(response.data);

    if (response.data.correct) {
      const roundScore = BASE_SCORE + Math.floor(timeLeft * 2);
      setScore((s) => s + roundScore);
      submitScore(roundScore);
    }
  };

  if (loading || !round) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-amber-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={score} />
        <Timer seconds={timeLeft} warnAt={5} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6"
      >
        <img
          src={round.imageUrl}
          alt="Console misteriosa"
          className="w-full aspect-square rounded-lg object-cover"
        />
      </motion.div>

      <p className="text-center text-white/70 mb-4">Quale console è questa?</p>

      <div className="space-y-3">
        {round.options.map((option) => {
          const isPicked = guess === option;
          const isRightAnswer = result && result.name === option;
          let stateClasses = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
          if (result) {
            if (isRightAnswer) {
              stateClasses = 'bg-green-500/30 border border-green-500 text-green-300';
            } else if (isPicked) {
              stateClasses = 'bg-red-500/30 border border-red-500 text-red-300';
            } else {
              stateClasses = 'bg-white/5 border border-white/10 text-white/50';
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleGuess(option)}
              disabled={result !== null}
              className={`w-full py-3 rounded-lg font-bold transition disabled:cursor-not-allowed ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-6 p-4 rounded-lg text-center ${
              result.correct
                ? 'bg-green-500/20 border border-green-500 text-green-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}
          >
            <p className="font-bold mb-2">{result.correct ? '✅ Corretto!' : '❌ Sbagliato!'}</p>
            <p className="text-sm text-white/80 mb-1">{result.name} · {result.year}</p>
            <p className="text-xs text-white/60 mb-4">
              Generazione {result.generation} · {result.unitsSoldMillions}M copie vendute
            </p>
            <button
              onClick={fetchRound}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg"
            >
              Prossima console →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
