import { useEffect, useRef } from "react";

/**
 * The visitor stands in the Relay 1 chamber from the issued exhibition plate.
 * Poster frame, title, and sensory notes stay off the picture.
 * Cave walls, bison, and handprints are that plate. They are not redrawn.
 * The fire in the stone pit is a living flame, and the paintings brighten with it.
 */
const PLATE_URL = "/exhibition/relay-1-fire-plate.jpg";
const CHAMBER = { x: 92, y: 348, width: 986, height: 630 };

interface Ember {
  x: number;
  y: number;
  vy: number;
  drift: number;
  life: number;
  size: number;
}

function coverChamber(viewWidth: number, viewHeight: number) {
  const scale = Math.max(viewWidth / CHAMBER.width, viewHeight / CHAMBER.height);
  const width = CHAMBER.width * scale;
  const height = CHAMBER.height * scale;
  return {
    x: (viewWidth - width) / 2,
    y: (viewHeight - height) / 2,
    width,
    height,
    scale,
  };
}

function paintChamber(
  context: CanvasRenderingContext2D,
  plate: HTMLImageElement,
  viewWidth: number,
  viewHeight: number,
  time: number,
  embers: Ember[],
) {
  const frame = coverChamber(viewWidth, viewHeight);
  context.fillStyle = "#140c08";
  context.fillRect(0, 0, viewWidth, viewHeight);
  context.drawImage(
    plate,
    CHAMBER.x,
    CHAMBER.y,
    CHAMBER.width,
    CHAMBER.height,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  );

  const flicker = 0.55 + 0.45 * Math.sin(time * 7.4);
  const pitX = frame.x + frame.width * 0.5;
  const pitY = frame.y + frame.height * 0.69;
  const paintings = [
    { x: 0.16, y: 0.34, rx: 0.14, ry: 0.16 },
    { x: 0.5, y: 0.28, rx: 0.18, ry: 0.14 },
    { x: 0.84, y: 0.34, rx: 0.12, ry: 0.16 },
  ];
  context.save();
  context.globalCompositeOperation = "lighter";
  for (const spot of paintings) {
    const px = frame.x + spot.x * frame.width;
    const py = frame.y + spot.y * frame.height;
    const paint = context.createRadialGradient(px, py, 4, px, py, spot.rx * frame.width);
    paint.addColorStop(0, `rgba(255, 186, 90, ${0.1 * flicker})`);
    paint.addColorStop(1, "rgba(255, 120, 40, 0)");
    context.fillStyle = paint;
    context.beginPath();
    context.ellipse(px, py, spot.rx * frame.width, spot.ry * frame.height, 0, 0, Math.PI * 2);
    context.fill();
  }
  const breath = 0.1 + 0.08 * Math.sin(time * 8.2);
  const light = context.createRadialGradient(pitX, pitY, 6, pitX, pitY, frame.width * 0.16);
  light.addColorStop(0, `rgba(255, 170, 50, ${breath})`);
  light.addColorStop(1, "rgba(255, 70, 0, 0)");
  context.fillStyle = light;
  context.beginPath();
  context.ellipse(pitX, pitY, frame.width * 0.15, frame.height * 0.07, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const flameX = pitX - frame.width * 0.08;
  const flameY = pitY;
  const flameW = frame.width * 0.16;
  const flameH = frame.height * 0.08;

  context.save();
  context.shadowColor = "#ffd7a1";
  context.shadowBlur = 6;
  for (const ember of embers) {
    ember.y -= ember.vy;
    ember.x += ember.drift + Math.sin(time * 5 + ember.y) * 0.12;
    ember.life -= 0.006;
    if (ember.life <= 0 || ember.y < flameY - flameH * 0.8) {
      ember.x = flameX + flameW * (0.2 + Math.random() * 0.6);
      ember.y = flameY + flameH * 0.55;
      ember.vy = 0.55 + Math.random() * 1.15;
      ember.drift = (Math.random() - 0.5) * 0.35;
      ember.life = 0.55 + Math.random() * 0.45;
      ember.size = 1.1 + Math.random() * 1.6;
    }
    context.globalAlpha = Math.max(0, ember.life);
    context.fillStyle = ember.life > 0.5 ? "#fff1cf" : "#ff9a3c";
    context.beginPath();
    context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

export function FirePit({ caption }: { caption: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const plate = new Image();
    plate.src = PLATE_URL;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const embers: Ember[] = Array.from({ length: 28 }, () => ({
      x: 0,
      y: 0,
      vy: 0.6 + Math.random() * 1.1,
      drift: (Math.random() - 0.5) * 0.3,
      life: Math.random(),
      size: 1.1 + Math.random() * 1.6,
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
      if (!reduced) frame = requestAnimationFrame(paint);
      if (width < 2 || !plate.complete || plate.naturalWidth < 2) return;
      paintChamber(context, plate, width, height, reduced ? 1.2 : now / 1000, embers);
    };
    const start = () => {
      if (reduced) paint(0);
      else frame = requestAnimationFrame(paint);
    };
    if (plate.complete) start();
    else plate.addEventListener("load", start, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <figure data-testid="fire-pit" className="w-full">
      <canvas
        ref={canvasRef}
        data-testid="fire-flames"
        aria-label="Fire hall. Cave walls, a stone fire pit with flickering flames, and cave paintings of bison and handprints."
        className="block h-[68svh] min-h-[420px] w-full bg-[#140c08]"
      />
      <figcaption
        data-testid="fire-caption"
        className="bg-[#140c08] px-4 py-3 text-center font-sans text-base not-italic leading-relaxed tracking-normal text-amber-50"
      >
        {caption}
      </figcaption>
    </figure>
  );
}
