import admin from 'firebase-admin';
import { env } from './env.js';

let initialized = false;

function decodeServiceAccountB64(b64) {
  try {
    const json = Buffer.from(b64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch (err) {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_B64: ' + err.message);
  }
}

export function initFirebaseAdmin() {
  if (initialized) return admin;

  if (env.firebase.serviceAccountB64) {
    const creds = decodeServiceAccountB64(env.firebase.serviceAccountB64);
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      databaseURL: creds.databaseURL || env.firebase.databaseURL,
    });
  } else if (env.firebase.projectId && env.firebase.clientEmail && env.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.firebase.projectId,
        clientEmail: env.firebase.clientEmail,
        privateKey: env.firebase.privateKey,
      }),
      databaseURL: env.firebase.databaseURL,
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: env.firebase.databaseURL,
    });
  } else {
    throw new Error('Firebase Admin credentials not provided. Set FIREBASE_* or FIREBASE_SERVICE_ACCOUNT_B64 or GOOGLE_APPLICATION_CREDENTIALS.');
  }

  initialized = true;
  return admin;
}

export function getFirestore() {
  if (!initialized) initFirebaseAdmin();
  return admin.firestore();
}

export function getAuth() {
  if (!initialized) initFirebaseAdmin();
  return admin.auth();
}
