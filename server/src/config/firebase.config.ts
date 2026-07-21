import * as admin from 'firebase-admin';
import { env } from './env.config';

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App | null => {
  if (firebaseApp) return firebaseApp;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL) {
    console.warn('[Firebase Config] Credentials pending. SDK configuration ready.');
    return null;
  }

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });
    console.log('[Firebase Config] Firebase Admin initialized.');
    return firebaseApp;
  } catch (error) {
    console.warn('[Firebase Config] Firebase Admin initialization deferred:', error instanceof Error ? error.message : error);
    return null;
  }
};
