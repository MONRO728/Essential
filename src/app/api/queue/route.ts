import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';
import { getStudyQueue } from '@/lib/queue';

export async function GET(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10) || 20, 50);
  const unitParam = url.searchParams.get('unit');
  const unitNumber = unitParam ? parseInt(unitParam, 10) : undefined;
  const bookmarkedOnly = url.searchParams.get('bookmarked') === 'true';
  const requireImage = url.searchParams.get('image') === 'true';

  const cards = await getStudyQueue({
    userId: session.user.id,
    limit,
    unitNumber,
    bookmarkedOnly,
    requireImage,
  });

  return NextResponse.json({ cards });
}
