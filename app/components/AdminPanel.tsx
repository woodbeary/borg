"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc, 
  updateDoc,
  DocumentData,
  QueryDocumentSnapshot 
} from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";
import type { Definition } from "@/app/types/definitions";

export function AdminPanel() {
  const [pendingDefinitions, setPendingDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingDefinitions();
  }, []);

  async function loadPendingDefinitions() {
    const q = query(
      collection(db, "definitions"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs<DocumentData>(q);
    const definitions = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
    })) as Definition[];

    setPendingDefinitions(definitions);
    setLoading(false);
  }

  async function handleModeration(id: string, approved: boolean) {
    try {
      const docRef = doc(db, "definitions", id);
      await updateDoc(docRef, {
        status: approved ? "approved" : "rejected",
      });
      await loadPendingDefinitions();
    } catch (error) {
      console.error("Error moderating definition:", error);
      alert("Failed to moderate definition");
    }
  }

  if (loading) {
    return <div className="cyber-border p-6 animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">Pending Definitions</h2>
      {pendingDefinitions.length === 0 ? (
        <p className="text-gray-400">No pending definitions</p>
      ) : (
        pendingDefinitions.map((def) => (
          <div key={def.id} className="cyber-border p-6">
            <h3 className="text-xl font-bold text-[var(--neon-pink)] mb-2">
              {def.term}
            </h3>
            <p className="text-gray-300 mb-4">{def.definition}</p>
            <p className="text-sm text-gray-500 mb-4">
              By {def.authorName} • {new Date(def.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleModeration(def.id!, true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleModeration(def.id!, false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 