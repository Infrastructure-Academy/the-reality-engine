import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import type { HallCard } from "@shared/exhibitionPortal";

/**
 * Episode 1 opening. The visitor watches a world form, then thirteen pillars
 * rise out of that earth and become the hall control panel.
 * The static sun-and-zero diagram is not this sequence.
 */

const SMOULDER_AT = 4.6;
const SETTLED_AT = 13.2;
const PILLAR_AT = 19.4;
const STAGGER = 0.48;
const RISE_FOR = 1.15;
const DONE_AT = PILLAR_AT + 12 * STAGGER + RISE_FOR + 0.45;

type Beat = "solar" | "smoulder" | "settled" | "pillars";

function beatAt(time: number): Beat {
  if (time < SMOULDER_AT) return "solar";
  if (time < SETTLED_AT) return "smoulder";
  if (time < PILLAR_AT) return "settled";
  return "pillars";
}

function phaseAt(time: number): number {
  const beat = beatAt(time);
  if (beat === "solar") return 0;
  if (beat === "smoulder") return 1;
  if (beat === "settled") return 2;
  return 3;
}

function riseAt(time: number, index: number): number {
  if (time < PILLAR_AT) return 0;
  const start = PILLAR_AT + index * STAGGER;
  return Math.max(0, Math.min(1, (time - start) / RISE_FOR));
}

function risenCount(time: number): number {
  let count = 0;
  for (let index = 0; index < 13; index += 1) {
    if (riseAt(time, index) > 0.04) count += 1;
  }
  return count;
}

