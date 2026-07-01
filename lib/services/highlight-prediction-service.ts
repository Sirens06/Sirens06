import { MOCK_GOALS, MockGoal, placeholderImage } from '@/lib/mock-data';

export interface HighlightPredictionQuestion {
  id: string;
  homeTeam: string;
  awayTeam: string;
  minute: number;
  partialScore: string;
  clipImageUrl: string;
  options: string[];
  correctAnswer: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

// Builds a handful of plausible final scorelines around the real result
// (e.g. +/-1 goal on either side) so the correct answer isn't obviously
// the "odd one out".
function scorelineOptions(goal: MockGoal): string[] {
  const correct = `${goal.homeScore}-${goal.awayScore}`;
  const candidates = new Set<string>([correct]);

  const deltas: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ];

  for (const [dh, da] of deltas) {
    if (candidates.size >= 4) break;
    const h = goal.homeScore + dh;
    const a = goal.awayScore + da;
    if (h < 0 || a < 0) continue;
    candidates.add(`${h}-${a}`);
  }

  return shuffle(Array.from(candidates));
}

class HighlightPredictionService {
  getRandomHighlight(): HighlightPredictionQuestion {
    const goal = MOCK_GOALS[Math.floor(Math.random() * MOCK_GOALS.length)];
    // Assume only the eventual leader's first goal has happened so far —
    // a plausible "in progress" snapshot that never exceeds the final score.
    const partialScore = goal.homeScore >= goal.awayScore ? '1-0' : '0-1';

    return {
      id: goal.id,
      homeTeam: goal.homeTeam,
      awayTeam: goal.awayTeam,
      minute: goal.minute,
      partialScore,
      clipImageUrl: placeholderImage(`${goal.homeTeam} vs ${goal.awayTeam}`),
      options: scorelineOptions(goal),
      correctAnswer: `${goal.homeScore}-${goal.awayScore}`,
    };
  }
}

export const highlightPredictionService = new HighlightPredictionService();
