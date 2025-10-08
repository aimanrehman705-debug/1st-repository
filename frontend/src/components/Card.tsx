import { ReactNode } from 'react';

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-card border border-gray-100 dark:border-neutral-800">
      {children}
    </div>
  );
}
