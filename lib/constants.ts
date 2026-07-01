export interface GameDefinition {
  id: string;
  name: string;
  category: 'musica' | 'calcio' | 'culture' | 'indipendente';
  emoji: string;
}

export const GAMES: GameDefinition[] = [
  { id: 'guess-artist', name: 'Indovina Canzone', category: 'musica', emoji: '🎵' },
  { id: 'emoji-guess', name: 'Emoji Guess', category: 'musica', emoji: '🎨' },
  { id: 'audio-mashup', name: 'Audio Mashup', category: 'musica', emoji: '🔊' },
  { id: 'music-stats', name: 'Music Stats Prediction', category: 'musica', emoji: '📈' },
  { id: 'video-clip', name: 'Video Clip Challenge', category: 'calcio', emoji: '⚽' },
  { id: 'football-manager', name: 'Football Manager Speed Run', category: 'calcio', emoji: '🧑‍💼' },
  { id: 'highlight-prediction', name: 'Highlight Reel Prediction', category: 'calcio', emoji: '🎯' },
  { id: 'game-console', name: 'Game Console Evolution', category: 'culture', emoji: '🕹️' },
  { id: 'movie-scout', name: 'Movie Location Scout', category: 'culture', emoji: '🎬' },
  { id: 'brand-logo', name: 'Brand Logo Evolution', category: 'culture', emoji: '🏷️' },
  { id: 'higher-lower', name: 'Higher/Lower', category: 'indipendente', emoji: '📊' },
  { id: 'jeopardy', name: 'Jeopardy Trivia', category: 'indipendente', emoji: '📚' },
];

export const SCORING = {
  guessArtist: { base: 100, imageRevealPenalty: 25 },
  higherLower: { base: 100 },
  jeopardy: { multiplier: (value: number, secondsLeft: number) => value * Math.max(secondsLeft, 0) },
  musicStats: { base: 75 },
};

export const STREAK_MULTIPLIERS: Record<number, number> = {
  1: 1,
  3: 1.5,
  5: 2,
};

export function getStreakMultiplier(streak: number): number {
  const thresholds = Object.keys(STREAK_MULTIPLIERS)
    .map(Number)
    .sort((a, b) => b - a);
  const hit = thresholds.find((t) => streak >= t);
  return hit ? STREAK_MULTIPLIERS[hit] : 1;
}
