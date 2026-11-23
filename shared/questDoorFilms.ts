/**
 * Quest door films. One door, one set. Explore, Flight and Scholar
 * do not share a reel. Hashes were rematched against the issued bytes
 * before these URLs were written here.
 *
 * Flight keeps three films. FILM-0057 and FILM-0046 were not rematched
 * from a live path, so they are not given a substitute.
 */

const QUEST_CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481";
const INTRO_CDN = `${QUEST_CDN}/EPdHLKrneifLpbtrLUugQB`;
const ISSUED_CDN = `${QUEST_CDN}/kUQZAex2uPvgKcHnt7bmh3`;

export type QuestDoor = "explore" | "flight" | "scholar";
export type ExploreDoorMode = "spinner" | "dungeon" | "grey";

export type QuestFilm = {
  id: string;
  door: QuestDoor;
  role: "intro" | "watch";
  title: string;
  duration: string;
  sha256: string;
  src: string;
  /** Explore sub-mode whose short this is. Watch-row films have none. */
  exploreMode?: ExploreDoorMode;
};

export const QUEST_DOOR_FILMS: readonly QuestFilm[] = [
  {
    id: "v1",
    door: "explore",
    role: "intro",
    exploreMode: "spinner",
    title: "V1 — Relay Spinner",
    duration: "20s",
    sha256: "756550b36d58fb7043d8a835f71f71e4e89202af4b53cb1e51fdba8339eb5fd9",
    src: `${INTRO_CDN}/FINAL-v1-relay-spinner_641673d9.mp4`,
  },
  {
    id: "v2",
    door: "explore",
    role: "intro",
    exploreMode: "dungeon",
    title: "V2 — Dungeon Crawl",
    duration: "24s",
    sha256: "9c37c0203321faee7822b4fdc78c49fa6eb13a72cc809dca3cd9fe024254a7eb",
    src: `${INTRO_CDN}/FINAL-v2-dungeon-crawl_3914ce50.mp4`,
  },
  {
    id: "v3",
    door: "explore",
    role: "intro",
    exploreMode: "grey",
    title: "V3 — Grey Matter",
    duration: "24s",
    sha256: "ae4e83e3e4ea4c99c80080daceaa652b34f7dc5eab233aded2e76cda41fdb203",
    src: `${INTRO_CDN}/FINAL-v3-grey-matter_5eaff673.mp4`,
  },
  {
    id: "film-0015",
    door: "explore",
    role: "watch",
    title: "iGO — Would You Like to Play a Game?",
    duration: "0:50",
    sha256: "7ef3173d23769f0b4b84402819754e8d160f0bdbffeec173d1a2dead35b50996",
    src: `${ISSUED_CDN}/iGO_trailer_v7_6a22857c.mp4`,
  },
  {
    id: "film-0011",
    door: "explore",
    role: "watch",
    title: "The Reality Engine — Guided Learning Platform",
    duration: "1:10",
    sha256: "a95246e6a7fbbf59c14c9026904119cb0686636e944d33803e88cd6f839f2dd3",
    src: `${ISSUED_CDN}/reality-engine-trailer_7e837497.mp4`,
  },
  {
    id: "v4a",
    door: "flight",
    role: "intro",
    title: "V4-A — Flight Deck Spec",
    duration: "32s",
    sha256: "898584e9dd2617f1f197c5d3caf7560b98e8d15f2e6a96b30df5cca238b816f9",
    src: `${INTRO_CDN}/FINAL-v4a-v2_4d1e0f2d.mp4`,
  },
  {
    id: "film-0002",
    door: "flight",
    role: "watch",
    title: "Dearden Dynamics",
    duration: "2:40",
    sha256: "09d697ee8c8c6f8302383787c64c93dffebcea53497fa6ab888768efa26f46d7",
    src: `${ISSUED_CDN}/MASTER-VIDEO-DEARDEN-DYNAMICS(2)_fdde8442.mp4`,
  },
  {
    id: "film-0014",
    door: "flight",
    role: "watch",
    title: "iGO Architecture",
    duration: "1:40",
    sha256: "3e12b6529ada41adcf80487f10f481c394edbad44fbe53c2b3263ef026e140e7",
    src: `${ISSUED_CDN}/iGO_Movie_SHARE_WITH_TEAM_16x9_7c72b3fe.mp4`,
  },
  {
    id: "v5a",
    door: "scholar",
    role: "intro",
    title: "V5-A — Scholar's Secret",
    duration: "32s",
    sha256: "f09dd5b016fff39ad32c3b5a2a03c6607c3843c1b360046c5648230b7cecfbe1",
    src: `${INTRO_CDN}/FINAL-v5a-v2_a35db770.mp4`,
  },
  {
    id: "film-0017",
    door: "scholar",
    role: "watch",
    title: "The Blade and the Bridge — Katana 13-Fold",
    duration: "4:04",
    sha256: "9407c84e5fd3bf6ef7272fb16133ef64ea0c7086cfb6ff3668ad8ebef566c68a",
    src: `${ISSUED_CDN}/katana_13fold_v2_155b15a1.mp4`,
  },
  {
    id: "film-0008",
    door: "scholar",
    role: "watch",
    title: "Principia Tectonica",
    duration: "10:35",
    sha256: "2e34e0e99f592194bc601d82ff27ce5e6b1a6707bb40a8b04e84d8d4e6603f5f",
    src: `${ISSUED_CDN}/PRINCIPIA-TECTONICA-V5-MEGA-MOVIE(2)_f41e7154.mp4`,
  },
  {
    id: "film-0005",
    door: "scholar",
    role: "watch",
    title: "La Menara — Trailer",
    duration: "1:37",
    sha256: "51da0ed4942d8850b2c32c1680cd673e48663639d5123d3ccaab4324dc1c0f3e",
    src: "https://infrastructure-academy.com/site-media/vendor/iqkMXujGPgKFLVkB.mp4",
  },
  {
    id: "film-0001",
    door: "scholar",
    role: "watch",
    title: "Calories to Consciousness — Main Pitch",
    duration: "4:22",
    sha256: "aee60477a89dc48ec6a162d85c5571e9d72dd4e33286c9a5bc0bd859a0d027ca",
    src: "https://infrastructure-academy.com/site-media/vendor/BhohCnRNKxGTfvlS.mp4",
  },
];

export function filmById(id: string): QuestFilm {
  const film = QUEST_DOOR_FILMS.find((item) => item.id === id);
  if (!film) throw new Error(`Missing door film ${id}`);
  return film;
}

export function filmsForDoor(door: QuestDoor): QuestFilm[] {
  return QUEST_DOOR_FILMS.filter((film) => film.door === door);
}

export function exploreIntro(mode: ExploreDoorMode): QuestFilm {
  const film = QUEST_DOOR_FILMS.find((item) => item.exploreMode === mode);
  if (!film) throw new Error(`Missing explore intro ${mode}`);
  return film;
}

/** The short that loops on this path. Null when the path is not one of the three doors. */
export function doorIntroForPath(path: string): QuestFilm | null {
  const clean = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (clean === "/explore" || clean === "/explore/spinner") return filmById("v1");
  if (clean === "/explore/dungeon") return filmById("v2");
  if (clean === "/explore/greymatter" || clean === "/explore/grey-matter") return filmById("v3");
  if (clean === "/flight-deck") return filmById("v4a");
  if (clean === "/create" || clean === "/scholar") return filmById("v5a");
  return null;
}

export function isQuestDoorHref(href: string | null): boolean {
  if (!href) return false;
  return doorIntroForPath(href) !== null;
}
