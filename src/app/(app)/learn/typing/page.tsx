'use client';

import { useSearchParams } from 'next/navigation';
import { SessionShell } from '@/components/learn/session-shell';
import { TypingMode } from '@/components/learn/typing-mode';

export default function TypingPage() {
  const params = useSearchParams();
  const unit = params.get('unit');
  const bookmarked = params.get('bookmarked') === 'true';

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold text-ink dark:text-white">Typing recall</h1>
      <p className="mb-6 text-sm text-ink-soft dark:text-white/60">
        The strongest test of memory — produce the word yourself, no hints.
      </p>
      <SessionShell
        mode="TYPING"
        unitNumber={unit ? parseInt(unit, 10) : undefined}
        bookmarkedOnly={bookmarked}
        emptyHint={bookmarked ? "You haven't bookmarked any difficult words yet." : undefined}
      >
        {({ card, submit, toggleBookmark, submitting }) => (
          <TypingMode key={card.id} card={card} submit={submit} toggleBookmark={toggleBookmark} submitting={submitting} />
        )}
      </SessionShell>
    </div>
  );
}
