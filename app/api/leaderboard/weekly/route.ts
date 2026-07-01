import { NextResponse } from 'next/server';
import { isSameISOWeek, getISOWeek, getISOWeekYear } from 'date-fns';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const week = `${getISOWeekYear(now)}-W${getISOWeek(now)}`;

  const totals = new Map<string, number>();
  for (const entry of store.getAllScores()) {
    if (isSameISOWeek(entry.createdAt, now)) {
      totals.set(entry.userId, (totals.get(entry.userId) ?? 0) + entry.score);
    }
  }

  const leaderboard = [...totals.entries()]
    .map(([userId, totalScore]) => ({ userId, totalScore }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return NextResponse.json({ week, leaderboard });
}
