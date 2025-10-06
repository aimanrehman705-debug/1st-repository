import { ChangeEvent } from 'react'

export default function SchedulePicker({ mode, onModeChange, datetime, onDatetimeChange }: {
  mode: 'now' | 'later'
  onModeChange: (m: 'now' | 'later') => void
  datetime: string
  onDatetimeChange: (v: string) => void
}) {
  function setMode(e: ChangeEvent<HTMLInputElement>) {
    onModeChange(e.target.value as 'now' | 'later')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="sendmode" value="now" checked={mode === 'now'} onChange={setMode} /> Send Now
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="sendmode" value="later" checked={mode === 'later'} onChange={setMode} /> Schedule for Later
        </label>
      </div>
      {mode === 'later' && (
        <input type="datetime-local" className="rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900" value={datetime} onChange={(e) => onDatetimeChange(e.target.value)} />
      )}
    </div>
  )
}
