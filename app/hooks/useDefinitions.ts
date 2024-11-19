"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  where
} from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";
import { BORG_TERMS } from "@/app/data/borgData";
import type { Definition } from "@/app/types/definitions";

export function useDefinitions(pageSize: number = 5) {
  const [definitions, setDefinitions] = useState<Definition[]>(BORG_TERMS);
  const [dynamicDefinitions, setDynamicDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Initial load
  useEffect(() => {
    loadMoreDefinitions(true);
  }, []);

  const updateDefinitionVote = (id: string, increment: number) => {
    setDefinitions(prevDefs => 
      prevDefs.map(def => 
        def.id === id 
          ? { ...def, votes: (def.votes || 0) + increment }
          : def
      )
    );
  };

  const addDefinitionLocally = (newDefinition: Definition) => {
    setDefinitions(prevDefs => {
      // Filter out any existing definition with the same ID if it exists
      const filteredDefs = prevDefs.filter(def => def.id !== newDefinition.id);
      const newDefs = [newDefinition, ...filteredDefs];
      
      // Sort the definitions
      return newDefs.sort((a, b) => {
        if (a.votes !== b.votes) return b.votes - a.votes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });

    setDynamicDefinitions(prevDefs => {
      const filteredDefs = prevDefs.filter(def => def.id !== newDefinition.id);
      return [newDefinition, ...filteredDefs];
    });
  };

  async function loadMoreDefinitions(reset: boolean = false) {
    if (loading || (!hasMore && !reset)) return;

    try {
      setLoading(true);
      
      let baseQuery = query(
        collection(db, "definitions"),
        orderBy("votes", "desc"),
        orderBy("createdAt", "desc")
      );

      if (lastDoc && !reset) {
        baseQuery = query(
          collection(db, "definitions"),
          orderBy("votes", "desc"),
          orderBy("createdAt", "desc"),
          where("createdAt", "<", lastDoc.data().createdAt)
        );
      }

      const snapshot = await getDocs(baseQuery);
      const docs = snapshot.docs.slice(0, pageSize);
      
      if (docs.length === 0) {
        setHasMore(false);
        return;
      }

      const newDefs = docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Definition)
      }));

      setLastDoc(docs[docs.length - 1] as QueryDocumentSnapshot<DocumentData>);

      if (reset) {
        // On reset, merge with existing dynamic definitions to prevent duplicates
        const uniqueDefs = [...newDefs];
        setDynamicDefinitions(uniqueDefs);
        
        const allDefs = [...BORG_TERMS, ...uniqueDefs];
        allDefs.sort((a, b) => {
          if (a.votes !== b.votes) return b.votes - a.votes;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setDefinitions(allDefs);
      } else {
        setDynamicDefinitions(prev => [...prev, ...newDefs]);
        setDefinitions(prev => {
          const combined = [...prev, ...newDefs];
          return combined.sort((a, b) => {
            if (a.votes !== b.votes) return b.votes - a.votes;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        });
      }

      setHasMore(snapshot.docs.length > pageSize);
    } catch (err) {
      console.error("Error fetching definitions:", err);
      setError("Failed to load more definitions");
    } finally {
      setLoading(false);
    }
  }

  return { 
    definitions, 
    loading, 
    error, 
    hasMore,
    loadMoreDefinitions,
    updateDefinitionVote,
    addDefinitionLocally
  };
} 