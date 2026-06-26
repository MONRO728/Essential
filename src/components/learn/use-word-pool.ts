'use client';

import { useEffect, useState } from 'react';

export interface PoolWord {
  id: string;
  english: string;
  uzbek: string;
}

/** Fetches a random pool of words once, used to build MCQ / fill-in-the-blank distractors. */
export function useWordPool(count = 150) {
  const [pool, setPool] = useState<PoolWord[]>([]);

  useEffect(() => {
    fetch(`/api/words/sample?count=${count}`)
      .then((r) => r.json())
      .then((data) => setPool(data.words ?? []));
  }, [count]);

  return pool;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Builds 4 shuffled options (1 correct + 3 distractors) for a multiple-choice question. */
export function buildOptions(correct: string, excludeId: string, pool: PoolWord[], key: 'english' | 'uzbek') {
  const distractors = shuffle(pool.filter((w) => w.id !== excludeId && w[key] !== correct))
    .slice(0, 3)
    .map((w) => w[key]);
  return shuffle([correct, ...distractors]);
}
