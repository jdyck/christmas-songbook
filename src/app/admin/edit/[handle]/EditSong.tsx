"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ABCJS from "abcjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditSong({
  initialData,
}: {
  initialData: {
    title: string;
    subtitle: string | null;
    handle: string;
    abc_data: string;
    composer: string;
    lyricist: string;
    key: string;
    lyrics: string | null;
    abc_music: string;
    meter: string;
    length: string;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [song, setSong] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sanitizedAbcMusic = (song.abc_music || "").replace(/\r?\n|\r/g, " ");
  const sanitizedLyrics = (song.lyrics || "").replace(/\r?\n|\r/g, " ");

  // Generate abcCompiled string
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

  // Real-time ABC rendering
  useEffect(() => {
    if (abcCompiled) {
      ABCJS.renderAbc("abc-preview-compiled", abcCompiled, {
        responsive: "resize",
        staffwidth: 700,
        wrap: { minSpacing: 1.5, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
      });
    }
  }, [song.abc_data, abcCompiled]);

  const updateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("songs")
        .update({
          title: song.title,
          subtitle: song.subtitle,
          handle: song.handle,
          abc_data: song.abc_data,
          composer: song.composer,
          lyricist: song.lyricist,
          key: song.key,
          lyrics: song.lyrics,
          abc_music: song.abc_music,
          meter: song.meter,
          published: song.published,
        })
        .eq("handle", initialData.handle);

      if (error) throw error;

      // Redirect back to admin page after successful update
      router.push("/admin");
    } catch (err: any) {
      console.error("Error updating song:", err);
      setError(err.message || "Failed to update song.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:flex flex-row-reverse">
      <div className="p-4 lg:h-screen flex-grow">
        <form onSubmit={updateSong}>
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Title"
            value={song.title}
            onChange={(e) => setSong({ ...song, title: e.target.value })}
            required
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Subtitle"
            value={song.subtitle || ""}
            onChange={(e) => setSong({ ...song, subtitle: e.target.value })}
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Handle"
            value={song.handle}
            onChange={(e) => setSong({ ...song, handle: e.target.value })}
            required
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Composer"
            value={song.composer}
            onChange={(e) => setSong({ ...song, composer: e.target.value })}
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Lyricist"
            value={song.lyricist}
            onChange={(e) => setSong({ ...song, lyricist: e.target.value })}
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Key"
            value={song.key}
            onChange={(e) => setSong({ ...song, key: e.target.value })}
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Length"
            value={song.length}
            onChange={(e) => setSong({ ...song, length: e.target.value })}
          />
          <textarea
            className="w-full p-1 mb-4 px-2"
            placeholder="ABC Music"
            value={song.abc_music}
            onChange={(e) => setSong({ ...song, abc_music: e.target.value })}
          />
          <textarea
            className="w-full p-1 mb-4 px-2"
            placeholder="Lyrics"
            value={song.lyrics || ""}
            onChange={(e) => setSong({ ...song, lyrics: e.target.value })}
          />
          <input
            className="w-full p-1 mb-4 px-2"
            type="text"
            placeholder="Meter"
            value={song.meter}
            onChange={(e) => setSong({ ...song, meter: e.target.value })}
          />
          <textarea
            className="w-full p-1 mb-4 h-[400px] px-2"
            placeholder="ABC Data"
            value={song.abc_data}
            onChange={(e) => setSong({ ...song, abc_data: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={song.published}
                onChange={(e) =>
                  setSong({ ...song, published: e.target.checked })
                }
                className="mr-2"
              />
              Published
            </label>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white rounded-lg px-3 py-1.5 mr-4"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="border rounded-lg bg-white px-3 py-1.5 border-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white max-w-screen-md mt-0 m-auto lg:w-[40vw]">
        <div id="abc-preview-compiled"></div>
      </div>
    </div>
  );
}
