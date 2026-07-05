import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/session';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await store.getStreak(userId));
}
