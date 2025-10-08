import { getFirestore } from '../config/firebase.js';
import { env } from '../config/env.js';
import axios from 'axios';

const MESSAGES_COLLECTION = 'messages';

export function renderTemplate(content, data) {
  return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    return data?.[key] ?? '';
  });
}

export async function sendWhatsAppMessage({ to, body, mediaUrl }) {
  // If WhatsApp credentials are not configured, simulate send
  if (!env.whatsapp.token || !env.whatsapp.phoneNumberId) {
    return { simulated: true, id: 'sim-' + Date.now() };
  }

  const url = `https://graph.facebook.com/v20.0/${env.whatsapp.phoneNumberId}/messages`;
  const headers = { Authorization: `Bearer ${env.whatsapp.token}` };

  // Support text or single image. Extend for other media types as needed.
  const payload = mediaUrl
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'image',
        image: { link: mediaUrl },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      };

  const res = await axios.post(url, payload, { headers });
  return res.data;
}

export async function logMessage({ userId, recipients, message, status, scheduledFor, result }) {
  // Deprecated aggregator log. Prefer logSingleMessage. Kept for backward compatibility.
  await getFirestore().collection(MESSAGES_COLLECTION).add({
    userId,
    recipients,
    message,
    status,
    scheduledFor: scheduledFor || null,
    result: result || null,
    createdAt: new Date(),
  });
}

export async function logSingleMessage({ userId, recipientName, phone, message, status, scheduledFor, result }) {
  await getFirestore().collection(MESSAGES_COLLECTION).add({
    userId,
    recipientName: recipientName || null,
    phone,
    message,
    status,
    scheduledFor: scheduledFor || null,
    result: result || null,
    createdAt: new Date(),
  });
}

export async function processDueScheduledMessages() {
  const now = new Date();
  const snap = await getFirestore()
    .collection(MESSAGES_COLLECTION)
    .where('status', '==', 'scheduled')
    .where('scheduledFor', '<=', now)
    .get();

  const sendPromises = snap.docs.map(async (doc) => {
    const data = doc.data();
    try {
      const to = data.phone || (Array.isArray(data.recipients) ? data.recipients[0] : undefined);
      if (!to) throw new Error('Scheduled message missing phone');
      await sendWhatsAppMessage({ to, body: data.message, mediaUrl: data.mediaUrl });
      await doc.ref.set({ status: 'sent', sentAt: new Date() }, { merge: true });
    } catch (err) {
      await doc.ref.set({ status: 'failed', error: err.message, failedAt: new Date() }, { merge: true });
    }
  });

  await Promise.all(sendPromises);
}
