'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { MOCK_BRAND_LOGOS } from '@/lib/mock-data';
import { useSubmitScore } from '@/hooks/useSubmitScore';

const ROUND_SECONDS = 15;
const BASE_SCORE = 100;

interface BrandLogoRound {
  id: string;
  imageUrl: string;
  logoDescription: string;
  options: string[];
}

interface BrandLogoValidateResult {
  correct: boolean;
  brand: string;
  year: number;
  order: number;
}

export default function BrandLogoEvolution() {
  const [round, setRound] = useState<BrandLogoRound | null>(null);
  const [guess, setGuess] = useState<string | null>(null);
  const [result, setResult] = useState<BrandLogoValidateResult | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, result !== null);
  const submitScore = useSubmitScore('brand-logo');

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
    const response = await axios.get<BrandLogoRound>('/api/games-data/brand-logo');
    setRound(response.data);
    reset();
    setLoading(false);
  };

  const handleGuess = async (choice: string) => {
    if (!round || result) return;
    setGuess(choice);
    const response = await axios.post<BrandLogoValidateResult>('/api/games-data/brand-logo/validate', {
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

  const evolution = result
    ? MOCK_BRAND_LOGOS.filter((logo) => logo.brand === result.brand).sort((a, b) => a.order - b.order)
    : [];

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
        className="mb-2"
      >
        <img
          src={round.imageUrl}
          alt="Logo storico misterioso"
          className="w-full aspect-square rounded-lg object-cover"
        />
      </motion.div>
      <p className="text-center text-xs text-white/50 mb-4">{round.logoDescription}</p>

      <p className="text-center text-white/70 mb-4">Di quale brand è questo vecchio logo?</p>

      <div className="space-y-3">
        {round.options.map((option) => {
          const isPicked = guess === option;
          const isRightAnswer = result && result.brand === option;
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
            <p className="text-sm text-white/80 mb-4">
              {result.brand} · {result.year} · logo #{result.order} nell&apos;evoluzione del brand
            </p>

            {evolution.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-white/50 mb-2">Evoluzione cronologica del logo:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {evolution.map((logo) => (
                    <div
                      key={logo.id}
                      className={`flex flex-col items-center p-1 rounded-lg border ${
                        logo.id === round.id ? 'border-amber-400' : 'border-white/10'
                      }`}
                    >
                      <img
                        src={logo.imageUrl}
                        alt={`${logo.brand} ${logo.year}`}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <span className="text-[10px] text-white/60 mt-1">{logo.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={fetchRound}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg"
            >
              Prossimo logo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
