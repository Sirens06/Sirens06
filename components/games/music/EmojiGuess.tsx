'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Timer } from '@/components/ui/Timer';
import { useCountdown } from '@/hooks/useCountdown';
import { useSubmitScore } from '@/hooks/useSubmitScore';

const ROUND_SECONDS = 20;
const BASE_SCORE = 80;

interface EmojiTrack {
  id: string;
  emojiHint: string;
  name: string;
  artist: string;
}

export default function EmojiGuess() {
  const [track, setTrack] = useState<EmojiTrack | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const { timeLeft, reset } = useCountdown(ROUND_SECONDS, isCorrect !== null);
  const submitScore = useSubmitScore('emoji-guess');

  useEffect(() => {
    fetchTrack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-resolve as wrong once the clock runs out and the player hasn't answered.
  useEffect(() => {
    if (timeLeft === 0 && isCorrect === null && track) {
      setIsCorrect(false);
    }
  }, [timeLeft, isCorrect, track]);

  const fetchTrack = async () => {
    setLoading(true);
    setUserAnswer('');
    setIsCorrect(null);
    const response = await axios.get<EmojiTrack>('/api/games-data/emoji-guess');
    setTrack(response.data);
    reset();
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!track || isCorrect !== null) return;
    const correct = userAnswer.toLowerCase().includes(track.name.toLowerCase());
    setIsCorrect(correct);

    if (correct) {
      const roundScore = BASE_SCORE + Math.floor(timeLeft * 2);
      setScore((s) => s + roundScore);
      submitScore(roundScore);
    }
  };

  if (loading || !track) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-pink-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={score} />
        <Timer seconds={timeLeft} warnAt={5} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-8 rounded-lg bg-white/5 border border-white/10 mb-6 text-center"
      >
        <p className="text-white/60 text-sm mb-3">Indovina la canzone dagli emoji</p>
        <p className="text-6xl tracking-widest">{track.emojiHint}</p>
      </motion.div>

      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Titolo della canzone..."
          disabled={isCorrect !== null}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <button
          onClick={handleSubmit}
          disabled={!userAnswer || isCorrect !== null}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          Indovina
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
            <p className="font-bold mb-2">{isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}</p>
            <p className="text-sm mb-4">
              Risposta: {track.name} — {track.artist}
            </p>
            <button
              onClick={fetchTrack}
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
