'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CosmeticCard } from './CosmeticCard';
import { useGameStore } from '@/store/gameStore';
import type { Cosmetic } from '@/lib/cosmetics';

type ShopItem = Cosmetic & { owned: boolean };

export function ShopGrid() {
  const [items, setItems] = useState<ShopItem[] | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const { profile, refreshProfile } = useGameStore();

  useEffect(() => {
    refreshProfile();
    loadShop();
  }, [refreshProfile]);

  const loadShop = async () => {
    const response = await axios.get('/api/cosmetics/shop');
    setItems(response.data.items);
  };

  const handlePurchase = async (cosmeticId: string) => {
    setPurchasingId(cosmeticId);
    try {
      await axios.post('/api/cosmetics/purchase', { cosmeticId });
      await Promise.all([loadShop(), refreshProfile()]);
    } catch (error) {
      console.warn('Purchase failed:', error);
    } finally {
      setPurchasingId(null);
    }
  };

  if (!items) return <div className="text-center text-white/70 py-8">Loading...</div>;

  return (
    <div>
      <p className="text-center text-white/60 mb-6">
        🪙 Valuta disponibile: <span className="font-bold text-white">{profile?.currency ?? 0}</span>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <CosmeticCard
            key={item.id}
            item={item}
            currency={profile?.currency ?? 0}
            onPurchase={handlePurchase}
            purchasing={purchasingId === item.id}
          />
        ))}
      </div>
    </div>
  );
}
