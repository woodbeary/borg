import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Just export mock objects for now
export const adminApp = null;
export const adminDb = {
  collection: () => ({
    add: async () => ({ id: 'dummy-id' })
  })
}; 