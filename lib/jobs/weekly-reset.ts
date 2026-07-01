import { store } from '@/lib/store';

// Archives the current in-memory scores and clears them so a new
// leaderboard week starts at zero. In production (Prisma-backed store) this
// would snapshot GameScore rows into a Leaderboard row per user first.
export function resetWeeklyLeaderboard() {
  return store.archiveAndResetScores();
}
