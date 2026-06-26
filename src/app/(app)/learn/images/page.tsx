'use client';

import { SessionShell } from '@/components/learn/session-shell';
import { ImageMode } from '@/components/learn/image-mode';
import { useWordPool } from '@/components/learn/use-word-pool';

export default function ImagesPage() {
  const pool = useWordPool();

  return (
    <div>
      <h1 className="mb-1 font-display text-xl font-semibold text-ink dark:text-white">Image association</h1>
      <p className="mb-6 text-sm text-ink-soft dark:text-white/60">
        Optional mode — only words an admin has added a picture to show up here.
      </p>
      <SessionShell
        mode="IMAGE"
        requireImage
        emptyHint="No words have images yet. Ask an admin to add some from the Admin panel."
      >
        {({ card, submit, toggleBookmark, submitting }) => (
          <ImageMode
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
