import { NextResponse } from 'next/server';
import { getGuestId } from '@/lib/session';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = getGuestId();
  return NextResponse.json(store.getStreak(userId));
}
