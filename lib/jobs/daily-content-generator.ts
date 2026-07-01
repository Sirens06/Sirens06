import { GAMES } from '@/lib/constants';

// Returns the day's featured game rotation (5 turni/giorno per the spec).
// In production this would also warm Redis caches by calling each game's
// service (spotifyService, sportsService, etc.) ahead of traffic.
export function getDailyFeaturedGames(date = new Date()): string[] {
  const rotation = GAMES.map((g) => g.id);
  const start = date.getDay() % rotation.length;
  const ordered = [...rotation.slice(start), ...rotation.slice(0, start)];
  return ordered.slice(0, 5);
}
