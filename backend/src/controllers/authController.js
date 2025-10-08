import axios from 'axios';
import { getAuth, getFirestore } from '../config/firebase.js';
import { env } from '../config/env.js';

const USERS_COLLECTION = 'users';

export async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    if (!env.allowOpenRegistration && role === 'admin') {
      return res.status(403).json({ error: 'Admin registration disabled' });
    }

    const userRecord = await getAuth().createUser({ email, password });

    const assignedRole = role === 'admin' && env.allowOpenRegistration ? 'admin' : 'user';

    await getAuth().setCustomUserClaims(userRecord.uid, { role: assignedRole });

    await getFirestore().collection(USERS_COLLECTION).doc(userRecord.uid).set({
      email,
      role: assignedRole,
      createdAt: new Date(),
    });

    return res.status(201).json({ uid: userRecord.uid, email, role: assignedRole });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    // In server context, recommend client to use Firebase client SDK.
    return res.status(400).json({
      error: 'Use Firebase client SDK to sign in and obtain ID token.',
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  return res.json({ uid: req.user.uid, email: req.user.email, role: req.user.role });
}
