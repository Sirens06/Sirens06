import { NextResponse } from 'next/server';
import { z } from 'zod';
import { format, isYesterday, parseISO } from 'date-fns';
import { getGuestId } from '@/lib/session';
import { store } from '@/lib/store';
import { getStreakMultiplier } from '@/lib/constants';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  score: z.number().int().nonnegative(),
  turno: z.number().int().positive().default(1),
});

export async function POST(request: Request, { params }: { params: { gameId: string } }) {
  const userId = getGuestId();
  const body = bodySchema.parse(await request.json());

  const today = format(new Date(), 'yyyy-MM-dd');
  const streak = store.getStreak(userId);

  let nextStreakCount = 1;
  if (streak.lastPlayDate === today) {
    nextStreakCount = streak.currentStreak;
  } else if (streak.lastPlayDate && isYesterday(parseISO(streak.lastPlayDate))) {
    nextStreakCount = streak.currentStreak + 1;
  }
  store.setStreak(userId, { currentStreak: nextStreakCount, lastPlayDate: today });

  const multiplier = getStreakMultiplier(nextStreakCount);
  const finalScore = Math.round(body.score * multiplier);

  store.addScore({
    userId,
    gameId: params.gameId,
    score: finalScore,
    turno: body.turno,
    createdAt: new Date(),
  });

  const totalScore = store
    .getScoresForUser(userId)
    .reduce((sum, s) => sum + s.score, 0);

  return NextResponse.json({
    baseScore: body.score,
    multiplier,
    finalScore,
    totalScore,
    streak: nextStreakCount,
  });
}
