import { prisma } from '@/lib/prisma';
import { startOfDay } from '@/lib/utils';
import type { DashboardStats, UnitSummary } from '@/types';

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [user, totalWords, learnedWords, masteredWords, dueToday, today, accuracyAgg] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.word.count(),
      prisma.userWordProgress.count({ where: { userId, status: { not: 'NEW' } } }),
      prisma.userWordProgress.count({ where: { userId, status: 'MASTERED' } }),
      prisma.userWordProgress.count({ where: { userId, dueDate: { lte: new Date() } } }),
      prisma.activity.findUnique({ where: { userId_date: { userId, date: startOfDay() } } }),
      prisma.userWordProgress.aggregate({
        where: { userId },
        _sum: { correctCount: true, incorrectCount: true },
      }),
    ]);

  const correct = accuracyAgg._sum.correctCount ?? 0;
  const incorrect = accuracyAgg._sum.incorrectCount ?? 0;
  const total = correct + incorrect;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  return {
    learnedWords,
    masteredWords,
    totalWords,
    dueToday,
    dailyGoal: user?.dailyGoal ?? 20,
    studiedToday: today?.wordsReviewed ?? 0,
    accuracy,
    currentStreak: user?.currentStreak ?? 0,
    longestStreak: user?.longestStreak ?? 0,
  };
}

export interface DayActivity {
  date: string;
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}

export async function getRecentActivity(userId: string, days = 14): Promise<DayActivity[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const from = startOfDay(since);

  const rows = await prisma.activity.findMany({
    where: { userId, date: { gte: from } },
    orderBy: { date: 'asc' },
  });

  const byDate = new Map(rows.map((r) => [r.date.toISOString().slice(0, 10), r]));
  const result: DayActivity[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const row = byDate.get(key);
    result.push({
      date: key,
      wordsReviewed: row?.wordsReviewed ?? 0,
      correctCount: row?.correctCount ?? 0,
      incorrectCount: row?.incorrectCount ?? 0,
    });
  }
  return result;
}

export async function getUnitSummaries(userId: string): Promise<UnitSummary[]> {
  const units = await prisma.unit.findMany({
    orderBy: { number: 'asc' },
    include: {
      words: {
        select: {
          id: true,
          progress: { where: { userId }, select: { status: true } },
        },
      },
    },
  });

  return units.map((unit) => {
    let learnedWords = 0;
    let masteredWords = 0;
    for (const word of unit.words) {
      const status = word.progress[0]?.status;
      if (status && status !== 'NEW') learnedWords++;
      if (status === 'MASTERED') masteredWords++;
    }
    return {
      number: unit.number,
      title: unit.title,
      totalWords: unit.words.length,
      learnedWords,
      masteredWords,
    };
  });
}
