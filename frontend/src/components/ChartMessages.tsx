import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore'
import { db } from '@services/firebase'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type ChartPoint = { date: string; count: number }

function formatLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function ChartMessages() {
  const [points, setPoints] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const q = query(
      collection(db, 'messages'),
      where('sentAt', '>=', Timestamp.fromDate(start)),
    )

    const unsub = onSnapshot(q, (snap) => {
      const counts: Record<string, number> = {}
      for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        const key = d.toISOString().slice(0, 10)
        counts[key] = 0
      }

      snap.forEach((doc) => {
        const data = doc.data() as any
        if (data.status !== 'sent' || !data.sentAt) return
        const at: Date = (data.sentAt.toDate ? data.sentAt.toDate() : new Date(data.sentAt)) as Date
        const key = at.toISOString().slice(0, 10)
        if (counts[key] !== undefined) counts[key] += 1
      })

      const arr: ChartPoint[] = Object.entries(counts).map(([key, count]) => ({
        date: formatLabel(new Date(key)),
        count,
      }))
      setPoints(arr)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Messages Sent (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-400" />
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: 'currentColor' }} stroke="#e5e7eb" />
                <YAxis allowDecimals={false} tick={{ fill: 'currentColor' }} stroke="#e5e7eb" />
                <Tooltip contentStyle={{ background: 'var(--tooltip-bg, #111827)', border: '1px solid #374151', color: '#e5e7eb' }} />
                <Line type="monotone" dataKey="count" stroke="#25D366" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
