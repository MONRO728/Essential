import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(2).max(60).optional(),
  dailyGoal: z.number().int().min(5).max(200).optional(),
});

export async function PATCH(req: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { name: true, dailyGoal: true },
  });

  return NextResponse.json({ user });
}
