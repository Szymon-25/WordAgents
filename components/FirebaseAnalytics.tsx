"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getFirebaseAnalytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function FirebaseAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    getFirebaseAnalytics().then((analytics) => {
      if (!mounted || !analytics) return;
      // Send a page_view on initial load and on client-side navigations
      try {
        logEvent(analytics, "page_view", { page_path: pathname });
      } catch {}
    });
    return () => {
      mounted = false;
    };
  }, [pathname]);

  return null;
}
