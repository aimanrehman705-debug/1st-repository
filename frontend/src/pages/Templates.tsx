import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Card } from '../components/Card';

export function Templates() {
  const [items, setItems] = useState<{ id: string; name: string; content: string }[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('Hello {{name}}, your appointment is at {{time}}.');

  async function load() {
    const res = await api.get('/templates');
    setItems(res.data);
  }

  useEffect(() => { load().catch(() => {}); }, []);

  async function create() {
    try {
      await api.post('/templates', { name, content });
      setName('');
      toast.success('Template created');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  async function update(id: string, nextContent: string) {
    try {
      await api.put(`/templates/${id}`, { content: nextContent });
      toast.success('Updated');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/templates/${id}`);
      toast.success('Deleted');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <Card>
        <div className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <button onClick={create} className="px-3 py-2 rounded bg-primary-500 text-white">Create</button>
        </div>
      </Card>

      <div className="grid gap-3">
        {items.map((t) => (
          <Card key={t.id}>
            <div className="p-4 space-y-2">
              <div className="font-medium">{t.name}</div>
              <textarea className="w-full h-20 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" defaultValue={t.content} onBlur={(e) => update(t.id, e.target.value)} />
              <div className="flex justify-end"><button onClick={() => remove(t.id)} className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700">Delete</button></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
