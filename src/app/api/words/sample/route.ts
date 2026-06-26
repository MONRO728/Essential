import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// Returns a random pool of {english, uzbek} pairs used client-side to build
// multiple-choice and fill-in-the-blank distractors, without an extra
// round trip per question.
export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const count = Math.min(parseInt(url.searchParams.get('count') ?? '120', 10) || 120, 300);

  const total = await prisma.word.count();
  const skip = total > count ? Math.floor(Math.random() * Math.max(total - count, 1)) : 0;

  const words = await prisma.word.findMany({
    skip,
    take: count,
    select: { id: true, english: true, uzbek: true },
  });

  return NextResponse.json({ words });
}
