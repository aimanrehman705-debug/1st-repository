import { HTMLAttributes, PropsWithChildren } from 'react'
import clsx from 'clsx'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-800', className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('bg-gray-50 dark:bg-gray-800/50', className)} {...props} />
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-gray-200 dark:divide-gray-800', className)} {...props} />
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx('hover:bg-gray-50/50 dark:hover:bg-gray-800/30', className)} {...props} />
}

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={clsx('px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200', className)} {...props} />
}

export function TableCell({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('px-4 py-2 text-sm', className)} {...props} />
}
