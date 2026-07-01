import { GAMES } from '@/lib/constants';
import { notFound } from 'next/navigation';

import GuessTheArtist from '@/components/games/GuessTheArtist';
import EmojiGuess from '@/components/games/music/EmojiGuess';
import AudioMashup from '@/components/games/music/AudioMashup';
import MusicStats from '@/components/games/music/MusicStats';
import VideoClipChallenge from '@/components/games/sports/VideoClipChallenge';
import FootballManager from '@/components/games/sports/FootballManager';
import HighlightPrediction from '@/components/games/sports/HighlightPrediction';
import GameConsoleEvolution from '@/components/games/culture/GameConsoleEvolution';
import MovieScout from '@/components/games/culture/MovieScout';
import BrandLogoEvolution from '@/components/games/culture/BrandLogoEvolution';
import HigherLower from '@/components/games/independent/HigherLower';
import Jeopardy from '@/components/games/independent/Jeopardy';

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  'guess-artist': GuessTheArtist,
  'emoji-guess': EmojiGuess,
  'audio-mashup': AudioMashup,
  'music-stats': MusicStats,
  'video-clip': VideoClipChallenge,
  'football-manager': FootballManager,
  'highlight-prediction': HighlightPrediction,
  'game-console': GameConsoleEvolution,
  'movie-scout': MovieScout,
  'brand-logo': BrandLogoEvolution,
  'higher-lower': HigherLower,
  jeopardy: Jeopardy,
};

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default function GamePage({ params }: { params: { gameId: string } }) {
  const game = GAMES.find((g) => g.id === params.gameId);
  if (!game) notFound();

  const GameComponent = GAME_COMPONENTS[game.id];

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold text-center mb-8">{game.name}</h1>
      {GameComponent ? (
        <GameComponent />
      ) : (
        <p className="text-center text-white/60">Questo gioco arriverà presto.</p>
      )}
    </main>
  );
}
