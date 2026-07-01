import Link from 'next/link';
import { GAMES } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Giochi di oggi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.id}`}
            className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition"
          >
            <div className="text-2xl mb-2">{game.emoji}</div>
            <h2 className="font-bold">{game.name}</h2>
            <p className="text-sm text-white/60">{game.category}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
