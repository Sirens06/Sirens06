import { spotifyService } from '@/lib/services/spotify-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const track = await spotifyService.getRandomTrack();
    const preview = spotifyService.getPreviewClip(track);

    return NextResponse.json({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a) => a.name),
      preview_url: preview,
      image_url: track.album.images[0]?.url ?? null,
      popularity: track.popularity,
    });
  } catch (error) {
    console.error('Failed to fetch Spotify track:', error);
    return NextResponse.json({ error: 'Failed to fetch track' }, { status: 500 });
  }
}
