import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : {};

const adminApp = apps.length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : apps[0];

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb }; 