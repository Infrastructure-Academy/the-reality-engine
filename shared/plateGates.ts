import { GREY_MATTER_PATH, SCHOLAR_PATH } from "./playerProgress";

/**
 * Nigel Dearden’s plate for the Home landing:
 * “iGO — One Game. All Ages. The Infrastructure Discovery Game | Ages 8–65+”.
 *
 * Eleven gates, not the twelve-mode A–L list on /play/igo.
 * Episode age bands overlap from 40 to 50. Gates from Senior Leader
 * onwards are shown with Episode 3 (Build Forward), which begins at 40.
 * Unbuilt modules have no route, so the landing cannot link them.
 */
export const PLATE_TITLE = "iGO — One Game. All Ages.";
export const PLATE_SUBTITLE = "The Infrastructure Discovery Game | Ages 8–65+";
export const PLATE_FOUNDATION = "12 Relays × 5 Webs = 60-node Dearden Field.";

export type PlateEpisodeId = 1 | 2 | 3;

export type PlateEpisode = {
  id: PlateEpisodeId;
  name: string;
  ages: string;
  /** Episode 1 is the play choice. Episodes 2 and 3 are not built yet. */
  playable: boolean;
  hook: string;
  accent: string;
};

export const PLATE_EPISODES: readonly PlateEpisode[] = [
  { id: 1, name: "Relay & Remember", ages: "8–22", playable: true, hook: "Five live ways to play.", accent: "#4ade80" },
  { id: 2, name: "Explore Forward", ages: "22–50", playable: false, hook: "The career doors, still ahead.", accent: "#60a5fa" },
  { id: 3, name: "Build Forward", ages: "40–65+", playable: false, hook: "Leadership, still ahead.", accent: "#fbbf24" },
];

export type PlateGate = {
  id: string;
  name: string;
  ages: string;
  episode: PlateEpisodeId;
  /** Existing play route. Null means Coming soon, with no link. */
  href: string | null;
  /** Short imperative line. Episode 1 uses the legacy home voice. */
  hook: string;
  accent: string;
};

export const PLATE_GATES: readonly PlateGate[] = [
  { id: "relay-spinner", name: "Relay Spinner", ages: "8–10", episode: 1, href: "/explore/spinner", hook: "Spin to discover", accent: "#f59e0b" },
  { id: "dungeon-crawl", name: "Dungeon Crawl", ages: "10–12", episode: 1, href: "/explore/dungeon", hook: "Begin your quest", accent: "#2dd4bf" },
  { id: "grey-matter", name: "Grey Matter", ages: "12–14", episode: 1, href: GREY_MATTER_PATH, hook: "Test your brain", accent: "#a78bfa" },
  { id: "flight-deck", name: "Flight Deck", ages: "14–18", episode: 1, href: "/flight-deck", hook: "Take the helm", accent: "#38bdf8" },
  { id: "scholar", name: "Scholar", ages: "18–22", episode: 1, href: SCHOLAR_PATH, hook: "Shape your study", accent: "#fbbf24" },
  { id: "graduate", name: "Graduate", ages: "22–29", episode: 2, href: null, hook: "", accent: "#60a5fa" },
  { id: "chartered", name: "Chartered", ages: "30+", episode: 2, href: null, hook: "", accent: "#34d399" },
  { id: "senior-leader", name: "Senior Leader", ages: "40+", episode: 3, href: null, hook: "", accent: "#c084fc" },
  { id: "industry-leader", name: "Industry Leader", ages: "50+", episode: 3, href: null, hook: "", accent: "#fb7185" },
  { id: "champion", name: "Champion", ages: "60+", episode: 3, href: null, hook: "", accent: "#facc15" },
  { id: "mentor-class", name: "Mentor Class", ages: "65+", episode: 3, href: null, hook: "", accent: "#fcd34d" },
];
