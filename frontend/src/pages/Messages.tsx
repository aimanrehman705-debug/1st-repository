import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Card } from '../components/Card';

export function Messages() {
  const [recipients, setRecipients] = useState('');
  const [csv, setCsv] = useState('');
  const [templates, setTemplates] = useState<{ id: string; name: string; content: string }[]>([]);
  const [templateId, setTemplateId] = useState('');
  const [variables, setVariables] = useState('{"name":"John","time":"10:00"}');
  const [message, setMessage] = useState('Hello!');
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/templates');
        setTemplates(res.data);
      } catch {}
    })();
  }, []);

  async function onSend() {
    setLoading(true);
    try {
      const res = await api.post('/messages/send', {
        recipients: recipients.split(',').map((s) => s.trim()).filter(Boolean),
        message,
        templateId: templateId || undefined,
        variables: templateId ? JSON.parse(variables || '{}') : undefined,
      });
      toast.success(`Sent ${res.data.count} messages`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  async function onSchedule() {
    setLoading(true);
    try {
      const res = await api.post('/messages/schedule', {
        recipients: recipients.split(',').map((s) => s.trim()).filter(Boolean),
        message,
        templateId: templateId || undefined,
        variables: templateId ? JSON.parse(variables || '{}') : undefined,
        scheduledFor: schedule ? new Date(schedule).toISOString() : undefined,
      });
      toast.success(`Scheduled for ${new Date(res.data.scheduledFor).toLocaleString()}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || 'Failed to schedule');
    } finally {
      setLoading(false);
    }
  }

  async function onUploadCsvAndSend() {
    setLoading(true);
    try {
      const res = await api.post('/messages/upload-csv', {
        csv,
        message,
        templateId: templateId || undefined,
        variables: templateId ? JSON.parse(variables || '{}') : undefined,
      });
      toast.success(`Sent ${res.data.count} messages from CSV`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Messages</h1>
      <Card>
        <div className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500">Recipients (comma-separated)</label>
              <input className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={recipients} onChange={(e) => setRecipients(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-500">Template</label>
              <select className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                <option value="">— None —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {templateId ? (
            <div>
              <label className="text-sm text-gray-500">Template Variables (JSON)</label>
              <textarea className="w-full h-24 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={variables} onChange={(e) => setVariables(e.target.value)} />
            </div>
          ) : (
            <div>
              <label className="text-sm text-gray-500">Custom Message</label>
              <textarea className="w-full h-24 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500">Schedule</label>
              <input type="datetime-local" className="w-full px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-500">CSV Contacts (one per line)</label>
              <textarea className="w-full h-24 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-transparent" value={csv} onChange={(e) => setCsv(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <button disabled={loading} onClick={onSend} className="px-3 py-2 rounded bg-primary-500 text-white hover:opacity-90">Send Now</button>
            <button disabled={loading} onClick={onSchedule} className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700">Schedule</button>
            <button disabled={loading} onClick={onUploadCsvAndSend} className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700">Send from CSV</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
