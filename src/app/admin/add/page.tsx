"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Import the shared client

export default function AddSongPage() {
  const router = useRouter();
  const [newSong, setNewSong] = useState({
    title: "",
    handle: "",
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Song"}
        </button>
      </form>
      <button
        onClick={() => router.push("/admin")}
        className="bg-gray-300 text-black px-4 py-2 rounded mt-4"
      >
        Cancel
      </button>
    </div>
  );
}
