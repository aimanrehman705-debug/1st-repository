import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/ui/table';
import { Edit, Trash2, UserPlus } from 'lucide-react';

interface UserItem { id: string; email: string; role: 'admin' | 'user'; name?: string }

export function Users() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [creating, setCreating] = useState({ email: '', password: '', role: 'user' as 'user' | 'admin', name: '' });

  async function load() {
    const res = await api.get('/users');
    setItems(res.data);
  }

  useEffect(() => { load().catch(() => {}); }, []);

  const filtered = useMemo(() => items.filter((u) => {
    const matchQuery = (u.email || '').toLowerCase().includes(query.toLowerCase()) || (u.name || '').toLowerCase().includes(query.toLowerCase());
    const matchRole = roleFilter === 'all' ? true : u.role === roleFilter;
    return matchQuery && matchRole;
  }), [items, query, roleFilter]);

  async function create() {
    try {
      await api.post('/users', { email: creating.email, password: creating.password, role: creating.role, name: creating.name });
      setCreating({ email: '', password: '', role: 'user', name: '' });
      toast.success('User created');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  async function updateRole(id: string, nextRole: 'admin' | 'user') {
    try {
      await api.put(`/users/${id}`, { role: nextRole });
      toast.success('Role updated');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  async function remove(id: string) {
    try {
      if (!window.confirm('Delete this user? This cannot be undone.')) return;
      await api.delete(`/users/${id}`);
      toast.success('Deleted');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <Card>
        <div className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-2 md:items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Search</label>
              <Input placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-2">
            <Input placeholder="Name (optional)" value={creating.name} onChange={(e) => setCreating({ ...creating, name: e.target.value })} />
            <Input placeholder="Email" value={creating.email} onChange={(e) => setCreating({ ...creating, email: e.target.value })} />
            <Input placeholder="Password" value={creating.password} onChange={(e) => setCreating({ ...creating, password: e.target.value })} />
            <div className="flex gap-2">
              <Select value={creating.role} onChange={(e) => setCreating({ ...creating, role: e.target.value as any })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
              <Button onClick={create}><UserPlus size={16} /> Add User</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4 overflow-auto rounded-lg border border-gray-200 dark:border-neutral-800">
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th className="w-40">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((u) => (
                <Tr key={u.id}>
                  <Td>{u.name || '—'}</Td>
                  <Td>{u.email}</Td>
                  <Td>
                    <Select value={u.role} onChange={(e) => updateRole(u.id, e.target.value as any)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button variant="outline"><Edit size={16} /> Edit</Button>
                      <Button variant="outline" onClick={() => remove(u.id)}><Trash2 size={16} /> Delete</Button>
                    </div>
                  </Td>
                </Tr>
              ))}
              {filtered.length === 0 && (
                <Tr><Td colSpan={4} className="text-sm text-gray-500">No users</Td></Tr>
              )}
            </Tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
