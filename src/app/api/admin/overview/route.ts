import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [totalWords, totalUnits, totalUsers, wordsWithImages, totalReviews] = await Promise.all([
    prisma.word.count(),
    prisma.unit.count(),
    prisma.user.count(),
    prisma.word.count({ where: { imageUrl: { not: null } } }),
    prisma.reviewLog.count(),
  ]);

  return NextResponse.json({ totalWords, totalUnits, totalUsers, wordsWithImages, totalReviews });
}
