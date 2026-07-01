import GuessTheArtist from '@/components/games/GuessTheArtist';
import { GAMES } from '@/lib/constants';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const game = GAMES.find((g) => g.id === params.gameId);
  if (!game) notFound();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold text-center mb-8">{game.name}</h1>
      {game.id === 'guess-artist' ? (
        <GuessTheArtist />
      ) : (
        <p className="text-center text-white/60">Questo gioco arriverà presto.</p>
      )}
    </main>
  );
}
