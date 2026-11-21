/**
 * Caption times for the Fire hall briefing.
 * The read is the issued Volume 1 Relay 1 paragraph and the Van Dyke close,
 * in the same voice as the fire cards, about 134 words a minute.
 * The 44.5 s stand-in is not the door recording.
 */
export const FIRE_STORY_VOICE = "en-GB-SoniaNeural";
export const FIRE_STORY_SPEECH_SECONDS = 64.536;
export const FIRE_STORY_WORDS = 144;

export interface FireStoryCue {
  start: number;
  text: string;
}

export const FIRE_STORY_CUES: readonly FireStoryCue[] = [
  { start: 0, text: "Mission Briefing" },
  { start: 1.629, text: "Relay 1 of 12 — The First Platform" },
  { start: 4.755, text: "Understand the fundamental role of controlled fire in early human survival and societal development." },
  { start: 11.769, text: "The Story" },
  { start: 13.009, text: "Twelve thousand years ago, a great change erupted of unimaginable proportions." },
  { start: 18.603, text: "In an explosion of intent, man rose from hunter and prey to apex predator." },
  { start: 24.337, text: "The seed was sown, the threads spun, and the age of intelligence began." },
  { start: 29.424, text: "Civilisation ignited — an epic of incalculable possibility." },
  { start: 34.29, text: "United, mankind could build the impossible, raising cathedrals in the sky and unlocking the ethereal depths of our being." },
  { start: 42.438, text: "Division brings collapse, but unification multiplies strength — the grand design that lifts us toward higher intelligence and higher learning." },
  { start: 51.436, text: "What can be imagined may now be achieved, for imagination itself has become infrastructure." },
  { start: 57.672, text: "Man is the only creature that dares to light a fire and live with it." },
  { start: 62.273, text: "Henry Jackson Van Dyke" },
];

export function fireCaptionAt(seconds: number): string {
  let line = FIRE_STORY_CUES[0]?.text ?? "";
  for (const cue of FIRE_STORY_CUES) {
    if (seconds + 0.04 >= cue.start) line = cue.text;
  }
  return line;
}
