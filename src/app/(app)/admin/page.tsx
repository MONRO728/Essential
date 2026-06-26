import Link from 'next/link';
import { BookText, Layers, Users, Image as ImageIcon, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { StatCard } from '@/components/stat-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AdminOverviewPage() {
  const [totalWords, totalUnits, totalUsers, wordsWithImages, totalReviews] = await Promise.all([
    prisma.word.count(),
    prisma.unit.count(),
    prisma.user.count(),
    prisma.word.count({ where: { imageUrl: { not: null } } }),
    prisma.reviewLog.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookText} label="Total words" value={String(totalWords)} accent="indigo" />
        <StatCard icon={Layers} label="Units" value={String(totalUnits)} accent="amber" />
        <StatCard icon={Users} label="Registered learners" value={String(totalUsers)} accent="moss" />
        <StatCard icon={Activity} label="Reviews logged" value={String(totalReviews)} accent="brick" />
      </div>

      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon size={18} className="text-ink-soft dark:text-white/50" />
          <p className="text-sm text-ink-soft dark:text-white/70">
            <strong className="text-ink dark:text-white">{wordsWithImages}</strong> of {totalWords} words have an
            image for the optional Image Association mode.
          </p>
        </div>
        <Link href="/admin/words">
          <Button variant="secondary" size="sm">Add images</Button>
        </Link>
      </Card>

      <Card className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft dark:text-white/70">
          Bring in more vocabulary, or update existing entries, from a CSV file.
        </p>
        <Link href="/admin/import">
          <Button size="sm">Import CSV</Button>
        </Link>
      </Card>
    </div>
  );
}
