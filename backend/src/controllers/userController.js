import { getAuth, getFirestore } from '../config/firebase.js';

const USERS_COLLECTION = 'users';

export async function listUsers(_req, res, next) {
  try {
    const snapshot = await getFirestore().collection(USERS_COLLECTION).get();
    const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { email, password, role = 'user' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const userRecord = await getAuth().createUser({ email, password });
    await getAuth().setCustomUserClaims(userRecord.uid, { role });
    await getFirestore().collection(USERS_COLLECTION).doc(userRecord.uid).set({ email, role, createdAt: new Date() });

    res.status(201).json({ uid: userRecord.uid, email, role });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const { uid } = req.params;
    const doc = await getFirestore().collection(USERS_COLLECTION).doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (role) {
      await getAuth().setCustomUserClaims(uid, { role });
    }

    await getFirestore().collection(USERS_COLLECTION).doc(uid).set({ ...req.body, updatedAt: new Date() }, { merge: true });
    const updated = await getFirestore().collection(USERS_COLLECTION).doc(uid).get();

    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { uid } = req.params;
    await getAuth().deleteUser(uid);
    await getFirestore().collection(USERS_COLLECTION).doc(uid).delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
