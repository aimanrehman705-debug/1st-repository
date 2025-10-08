import { useEffect, useMemo, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Download, Search } from 'lucide-react';
import { toCsv, truncate, formatDate } from '../utils/helpers';
import { collection, onSnapshot, orderBy, query, where, getFirestore, limit } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import type { LogsFilterState } from './LogsFilter';

interface LogItem {
  id: string;
  recipientName?: string;
  phone?: string;
  message: string;
  status: 'sent' | 'scheduled' | 'failed';
  userId: string;
  createdAt?: any;
  scheduledFor?: any;
}

export function MessageLogsTable({ filters }: { filters?: LogsFilterState }) {
  const { role, user } = useAuth();
  const [items, setItems] = useState<LogItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const db = getFirestore();
    let q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(200));
    if (role !== 'admin' && user?.uid) {
      q = query(collection(db, 'messages'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(200)) as any;
    }
    const unsub = onSnapshot(q, (snap) => {
      const rows: LogItem[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as any) }));
      setItems(rows);
      setPage(0);
    });
    return () => unsub();
  }, [role, user?.uid]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const fromDate = filters?.from ? new Date(filters.from) : undefined;
    const toDate = filters?.to ? new Date(filters.to) : undefined;
    return items.filter((i) => {
      if (q) {
        const matchesQuery = (i.recipientName || '').toLowerCase().includes(q) ||
          (i.phone || '').toLowerCase().includes(q) ||
          (i.message || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (filters?.status && i.status !== filters.status) return false;
      if (filters?.user && role === 'admin' && i.userId !== filters.user) return false;
      const dateVal = i.createdAt || i.scheduledFor;
      if (fromDate) {
        const d = dateVal?.seconds ? new Date(dateVal.seconds * 1000) : new Date(dateVal);
        if (d < fromDate) return false;
      }
      if (toDate) {
        const d = dateVal?.seconds ? new Date(dateVal.seconds * 1000) : new Date(dateVal);
        if (d > toDate) return false;
      }
      return true;
    });
  }, [items, search, filters, role]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  function badgeFor(status: LogItem['status']) {
    if (status === 'sent') return <Badge variant="success">sent</Badge>;
    if (status === 'scheduled') return <Badge variant="warning">scheduled</Badge>;
    return <Badge variant="destructive">failed</Badge>;
  }

  function exportCsv() {
    const rows = filtered.map((i) => ({
      recipientName: i.recipientName || '',
      phone: i.phone || '',
      status: i.status,
      message: i.message,
      createdAt: formatDate(i.createdAt || i.scheduledFor),
      userId: i.userId,
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whatsx_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full md:w-80">
          <Search size={16} className="text-gray-500" />
          <Input placeholder="Search logs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" onClick={exportCsv}><Download size={16} /> Export CSV</Button>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800">
        <Table>
          <Thead>
            <Tr>
              <Th>Recipient</Th>
              <Th>Phone</Th>
              <Th>Message</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              {role === 'admin' && <Th>User</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {paged.map((i) => (
              <Tr key={i.id}>
                <Td>{i.recipientName || '—'}</Td>
                <Td className="whitespace-nowrap">{i.phone || '—'}</Td>
                <Td className="max-w-[380px]">{truncate(i.message, 120)}</Td>
                <Td>{badgeFor(i.status)}</Td>
                <Td className="whitespace-nowrap">{formatDate(i.createdAt || i.scheduledFor)}</Td>
                {role === 'admin' && <Td><span className="text-xs text-gray-500">{i.userId}</span></Td>}
              </Tr>
            ))}
            {paged.length === 0 && (
              <Tr><Td className="text-sm text-gray-500" colSpan={role === 'admin' ? 6 : 5}>No logs</Td></Tr>
            )}
          </Tbody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2 text-sm">
        <span>Page {page + 1} / {totalPages}</span>
        <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
        <Button variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next</Button>
      </div>
    </div>
  );
}
