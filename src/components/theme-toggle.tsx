'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-[108px] rounded-lg bg-ink/5 dark:bg-white/5" aria-hidden />;
  }

  return (
    <div className="flex items-center rounded-lg border border-ink/10 bg-paper-dim p-1 dark:border-white/10 dark:bg-white/5">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className={cn(
              'rounded-md p-1.5 transition-colors',
              active
                ? 'bg-surface text-indigo-600 shadow-sm dark:bg-card-dark dark:text-indigo-400'
                : 'text-ink-soft hover:text-ink dark:text-white/50 dark:hover:text-white'
            )}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
