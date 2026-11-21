import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
}

/**
 * Relay 1 hall, held to the exhibition plate.
 * The plate is shown whole. Flames are drawn over the stone pit each frame
 * so the fire is living, not a flat still.
 */
export function FirePit({ caption }: { caption: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const embers: Ember[] = Array.from({ length: 22 }, () => ({
      x: 0.3 + Math.random() * 0.4,
      y: 0.55 + Math.random() * 0.3,
      speed: 0.05 + Math.random() * 0.12,
      size: 1.4 + Math.random() * 2.4,
      drift: (Math.random() - 0.5) * 0.05,
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

    const drawFlame = (time: number, centre: number, spread: number, lift: number, phase: number) => {
      const flicker = 0.7 + 0.3 * Math.sin(time * 8.2 + phase) * Math.sin(time * 3.4 + phase * 1.4);
      const tongue = height * lift * flicker;
      const base = height * 0.86;
      const left = centre - spread;
      const right = centre + spread;
      const tipX = centre + Math.sin(time * 6.2 + phase) * spread * 0.28;
      const gradient = context.createLinearGradient(centre, base, centre, base - tongue);
      gradient.addColorStop(0, "rgba(255, 244, 210, 0.95)");
      gradient.addColorStop(0.22, "rgba(255, 176, 48, 0.88)");
      gradient.addColorStop(0.55, "rgba(230, 64, 8, 0.45)");
      gradient.addColorStop(1, "rgba(120, 10, 0, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(left, base);
      context.quadraticCurveTo(left + spread * 0.2, base - tongue * 0.42, tipX, base - tongue);
      context.quadraticCurveTo(right - spread * 0.12, base - tongue * 0.38, right, base);
      context.closePath();
      context.fill();
    };

    const paint = (now: number) => {
      frame = requestAnimationFrame(paint);
      if (width < 2) return;
      const time = now / 1000;
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(width / 2, height * 0.86, 4, width / 2, height * 0.7, width * 0.46);
      glow.addColorStop(0, "rgba(255, 186, 70, 0.55)");
      glow.addColorStop(0.4, "rgba(255, 90, 10, 0.18)");
      glow.addColorStop(1, "rgba(255, 40, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      const tongues = [
        { offset: -0.18, spread: 0.07, lift: 0.28, phase: 0.4 },
        { offset: -0.08, spread: 0.09, lift: 0.42, phase: 1.3 },
        { offset: 0.02, spread: 0.11, lift: 0.55, phase: 2.2 },
        { offset: 0.12, spread: 0.08, lift: 0.36, phase: 0.9 },
        { offset: 0.2, spread: 0.06, lift: 0.24, phase: 1.7 },
      ];
      for (const tongue of tongues) {
        drawFlame(time, width * (0.5 + tongue.offset), width * tongue.spread, tongue.lift, tongue.phase);
      }
      context.fillStyle = "#ffd7a2";
      for (const ember of embers) {
        ember.y -= ember.speed * 0.016;
        ember.x += ember.drift * 0.016;
        if (ember.y < 0.05) {
          ember.y = 0.84;
          ember.x = 0.34 + Math.random() * 0.32;
        }
        context.globalAlpha = Math.max(0, ember.y * 0.85);
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
    <figure data-testid="fire-pit" className="relative w-full overflow-hidden rounded-xl border border-amber-600/50 shadow-[0_0_40px_rgba(180,70,10,0.28)]">
      <img
        src="/exhibition/relay-1-fire-plate.jpg"
        alt="Relay 1, Fire. A circular stone fire pit burns in a cave-art exhibition hall."
        width={1170}
        height={1557}
        data-testid="fire-hall-plate"
        className="block h-auto w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(255,150,40,0.38), transparent 42%)",
          animation: "fire-hall-wash 1.6s ease-in-out infinite",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[17%] top-[31%] h-[24%] w-[66%] mix-blend-screen"
      />
      <style>
      {`@keyframes fire-hall-wash { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.9; } }`}
    </style>
    <figcaption
      data-testid="fire-caption"
      className="bg-black/70 px-3 py-2 text-center text-[13px] leading-snug text-amber-50"
    >
      {caption}
    </figcaption>
  </figure>
  );
}
