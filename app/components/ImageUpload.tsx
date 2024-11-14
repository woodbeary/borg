"use client";

import { useState } from "react";
import { uploadImage } from "@/app/lib/firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase/client";
import { useSession } from "next-auth/react";

export function ImageUpload() {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !session) return;

    try {
      setUploading(true);
      const path = `borg-images/${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);

      await addDoc(collection(db, "gallery"), {
        url,
        caption,
        authorId: session.user?.email,
        createdAt: new Date(),
      });

      setFile(null);
      setCaption("");
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="block text-[var(--neon-pink)] text-sm font-bold mb-2">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md"
          required
        />
      </div>
      
      <div>
        <label className="block text-[var(--neon-pink)] text-sm font-bold mb-2">
          Caption
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        disabled={uploading || !session}
        className="w-full cyber-border p-3 text-center hover:scale-105 transition-transform bg-[var(--neon-purple)] text-white font-bold disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
} 