declare module 'firebase/app' {
  export interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  }

  export interface FirebaseApp {
    name: string;
    options: FirebaseOptions;
  }

  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
}

declare module 'firebase/firestore' {
  import { FirebaseApp } from 'firebase/app';
  
  export interface DocumentData {
    [key: string]: any;
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: QueryDocumentSnapshot<T>[];
  }

  export interface DocumentReference<T = DocumentData> {
    id: string;
  }

  export function getFirestore(app: FirebaseApp): any;
  export function collection(firestore: any, path: string): any;
  export function query(collection: any, ...queryConstraints: any[]): any;
  export function where(field: string, opStr: string, value: any): any;
  export function orderBy(field: string, direction?: 'asc' | 'desc'): any;
  export function onSnapshot<T>(query: any, callback: (snapshot: QuerySnapshot<T>) => void): () => void;
  export function getDocs<T>(query: any): Promise<QuerySnapshot<T>>;
  export function doc(firestore: any, path: string, ...pathSegments: string[]): DocumentReference;
  export function updateDoc(reference: DocumentReference, data: Partial<DocumentData>): Promise<void>;
  export function addDoc(reference: any, data: DocumentData): Promise<DocumentReference>;
}

declare module 'firebase/auth' {
  import { FirebaseApp } from 'firebase/app';
  export function getAuth(app: FirebaseApp): any;
}

declare module 'firebase/storage' {
  import { FirebaseApp } from 'firebase/app';
  export function getStorage(app: FirebaseApp): any;
  export function ref(storage: any, path: string): any;
  export function uploadBytes(ref: any, file: Blob | Uint8Array | ArrayBuffer): Promise<any>;
  export function getDownloadURL(ref: any): Promise<string>;
}

declare module 'firebase-admin/app' {
  export interface AppOptions {
    credential: any;
  }
  export function initializeApp(options?: AppOptions): any;
  export function getApps(): any[];
  export function cert(serviceAccountJson: any): any;
}

declare module 'firebase-admin/firestore' {
  export function getFirestore(app?: any): any;
  
  export interface QueryDocumentSnapshot {
    id: string;
    data(): any;
  }
} 