import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

async function requireAdminSession() {
  const session = await getCurrentSession();
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

const updateSchema = z.object({
  english: z.string().min(1).optional(),
  uzbek: z.string().min(1).optional(),
  definition: z.string().min(1).optional(),
  example: z.string().min(1).optional(),
  imageUrl: z.string().url().nullable().optional(),
  unitNumber: z.number().int().min(1).optional(),
  orderInUnit: z.number().int().min(0).optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const { unitNumber, ...rest } = parsed.data;
  let unitId: string | undefined;
  if (unitNumber) {
    const unit = await prisma.unit.upsert({
      where: { number: unitNumber },
      update: {},
      create: { number: unitNumber, title: `Unit ${unitNumber}` },
    });
    unitId = unit.id;
  }

  const word = await prisma.word.update({
    where: { id: params.id },
    data: { ...rest, ...(unitId ? { unitId } : {}) },
  });

  return NextResponse.json({ word });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.word.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
