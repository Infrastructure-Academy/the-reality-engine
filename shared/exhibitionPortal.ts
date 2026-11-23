import { RELAYS } from "./gameData";

/**
 * First portal cut. Episode 1 only: Earthbound Foundations — The Lineage.
 * The spiral is 0–13 three times. This branch climbs the first pass.
 * Episode 2 and Episode 3 keep their trilogy titles and stay Coming Soon.
 * They are not built here. The planet is zero, not a fourteenth hall.
 * Hall cards follow the issued plate. The fourteen-door frame stays
 * beside them: zero, relays 1–12, Fractal Connector as epilogue.
 */

export const PORTAL_PATH = "/portal";
export const FIRE_HALL_PATH = "/explore/1";
export const TREE_HALL_PATH = "/explore/2";
/** Epilogue. Not a relay, and not a fourteenth hall. */
export const CLOSE_PATH = "/portal/close";

export function relayHallPath(number: number): string {
  if (number === 1) return FIRE_HALL_PATH;
  if (number === 2) return TREE_HALL_PATH;
  return `/explore/${number}`;
}
export const FILM_SRC = "/portal/film-0201.mp4";
export const PLATE_SRC = "/portal/exhibition-plan-composite.png";
export const FILM_SHA256 = "cacc1ada942163efbb2bdd5a964e29524fd4557a041dc228bd85773d5c4a3d2e";
export const PLATE_SHA256 = "e9f17f7338f73c3ac89c061120de6fd7ab68b66443e5184f2de48de4d6063d91";

/** Nigel’s placement, held as received. */
export const RECEIVED_ZERO =
  "The planet is the zero (0). Without it there would be no our reality or the contest. It is the substrate from which the 13 rise, in episodes 1–3, spiralling upward, a boundary-condition reset to explore.";

export const ZERO_IS_NOT_A_HALL = "The zero is not a fourteenth hall.";

export const CUT_LINE =
  "The twelve halls open from this floor. The Fractal Connector is the epilogue. The planet remains the zero.";

/** Script room lines for stations this cut does not open. No new hall is drawn. */
export const ROOM_DIRECTION: Record<string, string> = {
  tree: "The script marks an ancient forest, timber, and the first shelters.",
  river: "The script marks water, irrigation, and the hydraulic civilisations.",
  horse: "The script marks horse and rider, reins, chariots, and the Nomad.",
  roads: "The script marks Roman roads, the Silk Road, and standardised surfaces.",
  ships: "The script marks clinker boats, treasure fleets, and maritime empires.",
  loom: "The script marks the Jacquard loom and the first programmable machine.",
  rail: "The script marks the steam locomotive, a standard gauge, and timetables.",
  engine: "The script marks internal combustion, electricity, and steel bridges.",
  "aaa-triad": "The script marks automobiles, aviation, and armaments.",
  orbit: "The script marks rockets, satellites, and the moon.",
  "human-nodes": "The script marks the holodeck, the suit, and programmable humans.",
  "fractal-connector": "The plate marks the Fractal Connector as the exhibition itself.",
};

export const FILM_LABEL = "FILM-0201 · Video 2 — Dungeon Crawl · ages 10–12 · 24 seconds";

export const SOUND_NOTE =
  "On iPhone, Safari starts the film sound on your first tap. After that tap, you hear the issued soundtrack. If the sound is off, the film still shows its own title: Video 2 — Dungeon Crawl, ages 10–12, 24 seconds.";

export const APPROACH_LINES = [
  "Watching in from the solar system.",
  "The planet sits below. It is still smouldering.",
  "Settled earth. Fire is harnessed, some 12,000 years ago.",
  "Episode 1. Earthbound Foundations — The Lineage. The thirteen rise from the zero, spiralling upward.",
] as const;

/** Held as received. This cut builds only the first of the three passes. */
export const SPIRAL_HELD = "The spiral is 0–13 three times.";

/** Titles from the Trilogy Vision slide. Episodes 2 and 3 are not opened here. */
export const TRILOGY_EPISODES = [
  {
    id: 1,
    title: "Earthbound Foundations — The Lineage",
    line: "from civilisations to civilisation",
    state: "Available",
    inThisCut: true,
  },
  {
    id: 2,
    title: "Reality Engines — The Grey Arena",
    line: "systems shape reality, design defines destiny",
    state: "Coming Soon",
    inThisCut: false,
  },
  {
    id: 3,
    title: "Stewardship & Renewal — The Cosmic Scale",
    line: "custodians today, civilisations tomorrow",
    state: "Coming Soon",
    inThisCut: false,
  },
] as const;

