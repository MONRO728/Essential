'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Flame, LogOut, ShieldCheck, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/learn', label: 'Learn' },
  { href: '/bookmarks', label: 'Difficult words' },
  { href: '/progress', label: 'Progress' },
];

export function Navbar({ streak }: { streak: number }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/90 backdrop-blur dark:border-white/[0.06] dark:bg-bg-dark/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-white">
          <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
          Lexika
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-ink-soft hover:text-ink dark:text-white/60 dark:hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname?.startsWith('/admin')
                  ? 'text-amber-500'
                  : 'text-ink-soft hover:text-ink dark:text-white/60 dark:hover:text-white'
              )}
            >
              <ShieldCheck size={15} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg bg-amber-400/15 px-2.5 py-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 sm:flex">
            <Flame size={15} />
            {streak}
          </div>
          <ThemeToggle />
          <Link
            href="/settings"
            className="hidden text-sm font-medium text-ink-soft hover:text-ink dark:text-white/60 dark:hover:text-white sm:block"
          >
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-lg p-2 text-ink-soft hover:bg-ink/5 hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
