import { prisma } from '@/lib/prisma';
import type { StudyCard } from '@/types';

export async function getStudyQueue(params: {
  userId: string;
  limit?: number;
  unitNumber?: number;
  bookmarkedOnly?: boolean;
  requireImage?: boolean;
}): Promise<StudyCard[]> {
  const { userId, limit = 20, unitNumber, bookmarkedOnly = false, requireImage = false } = params;
  const now = new Date();

  if (bookmarkedOnly) {
    const rows = await prisma.userWordProgress.findMany({
      where: {
        userId,
        isBookmarked: true,
        ...(requireImage ? { word: { imageUrl: { not: null } } } : {}),
      },
      include: { word: { include: { unit: true } } },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
    return rows.map((r) => toStudyCard(r.word, r, false));
  }

  const wordFilter =
    unitNumber || requireImage
      ? {
          ...(unitNumber ? { unit: { number: unitNumber } } : {}),
          ...(requireImage ? { imageUrl: { not: null } } : {}),
        }
      : undefined;

  const dueRows = await prisma.userWordProgress.findMany({
    where: {
      userId,
      dueDate: { lte: now },
      ...(wordFilter ? { word: wordFilter } : {}),
    },
    include: { word: { include: { unit: true } } },
    orderBy: { dueDate: 'asc' },
    take: limit,
  });

  const due = dueRows.map((r) => toStudyCard(r.word, r, false));
  const remaining = limit - due.length;

  let fresh: StudyCard[] = [];
  if (remaining > 0) {
    const newWords = await prisma.word.findMany({
      where: {
        progress: { none: { userId } },
        ...(unitNumber ? { unit: { number: unitNumber } } : {}),
        ...(requireImage ? { imageUrl: { not: null } } : {}),
      },
      include: { unit: true },
      orderBy: [{ unit: { number: 'asc' } }, { orderInUnit: 'asc' }],
      take: remaining,
    });
    fresh = newWords.map((w) => toStudyCard(w, null, true));
  }

  return [...due, ...fresh];
}

function toStudyCard(
  word: { id: string; english: string; uzbek: string; definition: string; example: string; imageUrl: string | null; unit: { number: number } },
  progress: { status: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED'; isBookmarked: boolean } | null,
  isNew: boolean
): StudyCard {
  return {
    id: word.id,
    english: word.english,
    uzbek: word.uzbek,
    definition: word.definition,
    example: word.example,
    imageUrl: word.imageUrl,
    unitNumber: word.unit.number,
    status: progress?.status ?? 'NEW',
    isBookmarked: progress?.isBookmarked ?? false,
    isNew,
  };
}

