"use client";

import { useEffect, useState } from 'react';

/**
 * Heuristic mobile detection. SSR-safe.
 * - Prefers viewport width (<= 768px) and UA hint for robustness
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const test = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : breakpoint + 1;
      const byWidth = w <= breakpoint;
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const byUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
      setIsMobile(byWidth || byUA);
    };

    test();
    window.addEventListener('resize', test);
    return () => window.removeEventListener('resize', test);
  }, [breakpoint]);

  return isMobile;
}

/** Orientation helper */
export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(orientation: landscape)').matches;
  });

  useEffect(() => {
    const mm = window.matchMedia('(orientation: landscape)');
    const onChange = () => setIsLandscape(mm.matches);
    if (mm.addEventListener) mm.addEventListener('change', onChange);
    else if ((mm as any).addListener) (mm as any).addListener(onChange);

    const onResize = () => setIsLandscape(window.innerWidth >= window.innerHeight);
    window.addEventListener('resize', onResize);

    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', onChange);
      else if ((mm as any).removeListener) (mm as any).removeListener(onChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return isLandscape;
}
