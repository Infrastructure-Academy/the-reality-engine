import { useState, useRef, useCallback, useMemo, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

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

export function ExplorerVideo({ videoUrl, title, subtitle, accentColor, glowColor, ensurePlayback = false, plate = false, testId, onOpen }: ExplorerVideoProps) {
  const watched = useMemo(() => isWatched(videoUrl), [videoUrl]);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(false);
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
    markWatched(videoUrl);
    setHasCompleted(true);
    handleClose();
  }, [videoUrl, handleClose]);

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

  return (
    <>
      {/* Compact button — shows "Watched" indicator after first complete view */}
      {!showVideo && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={openIntro}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-all group mb-4"
          style={{ borderColor: `${accentColor}30` }}
        >
          {hasCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-heading tracking-wider uppercase text-emerald-400">
                Watched
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">— tap to rewatch</span>
            </>
          ) : (
            <>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                style={{ backgroundColor: `${accentColor}20`, boxShadow: `0 0 12px ${glowColor}` }}
              >
                <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: accentColor }} />
              </div>
              <span className="text-xs font-heading tracking-wider uppercase" style={{ color: accentColor }}>
                Watch Intro
              </span>
              <span className="text-[10px] text-muted-foreground">({subtitle})</span>
            </>
          )}
        </motion.button>
      )}

      {/* Expanded video player */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div
              className="relative rounded-xl border overflow-hidden"
              style={{ borderColor: `${accentColor}40`, boxShadow: `0 0 30px ${glowColor}` }}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted={muted}
                playsInline
                className="w-full aspect-video object-cover"
                onEnded={handleEnded}
              />

              {/* Controls overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => setMuted(!muted)}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  {muted ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/80" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-white/80" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>

              {/* Title overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs font-heading tracking-wider uppercase text-white/90">{title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
