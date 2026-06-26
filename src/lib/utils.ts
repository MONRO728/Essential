import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

/** Midnight UTC for the given date — used as the key for daily Activity rows. */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/**
 * Given the user's previous streak bookkeeping and "now", returns the
 * updated streak fields. Studying again on the same day is a no-op;
 * studying the day right after extends the streak; any larger gap resets
 * it to 1.
 */
export function updateStreak(params: {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date | null;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  if (!params.lastStudyDate) {
    return { currentStreak: 1, longestStreak: Math.max(1, params.longestStreak), lastStudyDate: now };
  }
  const gap = daysBetween(params.lastStudyDate, now);
  if (gap === 0) {
    return {
      currentStreak: params.currentStreak,
      longestStreak: params.longestStreak,
      lastStudyDate: now,
    };
  }
  if (gap === 1) {
    const currentStreak = params.currentStreak + 1;
    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, params.longestStreak),
      lastStudyDate: now,
    };
  }
  return { currentStreak: 1, longestStreak: Math.max(1, params.longestStreak), lastStudyDate: now };
}

export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(digits)}%`;
}

export function unitLabel(number: number): string {
  return `Unit ${number}`;
}
