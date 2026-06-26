import type { Grade } from '@/types';

/** Maps a right/wrong quiz answer onto the Again/Good grading lanes (client-safe copy of lib/review.ts). */
export function gradeFromCorrectness(correct: boolean): Grade {
  return correct ? 'GOOD' : 'AGAIN';
}
