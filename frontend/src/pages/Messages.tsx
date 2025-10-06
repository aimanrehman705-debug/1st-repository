import Card from '@components/Card'
import Button from '@components/Button'
import { useEffect, useState } from 'react'
import { useMessages } from '@hooks/useMessages'
import api from '@services/api'
import { Table, THead, TBody, TR, TH, TD } from '@components/Table'
import { formatDateTime } from '@utils/helpers'

export default function Messages() {
  const { recipients, setRecipients, addRecipientsFromCSV, sendNow, schedule } = useMessages()
  const [text, setText] = useState('')
  const [scheduleAt, setScheduleAt] = useState('')
  const [myLogs, setMyLogs] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/messages/me')
        setMyLogs(res.data)
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <h3 className="mb-3 text-lg font-semibold">Recipients</h3>
        <textarea className="h-40 w-full rounded-md border p-2" placeholder="One number per line" value={recipients.join('\n')} onChange={e => setRecipients(e.target.value.split('\n').map(v => v.trim()).filter(Boolean))} />
        <div className="mt-2 flex items-center gap-3">
          <input type="file" accept=".csv" onChange={e => e.target.files?.[0] && addRecipientsFromCSV(e.target.files[0])} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-lg font-semibold">Compose</h3>
        <textarea className="h-40 w-full rounded-md border p-2" placeholder="Type your message or use {{name}} placeholders" value={text} onChange={e => setText(e.target.value)} />
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={() => sendNow({ text })}>Send Now</Button>
          <input type="datetime-local" className="rounded-md border p-2" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} />
          <Button onClick={() => schedule({ text, scheduledAt: scheduleAt })}>Schedule</Button>
        </div>
      </Card>

      <Card className="md:col-span-2">
        <h3 className="mb-3 text-lg font-semibold">My Recent Messages</h3>
        <Table>
          <THead>
            <TR>
              <TH>To</TH>
              <TH>Status</TH>
              <TH>Text</TH>
              <TH>Created</TH>
              <TH>Sent</TH>
            </TR>
          </THead>
          <TBody>
            {myLogs.map((m) => (
              <TR key={m.id}>
                <TD className="font-mono">{m.to}</TD>
                <TD>{m.status}</TD>
                <TD className="truncate max-w-xs" title={m.text}>{m.text}</TD>
                <TD>{formatDateTime(m.createdAt)}</TD>
                <TD>{m.sentAt ? formatDateTime(m.sentAt) : '-'}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  )
}
