import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/session';
import { recordReview } from '@/lib/review';

const reviewSchema = z.object({
  wordId: z.string().min(1),
  mode: z.enum(['FLASHCARD', 'MCQ', 'TYPING', 'CONTEXT', 'IMAGE']),
  grade: z.enum(['AGAIN', 'HARD', 'GOOD', 'EASY']),
});

export async function POST(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const progress = await recordReview({
    userId: session.user.id,
    wordId: parsed.data.wordId,
    mode: parsed.data.mode,
    grade: parsed.data.grade,
  });

  return NextResponse.json({ progress });
}
