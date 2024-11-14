import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

const adminApp = apps.length === 0 
  ? initializeApp({
      credential: cert({
        projectId: 'dummy',
        clientEmail: 'dummy@example.com',
        privateKey: 'dummy'
      }),
    })
  : apps[0];

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb }; 