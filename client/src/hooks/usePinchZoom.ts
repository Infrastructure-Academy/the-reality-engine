import { useRef, useEffect, useState, useCallback } from "react";

interface PinchZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Hook for pinch-to-zoom on a container element.
 * Returns a ref to attach to the container, the current transform state,
 * and a reset function.
 */
export function usePinchZoom(minScale = 1, maxScale = 3) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PinchZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  // Track pinch gesture
  const gestureRef = useRef({
    initialDistance: 0,
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    initialTranslateX: 0,
    initialTranslateY: 0,
    isPinching: false,
    isPanning: false,
    lastTouchCount: 0,
  });

  const reset = useCallback(() => {
    setState({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function getDistance(t1: Touch, t2: Touch) {
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getMidpoint(t1: Touch, t2: Touch) {
      return {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
    }

    function handleTouchStart(e: TouchEvent) {
      const g = gestureRef.current;

      if (e.touches.length === 2) {
        e.preventDefault();
        g.isPinching = true;
        g.isPanning = false;
        g.initialDistance = getDistance(e.touches[0], e.touches[1]);
        g.initialScale = state.scale;
        const mid = getMidpoint(e.touches[0], e.touches[1]);
        g.initialX = mid.x;
        g.initialY = mid.y;
        g.initialTranslateX = state.translateX;
        g.initialTranslateY = state.translateY;
      } else if (e.touches.length === 1 && state.scale > 1) {
        // Pan when zoomed in
        g.isPanning = true;
        g.isPinching = false;
        g.initialX = e.touches[0].clientX;
        g.initialY = e.touches[0].clientY;
        g.initialTranslateX = state.translateX;
        g.initialTranslateY = state.translateY;
      }
      g.lastTouchCount = e.touches.length;
    }

    function handleTouchMove(e: TouchEvent) {
      const g = gestureRef.current;

      if (g.isPinching && e.touches.length === 2) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const ratio = dist / g.initialDistance;
        let newScale = g.initialScale * ratio;
        newScale = Math.max(minScale, Math.min(maxScale, newScale));

        const mid = getMidpoint(e.touches[0], e.touches[1]);
        const dx = mid.x - g.initialX;
        const dy = mid.y - g.initialY;

        setState({
          scale: newScale,
          translateX: g.initialTranslateX + dx,
          translateY: g.initialTranslateY + dy,
        });
      } else if (g.isPanning && e.touches.length === 1) {
        const dx = e.touches[0].clientX - g.initialX;
        const dy = e.touches[0].clientY - g.initialY;
        setState(prev => ({
          ...prev,
          translateX: g.initialTranslateX + dx,
          translateY: g.initialTranslateY + dy,
        }));
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      const g = gestureRef.current;
      if (e.touches.length < 2) {
        g.isPinching = false;
      }
      if (e.touches.length === 0) {
        g.isPanning = false;
        // Snap back to 1x if close
        setState(prev => {
          if (prev.scale < 1.1) {
            return { scale: 1, translateX: 0, translateY: 0 };
          }
          return prev;
        });
      }
      g.lastTouchCount = e.touches.length;
    }

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [state.scale, state.translateX, state.translateY, minScale, maxScale]);

  const transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
  const isZoomed = state.scale > 1.05;

  return { containerRef, transform, scale: state.scale, isZoomed, reset };
}
