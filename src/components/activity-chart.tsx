import type { DayActivity } from '@/lib/stats';
import { cn } from '@/lib/utils';

export function ActivityChart({ days }: { days: DayActivity[] }) {
  const max = Math.max(...days.map((d) => d.wordsReviewed), 1);

  return (
    <div className="flex h-32 items-end gap-1.5">
      {days.map((d) => {
        const height = Math.max((d.wordsReviewed / max) * 100, d.wordsReviewed > 0 ? 6 : 2);
        const dateObj = new Date(d.date + 'T00:00:00Z');
        const label = dateObj.toLocaleDateString(undefined, { weekday: 'narrow' });
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-24 w-full items-end">
              <div
                title={`${d.wordsReviewed} reviews on ${d.date}`}
                className={cn(
                  'w-full rounded-sm transition-all',
                  d.wordsReviewed > 0 ? 'bg-indigo-500' : 'bg-ink/[0.08] dark:bg-white/10'
                )}
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-soft/60 dark:text-white/30">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
