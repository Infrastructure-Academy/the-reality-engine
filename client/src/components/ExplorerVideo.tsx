import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Volume2, VolumeX, CheckCircle2 } from "lucide-react";

interface ExplorerVideoProps {
  videoUrl: string;
  title: string;
  subtitle: string;
  accentColor: string;
  glowColor: string;
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

export function ExplorerVideo({ videoUrl, title, subtitle, accentColor, glowColor }: ExplorerVideoProps) {
  const watched = useMemo(() => isWatched(videoUrl), [videoUrl]);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(watched);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <>
      {/* Compact button — shows "Watched" indicator after first complete view */}
      {!showVideo && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowVideo(true)}
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
