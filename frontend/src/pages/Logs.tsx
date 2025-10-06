import { Card } from '../components/Card';
import { LogsFilter, LogsFilterState } from '../components/LogsFilter';
import { MessageLogsTable } from '../components/MessageLogsTable';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function Logs() {
  const { role } = useAuth();
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [filters, setFilters] = useState<LogsFilterState>({ query: '', status: '' });

  useEffect(() => {
    if (role === 'admin') {
      api.get('/users').then((res) => setUsers(res.data.map((u: any) => ({ id: u.id, email: u.email }))))
        .catch(() => {});
    }
  }, [role]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Message Logs</h1>

      <Card>
        <div className="p-4">
          <LogsFilter value={filters} onChange={setFilters} users={role === 'admin' ? users : undefined} />
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <MessageLogsTable />
        </div>
      </Card>
    </div>
  );
}
