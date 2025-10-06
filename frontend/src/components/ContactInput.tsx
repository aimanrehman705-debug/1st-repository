import { Plus, Trash2 } from 'lucide-react'
import Button from './Button'

export type Contact = { name: string; phone: string }

export default function ContactInput({ contacts, onChange }: { contacts: Contact[]; onChange: (contacts: Contact[]) => void }) {
  function addRow() {
    onChange([...contacts, { name: '', phone: '' }])
  }
  function removeRow(index: number) {
    const next = contacts.slice()
    next.splice(index, 1)
    onChange(next)
  }
  function update(index: number, key: keyof Contact, value: string) {
    const next = contacts.slice()
    next[index] = { ...next[index], [key]: value }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {contacts.map((c, i) => (
        <div key={i} className="grid grid-cols-12 items-center gap-2">
          <input className="col-span-5 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" placeholder="Name" value={c.name} onChange={(e) => update(i, 'name', e.target.value)} />
          <input className="col-span-6 rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" placeholder="Phone" value={c.phone} onChange={(e) => update(i, 'phone', e.target.value)} />
          <Button className="col-span-1 bg-red-600 hover:bg-red-700" onClick={() => removeRow(i)} aria-label="Remove"><Trash2 size={16} /></Button>
        </div>
      ))}
      <div>
        <Button onClick={addRow}><Plus size={16} className="mr-1" />Add Row</Button>
      </div>
    </div>
  )
}
