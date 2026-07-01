import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getGuestId } from '@/lib/session';
import { store } from '@/lib/store';
import { COSMETICS_CATALOG } from '@/lib/cosmetics';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ cosmeticId: z.string() });

export async function POST(request: Request) {
  const userId = getGuestId();
  const { cosmeticId } = bodySchema.parse(await request.json());

  const item = COSMETICS_CATALOG.find((c) => c.id === cosmeticId);
  if (!item) {
    return NextResponse.json({ error: 'Cosmetic not found' }, { status: 404 });
  }

  if (store.getOwnedCosmetics(userId).has(cosmeticId)) {
    return NextResponse.json({ error: 'Already owned' }, { status: 409 });
  }

  const totalScore = store.getScoresForUser(userId).reduce((sum, s) => sum + s.score, 0);
  const currency = totalScore - store.getCosmeticSpend(userId);

  if (currency < item.price) {
    return NextResponse.json({ error: 'Not enough in-game currency' }, { status: 402 });
  }

  store.addCosmeticSpend(userId, item.price);
  store.addOwnedCosmetic(userId, cosmeticId);

  return NextResponse.json({ purchased: item.id, remainingCurrency: currency - item.price });
}
