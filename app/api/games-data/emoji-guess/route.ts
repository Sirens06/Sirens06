import { MOCK_TRACKS } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const track = MOCK_TRACKS[Math.floor(Math.random() * MOCK_TRACKS.length)];

    return NextResponse.json({
      id: track.id,
      emojiHint: track.emojiHint,
      name: track.name,
      artist: track.artist,
    });
  } catch (error) {
    console.error('Failed to fetch emoji guess track:', error);
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 });
  }
}
