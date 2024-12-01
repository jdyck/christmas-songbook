"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ABCJS from "abcjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ABCRenderer({ handle }: { handle: string }) {
  const [abcData, setAbcData] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch song data
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data: song, error } = await supabase
          .from("songs")
          .select(
            "title, subtitle, handle, composer, lyricist, key, lyrics, abc_music, meter, length, published"
          )
          .eq("handle", handle)
          .single();

        if (error || !song) {
          setError("Song not found.");
          return;
        }

        // Sanitize and compile the ABC data
        const sanitizedAbcMusic = (song.abc_music || "").replace(
          /\r?\n|\r/g,
          " "
        );
        const sanitizedLyrics = (song.lyrics || "").replace(/\r?\n|\r/g, " ");

        const abcCompiled = `
        X:1
T:${song.title} 
M:${song.meter || "% "}
K:${song.key || "C"} 
L:${song.length || ""}
C:${song.composer || ""}
R:${song.lyricist || ""}
${sanitizedAbcMusic}
w:${sanitizedLyrics}
`.trim();

        setAbcData(abcCompiled);
      } catch (err) {
        setError("Failed to fetch song data.");
        console.error("Error fetching song data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [handle]);

  // Handle window resizing for responsive rendering
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render the ABC data when available
  useEffect(() => {
    if (abcData) {
      const staffwidth = viewportWidth > 768 ? 768 : viewportWidth;

      ABCJS.renderAbc("abc-container", abcData, {
        scale: 0.9,
        responsive: "resize",
        staffwidth,
        wrap: {
          minSpacing: 1.5,
          maxSpacing: 2.7,
          preferredMeasuresPerLine: 5,
        },
      });
    }
  }, [abcData, viewportWidth]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div id="abc-container"></div>
    </>
  );
}
