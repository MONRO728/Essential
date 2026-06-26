'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, PartyPopper, Inbox } from 'lucide-react';
import type { StudyCard, Grade, ModeName } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPercent } from '@/lib/utils';

interface SessionShellProps {
  mode: ModeName;
  unitNumber?: number;
  bookmarkedOnly?: boolean;
  requireImage?: boolean;
  limit?: number;
  emptyHint?: string;
  children: (args: {
    card: StudyCard;
    submit: (grade: Grade) => void;
    toggleBookmark: () => void;
    submitting: boolean;
  }) => React.ReactNode;
}

export function SessionShell({
  mode,
  unitNumber,
  bookmarkedOnly = false,
  requireImage = false,
  limit = 20,
  emptyHint,
  children,
}: SessionShellProps) {
  const [cards, setCards] = useState<StudyCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setCards(null);
    setIndex(0);
    setCorrect(0);
    setIncorrect(0);
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (unitNumber) params.set('unit', String(unitNumber));
    if (bookmarkedOnly) params.set('bookmarked', 'true');
    if (requireImage) params.set('image', 'true');
    fetch(`/api/queue?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setCards(data.cards ?? []));
  }, [limit, unitNumber, bookmarkedOnly, requireImage]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(grade: Grade) {
    if (!cards) return;
    const card = cards[index];
    setSubmitting(true);
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wordId: card.id, mode, grade }),
      });
      if (grade === 'AGAIN') setIncorrect((c) => c + 1);
      else setCorrect((c) => c + 1);
      setIndex((i) => i + 1);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleBookmark() {
    if (!cards) return;
    const card = cards[index];
    const next = !card.isBookmarked;
    setCards((prev) => prev?.map((c) => (c.id === card.id ? { ...c, isBookmarked: next } : c)) ?? prev);
    await fetch(`/api/bookmarks/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarked: next }),
    });
  }

  if (cards === null) {
    return (
      <Card className="flex h-64 items-center justify-center text-sm text-ink-soft dark:text-white/50">
        Loading your session…
      </Card>
    );
  }

  if (cards.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Inbox size={28} className="text-ink-soft/50 dark:text-white/30" />
        <p className="font-display text-lg font-semibold text-ink dark:text-white">Nothing to study here yet</p>
        <p className="max-w-sm text-sm text-ink-soft dark:text-white/60">
          {emptyHint ?? "You're caught up — there are no due reviews or new words in this selection."}
        </p>
        <Link href="/learn">
          <Button variant="secondary" className="mt-2">
            Back to Learn
          </Button>
        </Link>
      </Card>
    );
  }

  const total = cards.length;

  if (index >= total) {
    const accuracy = correct + incorrect > 0 ? (correct / (correct + incorrect)) * 100 : 100;
    return (
      <Card className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        <PartyPopper size={30} className="text-amber-500" />
        <p className="font-display text-xl font-semibold text-ink dark:text-white">Session complete</p>
        <div className="flex gap-6 text-sm text-ink-soft dark:text-white/60">
          <span className="flex items-center gap-1.5 text-moss-500">
            <CheckCircle2 size={15} /> {correct} correct
          </span>
          <span className="flex items-center gap-1.5 text-brick-500">
            <X size={15} /> {incorrect} again
          </span>
          <span>{formatPercent(accuracy)} accuracy</span>
        </div>
        <div className="mt-2 flex gap-3">
          <Button variant="secondary" onClick={load}>
            Study again
          </Button>
          <Link href="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const card = cards[index];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs text-ink-soft dark:text-white/50">
        <span>
          {index + 1} of {total}
        </span>
        <span className="font-mono">Unit {card.unitNumber}</span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>
      {children({ card, submit, toggleBookmark, submitting })}
    </div>
  );
}
