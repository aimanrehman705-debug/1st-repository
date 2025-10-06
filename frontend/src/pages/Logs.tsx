import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card } from '../components/Card';

interface LogItem { id: string; userId: string; recipients: string[]; message: string; status: string; createdAt?: any; scheduledFor?: any }

export function Logs() {
  const [items, setItems] = useState<LogItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/messages/admin/all');
        setItems(res.data);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Logs</h1>
      <div className="grid gap-3">
        {items.map((m) => (
          <Card key={m.id}>
            <div className="p-4 space-y-1">
              <div className="text-sm text-gray-500">User: {m.userId}</div>
              <div><span className="text-sm text-gray-500">To:</span> {m.recipients?.join(', ')}</div>
              <div className="text-sm whitespace-pre-wrap">{m.message}</div>
              <div className="text-xs text-gray-500">
                {m.status}
                {m.scheduledFor ? ` • scheduled for ${new Date(m.scheduledFor.seconds ? m.scheduledFor.seconds*1000 : m.scheduledFor).toLocaleString()}` : ''}
                {m.createdAt ? ` • created ${new Date(m.createdAt.seconds ? m.createdAt.seconds*1000 : m.createdAt).toLocaleString()}` : ''}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
