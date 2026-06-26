import Link from 'next/link';
import { requireAdmin } from '@/lib/session';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/words', label: 'Words' },
  { href: '/admin/import', label: 'Import CSV' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Admin</h1>
        <p className="text-sm text-ink-soft dark:text-white/60">Manage the vocabulary catalog.</p>
      </div>
      <div className="mb-6 flex gap-1 border-b border-ink/[0.06] dark:border-white/[0.06]">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink dark:text-white/60 dark:hover:text-white"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
