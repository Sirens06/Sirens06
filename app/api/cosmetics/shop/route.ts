import { NextResponse } from 'next/server';
import { getGuestId } from '@/lib/session';
import { store } from '@/lib/store';
import { COSMETICS_CATALOG } from '@/lib/cosmetics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = getGuestId();
  const owned = store.getOwnedCosmetics(userId);

  return NextResponse.json({
    items: COSMETICS_CATALOG.map((item) => ({ ...item, owned: owned.has(item.id) })),
  });
}
