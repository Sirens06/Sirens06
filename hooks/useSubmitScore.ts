'use client';

import { useCallback } from 'react';
import axios from 'axios';

// Reports a round's point delta (not the cumulative session score) to the
// backend, which adds it to the player's running total and updates streak.
export function useSubmitScore(gameId: string) {
  return useCallback(
    async (roundScore: number, turno = 1) => {
      if (roundScore <= 0) return null;
      try {
        const response = await axios.post(`/api/games/${gameId}/submit-score`, {
          score: roundScore,
          turno,
        });
        return response.data as { finalScore: number; totalScore: number; streak: number; multiplier: number };
      } catch (error) {
        console.warn(`Failed to submit score for ${gameId}:`, error);
        return null;
      }
    },
    [gameId]
  );
}
