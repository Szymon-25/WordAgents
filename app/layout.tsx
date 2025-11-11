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
  const bgUrl = `${prefix}/background.webp`;
  return (
    <html lang="en">
      <body className="antialiased">
      {/* <head>
        {/* Preload background for faster first paint *
  <link rel="preload" as="image" href={bgUrl} fetchPriority="high" />
      </head>
      <body className="antialiased" style={{ ["--bg-url" as any]: `url('${bgUrl}')` }}>
        {/* Debug banner showing resolved background URL and base path; remove in production 
        
          <div className="fixed top-0 left-0 right-0 z-50 text-xs font-mono bg-black/70 text-white px-3 py-1 flex flex-wrap gap-4 justify-center">
            <span>BG URL: {bgUrl}</span>
            <span>BASE_PATH: {prefix || '(none)'}</span>
          </div> */}
        <RulesDialogProvider>{children}</RulesDialogProvider>
      </body>
    </html>
  );
}
