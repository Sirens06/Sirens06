'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { useSubmitScore } from '@/hooks/useSubmitScore';

interface HighlightData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  minute: number;
  partialScore: string;
  clipImageUrl: string;
  options: string[];
  correctAnswer: string;
}

const ROUND_SECONDS = 20;

export default function HighlightPrediction() {
  const [data, setData] = useState<HighlightData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const answered = isCorrect !== null;
  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, answered);
  const submitScore = useSubmitScore('highlight-prediction');

  useEffect(() => {
    fetchHighlight();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !answered && data) {
      setIsCorrect(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const fetchHighlight = async () => {
    setLoading(true);
    setSelected(null);
    setIsCorrect(null);
    const response = await axios.get<HighlightData>('/api/games-data/highlight-prediction');
    setData(response.data);
    setLoading(false);
    reset();
  };

  const handleGuess = (scoreline: string) => {
    if (!data || answered) return;
    setSelected(scoreline);
    const correct = scoreline === data.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 100);
      submitScore(100);
    }
  };

  if (loading || !data) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-emerald-900 to-black rounded-xl"
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
          src={data.clipImageUrl}
          alt={`Inizio highlight ${data.homeTeam} vs ${data.awayTeam}`}
          className="w-full aspect-video rounded-lg object-cover mb-2"
        />
        <p className="text-center text-white/70 text-sm">
          {data.homeTeam} vs {data.awayTeam} — risultato al minuto {data.minute}&apos;:{' '}
          <span className="font-bold text-white">{data.partialScore}</span>
        </p>
      </motion.div>

      <p className="text-center text-white/80 mb-4 font-medium">
        Come finirà la partita? Indovina il risultato finale.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {data.options.map((option) => {
          const isSelectedOption = selected === option;
          const isCorrectOption = option === data.correctAnswer;
          let optionClass =
            'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg';
          if (answered && isCorrectOption) {
            optionClass = 'bg-green-500/30 border border-green-500 text-green-400';
          } else if (answered && isSelectedOption) {
            optionClass = 'bg-red-500/30 border border-red-500 text-red-400';
          } else if (answered) {
            optionClass = 'bg-white/5 border border-white/10 text-white/50';
          }

          return (
            <button
              key={option}
              onClick={() => handleGuess(option)}
              disabled={answered}
              className={`py-3 rounded-lg font-bold transition disabled:opacity-50 ${optionClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-6 p-4 rounded-lg text-center ${
              isCorrect
                ? 'bg-green-500/20 border border-green-500 text-green-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}
          >
            <p className="font-bold mb-2">{isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}</p>
            <p className="text-sm mb-4">Risultato finale: {data.correctAnswer}</p>
            <button
              onClick={fetchHighlight}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
            >
              Prossimo Highlight →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
