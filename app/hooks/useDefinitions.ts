"use client";

import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { db } from '@/app/lib/firebase/client';
import type { Definition } from '@/app/types/definitions';

export function useDefinitions() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      console.log('Setting up Firestore query...');
      const q = query(
        collection(db, 'definitions'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );

      console.log('Starting snapshot listener...');
      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          console.log('Received Firestore snapshot:', snapshot.docs.length, 'documents');
          const newDefinitions = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data()
          })) as Definition[];
          
          setDefinitions(newDefinitions);
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing snapshot:', err);
          setError(err instanceof Error ? err.message : 'Error processing data');
          setLoading(false);
        }
      });

      return () => {
        console.log('Cleaning up snapshot listener...');
        unsubscribe();
      };
    } catch (error) {
      console.error('Error in useDefinitions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  return { definitions, loading, error };
} 