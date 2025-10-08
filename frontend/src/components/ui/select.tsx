import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...props }, ref
) {
  return (
    <select
      ref={ref}
      className={cn('w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500', className)}
      {...props}
    />
  );
});
