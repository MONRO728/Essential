import { ReviewGrade, ReviewMode } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { computeNextReview, initialProgress } from '@/lib/spaced-repetition';
import { startOfDay, updateStreak } from '@/lib/utils';

export async function recordReview(params: {
  userId: string;
  wordId: string;
  mode: ReviewMode;
  grade: ReviewGrade;
}) {
  const { userId, wordId, mode, grade } = params;
  const now = new Date();

  const existing = await prisma.userWordProgress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });

  const snapshot = existing
    ? {
        step: existing.step,
        repetitions: existing.repetitions,
        intervalDays: existing.intervalDays,
        status: existing.status,
      }
    : initialProgress();

  const next = computeNextReview(snapshot, grade, now);

  const progress = await prisma.userWordProgress.upsert({
    where: { userId_wordId: { userId, wordId } },
    update: {
      step: next.step,
      repetitions: next.repetitions,
      intervalDays: next.intervalDays,
      status: next.status,
      dueDate: next.dueDate,
      lastReviewedAt: now,
      correctCount: { increment: next.correctDelta },
      incorrectCount: { increment: next.incorrectDelta },
    },
    create: {
      userId,
      wordId,
      step: next.step,
      repetitions: next.repetitions,
      intervalDays: next.intervalDays,
      status: next.status,
      dueDate: next.dueDate,
      lastReviewedAt: now,
      correctCount: next.correctDelta,
      incorrectCount: next.incorrectDelta,
    },
  });

  await prisma.reviewLog.create({
    data: {
      userId,
      wordId,
      mode,
      grade,
      correct: grade !== 'AGAIN',
    },
  });

  const today = startOfDay(now);
  await prisma.activity.upsert({
    where: { userId_date: { userId, date: today } },
    update: {
      wordsReviewed: { increment: 1 },
      correctCount: { increment: next.correctDelta },
      incorrectCount: { increment: next.incorrectDelta },
    },
    create: {
      userId,
      date: today,
      wordsReviewed: 1,
      correctCount: next.correctDelta,
      incorrectCount: next.incorrectDelta,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    const streak = updateStreak({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastStudyDate: user.lastStudyDate,
      now,
    });
    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastStudyDate: streak.lastStudyDate,
      },
    });
  }

  return progress;
}

/** Maps a simple right/wrong quiz answer onto the Again/Good grading lanes. */
export function gradeFromCorrectness(correct: boolean): ReviewGrade {
  return correct ? 'GOOD' : 'AGAIN';
}
