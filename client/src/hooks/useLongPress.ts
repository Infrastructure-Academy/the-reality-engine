import { useRef, useCallback } from "react";

interface UseLongPressOptions {
  onLongPress: () => void;
  onPress?: () => void;
  delay?: number;
}

/**
 * Hook that detects long-press (touch hold) vs normal tap.
 * Returns event handlers to spread onto an element.
 */
export function useLongPress({ onLongPress, onPress, delay = 500 }: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isLongPressRef.current = false;

    // Record start position to detect movement
    if ("touches" in e) {
      startPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      startPosRef.current = { x: e.clientX, y: e.clientY };
    }

    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const move = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    // Cancel if finger moved too far (10px threshold)
    let x = 0, y = 0;
    if ("touches" in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    const dx = x - startPosRef.current.x;
    const dy = y - startPosRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > 10) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // If it wasn't a long press, treat as normal tap
    if (!isLongPressRef.current && onPress) {
      onPress();
    }
  }, [onPress]);

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: end,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: end,
  };
}
