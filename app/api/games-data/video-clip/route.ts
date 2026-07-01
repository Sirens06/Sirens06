import { videoClipService } from '@/lib/services/video-clip-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clip = videoClipService.getRandomClip();
    return NextResponse.json(clip);
  } catch (error) {
    console.error('Failed to fetch video clip challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
