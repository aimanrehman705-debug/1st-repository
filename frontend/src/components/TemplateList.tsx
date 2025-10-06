import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import Button from './Button'
import { FileText, Pencil, Trash2, Play } from 'lucide-react'

export type TemplateItem = {
  id: string
  title: string
  messageBody: string
  createdAt?: any
}

export default function TemplateList({
  templates,
  isAdmin,
  onEdit,
  onDelete,
  onUse,
}: {
  templates: TemplateItem[]
  isAdmin: boolean
  onEdit: (t: TemplateItem) => void
  onDelete: (t: TemplateItem) => void
  onUse: (t: TemplateItem) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Message Preview</TableHead>
          <TableHead className="w-48">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="font-medium"><div className="flex items-center gap-2"><FileText size={16} className="text-primary-600" /> {t.title}</div></TableCell>
            <TableCell className="text-sm text-gray-600 dark:text-gray-300">{(t.messageBody || '').slice(0, 60)}{(t.messageBody || '').length > 60 ? '…' : ''}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => onUse(t)}><Play size={14} className="mr-1" />Use</Button>
                {isAdmin && <Button onClick={() => onEdit(t)}><Pencil size={14} className="mr-1" />Edit</Button>}
                {isAdmin && <Button className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(t)}><Trash2 size={14} className="mr-1" />Delete</Button>}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
