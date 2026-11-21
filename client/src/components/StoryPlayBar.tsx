import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { StoryChrome } from "@/lib/storyLocale";
import { declareStoryPlayback, formatStoryTime } from "@/lib/storyAudio";
import { fireStoryBed } from "@/lib/firePlayback";
import { setStorytellerOwnsSpeech, type StoryPhase } from "@/lib/storyteller";

type BarPhase = "idle" | "starting" | "playing" | "paused";

interface SpeechControls {
  phase: StoryPhase;
  available: boolean;
  listen: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

interface StoryPlayBarProps {
  audioSrc: string | null;
  labels: StoryChrome;
  speech: SpeechControls;
  /** Slim strip under the Fire pit. Other relays keep the full bar. */
  compact?: boolean;
  /**
   * Fire door only. The briefing element is the app-level bed started by the
   * click that opened the hall. This bar must not pause or reload it on mount.
   */
  handoff?: boolean;
  onTime?: (seconds: number) => void;
}

export interface StoryPlayHandle {
  /** Start the recording. Rejects when the browser blocks it. Does not mute. */
  begin: (options?: { quiet?: boolean }) => Promise<void>;
  /** Pause the story while a card voice speaks, and remember to continue afterwards. */
  pauseForCard: () => void;
  resumeIfHeld: () => void;
}

/**
 * Play, Pause, and Stop for one relay story.
 * A recording never shows Playing until the audio element is actually playing.
 * Other relays wait for Play. The Fire door may call begin() when the door opens.
 */
export const StoryPlayBar = forwardRef<StoryPlayHandle, StoryPlayBarProps>(function StoryPlayBar({
  audioSrc, labels, speech, compact = false, handoff = false, onTime,
}, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intent = useRef<"play" | "pause" | "stop">("stop");
  const holdForCard = useRef(false);
  const heldResume = useRef(false);
  const onTimeRef = useRef(onTime);
  onTimeRef.current = onTime;
  const handoffRef = useRef(handoff);
  handoffRef.current = handoff;

  function media(): HTMLAudioElement | null {
    return handoffRef.current ? fireStoryBed() : audioRef.current;
  }
  const stopSpeech = useRef(speech.stop);
  stopSpeech.current = speech.stop;
  const [phase, setPhase] = useState<BarPhase>("idle");
  const [arming, setArming] = useState(false);
  const [notice, setNotice] = useState("");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (handoff) return;
    const audio = audioRef.current;
    intent.current = "stop";
    holdForCard.current = false;
    heldResume.current = false;
    setPhase("idle");
    setArming(false);
    setNotice("");
    setCurrent(0);
    setDuration(0);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audioSrc, handoff]);

