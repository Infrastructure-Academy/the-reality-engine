import { declareStoryPlayback, storyAudioUrl } from "@/lib/storyAudio";
import { resolveStoryLocale, type StoryLocale } from "@/lib/storyLocale";

export const HALL_STORY_BED_ID = "hall-story-bed";

let generation = 0;
let bed: HTMLAudioElement | null = null;

function storyLocaleNow(): StoryLocale {
  let ui = "EN";
  try {
    ui = localStorage.getItem("iaai-lang") || "EN";
  } catch {
    ui = "EN";
  }
  const tags = typeof navigator !== "undefined" && navigator.languages?.length
    ? [...navigator.languages]
    : typeof navigator !== "undefined" && navigator.language
      ? [navigator.language]
      : [];
  return resolveStoryLocale(ui, tags);
}

/** One element for halls 2–12, so the opening tap can start Sonia before the hall mounts. */
export function hallStoryElement(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  if (bed && bed.isConnected) return bed;
  const existing = document.getElementById(HALL_STORY_BED_ID);
  if (existing instanceof HTMLAudioElement) {
    bed = existing;
    return bed;
  }
  const audio = document.createElement("audio");
  audio.id = HALL_STORY_BED_ID;
  audio.preload = "auto";
  audio.dataset.testid = "hall-story-bed";
  document.body.appendChild(audio);
  bed = audio;
  return bed;
}

export function hallStoryGeneration(): number {
  return generation;
}

/** Start a hall story in the same tap that opens the door. No fire crackle. */
export function beginHallStoryFromGesture(url: string): Promise<void> {
  declareStoryPlayback();
  const audio = hallStoryElement();
  if (!audio) return Promise.reject(new Error("hall story is not mounted"));
  generation += 1;
  const absolute = new URL(url, window.location.href).href;
  if (audio.src !== absolute) {
    audio.src = url;
  }
  if (audio.ended) audio.currentTime = 0;
  const pending = audio.play();
  return pending ?? Promise.resolve();
}

export function beginHallStoryForPath(path: string | null | undefined): void {
  if (!path || !path.startsWith("/explore/")) return;
  const relay = Number(path.slice("/explore/".length));
  if (!Number.isInteger(relay) || relay < 2 || relay > 12) return;
  const url = storyAudioUrl(relay, storyLocaleNow());
  if (!url) return;
  void beginHallStoryFromGesture(url).catch(() => undefined);
}

export function pauseHallStoryIfStale(seen: number): void {
  if (generation !== seen) return;
  bed?.pause();
}
