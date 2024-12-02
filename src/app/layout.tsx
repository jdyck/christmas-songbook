import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Christmas Songbook - 🎄 Your Festive Music Collection",
  description:
    "Explore a curated collection of public domain Christmas songs. 🎄 Perfect for choirs, caroling, and holiday cheer!",
  keywords: [
    "Christmas songs",
    "public domain",
    "caroling",
    "holiday music",
    "sheet music",
    "ABC notation",
  ], // Correctly formatted as an array
  openGraph: {
    title: "Christmas Songbook 🎄",
    description: "Your go-to collection for public domain Christmas music.",
    siteName: "Christmas Songbook",
    images: [],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Songbook 🎄",
    description: "Your go-to collection for public domain Christmas music.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Meta Tags */}
        <meta name="description" content={metadata.description || ""} />
        <meta name="author" content="Johann Dyck" />

        {/* Favicon */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎄</text></svg>"
        />
      </head>
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
