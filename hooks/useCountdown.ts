'use client';

import { useEffect, useState } from 'react';

// Ticks a countdown from `seconds` down to 0 once per second. Pass `paused`
// (e.g. once the player has answered) to freeze the timer.
export function useCountdown(seconds: number, paused = false) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (paused || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [paused, timeLeft]);

  const reset = () => setTimeLeft(seconds);

  return { timeLeft, reset };
}
