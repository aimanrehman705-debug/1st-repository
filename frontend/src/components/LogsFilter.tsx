import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { Filter, Search, X } from 'lucide-react';

export interface LogsFilterState {
  query: string;
  status: '' | 'sent' | 'scheduled' | 'failed';
  from?: string; // ISO string
  to?: string;   // ISO string
  user?: string; // userId or email
}

export function LogsFilter({
  value,
  onChange,
  users,
}: {
  value: LogsFilterState;
  onChange: (next: LogsFilterState) => void;
  users?: Array<{ id: string; email: string }>; // for admin
}) {
  const [local, setLocal] = useState<LogsFilterState>(value);

  useEffect(() => setLocal(value), [value]);

  function apply() { onChange(local); }
  function clear() { onChange({ query: '', status: '', from: undefined, to: undefined, user: undefined }); }

  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-end">
      <div className="flex-1">
        <label className="text-xs text-gray-500">Search</label>
        <div className="flex gap-2">
          <Input value={local.query} onChange={(e) => setLocal({ ...local, query: e.target.value })} placeholder="Search message or phone" />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500">Status</label>
        <Select value={local.status} onChange={(e) => setLocal({ ...local, status: e.target.value as any })}>
          <option value="">Any</option>
          <option value="sent">Sent</option>
          <option value="scheduled">Scheduled</option>
          <option value="failed">Failed</option>
        </Select>
      </div>
      <div>
        <label className="text-xs text-gray-500">From</label>
        <Input type="datetime-local" value={local.from || ''} onChange={(e) => setLocal({ ...local, from: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-gray-500">To</label>
        <Input type="datetime-local" value={local.to || ''} onChange={(e) => setLocal({ ...local, to: e.target.value })} />
      </div>
      {users && users.length > 0 && (
        <div>
          <label className="text-xs text-gray-500">User</label>
          <Select value={local.user || ''} onChange={(e) => setLocal({ ...local, user: e.target.value || undefined })}>
            <option value="">Any</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.email}</option>
            ))}
          </Select>
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={apply} variant="outline"><Filter size={16} /> Apply</Button>
        <Button onClick={clear} variant="ghost"><X size={16} /> Clear</Button>
      </div>
    </div>
  );
}
