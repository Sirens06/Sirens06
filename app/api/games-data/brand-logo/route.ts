import { mediaService } from '@/lib/services/media-service';
import { MOCK_BRAND_LOGOS } from '@/lib/mock-data';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function GET() {
  try {
    const picked = await mediaService.getRandomBrandLogo();

    const otherBrands = Array.from(
      new Set(MOCK_BRAND_LOGOS.filter((b) => b.brand !== picked.brand).map((b) => b.brand))
    );
    const wrongBrands = shuffle(otherBrands).slice(0, 3);

    const options = shuffle([picked.brand, ...wrongBrands]);

    return NextResponse.json({
      id: picked.id,
      imageUrl: picked.imageUrl,
      logoDescription: picked.logoDescription,
      options,
      // brand/year/order intentionally withheld until validation
    });
  } catch (error) {
    console.error('Failed to fetch brand logo data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
