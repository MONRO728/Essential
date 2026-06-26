import type { Metadata } from 'next';
import { Lora, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const display = Lora({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Lexika — 4000 Essential English Words',
  description: 'Learn the 4000 Essential English Words with spaced repetition, flashcards, and quizzes — built for Uzbek-speaking learners.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
