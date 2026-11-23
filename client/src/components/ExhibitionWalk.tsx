import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ExhibitionClip } from "@/components/ExhibitionClip";
import { EXHIBITION_PLATE_TYPE } from "@/components/ExplorerVideo";
import { beginFireBedFromGesture } from "@/lib/firePlayback";
import { beginHallStoryForPath } from "@/lib/hallStory";
import {
  CLOSE_PATH,
  FIRE_HALL_PATH,
  HALL_CARDS,
  V6_FIRE,
  V6_TREE,
  v6HallClip,
  type HallCard,
  type V6Clip,
} from "@shared/exhibitionPortal";

const ACCENT: Record<string, string> = {
  fire: "#f97316",
  tree: "#34d399",
  river: "#38bdf8",
  horse: "#facc15",
  roads: "#d6d3d1",
  ships: "#22d3ee",
  loom: "#c084fc",
  rail: "#fb7185",
  engine: "#f59e0b",
  "aaa-triad": "#fb7185",
  orbit: "#a5b4fc",
  "human-nodes": "#fcd34d",
  "fractal-connector": "#fbbf24",
};

function clipFor(hall: HallCard): V6Clip | null {
  if (hall.id === "fire") return V6_FIRE;
  if (hall.id === "tree") return V6_TREE;
  return v6HallClip(hall.id);
}

function openHall(href: string | null) {
  if (href === FIRE_HALL_PATH) beginFireBedFromGesture();
  else beginHallStoryForPath(href);
}

/**
 * A walk through the thirteen halls, Fire first.
 * The issued plate stays beside this. The walk is the room, not the plate.
 */
export function ExhibitionWalk() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const hall = HALL_CARDS[index];
  const clip = clipFor(hall);
  const accent = ACCENT[hall.id] ?? "#fcd34d";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((value) => Math.min(HALL_CARDS.length - 1, value + 1));
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="mt-4" data-testid="exhibition-walk" aria-labelledby="exhibition-walk-title">
      <h3 id="exhibition-walk-title" className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>
        Walk the exhibition
      </h3>
      <p className="mt-2 text-amber-50" style={EXHIBITION_PLATE_TYPE}>
        Fire is first. The planet stays the zero, below the halls.
      </p>

      <div
        className="relative mt-4 h-[68svh] min-h-[420px] overflow-hidden rounded-[28px] border border-amber-200/30 bg-[#07060a]"
        data-testid="exhibition-walk-stage"
        style={{ perspective: "1100px" }}
      >
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10%] bottom-[-8%] h-[46%] origin-bottom"
          style={{
            transform: "rotateX(72deg)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(120,53,15,0.15) 18%, rgba(252,211,77,0.55) 50%, rgba(120,53,15,0.15) 82%, transparent 100%), repeating-linear-gradient(90deg, #1c1410 0 28px, #120e0c 28px 30px)",
            boxShadow: "0 0 80px rgba(251,146,60,0.25)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_70%,#050308_100%)]" />

        {HALL_CARDS.map((item, itemIndex) => {
          const depth = itemIndex - index;
          if (depth < -1 || depth > 3) return null;
          const glow = ACCENT[item.id] ?? "#fcd34d";
          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-[18%] w-[min(78%,280px)]"
              style={{
                transform: reduced
                  ? `translateX(-50%) translateY(${depth * 28}px) scale(${depth === 0 ? 1 : 0.92})`
                  : `translateX(-50%) translateY(${depth * -18}px) translateZ(${depth * -240}px)`,
                opacity: depth < 0 ? 0 : 1 - depth * 0.22,
                zIndex: 20 - depth,
                transition: reduced ? undefined : "transform 700ms ease, opacity 700ms ease",
                pointerEvents: depth === 0 ? "auto" : "none",
              }}
            >
              <div
                className="relative overflow-hidden rounded-t-[140px] rounded-b-xl border px-4 pb-5 pt-8 text-center"
                style={{
                  borderColor: glow,
                  background: `radial-gradient(circle at 50% 0%, ${glow}55, #140c08 58%)`,
                  boxShadow: depth === 0 ? `0 0 48px ${glow}66, inset 0 0 40px ${glow}33` : undefined,
                  minHeight: depth === 0 ? 220 : 160,
                }}
              >
                {item.id === "fire" && depth === 0 ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-8 top-6 h-16 rounded-full blur-md"
                    style={{
                      background: "radial-gradient(circle, #fdba74, #ea580c 60%, transparent 72%)",
                      animation: reduced ? undefined : "fire-flicker 1.1s ease-in-out infinite",
                    }}
                  />
                ) : null}
                <p className="relative font-heading text-4xl text-amber-50">{item.number}</p>
                <p className="relative mt-1 font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{item.name}</p>
              </div>
            </div>
          );
        })}

        <style>{`@keyframes fire-flicker { 0%,100% { opacity: .75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }`}</style>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 bg-gradient-to-t from-[#07060a] via-[#07060a]/90 to-transparent px-3 pb-3 pt-10">
          <button
            type="button"
            data-testid="walk-back"
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="inline-flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-full border border-amber-200/40 px-3 text-sm text-amber-50 disabled:opacity-30"
          >
            Back
          </button>
          {hall.href ? (
            <Link
              href={hall.href}
              data-testid="walk-enter"
              onClick={() => openHall(hall.href)}
              className="inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-full px-3 text-center font-heading text-amber-950"
              style={{ background: accent }}
            >
              {hall.href === CLOSE_PATH ? "Open the epilogue" : `Enter ${hall.name}`}
            </Link>
          ) : (
            <span className="inline-flex min-h-12 flex-1 items-center justify-center text-sm text-amber-100">The floor holds this hall.</span>
          )}
          <button
            type="button"
            data-testid="walk-forward"
            disabled={index >= HALL_CARDS.length - 1}
            onClick={() => setIndex((value) => Math.min(HALL_CARDS.length - 1, value + 1))}
            className="inline-flex min-h-12 min-w-12 touch-manipulation items-center justify-center rounded-full border border-amber-200/40 px-3 text-sm text-amber-50 disabled:opacity-30"
          >
            On
          </button>
        </div>
      </div>

      <div className="mt-3 min-w-0" data-testid="walk-hall-scroll">
        <div className="w-full min-w-0 touch-pan-x overflow-x-auto overscroll-x-contain pb-1">
          <div className="flex w-max gap-2 pe-2">
            {HALL_CARDS.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                data-testid={`walk-hall-${item.number}`}
                onClick={() => setIndex(itemIndex)}
                className="flex h-16 w-[4.6rem] shrink-0 touch-manipulation flex-col items-center justify-center rounded-lg border text-amber-50"
                style={{
                  borderColor: itemIndex === index ? accent : "rgba(252,211,77,0.3)",
                  background: itemIndex === index ? "#2a160c" : "#100c09",
                }}
              >
                <span className="font-heading text-sm">{item.number}</span>
                <span className="px-1 text-center text-[10px] leading-tight">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3" data-testid="walk-plaque">
        <p className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{`${hall.number} · ${hall.name}`}</p>
        <p className="mt-1 text-amber-50" style={EXHIBITION_PLATE_TYPE}>{`${hall.plate} · ${hall.when}`}</p>
        {clip ? (
          <>
            <p className="mt-3 text-amber-100" style={EXHIBITION_PLATE_TYPE}>{clip.label}</p>
            <ExhibitionClip clip={clip} testId={`walk-film-${hall.id}`} />
          </>
        ) : null}
      </div>
    </section>
  );
}
