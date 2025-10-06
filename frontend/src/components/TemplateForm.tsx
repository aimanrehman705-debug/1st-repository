import { ChangeEvent } from 'react'
import { handleVariableReplacement, exampleContact } from '@utils/templateUtils'

export type TemplateInput = {
  title: string
  messageBody: string
}

export default function TemplateForm({ value, onChange }: { value: TemplateInput; onChange: (v: TemplateInput) => void }) {
  function update<K extends keyof TemplateInput>(key: K) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [key]: e.target.value })
  }

  const preview = handleVariableReplacement(value.messageBody, exampleContact)

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium">Template Title</label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
          placeholder="Appointment Reminder"
          value={value.title}
          onChange={update('title')}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Message Body</label>
        <textarea
          className="min-h-[140px] w-full resize-y rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
          placeholder="Hello {{name}}, your appointment is on {{date}} at {{time}}."
          value={value.messageBody}
          onChange={update('messageBody')}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">Use variables like {{'{{name}}'}}, {{'{{date}}'}}, {{'{{time}}'}} to personalize messages.</p>
      </div>

      <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
        <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">Preview</div>
        <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{preview || '—'}</div>
      </div>
    </div>
  )
}
