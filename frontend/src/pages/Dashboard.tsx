import Card from '@components/Card'
import { useEffect, useState } from 'react'
import api from '@services/api'
import { useAuth } from '@hooks/useAuth'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState<{ totalUsers: number; sentToday: number; scheduledPending: number }>({ totalUsers: 0, sentToday: 0, scheduledPending: 0 })

  useEffect(() => {
    if (!isAdmin) return
    async function load() {
      try {
        const [usersRes, allRes] = await Promise.all([
          api.get('/users'),
          api.get('/messages/all'),
        ])
        const allMessages = allRes.data as any[]
        const today = new Date(); today.setHours(0,0,0,0)
        const sentToday = allMessages.filter(m => m.status === 'sent' && new Date(m.sentAt || m.createdAt) >= today).length
        const scheduledPending = allMessages.filter(m => m.status === 'scheduled').length
        setStats({ totalUsers: usersRes.data.length, sentToday, scheduledPending })
      } catch {}
    }
    load()
  }, [])

  const data = {
    labels: ['Users', 'Sent Today', 'Scheduled'],
    datasets: [{ label: 'Count', data: [stats.totalUsers, stats.sentToday, stats.scheduledPending], backgroundColor: '#25D366' }]
  }

  if (!isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Welcome to WhatsX</h3>
          <p className="text-sm text-gray-600">Use the Messages page to send or schedule messages. Templates are available for reuse.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <div className="text-sm text-gray-600">Total Users</div>
        <div className="text-3xl font-semibold">{stats.totalUsers}</div>
      </Card>
      <Card>
        <div className="text-sm text-gray-600">Messages Sent Today</div>
        <div className="text-3xl font-semibold">{stats.sentToday}</div>
      </Card>
      <Card>
        <div className="text-sm text-gray-600">Scheduled Pending</div>
        <div className="text-3xl font-semibold">{stats.scheduledPending}</div>
      </Card>

      <Card className="md:col-span-3">
        <h3 className="mb-4 text-lg font-semibold">Overview</h3>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </Card>
    </div>
  )
}
