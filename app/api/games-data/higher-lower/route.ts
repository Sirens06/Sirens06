import { higherLowerService } from '@/lib/services/higher-lower-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { current, next } = await higherLowerService.getRandomComparison();

    return NextResponse.json({
      current: {
        id: current.id,
        label: current.label,
        value: current.value,
        unit: current.unit,
        // next value intentionally withheld
      },
      nextId: next.id,
      correctAnswer: next.value > current.value ? 'higher' : 'lower',
    });
  } catch (error) {
    console.error('Failed to fetch higher/lower data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
