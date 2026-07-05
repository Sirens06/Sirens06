import { prisma } from '@/lib/db';
import { getISOWeek, getISOWeekYear, startOfISOWeek } from 'date-fns';

// Snapshots the week that just ended into the Leaderboard table (rank +
// total per user), so historical weekly results survive even though the
// live leaderboard route always aggregates the current week from GameScore.
export async function resetWeeklyLeaderboard(referenceDate = new Date()) {
  const weekNumber = getISOWeekYear(referenceDate) * 100 + getISOWeek(referenceDate);
  const weekStart = startOfISOWeek(referenceDate);

  const totals = await prisma.gameScore.groupBy({
    by: ['userId'],
    where: { createdAt: { gte: weekStart } },
    _sum: { score: true },
  });

  const ranked = totals
    .map((t) => ({ userId: t.userId, totalScore: t._sum.score ?? 0 }))
    .sort((a, b) => b.totalScore - a.totalScore);

  await Promise.all(
    ranked.map((entry, idx) =>
      prisma.leaderboard.upsert({
        where: { userId_weekNumber: { userId: entry.userId, weekNumber } },
        update: { totalScore: entry.totalScore, rank: idx + 1 },
        create: { userId: entry.userId, weekNumber, totalScore: entry.totalScore, rank: idx + 1 },
      })
    )
  );

  return ranked.length;
}
