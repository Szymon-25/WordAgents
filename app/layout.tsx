import type { Metadata } from "next";
import "./globals.css";
import RulesDialogProvider from "@/components/RulesDialogProvider";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Word Agents",
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
        {/* Google Analytics: only load when NEXT_PUBLIC_GOOGLE_ANALYTICS is set */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`\n                window.dataLayer = window.dataLayer || [];\n                function gtag(){dataLayer.push(arguments);} \n                gtag('js', new Date());\n                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', { page_path: window.location.pathname });\n              `}
            </Script>
            {/* Client component to track client-side route changes */}
            <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
          </>
        )}
        <RulesDialogProvider>{children}</RulesDialogProvider>
      </body>
    </html>
  );
}
