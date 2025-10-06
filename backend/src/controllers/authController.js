import { authAdmin, firestore } from '../config/firebase.js';
import { env } from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const userRecord = await authAdmin.createUser({ email, password, displayName });

    const role = env.adminEmails.includes(email) ? 'admin' : 'user';
    await firestore.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      role,
      createdAt: new Date(),
    });

    res.json({ uid: userRecord.uid, email: userRecord.email, role });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  const ref = firestore.collection('users').doc(req.user.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    const role = env.adminEmails.includes(req.user.email || '') ? 'admin' : 'user';
    await ref.set({
      uid: req.user.uid,
      email: req.user.email || '',
      displayName: req.user.name || '',
      role,
      createdAt: new Date(),
    });
    return res.json({ uid: req.user.uid, email: req.user.email, role });
  }
  const data = snap.data();
  return res.json({ uid: req.user.uid, email: req.user.email, role: data.role || 'user' });
}

export async function loginInfo(req, res) {
  // Login handled client-side via Firebase SDK, this endpoint exists for health info
  return res.json({ message: 'Use Firebase client SDK to obtain ID token' });
}
