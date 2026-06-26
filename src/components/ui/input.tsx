import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-ink/15 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition-shadow focus:ring-2 focus:ring-indigo-500 dark:border-white/15 dark:bg-card-dark dark:text-white',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-ink-soft dark:text-white/70', className)} {...props} />
  );
}
