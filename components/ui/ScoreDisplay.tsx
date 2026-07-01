interface ScoreDisplayProps {
  score: number;
  label?: string;
}

export function ScoreDisplay({ score, label = 'Score' }: ScoreDisplayProps) {
  return <h2 className="text-2xl font-bold text-white">{label}: {score}</h2>;
}
