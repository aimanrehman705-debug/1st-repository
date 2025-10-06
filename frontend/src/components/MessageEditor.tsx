import { ChangeEvent, useMemo } from 'react'
import { handleVariableReplacement, exampleContact } from '@utils/templateUtils'

export default function MessageEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const preview = useMemo(() => handleVariableReplacement(value, exampleContact), [value])
  function onInput(e: ChangeEvent<HTMLTextAreaElement>) { onChange(e.target.value) }
  return (
    <div className="space-y-2">
      <textarea className="min-h-[160px] w-full resize-y rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900" placeholder="Type your message..." value={value} onChange={onInput} />
      <p className="text-xs text-gray-500 dark:text-gray-400">Use variables like {{'{{name}}'}}, {{'{{date}}'}}, {{'{{time}}'}} to personalize messages.</p>
      <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
        <div className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-300">Preview</div>
        <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{preview || '—'}</div>
      </div>
    </div>
  )
}
