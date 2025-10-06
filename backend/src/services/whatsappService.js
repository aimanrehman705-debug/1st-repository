import axios from 'axios';
import { env } from '../config/env.js';

const GRAPH_BASE = 'https://graph.facebook.com/v20.0';

export async function sendWhatsAppMessage({ to, text, mediaUrl }) {
  if (!env.whatsapp.token || !env.whatsapp.phoneNumberId) {
    // Simulate send in dev if not configured
    return { id: `simulated-${Date.now()}`, status: 'SIMULATED', to, text };
  }

  const url = `${GRAPH_BASE}/${env.whatsapp.phoneNumberId}/messages`;
  const headers = {
    Authorization: `Bearer ${env.whatsapp.token}`,
    'Content-Type': 'application/json',
  };

  const data = mediaUrl
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'image',
        image: { link: mediaUrl, caption: text },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      };

  const res = await axios.post(url, data, { headers });
  return res.data;
}
