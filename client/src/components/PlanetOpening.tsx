import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CLOSE_PATH, FIRE_HALL_PATH, TEASER_SRC, type HallCard } from "@shared/exhibitionPortal";
import { beginHallStoryForPath } from "@/lib/hallStory";
import { beginFireBedFromGesture } from "@/lib/firePlayback";

/**
 * Episode 1 opening. The Fractal Connector teaser plays as you arrive.
 * No planet is drawn. The zero sits below and holds up the thirteen hall buttons.
 * Solar system, smoulder, settled earth, then the control panel.
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

const BEAT_LINE: Record<Beat, string> = {
  solar: "The Fractal Connector teaser plays as you arrive. It introduces the twelve pillars and brings you back.",
  smoulder: "A smouldering planet, slowly becoming settled earth. The zero is below.",
  settled: "Settled earth. Fire is harnessed, some 12,000 years ago.",
  pillars: "The thirteen rise from the zero. They are the control panel.",
};

const WASH: Record<Beat, string> = {
  solar: "bg-transparent",
  smoulder: "bg-[radial-gradient(circle_at_50%_80%,rgba(255,120,30,0.38),rgba(40,8,0,0.28)_55%,transparent_78%)]",
  settled: "bg-[radial-gradient(circle_at_50%_78%,rgba(80,140,90,0.22),transparent_70%)]",
  pillars: "bg-gradient-to-t from-[#050912] via-[#050912]/55 to-transparent",
};

function HallMark({
  hall,
  onReturn,
}: {
  hall: HallCard;
  onReturn: (id: string) => void;
}) {
  const className =
    "flex h-full min-h-16 w-full flex-col items-center justify-center rounded-md border border-amber-200/70 bg-[#102033] px-0.5 py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";
  const label = `${hall.number}. ${hall.name}. ${hall.plate}. ${hall.href === CLOSE_PATH ? "Opens the epilogue." : hall.href ? "Opens the live hall." : "Returns you to the floor."}`;
  const body = (
    <>
      <span className="font-heading text-sm leading-none text-amber-50">{hall.number}</span>
      <span className="mt-1 block px-0.5 font-heading text-[10px] leading-tight text-amber-50">{hall.name}</span>
    </>
  );
  if (hall.href) {
    return (
      <Link
        href={hall.href}
        data-testid={`portal-pillar-${hall.id}`}
        aria-label={label}
        className={className}
        onClick={() => {
          if (hall.href === FIRE_HALL_PATH) beginFireBedFromGesture();
          else beginHallStoryForPath(hall.href);
        }}
      >
        {body}
      </Link>
    );
  }
  return (
    <button type="button" data-testid={`portal-pillar-${hall.id}`} aria-label={label} className={className} onClick={() => onReturn(hall.id)}>
      {body}
    </button>
  );
}

function HallSlot({
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
      className="w-[4.6rem] shrink-0"
      style={{ height }}
    >
      <HallMark hall={hall} onReturn={onReturn} />
    </div>
  );
}

function PanelRow({ hall, onReturn }: { hall: HallCard; onReturn: (id: string) => void }) {
  const className =
    "flex min-h-14 w-full touch-manipulation items-center gap-3 rounded-lg border border-amber-200/45 bg-[#102033] px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";
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
      <Link
        href={hall.href}
        data-testid={`portal-panel-${hall.id}`}
        className={className}
        onClick={() => {
          if (hall.href === FIRE_HALL_PATH) beginFireBedFromGesture();
          else beginHallStoryForPath(hall.href);
        }}
      >
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
  const rootRef = useRef<HTMLDivElement>(null);
  const shaftWrapRef = useRef<HTMLDivElement>(null);
  const zeroRef = useRef<HTMLButtonElement>(null);
  const shaftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const teaserRef = useRef<HTMLVideoElement>(null);
  const [beat, setBeat] = useState<Beat>(reduced ? "pillars" : "solar");
  const [arrived, setArrived] = useState(reduced);
  const [muted, setMuted] = useState(false);
  const [forcedMute, setForcedMute] = useState(false);

  useEffect(() => {
    const video = teaserRef.current;
    if (!video) return;
    let stop = () => {};
    const withSound = () => {
      video.muted = false;
      setMuted(false);
      setForcedMute(false);
      return video.play();
    };
    const pending = withSound();
    if (pending) {
      pending.catch(() => {
        video.muted = true;
        setMuted(true);
        setForcedMute(true);
        video.play().catch(() => undefined);
        const onDown = () => {
          withSound()
            .then(() => window.removeEventListener("pointerdown", onDown, true))
            .catch(() => undefined);
        };
        window.addEventListener("pointerdown", onDown, true);
        stop = () => window.removeEventListener("pointerdown", onDown, true);
      });
    }
    return () => stop();
  }, [run]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get("beat");
    const forcedTime =
      forced === "smoulder" ? 8.8 : forced === "settled" ? 16.2 : forced === "pillars" ? 22.4 : forced === "end" ? DONE_AT : forced === "solar" ? 2.2 : null;
    let frame = 0;
    let last = performance.now();
    const clock = { time: reduced ? DONE_AT : forcedTime ?? 0 };
    let lastPhase = -1;
    let lastRisen = -1;
    let lastBeat: Beat | "" = "";
    let announced = reduced;

    const applyDom = () => {
      const nextBeat = beatAt(clock.time);
      const phase = phaseAt(clock.time);
      const risen = reduced || clock.time >= DONE_AT ? halls.length : risenCount(clock.time);
      const root = rootRef.current;
      const done = reduced || clock.time >= DONE_AT;
      if (root) {
        root.dataset.beat = nextBeat;
        root.dataset.risen = String(risen);
        root.dataset.settled = done ? "true" : "false";
      }
      if (nextBeat !== lastBeat) {
        lastBeat = nextBeat;
        setBeat(nextBeat);
      }
      if (done && !announced) {
        announced = true;
        setArrived(true);
      }
      if (shaftWrapRef.current) {
        const showShafts = nextBeat === "pillars";
        shaftWrapRef.current.style.opacity = showShafts ? "1" : "0";
        shaftWrapRef.current.style.pointerEvents = "none";
      }
      if (zeroRef.current) {
        const marked = nextBeat !== "solar";
        zeroRef.current.dataset.face = marked ? "marked" : "quiet";
        zeroRef.current.style.opacity = "1";
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
    };
  }, [reduced, run, halls.length, onPhase, onRisen]);

  return (
    <div ref={rootRef} data-testid="portal-planet-sequence" data-beat={beat} data-settled={arrived ? "true" : "false"}>
      <div className="overflow-hidden rounded-2xl border border-amber-200/35 bg-[#070b16]">
        <div className="relative">
          <video
            ref={teaserRef}
            src={TEASER_SRC}
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            data-testid="portal-entrance-teaser"
            aria-label="Fractal Connector teaser. It introduces the twelve pillars and brings you back."
            className="h-[42svh] min-h-[240px] w-full bg-[#070b16] object-contain"
            onEnded={(event) => {
              const video = event.currentTarget;
              video.currentTime = 0;
              video.play().catch(() => undefined);
            }}
          />
          <div className={`pointer-events-none absolute inset-0 ${WASH[beat]}`} data-testid="portal-wash" />
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-[#070b16] to-transparent px-3 pb-2 pt-8">
            <p className="min-w-0 flex-1 text-left font-heading text-sm text-amber-50">Fractal Connector teaser</p>
            <button
              type="button"
              onClick={() => {
                const video = teaserRef.current;
                if (!video) return;
                const next = !video.muted;
                video.muted = next;
                setMuted(next);
                if (!next) {
                  setForcedMute(false);
                  video.play().catch(() => undefined);
                }
              }}
              aria-label={muted ? "Hear the film" : "Silence the film"}
              className="inline-flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-full border border-amber-200/40 bg-black/50 px-3 font-heading text-xs text-amber-50"
            >
              {muted ? "Hear" : "Sound"}
            </button>
          </div>
          {forcedMute ? (
            <button
              type="button"
              onClick={() => {
                const video = teaserRef.current;
                if (!video) return;
                video.muted = false;
                setMuted(false);
                setForcedMute(false);
                video.play().catch(() => undefined);
              }}
              className="absolute inset-x-3 top-3 min-h-12 touch-manipulation rounded-xl border border-amber-200/50 bg-[#070b16]/80 px-3 font-heading text-sm text-amber-50"
            >
              Tap to hear the film
            </button>
          ) : null}
        </div>
        <div ref={shaftWrapRef} className="px-2 pt-3 opacity-0">
          <div className="flex items-end gap-1 overflow-x-auto pb-1">
            {halls.map((hall, index) => (
              <HallSlot
                key={hall.id}
                hall={hall}
                index={index}
                height={76}
                shaftRefs={shaftRefs}
                onReturn={onReturn}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center py-3">
          <button
            ref={zeroRef}
            type="button"
            data-testid="portal-zero"
            data-face="quiet"
            onClick={onReset}
            aria-label="0. The planet. Planetary Engine. Boundary-condition reset to explore."
            className="flex min-h-16 min-w-16 touch-manipulation flex-col items-center justify-center rounded-full border border-amber-100/50 bg-[#07111c] px-4 font-heading text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <span className="text-2xl leading-none">0</span>
            <span className="mt-0.5 text-[10px] tracking-wide">Planetary Engine</span>
          </button>
        </div>
      </div>
      <p data-testid="portal-beat" className="mt-2 text-center text-sm leading-snug text-amber-50">
        {BEAT_LINE[beat]}
      </p>
      {arrived ? (
        <div className="mt-3 flex flex-col gap-2" data-testid="portal-control-panel">
          <p className="text-sm leading-relaxed text-amber-50">
            The thirteen are the control panel, held up by the zero. Fire opens the live hall. The other entrances return you to the floor. Nothing is taken away.
          </p>
          {halls.map((hall) => (
            <PanelRow key={hall.id} hall={hall} onReturn={onReturn} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
