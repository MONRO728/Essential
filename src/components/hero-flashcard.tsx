'use client';

import { useEffect, useState } from 'react';

interface HeroWord {
  english: string;
  uzbek: string;
  definition: string;
  example: string;
  unitNumber: number;
}

export function HeroFlashcard({ word }: { word: HeroWord }) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFlipped(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label="Flip flashcard"
        className="flip-scene block aspect-[3/4] w-full"
      >
        <div className={`flip-card ${flipped ? 'is-flipped' : ''}`}>
          <div className="flip-face flex flex-col justify-between border border-ink/10 bg-surface p-6 shadow-card dark:border-white/10 dark:bg-card-dark">
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-ink-soft/60 dark:text-white/40">
              <span>Unit {word.unitNumber}</span>
              <span>Tap to flip</span>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-semibold text-ink dark:text-white">{word.english}</p>
            </div>
            <div className="punch-row justify-center text-indigo-400">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={`punch-dot ${i === 0 ? 'is-filled' : ''}`} />
              ))}
            </div>
          </div>

          <div className="flip-face flip-face--back flex flex-col gap-3 border border-ink/10 bg-surface p-6 shadow-card dark:border-white/10 dark:bg-card-dark">
            <div className="font-mono text-xs uppercase tracking-wide text-ink-soft/60 dark:text-white/40">
              Unit {word.unitNumber} · Uzbek
            </div>
            <p className="font-display text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{word.uzbek}</p>
            <p className="text-sm text-ink-soft dark:text-white/70">{word.definition}</p>
            <p className="mt-auto border-l-2 border-amber-400 pl-3 text-sm italic text-ink-soft dark:text-white/60">
              {word.example}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
