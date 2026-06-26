import { requireUser } from '@/lib/session';
import { getDashboardStats, getUnitSummaries, getRecentActivity } from '@/lib/stats';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { UnitGrid } from '@/components/unit-grid';
import { ActivityChart } from '@/components/activity-chart';
import { BookCheck, Trophy, Target, Flame, Award } from 'lucide-react';
import { formatPercent } from '@/lib/utils';

export default async function ProgressPage() {
  const user = await requireUser();
  const [stats, units, activity, byStatus] = await Promise.all([
    getDashboardStats(user.id),
    getUnitSummaries(user.id),
    getRecentActivity(user.id, 14),
    prisma.userWordProgress.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { _all: true },
    }),
  ]);

  const statusCounts = { NEW: 0, LEARNING: 0, REVIEWING: 0, MASTERED: 0 } as Record<string, number>;
  for (const row of byStatus) statusCounts[row.status] = row._count._all;
  const notStarted = Math.max(stats.totalWords - stats.learnedWords, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Your progress</h1>
        <p className="text-sm text-ink-soft dark:text-white/60">A closer look at how your vocabulary is building up.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookCheck} label="Words learned" value={String(stats.learnedWords)} accent="indigo" />
        <StatCard icon={Trophy} label="Words mastered" value={String(stats.masteredWords)} accent="amber" />
        <StatCard icon={Target} label="Overall accuracy" value={formatPercent(stats.accuracy)} accent="moss" />
        <StatCard icon={Flame} label="Longest streak" value={`${stats.longestStreak} days`} accent="brick" />
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink dark:text-white">Last 14 days</h2>
          <span className="text-xs text-ink-soft dark:text-white/50">Words reviewed per day</span>
        </div>
        <ActivityChart days={activity} />
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 font-display text-base font-semibold text-ink dark:text-white">Where your words stand</h2>
        <div className="space-y-3">
          {[
            { label: 'Not started', count: notStarted, color: 'bg-ink/15 dark:bg-white/15' },
            { label: 'Learning', count: statusCounts.LEARNING, color: 'bg-indigo-400' },
            { label: 'Reviewing', count: statusCounts.REVIEWING, color: 'bg-amber-400' },
            { label: 'Mastered', count: statusCounts.MASTERED, color: 'bg-moss-500' },
          ].map((row) => {
            const pct = stats.totalWords > 0 ? (row.count / stats.totalWords) * 100 : 0;
            return (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink-soft dark:text-white/70">{row.label}</span>
                  <span className="font-medium text-ink dark:text-white">{row.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-white/10">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {stats.masteredWords >= stats.totalWords && stats.totalWords > 0 && (
        <Card className="flex items-center gap-3 p-5">
          <Award className="text-amber-500" size={22} />
          <p className="text-sm text-ink dark:text-white">
            You've mastered every word in the list — incredible work.
          </p>
        </Card>
      )}

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-ink dark:text-white">Unit completion</h2>
        <UnitGrid units={units} />
      </div>
    </div>
  );
}
