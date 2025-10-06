import { authAdmin } from '../config/firebase.js';
import { firestore } from '../config/firebase.js';
import { env } from '../config/env.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const decoded = await authAdmin.verifyIdToken(token);
    req.user = decoded;

    // Ensure user document exists and role is set
    try {
      const userRef = firestore.collection('users').doc(decoded.uid);
      const snap = await userRef.get();
      if (!snap.exists) {
        const role = env.adminEmails.includes(decoded.email || '') ? 'admin' : 'user';
        await userRef.set({
          uid: decoded.uid,
          email: decoded.email || '',
          displayName: decoded.name || '',
          role,
          createdAt: new Date(),
        });
      }
    } catch (_) {
      // ignore provisioning errors for auth flow
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.uid) return res.status(401).json({ error: 'Unauthorized' });
    const userDoc = await firestore.collection('users').doc(req.user.uid).get();
    const data = userDoc.exists ? userDoc.data() : {};
    if (data && data.role === 'admin') return next();
    if (env.adminEmails.includes(req.user.email || '')) return next();
    return res.status(403).json({ error: 'Admin access required' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify admin role' });
  }
}
