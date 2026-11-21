import { useEffect, useRef } from "react";

/**
 * The visitor stands in the Relay 1 chamber taken from the held exhibition plate.
 * Poster frame, title, and sensory notes stay off the picture.
 * The cave, stone pit, and visitors are that chamber. The fire in the pit is
 * redrawn every frame from the plate's own flames so it flickers.
 */
const PLATE_URL = "/exhibition/relay-1-fire-plate.jpg";
const CHAMBER = { x: 92, y: 348, width: 986, height: 630 };
const FLAME = { x: 0.37, y: 0.52, width: 0.26, height: 0.14 };

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

  const flameX = frame.x + FLAME.x * frame.width;
  const flameY = frame.y + FLAME.y * frame.height;
  const flameW = FLAME.width * frame.width;
  const flameH = FLAME.height * frame.height;
  const slices = 24;

  context.save();
  context.beginPath();
  context.ellipse(flameX + flameW * 0.5, flameY + flameH * 0.58, flameW * 0.5, flameH * 0.62, 0, 0, Math.PI * 2);
  context.clip();
  for (let index = 0; index < slices; index += 1) {
    const across = index / slices;
    const sway = Math.sin(time * 6.2 + across * 10) * flameW * 0.02;
    const lift = (0.35 + 0.65 * Math.sin(time * 9 + across * 13)) * flameH * 0.07;
    const sourceX = CHAMBER.x + (FLAME.x + across * FLAME.width) * CHAMBER.width;
    const sourceWidth = (CHAMBER.width * FLAME.width) / slices + 2;
    const sliceWidth = flameW / slices;
    context.drawImage(
      plate,
      sourceX,
      CHAMBER.y + FLAME.y * CHAMBER.height,
      sourceWidth,
      CHAMBER.height * FLAME.height,
      flameX + across * flameW + sway - sliceWidth * 0.25,
      flameY - lift,
      sliceWidth * 1.6,
      flameH + lift * 0.5,
    );
  }
  context.restore();

  const glow = 0.08 + 0.07 * Math.sin(time * 7.4);
  const light = context.createRadialGradient(
    flameX + flameW * 0.5,
    flameY + flameH * 0.45,
    8,
    flameX + flameW * 0.5,
    flameY + flameH * 0.2,
    flameW * 1.35,
  );
  light.addColorStop(0, `rgba(255, 170, 60, ${glow})`);
  light.addColorStop(1, "rgba(255, 80, 0, 0)");
  context.fillStyle = light;
  context.fillRect(flameX - flameW, flameY - flameH, flameW * 3, flameH * 3);

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
        aria-label="Fire hall. The exhibition chamber, with a stone pit and flickering flames."
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
