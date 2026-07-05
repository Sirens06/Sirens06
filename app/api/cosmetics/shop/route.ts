import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/session';
import { store } from '@/lib/store';
import { COSMETICS_CATALOG } from '@/lib/cosmetics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const owned = await store.getOwnedCosmetics(userId);

  return NextResponse.json({
    items: COSMETICS_CATALOG.map((item) => ({ ...item, owned: owned.has(item.id) })),
  });
}
