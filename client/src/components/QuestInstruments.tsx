import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { useT } from "@/contexts/LanguageContext";
import { cuesFromDataUrl, readPhotograph } from "@/lib/imageCues";
import {
  REGIONS,
  RELAYS,
  WEBS,
  awardCapture,
  autofillSuggestion,
  blankCaptureBook,
  capturedCount,
  formatYear,
  latticeNodes,
  noteUnmatchedScan,
  parseEraText,
  scanAsset,
  timeMachineScan,
  type CaptureBook,
  type HistoricalReading,
  type ImageCue,
  type LatticeNode,
  type RegionId,
  type RelayId,
  type ScanReading,
  type WebName,
} from "@shared/questInstruments";
import { RARITY_COLOUR } from "@shared/infradexCatalogue";

const STORAGE_KEY = "quest-infradex-143";
const NODES = latticeNodes();
const ERA_STOPS = [-10000, -8000, -5000, -4000, -3000, -2000, -1000, 800, 1450, 1769, 1825, 1903, 1957, 2026];

const WEB_COLOUR: Record<WebName, string> = {
  Physical: "#e4c27a",
  Biological: "#3ecf8e",
  Social: "#8eb7ff",
  Digital: "#d7a6ff",
  Consciousness: "#f4e7b2",
};

type Studio =
  | { kind: "capture"; view: "form" | "lattice" }
  | { kind: "time"; view: "form" | "lattice" };

function loadBook(): CaptureBook {
  if (typeof window === "undefined") return blankCaptureBook();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankCaptureBook();
    const parsed = JSON.parse(raw) as Partial<CaptureBook>;
    const captured = parsed.captured && typeof parsed.captured === "object" ? parsed.captured : {};
    return {
      xp: typeof parsed.xp === "number" ? parsed.xp : 0,
      scanCount: typeof parsed.scanCount === "number" ? parsed.scanCount : 0,
      captured,
    };
  } catch {
    return blankCaptureBook();
  }
}

function saveBook(book: CaptureBook) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
  } catch {
    /* The reading still stands if the browser refuses the book. */
  }
}

function doorFromPath(path: string): { label: string; relayHint: RelayId | null } {
  if (path.startsWith("/play/igo") || path.startsWith("/exhibition")) return { label: "iGO", relayHint: null };
  if (path.startsWith("/explore/spinner")) return { label: "Relay Spinner", relayHint: null };
  if (path.startsWith("/explore/dungeon")) return { label: "Dungeon Crawl", relayHint: null };
  if (path.startsWith("/explore/greymatter") || path.startsWith("/explore/grey-matter")) return { label: "Grey Matter", relayHint: null };
  if (path.startsWith("/flight-deck")) return { label: "Flight Deck", relayHint: null };
  if (path.startsWith("/create") || path.startsWith("/scholar")) return { label: "Scholar", relayHint: null };
  const relayMatch = path.match(/^\/(?:m\/)?explore\/(\d+)/);
  if (relayMatch) {
    const index = Number(relayMatch[1]) - 1;
    const relay = RELAYS[index];
    if (relay) return { label: `Relay ${relayMatch[1]} · ${relay.name}`, relayHint: relay.id };
  }
  if (path === "/" || path.startsWith("/explore")) return { label: "Explorer", relayHint: null };
  return { label: "Quest", relayHint: null };
}

