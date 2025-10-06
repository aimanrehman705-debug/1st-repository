import { firestore } from '../config/firebase.js';

export async function listTemplates(req, res, next) {
  try {
    const snap = await firestore.collection('templates').orderBy('createdAt', 'desc').get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) { next(err); }
}

export async function createTemplate(req, res, next) {
  try {
    const { name, content } = req.body;
    if (!name || !content) return res.status(400).json({ error: 'name and content required' });
    const ref = await firestore.collection('templates').add({ name, content, createdAt: new Date(), updatedAt: new Date() });
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, ...doc.data() });
  } catch (err) { next(err); }
}

export async function updateTemplate(req, res, next) {
  try {
    const { name, content } = req.body;
    await firestore.collection('templates').doc(req.params.id).update({ name, content, updatedAt: new Date() });
    const doc = await firestore.collection('templates').doc(req.params.id).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) { next(err); }
}

export async function deleteTemplate(req, res, next) {
  try {
    await firestore.collection('templates').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) { next(err); }
}
