"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";
import type { Definition } from "@/app/types/definitions";
import Cookies from 'js-cookie';
import { DocumentData } from 'firebase/firestore';

export function AdminPanel() {
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ term: "", definition: "" });

  useEffect(() => {
    loadDefinitions();
  }, []);

  async function loadDefinitions() {
    const q = query(collection(db, "definitions"));
    const snapshot = await getDocs(q);
    const defs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as DocumentData)
    })) as Definition[];

    setDefinitions(defs);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this definition?")) return;
    
    try {
      const adminToken = Cookies.get('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const response = await fetch(`/api/admin/definitions?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete');
      }

      await loadDefinitions();
    } catch (error) {
      console.error("Error deleting definition:", error);
      alert(error instanceof Error ? error.message : "Failed to delete definition");
    }
  }

  async function handleEdit(id: string) {
    if (editing === id) {
      try {
        const adminToken = Cookies.get('adminToken');
        const response = await fetch('/api/admin/definitions', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            id,
            ...editForm
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to update');
        }

        setEditing(null);
        await loadDefinitions();
      } catch (error) {
        console.error("Error updating definition:", error);
        alert("Failed to update definition");
      }
    } else {
      const def = definitions.find(d => d.id === id);
      if (def) {
        setEditForm({ term: def.term, definition: def.definition });
        setEditing(id);
      }
    }
  }

  if (loading) {
    return <div className="cyber-border p-6 animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold neon-text">All Definitions</h2>
      {definitions.length === 0 ? (
        <p className="text-gray-400">No definitions found</p>
      ) : (
        definitions.map((def) => (
          <div key={def.id} className="cyber-border p-6">
            {editing === def.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.term}
                  onChange={(e) => setEditForm(prev => ({ ...prev, term: e.target.value }))}
                  className="w-full p-2 bg-[#1a1a2e] border border-[var(--neon-blue)]"
                />
                <textarea
                  value={editForm.definition}
                  onChange={(e) => setEditForm(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full p-2 bg-[#1a1a2e] border border-[var(--neon-blue)] min-h-[100px]"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[var(--neon-pink)] mb-2">
                  {def.term}
                </h3>
                <p className="text-gray-300 mb-4">{def.definition}</p>
                <p className="text-sm text-gray-500">Votes: {def.votes}</p>
              </>
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(def.id!)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {editing === def.id ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => handleDelete(def.id!)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 