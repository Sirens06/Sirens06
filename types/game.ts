export type GameCategory = 'musica' | 'calcio' | 'culture' | 'indipendente';

export interface GameScoreSubmission {
  gameId: string;
  score: number;
  turno: number;
}
