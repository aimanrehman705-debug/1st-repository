import { useMemo } from 'react';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import { renderTemplate } from '../utils/messageUtils';

interface Template { id: string; name: string; content: string }

export function MessageEditor({
  templates,
  selectedTemplate,
  onSelectTemplate,
  variables,
  setVariables,
  message,
  setMessage,
}: {
  templates: Template[];
  selectedTemplate?: string;
  onSelectTemplate: (id: string) => void;
  variables: Record<string, any>;
  setVariables: (v: Record<string, any>) => void;
  message: string;
  setMessage: (m: string) => void;
}) {
  const sample = useMemo(() => renderTemplate(message, { name: 'John', time: '10:00' }), [message]);

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500">Template</label>
          <Select value={selectedTemplate || ''} onChange={(e) => onSelectTemplate(e.target.value)}>
            <option value="">— None —</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Template Variables (JSON)</label>
          <Input placeholder='{"name":"John","time":"10:00"}' value={JSON.stringify(variables)} onChange={(e) => {
            try { setVariables(JSON.parse(e.target.value || '{}')); } catch {}
          }} />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500">Message</label>
        <textarea className="w-full h-28 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <div className="text-xs text-gray-500 flex items-center gap-2">
        <FileText size={16} />
        <span>Preview:</span>
      </div>
      <div className="p-3 rounded border border-dashed border-gray-300 dark:border-neutral-700 text-sm whitespace-pre-wrap">
        {sample}
      </div>
    </div>
  );
}
