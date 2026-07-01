import { NextResponse } from 'next/server';
import { getGuestId } from '@/lib/session';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = getGuestId();
  const scores = store.getScoresForUser(userId);
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const streak = store.getStreak(userId);
  const spend = store.getCosmeticSpend(userId);

  return NextResponse.json({
    id: userId,
    totalScore,
    gamesPlayed: scores.length,
    streak: streak.currentStreak,
    currency: Math.max(totalScore - spend, 0),
    cosmetics: [...store.getOwnedCosmetics(userId)],
  });
}
