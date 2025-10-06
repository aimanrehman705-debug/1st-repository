import { firestore } from '../config/firebase.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

function fillTemplate(content, variables = {}) {
  return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => variables[key] ?? '');
}

export async function sendMessage(req, res, next) {
  try {
    const { recipients = [], text, templateId, variables, mediaUrl } = req.body;
    if ((!text && !templateId) || recipients.length === 0) {
      return res.status(400).json({ error: 'recipients and text or templateId required' });
    }

    const uniqueRecipients = Array.from(new Set(recipients.map(r => String(r))));

    let templateContent = text;
    if (templateId) {
      const tDoc = await firestore.collection('templates').doc(templateId).get();
      if (!tDoc.exists) return res.status(400).json({ error: 'Template not found' });
      templateContent = tDoc.data().content;
    }

    const results = [];
    for (const to of uniqueRecipients) {
      const body = fillTemplate(templateContent, variables?.[to] || variables || {});
      const logRef = await firestore.collection('messages').add({
        userId: req.user.uid,
        to,
        text: body,
        mediaUrl: mediaUrl || null,
        status: 'sent',
        createdAt: new Date(),
      });
      try {
        const apiRes = await sendWhatsAppMessage({ to, text: body, mediaUrl });
        await logRef.update({ providerResponse: apiRes, sentAt: new Date() });
        results.push({ to, status: 'sent' });
      } catch (err) {
        await logRef.update({ status: 'failed', error: String(err?.response?.data || err?.message || err) });
        results.push({ to, status: 'failed' });
      }
    }

    res.json({ success: true, results });
  } catch (err) { next(err); }
}

export async function scheduleMessage(req, res, next) {
  try {
    const { recipients = [], text, templateId, variables, mediaUrl, scheduledAt } = req.body;
    if ((!text && !templateId) || recipients.length === 0 || !scheduledAt) {
      return res.status(400).json({ error: 'recipients, scheduledAt and text or templateId required' });
    }
    const scheduleTime = new Date(scheduledAt);
    if (Number.isNaN(scheduleTime.getTime())) return res.status(400).json({ error: 'Invalid scheduledAt datetime' });

    let templateContent = text;
    if (templateId) {
      const tDoc = await firestore.collection('templates').doc(templateId).get();
      if (!tDoc.exists) return res.status(400).json({ error: 'Template not found' });
      templateContent = tDoc.data().content;
    }

    const uniqueRecipients = Array.from(new Set(recipients.map(r => String(r))));
    const batch = firestore.batch();

    for (const to of uniqueRecipients) {
      const body = fillTemplate(templateContent, variables?.[to] || variables || {});
      const ref = firestore.collection('messages').doc();
      batch.set(ref, {
        userId: req.user.uid,
        to,
        text: body,
        mediaUrl: mediaUrl || null,
        status: 'scheduled',
        scheduledAt: scheduleTime,
        createdAt: new Date(),
      });
    }

    await batch.commit();
    res.status(201).json({ success: true, count: uniqueRecipients.length });
  } catch (err) { next(err); }
}

export async function listMyMessages(req, res, next) {
  try {
    const snap = await firestore
      .collection('messages')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { next(err); }
}

export async function listAllMessages(req, res, next) {
  try {
    const snap = await firestore
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { next(err); }
}
