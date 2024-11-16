"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddSongPage() {
  const router = useRouter();
  const [newSong, setNewSong] = useState({
    title: "",
    handle: "",
    abc_data: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate handle from title
  const generateHandle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
  };

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.from("songs").insert({
        title: newSong.title,
        handle: newSong.handle,
        abc_data: newSong.abc_data,
      });

      if (error) throw error;

      // Redirect back to admin page after successful addition
      router.push("/admin");
    } catch (err: any) {
      console.error("Error adding song:", err);
      setError(err.message || "Failed to add song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-md p-4 bg-gray-50 m-auto">
      <h1>Add New Song</h1>
      <form onSubmit={addSong}>
        <input
          className="w-full p-1 mb-4"
          type="text"
          placeholder="Title"
          value={newSong.title}
          onChange={(e) => {
            const title = e.target.value;
            setNewSong({
              ...newSong,
              title,
              handle: generateHandle(title), // Auto-generate handle
            });
          }}
          required
        />
        <input
          className="w-full p-1 mb-4"
          type="text"
          placeholder="Handle"
          value={newSong.handle}
          onChange={(e) => setNewSong({ ...newSong, handle: e.target.value })}
          required
        />
        <textarea
          className="w-full p-1 mb-4"
          placeholder="ABC Data"
          value={newSong.abc_data}
          onChange={(e) => setNewSong({ ...newSong, abc_data: e.target.value })}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Song"}
        </button>
      </form>
      <button onClick={() => router.push("/admin")}>Cancel</button>
    </div>
  );
}
