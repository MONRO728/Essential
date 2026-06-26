export function DailyGoalRing({ studied, goal }: { studied: number; goal: number }) {
  const pct = goal > 0 ? Math.min(studied / goal, 1) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" className="text-ink/[0.07] dark:text-white/10" stroke="currentColor" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className="text-indigo-500 transition-all duration-500"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-xl font-semibold text-ink dark:text-white">{studied}</span>
        <span className="text-[11px] text-ink-soft dark:text-white/50">of {goal}</span>
      </div>
    </div>
  );
}
