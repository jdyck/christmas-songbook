"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ABCJS from "abcjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditSong({
  initialData,
}: {
  initialData: { title: string; handle: string; abc_data: string };
}) {
  const router = useRouter();
  const [song, setSong] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Real-time ABC rendering
  useEffect(() => {
    if (song.abc_data) {
      ABCJS.renderAbc("abc-preview", song.abc_data);
    }
  }, [song.abc_data]);

  const updateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("songs")
        .update({
          title: song.title,
          handle: song.handle,
          abc_data: song.abc_data,
        })
        .eq("handle", initialData.handle);

      if (error) throw error;

      // Redirect back to admin page after successful update
      router.push("/admin");
    } catch (err: any) {
      console.error("Error updating song:", err);
      setError(err.message || "Failed to update song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-screen-lg p-4 bg-gray-50 m-auto">
      <h1>Edit Song</h1>
      <form onSubmit={updateSong}>
        <input
          className="w-full p-1 mb-4"
          type="text"
          placeholder="Title"
          value={song.title}
          onChange={(e) => setSong({ ...song, title: e.target.value })}
          required
        />
        <input
          className="w-full p-1 mb-4"
          type="text"
          placeholder="Handle"
          value={song.handle}
          onChange={(e) => setSong({ ...song, handle: e.target.value })}
          required
        />
        <textarea
          className="w-full p-1 mb-4"
          placeholder="ABC Data"
          value={song.abc_data}
          onChange={(e) => setSong({ ...song, abc_data: e.target.value })}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button onClick={() => router.push("/admin")}>Cancel</button>

      <h2>ABC Preview</h2>
      <div id="abc-preview"></div>
    </div>
  );
}
