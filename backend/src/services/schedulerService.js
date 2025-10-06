import cron from 'node-cron';
import { firestore } from '../config/firebase.js';
import { sendWhatsAppMessage } from './whatsappService.js';

// Run every minute to process due scheduled messages
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const snapshot = await firestore
    .collection('messages')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now)
    .limit(50)
    .get();

  const batch = firestore.batch();

  for (const doc of snapshot.docs) {
    const msg = doc.data();
    try {
      await sendWhatsAppMessage({ to: msg.to, text: msg.text, mediaUrl: msg.mediaUrl });
      batch.update(doc.ref, { status: 'sent', sentAt: new Date() });
    } catch (err) {
      batch.update(doc.ref, { status: 'failed', error: String(err?.response?.data || err?.message || err) });
    }
  }

  if (!snapshot.empty) {
    await batch.commit();
  }
});