export const EPISODE_ONE = TRILOGY_EPISODES[0];
export const LATER_EPISODES = TRILOGY_EPISODES.filter((episode) => !episode.inThisCut);

export type HallCard = {
  id: string;
  number: number;
  name: string;
  plate: string;
  when: string;
  href: string | null;
};

/** Exhibition twin, numbered with the locked relay line. Fractal Connector stays the thirteenth card. */
export const HALL_CARDS: readonly HallCard[] = [
  { id: "fire", number: 1, name: "Fire", plate: "The First Infrastructure", when: "pre-10,000 BCE", href: FIRE_HALL_PATH },
  { id: "tree", number: 2, name: "Tree", plate: "The Living Structure", when: "pre-10,000 BCE", href: TREE_HALL_PATH },
  { id: "river", number: 3, name: "River", plate: "Hydraulic Civilisation", when: "8,000 BCE", href: relayHallPath(3) },
  { id: "horse", number: 4, name: "Horse", plate: "The Mobile Engine", when: "4,000 BCE", href: relayHallPath(4) },
  { id: "roads", number: 5, name: "Roads", plate: "The Roman Network", when: "300 BCE", href: relayHallPath(5) },
  { id: "ships", number: 6, name: "Ships", plate: "The Ocean Relay", when: "1500 CE", href: relayHallPath(6) },
  { id: "loom", number: 7, name: "Loom", plate: "The Pattern Engine", when: "1780 CE", href: relayHallPath(7) },
  { id: "rail", number: 8, name: "Rail", plate: "The Iron Horse", when: "1830 CE", href: relayHallPath(8) },
  { id: "engine", number: 9, name: "Engine", plate: "The Power Multiplier", when: "1880 CE", href: relayHallPath(9) },
  { id: "aaa-triad", number: 10, name: "AAA Triad", plate: "The Modern Network", when: "1980 CE", href: relayHallPath(10) },
  { id: "orbit", number: 11, name: "Orbit", plate: "The Third Dimension", when: "1960 CE", href: relayHallPath(11) },
  { id: "human-nodes", number: 12, name: "Human Nodes", plate: "Programmable Humans", when: "2020 CE", href: relayHallPath(12) },
  { id: "fractal-connector", number: 13, name: "Fractal Connector", plate: "The Exhibition Itself", when: "The hall card", href: CLOSE_PATH },
];

export type DoorRole = "substrate" | "relay" | "epilogue";

export type DoorStop = {
  id: string;
  mark: string;
  name: string;
  role: DoorRole;
  href: string | null;
};

/** Beside the hall cards. The zero is a substrate door, never a hall. */
export const DOOR_FRAME: readonly DoorStop[] = [
  { id: "planet", mark: "0", name: "Planet", role: "substrate", href: null },
  ...RELAYS.map((relay): DoorStop => ({
    id: `relay-${relay.number}`,
    mark: String(relay.number),
    name: relay.name,
    role: "relay",
    href: relayHallPath(relay.number),
  })),
  { id: "fractal-epilogue", mark: "Epilogue", name: "Fractal Connector", role: "epilogue", href: CLOSE_PATH },
];

export type ReturnTurn = { kind: "return"; station: string; title: string; body: string };
export type HallTurn = { kind: "hall"; path: string };
export type PortalTurn = HallTurn | { kind: "reset" } | ReturnTurn;

const LOST_NOTHING = "You are back on the floor. Nothing is taken away.";

function returned(station: string, title: string, body: string): ReturnTurn {
  return { kind: "return", station, title, body };
}

/**
 * One pass, 1–13, rising off the zero. A single turn, not the second
 * or third 0–13. y falls as the index rises.
 */
export function spiralSlot(index: number): { x: number; y: number } {
  const t = index / (HALL_CARDS.length - 1);
  const angle = t * Math.PI * 2;
  return {
    x: 50 + Math.sin(angle) * (9 + t * 16),
    y: 92 - t * 84,
  };
}

