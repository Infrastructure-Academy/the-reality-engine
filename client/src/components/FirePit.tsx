import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number;
  size: number;
}

interface Tongue {
  x: number;
  h: number;
  w: number;
  phase: number;
  hot: boolean;
  core: boolean;
}

/**
 * A designed fire chamber. Flames are painted every frame so the pit reads as
 * live fire. The exhibition plate is not pasted into this hall.
 */
const TONGUES: Tongue[] = [
  { x: -0.16, h: 0.42, w: 0.15, phase: 0.4, hot: false, core: false },
  { x: 0.14, h: 0.4, w: 0.14, phase: 2.1, hot: false, core: false },
  { x: -0.06, h: 0.56, w: 0.16, phase: 1.1, hot: false, core: false },
  { x: 0.05, h: 0.52, w: 0.13, phase: 2.7, hot: false, core: false },
  { x: 0, h: 0.64, w: 0.11, phase: 0.2, hot: true, core: false },
  { x: -0.07, h: 0.5, w: 0.07, phase: 1.7, hot: true, core: false },
  { x: 0.08, h: 0.46, w: 0.065, phase: 3.1, hot: true, core: false },
  { x: 0, h: 0.34, w: 0.035, phase: 0.8, hot: true, core: true },
];

function tongue(
  context: CanvasRenderingContext2D,
  x: number,
  base: number,
  height: number,
  width: number,
  lean: number,
  time: number,
  phase: number,
  hot: boolean,
  core: boolean,
) {
  const neck = Math.sin(time * 9 + phase) * width * 0.55;
  const tip = base - height;
  context.beginPath();
  context.moveTo(x - width * 0.95, base);
  context.bezierCurveTo(
    x - width * 1.15,
    base - height * 0.28,
    x - width * 0.35 + lean,
    base - height * 0.62,
    x + neck * 0.4,
    tip + height * 0.08,
  );
  context.quadraticCurveTo(x + neck, tip, x + width * 0.22 + neck * 0.3, tip + height * 0.14);
  context.bezierCurveTo(
    x + width * 0.7 + lean * 0.2,
    base - height * 0.58,
    x + width * 1.1,
    base - height * 0.26,
    x + width * 0.8,
    base,
  );
  context.closePath();
  const gradient = context.createLinearGradient(x, base, x + lean, base - height);
  if (core) {
    gradient.addColorStop(0, "rgba(255, 252, 240, 0.98)");
    gradient.addColorStop(0.45, "rgba(255, 236, 170, 0.85)");
    gradient.addColorStop(1, "rgba(255, 190, 60, 0)");
  } else if (hot) {
    gradient.addColorStop(0, "rgba(255, 214, 90, 0.95)");
    gradient.addColorStop(0.4, "rgba(255, 140, 20, 0.75)");
    gradient.addColorStop(1, "rgba(255, 60, 0, 0)");
  } else {
    gradient.addColorStop(0, "rgba(255, 90, 12, 0.82)");
    gradient.addColorStop(0.5, "rgba(180, 24, 0, 0.45)");
    gradient.addColorStop(1, "rgba(90, 0, 0, 0)");
  }
  context.fillStyle = gradient;
  context.fill();
}

function stone(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  angle: number,
  lit: boolean,
) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.beginPath();
  context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  const shade = context.createLinearGradient(-rx, -ry, rx, ry);
  shade.addColorStop(0, lit ? "#a87848" : "#6a5344");
  shade.addColorStop(0.45, lit ? "#5c4030" : "#3c3028");
  shade.addColorStop(1, "#1a120e");
  context.fillStyle = shade;
  context.fill();
  context.strokeStyle = lit ? "rgba(255, 196, 120, 0.55)" : "rgba(80, 60, 46, 0.9)";
  context.lineWidth = 1;
  context.stroke();
  context.restore();
}

