/**
 * Caption times for the Fire landing read.
 * Voice: en-GB Sonia neural, the same voice as the card reads.
 * Words are the existing door script. Pauses are delivery, not new copy.
 * Speech alone is 39.33s for 86 words, about 131 words a minute.
 */
export const FIRE_STORY_VOICE = "en-GB-SoniaNeural";
export const FIRE_STORY_SPEECH_SECONDS = 39.33;
export const FIRE_STORY_WORDS = 86;

export interface FireStoryCue {
  start: number;
  text: string;
}

export const FIRE_STORY_CUES: readonly FireStoryCue[] = [
  { start: 0, text: "Mission Briefing" },
  { start: 1.743, text: "Relay 1 of 12 — The First Platform" },
  { start: 5.265, text: "Understand the fundamental role of controlled fire in early human survival and societal development." },
  { start: 13.178, text: "The Story" },
  { start: 14.46, text: "Twelve thousand years ago, a great change erupted of unimaginable proportions." },
  { start: 20.752, text: "In an explosion of intent, man rose from hunter and prey to apex predator." },
  { start: 27.19, text: "The seed was sown, the threads spun, and the age of intelligence began." },
  { start: 32.918, text: "Civilisation ignited — an epic of incalculable possibility." },
  { start: 38.712, text: "The most powerful weapon on earth is the human soul on fire." },
  { start: 43.369, text: "Ferdinand Foch" },
];

export function fireCaptionAt(seconds: number): string {
  let line = FIRE_STORY_CUES[0]?.text ?? "";
  for (const cue of FIRE_STORY_CUES) {
    if (seconds + 0.04 >= cue.start) line = cue.text;
  }
  return line;
}
