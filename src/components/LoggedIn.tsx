import React, { useEffect } from "react";
import Link from "next/link";
import { RiAlignLeft, RiFileAddLine } from "react-icons/ri";
import { supabase } from "@/lib/supabaseClient";
import SongInAdmin from "@/components/SongInAdmin";
import { Song } from "@/types/song";
import LogoutButton from "@/components/LogoutButton";
import Header from "./Header";

type LoggedInProps = {
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setLoadingAction: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loadingAction: boolean;
};

const LoggedIn: React.FC<LoggedInProps> = ({
  setUser,
  setLoadingAction,
  setError,
  loadingAction,
}) => {
  const [songs, setSongs] = React.useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = React.useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoadingSongs(true);
      try {
        const { data, error } = await supabase
          .from("songs")
          .select("*")
          .order("handle", { ascending: true });
        if (error) throw error;
        setSongs(data as Song[]);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError("Unable to fetch songs. Please try again later.");
      } finally {
        setLoadingSongs(false);
      }
    };

    fetchSongs();
  }, [setError]);

  if (loadingSongs) {
    return <p>Loading songs...</p>;
  }

  return (
    <div>
      <Header />

      <LogoutButton
        setUser={setUser}
        setLoadingAction={setLoadingAction}
        loadingAction={loadingAction}
      />
      {songs.length === 0 ? (
        <p>No songs available.</p>
      ) : (
        songs.map((song) => (
          <SongInAdmin
            key={song.id}
            song={song}
            setSongs={setSongs}
            setError={setError}
            setLoadingAction={setLoadingAction}
            loadingAction={loadingAction}
          />
        ))
      )}
      <Link href="/admin/add">
        <button className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex gap-1 items-center">
          <RiFileAddLine /> Add Song
        </button>
      </Link>
    </div>
  );
};

export default LoggedIn;
