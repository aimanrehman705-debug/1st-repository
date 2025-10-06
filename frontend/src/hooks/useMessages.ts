import { useState } from 'react'
import Papa from 'papaparse'
import api from '@services/api'
import { toast } from 'sonner'

export function useMessages() {
  const [recipients, setRecipients] = useState<string[]>([])

  function addRecipientsFromCSV(file: File) {
    Papa.parse<string[]>(file, {
      complete: (results) => {
        const values: string[] = []
        for (const row of results.data as unknown as string[][]) {
          for (const cell of row) {
            const trimmed = String(cell).trim()
            if (trimmed) values.push(trimmed)
          }
        }
        const unique = Array.from(new Set(values))
        setRecipients(unique)
        toast.success(`Loaded ${unique.length} recipients from CSV`)
      },
    })
  }

  async function sendNow(payload: { text?: string; templateId?: string; variables?: Record<string, any>; mediaUrl?: string }) {
    const res = await api.post('/messages/send', { recipients, ...payload })
    toast.success(`Sent to ${res.data.results?.length ?? 0} recipients`)
  }

  async function schedule(payload: { text?: string; templateId?: string; variables?: Record<string, any>; mediaUrl?: string; scheduledAt: string }) {
    const res = await api.post('/messages/schedule', { recipients, ...payload })
    toast.success(`Scheduled ${res.data.count ?? 0} messages`)
  }

  return { recipients, setRecipients, addRecipientsFromCSV, sendNow, schedule }
}
