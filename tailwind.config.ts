import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: "#6A1B4D",
        forest: "#2C5F2D",
        goldenrod: "#CDA34F",
        navy: "#1C3D5A",
        ivory: "#FAF3E0",
        charcoal: "#3E3E3E",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Source Serif Pro", "serif"],
        accent: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
