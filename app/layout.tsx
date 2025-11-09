import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Agents - Word Guessing Game",
  description: "A modern, deterministic word-based guessing game. Play with friends using shared game codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
