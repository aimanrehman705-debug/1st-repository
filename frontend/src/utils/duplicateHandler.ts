import type { CsvContact } from './csvParser';

export function dedupeContacts(contacts: CsvContact[]) {
  const seen = new Set<string>();
  const unique: CsvContact[] = [];
  let removed = 0;
  for (const c of contacts) {
    const key = normalizePhone(c.phone);
    if (!key) continue;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ ...c, phone: key });
    } else {
      removed++;
    }
  }
  return { uniqueContacts: unique, removedCount: removed };
}

function normalizePhone(phone: string) {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9+]/g, '');
  return digits;
}
