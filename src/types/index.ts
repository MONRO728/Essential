import type { Word, UserWordProgress, WordStatus } from '@prisma/client';

export type Grade = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
export type ModeName = 'FLASHCARD' | 'MCQ' | 'TYPING' | 'CONTEXT' | 'IMAGE';

export type WordWithProgress = Word & {
  progress: UserWordProgress | null;
};

export interface StudyCard {
  id: string;
  english: string;
  uzbek: string;
  definition: string;
  example: string;
  imageUrl: string | null;
  unitNumber: number;
  status: WordStatus;
  isBookmarked: boolean;
  isNew: boolean;
}

export interface DashboardStats {
  learnedWords: number;
  masteredWords: number;
  totalWords: number;
  dueToday: number;
  dailyGoal: number;
  studiedToday: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export interface UnitSummary {
  number: number;
  title: string | null;
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
}
