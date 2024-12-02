"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditSong from "@/components/EditSong/EditSong";
import { supabase } from "@/lib/supabaseClient";
import { Song } from "@/interfaces/Song";

export default function EditSongPage() {
  const { handle } = useParams<{ handle: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data, error } = await supabase
          .from("songs")
          .select(
            "title, subtitle, handle, composer, lyricist, key, lyrics, abc_music, meter, length, published"
          )
          .eq("handle", handle)
          .single();

        if (error) throw error;
        setSong(data);
      } catch (err) {
        setError("Song not found.");
      }
    };

    fetchSong();
  }, [handle]);

  if (error) return <p>{error}</p>;
  if (!song) return <p>Loading...</p>;

  return <EditSong initialData={song} />;
}
