import axios from 'axios';

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

class SportsService {
  // teamId defaults to Juventus as an example source of Serie A matches
  async getLatestMatches(teamId = '133602'): Promise<Match[]> {
    try {
      const response = await axios.get(`${SPORTS_DB_URL}/eventslast.php`, {
        params: { id: teamId },
      });

      return (response.data.results ?? []).map((event: any) => ({
        id: event.idEvent,
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        homeScore: parseInt(event.intHomeScore, 10),
        awayScore: parseInt(event.intAwayScore, 10),
        date: event.dateEvent,
        league: event.strLeague,
      }));
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  async generateSportTrivia(matchId: string): Promise<SportTriviaQuestion[]> {
    const response = await axios.get(`${SPORTS_DB_URL}/lookupevent.php`, {
      params: { id: matchId },
    });

    const match = response.data.results[0];

    return [
      {
        question: `${match.dateEvent} - ${match.strHomeTeam} vs ${match.strAwayTeam}: chi ha vinto?`,
        type: 'multiple_choice',
        options: [match.strHomeTeam, match.strAwayTeam, 'Pareggio'],
        answer:
          match.intHomeScore === match.intAwayScore
            ? 'Pareggio'
            : match.intHomeScore > match.intAwayScore
              ? match.strHomeTeam
              : match.strAwayTeam,
        difficulty: 'medium',
      },
      {
        question: `Risultato finale di ${match.strHomeTeam} - ${match.strAwayTeam}?`,
        type: 'text_input',
        answer: `${match.intHomeScore}-${match.intAwayScore}`,
        difficulty: 'easy',
      },
    ];
  }

  async getLeagueStandings(leagueId: string) {
    const response = await axios.get(`${SPORTS_DB_URL}/lookuptable.php`, {
      params: { l: leagueId },
    });

    return response.data.table ?? [];
  }
}

export const sportsService = new SportsService();
