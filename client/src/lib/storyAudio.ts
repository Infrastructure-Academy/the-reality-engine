/** British English recording of the complete Fire briefing, through the Van Dyke close. */
/** Card-paced read of the issued Volume 1 paragraph. Not the 44.5 s stand-in. */
export const FIRE_STORY_AUDIO_URL = "/audio/fire-cards/volume-1-briefing.mp3";

/** Issued hall stories, en-GB Sonia: narrative, quote, and author. The SSML shell is not spoken. */
export const HALL_STORY_AUDIO: readonly { relay: number; file: string; sha256: string }[] = [
  { relay: 2, file: "02_the-living-machine.mp3", sha256: "cb6ee36ed0571bea66690c6d1da5393558a84cd1dc829a9c8de25251138296a7" },
  { relay: 3, file: "03_the-liquid-highway.mp3", sha256: "ee6162a370b7cea75ae70ce08e4f0f7624ce707c3c44c755c0b757a86d57af1e" },
  { relay: 4, file: "04_the-steering-revolution.mp3", sha256: "d1cc0c6b8625f6b2fb0ee88944e75354bbfae0e4c9ab40b9f0e97a0e7c2e6553" },
  { relay: 5, file: "05_the-path-that-connected-everything.mp3", sha256: "7aaf1a2befff9c5ce902fd6bab8dcb8088d9bc97a2e5a53a7bdee7ceb9e3aac5" },
  { relay: 6, file: "06_the-vessel-that-made-the-world-one.mp3", sha256: "7e0369e75287108c7956df4ab5cba113e25ef81b947731d82eac536d185c2142" },
  { relay: 7, file: "07_the-machine-that-wove-civilisation.mp3", sha256: "bb1449e5b6e1af1408474d6479afe8f32de8afc5cf16eb0150877dd869f268a2" },
  { relay: 8, file: "08_the-iron-horse-that-standardised-time.mp3", sha256: "b657b51e4555d1489c6d75acdf08361dca9e3caf1da71d3b3714b9d1f0df2001" },
  { relay: 9, file: "09_the-machine-that-multiplied-muscle.mp3", sha256: "0a4376b46d2a50222357107fdb1baa5ee78b272d8e7de2e087ed031558598d4c" },
  { relay: 10, file: "10_automobiles-aviation-airwaves.mp3", sha256: "d913693fa22ba1d0a1028078f52b876acc37f923204aa39b52d46350c054847a" },
  { relay: 11, file: "11_satellites-space-stations-planetary-infrastructure.mp3", sha256: "56963733e83040ed767b7318300c160a8c29b892881a477bbd9772bef5ded758" },
  { relay: 12, file: "12_robots-ai-biosynthetics-quantum.mp3", sha256: "0b0bd287767ee7f80d472f8294e3554c8079b2d10ce3c76ed4e290921579edf4" },
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
 * Sonia reading for a hall 2–12 discovery card.
 * A missing file stays silent. There is no browser-voice fallback.
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
