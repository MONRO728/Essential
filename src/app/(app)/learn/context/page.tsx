'use client';

import { useSearchParams } from 'next/navigation';
import { SessionShell } from '@/components/learn/session-shell';
import { ContextMode } from '@/components/learn/context-mode';
import { useWordPool } from '@/components/learn/use-word-pool';

export default function ContextPage() {
  const params = useSearchParams();
  const unit = params.get('unit');
  const bookmarked = params.get('bookmarked') === 'true';
  const pool = useWordPool();

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold text-ink dark:text-white">Context learning</h1>
      <p className="mb-6 text-sm text-ink-soft dark:text-white/60">
        Real example sentences help words stick better than the word alone.
      </p>
      <SessionShell
        mode="CONTEXT"
        unitNumber={unit ? parseInt(unit, 10) : undefined}
        bookmarkedOnly={bookmarked}
        emptyHint={bookmarked ? "You haven't bookmarked any difficult words yet." : undefined}
      >
        {({ card, submit, toggleBookmark, submitting }) => (
          <ContextMode
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
