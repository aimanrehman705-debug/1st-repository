import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Trash2, UserPlus } from 'lucide-react';

export interface ContactRow { id: string; name?: string; phone: string }

export function ContactInput({ value, onChange }: { value: ContactRow[]; onChange: (rows: ContactRow[]) => void }) {
  const [rows, setRows] = useState<ContactRow[]>(value.length ? value : [{ id: crypto.randomUUID(), name: '', phone: '' }]);

  function sync(next: ContactRow[]) {
    setRows(next);
    onChange(next);
  }

  function addRow() {
    sync([...rows, { id: crypto.randomUUID(), name: '', phone: '' }]);
  }

  function updateRow(id: string, patch: Partial<ContactRow>) {
    sync(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    sync(rows.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <Input placeholder="Name (optional)" value={r.name || ''} onChange={(e) => updateRow(r.id, { name: e.target.value })} />
          <Input placeholder="Phone (e.g. +123456789)" value={r.phone} onChange={(e) => updateRow(r.id, { phone: e.target.value })} />
          <Button variant="outline" onClick={() => removeRow(r.id)}><Trash2 size={16} /> Remove</Button>
        </div>
      ))}
      <Button variant="outline" onClick={addRow}><UserPlus size={16} /> Add Recipient</Button>
    </div>
  );
}
