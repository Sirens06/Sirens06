import { sportsService } from '@/lib/services/sports-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId') ?? undefined;

    const matches = await sportsService.getLatestMatches(teamId);
    if (matches.length === 0) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    const questions = await sportsService.generateSportTrivia(matches[0].id);
    return NextResponse.json({ match: matches[0], questions });
  } catch (error) {
    console.error('Failed to fetch sports trivia:', error);
    return NextResponse.json({ error: 'Failed to fetch trivia' }, { status: 500 });
  }
}
