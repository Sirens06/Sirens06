import { MOCK_TRACKS } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const shuffled = [...MOCK_TRACKS].sort(() => Math.random() - 0.5);
    const [trackA, trackB] = shuffled.slice(0, 2);

    return NextResponse.json({
      trackA: {
        id: trackA.id,
        name: trackA.name,
        artist: trackA.artist,
        imageUrl: trackA.imageUrl,
        releaseYear: trackA.releaseYear,
      },
      trackB: {
        id: trackB.id,
        name: trackB.name,
        artist: trackB.artist,
        imageUrl: trackB.imageUrl,
        releaseYear: trackB.releaseYear,
      },
    });
  } catch (error) {
    console.error('Failed to fetch audio mashup tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
