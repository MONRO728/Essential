import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'indigo',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: 'indigo' | 'amber' | 'moss' | 'brick';
}) {
  const accentClasses: Record<string, string> = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-400/10',
    moss: 'text-moss-500 bg-moss-500/10',
    brick: 'text-brick-500 bg-brick-500/10',
  };

  return (
    <Card className="p-4">
      <div className={cn('mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg', accentClasses[accent])}>
        <Icon size={17} />
      </div>
      <p className="font-display text-2xl font-semibold text-ink dark:text-white">{value}</p>
      <p className="text-xs text-ink-soft dark:text-white/50">{label}</p>
    </Card>
  );
}
