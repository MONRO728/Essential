import type { Grade, WordStatus } from '@/types';

/**
 * Lexika uses a fixed-ladder spaced repetition schedule rather than a
 * free-floating ease factor. The five rungs match the product spec:
 * review again after 1, 3, 7, 15, then 30 days.
 *
 * Each UserWordProgress row tracks which rung ("step") it currently sits
 * on. Grading a card with Again / Hard / Good / Easy moves it down, holds
 * it, advances it one rung, or advances it two rungs.
 */
export const SCHEDULE_DAYS = [1, 3, 7, 15, 30] as const;

export interface ProgressSnapshot {
  step: number;
  repetitions: number;
  intervalDays: number;
  status: WordStatus;
}

export interface ProgressUpdate {
  step: number;
  repetitions: number;
  intervalDays: number;
  status: WordStatus;
  dueDate: Date;
  correctDelta: 0 | 1;
  incorrectDelta: 0 | 1;
}

/**
 * Computes the next scheduling state for a word after the learner grades it.
 * `now` is injectable for deterministic testing.
 */
export function computeNextReview(
  current: ProgressSnapshot,
  grade: Grade,
  now: Date = new Date()
): ProgressUpdate {
  const lastStep = SCHEDULE_DAYS.length - 1;
  let step = current.step;
  let repetitions = current.repetitions;
  let intervalDays: number;
  let correctDelta: 0 | 1 = 1;
  let incorrectDelta: 0 | 1 = 0;

  switch (grade) {
    case 'AGAIN': {
      step = 0;
      repetitions = 0;
      // Same-day relearn: due again in ~10 minutes, not a full day.
      intervalDays = 1 / 144;
      correctDelta = 0;
      incorrectDelta = 1;
      break;
    }
    case 'HARD': {
      // Repeat the current rung rather than advancing, with a mild penalty.
      intervalDays = SCHEDULE_DAYS[step] * 0.7;
      repetitions += 1;
      break;
    }
    case 'GOOD': {
      step = Math.min(step + 1, lastStep);
      intervalDays = SCHEDULE_DAYS[step];
      repetitions += 1;
      break;
    }
    case 'EASY': {
      step = Math.min(step + 2, lastStep);
      intervalDays = SCHEDULE_DAYS[step] * 1.3;
      repetitions += 1;
      break;
    }
    default: {
      step = current.step;
      intervalDays = current.intervalDays;
    }
  }

  const status = computeStatus(step, repetitions, grade);
  const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return { step, repetitions, intervalDays, status, dueDate, correctDelta, incorrectDelta };
}

function computeStatus(step: number, repetitions: number, grade: Grade): WordStatus {
  if (grade === 'AGAIN') return 'LEARNING';
  const lastStep = SCHEDULE_DAYS.length - 1;
  // Mastered once a word has cleared the full ladder (reached the 30-day
  // rung) and been confirmed there at least once more.
  if (step >= lastStep && repetitions >= SCHEDULE_DAYS.length + 1) return 'MASTERED';
  if (repetitions === 0) return 'NEW';
  if (repetitions <= 2) return 'LEARNING';
  return 'REVIEWING';
}

/** Initial state for a word the learner has never reviewed before. */
export function initialProgress(): ProgressSnapshot {
  return { step: 0, repetitions: 0, intervalDays: 0, status: 'NEW' };
}
