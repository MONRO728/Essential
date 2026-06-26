import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// NOTE: middleware already blocks non-admins from /api/admin/*, but every
// handler re-checks the role directly too — defense in depth in case the
// route is ever reached a different way (server actions, tests, etc).
async function requireAdminSession() {
  const session = await getCurrentSession();
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const search = url.searchParams.get('q')?.trim();
  const unitParam = url.searchParams.get('unit');
  const page = Math.max(parseInt(url.searchParams.get('page') ?? '1', 10) || 1, 1);
  const pageSize = 25;

  const where = {
    ...(search
      ? {
          OR: [
            { english: { contains: search, mode: 'insensitive' as const } },
            { uzbek: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(unitParam ? { unit: { number: parseInt(unitParam, 10) } } : {}),
  };

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      include: { unit: { select: { number: true } } },
      orderBy: [{ unit: { number: 'asc' } }, { orderInUnit: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.word.count({ where }),
  ]);

  return NextResponse.json({
    words: words.map((w) => ({
      id: w.id,
      english: w.english,
      uzbek: w.uzbek,
      definition: w.definition,
      example: w.example,
      imageUrl: w.imageUrl,
      orderInUnit: w.orderInUnit,
      unitNumber: w.unit.number,
    })),
    total,
    page,
    pageSize,
  });
}

const createSchema = z.object({
  unitNumber: z.number().int().min(1),
  orderInUnit: z.number().int().min(0).default(0),
  english: z.string().min(1),
  uzbek: z.string().min(1),
  definition: z.string().min(1),
  example: z.string().min(1),
  imageUrl: z.string().url().optional().nullable(),
});

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const unit = await prisma.unit.upsert({
    where: { number: parsed.data.unitNumber },
    update: {},
    create: { number: parsed.data.unitNumber, title: `Unit ${parsed.data.unitNumber}` },
  });

  const word = await prisma.word.create({
    data: {
      unitId: unit.id,
      orderInUnit: parsed.data.orderInUnit,
      english: parsed.data.english,
      uzbek: parsed.data.uzbek,
      definition: parsed.data.definition,
      example: parsed.data.example,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  return NextResponse.json({ word }, { status: 201 });
}
