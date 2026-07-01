import { NextResponse } from 'next/server';
import { getDailyFeaturedGames } from '@/lib/jobs/daily-content-generator';

export const dynamic = 'force-dynamic';

// Triggered by Vercel Cron (see vercel.json) once a day. Vercel sends a GET
// request with `Authorization: Bearer ${CRON_SECRET}` when that env var is set.
export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const featured = getDailyFeaturedGames();
  return NextResponse.json({ featured });
}
