import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Multi-Game Platform
      </h1>
      <p className="max-w-xl text-white/70">
        Ogni giorno 5 turni di gioco in categorie diverse: musica, calcio, cultura e trivia.
        Mantieni la streak, scala la leaderboard settimanale.
      </p>
      <Link
        href="/dashboard"
        className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
      >
        Inizia a giocare
      </Link>
    </main>
  );
}
