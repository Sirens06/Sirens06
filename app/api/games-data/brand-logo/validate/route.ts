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

    // Brand logo data is static mock data, so it's looked up directly by id (no live lookup needed).
    const item = mediaService.getBrandLogoById(body.id);
    if (!item) {
      return NextResponse.json({ error: 'Brand logo not found' }, { status: 404 });
    }

    const correct = item.brand === body.guess;

    return NextResponse.json({
      correct,
      brand: item.brand,
      year: item.year,
      order: item.order,
    });
  } catch (error) {
    console.error('Failed to validate brand logo guess:', error);
    return NextResponse.json({ error: 'Failed to validate answer' }, { status: 500 });
  }
}
