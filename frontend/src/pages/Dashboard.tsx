import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/Card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Dashboard() {
  const { role } = useAuth();
  const [stats, setStats] = useState<{ totalUsers: number; messagesSentToday: number; scheduledPending: number } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (role === 'admin') {
          const res = await api.get('/messages/admin/stats');
          setStats(res.data);
        }
      } catch (err) {
        // ignore
      }
    }
    fetchStats();
  }, [role]);

  const chartData = [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Sent Today', value: stats?.messagesSentToday || 0 },
    { name: 'Scheduled', value: stats?.scheduledPending || 0 },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {role === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><div className="p-4"><div className="text-sm text-gray-500">Total Users</div><div className="text-3xl font-bold">{stats?.totalUsers ?? '—'}</div></div></Card>
          <Card><div className="p-4"><div className="text-sm text-gray-500">Messages Today</div><div className="text-3xl font-bold">{stats?.messagesSentToday ?? '—'}</div></div></Card>
          <Card><div className="p-4"><div className="text-sm text-gray-500">Scheduled Pending</div><div className="text-3xl font-bold">{stats?.scheduledPending ?? '—'}</div></div></Card>
        </div>
      ) : (
        <Card><div className="p-4">Welcome to WhatsX. Use the Messages page to send or schedule messages.</div></Card>
      )}

      {role === 'admin' && (
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-2">Overview</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#25D366" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
