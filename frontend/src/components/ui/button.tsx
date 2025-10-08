import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'primary', ...props }, ref
) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    primary: 'bg-primary-500 text-white hover:opacity-90 focus:ring-primary-500 dark:focus:ring-offset-neutral-900',
    outline: 'border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-neutral-800',
  } as const;
  return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
});
