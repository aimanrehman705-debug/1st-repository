import { getFirestore } from '../config/firebase.js';

const TEMPLATES_COLLECTION = 'templates';

export async function listTemplates(_req, res, next) {
  try {
    const snapshot = await getFirestore().collection(TEMPLATES_COLLECTION).orderBy('createdAt', 'desc').get();
    const templates = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        // Normalize fields for frontend
        name: data.title || data.name,
        content: data.messageBody || data.content,
        createdAt: data.createdAt,
        createdBy: data.createdBy || null,
      };
    });
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
      // Store both legacy and acceptance names for compatibility
      name,
      content,
      title: name,
      messageBody: content,
      createdBy: req.user?.uid || null,
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
    const update = { updatedAt: new Date() };
    if (name !== undefined) {
      update.name = name;
      update.title = name;
    }
    if (content !== undefined) {
      update.content = content;
      update.messageBody = content;
    }
    await getFirestore().collection(TEMPLATES_COLLECTION).doc(id).set(update, { merge: true });
    const doc = await getFirestore().collection(TEMPLATES_COLLECTION).doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Template not found' });
    const data = doc.data();
    res.json({ id: doc.id, name: data.title || data.name, content: data.messageBody || data.content });
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
