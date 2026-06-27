import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/navbar';
import { MobileTabBar } from '@/components/mobile-tabbar';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { currentStreak: true } });

  return (
    <div className="min-h-screen bg-paper dark:bg-bg-dark">
      <Navbar streak={dbUser?.currentStreak ?? 0} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pb-10">{children}</main>
      <MobileTabBar />
    </div>
  );
}
