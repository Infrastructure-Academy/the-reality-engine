import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import type { StoryChrome } from "@/lib/storyLocale";
import {
  preferPlaybackSession,
  RecordedStoryPlayer,
  seekStory,
} from "@/lib/recordedStory";
import type { StoryPhase } from "@/lib/storyteller";

interface StorytellerControlProps {
  labels: StoryChrome;
  phase: StoryPhase;
  available: boolean;
  recordingSrc: string | null;
  onListen: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

/**
 * Play, Pause, and Stop for one relay story.
 * Nothing plays until Play. A recording reports Speaking only after the file is actually playing.
 */
export function StorytellerControl({
  labels,
  phase,
  available,
  recordingSrc,
  onListen,
  onPause,
  onResume,
  onStop,
}: StorytellerControlProps) {
  const usingFile = Boolean(recordingSrc);
  const canPlay = usingFile || available;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<RecordedStoryPlayer | null>(null);
  const [mediaPhase, setMediaPhase] = useState<StoryPhase>("idle");
  const [blocked, setBlocked] = useState(false);
  const [arming, setArming] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!recordingSrc || typeof Audio === "undefined") return;
    let cancelled = false;
    const audio = new Audio(recordingSrc);
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    // Keep the element in the document without display:none. iOS will not play a hidden audio element.
    audio.style.position = "absolute";
    audio.style.width = "1px";
    audio.style.height = "1px";
    audio.style.opacity = "0";
    audio.style.pointerEvents = "none";
    audio.dataset.testid = "storyteller-audio";
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);
    audioRef.current = audio;
    const player = new RecordedStoryPlayer(
      audio,
      (next) => {
        if (!cancelled) setMediaPhase(next);
      },
      (next) => {
        if (!cancelled) setBlocked(next);
      },
    );
    playerRef.current = player;
    const onPlaying = () => player.markPlaying();
    const onEnded = () => player.markEnded();
    const onTime = () => {
      if (!cancelled) setCurrentTime(audio.currentTime || 0);
    };
    const onMeta = () => {
      if (!cancelled) setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const onPauseEvent = () => {
      if (cancelled || audio.ended) return;
      if (player.phase === "speaking") player.pause();
    };
    const onError = () => player.markError();
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("pause", onPauseEvent);
    audio.addEventListener("error", onError);
    return () => {
      cancelled = true;
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("pause", onPauseEvent);
      audio.removeEventListener("error", onError);
      player.dispose();
      audio.remove();
      audioRef.current = null;
      playerRef.current = null;
      setMediaPhase("idle");
      setCurrentTime(0);
      setDuration(0);
      setBlocked(false);
      setArming(false);
    };
  }, [recordingSrc]);

  useEffect(() => {
    if (!usingFile) return;
    if (mediaPhase === "speaking" || mediaPhase === "paused") setArming(false);
  }, [usingFile, mediaPhase]);

  useEffect(() => {
    if (blocked) setArming(false);
  }, [blocked]);

  const shownPhase = usingFile ? mediaPhase : phase;
  const status = !canPlay
    ? labels.unavailable
    : usingFile && blocked
      ? labels.couldNotStart
      : shownPhase === "speaking"
        ? labels.speaking
        : shownPhase === "paused"
          ? labels.paused
          : usingFile && arming
            ? labels.starting
            : labels.ready;

  function onPlayClick() {
    if (usingFile) {
      preferPlaybackSession();
      const player = playerRef.current;
      if (!player) {
        setBlocked(true);
        return;
      }
      player.play();
      setBlocked(false);
      setArming(true);
      return;
    }
    if (phase === "paused") onResume();
    else onListen();
  }

  function onPauseClick() {
    if (usingFile) {
      playerRef.current?.pause();
      return;
    }
    onPause();
  }

  function onStopClick() {
    if (usingFile) {
      setArming(false);
      playerRef.current?.stop();
      setCurrentTime(0);
      return;
    }
    onStop();
  }

  function onScrub(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    seekStory(audio, seconds);
    setCurrentTime(audio.currentTime || 0);
  }

  const buttonClass =
    "inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

  return (
    <div
      role="group"
      aria-label={labels.group}
      data-testid="storyteller-player"
      className="rounded-xl border border-amber-400/35 bg-card/70 p-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onStopClick();
        }
      }}
    >
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-gold">{labels.story}</h3>
        <p aria-live="polite" data-testid="storyteller-status" className="text-xs font-semibold text-amber-200">
          {status}
        </p>
      </div>
      <p className="mb-3 text-sm leading-snug text-muted-foreground">{labels.listenTo}</p>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          data-testid="storyteller-play"
          onClick={onPlayClick}
          disabled={!canPlay || shownPhase === "speaking" || (usingFile && arming)}
          className={`${buttonClass} bg-amber-400 text-black hover:bg-amber-300 disabled:bg-amber-400/25 disabled:text-black/40`}
          aria-label={canPlay ? labels.listenTo : labels.unavailable}
        >
          <Play className="h-5 w-5 shrink-0" aria-hidden="true" />
          {labels.listen}
        </button>
        <button
          type="button"
          data-testid="storyteller-pause"
          onClick={onPauseClick}
          disabled={shownPhase !== "speaking"}
          className={`${buttonClass} border border-amber-300/60 text-amber-100 hover:bg-amber-400/10 disabled:border-amber-300/20 disabled:text-amber-100/30`}
          aria-label={labels.pauseStory}
        >
          <Pause className="h-5 w-5 shrink-0" aria-hidden="true" />
          {labels.pause}
        </button>
        <button
          type="button"
          data-testid="storyteller-stop"
          onClick={onStopClick}
          disabled={shownPhase === "idle" && currentTime === 0}
          className={`${buttonClass} border border-amber-300/60 text-amber-100 hover:bg-amber-400/10 disabled:border-amber-300/20 disabled:text-amber-100/30`}
          aria-label={labels.stopStory}
        >
          <Square className="h-5 w-5 shrink-0" aria-hidden="true" />
          {labels.stop}
        </button>
      </div>
      {usingFile && duration > 0 && (
        <div className="mt-2">
          <div className="flex justify-between font-mono text-xs tabular-nums text-amber-100/80">
            <span>{formatClock(currentTime)}</span>
            <span>{formatClock(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={Math.min(currentTime, duration)}
            aria-label={labels.position}
            data-testid="storyteller-scrubber"
            onChange={(event) => onScrub(Number(event.target.value))}
            className="block min-h-11 w-full cursor-pointer accent-amber-400"
          />
        </div>
      )}
      {usingFile && blocked && (
        <p className="mt-2 text-sm text-amber-100" data-testid="storyteller-blocked">
          {labels.couldNotStartHelp}
        </p>
      )}
    </div>
  );
}
