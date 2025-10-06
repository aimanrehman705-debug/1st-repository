import { PropsWithChildren } from 'react'
import clsx from 'clsx'

export default function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900', className)}>
      {children}
    </div>
  )
}
