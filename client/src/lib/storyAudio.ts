/** British English recording of the complete Fire briefing, through the Van Dyke close. */
/** Card-paced read of the issued Volume 1 paragraph. Not the 44.5 s stand-in. */
export const FIRE_STORY_AUDIO_URL = "/audio/fire-cards/volume-1-briefing.mp3";

/** Issued hall stories, en-GB Sonia, narrative plus quote plus author. */
export const HALL_STORY_AUDIO: readonly { relay: number; file: string; sha256: string }[] = [
  { relay: 2, file: "02_the-living-machine.mp3", sha256: "b354b6197d6aa716d9a26a7a5a4c6fe1bd334aba92ac19bf8f85b9e96d0dc851" },
  { relay: 3, file: "03_the-liquid-highway.mp3", sha256: "43ba3572b7c79d6a6619b8bfb58e044abe8badb7258c6da4c7ff47f4a90ae075" },
  { relay: 4, file: "04_the-steering-revolution.mp3", sha256: "8794eb4e93461bc8fdd95a545ca2055882c4bf2a89ae3dc0722cf325ca25ba54" },
  { relay: 5, file: "05_the-path-that-connected-everything.mp3", sha256: "46337f04e361898a031aa29c39308be270499fc9f3dd0d44c6d78bb892122cbd" },
  { relay: 6, file: "06_the-vessel-that-made-the-world-one.mp3", sha256: "d0c5579b7dfe71cc3b73081cf03c95840cb977fe01d14e445cfbc72a05a263c0" },
  { relay: 7, file: "07_the-machine-that-wove-civilisation.mp3", sha256: "34c3c1fc739cdc0d40e262aedc8619ab3e80dc118d45b6d8b4df5f56c18a538e" },
  { relay: 8, file: "08_the-iron-horse-that-standardised-time.mp3", sha256: "e8fd872f998000358657b5caa718d3e5eede18528065dcb671104833311fe89f" },
  { relay: 9, file: "09_the-machine-that-multiplied-muscle.mp3", sha256: "63f842b31606247ff6a2e16c93f82d0d097dbe14d41094286f52e080222ff23f" },
  { relay: 10, file: "10_automobiles-aviation-airwaves.mp3", sha256: "df7178fb564369d4c1217329b4a7f2a85919bef31c77ad6f9d7bcbe23a7b928b" },
  { relay: 11, file: "11_satellites-space-stations-planetary-infrastructure.mp3", sha256: "24d0594b5c6217c1107bbad0c964c0f25dd6d974ed0544215d40c4d0802a1304" },
  { relay: 12, file: "12_robots-ai-biosynthetics-quantum.mp3", sha256: "acbbbbbb932e2ac690001d9e053f3ded405631df2c8a8e106a186b740c1cfc7e" },
];

const HALL_STORY_BY_RELAY = new Map(HALL_STORY_AUDIO.map((row) => [row.relay, row.file]));

/**
 * Recorded English story for a hall.
 * Fire keeps the Volume 1 briefing. Halls 2–12 use the Sonia hall stories.
 * Any other language stays silent. There is no browser-voice fallback.
 */
export function storyAudioUrl(relayNumber: number, locale: string): string | null {
  if (locale !== "en") return null;
  if (relayNumber === 1) return FIRE_STORY_AUDIO_URL;
  const file = HALL_STORY_BY_RELAY.get(relayNumber);
  return file ? `/audio/hall-stories/${file}` : null;
}

/** Kebab-case file name for a discovery card. */
export function relayCardSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Prepared path for a hall 2–12 discovery card.
 * The Sonia card files are not in this cut. A missing file stays silent.
 */
export function relayCardVoiceUrl(relayNumber: number, name: string): string | null {
  if (!Number.isInteger(relayNumber) || relayNumber < 2 || relayNumber > 12) return null;
  const slug = relayCardSlug(name);
  if (!slug) return null;
  return `/audio/relay-cards/${String(relayNumber).padStart(2, "0")}/${slug}.mp3`;
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
