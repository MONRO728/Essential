'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkX, Inbox } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookmarkedWord {
  id: string;
  english: string;
  uzbek: string;
  definition: string;
  example: string;
  unitNumber: number;
  status: string;
}

export default function BookmarksPage() {
  const [words, setWords] = useState<BookmarkedWord[] | null>(null);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then((r) => r.json())
      .then((data) => setWords(data.words ?? []));
  }, []);

  async function remove(id: string) {
    setWords((prev) => prev?.filter((w) => w.id !== id) ?? prev);
    await fetch(`/api/bookmarks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarked: false }),
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Difficult words</h1>
          <p className="text-sm text-ink-soft dark:text-white/60">
            Anything you've bookmarked from a study session lands here for focused review.
          </p>
        </div>
        {words && words.length > 0 && (
          <Link href="/learn/flashcards?bookmarked=true">
            <Button>Review these words</Button>
          </Link>
        )}
      </div>

      {words === null && (
        <Card className="flex h-40 items-center justify-center text-sm text-ink-soft dark:text-white/50">
          Loading…
        </Card>
      )}

      {words && words.length === 0 && (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <Inbox size={28} className="text-ink-soft/50 dark:text-white/30" />
          <p className="font-display text-lg font-semibold text-ink dark:text-white">No difficult words yet</p>
          <p className="max-w-sm text-sm text-ink-soft dark:text-white/60">
            Tap the bookmark icon on any flashcard or quiz question to save it here.
          </p>
        </Card>
      )}

      {words && words.length > 0 && (
        <div className="space-y-2.5">
          {words.map((w) => (
            <Card key={w.id} className="flex items-start justify-between gap-4 p-4">
              <div className="flex items-start gap-3">
                <Bookmark size={16} className="mt-1 shrink-0 text-amber-500" fill="currentColor" />
                <div>
                  <p className="font-display text-base font-semibold text-ink dark:text-white">
                    {w.english} <span className="font-body text-sm font-normal text-ink-soft dark:text-white/50">· Unit {w.unitNumber}</span>
                  </p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">{w.uzbek}</p>
                  <p className="mt-1 text-sm text-ink-soft dark:text-white/60">{w.definition}</p>
                </div>
              </div>
              <button
                onClick={() => remove(w.id)}
                aria-label="Remove from difficult words"
                className="shrink-0 rounded-lg p-2 text-ink-soft/50 hover:bg-ink/5 hover:text-brick-500 dark:text-white/30 dark:hover:bg-white/10"
              >
                <BookmarkX size={17} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
