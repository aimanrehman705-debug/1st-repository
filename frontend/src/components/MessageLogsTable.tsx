import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { formatDateTime } from '@utils/helpers'

export type LogItem = { id: string; to: string; recipientName?: string; text: string; status: string; createdAt?: any; sentAt?: any }

export default function MessageLogsTable({ logs }: { logs: LogItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipient</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <div className="font-medium">{m.recipientName || '-'}</div>
              <div className="font-mono text-xs text-gray-500">{m.to}</div>
            </TableCell>
            <TableCell className="max-w-md truncate" title={m.text}>{m.text}</TableCell>
            <TableCell>{m.status}</TableCell>
            <TableCell>{formatDateTime(m.sentAt || m.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