function Reticle({ tone }: { tone: "gold" | "blue" }) {
  const stroke = tone === "gold" ? "#3a2808" : "#d7f1ff";
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
      <circle cx="24" cy="24" r="16" fill="none" stroke={stroke} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="7" fill="none" stroke={stroke} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="2" fill={stroke} />
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

function PlateShell({
  tone,
  door,
  testId,
  onOpen,
  children,
}: {
  tone: "gold" | "blue";
  door: string;
  testId: string;
  onOpen: () => void;
  children: ReactNode;
}) {
  const gold = tone === "gold";
  return (
    <button
      type="button"
      data-door={door}
      data-testid={testId}
      onClick={onOpen}
      className={`group relative flex min-h-[4.5rem] w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left transition-transform duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 sm:gap-4 sm:px-4 ${
        gold
          ? "border-amber-100/80 text-[#3a2808] shadow-[0_0_28px_rgba(240,193,74,0.35)] focus-visible:ring-amber-200"
          : "border-sky-200/50 text-sky-50 shadow-[0_0_28px_rgba(56,148,214,0.35)] focus-visible:ring-sky-200"
      }`}
      style={{
        background: gold
          ? "linear-gradient(102deg, #ffe7a0 0%, #f0c14b 16%, #b8881e 38%, #2a210c 62%, #d7b15a 100%)"
          : "linear-gradient(102deg, #8fd4ff 0%, #1d6eab 18%, #0c3358 42%, #071422 68%, #163e66 100%)",
      }}
    >
      <span
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${
          gold ? "border-[#6a4e12]/50 bg-[#fff4cc]/35" : "border-sky-100/40 bg-[#041525]/45"
        }`}
      >
        <Reticle tone={tone} />
      </span>
      {children}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-40"
        style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.45), transparent)" }}
        aria-hidden="true"
      />
    </button>
  );
}

export function QuestInstrumentBay({ variant }: { variant: "capture" | "both" }) {
  const t = useT();
  const [path] = useLocation();
  const door = doorFromPath(path);
  const [book, setBook] = useState<CaptureBook>(() => loadBook());
  const [studio, setStudio] = useState<Studio | null>(null);
  const count = capturedCount(book);
  const titleId = useId();

  useEffect(() => {
    if (!studio) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStudio(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [studio]);

  function commit(next: CaptureBook) {
    setBook(next);
    saveBook(next);
  }

  const overlay = studio
    ? createPortal(
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#03060c]/82 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-testid={studio.kind === "capture" ? "asset-capture-studio" : "time-machine-studio"}
            className="flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#070b14] shadow-[0_0_80px_rgba(0,0,0,0.55)] sm:max-h-[92dvh] sm:rounded-2xl"
          >
            {studio.kind === "capture" ? (
              <CaptureStudio
                titleId={titleId}
                doorLabel={door.label}
                relayHint={door.relayHint}
                view={studio.view}
                book={book}
                onBook={commit}
                onView={(view) => setStudio({ kind: "capture", view })}
                onClose={() => setStudio(null)}
              />
            ) : (
              <TimeStudio
                titleId={titleId}
                doorLabel={door.label}
                view={studio.view}
                onView={(view) => setStudio({ kind: "time", view })}
                onClose={() => setStudio(null)}
              />
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3" data-testid="quest-instrument-bay">
      <PlateShell tone="gold" door="asset-capture" testId="asset-capture-plate" onOpen={() => setStudio({ kind: "capture", view: "form" })}>
        <span className="relative min-w-0 flex-1">
          <span className="block font-heading text-[13px] font-bold tracking-[0.22em] uppercase sm:text-sm">{t("igo.assetCapture")}</span>
          <span className="mt-0.5 block font-mono text-[10px] tracking-[0.28em] uppercase opacity-80">{t("igo.infraDexScan")}</span>
        </span>
        <span className="relative font-mono text-sm font-semibold tabular-nums tracking-wide" aria-label={`${count} of 143 InfraDex species captured`}>
          {count}/143
        </span>
      </PlateShell>
      {variant === "both" ? (
        <PlateShell tone="blue" door="time-machine" testId="time-machine-plate" onOpen={() => setStudio({ kind: "time", view: "form" })}>
          <span className="relative min-w-0 flex-1">
            <span className="block font-heading text-[13px] font-bold tracking-[0.22em] uppercase sm:text-sm">{t("igo.timeMachine")}</span>
            <span className="mt-0.5 block font-mono text-[10px] tracking-[0.22em] uppercase text-sky-100/80">{t("igo.historicalPortal")}</span>
          </span>
          <span className="relative rounded-md border border-sky-100/50 bg-sky-100/10 px-2.5 py-1.5 font-heading text-[10px] tracking-[0.18em] uppercase">
            {t("igo.enterEra")}
          </span>
        </PlateShell>
      ) : null}
      {overlay}
    </div>
  );
}

function StudioHeader({
  titleId,
  kicker,
  title,
  onClose,
}: {
  titleId: string;
  kicker: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-amber-200/70">{kicker}</p>
        <h2 id={titleId} className="font-heading text-lg tracking-wide text-amber-50 sm:text-xl">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 text-sm text-amber-50 hover:bg-white/10"
        aria-label="Close"
      >
        Close
      </button>
    </div>
  );
}

function CaptureStudio({
  titleId,
  doorLabel,
  relayHint,
  view,
  book,
  onBook,
  onView,
  onClose,
}: {
  titleId: string;
  doorLabel: string;
  relayHint: RelayId | null;
  view: "form" | "lattice";
  book: CaptureBook;
  onBook: (book: CaptureBook) => void;
  onView: (view: "form" | "lattice") => void;
  onClose: () => void;
}) {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraFileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cues, setCues] = useState<ImageCue | null>(null);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<ScanReading | null>(null);
  const [award, setAward] = useState<string | null>(null);
  const suggestion = useMemo(() => autofillSuggestion(text, relayHint), [text, relayHint]);

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (!live || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    void videoRef.current.play().catch(() => setError("The camera preview did not start. Use a photograph instead."));
  }, [live]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLive(false);
  }

  async function openCamera() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraFileRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      setLive(true);
    } catch {
      setError("The camera did not open. Use a photograph you already have, or type a name.");
      cameraFileRef.current?.click();
    }
  }

  function takePhotograph() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg", 0.86);
    void acceptUrl(url);
    stopCamera();
  }

  async function acceptFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const photo = await readPhotograph(file);
      setPhotoUrl(photo.url);
      setCues(photo.cues);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read that photograph.");
    } finally {
      setBusy(false);
    }
  }

  async function acceptUrl(url: string) {
    setBusy(true);
    setError(null);
    try {
      const next = await cuesFromDataUrl(url);
      setPhotoUrl(url);
      setCues(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read that photograph.");
    } finally {
      setBusy(false);
    }
  }

  function readAsset() {
    if (!text.trim() && !cues) {
      setError("Photograph an asset, choose a photograph, or type a name.");
      return;
    }
    setError(null);
    const next = scanAsset({ text, cues, relayHint });
    setReading(next);
    if (next.species) {
      const result = awardCapture(book, next.species, next.integrationLevel);
      onBook(result.book);
      const fresh = result.award.isNew ? "New species" : "Already in the dex";
      setAward(`${fresh} · +${result.award.xpAwarded.toLocaleString("en-GB")} XP`);
    } else {
      onBook(noteUnmatchedScan(book));
      setAward("Field observation · not one of the 143");
    }
  }

  return (
    <>
      <StudioHeader titleId={titleId} kicker={`${doorLabel} · ${t("igo.infraDexScan")}`} title={t("igo.assetCapture")} onClose={onClose} />
      <div className="overflow-y-auto px-4 py-4 sm:px-5">
        {view === "lattice" && reading ? (
          <Collidoscope
            hotRelay={reading.relay}
            hotWeb={reading.web}
            hotLevel={reading.integrationLevel}
            asleep={[]}
            caption={`${reading.assetName} · ${reading.relayName} · ${reading.web} · level ${reading.integrationLevel}`}
            onBack={() => onView("form")}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-amber-50/80">
              Point at an asset and photograph it, use a photograph you already have, or type a name. Quest reads the InfraDex on this door and returns the ISI plate.
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => void openCamera()} className="min-h-11 rounded-lg border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-left text-sm text-amber-50 hover:bg-amber-200/15">
                <span className="block font-heading text-[11px] tracking-[0.16em] uppercase">Photograph</span>
                <span className="mt-1 block text-xs text-amber-100/70">Open the camera and take the plate.</span>
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="min-h-11 rounded-lg border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-left text-sm text-amber-50 hover:bg-amber-200/15">
                <span className="block font-heading text-[11px] tracking-[0.16em] uppercase">Use a photograph</span>
                <span className="mt-1 block text-xs text-amber-100/70">JPEG, PNG, or WebP, up to 6 MB.</span>
              </button>
              <button type="button" onClick={() => nameRef.current?.focus()} className="min-h-11 rounded-lg border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-left text-sm text-amber-50 hover:bg-amber-200/15">
                <span className="block font-heading text-[11px] tracking-[0.16em] uppercase">Type a name</span>
                <span className="mt-1 block text-xs text-amber-100/70">A bridge, a dam, a station, a grove.</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void acceptFile(event.target.files?.[0])} />
            <input ref={cameraFileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => void acceptFile(event.target.files?.[0])} />
            {live ? (
              <div className="overflow-hidden rounded-xl border border-amber-200/30 bg-black">
                <video ref={videoRef} className="aspect-[4/3] w-full object-cover" playsInline muted data-testid="asset-capture-viewfinder" />
                <div className="flex gap-2 p-3">
                  <button type="button" onClick={takePhotograph} className="min-h-11 flex-1 rounded-lg bg-amber-300 font-heading text-xs tracking-[0.16em] uppercase text-[#2a1c04]">Take photograph</button>
                  <button type="button" onClick={stopCamera} className="min-h-11 rounded-lg border border-white/20 px-4 text-sm text-amber-50">Cancel</button>
                </div>
              </div>
            ) : null}
            {photoUrl ? (
              <figure className="overflow-hidden rounded-xl border border-amber-200/25">
                <img src={photoUrl} alt="Photograph held for this scan" className="max-h-56 w-full object-cover" />
              </figure>
            ) : null}
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] uppercase text-amber-200/70">Name or description</span>
              <input
                ref={nameRef}
                value={text}
                data-testid="asset-capture-name"
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") readAsset(); }}
                placeholder="Suspension bridge, Tang harbour, a school…"
                className="min-h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-amber-50 placeholder:text-white/30 focus:border-amber-200/60 focus:outline-none"
              />
            </label>
            {suggestion ? (
              <p className="text-xs text-amber-200/80" data-testid="asset-capture-suggestion">InfraDex hears {suggestion.name}.</p>
            ) : null}
            {error ? <p className="text-sm text-rose-200" role="alert">{error}</p> : null}
            <button
              type="button"
              data-testid="asset-capture-read"
              disabled={busy}
              onClick={readAsset}
              className="min-h-11 w-full rounded-lg bg-amber-300 font-heading text-xs tracking-[0.18em] uppercase text-[#2a1c04] disabled:opacity-60"
            >
              {busy ? "Reading the photograph…" : "Read this asset"}
            </button>
            {reading ? <ScanPlate reading={reading} award={award} onAnalyse={() => onView("lattice")} /> : null}
          </div>
        )}
      </div>
    </>
  );
}

function ScanPlate({ reading, award, onAnalyse }: { reading: ScanReading; award: string | null; onAnalyse: () => void }) {
  const rarityColour = reading.species ? RARITY_COLOUR[reading.species.rarity] : "#9CA3AF";
  return (
    <article className="space-y-3 rounded-xl border border-amber-200/25 bg-[#100d08] p-4" data-testid="asset-capture-reading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-amber-200/60">{reading.matched ? "InfraDex species" : "Field observation"}</p>
          <h3 className="font-heading text-xl text-amber-50">{reading.assetName}</h3>
        </div>
        {reading.species ? (
          <span className="rounded-full border px-2 py-1 font-mono text-[10px] tracking-wide uppercase" style={{ color: rarityColour, borderColor: rarityColour }}>
            {reading.species.rarity}
          </span>
        ) : null}
      </div>
      <p className="font-mono text-[11px] tracking-wide text-amber-100/75">
        {reading.relay} {reading.relayName} · {reading.web} · level {reading.integrationLevel}
      </p>
      <p className="font-heading text-4xl tabular-nums text-amber-200" aria-label={`Plate index ${reading.plateIndex} out of 300`}>
        {reading.plateIndex}<span className="ml-1 text-lg text-amber-100/50">/300</span>
      </p>
      <dl className="grid grid-cols-4 gap-2 text-center">
        <Figure label="A" value={reading.A.toFixed(1)} />
        <Figure label="P" value={reading.P.toFixed(1)} />
        <Figure label="β" value={reading.beta.toFixed(1)} />
        <Figure label="λ" value={reading.lambdaAvg.toFixed(1)} />
      </dl>
      <p className="font-mono text-[11px] text-amber-100/70">S = (A × P) / β = {reading.signal.toFixed(1)} · {reading.vibrationLabel}</p>
      <p className="text-sm italic leading-relaxed text-amber-50/85">{reading.explanation}</p>
      <p className="font-mono text-[10px] tracking-wide text-amber-200/60">
        Confidence {Math.round(reading.confidence * 100)} / 100{award ? ` · ${award}` : ""}
      </p>
      <button type="button" data-testid="asset-capture-analyse" onClick={onAnalyse} className="min-h-11 w-full rounded-lg border border-amber-200/40 font-heading text-xs tracking-[0.16em] uppercase text-amber-100 hover:bg-amber-200/10">
        Analyse on the Collidoscope
      </button>
    </article>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 px-1 py-2">
      <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45">{label}</dt>
      <dd className="font-mono text-sm text-amber-50">{value}</dd>
    </div>
  );
}

function TimeStudio({
  titleId,
  doorLabel,
  view,
  onView,
  onClose,
}: {
  titleId: string;
  doorLabel: string;
  view: "form" | "lattice";
  onView: (view: "form" | "lattice") => void;
  onClose: () => void;
}) {
  const t = useT();
  const [regionId, setRegionId] = useState<RegionId>("europe");
  const [year, setYear] = useState(800);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<HistoricalReading | null>(null);

  function enterEra() {
    const parsed = typed.trim() ? parseEraText(typed) : null;
    const result = timeMachineScan({
      regionId: parsed?.region ?? regionId,
      year: parsed?.year ?? year,
      civilisationEra: typed,
    });
    if ("error" in result) {
      setError(result.error);
      setReading(null);
      return;
    }
    setError(null);
    setRegionId(result.regionId);
    setYear(result.year);
    setReading(result);
  }

  return (
    <>
      <StudioHeader titleId={titleId} kicker={`${doorLabel} · ${t("igo.historicalPortal")}`} title={t("igo.timeMachine")} onClose={onClose} />
      <div className="overflow-y-auto px-4 py-4 sm:px-5">
        {view === "lattice" && reading ? (
          <Collidoscope
            hotRelay={reading.dominantRelay}
            hotWeb={reading.dominantWeb}
            hotLevel={reading.integrationLevel}
            asleep={reading.darkRelays}
            caption={`${reading.civilisation} · ${reading.yearLabel} · relays still dark are dimmed`}
            onBack={() => onView("form")}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-sky-50/80">
              Choose a region and an era. The portal names the civilisation, counts the relays that were awake, and returns the historical ISI reading beside the present one.
            </p>
            <RegionPlate regionId={regionId} onChoose={setRegionId} />
            <div>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-sky-200/70">Era</p>
                <p className="font-heading text-lg text-sky-50" data-testid="time-machine-year">{formatYear(year)}</p>
              </div>
              <input
                type="range"
                min={-10000}
                max={2050}
                step={1}
                value={year}
                aria-label="Era"
                data-testid="time-machine-era"
                onChange={(event) => setYear(Number(event.target.value))}
                className="w-full accent-sky-300"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ERA_STOPS.map((stop) => (
                  <button
                    key={stop}
                    type="button"
                    onClick={() => setYear(stop)}
                    className={`min-h-9 rounded-full border px-2.5 text-[10px] tracking-wide ${year === stop ? "border-sky-200 bg-sky-200/20 text-sky-50" : "border-white/10 text-sky-100/70"}`}
                  >
                    {formatYear(stop)}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] uppercase text-sky-200/70">Or name the civilisation and era</span>
              <input
                value={typed}
                data-testid="time-machine-name"
                onChange={(event) => setTyped(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") enterEra(); }}
                placeholder="Tang Dynasty, 800 CE"
                className="min-h-11 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-sky-50 placeholder:text-white/30 focus:border-sky-200/60 focus:outline-none"
              />
            </label>
            {error ? <p className="text-sm text-rose-200" role="alert">{error}</p> : null}
            <button type="button" data-testid="time-machine-enter" onClick={enterEra} className="min-h-11 w-full rounded-lg bg-sky-300 font-heading text-xs tracking-[0.18em] uppercase text-[#062033]">
              {t("igo.enterEra")}
            </button>
            {reading ? <EraPlate reading={reading} onAnalyse={() => onView("lattice")} /> : null}
          </div>
        )}
      </div>
    </>
  );
}

function RegionPlate({ regionId, onChoose }: { regionId: RegionId; onChoose: (id: RegionId) => void }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-sky-200/20 bg-[#071422]" data-testid="time-machine-map">
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="portal-sea" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1a4e78" />
            <stop offset="100%" stopColor="#07111c" />
          </radialGradient>
        </defs>
        <rect width="100" height="70" fill="url(#portal-sea)" />
        <ellipse cx="50" cy="36" rx="42" ry="24" fill="none" stroke="rgba(186,230,253,0.25)" />
        <ellipse cx="50" cy="36" rx="28" ry="16" fill="none" stroke="rgba(186,230,253,0.16)" />
        <path d="M8 36h84M50 8v56" stroke="rgba(186,230,253,0.12)" />
      </svg>
      {REGIONS.map((region) => {
        const selected = region.id === regionId;
        return (
          <button
            key={region.id}
            type="button"
            onClick={() => onChoose(region.id)}
            aria-pressed={selected}
            title={region.label}
            className={`absolute min-h-11 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 text-[10px] tracking-wide ${
              selected ? "border-sky-100 bg-sky-100 text-[#062033]" : "border-sky-200/40 bg-[#041018]/80 text-sky-50"
            }`}
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
          >
            {region.plate}
          </button>
        );
      })}
    </div>
  );
}

function EraPlate({ reading, onAnalyse }: { reading: HistoricalReading; onAnalyse: () => void }) {
  const bars = [
    ["Conflict", reading.resistances.conflict],
    ["Climate", reading.resistances.climate],
    ["Contagion", reading.resistances.contagion],
    ["Cost", reading.resistances.cost],
  ] as const;
  return (
    <article className="space-y-3 rounded-xl border border-sky-200/25 bg-[#07111c] p-4" data-testid="time-machine-reading">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-sky-200/60">Civilisation profile</p>
      <h3 className="font-heading text-xl text-sky-50">{reading.civilisation}</h3>
      <p className="text-sm text-sky-100/80">{reading.regionLabel} · {reading.yearLabel}</p>
      <p className="font-mono text-[11px] text-sky-100/70">
        Leading relay {reading.dominantRelayName} · {reading.dominantWeb} web · {reading.activeRelays.length} relays awake
      </p>
      <p className="font-heading text-4xl tabular-nums text-sky-200" aria-label={`Historical plate index ${reading.plateIndex} out of 300`}>
        {reading.plateIndex}<span className="ml-1 text-lg text-sky-100/50">/300</span>
      </p>
      <p className="font-mono text-[11px] text-sky-100/70">
        Present, {reading.present.yearLabel}: {reading.present.plateIndex}/300 · {reading.present.civilisation}
      </p>
      <div className="flex flex-wrap gap-1" aria-label="Relay cone">
        {RELAYS.map((relay) => {
          const awake = reading.activeRelays.includes(relay.id);
          const leading = relay.id === reading.dominantRelay;
          return (
            <span
              key={relay.id}
              className={`rounded-full border px-2 py-1 font-mono text-[10px] ${
                leading ? "border-sky-100 bg-sky-100 text-[#062033]" : awake ? "border-sky-200/40 text-sky-100" : "border-white/10 text-white/30"
              }`}
            >
              {relay.name}
            </span>
          );
        })}
      </div>
      <div className="space-y-1.5">
        {bars.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2 text-[11px] text-sky-100/80">
            <span>{label}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ width: `${value * 10}%` }} />
            </span>
            <span className="text-right font-mono">{value.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <p className="text-sm italic leading-relaxed text-sky-50/85">{reading.explanation}</p>
      <button type="button" data-testid="time-machine-analyse" onClick={onAnalyse} className="min-h-11 w-full rounded-lg border border-sky-200/40 font-heading text-xs tracking-[0.16em] uppercase text-sky-100 hover:bg-sky-200/10">
        Analyse this era on the Collidoscope
      </button>
    </article>
  );
}

function Collidoscope({
  hotRelay,
  hotWeb,
  hotLevel,
  asleep,
  caption,
  onBack,
}: {
  hotRelay: RelayId;
  hotWeb: WebName;
  hotLevel: number;
  asleep: readonly RelayId[];
  caption: string;
  onBack: () => void;
}) {
  const [picked, setPicked] = useState<LatticeNode | null>(null);
  const hot = useMemo(
    () => NODES.find((node) => node.relay === hotRelay && node.web === hotWeb && node.level === hotLevel) ?? null,
    [hotRelay, hotWeb, hotLevel],
  );
  const focus = picked ?? hot;
  const asleepSet = useMemo(() => new Set(asleep), [asleep]);

  return (
    <div data-testid="collidoscope" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-amber-200/70">300-node lattice</p>
          <h3 className="font-heading text-lg text-amber-50">Collidoscope</h3>
          <p className="text-xs text-amber-100/70">5 webs × 12 relays × 5 integration levels</p>
        </div>
        <button type="button" onClick={onBack} className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-amber-50">Back to the reading</button>
      </div>
      <p className="text-sm text-amber-50/80">{caption}</p>
      <svg viewBox="0 0 640 460" className="w-full rounded-xl border border-amber-200/15 bg-[#05070d]" role="img" aria-label="Collidoscope, three hundred nodes">
        <circle cx="320" cy="230" r="188" fill="none" stroke="rgba(228,194,122,0.12)" />
        {WEBS.map((web, index) => (
          <circle key={web} cx="320" cy="230" r={78 + index * 28} fill="none" stroke={WEB_COLOUR[web]} strokeOpacity="0.18" />
        ))}
        {NODES.map((node) => {
          const point = pointFor(node);
          const dark = asleepSet.has(node.relay);
          const isHot = node.id === hot?.id;
          const kin = node.relay === hotRelay || node.web === hotWeb;
          return (
            <circle
              key={node.id}
              cx={point.x}
              cy={point.y}
              r={isHot ? 5.5 : 2.5}
              fill={dark ? "#241c10" : WEB_COLOUR[node.web]}
              opacity={dark ? 0.35 : isHot ? 1 : kin ? 0.85 : 0.45}
              stroke={isHot ? "#fff6d8" : "transparent"}
              strokeWidth={isHot ? 1.5 : 0}
              className="cursor-pointer"
              onClick={() => setPicked(node)}
            >
              <title>{`${node.relayName} · ${node.web} · level ${node.level}`}</title>
            </circle>
          );
        })}
        {RELAYS.map((relay, index) => {
          const angle = (index / RELAYS.length) * Math.PI * 2;
          const x = 320 + Math.sin(angle) * 214;
          const y = 230 - Math.cos(angle) * 214;
          return (
            <text key={relay.id} x={x} y={y} textAnchor="middle" fill="rgba(253,230,138,0.75)" fontSize="9" fontFamily="ui-sans-serif, system-ui">
              {relay.name}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2">
        {WEBS.map((web) => (
          <span key={web} className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-amber-50/80">
            <span className="h-2 w-2 rounded-full" style={{ background: WEB_COLOUR[web] }} />
            {web}
          </span>
        ))}
      </div>
      {focus ? (
        <p className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-amber-50" data-testid="collidoscope-focus">
          {focus.relayName} · {focus.web} · integration level {focus.level}
          {asleepSet.has(focus.relay) ? " · this relay is still dark in the chosen era" : ""}
          {focus.id === hot?.id ? " · the reading sits on this node" : ""}
        </p>
      ) : null}
    </div>
  );
}

function pointFor(node: LatticeNode): { x: number; y: number } {
  const radius = 36 + (node.radius - 18) * 2.15;
  return {
    x: 320 + Math.sin(node.angle) * radius,
    y: 230 - Math.cos(node.angle) * radius,
  };
}
