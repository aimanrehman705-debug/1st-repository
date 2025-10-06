import Card from '@components/Card'
import Button from '@components/Button'
import { Table, THead, TBody, TR, TH, TD } from '@components/Table'
import { useEffect, useState } from 'react'
import api from '@services/api'
import { useAuth } from '@hooks/useAuth'

interface Template { id: string; name: string; content: string }

export default function Templates() {
  const { isAdmin } = useAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  async function load() {
    const res = await api.get('/templates')
    setTemplates(res.data)
  }

  useEffect(() => { load() }, [])

  async function create() {
    await api.post('/templates', { name, content })
    setName(''); setContent('');
    await load()
  }

  async function update(id: string) {
    await api.put(`/templates/${id}`, { name, content })
    setName(''); setContent('');
    await load()
  }

  async function remove(id: string) {
    await api.delete(`/templates/${id}`)
    await load()
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Card>
          <h3 className="mb-3 text-lg font-semibold">Create / Update Template</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-md border px-3 py-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="md:col-span-2 rounded-md border px-3 py-2" placeholder="Content (Hello {{name}} at {{time}})" value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={create}>Save</Button>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Templates</h3>
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Content</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {templates.map(t => (
              <TR key={t.id}>
                <TD>{t.name}</TD>
                <TD className="font-mono text-xs">{t.content}</TD>
                <TD className="space-x-2">
                  {isAdmin && (
                    <>
                      <Button onClick={() => { setName(t.name); setContent(t.content) }}>Edit</Button>
                      <Button className="bg-red-600 hover:bg-red-700" onClick={() => remove(t.id)}>Delete</Button>
                      <Button onClick={() => update(t.id)}>Update</Button>
                    </>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  )
}
