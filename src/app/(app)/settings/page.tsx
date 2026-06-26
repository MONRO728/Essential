import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { SettingsForm } from '@/components/settings-form';

export default async function SettingsPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return null;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Settings</h1>
        <p className="text-sm text-ink-soft dark:text-white/60">{user.email}</p>
      </div>

      <SettingsForm initialName={user.name} initialGoal={user.dailyGoal} />

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium text-ink dark:text-white">Appearance</p>
            <p className="text-sm text-ink-soft dark:text-white/60">Light, dark, or match your system.</p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
