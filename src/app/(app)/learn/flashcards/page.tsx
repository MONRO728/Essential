'use client';

import { useSearchParams } from 'next/navigation';
import { SessionShell } from '@/components/learn/session-shell';
import { FlashcardMode } from '@/components/learn/flashcard-mode';

export default function FlashcardsPage() {
  const params = useSearchParams();
  const unit = params.get('unit');
  const bookmarked = params.get('bookmarked') === 'true';

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold text-ink dark:text-white">Flashcards</h1>
      <p className="mb-6 text-sm text-ink-soft dark:text-white/60">
        Recall the meaning, then flip the card and grade yourself honestly.
      </p>
      <SessionShell
        mode="FLASHCARD"
        unitNumber={unit ? parseInt(unit, 10) : undefined}
        bookmarkedOnly={bookmarked}
        emptyHint={bookmarked ? "You haven't bookmarked any difficult words yet." : undefined}
      >
        {({ card, submit, toggleBookmark, submitting }) => (
          <FlashcardMode
            key={card.id}
            card={card}
            submit={submit}
            toggleBookmark={toggleBookmark}
            submitting={submitting}
          />
        )}
      </SessionShell>
    </div>
  );
}
