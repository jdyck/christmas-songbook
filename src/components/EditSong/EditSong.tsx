"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EditSongForm from "./EditSongForm";
import SongPreview from "./SongPreview";
import { Song } from "@/interfaces/Song";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  initialData: Song;
}

export default function EditSong({ initialData }: Props) {
  const router = useRouter();
  const [song, setSong] = useState<Song>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const updateSong = async (updatedSong: Song) => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("songs")
        .update(updatedSong)
        .eq("handle", initialData.handle);

      if (error) throw error;

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Failed to update song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:flex flex-row-reverse">
      <div className="p-4 lg:h-screen flex-grow">
        <EditSongForm
          song={song}
          setSong={setSong}
          onSave={updateSong}
          loading={loading}
          error={error}
        />
      </div>
      <div className="bg-white max-w-screen-md mt-0 m-auto lg:w-[40vw]">
        <SongPreview song={song} />
      </div>
    </div>
  );
}
