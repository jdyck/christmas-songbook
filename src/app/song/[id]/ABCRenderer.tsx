"use client";
import { useEffect, useState } from "react";
import ABCJS from "abcjs";

import { supabase } from "@/lib/supabaseClient";

export default function ABCRenderer({ handle }: { handle: string }) {
  const [abcData, setAbcData] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportWidth(window.innerWidth);

      const handleResize = () => {
        setViewportWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

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

  useEffect(() => {
    if (typeof window !== "undefined" && abcData) {
      const staffwidth = viewportWidth > 768 ? 768 : viewportWidth;

      ABCJS.renderAbc("abc-container", abcData, {
        scale: 0.8,
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

  return <div id="abc-container"></div>;
}
