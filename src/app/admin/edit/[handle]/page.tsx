import { createClient } from "@supabase/supabase-js";
import EditSong from "./EditSong";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function EditSongPage({
  params,
}: {
  params: { handle: string };
}) {
  // Fetch song data
  const { data: song, error } = await supabase
    .from("songs")
    .select(
      "title, subtitle, handle, abc_data, composer, lyricist, key, lyrics, abc_music, meter, length, published"
    )
    .eq("handle", params.handle)
    .single();

  if (error || !song) {
    return <p>Song not found.</p>;
  }

  return <EditSong initialData={song} />;
}
