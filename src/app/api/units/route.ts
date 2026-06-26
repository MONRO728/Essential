import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';

export async function GET() {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const units = await prisma.unit.findMany({
    orderBy: { number: 'asc' },
    select: { number: true, title: true, _count: { select: { words: true } } },
  });

  return NextResponse.json({
    units: units.map((u) => ({ number: u.number, title: u.title, wordCount: u._count.words })),
  });
}
