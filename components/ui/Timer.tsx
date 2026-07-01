interface TimerProps {
  seconds: number;
  warnAt?: number;
}

export function Timer({ seconds, warnAt = 5 }: TimerProps) {
  return (
    <div className={`text-3xl font-bold ${seconds <= warnAt ? 'text-red-500' : 'text-green-500'}`}>
      {seconds}s
    </div>
  );
}
