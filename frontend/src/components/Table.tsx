import { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        {children}
      </table>
    </div>
  )
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50 dark:bg-gray-800/50">{children}</thead>
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-800">{children}</tbody>
}

export function TR({ children }: { children: ReactNode }) {
  return <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">{children}</tr>
}

export function TH({ children }: { children: ReactNode }) {
  return <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">{children}</th>
}

export function TD({ children }: { children: ReactNode }) {
  return <td className="px-4 py-2 text-sm">{children}</td>
}
