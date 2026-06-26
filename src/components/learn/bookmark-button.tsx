'use client';

import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BookmarkButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Remove from difficult words' : 'Mark as difficult'}
      className={cn(
        'rounded-lg p-2 transition-colors',
        active
          ? 'text-amber-500'
          : 'text-ink-soft/50 hover:text-amber-500 dark:text-white/30 dark:hover:text-amber-400'
      )}
    >
      <Bookmark size={18} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
