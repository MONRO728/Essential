import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 dark:bg-bg-dark">
      <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-semibold text-ink dark:text-white">
        <BookOpen size={22} className="text-indigo-600 dark:text-indigo-400" />
        Lexika
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
