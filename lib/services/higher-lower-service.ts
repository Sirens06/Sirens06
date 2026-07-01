import axios from 'axios';
import { spotifyService } from './spotify-service';
import { MOCK_YOUTUBE_VIDEOS } from '@/lib/mock-data';

export interface DataPoint {
  id: string;
  label: string;
  value: number;
  category: 'spotify' | 'youtube';
  unit: string;
}

class HigherLowerService {
  async getSpotifyChartData(): Promise<DataPoint[]> {
    const tracks = await spotifyService.getPlaylistTracks('37i9dQZEVXbNG2KDcFcKOF'); // Top 50 Global

    return tracks.map((track: any) => ({
      id: track.id,
      label: `${track.name} - ${track.artists[0].name}`,
      value: track.popularity, // 0-100
      category: 'spotify' as const,
      unit: 'popularity score',
    }));
  }

  async getYouTubeTrendingData(): Promise<DataPoint[]> {
    if (!process.env.RAPIDAPI_KEY) {
      return MOCK_YOUTUBE_VIDEOS.map((video) => ({
        id: video.id,
        label: video.title,
        value: video.viewCount,
        category: 'youtube' as const,
        unit: 'views',
      }));
    }

    try {
      const response = await axios.get('https://youtube-api1.p.rapidapi.com/trending', {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'youtube-api1.p.rapidapi.com',
        },
      });

      return response.data.videos.map((video: any) => ({
        id: video.id,
        label: video.title,
        value: parseInt(video.viewCount, 10),
        category: 'youtube' as const,
        unit: 'views',
      }));
    } catch (error) {
      console.warn('RapidAPI unavailable, using mock YouTube data:', (error as Error).message);
      return MOCK_YOUTUBE_VIDEOS.map((video) => ({
        id: video.id,
        label: video.title,
        value: video.viewCount,
        category: 'youtube' as const,
        unit: 'views',
      }));
    }
  }

  async getRandomComparison(): Promise<{ current: DataPoint; next: DataPoint }> {
    const results = await Promise.allSettled([
      this.getSpotifyChartData(),
      this.getYouTubeTrendingData(),
    ]);

    const flatData = results
      .filter((r): r is PromiseFulfilledResult<DataPoint[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    if (flatData.length < 2) {
      throw new Error('Not enough data points to build a comparison');
    }

    const current = flatData[Math.floor(Math.random() * flatData.length)];
    let next = flatData[Math.floor(Math.random() * flatData.length)];

    while (next.id === current.id) {
      next = flatData[Math.floor(Math.random() * flatData.length)];
    }

    return { current, next };
  }
}

export const higherLowerService = new HigherLowerService();
