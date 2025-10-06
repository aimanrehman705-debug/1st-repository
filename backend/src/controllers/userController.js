import { firestore } from '../config/firebase.js';

export async function listUsers(req, res, next) {
  try {
    const snap = await firestore.collection('users').orderBy('createdAt', 'desc').get();
    const users = snap.docs.map(d => d.data());
    res.json(users);
  } catch (err) { next(err); }
}

export async function getUser(req, res, next) {
  try {
    const doc = await firestore.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json(doc.data());
  } catch (err) { next(err); }
}

export async function updateUser(req, res, next) {
  try {
    const data = req.body || {};
    await firestore.collection('users').doc(req.params.id).update(data);
    const updated = await firestore.collection('users').doc(req.params.id).get();
    res.json(updated.data());
  } catch (err) { next(err); }
}

export async function deleteUser(req, res, next) {
  try {
    await firestore.collection('users').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) { next(err); }
}
