import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Auto-fit text to its container by adjusting font size.
 * - Keeps text on one line (no wrap)
 * - Recomputes on container resize and text changes
 */
export function useFitText(options?: { min?: number; max?: number; step?: number; enabled?: boolean }) {
  const { min = 8, max = 64, step = 1, enabled = true } = options || {};
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(max);

  const measureFits = useCallback((size: number) => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return true;

    // Apply test size
    text.style.fontSize = `${size}px`;
    text.style.whiteSpace = 'nowrap';

    // Measure after layout
    const fitsWidth = text.scrollWidth <= container.clientWidth;
    const fitsHeight = text.scrollHeight <= container.clientHeight;
    return fitsWidth && fitsHeight;
  }, []);

  const recompute = useCallback(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // Binary search for best size
    let lo = min;
    let hi = max;
    let best = min;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (measureFits(mid)) {
        best = mid;
        lo = mid + step; // try bigger
      } else {
        hi = mid - step; // try smaller
      }
    }

    setFontSize(best);
  }, [max, min, step, measureFits, enabled]);

  useEffect(() => {
    if (!enabled) return;
    // Initial compute after mount
    const id = requestAnimationFrame(recompute);
    return () => cancelAnimationFrame(id);
  }, [recompute, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => recompute());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recompute, enabled]);

  return { containerRef, textRef, fontSize, recompute } as const;
}
