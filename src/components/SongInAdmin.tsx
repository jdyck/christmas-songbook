import React from "react";
import Link from "next/link";
import { RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";
import { Song } from "@/types/song";
import { supabase } from "@/lib/supabaseClient";

type SongInAdminProps = {
  song: Song;
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingAction: React.Dispatch<React.SetStateAction<boolean>>;
  loadingAction: boolean;
};

const SongInAdmin: React.FC<SongInAdminProps> = ({
  song,
  setSongs,
  setError,
  setLoadingAction,
  loadingAction,
}) => {
  // Delete a song
  const deleteSong = async () => {
    setLoadingAction(true);
    try {
      const { error } = await supabase.from("songs").delete().eq("id", song.id);

      if (error) throw error;

      setSongs((prevSongs) => prevSongs.filter((s) => s.id !== song.id));
    } catch (err) {
      console.error("Error deleting song:", err);
      setError("Failed to delete the song. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Toggle Published Status
  const togglePublished = async () => {
    setLoadingAction(true);
    try {
      const updatedPublished = !song.published;
      const { error } = await supabase
        .from("songs")
        .update({ published: updatedPublished })
        .eq("id", song.id);

      if (error) throw error;

      setSongs((prevSongs) =>
        prevSongs.map((s) =>
          s.id === song.id ? { ...s, published: updatedPublished } : s
        )
      );
    } catch (err) {
      console.error("Error updating published status:", err);
      setError("Failed to update published status. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="flex items-center mb-2">
      <p>
        <Link href={`/admin/edit/${song.handle}`}>
          <button className="w-8">
            <RiEdit2Line />
          </button>
        </Link>
        <button onClick={deleteSong} className="w-8" disabled={loadingAction}>
          <RiDeleteBinLine />
        </button>
      </p>
      <p className="ml-2">{song.title}</p>
      <label className="flex items-center ml-4">
        <input
          type="checkbox"
          checked={song.published}
          onChange={togglePublished}
          className="mr-2"
          disabled={loadingAction}
        />
        Published
      </label>
    </div>
  );
};

export default SongInAdmin;
