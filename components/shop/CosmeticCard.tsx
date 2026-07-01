'use client';

import { motion } from 'framer-motion';
import type { Cosmetic } from '@/lib/cosmetics';

interface CosmeticCardProps {
  item: Cosmetic & { owned: boolean };
  currency: number;
  onPurchase: (id: string) => void;
  purchasing: boolean;
}

const RARITY_STYLES: Record<Cosmetic['rarity'], string> = {
  common: 'border-white/20',
  rare: 'border-blue-400/60',
  legendary: 'border-amber-400/70',
};

export function CosmeticCard({ item, currency, onPurchase, purchasing }: CosmeticCardProps) {
  const canAfford = currency >= item.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-xl bg-white/5 border ${RARITY_STYLES[item.rarity]} text-center`}
    >
      <div className="text-4xl mb-3">{item.emoji}</div>
      <h3 className="font-bold mb-1">{item.name}</h3>
      <p className="text-xs uppercase tracking-wide text-white/40 mb-3">{item.rarity}</p>

      {item.owned ? (
        <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
          Posseduto
        </span>
      ) : (
        <button
          onClick={() => onPurchase(item.id)}
          disabled={!canAfford || purchasing}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg font-bold hover:shadow-lg disabled:opacity-40"
        >
          🪙 {item.price}
        </button>
      )}
    </motion.div>
  );
}
