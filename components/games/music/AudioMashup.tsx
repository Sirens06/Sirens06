'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { useSubmitScore } from '@/hooks/useSubmitScore';

const BASE_SCORE = 100;

interface MashupTrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
}

interface MashupResponse {
  trackA: MashupTrack;
  trackB: MashupTrack;
}

// Reward tighter release-year gaps since those rounds are harder to call.
function gapBonus(gap: number): number {
  if (gap <= 1) return 50;
  if (gap <= 3) return 30;
  if (gap <= 5) return 15;
  return 0;
}

export default function AudioMashup() {
  const [data, setData] = useState<MashupResponse | null>(null);
  const [guess, setGuess] = useState<'A' | 'B' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const submitScore = useSubmitScore('audio-mashup');

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    setGuess(null);
    setIsCorrect(null);
    const response = await axios.get<MashupResponse>('/api/games-data/audio-mashup');
    setData(response.data);
    setLoading(false);
  };

  const handleGuess = (choice: 'A' | 'B') => {
    if (!data || guess) return;
    setGuess(choice);

    const earlier = data.trackA.releaseYear <= data.trackB.releaseYear ? 'A' : 'B';
    const correct = choice === earlier;
    setIsCorrect(correct);

    if (correct) {
      const gap = Math.abs(data.trackA.releaseYear - data.trackB.releaseYear);
      const roundScore = BASE_SCORE + gapBonus(gap);
      setScore((s) => s + roundScore);
      submitScore(roundScore);
    }
  };

  if (loading || !data) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg mx-auto p-6 bg-gradient-to-br from-orange-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <ScoreDisplay score={score} />
      </div>

      <p className="text-center text-white/70 mb-6">
        🎧 Due canzoni sovrapposte... quale è uscita per prima?
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {(['A', 'B'] as const).map((key) => {
          const track = key === 'A' ? data.trackA : data.trackB;
          return (
            <motion.button
              key={key}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => handleGuess(key)}
              disabled={guess !== null}
              className="text-left rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-orange-400 transition disabled:opacity-70"
            >
              <img src={track.imageUrl} alt={track.name} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="font-bold text-white truncate">{track.name}</p>
                <p className="text-sm text-white/60 truncate">{track.artist}</p>
                {guess !== null && <p className="text-xs text-orange-300 mt-1">{track.releaseYear}</p>}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-4 rounded-lg text-center ${
              isCorrect
                ? 'bg-green-500/20 border border-green-500 text-green-400'
                : 'bg-red-500/20 border border-red-500 text-red-400'
            }`}
          >
            <p className="font-bold mb-2">{isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}</p>
            <p className="text-sm mb-4">
              {data.trackA.name} ({data.trackA.releaseYear}) vs {data.trackB.name} ({data.trackB.releaseYear})
            </p>
            <button
              onClick={fetchTracks}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
            >
              Prossimo mashup →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
