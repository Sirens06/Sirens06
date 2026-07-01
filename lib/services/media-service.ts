import axios from 'axios';
import {
  MOCK_CONSOLES,
  MockConsole,
  MOCK_MOVIES,
  MockMovie,
  MOCK_BRAND_LOGOS,
  MockBrandLogo,
  placeholderImage,
} from '@/lib/mock-data';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

class MediaService {
  private tmdbApiKey = process.env.TMDB_API_KEY ?? '';

  private get hasTmdbCredentials() {
    return Boolean(this.tmdbApiKey);
  }

  // No reliable free live API exists for console generation/units-sold trivia,
  // so console data is always served from the curated mock catalogue.
  async getRandomConsole(): Promise<MockConsole> {
    return randomItem(MOCK_CONSOLES);
  }

  getConsoleById(id: string): MockConsole | null {
    return MOCK_CONSOLES.find((c) => c.id === id) ?? null;
  }

  // Falls back to curated mock movie stills if TMDB credentials are missing or the API is unreachable.
  async getRandomMovie(): Promise<MockMovie> {
    if (!this.hasTmdbCredentials) return randomItem(MOCK_MOVIES);

    try {
      const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
        params: { api_key: this.tmdbApiKey },
        timeout: 5000,
      });
      const results: any[] = response.data.results;
      if (!results || results.length === 0) throw new Error('No TMDB results returned');

      const movie: any = randomItem(results);
      return {
        id: String(movie.id),
        title: movie.title,
        year: Number((movie.release_date ?? '0000').slice(0, 4)) || 0,
        director: 'Sconosciuto',
        location: 'Sconosciuta',
        actor: 'Sconosciuto',
        imageUrl: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          : placeholderImage(movie.title),
      };
    } catch (error) {
      console.warn('TMDB unavailable, using mock movie:', (error as Error).message);
      return randomItem(MOCK_MOVIES);
    }
  }

  getMovieById(id: string): MockMovie | null {
    return MOCK_MOVIES.find((m) => m.id === id) ?? null;
  }

  // Wikipedia is only used as a sanity/enrichment ping here; the game always plays off the
  // curated mock logos since chronological "order" data isn't reliably available live.
  async getRandomBrandLogo(): Promise<MockBrandLogo> {
    const pick = randomItem(MOCK_BRAND_LOGOS);

    try {
      await axios.get(WIKIPEDIA_API_URL, {
        params: {
          action: 'query',
          list: 'search',
          srsearch: `${pick.brand} logo history`,
          format: 'json',
          origin: '*',
        },
        timeout: 5000,
      });
      return pick;
    } catch (error) {
      console.warn('Wikipedia unavailable, using mock brand logo:', (error as Error).message);
      return pick;
    }
  }

  getBrandLogoById(id: string): MockBrandLogo | null {
    return MOCK_BRAND_LOGOS.find((b) => b.id === id) ?? null;
  }

  // Chronological logo evolution timeline for a given brand.
  getBrandEvolution(brand: string): MockBrandLogo[] {
    return MOCK_BRAND_LOGOS.filter((b) => b.brand === brand).sort((a, b) => a.order - b.order);
  }
}

export const mediaService = new MediaService();
