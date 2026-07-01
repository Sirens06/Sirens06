export interface GameDefinition {
  id: string;
  name: string;
  category: 'musica' | 'calcio' | 'culture' | 'indipendente';
  emoji: string;
}

export const GAMES: GameDefinition[] = [
  { id: 'guess-artist', name: 'Indovina Canzone', category: 'musica', emoji: '🎵' },
  { id: 'higher-lower', name: 'Higher/Lower', category: 'indipendente', emoji: '📊' },
  { id: 'jeopardy', name: 'Jeopardy Trivia', category: 'indipendente', emoji: '📚' },
  { id: 'video-clip', name: 'Video Clip Challenge', category: 'calcio', emoji: '⚽' },
  { id: 'movie-scout', name: 'Movie Location Scout', category: 'culture', emoji: '🎬' },
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
