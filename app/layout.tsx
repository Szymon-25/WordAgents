import type { Metadata } from "next";
import "./globals.css";
import RulesDialogProvider from "@/components/RulesDialogProvider";

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
        <RulesDialogProvider>{children}</RulesDialogProvider>
      </body>
    </html>
  );
}
