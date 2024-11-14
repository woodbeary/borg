import type { 
  DocumentData, 
  QueryDocumentSnapshot
} from 'firebase/firestore';

export type FirestoreDataConverter<T> = {
  toFirestore(modelObject: T): DocumentData;
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>
  ): T;
};

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
}; 