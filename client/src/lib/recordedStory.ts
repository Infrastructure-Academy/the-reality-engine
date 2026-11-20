/**
 * Recorded storyteller for relays that ship an audio file.
 * English Fire uses a file so iPhone Safari can play real sound from the tap.
 * Playback starts only from play(). Speaking is reported only after the file is playing.
 */

import type { StoryLocale } from "@/lib/storyLocale";
import { setStorytellerOwnsSpeech, type StoryPhase } from "@/lib/storyteller";

export const FIRE_STORY_RECORDING = "/audio/relay-1-fire-en.mp3";

/** English Fire has a recording. Other relays and Chinese Fire stay on browser speech. */
export function recordedStorySrc(relayNumber: number, locale: StoryLocale): string | null {
  if (relayNumber === 1 && locale === "en") return FIRE_STORY_RECORDING;
  return null;
}

export interface StoryMedia {
  play: () => Promise<void> | void;
  pause: () => void;
  currentTime: number;
  duration: number;
}

/**
 * Ask Safari to treat this tap as media playback.
 * An audio element already ignores the ring/silent switch. This keeps a
 * Web Audio session, if one is open, from leaving the page on the ambient category.
 */
export function preferPlaybackSession() {
  if (typeof navigator === "undefined") return;
  const session = (navigator as Navigator & { audioSession?: { type?: string } }).audioSession;
  if (!session || session.type === "play-and-record") return;
  try {
    session.type = "playback";
  } catch {
    /* Older browsers have no audio session. */
  }
}

export function seekStory(media: Pick<StoryMedia, "currentTime" | "duration">, seconds: number) {
  if (!Number.isFinite(media.duration) || media.duration <= 0) return;
  if (!Number.isFinite(seconds)) return;
  const next = Math.min(Math.max(0, seconds), media.duration);
  media.currentTime = next;
}

const START_TIMEOUT_MS = 12000;

/**
 * HTML media session. play() must be called inside the tap.
 * The phase stays idle until markPlaying(), so a rejected play() cannot show Speaking.
 */
export class RecordedStoryPlayer {
  phase: StoryPhase = "idle";
  private intent: StoryPhase = "idle";
  private failed = false;
  private startTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly media: StoryMedia,
    private readonly onPhase: (phase: StoryPhase) => void,
    private readonly onBlocked: (blocked: boolean) => void,
  ) {}

  play() {
    this.failed = false;
    this.intent = "speaking";
    this.armStartTimer();
    let pending: Promise<void> | void;
    try {
      // play() has to run inside the tap, before any await.
      pending = this.media.play();
    } catch {
      this.fail();
      return;
    }
    this.onBlocked(false);
    if (pending && typeof pending.then === "function") {
      void pending.then(
        () => this.markPlaying(),
        () => this.fail(),
      );
    }
  }

  /** The media element fired playing, or play() resolved. */
  markPlaying() {
    this.clearStartTimer();
    if (this.failed || this.intent !== "speaking") return;
    this.setPhase("speaking");
  }

  pause() {
    if (this.intent !== "speaking") return;
    this.intent = "paused";
    this.clearStartTimer();
    this.setPhase("paused");
    this.media.pause();
  }

  stop() {
    this.intent = "idle";
    this.failed = false;
    this.clearStartTimer();
    this.onBlocked(false);
    this.setPhase("idle");
    this.media.pause();
    try {
      this.media.currentTime = 0;
    } catch {
      /* Not seekable yet. */
    }
  }

  markEnded() {
    this.intent = "idle";
    this.clearStartTimer();
    this.setPhase("idle");
    try {
      this.media.currentTime = 0;
    } catch {
      /* Ignore. */
    }
  }

  markError() {
    this.fail();
  }

  dispose() {
    this.stop();
  }

  private fail() {
    this.failed = true;
    this.intent = "idle";
    this.clearStartTimer();
    try {
      this.media.pause();
    } catch {
      /* Ignore. */
    }
    this.onBlocked(true);
    this.setPhase("idle");
  }

  private armStartTimer() {
    this.clearStartTimer();
    this.startTimer = setTimeout(() => {
      if (this.phase !== "speaking") this.fail();
    }, START_TIMEOUT_MS);
    const timer = this.startTimer as { unref?: () => void };
    timer.unref?.();
  }

  private clearStartTimer() {
    if (this.startTimer == null) return;
    clearTimeout(this.startTimer);
    this.startTimer = null;
  }

  private setPhase(phase: StoryPhase) {
    this.phase = phase;
    setStorytellerOwnsSpeech(phase !== "idle");
    this.onPhase(phase);
  }
}
