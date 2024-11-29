import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { playfair, lora, sourceSerif } from "@/lib/fonts";
import PageDesign from "@/components/PageDesign";

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
    <>
      <PageDesign>
        <div className="">
          <h1
            className={`${playfair.className} font-bold text-4xl text-burgundy pb-6`}
          >
            🎄 Christmas Songbook 🎶
          </h1>
          {/* <h1
            className={`${lora.className} font-bold text-4xl text-burgundy pb-6`}
          >
            Christmas Songbook
          </h1>
          <h1
            className={`${sourceSerif.className} font-bold text-4xl text-burgundy pb-6`}
          >
            Christmas Songbook
          </h1> */}

          {songs && songs.length > 0 ? (
            <ul className="md:columns-2">
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
        </div>
      </PageDesign>
      <Link className="m-auto block text-center mb-12" href="/admin">
        Admin
      </Link>
    </>
  );
}
