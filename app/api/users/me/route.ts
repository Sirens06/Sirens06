import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/session';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [scores, streak, spend, cosmetics] = await Promise.all([
    store.getScoresForUser(userId),
    store.getStreak(userId),
    store.getCosmeticSpend(userId),
    store.getOwnedCosmetics(userId),
  ]);
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  return NextResponse.json({
    id: userId,
    totalScore,
    gamesPlayed: scores.length,
    streak: streak.currentStreak,
    currency: Math.max(totalScore - spend, 0),
    cosmetics: [...cosmetics],
  });
}
