import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';

interface UserItem { id: string; email: string; role: 'admin' | 'user' }

export function Users() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  async function load() {
    const res = await api.get('/users');
    setItems(res.data);
  }

  useEffect(() => { load().catch(() => {}); }, []);

  async function create() {
    try {
      await api.post('/users', { email, password, role });
      setEmail(''); setPassword('');
      toast.success('User created');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  async function update(id: string, nextRole: 'admin' | 'user') {
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
        <div className="p-4 grid md:grid-cols-4 gap-3">
          <input className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button onClick={create} className="px-3 py-2 rounded bg-primary-500 text-white">Create</button>
        </div>
      </Card>

      <div className="grid gap-3">
        {items.map((u) => (
          <Card key={u.id}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.email}</div>
                <div className="text-sm text-gray-500">Role: {u.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <select value={u.role} onChange={(e) => update(u.id, e.target.value as any)} className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button onClick={() => remove(u.id)} className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700">Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
