import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  APPROACH_LINES,
  CUT_LINE,
  DOOR_FRAME,
  FILM_LABEL,
  FILM_SRC,
  FIRE_HALL_PATH,
  TREE_HALL_PATH,
  HALL_CARDS,
  PLATE_SRC,
  EPISODE_ONE,
  LATER_EPISODES,
  RECEIVED_ZERO,
  SOUND_NOTE,
  SPIRAL_HELD,
  ZERO_IS_NOT_A_HALL,
  turnFromDoor,
  turnFromHall,
  type HallCard,
  type ReturnTurn,
} from "@shared/exhibitionPortal";
import { PlanetOpening } from "@/components/PlanetOpening";
import { beginFireBedFromGesture } from "@/lib/firePlayback";

type Stage = "opening" | "film" | "halls";
type Tone = "approach" | "smoulder" | "settled";
type Sound = "idle" | "on" | "blocked" | "failed";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function formatFilmTime(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function PlanetZero({ onReset, showCaption = true }: { tone: Tone; onReset: () => void; showCaption?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        data-testid="portal-zero"
        onClick={onReset}
        aria-label="0. The planet. Planetary Engine. Boundary-condition reset to explore."
        className="flex h-28 w-28 touch-manipulation flex-col items-center justify-center rounded-full border border-amber-100/50 bg-[#07111c] font-heading text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912]"
      >
        <span className="text-4xl leading-none">0</span>
        <span className="mt-1 text-[10px] tracking-wide">Planetary Engine</span>
      </button>
      {showCaption ? (
        <p className="mt-2 max-w-[16rem] text-center text-sm text-amber-50">The planet is the zero. It holds the halls up. It is not a fourteenth hall.</p>
      ) : null}
    </div>
  );
}

function OpeningScene({
  phase,
  risen,
  reduced,
  run,
  onPhase,
  onRisen,
  onReset,
  onReturn,
  onPlay,
}: {
  phase: number;
  risen: number;
  reduced: boolean;
  run: number;
  onPhase: (phase: number) => void;
  onRisen: (count: number) => void;
  onReset: () => void;
  onReturn: (id: string) => void;
  onPlay: () => void;
}) {
  return (
    <section aria-labelledby="portal-opening-title" data-testid="portal-approach" className="px-4">
      <h2 id="portal-opening-title" tabIndex={-1} className="font-heading text-2xl text-amber-50 focus:outline-none">
        The planet is the zero
      </h2>
      <p className="mt-2 text-sm font-heading text-amber-50" data-testid="portal-episode-1">
        {`Episode ${EPISODE_ONE.id} · ${EPISODE_ONE.title}`}
      </p>
      <p className="mt-1 text-sm text-amber-50">{EPISODE_ONE.line}</p>
      <p className="text-sm text-amber-100">{EPISODE_ONE.state}</p>

      <div className="mt-4">
        <PlanetOpening
          reduced={reduced}
          run={run}
          halls={HALL_CARDS}
          onPhase={onPhase}
          onRisen={onRisen}
          onReset={onReset}
          onReturn={onReturn}
        />
      </div>
      <p className="mt-2 text-center text-sm text-amber-50">The planet is the zero. The thirteen rise from it.</p>

      <div className="mt-4">
        <button
          type="button"
          data-testid="portal-play-film"
          onClick={onPlay}
          className="flex min-h-14 w-full touch-manipulation items-center justify-center rounded-xl border border-amber-300 bg-amber-300/15 px-4 text-base font-heading text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Play FILM-0201 with sound
        </button>
        <p className="mt-2 text-sm leading-relaxed text-amber-50">{SOUND_NOTE}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-amber-50" data-testid="portal-zero-placement">
        {RECEIVED_ZERO}
      </p>
      <p className="mt-2 text-sm text-amber-50" data-testid="portal-spiral-held">
        {SPIRAL_HELD} This cut climbs the first pass only, in through the issued film.
      </p>
      <p className="mt-2 text-sm text-amber-100">{ZERO_IS_NOT_A_HALL}</p>

      <ol className="mt-4 space-y-1" aria-label="Approach">
        {APPROACH_LINES.map((line, index) => (
          <li key={line} className={`text-sm leading-snug ${index === phase ? "text-amber-50" : "text-amber-100/45"}`}>
            {line}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-amber-50" aria-live="polite" data-testid="portal-rising">
        {risen > 0 ? `${HALL_CARDS[risen - 1].number} · ${HALL_CARDS[risen - 1].name} rises from the zero.` : "The thirteen are still held in the planet."}
      </p>
      <div className="mt-3 space-y-2" data-testid="portal-later-episodes">
        {LATER_EPISODES.map((episode) => (
          <p key={episode.id} data-testid={`portal-episode-${episode.id}`} className="text-sm leading-relaxed text-amber-100/85">
            <span className="block font-heading text-amber-50">{`Episode ${episode.id} · ${episode.title}`}</span>
            <span className="block">{episode.line}</span>
            <span className="block">{`${episode.state}. Not opened in this first cut.`}</span>
          </p>
        ))}
      </div>
      <ol className="sr-only">
        {HALL_CARDS.map((hall) => (
          <li key={hall.id}>{`${hall.number}. ${hall.name}. ${hall.plate}.`}</li>
        ))}
      </ol>
    </section>
  );
}

function ReturnNotice({ notice, onClose }: { notice: ReturnTurn; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [notice.station]);

  return (
    <div role="status" data-testid="portal-return" className="rounded-xl border border-amber-300/50 bg-[#102033] p-3">
      <h3 ref={headingRef} tabIndex={-1} className="font-heading text-base text-amber-50 focus:outline-none">
        {notice.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-amber-50">{notice.body}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg border border-amber-300/50 px-3 text-sm text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Stay on the floor
        </button>
        <Link
          href={FIRE_HALL_PATH}
          onClick={() => beginFireBedFromGesture()}
          className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-lg bg-amber-400/15 px-3 text-sm text-amber-50 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Open the Fire hall
        </Link>
      </div>
    </div>
  );
}

function HallButton({ hall, onReturn }: { hall: HallCard; onReturn: (id: string) => void }) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-base text-amber-50">{`${hall.number} · ${hall.name}`}</span>
        <span className="mt-0.5 block text-xs text-amber-100/80">{`${hall.plate} · ${hall.when}`}</span>
        <span className="mt-1 block text-sm text-amber-50">
          {hall.id === "fire"
            ? "Open the live hall and its harnessed discoveries."
            : hall.id === "tree"
              ? "Open the live Tree hall."
              : "Entrance. This returns you to the floor."}
        </span>
      </span>
      <span className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-amber-300/15 px-3 text-xs font-heading tracking-wide text-amber-50">
        {hall.href ? "Open" : "Entrance"}
      </span>
    </>
  );
  const className = `flex min-h-16 w-full shrink-0 touch-manipulation items-center gap-3 rounded-xl border px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${
    hall.href ? "border-amber-300/80 bg-[#2a140c]" : "border-amber-300/30 bg-[#0c1726]"
  }`;

  if (hall.href) {
    return (
      <Link
        href={hall.href}
        data-testid={`portal-hall-${hall.id}`}
        className={className}
        onClick={() => {
          if (hall.href === FIRE_HALL_PATH) beginFireBedFromGesture();
        }}
      >
        {body}
      </Link>
    );
  }

  return (
    <button type="button" data-testid={`portal-hall-${hall.id}`} className={className} onClick={() => onReturn(hall.id)}>
      {body}
    </button>
  );
}

export default function ExhibitionPortal() {
  const [, navigate] = useLocation();
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("opening");
  const [phase, setPhase] = useState(0);
  const [risen, setRisen] = useState(0);
  const [run, setRun] = useState(0);
  const [sound, setSound] = useState<Sound>("idle");
  const [second, setSecond] = useState(0);
  const [notice, setNotice] = useState<ReturnTurn | null>(null);

  useEffect(() => {
    if (stage !== "opening" || !reduced) return;
    setPhase(3);
    setRisen(HALL_CARDS.length);
  }, [stage, reduced, run]);

  useEffect(() => {
    const id = stage === "opening" ? "portal-opening-title" : stage === "film" ? "portal-film-title" : "portal-halls-title";
    document.getElementById(id)?.focus();
  }, [stage, run]);

  useEffect(() => {
    const station = new URLSearchParams(window.location.search).get("station");
    if (!station) return;
    const turn = turnFromHall(station);
    if (turn.kind === "hall") {
      if (turn.path === FIRE_HALL_PATH) beginFireBedFromGesture();
      navigate(turn.path);
      return;
    }
    if (turn.kind === "return") {
      setStage("halls");
      setNotice(turn);
    }
  }, [navigate]);

  function resetToZero() {
    videoRef.current?.pause();
    setNotice(null);
    setSound("idle");
    setSecond(0);
    setStage("opening");
    setRun((value) => value + 1);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  function hearFilm() {
    const video = videoRef.current;
    if (!video) {
      setSound("blocked");
      return;
    }
    video.muted = false;
    video.volume = 1;
    const pending = video.play();
    if (pending && typeof pending.then === "function") {
      pending.then(() => setSound("on")).catch(() => setSound("blocked"));
    } else {
      setSound("on");
    }
  }

  function startFilm() {
    flushSync(() => {
      setNotice(null);
      setStage("film");
    });
    hearFilm();
  }

  function openHalls() {
    videoRef.current?.pause();
    setNotice(null);
    setStage("halls");
  }

  function chooseHall(id: string) {
    const turn = turnFromHall(id);
    if (turn.kind === "return") setNotice(turn);
  }

  function chooseDoor(id: string) {
    const turn = turnFromDoor(id);
    if (turn.kind === "reset") {
      resetToZero();
      return;
    }
    if (turn.kind === "return") {
      setStage("halls");
      setNotice(turn);
    }
  }

  const soundLine =
    sound === "on"
      ? "The issued soundtrack is playing."
      : sound === "blocked"
        ? "Tap to hear the film. On iPhone, Safari may wait for this tap. After it, the issued soundtrack plays."
        : sound === "failed"
          ? "The issued film did not start. You can enter the halls. Nothing is lost."
          : "The film is ready. Your tap plays the issued soundtrack.";

  return (
    <div className="mobile-content-pad min-h-screen overflow-x-hidden bg-[#050912] text-amber-50" data-testid="portal-cut">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="inline-flex min-h-11 touch-manipulation items-center text-sm text-amber-100 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Back to the landing
        </Link>
        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/80">Rematched draft</p>
      </header>

      <div className="mx-auto max-w-5xl">
        <div className="px-4">
          <h1 className="font-heading text-3xl text-amber-50 sm:text-4xl">Exhibition portal</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-amber-50" data-testid="portal-cut-line">
            {CUT_LINE}
          </p>
        </div>

        {stage === "opening" ? (
          <div className="mt-4">
            {notice ? (
              <div className="px-4 pb-3">
                <ReturnNotice notice={notice} onClose={() => setNotice(null)} />
              </div>
            ) : null}
            <OpeningScene
              phase={reduced ? 3 : phase}
              risen={reduced ? HALL_CARDS.length : risen}
              reduced={reduced}
              run={run}
              onPhase={setPhase}
              onRisen={setRisen}
              onReset={resetToZero}
              onReturn={chooseHall}
              onPlay={startFilm}
            />
          </div>
        ) : null}

        <section
          aria-labelledby="portal-film-title"
          data-testid="portal-film-stage"
          className={stage === "film" ? "relative z-10 px-4 pb-8" : "pointer-events-none absolute h-px w-px overflow-hidden opacity-0"}
          aria-hidden={stage === "film" ? undefined : true}
        >
          {stage === "film" ? (
            <>
              <h2 id="portal-film-title" tabIndex={-1} className="font-heading text-2xl text-amber-50 focus:outline-none">
                Mode B · Dungeon Crawl
              </h2>
              <p className="mt-2 text-sm text-amber-50">{FILM_LABEL}</p>
              <p className="mt-1 text-sm text-amber-50">Issued Video 2, played as it stands. No new film, and no substitute soundtrack.</p>
            </>
          ) : null}
          <video
            ref={videoRef}
            data-testid="portal-film"
            src={FILM_SRC}
            playsInline
            controls
            preload="auto"
            aria-label={FILM_LABEL}
            className={stage === "film" ? "mt-3 aspect-video w-full rounded-xl bg-black" : "h-px w-px"}
            onEnded={openHalls}
            onPlaying={() => setSound("on")}
            onError={() => setSound("failed")}
            onTimeUpdate={(event) => {
              const next = Math.floor(event.currentTarget.currentTime);
              setSecond((prev) => (prev === next ? prev : next));
            }}
          />
          {stage === "film" ? (
            <>
              <p className="mt-2 text-sm text-amber-50" aria-live="polite" data-testid="portal-sound">
                {soundLine}
              </p>
              <p className="mt-1 font-mono text-sm text-amber-100" data-testid="portal-film-time">
                {`${formatFilmTime(second)} / 0:24`}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  data-testid="portal-hear-film"
                  onClick={hearFilm}
                  className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl border border-amber-300/70 px-4 text-sm text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  Tap to hear the film
                </button>
                <button
                  type="button"
                  data-testid="portal-enter-halls"
                  onClick={openHalls}
                  className="inline-flex min-h-12 touch-manipulation items-center justify-center rounded-xl bg-amber-300/15 px-4 text-sm text-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  Enter the 13 halls
                </button>
                <button
                  type="button"
                  onClick={resetToZero}
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center text-sm text-amber-100 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  Boundary-condition reset
                </button>
              </div>
            </>
          ) : null}
        </section>

        {stage === "halls" ? (
          <section aria-labelledby="portal-halls-title" data-testid="portal-halls" className="px-4 pb-10">
            <h2 id="portal-halls-title" tabIndex={-1} className="font-heading text-2xl text-amber-50 focus:outline-none">
              Thirteen halls, held up by the zero
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-50">
              Fire and Tree open their live halls. The other entrances return you to the floor. Nothing is taken away. {ZERO_IS_NOT_A_HALL}
            </p>
            {notice ? (
              <div className="mt-3">
                <ReturnNotice notice={notice} onClose={() => setNotice(null)} />
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-start">
              <div>
                <div
                  data-testid="portal-hall-stack"
                  className="flex max-h-[calc(100svh-14rem)] min-h-[22rem] flex-col gap-2 overflow-y-auto pr-1"
                >
                  {HALL_CARDS.map((hall) => (
                    <HallButton key={hall.id} hall={hall} onReturn={chooseHall} />
                  ))}
                </div>
                <div className="mt-3 rounded-2xl border border-amber-300/30 bg-[#07111c] py-4">
                  <PlanetZero tone="settled" onReset={resetToZero} />
                </div>
              </div>

              <figure className="min-w-0">
                <img
                  src={PLATE_SRC}
                  width={1170}
                  height={2532}
                  alt="Issued exhibition plate, shown whole: the 50,000 square foot floor plan, the thirteen hall cards, and the vision board."
                  data-testid="portal-plate"
                  className="mx-auto h-auto w-full max-w-[28rem] rounded-xl border border-amber-300/40"
                />
                <figcaption className="mt-2 text-sm leading-relaxed text-amber-50">
                  The plate is shown whole, as issued. Its printed wording stays on the plate. It is not used to recut the fourteen-door frame.
                </figcaption>
              </figure>
            </div>

            <div className="mt-8" data-testid="portal-door-frame">
              <h3 className="font-heading text-xl text-amber-50">Fourteen-door frame</h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-50">
                Kept beside the hall cards. The planet is zero, below first. Relays 1 to 12 stay in their own order. The Fractal Connector is the epilogue. Human Nodes and the Fractal Connector stay two stations. {ZERO_IS_NOT_A_HALL}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {DOOR_FRAME.map((door) => {
                  const className =
                    "flex min-h-12 w-full touch-manipulation items-center gap-3 rounded-xl border border-amber-300/25 bg-[#0b1522] px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";
                  const label = (
                    <>
                      <span className="w-16 shrink-0 font-mono text-xs text-amber-200">{door.mark}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-amber-50">{door.name}</span>
                        <span className="block text-xs text-amber-100/75">
                          {door.role === "substrate"
                            ? "The planet. Boundary-condition reset to explore."
                            : door.role === "epilogue"
                              ? "Epilogue. Not Human Nodes."
                              : door.href === FIRE_HALL_PATH
                                ? "Relay 1. Opens the live Fire hall."
                                : door.href === TREE_HALL_PATH
                                  ? "Relay 2. Opens the live Tree hall."
                                  : "Relay door. Returns you to the floor."}
                        </span>
                      </span>
                    </>
                  );
                  if (door.href) {
                    return (
                      <Link
                        key={door.id}
                        href={door.href}
                        data-testid={`portal-door-${door.id}`}
                        className={className}
                        onClick={() => {
                          if (door.href === FIRE_HALL_PATH) beginFireBedFromGesture();
                        }}
                      >
                        {label}
                      </Link>
                    );
                  }
                  return (
                    <button key={door.id} type="button" data-testid={`portal-door-${door.id}`} className={className} onClick={() => chooseDoor(door.id)}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
