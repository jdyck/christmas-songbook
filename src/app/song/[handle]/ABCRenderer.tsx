"use client";

import { useEffect } from "react";
import ABCJS from "abcjs";

export default function ABCRenderer({ abcData }: { abcData: string }) {
  useEffect(() => {
    if (abcData) {
      ABCJS.renderAbc("abc-container", abcData);
    }
  }, [abcData]);

  return <div id="abc-container"></div>;
}
