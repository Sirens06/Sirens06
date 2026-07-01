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

    // Movie data is static mock data, so it's looked up directly by id (no live lookup needed).
    const item = mediaService.getMovieById(body.id);
    if (!item) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    const correct = item.title === body.guess;

    return NextResponse.json({
      correct,
      title: item.title,
      year: item.year,
      director: item.director,
      location: item.location,
      actor: item.actor,
    });
  } catch (error) {
    console.error('Failed to validate movie scout guess:', error);
    return NextResponse.json({ error: 'Failed to validate answer' }, { status: 500 });
  }
}
