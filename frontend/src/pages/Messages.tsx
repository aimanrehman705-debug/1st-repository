import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import Button from '@components/Button'
import ContactInput, { Contact } from '@components/ContactInput'
import CSVUploader from '@components/CSVUploader'
import MessageEditor from '@components/MessageEditor'
import SchedulePicker from '@components/SchedulePicker'
import MessageLogsTable from '@components/MessageLogsTable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-dropdown-menu'
import api from '@services/api'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '@services/firebase'
import { useAuth } from '@hooks/useAuth'
import { mergeAndDeduplicate } from '@utils/duplicateHandler'
import { toast } from 'sonner'
import { handleVariableReplacement } from '@utils/templateUtils'

export default function Messages() {
  const { user, isAdmin } = useAuth()
  const [manualContacts, setManualContacts] = useState<Contact[]>([{ name: '', phone: '' }])
  const [csvContacts, setCsvContacts] = useState<{ name?: string; phone?: string }[]>([])
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual')
  const [templates, setTemplates] = useState<{ id: string; title: string; messageBody: string }[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [message, setMessage] = useState('')
  const [mediaUrl, setMediaUrl] = useState<string>('')
  const [mode, setMode] = useState<'now' | 'later'>('now')
  const [datetime, setDatetime] = useState('')
  const [sending, setSending] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    const tUnsub = onSnapshot(query(collection(db, 'templates'), orderBy('createdAt', 'desc')), (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      setTemplates(arr)
    })
    const base = collection(db, 'messages')
    const q = isAdmin ? query(base, orderBy('createdAt', 'desc')) : query(base, where('userId', '==', user?.uid || ''), orderBy('createdAt', 'desc'))
    const mUnsub = onSnapshot(q, (snap) => setLogs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))))
    return () => { tUnsub(); mUnsub() }
  }, [user?.uid, isAdmin])

  const mergedContacts = useMemo(() => mergeAndDeduplicate(manualContacts, csvContacts), [manualContacts, csvContacts])
  useEffect(() => {
    if (mergedContacts.removed > 0) {
      toast.info('Duplicate contacts removed automatically.')
    }
  }, [mergedContacts.removed])

  async function onSendNow() {
    try {
      setSending(true)
      const recipients = mergedContacts.contacts.map((c) => c.phone)
      const variables: Record<string, any> = {}
      mergedContacts.contacts.forEach((c) => { variables[c.phone] = { name: c.name } })

      const payload: any = { recipients, text: message, templateId: selectedTemplate || undefined, variables }
      if (mediaUrl) payload.mediaUrl = mediaUrl

      const res = await api.post('/messages/send', payload)
      toast.success(`Sent to ${res.data.results?.length ?? 0} recipients`)
    } catch (e) {
      toast.error('Failed to send messages')
    } finally {
      setSending(false)
    }
  }

  async function onSchedule() {
    if (!datetime) return
    try {
      setSending(true)
      const recipients = mergedContacts.contacts.map((c) => c.phone)
      const variables: Record<string, any> = {}
      mergedContacts.contacts.forEach((c) => { variables[c.phone] = { name: c.name } })
      const payload: any = { recipients, text: message, templateId: selectedTemplate || undefined, variables, scheduledAt: datetime }
      if (mediaUrl) payload.mediaUrl = mediaUrl
      await api.post('/messages/schedule', payload)
      toast.success('Messages scheduled')
    } catch (e) {
      toast.error('Failed to schedule messages')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Messaging & Scheduling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <button className={`rounded-md px-3 py-1.5 ${activeTab === 'manual' ? 'bg-gray-900 text-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800/60'}`} onClick={() => setActiveTab('manual')}>Manual Entry</button>
                <button className={`rounded-md px-3 py-1.5 ${activeTab === 'csv' ? 'bg-gray-900 text-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800/60'}`} onClick={() => setActiveTab('csv')}>CSV Upload</button>
              </div>
              {activeTab === 'manual' ? (
                <ContactInput contacts={manualContacts} onChange={setManualContacts} />
              ) : (
                <CSVUploader onParsed={setCsvContacts} />
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Template</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" value={selectedTemplate} onChange={(e) => {
                  const id = e.target.value
                  setSelectedTemplate(id)
                  const t = templates.find((x) => x.id === id)
                  if (t) setMessage(t.messageBody)
                }}>
                  <option value="">None</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>

              <MessageEditor value={message} onChange={setMessage} />

              <div className="space-y-1">
                <label className="text-sm font-medium">Optional Image URL</label>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900" placeholder="https://example.com/image.jpg" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
              </div>

              <SchedulePicker mode={mode} onModeChange={setMode} datetime={datetime} onDatetimeChange={setDatetime} />

              <div className="flex gap-2">
                <Button disabled={sending} onClick={onSendNow}>{sending ? 'Sending…' : 'Send Now'}</Button>
                <Button disabled={sending || !datetime} onClick={onSchedule}>Schedule</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <MessageLogsTable logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}
