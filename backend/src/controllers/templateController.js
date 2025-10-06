import { getFirestore } from '../config/firebase.js';

const TEMPLATES_COLLECTION = 'templates';

export async function listTemplates(_req, res, next) {
  try {
    const snapshot = await getFirestore().collection(TEMPLATES_COLLECTION).orderBy('createdAt', 'desc').get();
    const templates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(templates);
  } catch (err) {
    next(err);
  }
}

export async function createTemplate(req, res, next) {
  try {
    const { name, content } = req.body;
    if (!name || !content) return res.status(400).json({ error: 'Name and content required' });

    const ref = await getFirestore().collection(TEMPLATES_COLLECTION).add({
      name,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const doc = await ref.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    await getFirestore().collection(TEMPLATES_COLLECTION).doc(id).set({ name, content, updatedAt: new Date() }, { merge: true });
    const doc = await getFirestore().collection(TEMPLATES_COLLECTION).doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Template not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}

export async function deleteTemplate(req, res, next) {
  try {
    const { id } = req.params;
    await getFirestore().collection(TEMPLATES_COLLECTION).doc(id).delete();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
