/** British English recording of the Fire briefing, the story, and the quote. */
export const FIRE_STORY_AUDIO_URL = "/audio/relay-1-fire-en.mp3";

/**
 * Recorded storyteller for Fire in English.
 * Other relays stay on the browser voice until they have their own track.
 */
export function storyAudioUrl(relayNumber: number, locale: string): string | null {
  if (relayNumber === 1 && locale === "en") return FIRE_STORY_AUDIO_URL;
  return null;
}

export function formatStoryTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

/**
 * Safari treats Web Audio sound effects as ambient, which the silent switch mutes.
 * A story recording is media playback. Set that before play(), on the same tap.
 */
export function declareStoryPlayback(): void {
  if (typeof navigator === "undefined") return;
  const session = (navigator as AudioSessionNavigator).audioSession;
  if (session) session.type = "playback";
}
