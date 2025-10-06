import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Button from '@components/Button'
import TemplateList, { TemplateItem } from '@components/TemplateList'
import TemplateModal from '@components/TemplateModal'
import TemplateForm, { TemplateInput } from '@components/TemplateForm'
import { db } from '@services/firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'

export default function Templates() {
  const { isAdmin, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TemplateItem | null>(null)
  const [input, setInput] = useState<TemplateInput>({ title: '', messageBody: '' })
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const list: TemplateItem[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      setTemplates(list)
    })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    if (!s) return templates
    return templates.filter((t) => t.title?.toLowerCase().includes(s))
  }, [templates, search])

  function openCreate() {
    setEditing(null)
    setInput({ title: '', messageBody: '' })
    setOpen(true)
  }

  function openEdit(t: TemplateItem) {
    setEditing(t)
    setInput({ title: t.title || '', messageBody: t.messageBody || '' })
    setOpen(true)
  }

  async function save() {
    if (!input.title.trim() || !input.messageBody.trim()) {
      toast.error('Title and message are required')
      return
    }
    try {
      if (editing) {
        await updateDoc(doc(db, 'templates', editing.id), {
          title: input.title.trim(),
          messageBody: input.messageBody.trim(),
          updatedAt: serverTimestamp(),
        })
        toast.success('Template updated')
      } else {
        await addDoc(collection(db, 'templates'), {
          title: input.title.trim(),
          messageBody: input.messageBody.trim(),
          createdBy: user?.uid || 'unknown',
          createdAt: serverTimestamp(),
        })
        toast.success('Template created')
      }
      setOpen(false)
    } catch (e) {
      toast.error('Failed to save template')
    }
  }

  async function confirmDelete(t: TemplateItem) {
    if (!isAdmin) return
    const ok = window.confirm(`Delete template "${t.title}"?`)
    if (!ok) return
    try {
      await deleteDoc(doc(db, 'templates', t.id))
      toast.success('Template deleted')
    } catch (e) {
      toast.error('Failed to delete template')
    }
  }

  function useTemplate(t: TemplateItem) {
    // For now, navigate users to Messages page with suggestion (could implement context/global state)
    toast.info('Template copied to composer. Go to Messages to paste/use it.')
    navigator.clipboard?.writeText(t.messageBody || '')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Message Templates</CardTitle>
          {isAdmin && <Button onClick={openCreate}>Add Template</Button>}
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center justify-between gap-3">
            <input
              className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <TemplateList templates={filtered} isAdmin={!!isAdmin} onEdit={openEdit} onDelete={confirmDelete} onUse={useTemplate} />
        </CardContent>
      </Card>

      <TemplateModal open={open} title={editing ? 'Edit Template' : 'Add Template'} onClose={() => setOpen(false)}>
        <TemplateForm value={input} onChange={setInput} />
        <div className="mt-4 flex justify-end gap-2">
          <Button className="bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </div>
      </TemplateModal>
    </div>
  )
}
