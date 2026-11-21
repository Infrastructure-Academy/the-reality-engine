import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
}

/** Chamber inside the held plate. The poster frame, title, and notes are not shown. */
const CHAMBER = { x: 80, y: 330, width: 1000, height: 640 };
const PLATE_URL = "/exhibition/relay-1-fire-plate.jpg";

/**
 * The player stands in the Fire hall: cave art, a circular stone pit, warm light.
 * The plate file is only the photograph of that chamber. Words stay under the picture.
 */
export function FirePit({ caption }: { caption: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const plate = new Image();
    plate.src = PLATE_URL;
    const embers: Ember[] = Array.from({ length: 24 }, () => ({
      x: 0.4 + Math.random() * 0.2,
      y: 0.58 + Math.random() * 0.1,
      speed: 0.025 + Math.random() * 0.06,
      size: 1.1 + Math.random() * 1.8,
      drift: (Math.random() - 0.5) * 0.02,
    }));
    let frame = 0;
    let width = 0;
    let height = 0;

    const fit = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (nextWidth < 2 || nextHeight < 2) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(nextWidth * ratio);
      canvas.height = Math.floor(nextHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      width = nextWidth;
      height = nextHeight;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);

    const paint = (now: number) => {
      frame = requestAnimationFrame(paint);
      if (width < 2) return;
      const time = now / 1000;
      const flicker = 0.9 + 0.1 * Math.sin(time * 7.2) * Math.sin(time * 2.8);

      context.fillStyle = "#140e0a";
      context.fillRect(0, 0, width, height);
      if (plate.complete && plate.naturalWidth > 0) {
        const scale = Math.max(width / CHAMBER.width, height / CHAMBER.height);
        const drawW = CHAMBER.width * scale;
        const drawH = CHAMBER.height * scale;
        const dx = (width - drawW) / 2;
        const dy = (height - drawH) / 2;
        context.drawImage(plate, CHAMBER.x, CHAMBER.y, CHAMBER.width, CHAMBER.height, dx, dy, drawW, drawH);
      }

      const wash = context.createRadialGradient(width * 0.5, height * 0.62, 10, width * 0.5, height * 0.55, width * 0.55);
      wash.addColorStop(0, `rgba(255, 140, 40, ${0.12 * flicker})`);
      wash.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "#ffe2b8";
      for (const ember of embers) {
        ember.y -= ember.speed * 0.01;
        ember.x += ember.drift * 0.01;
        if (ember.y < 0.34) {
          ember.y = 0.62;
          ember.x = 0.42 + Math.random() * 0.16;
        }
        context.globalAlpha = Math.max(0, (ember.y - 0.3) * 1.2);
        context.fillRect(ember.x * width, ember.y * height, ember.size, ember.size);
      }
      context.globalAlpha = 1;
    };
    frame = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <figure data-testid="fire-pit" className="w-full">
      <canvas
        ref={canvasRef}
        aria-label="Fire hall. A circular stone pit burns beneath cave art."
        className="block h-[68svh] min-h-[420px] w-full bg-[#140e0a]"
      />
      <figcaption
        data-testid="fire-caption"
        className="bg-[#140e0a] px-4 py-3 text-center font-sans text-base not-italic leading-relaxed tracking-normal text-amber-50"
      >
        {caption}
      </figcaption>
    </figure>
  );
}
