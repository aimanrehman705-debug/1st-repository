import { useState } from 'react'
import { parseCSV, CSVContact } from '@utils/csvParser'
import Button from './Button'
import { Upload } from 'lucide-react'

export default function CSVUploader({ onParsed }: { onParsed: (rows: CSVContact[]) => void }) {
  const [fileName, setFileName] = useState<string>('')
  const [preview, setPreview] = useState<CSVContact[]>([])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const rows = await parseCSV(file)
    setPreview(rows.slice(0, 5))
    onParsed(rows)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input type="file" accept=".csv" onChange={onFile} />
        {fileName && <span className="text-sm text-gray-600 dark:text-gray-300">{fileName}</span>}
      </div>
      {preview.length > 0 && (
        <div className="rounded-md border border-gray-200 p-3 text-sm dark:border-gray-800">
          <div className="mb-2 font-medium">CSV Preview (first 5 rows)</div>
          <ul className="list-disc pl-5">
            {preview.map((r, i) => (
              <li key={i}><span className="font-mono">{r.name}</span> — <span className="font-mono">{r.phone}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
