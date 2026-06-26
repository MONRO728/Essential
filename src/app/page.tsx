import Link from 'next/link';
import { BookOpen, Layers, ListChecks, Keyboard, Quote, Bookmark } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { HeroFlashcard } from '@/components/hero-flashcard';
import { Button } from '@/components/ui/button';

async function getSampleWord() {
  try {
    const count = await prisma.word.count();
    if (count === 0) return null;
    const word = await prisma.word.findFirst({
      skip: Math.floor(Math.random() * count),
      include: { unit: true },
    });
    return word;
  } catch {
    return null;
  }
}

const FEATURES = [
  { icon: Layers, title: 'Flashcards', body: 'Flip from English to Uzbek meaning, definition, and an example sentence.' },
  { icon: ListChecks, title: 'Multiple choice', body: 'Pick the right Uzbek translation from four options under light time pressure.' },
  { icon: Keyboard, title: 'Typing recall', body: "Type the English word from its meaning — the strongest test of memory." },
  { icon: Quote, title: 'Context learning', body: 'See the word inside a real sentence and fill in the blank.' },
  { icon: Bookmark, title: 'Difficult words', body: 'Bookmark anything that trips you up and drill it on its own.' },
  { icon: BookOpen, title: '30 units, 4000 words', body: 'The full Essential English Words list, organized and ready to study.' },
];

export default async function LandingPage() {
  const sample = await getSampleWord();

  return (
    <div className="min-h-screen bg-paper dark:bg-bg-dark">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-2 font-display text-xl font-semibold text-ink dark:text-white">
          <BookOpen size={22} className="text-indigo-600 dark:text-indigo-400" />
          Lexika
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink dark:text-white/70 dark:hover:text-white">
            Sign in
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
        <div className="animate-riseIn">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            4000 Essential English Words · 30 units
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink dark:text-white sm:text-5xl">
            Build your English vocabulary, one index card at a time.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-soft dark:text-white/70">
            Lexika turns the 4000 Essential English Words list into a daily habit —
            flashcards, quizzes, and typing drills, scheduled with spaced repetition
            so words actually stick. Every word includes an Uzbek translation,
            a clear definition, and an example sentence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button size="lg">Start learning free</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary">I have an account</Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-ink-soft dark:text-white/60">
            <div className="punch-row">
              {[1, 3, 7, 15, 30].map((d) => (
                <span key={d} className="punch-dot is-filled text-indigo-500" />
              ))}
            </div>
            <span>Reviewed again after 1 → 3 → 7 → 15 → 30 days</span>
          </div>
        </div>

        <HeroFlashcard
          word={
            sample
              ? {
                  english: sample.english,
                  uzbek: sample.uzbek,
                  definition: sample.definition,
                  example: sample.example,
                  unitNumber: sample.unit.number,
                }
              : {
                  english: 'benefactor',
                  uzbek: "homiy, xayriya qiluvchi",
                  definition: 'a person who gives financial or other help',
                  example: "The school's benefactor donated a new library.",
                  unitNumber: 1,
                }
          }
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <h2 className="mb-8 font-display text-2xl font-semibold text-ink dark:text-white">
          Every way to learn a word, in one place
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-card border border-ink/[0.06] bg-surface p-5 dark:border-white/[0.06] dark:bg-card-dark"
              >
                <Icon size={20} className="mb-3 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mb-1.5 font-display text-base font-semibold text-ink dark:text-white">{f.title}</h3>
                <p className="text-sm text-ink-soft dark:text-white/60">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-ink/[0.06] px-5 py-8 text-center text-sm text-ink-soft dark:border-white/[0.06] dark:text-white/50 sm:px-8">
        Lexika — built for Uzbek-speaking learners of English.
      </footer>
    </div>
  );
}
