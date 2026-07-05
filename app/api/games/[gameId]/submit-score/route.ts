import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isSameDay, isYesterday } from 'date-fns';
import { getCurrentUserId } from '@/lib/session';
import { store } from '@/lib/store';
import { getStreakMultiplier } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  score: z.number().int().nonnegative(),
  turno: z.number().int().positive().default(1),
});

export async function POST(request: Request, { params }: { params: { gameId: string } }) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = bodySchema.parse(await request.json());

  const now = new Date();
  const streak = await store.getStreak(userId);

  let nextStreakCount = 1;
  if (streak.lastPlayDate && isSameDay(streak.lastPlayDate, now)) {
    nextStreakCount = streak.currentStreak;
  } else if (streak.lastPlayDate && isYesterday(streak.lastPlayDate)) {
    nextStreakCount = streak.currentStreak + 1;
  }
  await store.setStreak(userId, { currentStreak: nextStreakCount, lastPlayDate: now });

  const multiplier = getStreakMultiplier(nextStreakCount);
  const finalScore = Math.round(body.score * multiplier);

  await store.addScore({
    userId,
    gameId: params.gameId,
    score: finalScore,
    turno: body.turno,
  });

  const scores = await store.getScoresForUser(userId);
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);

  return NextResponse.json({
    baseScore: body.score,
    multiplier,
    finalScore,
    totalScore,
    streak: nextStreakCount,
  });
}
