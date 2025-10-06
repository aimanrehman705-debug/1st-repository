import { useEffect, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import DashboardCard from '@components/DashboardCard'
import ChartMessages from '@components/ChartMessages'
import { Users as UsersIcon, MessageSquare, Clock } from 'lucide-react'
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@services/firebase'
import { Card } from '@components/ui/card'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [totalUsers, setTotalUsers] = useState(0)
  const [sentToday, setSentToday] = useState(0)
  const [scheduledPending, setScheduledPending] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    const unsubs: Array<() => void> = []

    const usersUnsub = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size)
    })
    unsubs.push(usersUnsub)

    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const sentUnsub = onSnapshot(
      query(collection(db, 'messages'), where('sentAt', '>=', Timestamp.fromDate(start))),
      (snap) => {
        let count = 0
        snap.forEach((doc) => {
          const data = doc.data() as any
          if (data.status === 'sent') count += 1
        })
        setSentToday(count)
      }
    )
    unsubs.push(sentUnsub)

    const scheduledUnsub = onSnapshot(
      query(collection(db, 'messages'), where('status', '==', 'scheduled')),
      (snap) => setScheduledPending(snap.size)
    )
    unsubs.push(scheduledUnsub)

    const timer = setTimeout(() => setLoading(false), 300) // brief delay for smooth UX

    return () => {
      unsubs.forEach((u) => u())
      clearTimeout(timer)
    }
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-2 text-lg font-semibold">Welcome to WhatsX</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">You don't have admin access. Contact an administrator for access.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <DashboardCard title="Total Users" icon={<UsersIcon size={16} />} value={totalUsers} loading={loading} />
      <DashboardCard title="Messages Sent Today" icon={<MessageSquare size={16} />} value={sentToday} loading={loading} />
      <DashboardCard title="Scheduled Pending" icon={<Clock size={16} />} value={scheduledPending} loading={loading} />

      <ChartMessages />
    </div>
  )
}
