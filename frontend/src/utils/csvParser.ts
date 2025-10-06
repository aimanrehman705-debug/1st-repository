import Papa from 'papaparse'

export type CSVContact = { name?: string; phone?: string }

export function parseCSV(file: File): Promise<CSVContact[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVContact>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data || []).map((row: any) => ({
          name: String(row.name || row.Name || row.fullname || '').trim(),
          phone: String(row.phone || row.Phone || row.number || '').trim(),
        }))
        resolve(rows)
      },
      error: (err) => reject(err),
    })
  })
}
