import Link from 'next/link';
import { BookCheck, Trophy, Target, Flame } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { getDashboardStats } from '@/lib/stats';
import { getUnitSummaries } from '@/lib/stats';
import { StatCard } from '@/components/stat-card';
import { DailyGoalRing } from '@/components/daily-goal-ring';
import { UnitGrid } from '@/components/unit-grid';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPercent } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, units] = await Promise.all([getDashboardStats(user.id), getUnitSummaries(user.id)]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-white">Welcome back, {user.name}</h1>
          <p className="text-sm text-ink-soft dark:text-white/60">
            {stats.dueToday > 0
              ? `${stats.dueToday} word${stats.dueToday === 1 ? '' : 's'} due for review today.`
              : "You're all caught up on reviews — great time to learn new words."}
          </p>
        </div>
        <Link href="/learn">
          <Button size="lg">Start studying</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookCheck} label="Words learned" value={String(stats.learnedWords)} accent="indigo" />
        <StatCard icon={Trophy} label="Words mastered" value={String(stats.masteredWords)} accent="amber" />
        <StatCard icon={Target} label="Accuracy" value={formatPercent(stats.accuracy)} accent="moss" />
        <StatCard icon={Flame} label="Current streak" value={`${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`} accent="brick" />
      </div>

      <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <DailyGoalRing studied={stats.studiedToday} goal={stats.dailyGoal} />
          <div>
            <p className="font-display text-lg font-semibold text-ink dark:text-white">Today's goal</p>
            <p className="text-sm text-ink-soft dark:text-white/60">
              {stats.studiedToday >= stats.dailyGoal
                ? "Nice work — you've hit your goal for today."
                : `${stats.dailyGoal - stats.studiedToday} more word reviews to go.`}
            </p>
            <p className="mt-1 text-xs text-ink-soft/70 dark:text-white/40">
              {stats.totalWords > 0
                ? `${stats.learnedWords} of ${stats.totalWords} words learned overall · longest streak ${stats.longestStreak} days`
                : 'No vocabulary imported yet.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/learn/flashcards"><Button variant="secondary">Flashcards</Button></Link>
          <Link href="/learn/quiz"><Button variant="secondary">Quiz</Button></Link>
          <Link href="/learn/typing"><Button variant="secondary">Typing</Button></Link>
        </div>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink dark:text-white">Units</h2>
          <span className="text-sm text-ink-soft dark:text-white/50">{units.length} units</span>
        </div>
        <UnitGrid units={units} />
      </div>
    </div>
  );
}