  useEffect(() => {
    if (!handoff) return;
    const audio = fireStoryBed();
    if (!audio) return;
    const sync = () => {
      if (!Number.isFinite(audio.duration)) return;
      setDuration(audio.duration);
    };
    const onPlaying = () => {
      if (holdForCard.current) {
        audio.pause();
        intent.current = "pause";
        setPhase("paused");
        return;
      }
      intent.current = "play";
      setCurrent(audio.currentTime);
      setPhase("playing");
      setNotice("");
      sync();
      onTimeRef.current?.(audio.currentTime);
    };
    const onTime = () => {
      setCurrent(audio.currentTime);
      onTimeRef.current?.(audio.currentTime);
      if (!audio.paused) declareStoryPlayback();
    };
    const onPause = () => {
      if (intent.current === "pause") setPhase("paused");
    };
    const onEnded = () => {
      intent.current = "stop";
      setCurrent(0);
      setPhase("idle");
      onTimeRef.current?.(0);
    };
    if (!audio.paused) onPlaying();
    sync();
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("durationchange", sync);
    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("durationchange", sync);
    };
  }, [handoff, audioSrc]);

  useEffect(() => {
    return () => {
      if (!handoffRef.current) audioRef.current?.pause();
      setStorytellerOwnsSpeech(false);
    };
  }, []);

  useEffect(() => {
    const active = audioSrc
      ? phase === "starting" || phase === "playing" || phase === "paused"
      : speech.phase !== "idle" || arming;
    setStorytellerOwnsSpeech(active);
  }, [audioSrc, phase, speech.phase, arming]);

  useEffect(() => {
    if (!audioSrc || phase !== "playing") return;
    const timer = window.setInterval(() => {
      const audio = media();
      if (!audio) return;
      setCurrent(audio.currentTime);
      if (audio.ended) {
        intent.current = "stop";
        setPhase("idle");
        setCurrent(0);
      } else if (audio.paused && intent.current === "play") {
        setPhase("paused");
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [audioSrc, phase]);

  useEffect(() => {
    if (!audioSrc || phase !== "starting") return;
    const timer = window.setTimeout(() => {
      const audio = media();
      if (intent.current !== "play") return;
      if (holdForCard.current) return;
      if (audio && !audio.paused && audio.currentTime > 0.05) {
        setPhase("playing");
        return;
      }
      audio?.pause();
      intent.current = "stop";
      setPhase("idle");
      setNotice(labels.playbackFailed);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [audioSrc, phase, labels.playbackFailed]);

  useEffect(() => {
    if (audioSrc || !arming) return;
    if (speech.phase === "speaking") {
      setArming(false);
      return;
    }
    const timer = window.setTimeout(() => {
      stopSpeech.current();
      setArming(false);
      setNotice(labels.playbackFailed);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [audioSrc, arming, speech.phase, labels.playbackFailed]);

  const shown: BarPhase = audioSrc
    ? phase
    : speech.phase === "speaking"
      ? "playing"
      : speech.phase === "paused" && !arming
        ? "paused"
        : arming
          ? "starting"
          : "idle";

  const status = shown === "playing"
    ? labels.playing
    : shown === "paused"
      ? labels.paused
      : shown === "starting"
        ? labels.starting
        : "";

  function begin(options?: { quiet?: boolean }): Promise<void> {
    if (!audioSrc) {
      if (!speech.available) return Promise.resolve();
      setNotice("");
      setArming(true);
      if (speech.phase === "paused") speech.resume();
      else speech.listen();
      return Promise.resolve();
    }
    const audio = media();
    if (!audio) return Promise.reject(new Error("missing story audio"));
    if (!audio.paused && intent.current === "play" && !holdForCard.current) return Promise.resolve();
    declareStoryPlayback();
    intent.current = "play";
    setNotice("");
    setPhase("starting");
    const pending = audio.play();
    if (!pending) return Promise.resolve();
    return pending.catch((error: unknown) => {
      if (intent.current !== "play") return;
      setPhase("idle");
      if (!options?.quiet) setNotice(labels.playbackFailed);
      throw error;
    });
  }

  function pauseForCard() {
    holdForCard.current = true;
    const audio = media();
    const trying = intent.current === "play";
    const moving = !!audio && !audio.paused;
    heldResume.current = trying || moving;
    if (moving) {
      intent.current = "pause";
      audio.pause();
      setPhase("paused");
    }
  }

  function resumeIfHeld() {
    const shouldResume = heldResume.current;
    holdForCard.current = false;
    heldResume.current = false;
    if (!shouldResume) return;
    void begin();
  }

  useImperativeHandle(ref, () => ({ begin, pauseForCard, resumeIfHeld }), [audioSrc, labels.playbackFailed, speech]);

  function onPlay() {
    holdForCard.current = false;
    heldResume.current = false;
    void begin();
  }

  function onPause() {
    if (!audioSrc) {
      speech.pause();
      setArming(false);
      return;
    }
    intent.current = "pause";
    media()?.pause();
    setPhase("paused");
  }

  function onStop() {
    if (!audioSrc) {
      speech.stop();
      setArming(false);
      setNotice("");
      return;
    }
    intent.current = "stop";
    holdForCard.current = false;
    heldResume.current = false;
    const audio = media();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrent(0);
    setPhase("idle");
    setNotice("");
    onTimeRef.current?.(0);
  }

  const button = compact
    ? "inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-xs font-semibold disabled:cursor-not-allowed"
    : "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-3 text-base font-semibold disabled:cursor-not-allowed";
  const solid = `${button} ${compact ? "border border-amber-200" : "border-2 border-amber-300"} bg-amber-400 text-black`;
  const quiet = `${button} ${compact ? "border border-amber-300/70" : "border-2 border-amber-300"} bg-amber-950 text-amber-50`;

  return (
    <div
      role="group"
      aria-label={labels.group}
      data-testid="story-play-bar"
      data-compact={compact ? "true" : "false"}
      className={compact
        ? "relative mt-1 flex items-center gap-2 rounded-md border border-amber-400/30 bg-[#1a1208]/80 px-1.5 py-1"
        : "relative rounded-xl border border-amber-400/50 bg-[#1a1208] p-3"}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onStop();
        }
      }}
    >
      {!compact && (
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">{labels.story}</span>
          <span
            aria-live="polite"
            data-testid="story-status"
            className="min-h-4 text-xs font-semibold uppercase tracking-wider text-amber-100"
          >
            {status}
          </span>
        </div>
      )}
      <div className={compact ? "flex shrink-0 items-center gap-1" : "grid grid-cols-3 gap-2"}>
        <button
          type="button"
          data-testid="story-play"
          onClick={onPlay}
          disabled={shown === "playing" || shown === "starting" || (!audioSrc && !speech.available)}
          className={shown === "playing" ? quiet : solid}
        >
          {labels.play}
        </button>
        <button
          type="button"
          data-testid="story-pause"
          onClick={onPause}
          disabled={shown !== "playing" && shown !== "starting"}
          className={shown === "playing" ? solid : quiet}
        >
          {labels.pause}
        </button>
        <button
          type="button"
          data-testid="story-stop"
          onClick={onStop}
          disabled={shown === "idle"}
          className={quiet}
        >
          {labels.stop}
        </button>
        {compact && (
          <span
            aria-live="polite"
            data-testid="story-status"
            className="font-mono text-[10px] tabular-nums text-amber-100/90"
          >
            {status ? `${status} ` : ""}{formatStoryTime(current)} / {formatStoryTime(duration)}
          </span>
        )}
      </div>
      {audioSrc && (
        <div className={compact ? "min-w-0 flex-1" : "mt-2"}>
          {!compact && (
            <div className="flex items-center justify-between font-mono text-[11px] text-amber-100/80">
              <span>{formatStoryTime(current)}</span>
              <span>{formatStoryTime(duration)}</span>
            </div>
          )}
          <input
            type="range"
            data-testid="story-scrubber"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            aria-label={labels.position}
            disabled={!duration}
            className={compact
              ? "h-4 w-full accent-amber-400 disabled:opacity-40"
              : "h-11 w-full accent-amber-400 disabled:opacity-40"}
            onChange={(event) => {
              const audio = media();
              const next = Number(event.target.value);
              if (audio) audio.currentTime = next;
              setCurrent(next);
            }}
          />
          {!compact && <p className="text-[11px] leading-snug text-amber-100/75">{labels.recorded}</p>}
        </div>
      )}
      {notice && (
        <p role="alert" className="mt-2 text-sm text-amber-100">
          {notice}
        </p>
      )}
      {audioSrc && !handoff && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onPlaying={() => {
            if (intent.current !== "play" && !holdForCard.current) return;
            const audio = audioRef.current;
            if (holdForCard.current) {
              if (audio && !audio.paused) audio.pause();
              intent.current = "pause";
              setPhase("paused");
              return;
            }
            if (audio) setCurrent(audio.currentTime);
            setPhase("playing");
            setNotice("");
          }}
          onPause={() => {
            if (intent.current === "pause") setPhase("paused");
          }}
          onEnded={() => {
            intent.current = "stop";
            setCurrent(0);
            setPhase("idle");
            onTimeRef.current?.(0);
          }}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (!audio) return;
            setCurrent(audio.currentTime);
            onTimeRef.current?.(audio.currentTime);
            // A discovery chime uses Web Audio and can drop Safari back to the
            // ambient session, which the silent switch mutes. Keep the story in playback.
            if (!audio.paused) declareStoryPlayback();
          }}
          onDurationChange={() => {
            const audio = audioRef.current;
            if (audio && Number.isFinite(audio.duration)) setDuration(audio.duration);
          }}
          onError={() => {
            intent.current = "stop";
            setPhase("idle");
            setNotice(labels.playbackFailed);
          }}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}
    </div>
  );
});
