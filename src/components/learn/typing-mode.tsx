'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { StudyCard, Grade } from '@/types';
import { BookmarkButton } from '@/components/learn/bookmark-button';
import { gradeFromCorrectness } from '@/components/learn/client-grade';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function TypingMode({
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
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  const correct = checked && value.trim().toLowerCase() === card.english.toLowerCase();

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (checked) {
      submit(gradeFromCorrectness(correct));
      return;
    }
    setChecked(true);
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft/60 dark:text-white/40">
            Type the English word for
          </p>
          <p className="font-display text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{card.uzbek}</p>
          <p className="mt-1 text-sm text-ink-soft dark:text-white/60">{card.definition}</p>
        </div>
        <BookmarkButton active={card.isBookmarked} onToggle={toggleBookmark} />
      </div>

      <form onSubmit={handleCheck} className="space-y-3">
        <Input
          autoFocus
          disabled={checked}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your answer…"
          className={cn(
            checked && correct && 'border-moss-500 ring-2 ring-moss-500/30',
            checked && !correct && 'border-brick-500 ring-2 ring-brick-500/30'
          )}
        />

        {checked && (
          <div
            className={cn(
              'flex items-center gap-2 rounded-lg p-3 text-sm',
              correct ? 'bg-moss-500/10 text-moss-600' : 'bg-brick-500/10 text-brick-600'
            )}
          >
            {correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {correct ? 'Correct!' : (
              <span>
                Correct answer: <strong>{card.english}</strong>
              </span>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {checked ? 'Next' : 'Check answer'}
        </Button>
      </form>
    </Card>
  );
}
