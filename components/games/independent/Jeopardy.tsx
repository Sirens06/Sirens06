'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { SCORING } from '@/lib/constants';
import { useSubmitScore } from '@/hooks/useSubmitScore';

const CATEGORIES = ['Random', 'Storia', 'Scienza', 'Calcio', 'Film', 'Geografia', 'Arte', 'Economia', 'Musica'];
const ROUND_SECONDS = 90;

interface JeopardyQuestionPublic {
  id: string;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  value: number;
}

export default function Jeopardy() {
  const [category, setCategory] = useState('Random');
  const [question, setQuestion] = useState<JeopardyQuestionPublic | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<{ correct: boolean; answer: string } | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, result !== null);
  const submitScore = useSubmitScore('jeopardy');

  useEffect(() => {
    fetchQuestion(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchQuestion = async (cat: string) => {
    setLoading(true);
    setResult(null);
    setUserAnswer('');
    const params = cat === 'Random' ? {} : { category: cat };
    const response = await axios.get<JeopardyQuestionPublic>('/api/games-data/jeopardy', { params });
    setQuestion(response.data);
    reset();
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!question || result) return;
    const response = await axios.post('/api/games-data/jeopardy/validate', {
      questionId: question.id,
      userAnswer,
    });
    setResult(response.data);

    if (response.data.correct) {
      const roundScore = Math.round(SCORING.jeopardy.multiplier(question.value, timeLeft) / 10);
      setScore((s) => s + roundScore);
      submitScore(roundScore);
    }
  };

  if (loading || !question) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-indigo-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <ScoreDisplay score={score} />
        <Timer seconds={timeLeft} warnAt={15} />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              category === cat
                ? 'bg-indigo-500 border-indigo-400 text-white'
                : 'border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-lg bg-white/5 border border-white/10 mb-6">
        <div className="flex justify-between text-xs text-white/50 mb-2">
          <span>{question.category}</span>
          <span>{question.value} pt · {question.difficulty}</span>
        </div>
        <p className="text-lg font-medium">{question.question}</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="La tua risposta..."
          disabled={result !== null}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={!userAnswer || result !== null}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          Rispondi
        </button>
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
            <p className="text-sm mb-4">Risposta: {result.answer}</p>
            <button
              onClick={() => fetchQuestion(category)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
            >
              Prossima domanda →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
