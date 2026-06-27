'use client';

import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { StudyCard, Grade } from '@/types';
import { BookmarkButton } from '@/components/learn/bookmark-button';
import { buildOptions, type PoolWord } from '@/components/learn/use-word-pool';
import { gradeFromCorrectness } from '@/components/learn/client-grade';
import { buildBlankSentence } from '@/lib/context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ContextMode({
  card,
  pool,
  submit,
  toggleBookmark,
  submitting,
}: {
  card: StudyCard;
  pool: PoolWord[];
  submit: (grade: Grade) => void;
  toggleBookmark: () => void;
  submitting: boolean;
}) {
  const options = useMemo(() => buildOptions(card.english, card.id, pool, 'english'), [card.id, card.english, pool]);
  const blanked = useMemo(() => buildBlankSentence(card.english, card.example).display, [card.example, card.english]);
  const [selected, setSelected] = useState<string | null>(null);

  const isCorrect = selected === card.english;

  function handleNext() {
    submit(gradeFromCorrectness(isCorrect));
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <p className="text-xs uppercase tracking-wide text-ink-soft/60 dark:text-white/40">
          Which word completes this sentence?
        </p>
        <BookmarkButton active={card.isBookmarked} onToggle={toggleBookmark} />
      </div>

      <blockquote className="mb-5 border-l-2 border-amber-400 pl-4 font-display text-lg italic text-ink dark:text-white">
        &quot;{blanked}&quot;
      </blockquote>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const isThisCorrect = opt === card.english;
          const isSelected = opt === selected;
          return (
            <button
              key={opt}
              type="button"
              disabled={selected !== null}
              onClick={() => setSelected(opt)}
              className={cn(
                'flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                selected === null && 'border-ink/10 hover:border-indigo-400 hover:bg-indigo-50 dark:border-white/10 dark:hover:bg-indigo-500/10',
                selected !== null && isThisCorrect && 'border-moss-500 bg-moss-500/10 text-moss-600',
                selected !== null && isSelected && !isThisCorrect && 'border-brick-500 bg-brick-500/10 text-brick-600',
                selected !== null && !isSelected && !isThisCorrect && 'border-ink/10 opacity-50 dark:border-white/10'
              )}
            >
              {opt}
              {selected !== null && isThisCorrect && <Check size={16} />}
              {selected !== null && isSelected && !isThisCorrect && <X size={16} />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 flex items-center justify-between rounded-lg bg-paper-dim p-3.5 dark:bg-white/5">
          <p className="text-sm text-ink-soft dark:text-white/70">
            <strong>{card.english}</strong> — {card.uzbek}. {card.definition}
          </p>
          <Button onClick={handleNext} disabled={submitting} size="sm">
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
