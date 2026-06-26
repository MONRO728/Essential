import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { initialProgress } from '@/lib/spaced-repetition';

const bodySchema = z.object({ bookmarked: z.boolean() });

export async function PUT(req: Request, { params }: { params: { wordId: string } }) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const seed = initialProgress();
  const progress = await prisma.userWordProgress.upsert({
    where: { userId_wordId: { userId: session.user.id, wordId: params.wordId } },
    update: { isBookmarked: parsed.data.bookmarked },
    create: {
      userId: session.user.id,
      wordId: params.wordId,
      isBookmarked: parsed.data.bookmarked,
      step: seed.step,
      repetitions: seed.repetitions,
      intervalDays: seed.intervalDays,
      status: seed.status,
    },
  });

  return NextResponse.json({ progress });
}
