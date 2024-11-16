"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Song = {
  id: string;
  title: string;
  handle: string;
  abc_data: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState<Song>({
    id: "",
    title: "",
    handle: "",
    abc_data: "",
  });
  const [user, setUser] = useState<any>(null); // To track the logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState(""); // Email input for login
  const [password, setPassword] = useState(""); // Password input for login

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch all songs
  useEffect(() => {
    if (user) {
      const fetchSongs = async () => {
        try {
          const { data, error } = await supabase
            .from("songs")
            .select("*")
            .order("handle", { ascending: true });
          if (error) throw error;
          setSongs(data as Song[]);
        } catch (err) {
          console.error("Error fetching songs:", err);
          setError(true);
        }
      };
      fetchSongs();
    }
  }, [user]);

  // Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user); // Set the logged-in user
    } catch (err) {
      console.error("Error logging in:", err);
      setError(true);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSongs([]); // Clear the song list
  };

  // Add a new song
  const addSong = async () => {
    try {
      const { error } = await supabase.from("songs").insert({
        title: newSong.title,
        handle: newSong.handle,
        abc_data: newSong.abc_data,
      });
      if (error) throw error;
      setSongs([...songs, newSong]);
      setNewSong({ id: "", title: "", handle: "", abc_data: "" });
    } catch (err) {
      console.error("Error adding song:", err);
    }
  };

  // Delete a song
  const deleteSong = async (id: string) => {
    try {
      const { error } = await supabase.from("songs").delete().eq("id", id);
      if (error) throw error;
      setSongs(songs.filter((song) => song.id !== id));
    } catch (err) {
      console.error("Error deleting song:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  // If not logged in, show login form
  if (!user) {
    return (
      <div>
        <Link href="/">back</Link>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <Link href="/">back</Link>

      <h1>Admin Page</h1>
      <Link href="/admin/add">
        <button>Add New Song</button>
      </Link>

      {/* List of Songs */}
      <div>
        <h2>Existing Songs</h2>
        {songs.length === 0 ? (
          <p>No songs available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Handle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.id}>
                  <td>{song.title}</td>
                  <td>{song.handle}</td>
                  <td>
                    <Link href={`/admin/edit/${song.handle}`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => deleteSong(song.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
