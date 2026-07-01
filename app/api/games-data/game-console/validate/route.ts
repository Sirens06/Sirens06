import { mediaService } from '@/lib/services/media-service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validateSchema = z.object({
  id: z.string(),
  guess: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = validateSchema.parse(await request.json());

    // Console data is static mock data, so it's looked up directly by id (no live lookup needed).
    const item = mediaService.getConsoleById(body.id);
    if (!item) {
      return NextResponse.json({ error: 'Console not found' }, { status: 404 });
    }

    const correct = item.name === body.guess;

    return NextResponse.json({
      correct,
      name: item.name,
      year: item.year,
      generation: item.generation,
      unitsSoldMillions: item.unitsSoldMillions,
    });
  } catch (error) {
    console.error('Failed to validate console guess:', error);
    return NextResponse.json({ error: 'Failed to validate answer' }, { status: 500 });
  }
}
