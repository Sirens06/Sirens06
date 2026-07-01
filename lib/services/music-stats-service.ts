import { MOCK_TRACKS } from '@/lib/mock-data';

export interface MusicStatsRound {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  popularity: number;
  correctDirection: 'up' | 'down';
}

// Simple, dependency-free string hash (djb2-ish). No crypto needed — we just
// need a stable, evenly-distributed number per (trackId, date) pair so the
// same track resolves the same way all day, mirroring how a real daily chart
// job would behave.
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

class MusicStatsService {
  // `dateSeed` defaults to today (YYYY-MM-DD) so the outcome is deterministic
  // for a given track on a given day, but still varies day to day.
  getRandomRound(dateSeed: string = new Date().toISOString().slice(0, 10)): MusicStatsRound {
    const track = MOCK_TRACKS[Math.floor(Math.random() * MOCK_TRACKS.length)];
    const hash = hashString(`${track.id}-${dateSeed}`);
    const correctDirection: 'up' | 'down' = hash % 2 === 0 ? 'up' : 'down';

    return {
      id: track.id,
      name: track.name,
      artist: track.artist,
      imageUrl: track.imageUrl,
      popularity: track.popularity,
      correctDirection,
    };
  }
}

export const musicStatsService = new MusicStatsService();
