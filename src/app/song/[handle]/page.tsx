import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ABCRenderer from "./ABCRenderer";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SongPage({
  params: initialParams,
}: {
  params: Promise<{ handle: string }>;
}) {
  const params = await initialParams;
  const { handle } = params;

  const { data: song, error } = await supabase
    .from("songs")
    .select("title, abc_data")
    .eq("handle", handle)
    .single();

  if (error || !song) {
    notFound();
    return null;
  }

  return (
    <div>
      <Link href="/">back</Link>
      <h1>{song.title}</h1>
      <ABCRenderer abcData={song.abc_data} />
    </div>
  );
}
