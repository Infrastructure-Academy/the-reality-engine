import { useEffect, useRef, useState } from "react";
import type { StoryChrome } from "@/lib/storyLocale";
import { declareStoryPlayback, formatStoryTime } from "@/lib/storyAudio";
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
}

/**
 * Play, Pause, and Stop for one relay story.
 * A recording never shows Playing until the audio element is actually playing.
 * Nothing starts until Play is pressed.
 */
export function StoryPlayBar({ audioSrc, labels, speech }: StoryPlayBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intent = useRef<"play" | "pause" | "stop">("stop");
  const stopSpeech = useRef(speech.stop);
  stopSpeech.current = speech.stop;
  const [phase, setPhase] = useState<BarPhase>("idle");
  const [arming, setArming] = useState(false);
  const [notice, setNotice] = useState("");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    intent.current = "stop";
    setPhase("idle");
    setArming(false);
    setNotice("");
    setCurrent(0);
    setDuration(0);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audioSrc]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
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
      const audio = audioRef.current;
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
      const audio = audioRef.current;
      if (intent.current !== "play") return;
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

  function onPlay() {
    if (audioSrc) {
      const audio = audioRef.current;
      if (!audio) return;
      declareStoryPlayback();
      intent.current = "play";
      setNotice("");
      setPhase("starting");
      const pending = audio.play();
      pending?.catch(() => {
        if (intent.current !== "play") return;
        setPhase("idle");
        setNotice(labels.playbackFailed);
      });
      return;
    }
    if (!speech.available) return;
    setNotice("");
    setArming(true);
    if (speech.phase === "paused") speech.resume();
    else speech.listen();
  }

  function onPause() {
    if (!audioSrc) {
      speech.pause();
      setArming(false);
      return;
    }
    intent.current = "pause";
    audioRef.current?.pause();
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
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrent(0);
    setPhase("idle");
    setNotice("");
  }

  const button = "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-3 text-base font-semibold disabled:cursor-not-allowed";
  const solid = `${button} bg-amber-400 text-black`;
  const quiet = `${button} border-2 border-amber-300 bg-amber-950 text-amber-50`;

  return (
    <div
      role="group"
      aria-label={labels.group}
      data-testid="story-play-bar"
      className="relative rounded-xl border border-amber-400/50 bg-[#1a1208] p-3"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onStop();
        }
      }}
    >
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
      <div className="grid grid-cols-3 gap-2">
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
      </div>
      {audioSrc && (
        <div className="mt-2">
          <div className="flex items-center justify-between font-mono text-[11px] text-amber-100/80">
            <span>{formatStoryTime(current)}</span>
            <span>{formatStoryTime(duration)}</span>
          </div>
          <input
            type="range"
            data-testid="story-scrubber"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            aria-label={labels.position}
            disabled={!duration}
            className="h-11 w-full accent-amber-400 disabled:opacity-40"
            onChange={(event) => {
              const audio = audioRef.current;
              const next = Number(event.target.value);
              if (audio) audio.currentTime = next;
              setCurrent(next);
            }}
          />
          <p className="text-[11px] leading-snug text-amber-100/75">{labels.recorded}</p>
        </div>
      )}
      {notice && (
        <p role="alert" className="mt-2 text-sm text-amber-100">
          {notice}
        </p>
      )}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onPlaying={() => {
            if (intent.current !== "play") return;
            const audio = audioRef.current;
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
          }}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (!audio) return;
            setCurrent(audio.currentTime);
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
}
