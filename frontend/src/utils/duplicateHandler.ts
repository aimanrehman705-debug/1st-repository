import type { Contact } from '@components/ContactInput'

export function mergeAndDeduplicate(manual: Contact[], csv: { name?: string; phone?: string }[]): { contacts: Contact[]; removed: number } {
  const map = new Map<string, Contact>()
  const add = (c?: { name?: string; phone?: string }) => {
    const phone = String(c?.phone || '').replace(/\D/g, '')
    if (!phone) return
    const name = String(c?.name || '').trim()
    map.set(phone, { name, phone })
  }
  manual.forEach(add)
  csv.forEach(add)
  const contacts = Array.from(map.values())
  const removed = manual.length + csv.length - contacts.length
  return { contacts, removed }
}
