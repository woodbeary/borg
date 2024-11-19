import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: ReturnType<typeof getFirestore>;

try {
  if (!getApps().length) {
    // Create the service account credentials object
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
      token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN
    };

    // Validate required fields
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Missing required Firebase credentials');
    }

    initializeApp({
      credential: cert(serviceAccount as any)
    });
  }
  
  adminDb = getFirestore();
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  throw new Error(`Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export { adminDb }; 