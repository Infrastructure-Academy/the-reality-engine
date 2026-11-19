import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { StoryChrome } from "@/lib/storyLocale";
import type { StoryPhase } from "@/lib/storyteller";

interface StorytellerControlProps {
  labels: StoryChrome;
  phase: StoryPhase;
  available: boolean;
  onListen: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

/**
 * The header speaker on a relay.
 * One control: Listen, then Pause and Stop. It does not autoplay.
 */
export function StorytellerControl({
  labels,
  phase,
  available,
  onListen,
  onPause,
  onResume,
  onStop,
}: StorytellerControlProps) {
  const listenRef = useRef<HTMLButtonElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);
  const wasActive = useRef(false);

  useEffect(() => {
    // The previous button unmounts when the phase changes, so move focus
    // to the control that is now on screen. Escape then still reaches the group.
    if (phase === "speaking") pauseRef.current?.focus();
    else if (phase === "paused") resumeRef.current?.focus();
    else if (phase === "idle" && wasActive.current) listenRef.current?.focus();
    wasActive.current = phase !== "idle";
  }, [phase]);

  const live = phase === "speaking" ? labels.speaking : phase === "paused" ? labels.paused : wasActive.current ? labels.stopped : "";

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="flex items-center gap-1"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onStop();
        }
      }}
    >
      <span aria-live="polite" className={phase === "idle" ? "sr-only" : "text-[10px] uppercase tracking-wider text-amber-300 animate-pulse"}>
        {phase === "idle" ? live : phase === "speaking" ? labels.speaking : labels.paused}
      </span>
      {phase === "idle" && (
        <button
          ref={listenRef}
          type="button"
          onClick={onListen}
          disabled={!available}
          className="inline-flex items-center gap-1 px-1.5 py-1 rounded text-amber-400 hover:bg-muted/50 disabled:text-amber-400/40 disabled:cursor-not-allowed"
          aria-label={available ? labels.listenTo : labels.unavailable}
          title={available ? labels.listenTo : labels.unavailable}
        >
          {available ? <Volume2 className="w-4 h-4" aria-hidden="true" /> : <VolumeX className="w-4 h-4" aria-hidden="true" />}
          <span className="text-[10px] font-semibold tracking-wide">{labels.listen}</span>
        </button>
      )}
      {phase === "speaking" && (
        <button
          ref={pauseRef}
          type="button"
          onClick={onPause}
          className="inline-flex items-center px-1.5 py-1 rounded text-[10px] font-semibold tracking-wide text-amber-300 hover:bg-muted/50"
          aria-label={labels.pauseStory}
        >
          {labels.pause}
        </button>
      )}
      {phase === "paused" && (
        <button
          ref={resumeRef}
          type="button"
          onClick={onResume}
          className="inline-flex items-center px-1.5 py-1 rounded text-[10px] font-semibold tracking-wide text-amber-300 hover:bg-muted/50"
          aria-label={labels.resumeStory}
        >
          {labels.resume}
        </button>
      )}
      {phase !== "idle" && (
        <button
          type="button"
          onClick={onStop}
          className="inline-flex items-center px-1.5 py-1 rounded text-[10px] font-semibold tracking-wide text-amber-400/80 hover:bg-muted/50"
          aria-label={labels.stopStory}
        >
          {labels.stop}
        </button>
      )}
    </div>
  );
}
