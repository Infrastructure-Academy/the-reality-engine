/**
 * Caption times for the Fire hall briefing.
 * The read is the issued wording at the fire-card pace, about 131 words a minute.
 * The 44.5 s stand-in is not the door recording.
 */
export const FIRE_STORY_VOICE = "en-GB-SoniaNeural";
export const FIRE_STORY_SPEECH_SECONDS = 39.432;
export const FIRE_STORY_WORDS = 86;

export interface FireStoryCue {
  start: number;
  text: string;
}

export const FIRE_STORY_CUES: readonly FireStoryCue[] = [
  { start: 0, text: "Mission Briefing" },
  { start: 1.543, text: "Relay 1 of 12 — The First Platform" },
  { start: 4.661, text: "Understand the fundamental role of controlled fire in early human survival and societal development." },
  { start: 11.666, text: "The Story" },
  { start: 12.801, text: "Twelve thousand years ago, a great change erupted of unimaginable proportions." },
  { start: 18.37, text: "In an explosion of intent, man rose from hunter and prey to apex predator." },
  { start: 24.07, text: "The seed was sown, the threads spun, and the age of intelligence began." },
  { start: 29.14, text: "Civilisation ignited — an epic of incalculable possibility." },
  { start: 34.269, text: "The most powerful weapon on earth is the human soul on fire." },
  { start: 38.392, text: "Ferdinand Foch" },
];

export function fireCaptionAt(seconds: number): string {
  let line = FIRE_STORY_CUES[0]?.text ?? "";
  for (const cue of FIRE_STORY_CUES) {
    if (seconds + 0.04 >= cue.start) line = cue.text;
  }
  return line;
}
