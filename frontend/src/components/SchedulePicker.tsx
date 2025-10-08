import { Select } from './ui/select';
import { Input } from './ui/input';

export function SchedulePicker({
  mode,
  setMode,
  datetime,
  setDatetime,
}: {
  mode: 'now' | 'later';
  setMode: (m: 'now' | 'later') => void;
  datetime?: string;
  setDatetime: (v: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-2 items-end">
      <div>
        <label className="text-xs text-gray-500">Send Mode</label>
        <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
          <option value="now">Send Now</option>
          <option value="later">Schedule for Later</option>
        </Select>
      </div>
      {mode === 'later' && (
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Scheduled Date & Time</label>
          <Input type="datetime-local" value={datetime || ''} onChange={(e) => setDatetime(e.target.value)} />
        </div>
      )}
    </div>
  );
}
