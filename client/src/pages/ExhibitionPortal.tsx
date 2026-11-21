import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  APPROACH_LINES,
  CUT_LINE,
  DOOR_FRAME,
  FILM_LABEL,
  FILM_SRC,
  FIRE_HALL_PATH,
  HALL_CARDS,
  PLATE_SRC,
  EPISODE_ONE,
  LATER_EPISODES,
  RECEIVED_ZERO,
  SOUND_NOTE,
  SPIRAL_HELD,
  ZERO_IS_NOT_A_HALL,
  spiralSlot,
  turnFromDoor,
  turnFromHall,
  type HallCard,
  type ReturnTurn,
} from "@shared/exhibitionPortal";

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

function toneFor(phase: number): Tone {
  if (phase >= 2) return "settled";
  if (phase === 1) return "smoulder";
  return "approach";
}

function formatFilmTime(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function spiralPath(): string {
  const points = HALL_CARDS.map((_, index) => spiralSlot(index));
  return [`M 50 100`, ...points.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)].join(" ");
}

function PlanetZero({ tone, onReset, showCaption = true }: { tone: Tone; onReset: () => void; showCaption?: boolean }) {
  const face =
    tone === "settled"
      ? "bg-[radial-gradient(circle_at_32%_30%,#e7f7ff_0%,#7ec8e3_18%,#3e8f6a_46%,#1a4d38_72%,#07140f_100%)]"
      : tone === "smoulder"
        ? "bg-[radial-gradient(circle_at_32%_30%,#ffe0b5_0%,#f97316_34%,#7c2d12_68%,#1c0a06_100%)]"
        : "bg-[radial-gradient(circle_at_32%_30%,#dbeafe_0%,#1e3a5f_42%,#0b1220_78%)]";

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        data-testid="portal-zero"
        onClick={onReset}
        aria-label="0. The planet. Boundary-condition reset to explore. Not a hall."
        className="relative h-32 w-32 touch-manipulation rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912]"
      >
        <span className={`absolute inset-0 rounded-full shadow-[0_0_40px_rgba(232,168,74,0.35)] ${face}`} />
        {tone === "smoulder" ? (
          <span className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle_at_64%_68%,transparent_30%,rgba(255,120,40,0.62)_54%,transparent_72%)]" />
        ) : null}
        <span className="absolute inset-[10%] rounded-full border border-amber-100/30" />
        <span className="relative font-heading text-4xl text-amber-50">0</span>
      </button>
      {showCaption ? (
        <p className="mt-2 max-w-[16rem] text-center text-sm text-amber-50">The planet below. Substrate, not a hall.</p>
      ) : null}
    </div>
  );
}

function OpeningScene({
  phase,
  risen,
  reduced,
  onReset,
  onPlay,
}: {
  phase: number;
  risen: number;
  reduced: boolean;
  onReset: () => void;
  onPlay: () => void;
}) {
  const tone = toneFor(phase);
  const draw = reduced || phase >= 3 ? 0 : 1;

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

      <div className="relative mt-4 h-[20rem] overflow-hidden rounded-2xl border border-amber-300/40 bg-[#050912] sm:h-[32rem]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 72% 26%, rgba(255,255,255,0.7), transparent), radial-gradient(1.5px 1.5px at 40% 12%, rgba(255,236,200,0.9), transparent), radial-gradient(1px 1px at 84% 48%, rgba(255,255,255,0.55), transparent), radial-gradient(1px 1px at 22% 62%, rgba(255,255,255,0.45), transparent)",
          }}
        />

        <div
          className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 ${reduced ? "" : "transition-opacity duration-700"} ${phase === 0 ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        >
          <div className="relative h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-amber-100 shadow-[0_0_36px_rgba(253,224,171,0.95)]" />
            {[80, 128, 176].map((size) => (
              <div
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/30"
                style={{ width: size, height: size * 0.38 }}
              />
            ))}
          </div>
        </div>

        <svg viewBox="0 0 100 100" className="absolute inset-x-0 top-0 h-[calc(100%-8.5rem)] w-full" aria-hidden="true">
          <path
            d={spiralPath()}
            fill="none"
            stroke="rgba(232,196,122,0.9)"
            strokeWidth="0.7"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
            style={{ transition: reduced ? "none" : "stroke-dashoffset 6.4s linear" }}
          />
          <text x="4" y="8" fill="rgba(253,230,186,0.9)" fontSize="3.4">
            0–13
          </text>
          {HALL_CARDS.map((hall, index) => {
            const slot = spiralSlot(index);
            const visible = reduced || index < risen;
            return (
              <g key={hall.id} opacity={visible ? 1 : 0.12} style={{ transition: reduced ? "none" : "opacity 0.45s ease" }}>
                <circle cx={slot.x} cy={slot.y} r="2.6" fill="#140c04" stroke="#f0d59a" strokeWidth="0.35" />
                <text x={slot.x} y={slot.y + 0.9} textAnchor="middle" fontSize="2.3" fill="#f8e7c1">
                  {hall.number}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <PlanetZero tone={tone} onReset={onReset} showCaption={false} />
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-amber-50">The planet below. Substrate, not a hall.</p>

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
          {hall.href ? "Open the live hall and its harnessed discoveries." : "Entrance. This returns you to the floor."}
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
      <Link href={hall.href} data-testid={`portal-hall-${hall.id}`} className={className}>
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
    if (stage !== "opening") return;
    if (reduced) {
      setPhase(3);
      setRisen(HALL_CARDS.length);
      return;
    }
    setPhase(0);
    setRisen(0);
    const timers = [
      window.setTimeout(() => setPhase(1), 3800),
      window.setTimeout(() => setPhase(2), 7600),
      window.setTimeout(() => setPhase(3), 11200),
      ...HALL_CARDS.map((_, index) => window.setTimeout(() => setRisen(index + 1), 11200 + (index + 1) * 420)),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage, reduced, run]);

  useEffect(() => {
    const id = stage === "opening" ? "portal-opening-title" : stage === "film" ? "portal-film-title" : "portal-halls-title";
    document.getElementById(id)?.focus();
  }, [stage, run]);

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
        <p className="text-[11px] uppercase tracking-[0.18em] text-amber-100/80">First cut</p>
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
            <OpeningScene
              phase={reduced ? 3 : phase}
              risen={reduced ? HALL_CARDS.length : risen}
              reduced={reduced}
              onReset={resetToZero}
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
              Fire is first and opens the live hall. The other entrances return you to the floor. Nothing is taken away. {ZERO_IS_NOT_A_HALL}
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
                            ? "Substrate. Boundary-condition reset. Not a hall."
                            : door.role === "epilogue"
                              ? "Epilogue. Not Human Nodes."
                              : door.href
                                ? "Relay 1. Opens the live Fire hall."
                                : "Relay door. Returns you to the floor."}
                        </span>
                      </span>
                    </>
                  );
                  if (door.href) {
                    return (
                      <Link key={door.id} href={door.href} data-testid={`portal-door-${door.id}`} className={className}>
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
