"use client";

import { useEffect, useState } from "react";
import ABCJS from "abcjs";

export default function ABCRenderer({ abcData }: { abcData: string }) {
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

  // Update the viewport width dynamically
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (abcData) {
      // Dynamically set staff width based on viewport size
      let staffwidth =
        viewportWidth > 768
          ? 768 // Medium screens
          : viewportWidth; // Small screens

      ABCJS.renderAbc("abc-container", abcData, {
        scale: 0.9,
        responsive: "resize",
        staffwidth,
        wrap: {
          minSpacing: 1.5,
          maxSpacing: 2.7,
          preferredMeasuresPerLine: 5, // Adjust measures per line
        },
      });
    }
  }, [abcData, viewportWidth]);

  return <div id="abc-container"></div>;
}
