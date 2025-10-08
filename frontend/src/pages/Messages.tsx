import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Card } from '../components/Card';
import { ContactInput, type ContactRow } from '../components/ContactInput';
import { CSVUploader } from '../components/CSVUploader';
import { MessageEditor } from '../components/MessageEditor';
import { SchedulePicker } from '../components/SchedulePicker';
import { MessageLogsTable } from '../components/MessageLogsTable';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { parseCsv } from '../utils/csvParser';
import { dedupeContacts } from '../utils/duplicateHandler';
import { renderTemplate } from '../utils/messageUtils';
import { Clock, Send, Upload } from 'lucide-react';

export function Messages() {
  const [mode, setMode] = useState<'manual' | 'csv'>('manual');
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [csvContacts, setCsvContacts] = useState<{ name?: string; phone: string }[]>([]);
  const [templates, setTemplates] = useState<{ id: string; name: string; content: string }[]>([]);
  const [templateId, setTemplateId] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, any>>({ name: 'John', time: '10:00' });
  const [message, setMessage] = useState('Hello!');
  const [sendMode, setSendMode] = useState<'now' | 'later'>('now');
  const [datetime, setDatetime] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/templates');
        setTemplates(res.data);
      } catch {}
    })();
  }, []);

  function onTemplateSelect(id: string) {
    setTemplateId(id);
    const t = templates.find((t) => t.id === id);
    if (t) setMessage(renderTemplate(t.content, variables));
  }

  function onCsvParsed(list: { name?: string; phone: string }[]) {
    setCsvContacts(list);
  }

  function onMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setMediaFile(f);
    setMediaPreview(f ? URL.createObjectURL(f) : null);
  }

  const mergedContacts = useMemo(() => {
    const manual = rows.filter((r) => r.phone).map((r) => ({ name: r.name, phone: r.phone }));
    const base = mode === 'csv' ? csvContacts : manual;
    const { uniqueContacts, removedCount } = dedupeContacts(base);
    return { contacts: uniqueContacts, removed: removedCount };
  }, [rows, csvContacts, mode]);

  async function uploadImageIfNeeded(): Promise<string | undefined> {
    // Placeholder: In production, upload to storage and return URL. For now, skip.
    return undefined;
  }

  async function onSend() {
    setLoading(true);
    try {
      const mediaUrl = await uploadImageIfNeeded();
      const res = await api.post('/messages/send', {
        contacts: mergedContacts.contacts,
        message,
        templateId: templateId || undefined,
        variables: templateId ? variables : undefined,
        mediaUrl,
      });
      toast.success(`Sent ${res.data.count} messages`);
      if (mergedContacts.removed > 0) toast.success('Duplicate contacts removed automatically.');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  async function onSchedule() {
    setLoading(true);
    try {
      const mediaUrl = await uploadImageIfNeeded();
      const res = await api.post('/messages/schedule', {
        contacts: mergedContacts.contacts,
        message,
        templateId: templateId || undefined,
        variables: templateId ? variables : undefined,
        scheduledFor: datetime ? new Date(datetime).toISOString() : undefined,
        mediaUrl,
      });
      toast.success(`Scheduled for ${new Date(res.data.scheduledFor).toLocaleString()}`);
      if (mergedContacts.removed > 0) toast.success('Duplicate contacts removed automatically.');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || 'Failed to schedule');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Bulk Messaging & Scheduling</h1>

      <Card>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button variant={mode === 'manual' ? 'primary' : 'outline'} onClick={() => setMode('manual')}>Manual Entry</Button>
            <Button variant={mode === 'csv' ? 'primary' : 'outline'} onClick={() => setMode('csv')}>CSV Upload</Button>
            {mergedContacts.removed > 0 && <Badge variant="secondary">Duplicate contacts removed automatically</Badge>}
          </div>

          {mode === 'manual' ? (
            <ContactInput value={rows} onChange={setRows} />
          ) : (
            <div className="space-y-2">
              <CSVUploader onParsed={onCsvParsed} />
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <MessageEditor
                templates={templates}
                selectedTemplate={templateId}
                onSelectTemplate={onTemplateSelect}
                variables={variables}
                setVariables={setVariables}
                message={message}
                setMessage={setMessage}
              />

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Optional Image</label>
                <input type="file" accept="image/*" onChange={onMediaChange} />
                {mediaPreview && (
                  <div className="flex items-center gap-2">
                    <img src={mediaPreview} alt="preview" className="w-20 h-20 object-cover rounded" />
                    <Button variant="outline" onClick={() => { setMediaFile(null); setMediaPreview(null); }}>Remove</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <SchedulePicker mode={sendMode} setMode={setSendMode} datetime={datetime} setDatetime={setDatetime} />

              <div className="flex gap-2">
                <Button disabled={loading} onClick={onSend}><Send size={16} /> Send Now</Button>
                <Button disabled={loading || sendMode !== 'later' || !datetime} onClick={onSchedule} variant="outline"><Clock size={16} /> Schedule</Button>
              </div>
              <div className="text-sm text-gray-500">Total recipients: {mergedContacts.contacts.length}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-2">Recent Message Logs</h2>
          <MessageLogsTable />
        </div>
      </Card>
    </div>
  );
}
