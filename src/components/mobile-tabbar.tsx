'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, GraduationCap, Bookmark, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard', label: 'Home', icon: LayoutGrid },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/bookmarks', label: 'Saved', icon: Bookmark },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/[0.06] bg-paper/95 backdrop-blur sm:hidden dark:border-white/[0.06] dark:bg-bg-dark/95">
      <div className="flex items-center justify-around px-2 py-1.5" style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[11px] font-medium',
                active ? 'text-indigo-600 dark:text-indigo-400' : 'text-ink-soft/70 dark:text-white/50'
              )}
            >
              <Icon size={20} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
