"use client";
import type { Metadata } from "next";
import "./globals.css";
import RulesDialogProvider from "@/components/RulesDialogProvider";

export const metadata: Metadata = {
  title: "Word Agents",
  description: "A modern, deterministic word-based guessing game. Play with friends using shared game codes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const bgUrl = `${prefix}/background.jpg`;
  console.log("Background URL:", bgUrl);
  console.log("Process env:", process.env.NEXT_PUBLIC_BASE_PATH);
  return (
    <html lang="en">
      <head>
        {/* Preload background for faster first paint */}
  <link rel="preload" as="image" href={bgUrl} fetchPriority="high" />
      </head>
      <body className="antialiased" style={{ ["--bg-url" as any]: `url('${bgUrl}')` }}>
        <RulesDialogProvider>{children}</RulesDialogProvider>
      </body>
    </html>
  );
}
