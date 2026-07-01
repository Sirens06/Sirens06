import { MOCK_GOALS, MockGoal, placeholderImage } from '@/lib/mock-data';

export interface VideoClipQuestion {
  id: string;
  homeTeam: string;
  awayTeam: string;
  minute: number;
  clipImageUrl: string;
  competition: string;
  season: string;
  options: string[];
  correctAnswer: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

class VideoClipService {
  getRandomClip(): VideoClipQuestion {
    const goal = MOCK_GOALS[Math.floor(Math.random() * MOCK_GOALS.length)];
    const wrongScorers = Array.from(
      new Set(
        MOCK_GOALS.filter((g: MockGoal) => g.id !== goal.id && g.scorer !== goal.scorer).map(
          (g: MockGoal) => g.scorer
        )
      )
    );
    const wrongOptions = shuffle(wrongScorers).slice(0, Math.min(3, wrongScorers.length));
    const options = shuffle([goal.scorer, ...wrongOptions]);

    return {
      id: goal.id,
      homeTeam: goal.homeTeam,
      awayTeam: goal.awayTeam,
      minute: goal.minute,
      clipImageUrl: placeholderImage(`${goal.homeTeam} vs ${goal.awayTeam}`),
      competition: goal.competition,
      season: goal.season,
      options,
      correctAnswer: goal.scorer,
    };
  }
}

export const videoClipService = new VideoClipService();
