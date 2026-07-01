import axios from 'axios';
import { MOCK_GOALS, MockGoal } from '@/lib/mock-data';

const SPORTS_DB_URL = 'https://www.thesportsdb.com/api/v1/json/1';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  league: string;
}

export interface SportTriviaQuestion {
  question: string;
  type: 'multiple_choice' | 'text_input';
  options?: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

function mockToMatch(goal: MockGoal): Match {
  return {
    id: goal.id,
    homeTeam: goal.homeTeam,
    awayTeam: goal.awayTeam,
    homeScore: goal.homeScore,
    awayScore: goal.awayScore,
    date: goal.season,
    league: goal.competition,
  };
}

class SportsService {
  // teamId defaults to Juventus as an example source of Serie A matches
  async getLatestMatches(teamId = '133602'): Promise<Match[]> {
    try {
      const response = await axios.get(`${SPORTS_DB_URL}/eventslast.php`, {
        params: { id: teamId },
      });

      const matches = (response.data.results ?? []).map((event: any) => ({
        id: event.idEvent,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        homeScore: parseInt(event.intHomeScore, 10),
        awayScore: parseInt(event.intAwayScore, 10),
        date: event.dateEvent,
        league: event.strLeague,
      }));

      return matches.length > 0 ? matches : MOCK_GOALS.map(mockToMatch);
    } catch (error) {
      console.warn('TheSportsDB unavailable, using mock matches:', (error as Error).message);
      return MOCK_GOALS.map(mockToMatch);
    }
  }

  async generateSportTrivia(matchId: string): Promise<SportTriviaQuestion[]> {
    const mockGoal = MOCK_GOALS.find((g) => g.id === matchId);
    if (mockGoal) return this.triviaFromMatch(mockToMatch(mockGoal));

    try {
      const response = await axios.get(`${SPORTS_DB_URL}/lookupevent.php`, {
        params: { id: matchId },
      });
      const match = response.data.results?.[0];
      if (!match) throw new Error('Match not found');

      return this.triviaFromMatch({
        id: match.idEvent,
        homeTeam: match.strHomeTeam,
        awayTeam: match.strAwayTeam,
        homeScore: parseInt(match.intHomeScore, 10),
        awayScore: parseInt(match.intAwayScore, 10),
        date: match.dateEvent,
        league: match.strLeague,
      });
    } catch (error) {
      console.warn('TheSportsDB unavailable, using mock trivia:', (error as Error).message);
      return this.triviaFromMatch(mockToMatch(MOCK_GOALS[0]));
    }
  }

  private triviaFromMatch(match: Match): SportTriviaQuestion[] {
    return [
      {
        question: `${match.date} - ${match.homeTeam} vs ${match.awayTeam}: chi ha vinto?`,
        type: 'multiple_choice',
        options: [match.homeTeam, match.awayTeam, 'Pareggio'],
        answer:
          match.homeScore === match.awayScore
            ? 'Pareggio'
            : match.homeScore > match.awayScore
              ? match.homeTeam
              : match.awayTeam,
        difficulty: 'medium',
      },
      {
        question: `Risultato finale di ${match.homeTeam} - ${match.awayTeam}?`,
        type: 'text_input',
        answer: `${match.homeScore}-${match.awayScore}`,
        difficulty: 'easy',
      },
    ];
  }

  async getLeagueStandings(leagueId: string) {
    try {
      const response = await axios.get(`${SPORTS_DB_URL}/lookuptable.php`, {
        params: { l: leagueId },
      });
      return response.data.table ?? [];
    } catch (error) {
      console.warn('TheSportsDB unavailable for standings:', (error as Error).message);
      return [];
    }
  }
}

export const sportsService = new SportsService();
