import Card from '@components/Card'
import { Table, THead, TBody, TR, TH, TD } from '@components/Table'
import { useEffect, useState } from 'react'
import api from '@services/api'
import { formatDateTime } from '@utils/helpers'

interface Message { id: string; to: string; status: string; text: string; createdAt: string; sentAt?: string }

export default function Logs() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    async function load() {
      const res = await api.get('/messages/all')
      setMessages(res.data)
    }
    load()
  }, [])

  return (
    <Card>
      <h3 className="mb-3 text-lg font-semibold">All Message Logs</h3>
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
          {messages.map(m => (
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
  )
}
