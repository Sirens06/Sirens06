import { mediaService } from '@/lib/services/media-service';
import { MOCK_MOVIES } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function GET() {
  try {
    const picked = await mediaService.getRandomMovie();

    const wrongTitles = shuffle(MOCK_MOVIES.filter((m) => m.id !== picked.id))
      .slice(0, 3)
      .map((m) => m.title);

    const options = shuffle([picked.title, ...wrongTitles]);

    return NextResponse.json({
      id: picked.id,
      imageUrl: picked.imageUrl,
      options,
      // title/year/director/location/actor intentionally withheld until validation
    });
  } catch (error) {
    console.error('Failed to fetch movie scout data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
