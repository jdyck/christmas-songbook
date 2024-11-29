import { createClient } from "@supabase/supabase-js";
import ABCRenderer from "./ABCRenderer";
import Link from "next/link";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SongPage({
  params,
}: {
  params: { handle: string };
}) {
  const { handle } = params;

  // Fetch song data from Supabase
  const { data: song, error } = await supabase
    .from("songs")
    .select(
      "title, subtitle, handle, abc_data, composer, lyricist, key, lyrics, abc_music, meter, length, published"
    )
    .eq("handle", handle)
    .single();

  if (error || !song) {
    notFound();
    return null;
  }

  // Remove line breaks from abc_music and lyrics
  const sanitizedAbcMusic = (song.abc_music || "").replace(/\r?\n|\r/g, " ");
  const sanitizedLyrics = (song.lyrics || "").replace(/\r?\n|\r/g, " ");

  // Construct the compiled ABC data
  const abcCompiled = `
T:${song.title}
${song.subtitle ? `T:(${song.subtitle})\r` : ``}C:${song.composer || ""}
R:${song.lyricist || ""}
K:${song.key || "C"} 
M:${song.meter || ""}
L:${song.length || ""}
${sanitizedAbcMusic}
w:${sanitizedLyrics}
`.trim();

  return (
    <div>
      <Link href="/">back</Link>
      <div className="md:max-w-screen-md bg-white m-auto sm:p-4 md:p-8 pb-20">
        {/* Pass the compiled ABC data to the client component */}
        <ABCRenderer abcData={abcCompiled} />
      </div>
    </div>
  );
}
