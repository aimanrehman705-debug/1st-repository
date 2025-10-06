import { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200',
    secondary: 'bg-gray-200 text-gray-900 dark:bg-neutral-700 dark:text-white',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    destructive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };
  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}
