import { getFirestore } from '../config/firebase.js';
import { renderTemplate, sendWhatsAppMessage, logMessage, logSingleMessage } from '../services/whatsappService.js';

const MESSAGES_COLLECTION = 'messages';
const USERS_COLLECTION = 'users';
const TEMPLATES_COLLECTION = 'templates';

function parseRecipients({ recipients, csvContacts }) {
  const set = new Set();
  (recipients || []).forEach((r) => r && set.add(String(r).trim()));
  (csvContacts || []).forEach((r) => r && set.add(String(r).trim()));
  return Array.from(set).filter(Boolean);
}

function buildContacts({ contacts, names, recipients }) {
  // contacts: [{ name, phone }]
  // names: optional parallel array of names matching recipients
  const output = [];
  if (Array.isArray(contacts) && contacts.length) {
    for (const c of contacts) {
      if (c?.phone) output.push({ name: c.name || null, phone: String(c.phone).trim() });
    }
  } else if (Array.isArray(recipients) && recipients.length) {
    for (let i = 0; i < recipients.length; i++) {
      const phone = String(recipients[i]).trim();
      if (!phone) continue;
      output.push({ name: names?.[i] || null, phone });
    }
  }
  // de-duplicate by phone
  const seen = new Set();
  const deduped = [];
  for (const c of output) {
    if (c.phone && !seen.has(c.phone)) { seen.add(c.phone); deduped.push(c); }
  }
  return deduped;
}

export async function sendMessage(req, res, next) {
  try {
    const { recipients, csvContacts, message, templateId, variables, mediaUrl, contacts, names } = req.body;

    const toList = parseRecipients({ recipients, csvContacts });
    const contactList = buildContacts({ contacts, names, recipients: toList });
    if (!contactList.length) return res.status(400).json({ error: 'No recipients provided' });

    let templateContent = null;
    if (templateId) {
      const tDoc = await getFirestore().collection(TEMPLATES_COLLECTION).doc(templateId).get();
      if (!tDoc.exists) return res.status(404).json({ error: 'Template not found' });
      templateContent = tDoc.data().content;
    }

    const results = [];
    for (const c of contactList) {
      const bodyFor = templateContent
        ? renderTemplate(templateContent, { ...(variables || {}), name: c.name || '', phone: c.phone })
        : message;
      const result = await sendWhatsAppMessage({ to: c.phone, body: bodyFor, mediaUrl });
      results.push({ to: c.phone, result });
      await logSingleMessage({ userId: req.user.uid, recipientName: c.name, phone: c.phone, message: bodyFor, status: 'sent', result });
    }

    res.json({ ok: true, count: contactList.length, results });
  } catch (err) {
    next(err);
  }
}

export async function scheduleMessage(req, res, next) {
  try {
    const { recipients, csvContacts, message, templateId, variables, scheduledFor, contacts, names, mediaUrl } = req.body;
    const toList = parseRecipients({ recipients, csvContacts });
    const contactList = buildContacts({ contacts, names, recipients: toList });
    if (!contactList.length) return res.status(400).json({ error: 'No recipients provided' });
    if (!scheduledFor) return res.status(400).json({ error: 'scheduledFor required' });

    let templateContent = null;
    if (templateId) {
      const tDoc = await getFirestore().collection(TEMPLATES_COLLECTION).doc(templateId).get();
      if (!tDoc.exists) return res.status(404).json({ error: 'Template not found' });
      templateContent = tDoc.data().content;
    }

    const scheduleDate = new Date(scheduledFor);
    if (Number.isNaN(scheduleDate.getTime())) return res.status(400).json({ error: 'Invalid date' });

    for (const c of contactList) {
      const bodyFor = templateContent
        ? renderTemplate(templateContent, { ...(variables || {}), name: c.name || '', phone: c.phone })
        : message;
      await getFirestore().collection(MESSAGES_COLLECTION).add({
        userId: req.user.uid,
        recipientName: c.name || null,
        phone: c.phone,
        message: bodyFor,
        status: 'scheduled',
        scheduledFor: scheduleDate,
        mediaUrl: mediaUrl || null,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ ok: true, scheduledFor: scheduleDate });
  } catch (err) {
    next(err);
  }
}

export async function listMyMessages(req, res, next) {
  try {
    const snap = await getFirestore()
      .collection(MESSAGES_COLLECTION)
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function adminListAllMessages(_req, res, next) {
  try {
    const snap = await getFirestore().collection(MESSAGES_COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function dashboardStats(_req, res, next) {
  try {
    const usersSnap = await getFirestore().collection(USERS_COLLECTION).get();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const messagesTodaySnap = await getFirestore()
      .collection(MESSAGES_COLLECTION)
      .where('createdAt', '>=', todayStart)
      .get();

    const scheduledSnap = await getFirestore()
      .collection(MESSAGES_COLLECTION)
      .where('status', '==', 'scheduled')
      .get();

    res.json({
      totalUsers: usersSnap.size,
      messagesSentToday: messagesTodaySnap.size,
      scheduledPending: scheduledSnap.size,
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadCsvAndSend(req, res, next) {
  try {
    const { csv, message, templateId, variables } = req.body;
    if (!csv) return res.status(400).json({ error: 'csv required (string with phone numbers)' });
    const lines = String(csv)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    return await sendMessage({
      ...req,
      body: {
        recipients: lines,
        message,
        templateId,
        variables,
      },
    }, res, next);
  } catch (err) {
    next(err);
  }
}
