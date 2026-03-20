import { useRef, useCallback, useEffect } from "react";

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

/**
 * useSwipeNavigation — Detects horizontal and vertical swipe gestures
 * on a target element. Returns a ref to attach to the swipeable container.
 */
export function useSwipeNavigation<T extends HTMLElement = HTMLDivElement>(
  options: SwipeOptions
) {
  const ref = useRef<T>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const threshold = options.threshold ?? 50;
  const enabled = options.enabled ?? true;

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.time;
      touchStart.current = null;

      // Must be a quick swipe (< 500ms) and exceed threshold
      if (dt > 500) return;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Horizontal swipe
      if (absDx > absDy && absDx > threshold) {
        if (dx < 0) options.onSwipeLeft?.();
        else options.onSwipeRight?.();
      }
      // Vertical swipe
      else if (absDy > absDx && absDy > threshold) {
        if (dy < 0) options.onSwipeUp?.();
        else options.onSwipeDown?.();
      }
    },
    [enabled, threshold, options.onSwipeLeft, options.onSwipeRight, options.onSwipeUp, options.onSwipeDown]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);

  return ref;
}
