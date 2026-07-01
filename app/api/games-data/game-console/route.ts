import { mediaService } from '@/lib/services/media-service';
import { MOCK_CONSOLES } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function GET() {
  try {
    const picked = await mediaService.getRandomConsole();

    const wrongNames = shuffle(MOCK_CONSOLES.filter((c) => c.id !== picked.id))
      .slice(0, 3)
      .map((c) => c.name);

    const options = shuffle([picked.name, ...wrongNames]);

    return NextResponse.json({
      id: picked.id,
      imageUrl: picked.imageUrl,
      options,
      // name/year/generation/unitsSoldMillions intentionally withheld until validation
    });
  } catch (error) {
    console.error('Failed to fetch console data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
