import { Playfair_Display, Source_Serif_4, Lora } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Specify weights used in your project
  variable: "--font-playfair", // CSS variable for custom styling
  display: "swap", // Ensures fonts are displayed as fallback initially
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lora",
  display: "swap",
});
