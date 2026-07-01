import { MockPlayer } from '@/lib/mock-data';

/**
 * Pure scoring engine for the Football Manager Speed Run squad-builder.
 * No I/O, no randomness — safe to unit test and safe to call from both
 * the client component and, later, a server-side validator if needed.
 */

export interface SquadScoreBreakdown {
  totalRating: number;
  teamDiversityBonus: number;
  positionBalanceBonus: number;
  incompleteSquadPenalty: number;
  totalScore: number;
  distinctTeams: number;
  distinctPositions: number;
}

const TEAM_DIVERSITY_BONUS = 15;
const POSITION_BALANCE_BONUS = 20;
const INCOMPLETE_SQUAD_PENALTY = 50;

export function scoreSquad(players: MockPlayer[], squadSize: number): SquadScoreBreakdown {
  const totalRating = players.reduce((sum, p) => sum + p.rating, 0);
  const distinctTeams = new Set(players.map((p) => p.team)).size;
  const distinctPositions = new Set(players.map((p) => p.position)).size;

  const teamDiversityBonus = distinctTeams >= 2 ? TEAM_DIVERSITY_BONUS : 0;
  const positionBalanceBonus = distinctPositions >= 2 ? POSITION_BALANCE_BONUS : 0;
  const incompleteSquadPenalty = players.length < squadSize ? INCOMPLETE_SQUAD_PENALTY : 0;

  const totalScore = Math.max(
    0,
    totalRating + teamDiversityBonus + positionBalanceBonus - incompleteSquadPenalty
  );

  return {
    totalRating,
    teamDiversityBonus,
    positionBalanceBonus,
    incompleteSquadPenalty,
    totalScore,
    distinctTeams,
    distinctPositions,
  };
}
