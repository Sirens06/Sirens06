import { NextResponse } from 'next/server';
import { resetWeeklyLeaderboard } from '@/lib/jobs/weekly-reset';

export const dynamic = 'force-dynamic';

// Triggered by Vercel Cron every Monday 00:00 (see vercel.json). Vercel sends
// a GET request with `Authorization: Bearer ${CRON_SECRET}` when that env var is set.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rankedCount = await resetWeeklyLeaderboard();
  return NextResponse.json({ rankedCount });
}