export function turnFromHall(id: string): PortalTurn {
  const hall = HALL_CARDS.find((card) => card.id === id);
  if (!hall) {
    return returned("unknown", "Back on the floor", `That turn comes back to the floor. ${LOST_NOTHING}`);
  }
  if (hall.href) return { kind: "hall", path: hall.href };
  const direction = ROOM_DIRECTION[hall.id] ?? "";
  return returned(
    hall.id,
    `${hall.name} returns you to the floor`,
    `${hall.name} is marked on the issued plate. ${direction} ${LOST_NOTHING}`,
  );
}

export function turnFromDoor(id: string): PortalTurn {
  if (id === "planet") return { kind: "reset" };
  const door = DOOR_FRAME.find((stop) => stop.id === id);
  if (!door) {
    return returned("unknown", "Back on the floor", `That turn comes back to the floor. ${LOST_NOTHING}`);
  }
  if (door.href) return { kind: "hall", path: door.href };
  return returned(
    door.id,
    `${door.name} returns you to the floor`,
    `${door.name} is a door in the fourteen-door frame. ${LOST_NOTHING}`,
  );
}

/** The twelve official halls step into one another. The epilogue is not a thirteenth relay. */
export function stepFromRelay(relayNum: number, direction: "back" | "forward"): string | null {
  const target = relayNum + (direction === "forward" ? 1 : -1);
  if (target < 1 || target > 12) return null;
  return relayHallPath(target);
}

/** The emoji row opens any of the twelve halls. */
export function relayNavigatorHref(currentRelay: number, target: number): string | null {
  if (currentRelay < 1 || currentRelay > 12) return null;
  if (target < 1 || target > 12) return null;
  return relayHallPath(target);
}

/**
 * Every official relay opens its own door.
 * A number outside 1–12 has no floor to return to.
 */
export function unfinishedRelayFloor(relayNum: number): string | null {
  if (!Number.isInteger(relayNum) || relayNum < 1 || relayNum > 12) return null;
  const hall = HALL_CARDS.find((card) => card.number === relayNum);
  if (!hall || hall.href !== null) return null;
  return `${PORTAL_PATH}?station=${hall.id}`;
}

/**
 * Hall clips from PRINCIPIA TECTONICA V6, played same-origin from the Pages tree.
 * The bytes stay as cut. Horse, Ships, Loom, and Engine have no clip here.
 */
export const V6_EXHIBITION_DIR = "/portal/v6-exhibition";

export type V6ClipPlace =
  | { kind: "portal-floor" }
  | { kind: "explore"; hall: "fire" | "tree" }
  | { kind: "halls"; hallIds: readonly string[] }
  | { kind: "film" };

export type V6Clip = {
  id: string;
  file: string;
  sha256: string;
  bytes: number;
  /** Film plaque, held as shown. */
  label: string;
  note: string;
  place: V6ClipPlace;
};

