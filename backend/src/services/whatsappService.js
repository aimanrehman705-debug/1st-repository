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

  // Simplified text-only send. For media, extend and handle types as needed.
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body },
  };

  const res = await axios.post(url, payload, { headers });
  return res.data;
}

export async function logMessage({ userId, recipients, message, status, scheduledFor, result }) {
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
      for (const to of data.recipients) {
        const result = await sendWhatsAppMessage({ to, body: data.message });
        // Optionally store individual send results in a subcollection
      }
      await doc.ref.set({ status: 'sent', sentAt: new Date() }, { merge: true });
    } catch (err) {
      await doc.ref.set({ status: 'failed', error: err.message, failedAt: new Date() }, { merge: true });
    }
  });

  await Promise.all(sendPromises);
}
