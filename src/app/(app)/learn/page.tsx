import Link from 'next/link';
import { Layers, ListChecks, Keyboard, Quote, Image as ImageIcon, Bookmark } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { getDashboardStats } from '@/lib/stats';
import { Card } from '@/components/ui/card';

const MODES = [
  {
    href: '/learn/flashcards',
    icon: Layers,
    title: 'Flashcards',
    body: 'Recall the meaning, then grade yourself: Again, Hard, Good, or Easy.',
    accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    href: '/learn/quiz',
    icon: ListChecks,
    title: 'Multiple choice',
    body: 'Choose the correct Uzbek translation from four options.',
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-400/10',
  },
  {
    href: '/learn/typing',
    icon: Keyboard,
    title: 'Typing recall',
    body: 'Read the meaning, type the English word from memory.',
    accent: 'text-moss-500 bg-moss-500/10',
  },
  {
    href: '/learn/context',
    icon: Quote,
    title: 'Context learning',
    body: 'Fill in the blank inside a real example sentence.',
    accent: 'text-brick-500 bg-brick-500/10',
  },
  {
    href: '/learn/images',
    icon: ImageIcon,
    title: 'Image association',
    body: 'Match a picture to the word, for words with images added.',
    accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    href: '/learn/flashcards?bookmarked=true',
    icon: Bookmark,
    title: 'Difficult words',
    body: 'Drill only the words you have bookmarked as tricky.',
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-400/10',
  },
];

export default async function LearnHubPage() {
  const user = await requireUser();
  const stats = await getDashboardStats(user.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Choose how to study</h1>
        <p className="text-sm text-ink-soft dark:text-white/60">
          {stats.dueToday > 0
            ? `${stats.dueToday} word${stats.dueToday === 1 ? '' : 's'} are due for review — any mode below will work through them first.`
            : 'No reviews due — every mode below will introduce new words from the list.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <Link key={mode.href} href={mode.href}>
              <Card className="h-full p-5 transition-shadow hover:shadow-card">
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${mode.accent}`}>
                  <Icon size={17} />
                </div>
                <h2 className="mb-1 font-display text-base font-semibold text-ink dark:text-white">{mode.title}</h2>
                <p className="text-sm text-ink-soft dark:text-white/60">{mode.body}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
