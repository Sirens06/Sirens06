import { MOCK_PLAYERS } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ players: MOCK_PLAYERS });
  } catch (error) {
    console.error('Failed to fetch football manager player pool:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
