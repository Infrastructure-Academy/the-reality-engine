import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { EXHIBITION_PLATE_TYPE } from "@/components/ExplorerVideo";
import {
  beginDoorFilmFromGesture,
  pauseDoorFilm,
  resetExploreDoorMode,
  setDoorFilmSlot,
  setExploreDoorMode,
  subscribeDoorFilmFace,
  type DoorFace,
} from "@/lib/doorFilmPlayback";
import {
  exploreIntro,
  filmsForDoor,
  type ExploreDoorMode,
  type QuestDoor,
  type QuestFilm,
} from "@shared/questDoorFilms";

const EXPLORE_MODES: { id: ExploreDoorMode; label: string }[] = [
  { id: "spinner", label: "Relay Spinner" },
  { id: "dungeon", label: "Dungeon Crawl" },
  { id: "grey", label: "Grey Matter" },
];

const DOOR_ACCENT: Record<QuestDoor, string> = {
  explore: "#f87171",
  flight: "#22d3ee",
  scholar: "#fbbf24",
};

/**
 * One short loops on the door. The rest of that door's films sit underneath,
 * and nowhere else. Sound starts in the tap that opens the door; if Safari
 * holds it, one tap on the film releases it.
 */
export function DoorFilmBay({
  door,
  mode = "spinner",
  rotate = false,
}: {
  door: QuestDoor;
  mode?: ExploreDoorMode;
  rotate?: boolean;
}) {
  const [exploreMode, setMode] = useState<ExploreDoorMode>(mode);
  const [face, setFace] = useState<DoorFace>("pending");
  const [watching, setWatching] = useState<QuestFilm | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<HTMLVideoElement>(null);
  const intro = door === "explore" ? exploreIntro(rotate ? exploreMode : mode) : filmsForDoor(door).find((film) => film.role === "intro");
  const row = filmsForDoor(door).filter((film) => film.id !== intro?.id);
  const accent = DOOR_ACCENT[door];

  useEffect(() => subscribeDoorFilmFace(setFace), []);

  useEffect(() => {
    setDoorFilmSlot(slotRef.current);
    return () => setDoorFilmSlot(null);
  }, []);

  useEffect(() => {
    if (!intro || door !== "explore" || !rotate) return;
    setExploreDoorMode(exploreMode);
    return () => resetExploreDoorMode();
  }, [door, exploreMode, intro, rotate]);

  function chooseMode(next: ExploreDoorMode) {
    setMode(next);
    setExploreDoorMode(next);
    setWatching(null);
    const film = exploreIntro(next);
    void beginDoorFilmFromGesture(film.src);
  }

  function hear() {
    if (!intro) return;
    setWatching(null);
    void beginDoorFilmFromGesture(intro.src);
  }

  function playWatch(film: QuestFilm) {
    pauseDoorFilm();
    flushSync(() => setWatching(film));
    const node = watchRef.current;
    if (!node) return;
    node.muted = false;
    node.loop = false;
    const pending = node.play();
    if (pending) {
      pending.catch(() => {
        node.muted = true;
        node.play().catch(() => undefined);
      });
    }
  }

  if (!intro) return null;

  return (
    <section className="mb-6" data-testid={`door-film-bay-${door}`} aria-label={`${intro.title}. This door only.`}>
      {rotate ? (
        <div className="mb-3 flex gap-2 overflow-x-auto" data-testid="explore-door-modes">
          {EXPLORE_MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseMode(item.id)}
              className="min-h-11 shrink-0 touch-manipulation rounded-full border px-3 font-heading text-sm"
              style={{
                borderColor: exploreMode === item.id ? accent : "rgba(252,211,77,0.35)",
                color: "#fff7ed",
                background: exploreMode === item.id ? "rgba(248,113,113,0.18)" : "transparent",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-amber-200/40 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div ref={slotRef} data-testid="door-film-slot" className="relative bg-black">
          {face === "blocked" ? (
            <button
              type="button"
              data-testid="door-film-hear"
              onPointerDown={hear}
              onClick={hear}
              className="absolute inset-x-3 top-3 z-10 min-h-12 touch-manipulation rounded-xl border border-amber-200/60 bg-black/75 px-3 text-left text-amber-50"
              style={EXHIBITION_PLATE_TYPE}
            >
              Tap to hear the film
            </button>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-3 bg-[#120c08] px-3 py-3">
          <div className="min-w-0">
            <p className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{intro.title}</p>
            <p className="mt-1 text-amber-100" style={EXHIBITION_PLATE_TYPE}>{intro.duration}</p>
          </div>
          {face !== "blocked" ? (
            <button
              type="button"
              onClick={hear}
              className="inline-flex h-11 shrink-0 touch-manipulation items-center rounded-full border border-amber-200/40 px-3 text-sm text-amber-50"
            >
              Hear
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2" data-testid={`door-watch-row-${door}`}>
        {row.map((film) => (
          <button
            key={film.id}
            type="button"
            data-testid={`door-watch-${film.id}`}
            onClick={() => playWatch(film)}
            className="flex min-h-14 w-full touch-manipulation items-center justify-between gap-3 rounded-xl border border-amber-200/30 bg-[#140e0a] px-3 py-2 text-left"
          >
            <span className="min-w-0 font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{film.title}</span>
            <span className="shrink-0 text-amber-100" style={EXHIBITION_PLATE_TYPE}>{film.duration}</span>
          </button>
        ))}
      </div>

      {watching ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-amber-200/40 bg-black">
          <video
            key={watching.id}
            ref={watchRef}
            src={watching.src}
            playsInline
            controls
            preload="auto"
            data-testid="door-watch-player"
            aria-label={watching.title}
            className="aspect-video w-full bg-black object-contain"
          />
          <div className="flex items-start justify-between gap-3 bg-[#120c08] px-3 py-3">
            <p className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{watching.title}</p>
            <button
              type="button"
              onClick={hear}
              className="inline-flex h-11 shrink-0 touch-manipulation items-center text-amber-50"
              style={EXHIBITION_PLATE_TYPE}
            >
              Door film
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
