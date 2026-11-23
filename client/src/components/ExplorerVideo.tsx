import { useState, useRef, useCallback, useEffect, useMemo, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { Play, X, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { doorFilmTitle } from "@/lib/doorReel";

/** Required exhibition type. Locked at 20pt so iOS Safari does not inflate it. */
export const EXHIBITION_PLATE_TYPE: CSSProperties = {
  fontSize: "20pt",
  lineHeight: 1.3,
  WebkitTextSizeAdjust: "100%",
  textSizeAdjust: "100%",
};

interface ExplorerVideoProps {
  videoUrl: string;
  title: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
  /** Start the clip in the same tap that opens it. Used on the public gates. */
  ensurePlayback?: boolean;
  /** Exhibition plate: 20pt film label, one tap, inline playback. */
  plate?: boolean;
  /** Already-held films. The door loops this list instead of closing. */
  playlist?: string[];
  testId?: string;
  onOpen?: () => void;
}

// localStorage helper — safe for SSR/private browsing
function getWatchedKey(videoUrl: string) {
  // Use a hash of the URL to avoid key collisions
  const slug = videoUrl.replace(/[^a-zA-Z0-9]/g, "").slice(-32);
  return `tre_video_watched_${slug}`;
}

function isWatched(videoUrl: string): boolean {
  try {
    return localStorage.getItem(getWatchedKey(videoUrl)) === "1";
  } catch {
    return false;
  }
}

function markWatched(videoUrl: string): void {
  try {
    localStorage.setItem(getWatchedKey(videoUrl), "1");
  } catch {
    // localStorage unavailable — fail silently
  }
}

export function ExplorerVideo({ videoUrl, title, subtitle, accentColor, glowColor, ensurePlayback = false, plate = false, playlist, testId, onOpen }: ExplorerVideoProps) {
  const watched = useMemo(() => isWatched(videoUrl), [videoUrl]);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(false);
  const [forcedMute, setForcedMute] = useState(false);
  const reel = useMemo(
    () => (playlist && playlist.length > 0 ? playlist : [videoUrl]),
    [playlist, videoUrl],
  );
  const [index, setIndex] = useState(0);
  const src = reel[index % reel.length] ?? videoUrl;
  const [hasCompleted, setHasCompleted] = useState(watched);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openIntro = useCallback(() => {
    onOpen?.();
    if (!ensurePlayback) {
      setShowVideo(true);
      return;
    }
    flushSync(() => setShowVideo(true));
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      video.muted = true;
      setMuted(true);
      video.play().catch(() => undefined);
    });
  }, [ensurePlayback, onOpen]);

  const hear = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    const pending = video.play();
    if (pending) pending.catch(() => undefined);
  }, []);

  const handleClose = useCallback(() => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (!plate) {
      if (reel.length > 1) setIndex((i) => (i + 1) % reel.length);
      return;
    }
    markWatched(videoUrl);
    setHasCompleted(true);
    handleClose();
  }, [plate, reel.length, videoUrl, handleClose]);

  const hearDoor = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    setForcedMute(false);
    const pending = video.play();
    if (pending) pending.catch(() => undefined);
  }, []);

  useEffect(() => {
    if (plate) return;
    const video = videoRef.current;
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
  }, [plate, src]);

  if (plate) {
    return (
      <div className="mt-3" data-testid={testId}>
        {!showVideo ? (
          <button
            type="button"
            onClick={openIntro}
            className="flex w-full touch-manipulation items-start gap-3 rounded-xl border border-amber-300/70 bg-[#1a120c] px-3 py-3 text-left shadow-[0_0_28px_rgba(252,211,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050912]"
          >
            <span
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-300/15"
              style={{ boxShadow: `0 0 16px ${glowColor}` }}
              aria-hidden
            >
              {hasCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-amber-200" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" style={{ color: accentColor }} />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{title}</span>
              {subtitle ? (
                <span className="mt-1 block text-amber-50" style={EXHIBITION_PLATE_TYPE}>{subtitle}</span>
              ) : null}
              <span className="mt-1 block text-amber-100" style={EXHIBITION_PLATE_TYPE}>
                {hasCompleted ? "Watched. Tap to play again." : "Tap to play."}
              </span>
            </span>
          </button>
        ) : (
          <div className="overflow-hidden rounded-xl border border-amber-300/60 bg-black shadow-[0_0_30px_rgba(252,211,77,0.16)]">
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted={muted}
              playsInline
              controls
              preload="auto"
              aria-label={title}
              className="aspect-video w-full bg-black object-contain"
              onEnded={handleEnded}
            />
            <div className="flex items-start gap-3 bg-[#1a120c] px-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-heading text-amber-50" style={EXHIBITION_PLATE_TYPE}>{title}</p>
                {muted ? (
                  <button
                    type="button"
                    onClick={hear}
                    className="mt-2 inline-flex min-h-12 touch-manipulation items-center text-left text-amber-50 underline decoration-amber-300/70 underline-offset-4"
                    style={EXHIBITION_PLATE_TYPE}
                  >
                    Tap to hear the film
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-amber-300/50 bg-black/50 text-amber-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const filmTitle = doorFilmTitle(src);
  const place = `${index + 1} of ${reel.length}`;

  return (
    <div className="mb-4" data-testid={testId ?? "door-reel"}>
      <div
        className="overflow-hidden rounded-xl border bg-black"
        style={{ borderColor: `${accentColor}55`, boxShadow: `0 0 28px ${glowColor}` }}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop={reel.length < 2}
          muted={muted}
          playsInline
          preload="auto"
          aria-label={filmTitle}
          className="aspect-video w-full bg-black object-contain"
          onEnded={handleEnded}
        />
        <div className="flex items-center gap-3 px-3 py-2.5" style={{ backgroundColor: "#0c1218" }}>
          <div className="min-w-0 flex-1 text-left">
            <p className="font-heading text-sm tracking-wide text-white">{filmTitle}</p>
            <p className="text-xs text-white/60">{title} · {place}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
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
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
        {forcedMute ? (
          <button
            type="button"
            onClick={hearDoor}
            className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 border-t px-3 text-sm font-heading tracking-wide"
            style={{ borderColor: `${accentColor}40`, color: accentColor }}
          >
            <Volume2 className="h-4 w-4" />
            Tap to hear the film
          </button>
        ) : null}
      </div>
      {subtitle ? <p className="sr-only">{subtitle}</p> : null}
    </div>
  );
}
