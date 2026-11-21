/**
 * Caption times for the Fire hall briefing.
 * The read is the complete Volume 1 Ignition paragraph and the Van Dyke close,
 * in the recorded card voice. The Foch line is a hall-plate quote, not a cue.
 */
export const FIRE_STORY_VOICE = "en-GB-SoniaNeural";
export const FIRE_STORY_SPEECH_SECONDS = 71.568;
export const FIRE_STORY_WORDS = 144;

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
  { start: 34.350, text: "United, mankind could build the impossible, raising cathedrals in the sky and unlocking the ethereal depths of our being." },
  { start: 43.900, text: "Division brings collapse, but unification multiplies strength — the grand design that lifts us toward higher intelligence and higher learning." },
  { start: 54.300, text: "What can be imagined may now be achieved, for imagination itself has become infrastructure." },
  { start: 62.646, text: "Man is the only creature that dares to light a fire and live with it." },
  { start: 68.698, text: "Henry Jackson Van Dyke." },
];

export function fireCaptionAt(seconds: number): string {
  let line = FIRE_STORY_CUES[0]?.text ?? "";
  for (const cue of FIRE_STORY_CUES) {
    if (seconds + 0.04 >= cue.start) line = cue.text;
  }
  return line;
}
