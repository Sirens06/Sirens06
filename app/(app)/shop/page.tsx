import { ShopGrid } from '@/components/shop/ShopGrid';

export default function ShopPage() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">Cosmetics Shop</h1>
      <p className="text-center text-white/60 mb-8">
        Spendi la valuta guadagnata giocando per sbloccare avatar, emote e streak flame esclusivi.
      </p>
      <ShopGrid />
    </main>
  );
}