function paintChamber(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  sparks: Spark[],
) {
  context.clearRect(0, 0, width, height);
  const cave = context.createLinearGradient(0, 0, 0, height);
  cave.addColorStop(0, "#24160f");
  cave.addColorStop(0.45, "#120c09");
  cave.addColorStop(1, "#070504");
  context.fillStyle = cave;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(176, 92, 42, 0.28)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(width * 0.22, height * 0.22, width * 0.06, 0.4, 5.4);
  context.stroke();
  context.beginPath();
  context.arc(width * 0.78, height * 0.18, width * 0.045, 0.2, 4.6);
  context.stroke();

  const cx = width * 0.5;
  const pitY = height * 0.74;
  const glow = 0.85 + 0.15 * Math.sin(time * 7.5) * Math.sin(time * 3.1);
  const light = context.createRadialGradient(cx, pitY - height * 0.18, 8, cx, pitY, width * 0.72);
  light.addColorStop(0, `rgba(255, 170, 60, ${0.55 * glow})`);
  light.addColorStop(0.35, `rgba(180, 50, 8, ${0.28 * glow})`);
  light.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = light;
  context.fillRect(0, 0, width, height);

  const pitRx = width * 0.32;
  const pitRy = Math.max(22, height * 0.07);
  for (let index = 0; index < 9; index += 1) {
    const angle = Math.PI + 0.15 + (index / 8) * (Math.PI - 0.3);
    const wobble = 1 + ((index % 3) - 1) * 0.18;
    stone(
      context,
      cx + Math.cos(angle) * pitRx,
      pitY + Math.sin(angle) * pitRy * 0.9,
      width * 0.055 * wobble,
      pitRy * 0.55,
      angle * 0.2,
      false,
    );
  }

  context.save();
  context.globalCompositeOperation = "lighter";
  for (const item of TONGUES) {
    const flicker = 0.78 + 0.22 * Math.sin(time * (item.core ? 13 : 8) + item.phase);
    const lean = Math.sin(time * 3.4 + item.phase) * width * item.w * 0.45;
    tongue(
      context,
      cx + item.x * width + lean * 0.15,
      pitY + 6,
      height * item.h * flicker,
      width * item.w * (0.85 + 0.15 * flicker),
      lean,
      time,
      item.phase,
      item.hot,
      item.core,
    );
  }
  context.restore();

  const coals = context.createRadialGradient(cx, pitY, 4, cx, pitY, pitRx * 0.7);
  coals.addColorStop(0, "rgba(255, 236, 190, 0.95)");
  coals.addColorStop(0.4, "rgba(255, 120, 20, 0.8)");
  coals.addColorStop(1, "rgba(80, 10, 0, 0)");
  context.fillStyle = coals;
  context.beginPath();
  context.ellipse(cx, pitY + 4, pitRx * 0.62, pitRy * 0.55, 0, 0, Math.PI * 2);
  context.fill();

  for (let index = 0; index < 10; index += 1) {
    const angle = 0.12 + (index / 9) * (Math.PI - 0.24);
    const wobble = 1 + ((index % 4) - 1.5) * 0.14;
    stone(
      context,
      cx + Math.cos(angle) * pitRx * 1.02,
      pitY + Math.sin(angle) * pitRy * 1.05,
      width * 0.062 * wobble,
      pitRy * 0.62,
      -angle * 0.15,
      index % 2 === 0,
    );
  }

  context.shadowColor = "#ffd7a1";
  context.shadowBlur = 10;
  for (const spark of sparks) {
    spark.y -= spark.vy;
    spark.x += spark.vx + Math.sin(time * 6 + spark.y) * 0.15;
    spark.life -= 0.004;
    if (spark.life <= 0 || spark.y < height * 0.08) {
      spark.x = cx + (Math.random() - 0.5) * pitRx * 0.8;
      spark.y = pitY - Math.random() * 24;
      spark.vy = 1.4 + Math.random() * 2.4;
      spark.vx = (Math.random() - 0.5) * 0.6;
      spark.life = 0.45 + Math.random() * 0.55;
      spark.size = 1.4 + Math.random() * 2.2;
    }
    context.globalAlpha = Math.max(0, spark.life);
    context.fillStyle = spark.life > 0.45 ? "#fff6df" : "#ffb15a";
    context.beginPath();
    context.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
  context.shadowBlur = 0;
}

export function FirePit({ caption }: { caption: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sparks: Spark[] = Array.from({ length: 42 }, () => ({
      x: 0,
      y: 0,
      vy: 1.2 + Math.random() * 2.6,
      vx: (Math.random() - 0.5) * 0.7,
      life: Math.random(),
      size: 1.4 + Math.random() * 2.2,
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
      const cx = width * 0.5;
      const pitY = height * 0.74;
      for (const spark of sparks) {
        spark.x = cx + (Math.random() - 0.5) * width * 0.22;
        spark.y = pitY - Math.random() * height * 0.45;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);

    const paint = (now: number) => {
      if (!reduced) frame = requestAnimationFrame(paint);
      if (width < 2) return;
      paintChamber(context, width, height, reduced ? 1.4 : now / 1000, sparks);
    };
    if (reduced) paint(0);
    else frame = requestAnimationFrame(paint);
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
        aria-label="Fire hall. A stone pit with live flickering flames."
        className="block h-[68svh] min-h-[420px] w-full bg-[#120c09]"
      />
      <figcaption
        data-testid="fire-caption"
        className="bg-[#120c09] px-4 py-3 text-center font-sans text-base not-italic leading-relaxed tracking-normal text-amber-50"
      >
        {caption}
      </figcaption>
    </figure>
  );
}
