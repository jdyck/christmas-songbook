import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { playfair } from "@/lib/fonts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: songs, error } = await supabase
    .from("songs")
    .select("title, handle")
    .order("handle", { ascending: true });

  if (error) {
    console.error("Error fetching songs:", error);
    return <p>Failed to load songs.</p>;
  }

  return (
    <div className="text-center p-4">
      <h1
        className={`${playfair.className} font-bold text-4xl text-burgundy pb-6`}
      >
        Christmas Songbook
      </h1>

      {songs && songs.length > 0 ? (
        <ul>
          {songs.map((song) => (
            <li key={song.handle}>
              <Link href={`/song/${song.handle}`} className="p-2 block">
                {song.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No songs are available.</p>
      )}

      <Link href="/admin">Admin</Link>
    </div>
  );
}
