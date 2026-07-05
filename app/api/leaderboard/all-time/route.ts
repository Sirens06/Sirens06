import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const scores = await store.getAllScores();

  const totals = new Map<string, number>();
  for (const entry of scores) {
    totals.set(entry.userId, (totals.get(entry.userId) ?? 0) + entry.score);
  }

  const leaderboard = [...totals.entries()]
    .map(([userId, totalScore]) => ({ userId, totalScore }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return NextResponse.json({ leaderboard });
}
