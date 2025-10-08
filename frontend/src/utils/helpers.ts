export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ');
}

export function truncate(text: string, max = 80) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

export function formatDate(input?: any) {
  if (!input) return '';
  const date = input?.seconds ? new Date(input.seconds * 1000) : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export function toCsv(rows: Array<Record<string, any>>) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => {
    const s = String(v ?? '').replaceAll('"', '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(','));
  }
  return lines.join('\n');
}
