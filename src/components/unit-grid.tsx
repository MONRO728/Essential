import Link from 'next/link';
import type { UnitSummary } from '@/types';
import { cn } from '@/lib/utils';

export function UnitGrid({ units }: { units: UnitSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {units.map((unit) => {
        const pct = unit.totalWords > 0 ? Math.round((unit.learnedWords / unit.totalWords) * 100) : 0;
        const complete = unit.totalWords > 0 && unit.masteredWords === unit.totalWords;
        return (
          <Link
            key={unit.number}
            href={`/learn/flashcards?unit=${unit.number}`}
            className="group rounded-card border border-ink/[0.06] bg-surface p-3.5 transition-shadow hover:shadow-card dark:border-white/[0.06] dark:bg-card-dark"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-ink-soft/70 dark:text-white/40">Unit {unit.number}</span>
              {complete && <span className="text-xs">✓</span>}
            </div>
            <p className="mb-2 text-sm font-medium text-ink dark:text-white">{unit.totalWords} words</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-white/10">
              <div
                className={cn('h-full rounded-full bg-indigo-500', complete && 'bg-moss-500')}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-soft/70 dark:text-white/40">{pct}% learned</p>
          </Link>
        );
      })}
    </div>
  );
}
