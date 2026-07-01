import { highlightPredictionService } from '@/lib/services/highlight-prediction-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const highlight = highlightPredictionService.getRandomHighlight();
    return NextResponse.json(highlight);
  } catch (error) {
    console.error('Failed to fetch highlight prediction:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
