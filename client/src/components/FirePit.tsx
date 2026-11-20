import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
}

/**
 * Full-width fire pit for the Fire door landing.
 * The flames are drawn each frame. There is no still plate and no side gutter.
 */
export function FirePit({ caption }: { caption: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const embers: Ember[] = Array.from({ length: 26 }, () => ({
      x: 0.32 + Math.random() * 0.36,
      y: 0.45 + Math.random() * 0.35,
      speed: 0.04 + Math.random() * 0.1,
      size: 1.2 + Math.random() * 2.2,
      drift: (Math.random() - 0.5) * 0.04,
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
      const flicker = 0.72 + 0.28 * Math.sin(time * 7.5 + phase) * Math.sin(time * 3.1 + phase * 1.7);
      const tongue = height * lift * flicker;
      const base = height * 0.78;
      const left = centre - spread;
      const right = centre + spread;
      const tipX = centre + Math.sin(time * 5 + phase) * spread * 0.35;
      const gradient = context.createLinearGradient(centre, base, centre, base - tongue);
      gradient.addColorStop(0, "rgba(255, 236, 170, 0.95)");
      gradient.addColorStop(0.28, "rgba(255, 150, 30, 0.9)");
      gradient.addColorStop(0.62, "rgba(220, 50, 8, 0.55)");
      gradient.addColorStop(1, "rgba(80, 0, 0, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(left, base);
      context.quadraticCurveTo(left + spread * 0.15, base - tongue * 0.45, tipX, base - tongue);
      context.quadraticCurveTo(right - spread * 0.1, base - tongue * 0.4, right, base);
      context.closePath();
      context.fill();
    };

    const paint = (now: number) => {
      frame = requestAnimationFrame(paint);
      if (width < 2) return;
      const time = now / 1000;
      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#120804");
      sky.addColorStop(0.45, "#3a1408");
      sky.addColorStop(1, "#1c0c06");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(width / 2, height * 0.78, 8, width / 2, height * 0.72, width * 0.48);
      glow.addColorStop(0, "rgba(255, 170, 50, 0.55)");
      glow.addColorStop(0.35, "rgba(180, 40, 0, 0.22)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const tongues = [
        { offset: -0.16, spread: 0.055, lift: 0.34, phase: 0.2 },
        { offset: -0.08, spread: 0.07, lift: 0.48, phase: 1.1 },
        { offset: 0, spread: 0.085, lift: 0.58, phase: 2.4 },
        { offset: 0.09, spread: 0.065, lift: 0.44, phase: 0.7 },
        { offset: 0.16, spread: 0.05, lift: 0.3, phase: 1.8 },
      ];
      for (const tongue of tongues) {
        drawFlame(time, width * (0.5 + tongue.offset), width * tongue.spread, tongue.lift, tongue.phase);
      }

      context.fillStyle = "#4a2c1c";
      context.beginPath();
      context.ellipse(width / 2, height * 0.84, width * 0.38, height * 0.09, 0, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#24140e";
      context.beginPath();
      context.ellipse(width / 2, height * 0.84, width * 0.28, height * 0.05, 0, 0, Math.PI * 2);
      context.fill();

      for (let coal = 0; coal < 9; coal += 1) {
        const pulse = 0.55 + 0.45 * Math.sin(time * 6 + coal);
        context.fillStyle = `rgba(255, ${90 + coal * 8}, 20, ${pulse})`;
        context.beginPath();
        context.ellipse(width * (0.34 + coal * 0.04), height * 0.84, 8, 4.5, 0, 0, Math.PI * 2);
        context.fill();
      }

      context.fillStyle = "#ffd090";
      for (const ember of embers) {
        ember.y -= ember.speed * 0.016;
        ember.x += ember.drift * 0.016;
        if (ember.y < 0.08) {
          ember.y = 0.8;
          ember.x = 0.36 + Math.random() * 0.28;
        }
        context.globalAlpha = Math.max(0, ember.y);
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
    <figure data-testid="fire-pit" className="relative mb-1 w-full overflow-hidden rounded-xl border border-amber-700/40">
      <canvas ref={canvasRef} className="block h-[232px] w-full bg-[#140804]" aria-hidden="true" />
      <figcaption
        data-testid="fire-caption"
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-2 pt-8 text-center text-[13px] leading-snug text-amber-50"
      >
        {caption}
      </figcaption>
    </figure>
  );
}
