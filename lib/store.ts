/**
 * In-memory data store for scores/streaks/cosmetics. This is a V1 stand-in
 * for the Prisma-backed persistence described in prisma/schema.prisma —
 * swap these functions for real DB queries once DATABASE_URL is wired up.
 * State is per-process, so it resets on server restart and isn't shared
 * across serverless instances; fine for local dev, not for production.
 */

export interface ScoreEntry {
  userId: string;
  gameId: string;
  score: number;
  turno: number;
  createdAt: Date;
}

export interface StreakEntry {
  currentStreak: number;
  lastPlayDate: string | null; // yyyy-MM-dd
}

const scores: ScoreEntry[] = [];
const streaks = new Map<string, StreakEntry>();
const ownedCosmetics = new Map<string, Set<string>>();
const cosmeticSpend = new Map<string, number>();

export const store = {
  addScore(entry: ScoreEntry) {
    scores.push(entry);
  },

  getScoresForUser(userId: string) {
    return scores.filter((s) => s.userId === userId);
  },

  getAllScores() {
    return scores;
  },

  archiveAndResetScores() {
    const archived = [...scores];
    scores.length = 0;
    return archived;
  },

  getStreak(userId: string): StreakEntry {
    return streaks.get(userId) ?? { currentStreak: 0, lastPlayDate: null };
  },

  setStreak(userId: string, entry: StreakEntry) {
    streaks.set(userId, entry);
  },

  getOwnedCosmetics(userId: string): Set<string> {
    return ownedCosmetics.get(userId) ?? new Set();
  },

  addOwnedCosmetic(userId: string, cosmeticId: string) {
    const set = ownedCosmetics.get(userId) ?? new Set<string>();
    set.add(cosmeticId);
    ownedCosmetics.set(userId, set);
  },

  getCosmeticSpend(userId: string) {
    return cosmeticSpend.get(userId) ?? 0;
  },

  addCosmeticSpend(userId: string, amount: number) {
    cosmeticSpend.set(userId, this.getCosmeticSpend(userId) + amount);
  },
};
