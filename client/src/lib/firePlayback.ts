import { FIRE_AMBIENCE_UNDER_STORY, FIRE_AMBIENCE_URL } from "@/lib/fireDoorAudio";
import { declareStoryPlayback, FIRE_STORY_AUDIO_URL } from "@/lib/storyAudio";

/** Persistent beds, mounted for the life of the app, so a portal click can start them. */
export const FIRE_STORY_BED_ID = "fire-story-bed";
export const FIRE_AMBIENCE_BED_ID = "fire-ambience-bed";

export const FIRE_STORY_BED_SRC = FIRE_STORY_AUDIO_URL;
export const FIRE_AMBIENCE_BED_SRC = FIRE_AMBIENCE_URL;

export interface FireBedAttempt {
  story: Promise<void>;
  ambience: Promise<void>;
}

let lastAttempt: FireBedAttempt | null = null;

function bed(id: string): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  const node = document.getElementById(id);
  return node instanceof HTMLAudioElement ? node : null;
}

export function fireStoryBed(): HTMLAudioElement | null {
  return bed(FIRE_STORY_BED_ID);
}

export function fireAmbienceBed(): HTMLAudioElement | null {
  return bed(FIRE_AMBIENCE_BED_ID);
}

function asPlay(pending: Promise<void> | undefined): Promise<void> {
  return pending ?? Promise.resolve();
}

/**
 * Start the recorded briefing and the fire crackle in the same call stack as the click.
 * A later effect must not call play() again: that second call is outside the gesture
 * and can abort the one the click just allowed.
 */
export function beginFireBedFromGesture(): FireBedAttempt {
  declareStoryPlayback();
  const story = fireStoryBed();
  const ambience = fireAmbienceBed();
  if (!story || !ambience) {
    const missing = Promise.reject(new Error("fire bed is not mounted"));
    const attempt = { story: missing, ambience: missing };
    lastAttempt = attempt;
    return attempt;
  }
  ambience.volume = FIRE_AMBIENCE_UNDER_STORY;
  if (story.ended) story.currentTime = 0;
  const attempt = {
    story: asPlay(story.play()),
    ambience: asPlay(ambience.play()),
  };
  lastAttempt = attempt;
  return attempt;
}

export function fireBedAttempt(): FireBedAttempt | null {
  return lastAttempt;
}

/** Both tracks have to start. A story that plays while the crackle fails is not settled. */
export function fireBedSettled(storyStarted: boolean, ambienceStarted: boolean): boolean {
  return storyStarted && ambienceStarted;
}

export function setFireAmbienceLevel(level: number): void {
  const ambience = fireAmbienceBed();
  if (!ambience) return;
  ambience.volume = level;
  if (ambience.paused) {
    const pending = ambience.play();
    if (pending) {
      lastAttempt = {
        story: lastAttempt?.story ?? Promise.resolve(),
        ambience: pending,
      };
    }
  }
}

export function pauseFireBed(): void {
  fireStoryBed()?.pause();
  fireAmbienceBed()?.pause();
  lastAttempt = null;
}
