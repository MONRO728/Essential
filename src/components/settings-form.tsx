'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SettingsForm({ initialName, initialGoal }: { initialName: string; initialGoal: number }) {
  const [name, setName] = useState(initialName);
  const [dailyGoal, setDailyGoal] = useState(initialGoal);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, dailyGoal }),
    });
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 1500);
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="goal">Daily word goal</Label>
            <Input
              id="goal"
              type="number"
              min={5}
              max={200}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value, 10) || 0)}
            />
            <p className="mt-1 text-xs text-ink-soft/70 dark:text-white/40">
              How many word reviews count as &quot;done&quot; for the day on your dashboard.
            </p>
          </div>
          <Button type="submit" disabled={status === 'saving'}>
            {status === 'saved' ? 'Saved' : status === 'saving' ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
