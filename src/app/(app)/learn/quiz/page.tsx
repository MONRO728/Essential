'use client';

import { useSearchParams } from 'next/navigation';
import { SessionShell } from '@/components/learn/session-shell';
import { McqMode } from '@/components/learn/mcq-mode';
import { useWordPool } from '@/components/learn/use-word-pool';

export default function QuizPage() {
  const params = useSearchParams();
  const unit = params.get('unit');
  const bookmarked = params.get('bookmarked') === 'true';
  const pool = useWordPool();

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold text-ink dark:text-white">Multiple choice quiz</h1>
      <p className="mb-6 text-sm text-ink-soft dark:text-white/60">Pick the correct Uzbek translation.</p>
      <SessionShell
        mode="MCQ"
        unitNumber={unit ? parseInt(unit, 10) : undefined}
        bookmarkedOnly={bookmarked}
        emptyHint={bookmarked ? "You haven't bookmarked any difficult words yet." : undefined}
      >
        {({ card, submit, toggleBookmark, submitting }) => (
          <McqMode
            key={card.id}
            card={card}
            pool={pool}
            submit={submit}
            toggleBookmark={toggleBookmark}
            submitting={submitting}
          />
        )}
      </SessionShell>
    </div>
  );
}
