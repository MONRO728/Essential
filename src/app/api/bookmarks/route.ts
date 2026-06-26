import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.userWordProgress.findMany({
    where: { userId: session.user.id, isBookmarked: true },
    include: { word: { include: { unit: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  const words = rows.map((r) => ({
    id: r.word.id,
    english: r.word.english,
    uzbek: r.word.uzbek,
    definition: r.word.definition,
    example: r.word.example,
    unitNumber: r.word.unit.number,
    status: r.status,
  }));

  return NextResponse.json({ words });
}