export const V6_CLIPS: readonly V6Clip[] = [
  {
    id: "00_intro",
    file: "00_intro.mp4",
    sha256: "893d5b891e30487b2657d8bc75389121aad21bb4bbbc8f611739024739ed6e25",
    bytes: 39996893,
    label: "iAAi Exhibition approach",
    note: "Title card and vestibule, through the fire-ring floor.",
    place: { kind: "portal-floor" },
  },
  {
    id: "01_fire",
    file: "01_fire.mp4",
    sha256: "43af2c89732f33e33bf22548c0658541f3a5db0ff152d5eea08baa8fa9ef4ebd",
    bytes: 24240464,
    label: "Fire",
    note: "Cave, fire, and paintings from the exhibition film.",
    place: { kind: "explore", hall: "fire" },
  },
  {
    id: "02_tree",
    file: "02_tree.mp4",
    sha256: "73c2c66570d7de7b3b9105546f2f389ec9b9ece29db481184446401b6b05092f",
    bytes: 34244413,
    label: "Tree",
    note: "Forest, timber, and the first shelters from the exhibition film.",
    place: { kind: "explore", hall: "tree" },
  },
  {
    id: "03_river",
    file: "03_river.mp4",
    sha256: "7251975cff97f9dbc8f5997f4bc0a32e8bef7700036142cb36d9cf61cebfad99",
    bytes: 22464435,
    label: "River",
    note: "Water channel and hydraulic models on the River hall.",
    place: { kind: "halls", hallIds: ["river"] },
  },
  {
    id: "04_stone_wheel",
    file: "04_stone_wheel.mp4",
    sha256: "6352b61b473da04f36d46460cdc80a79590c5b9fa4698aa56d05363e046ed7db",
    bytes: 24448696,
    label: "Stone and wheel (provisional)",
    note: "Pyramid and millstone. The plaque is not yet read.",
    place: { kind: "film" },
  },
  {
    id: "05_forge",
    file: "05_forge.mp4",
    sha256: "2bc7a231db949e3ae29d557f25a501b8a0fdfc4924d982c45ab3a53253857c72",
    bytes: 15359978,
    label: "Forge (provisional)",
    note: "Furnace, anvil, and molten metal. The plaque is not yet read.",
    place: { kind: "film" },
  },
  {
    id: "06_road",
    file: "06_road.mp4",
    sha256: "202bdb0e37a82b1e3528d816ce744608c05b0b5542a77486ea2866e297e1249f",
    bytes: 29803200,
    label: "RELAY 6: ROAD - 2000 BC",
    note: "Roads remains official hall 5. This plaque keeps 6.",
    place: { kind: "halls", hallIds: ["roads"] },
  },
  {
    id: "07_gunpowder",
    file: "07_gunpowder.mp4",
    sha256: "7a1820121a99bb813209406bd0d0c33ede0a69435e9aaaeaa7c3d910ba4ef94d",
    bytes: 26999450,
    label: "RELAY 7: GUNPOWDER - 1605",
    note: "The film plaque, as written.",
    place: { kind: "film" },
  },
  {
    id: "08_rail_steam",
    file: "08_rail_steam.mp4",
    sha256: "483b40d07da172a1ead0aa4a5cc3e9906affb98134712776a4cd730c77769a5c",
    bytes: 28668197,
    label: "Steam, Brunel, rail",
    note: "Steam engine, railway model, and the Thames Brunel tunnel, on the Rail hall.",
    place: { kind: "halls", hallIds: ["rail"] },
  },
  {
    id: "09_steel",
    file: "09_steel.mp4",
    sha256: "ea2d539d0902b2a58dea175de330770424fee39e6e1411cc9a4ee698af42fd73",
    bytes: 12702351,
    label: "RELAY 9: 9: STEEL \u2013 1869",
    note: "Pedestal lettering, as shown.",
    place: { kind: "film" },
  },
  {
    id: "10_11_modern_orbit",
    file: "10_11_modern_orbit.mp4",
    sha256: "b4f55c05ff9e36b95c7366439dbc5f7a9b00e757feaaa3197ee0a347e2bb90ec",
    bytes: 28243860,
    label: "RELAY 10-11",
    note: "1969 and orbit. AAA Triad and Orbit share this one clip.",
    place: { kind: "halls", hallIds: ["aaa-triad", "orbit"] },
  },
  {
    id: "12_human",
    file: "12_human.mp4",
    sha256: "d6b10eb6cbfaf062e9e7125305e4d3f5072479c95c7a9049de25cbb6affc9e1d",
    bytes: 43471631,
    label: "RELAY 12 PROGRAMMABLE HUMANS - NOW",
    note: "Human Nodes. The film plaque is held as shown.",
    place: { kind: "halls", hallIds: ["human-nodes"] },
  },
  {
    id: "13_close",
    file: "13_close.mp4",
    sha256: "8fe9ee4c7c9b34d7c7d2d6845ee550fa86e6f5fd2ff67502d16a455df08d28e7",
    bytes: 7384624,
    label: "Episode 1 Complete / N+T=D",
    note: "End card on the Fractal Connector. The motto is held as shown.",
    place: { kind: "halls", hallIds: ["fractal-connector"] },
  },
];

export function v6ClipSrc(file: string): string {
  return `${V6_EXHIBITION_DIR}/${file}`;
}

export function v6ClipById(id: string): V6Clip | null {
  return V6_CLIPS.find((clip) => clip.id === id) ?? null;
}

export function v6HallClip(hallId: string): V6Clip | null {
  for (const clip of V6_CLIPS) {
    if (clip.place.kind === "halls" && clip.place.hallIds.includes(hallId)) return clip;
  }
  return null;
}

function requiredClip(id: string): V6Clip {
  const clip = v6ClipById(id);
  if (!clip) throw new Error(`Missing exhibition clip ${id}`);
  return clip;
}

export const V6_INTRO = requiredClip("00_intro");
export const V6_FIRE = requiredClip("01_fire");
export const V6_TREE = requiredClip("02_tree");
export const V6_FILM_CLIPS = V6_CLIPS.filter((clip) => clip.place.kind === "film");
