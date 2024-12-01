import EditSong from "./EditSong";

import { supabase } from "@/lib/supabaseClient";

export default async function EditSongPage({
  params,
}: {
  params: { handle: string };
}) {
  // Fetch song data
  const { data: song, error } = await supabase
    .from("songs")
    .select(
      "title, subtitle, handle, composer, lyricist, key, lyrics, abc_music, meter, length, published"
    )
    .eq("handle", params.handle)
    .single();

  if (error || !song) {
    return <p>Song not found.</p>;
  }

  return <EditSong initialData={song} />;
}
