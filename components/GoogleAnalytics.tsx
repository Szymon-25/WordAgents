"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics({ measurementId }: { measurementId?: string | undefined }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("config", measurementId, { page_path: pathname });
  }, [pathname, measurementId]);

  return null;
}
