export interface CsvContact { name?: string; phone: string }

// Simple CSV parser for 'name,phone' with basic quote handling
export function parseCsv(text: string): CsvContact[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const header = splitCsvLine(lines[0]);
  const nameIdx = header.findIndex((h) => /name/i.test(h));
  const phoneIdx = header.findIndex((h) => /phone|number|mobile/i.test(h));

  const dataLines = (nameIdx === -1 && phoneIdx === -1) ? lines : lines.slice(1);

  const contacts: CsvContact[] = [];
  for (const line of dataLines) {
    const cols = splitCsvLine(line);
    let name: string | undefined;
    let phone: string | undefined;
    if (nameIdx !== -1 || phoneIdx !== -1) {
      name = nameIdx !== -1 ? cols[nameIdx] : undefined;
      phone = phoneIdx !== -1 ? cols[phoneIdx] : undefined;
    } else {
      // fallback: assume 2 columns
      name = cols[0];
      phone = cols[1] || cols[0];
    }
    if (phone) contacts.push({ name: name || undefined, phone: String(phone).trim() });
  }
  return contacts;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { // escaped quote
        current += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current);
  return result.map((s) => s.trim());
}
