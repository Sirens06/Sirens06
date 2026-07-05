import { prisma } from '@/lib/db';

export interface StreakEntry {
  currentStreak: number;
  lastPlayDate: Date | null;
}

export const store = {
  async addScore(entry: { userId: string; gameId: string; score: number; turno: number }) {
    return prisma.gameScore.create({ data: entry });
  },

  async getScoresForUser(userId: string) {
    return prisma.gameScore.findMany({ where: { userId } });
  },

  async getScoresSince(date: Date) {
    return prisma.gameScore.findMany({ where: { createdAt: { gte: date } } });
  },

  async getAllScores() {
    return prisma.gameScore.findMany();
  },

  async getStreak(userId: string): Promise<StreakEntry> {
    const streak = await prisma.streak.findUnique({ where: { userId } });
    return streak
      ? { currentStreak: streak.currentStreak, lastPlayDate: streak.lastPlayDate }
      : { currentStreak: 0, lastPlayDate: null };
  },

  async setStreak(userId: string, entry: StreakEntry) {
    return prisma.streak.upsert({
      where: { userId },
      update: { currentStreak: entry.currentStreak, lastPlayDate: entry.lastPlayDate },
      create: { userId, currentStreak: entry.currentStreak, lastPlayDate: entry.lastPlayDate },
    });
  },

  async getOwnedCosmetics(userId: string): Promise<Set<string>> {
    const rows = await prisma.cosmetic.findMany({ where: { userId, owned: true } });
    return new Set(rows.map((r) => r.cosmeticId));
  },

  async addOwnedCosmetic(userId: string, cosmeticId: string) {
    return prisma.cosmetic.upsert({
      where: { userId_cosmeticId: { userId, cosmeticId } },
      update: { owned: true },
      create: { userId, cosmeticId, owned: true },
    });
  },

  async getCosmeticSpend(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user?.cosmeticSpend ?? 0;
  },

  async addCosmeticSpend(userId: string, amount: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { cosmeticSpend: { increment: amount } },
    });
  },
};
