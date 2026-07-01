import { musicStatsService } from '@/lib/services/music-stats-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const round = musicStatsService.getRandomRound();
    return NextResponse.json(round);
  } catch (error) {
    console.error('Failed to fetch music stats round:', error);
    return NextResponse.json({ error: 'Failed to fetch round' }, { status: 500 });
  }
}
