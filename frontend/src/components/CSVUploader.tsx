import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { parseCsv, CsvContact } from '../utils/csvParser';
import { Button } from './ui/button';

export function CSVUploader({ onParsed }: { onParsed: (rows: CsvContact[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string>('');
  const [preview, setPreview] = useState<CsvContact[]>([]);

  function pickFile() {
    inputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const text = await file.text();
    const rows = parseCsv(text);
    setPreview(rows.slice(0, 5));
    onParsed(rows);
  }

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onFileChange} />
      <Button variant="outline" onClick={pickFile}><Upload size={16} /> Upload CSV</Button>
      {filename && <div className="text-sm text-gray-500">Selected: {filename}</div>}
      {preview.length > 0 && (
        <div className="text-xs text-gray-500">
          Preview ({preview.length} rows shown): {preview.map((p) => `${p.name || '—'} • ${p.phone}`).join(', ')}
        </div>
      )}
    </div>
  );
}
