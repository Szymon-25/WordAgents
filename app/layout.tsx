import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codenames - Word Guessing Game",
  description: "A modern, deterministic Codenames word-based guessing game. Play with friends using shared seed URLs.",
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
