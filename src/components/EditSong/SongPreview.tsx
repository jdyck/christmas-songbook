import { useEffect } from "react";
import ABCJS from "abcjs";
import { Song } from "@/interfaces/Song";

export default function SongPreview({ song }: { song: Song }) {
  const sanitizedAbcMusic = (song.abc_music || "").replace(/\r?\n|\r/g, " ");
  const sanitizedLyrics = (song.lyrics || "").replace(/\r?\n|\r/g, " ");
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

  useEffect(() => {
    if (abcCompiled) {
      ABCJS.renderAbc("abc-preview-compiled", abcCompiled, {
        responsive: "resize",
        staffwidth: 700,
        wrap: { minSpacing: 1.5, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
      });
    }
  }, [abcCompiled]);

  return <div id="abc-preview-compiled"></div>;
}