function smooth(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function mix(from: string, to: string, amount: number): string {
  const read = (hex: string) => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
  const a = read(from);
  const b = read(to);
  const channel = (index: number) => Math.round(a[index] + (b[index] - a[index]) * amount);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
}

function drawStars(context: CanvasRenderingContext2D, width: number, height: number, time: number, stars: Star[], fade: number) {
  for (const star of stars) {
    const twinkle = 0.45 + 0.55 * Math.sin(time * 1.7 + star.phase);
    context.globalAlpha = fade * twinkle;
    context.fillStyle = "#f4efe4";
    context.beginPath();
    context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function drawSun(context: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha: number) {
  if (alpha <= 0.02) return;
  const glow = context.createRadialGradient(x, y, 2, x, y, radius * 5);
  glow.addColorStop(0, `rgba(255, 236, 196, ${0.95 * alpha})`);
  glow.addColorStop(0.18, `rgba(255, 186, 74, ${0.55 * alpha})`);
  glow.addColorStop(1, "rgba(255, 140, 40, 0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, radius * 5, 0, Math.PI * 2);
  context.fill();
}

function drawFlame(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  time: number,
) {
  const flicker = 0.75 + 0.25 * Math.sin(time * 9);
  const h = height * flicker;
  context.beginPath();
  context.moveTo(x - 10, y);
  context.quadraticCurveTo(x - 4, y - h * 0.55, x + Math.sin(time * 4) * 4, y - h);
  context.quadraticCurveTo(x + 8, y - h * 0.45, x + 11, y);
  context.closePath();
  const gradient = context.createLinearGradient(x, y, x, y - h);
  gradient.addColorStop(0, "rgba(255, 236, 180, 0.95)");
  gradient.addColorStop(0.45, "rgba(255, 140, 20, 0.85)");
  gradient.addColorStop(1, "rgba(255, 50, 0, 0)");
  context.fillStyle = gradient;
  context.fill();
}

function drawPlanet(
  context: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  time: number,
  cool: number,
) {
  context.save();
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.clip();

  const base = context.createRadialGradient(cx - radius * 0.32, cy - radius * 0.36, radius * 0.08, cx, cy, radius);
  if (cool < 0.5) {
    base.addColorStop(0, "#fff3c4");
    base.addColorStop(0.22, "#ffb347");
    base.addColorStop(0.55, "#e4570a");
    base.addColorStop(1, "#3a0c04");
  } else {
    const settled = smooth((cool - 0.5) / 0.5);
    base.addColorStop(0, mix("#fff3c4", "#e7f6ff", settled));
    base.addColorStop(0.28, mix("#ffb347", "#3f8f6a", settled));
    base.addColorStop(0.62, mix("#e4570a", "#1d4e89", settled));
    base.addColorStop(1, mix("#3a0c04", "#07140f", settled));
  }
  context.fillStyle = base;
  context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const spin = time * 0.22;
  if (cool < 0.38) {
    for (let index = 0; index < 5; index += 1) {
      const angle = spin + index * 1.25;
      const px = cx + Math.cos(angle) * radius * 0.28;
      const py = cy + Math.sin(angle * 0.85) * radius * 0.32;
      const magma = context.createRadialGradient(px, py, 2, px, py, radius * 0.28);
      magma.addColorStop(0, "rgba(255, 244, 210, 0.95)");
      magma.addColorStop(0.35, "rgba(255, 120, 20, 0.75)");
      magma.addColorStop(1, "rgba(120, 20, 0, 0)");
      context.fillStyle = magma;
      context.beginPath();
      context.ellipse(px, py, radius * 0.22, radius * 0.12, angle, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "rgba(255, 236, 170, 0.9)";
    context.lineWidth = Math.max(2.5, radius * 0.028);
    context.shadowColor = "#ffb45a";
    context.shadowBlur = 12;
    context.beginPath();
    for (let index = 0; index < 6; index += 1) {
      const y = cy - radius * 0.75 + ((index * 0.18 + spin * 0.2) % 1) * radius * 1.5;
      context.moveTo(cx - radius * 0.85, y);
      context.bezierCurveTo(cx - radius * 0.2, y - radius * 0.16, cx + radius * 0.15, y + radius * 0.14, cx + radius * 0.8, y - radius * 0.04);
    }
    context.stroke();
    context.shadowBlur = 0;
  } else {
    const land = smooth((cool - 0.38) / 0.62);
    const continents = [
      [0.1, -0.15, 0.34, 0.2],
      [-0.28, 0.12, 0.26, 0.16],
      [0.22, 0.2, 0.22, 0.14],
      [-0.05, -0.38, 0.2, 0.1],
    ];
    context.fillStyle = `rgba(46, 120, 72, ${0.35 + land * 0.55})`;
    for (const [ox, oy, rx, ry] of continents) {
      context.beginPath();
      context.ellipse(cx + ox * radius, cy + oy * radius, rx * radius, ry * radius, ox, 0, Math.PI * 2);
      context.fill();
    }
  }

  if (cool > 0.62) {
    const cloud = smooth((cool - 0.62) / 0.38);
    context.fillStyle = `rgba(255, 255, 255, ${0.28 * cloud})`;
    for (let index = 0; index < 4; index += 1) {
      const y = cy - radius * 0.2 + Math.sin(spin + index) * radius * 0.35;
      context.beginPath();
      context.ellipse(cx + Math.cos(spin + index) * radius * 0.2, y, radius * 0.34, radius * 0.08, 0, 0, Math.PI * 2);
      context.fill();
    }
  }

  if (cool > 0.7) {
    drawFlame(context, cx + radius * 0.18, cy + radius * 0.22, radius * 0.28, time);
    drawFlame(context, cx + radius * 0.28, cy + radius * 0.28, radius * 0.18, time + 1);
  }
  context.restore();

  const sheen = context.createRadialGradient(cx - radius * 0.35, cy - radius * 0.4, radius * 0.05, cx, cy, radius);
  sheen.addColorStop(0, "rgba(255, 255, 245, 0.42)");
  sheen.addColorStop(0.28, "rgba(255, 255, 245, 0)");
  context.fillStyle = sheen;
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.arc(cx, cy, radius + Math.max(4, radius * 0.04), 0, Math.PI * 2);
  context.strokeStyle = cool < 0.55 ? "rgba(255, 150, 60, 0.45)" : "rgba(150, 198, 255, 0.45)";
  context.lineWidth = Math.max(5, radius * 0.05);
  context.stroke();
}

function paintWorld(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  stars: Star[],
) {
  context.clearRect(0, 0, width, height);
  const sky = context.createLinearGradient(0, 0, 0, height);
  const beat = beatAt(time);
  if (beat === "pillars") {
    sky.addColorStop(0, "#07101c");
    sky.addColorStop(0.55, "#1a140e");
    sky.addColorStop(1, "#2a1a10");
  } else if (beat === "settled") {
    sky.addColorStop(0, "#07101f");
    sky.addColorStop(1, "#101820");
  } else {
    sky.addColorStop(0, "#070b16");
    sky.addColorStop(1, "#140c0a");
  }
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  const starFade = beat === "pillars" ? 0.35 : 1;
  drawStars(context, width, height, time, stars, starFade);

  const cool =
    time < SMOULDER_AT
      ? 0.02
      : time < SETTLED_AT
        ? 0.06 + smooth((time - SMOULDER_AT) / (SETTLED_AT - SMOULDER_AT)) * 0.16
        : 0.22 + smooth(Math.min(1, (time - SETTLED_AT) / (PILLAR_AT - SETTLED_AT))) * 0.78;

  let radius = Math.min(width, height) * 0.34;
  let cx = width * 0.5;
  let cy = height * 0.42;
  if (time < SMOULDER_AT) {
    const u = smooth(time / SMOULDER_AT);
    radius = 22 + u * Math.min(width, height) * 0.16;
    cx = width * (0.72 - u * 0.16);
    cy = height * (0.56 - u * 0.06);
    drawSun(context, width * 0.28, height * 0.3, 34, 1);
  } else if (time < PILLAR_AT) {
    const u = smooth(Math.min(1, (time - SMOULDER_AT) / 2.4));
    radius = Math.min(width, height) * (0.28 + u * 0.16);
    const glow = context.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2.2);
    const heat = time < SETTLED_AT ? 0.85 : 0.85 * (1 - smooth((time - SETTLED_AT) / (PILLAR_AT - SETTLED_AT)));
    glow.addColorStop(0, `rgba(255, 120, 30, ${0.45 * heat})`);
    glow.addColorStop(1, "rgba(255, 60, 0, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(cx, cy, radius * 2.2, 0, Math.PI * 2);
    context.fill();
    drawSun(context, width * 0.14, height * 0.12, 14, Math.max(0, 1 - (time - SMOULDER_AT) / 3.2));
  }

  if (time < PILLAR_AT) drawPlanet(context, cx, cy, radius, time, cool);

  if (beat === "pillars") {
    drawFlame(context, width * 0.2, height * 0.7, 46, time);
    drawFlame(context, width * 0.27, height * 0.72, 30, time + 0.6);
  }
}

const BEAT_LINE: Record<Beat, string> = {
  solar: "Watching in from the solar system. A world is still forming.",
  smoulder: "A smouldering planet, slowly becoming settled earth.",
  settled: "Settled earth. Fire is harnessed, some 12,000 years ago.",
  pillars: "Thirteen pillars rise from the earth. They are the control panel.",
};

function PillarShaft({
  hall,
  onReturn,
}: {
  hall: HallCard;
  onReturn: (id: string) => void;
}) {
  const className =
    "relative flex h-full w-full flex-col items-center overflow-hidden px-0.5 pt-1.5 text-center bg-gradient-to-br from-[#f4e2c4] via-[#8d5c38] to-[#2a1a12] shadow-[inset_-7px_0_12px_rgba(0,0,0,0.4),inset_5px_0_8px_rgba(255,228,190,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";
  const stone = { clipPath: "polygon(8% 0%, 94% 5%, 100% 100%, 0% 100%)" };
  const label = `${hall.number}. ${hall.name}. ${hall.plate}. ${hall.href ? "Opens the live hall." : "Returns you to the floor."}`;
  const body = (
    <>
      <span className="font-heading text-base leading-none text-[#2a1608]">{hall.number}</span>
      <span className="mt-1 block px-0.5 font-heading text-[10px] leading-tight text-[#2a1608]">{hall.name}</span>
    </>
  );
  if (hall.href) {
    return (
      <Link href={hall.href} data-testid={`portal-pillar-${hall.id}`} aria-label={label} className={className} style={stone}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" data-testid={`portal-pillar-${hall.id}`} aria-label={label} className={className} style={stone} onClick={() => onReturn(hall.id)}>
      {body}
    </button>
  );
}

function PillarSlot({
  hall,
  index,
  height,
  shaftRefs,
  onReturn,
}: {
  hall: HallCard;
  index: number;
  height: number;
  shaftRefs: { current: (HTMLDivElement | null)[] };
  onReturn: (id: string) => void;
}) {
  return (
    <div
      ref={(node) => {
        shaftRefs.current[index] = node;
        if (node && node.dataset.posed !== "1") {
          node.style.transform = "translateY(120%)";
          node.style.opacity = "0";
          node.dataset.posed = "1";
        }
      }}
      className="min-w-0 flex-1"
      style={{ height }}
    >
      <PillarShaft hall={hall} onReturn={onReturn} />
    </div>
  );
}

function PanelRow({ hall, onReturn }: { hall: HallCard; onReturn: (id: string) => void }) {
  const className =
    "flex min-h-14 w-full touch-manipulation items-center gap-3 rounded-lg border border-amber-200/45 bg-gradient-to-r from-[#3a2616] to-[#1a120c] px-3 text-left shadow-[0_8px_18px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";
  const body = (
    <>
      <span className="w-8 shrink-0 font-heading text-lg text-amber-100">{hall.number}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-sm text-amber-50">{hall.name}</span>
        <span className="block text-[11px] text-amber-100/75">{`${hall.plate} · ${hall.when}`}</span>
      </span>
      <span className="text-[11px] tracking-wide text-amber-100/80 uppercase">{hall.href ? "Open" : "Entrance"}</span>
    </>
  );
  if (hall.href) {
    return (
      <Link href={hall.href} data-testid={`portal-panel-${hall.id}`} className={className}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" data-testid={`portal-panel-${hall.id}`} className={className} onClick={() => onReturn(hall.id)}>
      {body}
    </button>
  );
}

export function PlanetOpening({
  reduced,
  run,
  halls,
  onPhase,
  onRisen,
  onReset,
  onReturn,
}: {
  reduced: boolean;
  run: number;
  halls: readonly HallCard[];
  onPhase: (phase: number) => void;
  onRisen: (count: number) => void;
  onReset: () => void;
  onReturn: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const shaftWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const zeroRef = useRef<HTMLButtonElement>(null);
  const shaftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [beat, setBeat] = useState<Beat>(reduced ? "pillars" : "solar");
  const [arrived, setArrived] = useState(reduced);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const params = new URLSearchParams(window.location.search);
    const forced = params.get("beat");
    const forcedTime =
      forced === "smoulder" ? 8.8 : forced === "settled" ? 16.2 : forced === "pillars" ? 22.4 : forced === "end" ? DONE_AT : forced === "solar" ? 2.2 : null;
    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.82,
      r: Math.random() * 1.25 + 0.35,
      phase: Math.random() * Math.PI * 2,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    const clock = { time: reduced ? DONE_AT : forcedTime ?? 0 };
      let lastPhase = -1;
      let lastRisen = -1;
      let lastBeat: Beat | "" = "";
      let announced = reduced;

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
    const observer = new ResizeObserver(() => {
      fit();
      if (width > 2) paintWorld(context, width, height, reduced ? DONE_AT : clock.time, stars);
    });
    observer.observe(canvas);

    const applyDom = () => {
      const beat = beatAt(clock.time);
      const phase = phaseAt(clock.time);
      const risen = reduced || clock.time >= DONE_AT ? halls.length : risenCount(clock.time);
      const root = rootRef.current;
      const done = reduced || clock.time >= DONE_AT;
      if (root) {
        root.dataset.beat = beat;
        root.dataset.risen = String(risen);
        root.dataset.settled = done ? "true" : "false";
      }
      if (beat !== lastBeat) {
        lastBeat = beat;
        setBeat(beat);
      }
      if (done && !announced) {
        announced = true;
        setArrived(true);
      }
      if (earthRef.current) earthRef.current.style.opacity = beat === "pillars" ? "1" : "0";
      if (shaftWrapRef.current) {
        const showShafts = beat === "pillars";
        shaftWrapRef.current.style.opacity = showShafts ? "1" : "0";
        shaftWrapRef.current.style.pointerEvents = "none";
      }
      if (zeroRef.current) {
        const marked = beat === "pillars";
        zeroRef.current.dataset.face = marked ? "marked" : "quiet";
        zeroRef.current.style.opacity = marked ? "1" : "0";
      }
      if (phase !== lastPhase) {
        lastPhase = phase;
        onPhase(phase);
      }
      if (risen !== lastRisen) {
        lastRisen = risen;
        onRisen(risen);
      }
      shaftRefs.current.forEach((shaft, index) => {
        if (!shaft) return;
        const rise = done ? 1 : riseAt(clock.time, index);
        shaft.style.transform = `translateY(${(1 - rise) * 120}%)`;
        shaft.style.opacity = rise < 0.03 ? "0" : "1";
        shaft.style.pointerEvents = rise < 0.2 ? "none" : "auto";
      });
    };

    const paint = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced && forcedTime === null) clock.time += dt;
      if (width > 2) paintWorld(context, width, height, reduced ? DONE_AT : clock.time, stars);
      applyDom();
      if (!reduced && forcedTime === null) frame = requestAnimationFrame(paint);
    };

    if (reduced || forcedTime !== null) {
      paint(performance.now());
    } else {
      frame = requestAnimationFrame(paint);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduced, run, halls.length, onPhase, onRisen]);

  return (
    <div ref={rootRef} data-testid="portal-planet-sequence" data-beat={beat} data-settled={arrived ? "true" : "false"}>
      <div className="relative h-[78svh] min-h-[560px] overflow-hidden rounded-2xl border border-amber-200/35 bg-[#070b16]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div ref={shaftWrapRef} className="absolute inset-0 opacity-0">
          <div className="absolute inset-x-3 bottom-[22%] flex items-end justify-between gap-1">
            {halls.slice(7).map((hall, index) => (
              <PillarSlot key={hall.id} hall={hall} index={index + 7} height={118 + (index % 3) * 16} shaftRefs={shaftRefs} onReturn={onReturn} />
            ))}
          </div>
          <div className="absolute inset-x-2 bottom-[10%] flex items-end justify-between gap-1.5">
            {halls.slice(0, 7).map((hall, index) => (
              <PillarSlot key={hall.id} hall={hall} index={index} height={168 + (index % 3) * 22} shaftRefs={shaftRefs} onReturn={onReturn} />
            ))}
          </div>
        </div>
        <div
          ref={earthRef}
          className="pointer-events-none absolute -bottom-[18%] left-[-22%] right-[-22%] h-[44%] rounded-[50%] bg-[radial-gradient(circle_at_50%_0%,#e6c48a_0%,#7fb56e_10%,#2f6b45_28%,#16382c_62%,#07140f_100%)] opacity-0 shadow-[inset_0_12px_28px_rgba(255,214,150,0.35)]"
          aria-hidden="true"
        />
        <button
          ref={zeroRef}
          type="button"
          data-testid="portal-zero"
          data-face="quiet"
          onClick={onReset}
          aria-label="0. The planet. Boundary-condition reset to explore."
          className="absolute bottom-[8%] left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 touch-manipulation items-center justify-center rounded-full font-heading text-2xl text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 data-[face=marked]:border data-[face=marked]:border-amber-100/50 data-[face=marked]:bg-[#12352c]/85 data-[face=quiet]:opacity-0"
        >
          0
        </button>
      </div>
      <p data-testid="portal-beat" className="mt-2 text-center text-sm leading-snug text-amber-50">
        {BEAT_LINE[beat]}
      </p>
      {arrived ? (
        <div ref={panelRef} className="mt-3 flex flex-col gap-2" data-testid="portal-control-panel">
          <p className="text-sm leading-relaxed text-amber-50">
            The thirteen pillars are the control panel. Fire opens the live hall. The other entrances return you to the floor.
          </p>
          {halls.map((hall) => (
            <PanelRow key={hall.id} hall={hall} onReturn={onReturn} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
