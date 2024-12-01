"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";

type Song = {
  title: string;
  handle: string;
};

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("title, handle")
          .eq("published", true) // Fetch only published songs
          .order("handle", { ascending: true });

        if (error) throw error;
        setSongs(data || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Failed to load songs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p>{error}</p>;

  return songs.length > 0 ? (
    <ul className="md:columns-2">
      {songs.map((song) => (
        <li key={song.handle}>
          <Link
            href={`/song/${song.handle}`}
            className="p-6 block hover:bg-gray-100 bg-gray-50 rounded-lg mb-2"
          >
            {song.title}
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No songs are available.</p>
  );
}
