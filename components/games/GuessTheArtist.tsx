'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSubmitScore } from '@/hooks/useSubmitScore';

interface Track {
  id: string;
  name: string;
  artists: string[];
  preview_url: string;
  image_url: string;
}

export default function GuessTheArtist() {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const audioRef = useRef<HTMLAudioElement>(null);
  const submitScore = useSubmitScore('guess-artist');

  useEffect(() => {
    fetchTrack();
  }, []);

  useEffect(() => {
    if (timer <= 0 || isCorrect !== null) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, isCorrect]);

  const fetchTrack = async () => {
    const response = await axios.get<Track>('/api/games-data/spotify-tracks');
    setTrack(response.data);
    setIsPlaying(false);
    setShowImage(false);
    setUserAnswer('');
    setIsCorrect(null);
    setTimer(30);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSubmit = () => {
    const correct = track?.artists.some((artist) =>
      userAnswer.toLowerCase().includes(artist.toLowerCase())
    );
    setIsCorrect(correct ?? false);

    if (correct) {
      const roundScore = 100 + Math.floor(timer * 2) - (showImage ? 25 : 0);
      setScore((s) => s + roundScore);
      submitScore(roundScore);
    }
  };

  if (!track) return <div className="text-center text-white/70 py-12">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-purple-900 to-black rounded-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Score: {score}</h2>
        <div className={`text-3xl font-bold ${timer < 5 ? 'text-red-500' : 'text-green-500'}`}>
          {timer}s
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6"
      >
        <img
          src={track.image_url}
          alt="Album"
          className={`w-full aspect-square rounded-lg object-cover ${!showImage ? 'blur-sm' : ''}`}
        />
        {!showImage && (
          <button
            onClick={() => setShowImage(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg hover:bg-black/30 transition"
          >
            <span className="text-white text-sm font-medium">Show Album Art (-25pts)</span>
          </button>
        )}
      </motion.div>

      <audio ref={audioRef} src={track.preview_url} onEnded={() => setIsPlaying(false)} />

      <button
        onClick={playAudio}
        disabled={isPlaying}
        className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
      >
        {isPlaying ? '🎵 Playing...' : '▶️ Play Audio'}
      </button>

      <div className="space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter artist name..."
          disabled={isCorrect !== null}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <button
          onClick={handleSubmit}
          disabled={!userAnswer || isCorrect !== null}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
        >
          Submit
        </button>
      </div>

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
          <p className="font-bold mb-2">{isCorrect ? '✅ Correct!' : '❌ Wrong!'}</p>
          <p className="text-sm mb-4">Answer: {track.artists.join(', ')}</p>
          <button
            onClick={fetchTrack}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
          >
            Next Song →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
