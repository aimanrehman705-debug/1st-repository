import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function DashboardCard({ title, icon, value, loading }: { title: string; icon: ReactNode; value: ReactNode; loading?: boolean }) {
  return (
    <Card className="transition-transform hover:-translate-y-0.5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600/10 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-12 items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
          </div>
        ) : (
          <div className="text-3xl font-semibold">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}
