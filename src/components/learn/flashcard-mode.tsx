'use client';

import { useState } from 'react';
import type { StudyCard, Grade } from '@/types';
import { BookmarkButton } from '@/components/learn/bookmark-button';
import { Button } from '@/components/ui/button';

const GRADES: { grade: Grade; label: string; hint: string; variant: 'danger' | 'secondary' | 'primary' | 'success' }[] = [
  { grade: 'AGAIN', label: 'Again', hint: "Didn't know it", variant: 'danger' },
  { grade: 'HARD', label: 'Hard', hint: 'Knew it slowly', variant: 'secondary' },
  { grade: 'GOOD', label: 'Good', hint: 'Knew it', variant: 'primary' },
  { grade: 'EASY', label: 'Easy', hint: 'Instantly', variant: 'success' },
];

export function FlashcardMode({
  card,
  submit,
  toggleBookmark,
  submitting,
}: {
  card: StudyCard;
  submit: (grade: Grade) => void;
  toggleBookmark: () => void;
  submitting: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  function handleGrade(grade: Grade) {
    setFlipped(false);
    submit(grade);
  }

  return (
    <div>
      <div className="flip-scene mx-auto aspect-[5/3] w-full max-w-xl sm:aspect-[2/1]">
        <div className={`flip-card ${flipped ? 'is-flipped' : ''}`}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFlipped(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setFlipped(true);
            }}
            className="flip-face relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 border border-ink/10 bg-surface px-6 shadow-card outline-none dark:border-white/10 dark:bg-card-dark"
          >
            <div className="absolute right-2 top-2">
              <BookmarkButton
                active={card.isBookmarked}
                onToggle={(e) => {
                  e?.stopPropagation();
                  toggleBookmark();
                }}
              />
            </div>
            <p className="font-display text-4xl font-semibold text-ink dark:text-white">{card.english}</p>
            <p className="text-xs uppercase tracking-wide text-ink-soft/60 dark:text-white/40">Tap to reveal meaning</p>
          </div>

          <div className="flip-face flip-face--back flex w-full flex-col gap-3 overflow-y-auto border border-ink/10 bg-surface p-6 shadow-card dark:border-white/10 dark:bg-card-dark">
            <div className="flex items-start justify-between">
              <p className="font-display text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{card.uzbek}</p>
              <BookmarkButton active={card.isBookmarked} onToggle={toggleBookmark} />
            </div>
            <p className="text-sm text-ink-soft dark:text-white/70">{card.definition}</p>
            <p className="mt-auto border-l-2 border-amber-400 pl-3 text-sm italic text-ink-soft dark:text-white/60">
              {card.example}
            </p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <Button
              key={g.grade}
              variant={g.variant}
              size="md"
              disabled={submitting}
              onClick={() => handleGrade(g.grade)}
              className="flex-col gap-0.5 !py-3"
            >
              <span>{g.label}</span>
              <span className="text-[10px] font-normal opacity-80">{g.hint}</span>
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-ink-soft/70 dark:text-white/40">
          Try to recall the meaning before flipping — that's active recall.
        </p>
      )}
    </div>
  );
}
