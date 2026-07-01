interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <span className="flex items-center gap-1 text-orange-400 font-bold">
      🔥 {streak}
    </span>
  );
}
