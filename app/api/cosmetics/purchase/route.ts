import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserId } from '@/lib/session';
import { store } from '@/lib/store';
import { COSMETICS_CATALOG } from '@/lib/cosmetics';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ cosmeticId: z.string() });

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { cosmeticId } = bodySchema.parse(await request.json());

  const item = COSMETICS_CATALOG.find((c) => c.id === cosmeticId);
  if (!item) {
    return NextResponse.json({ error: 'Cosmetic not found' }, { status: 404 });
  }

  const owned = await store.getOwnedCosmetics(userId);
  if (owned.has(cosmeticId)) {
    return NextResponse.json({ error: 'Already owned' }, { status: 409 });
  }

  const scores = await store.getScoresForUser(userId);
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const spend = await store.getCosmeticSpend(userId);
  const currency = totalScore - spend;

  if (currency < item.price) {
    return NextResponse.json({ error: 'Not enough in-game currency' }, { status: 402 });
  }

  await store.addCosmeticSpend(userId, item.price);
  await store.addOwnedCosmetic(userId, cosmeticId);

  return NextResponse.json({ purchased: item.id, remainingCurrency: currency - item.price });
}
