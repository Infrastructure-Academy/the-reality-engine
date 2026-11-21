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
export const FILM_SRC = "/portal/film-0201.mp4";
export const PLATE_SRC = "/portal/exhibition-plan-composite.png";
export const FILM_SHA256 = "cacc1ada942163efbb2bdd5a964e29524fd4557a041dc228bd85773d5c4a3d2e";
export const PLATE_SHA256 = "e9f17f7338f73c3ac89c061120de6fd7ab68b66443e5184f2de48de4d6063d91";

/** Nigel’s placement, held as received. */
export const RECEIVED_ZERO =
  "The planet is the zero (0). Without it there would be no our reality or the contest. It is the substrate from which the 13 rise, in episodes 1–3, spiralling upward, a boundary-condition reset to explore.";

export const ZERO_IS_NOT_A_HALL = "The zero is not a fourteenth hall.";

export const CUT_LINE = "First portal cut. Not issued. This is not the finished hall walk-through.";

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
  href: typeof FIRE_HALL_PATH | null;
};

/** Exhibition twin, numbered with the locked relay line. Fractal Connector stays the thirteenth card. */
export const HALL_CARDS: readonly HallCard[] = [
  { id: "fire", number: 1, name: "Fire", plate: "The First Infrastructure", when: "pre-10,000 BCE", href: FIRE_HALL_PATH },
  { id: "tree", number: 2, name: "Tree", plate: "The Living Structure", when: "pre-10,000 BCE", href: null },
  { id: "river", number: 3, name: "River", plate: "Hydraulic Civilisation", when: "8,000 BCE", href: null },
  { id: "horse", number: 4, name: "Horse", plate: "The Mobile Engine", when: "4,000 BCE", href: null },
  { id: "roads", number: 5, name: "Roads", plate: "The Roman Network", when: "300 BCE", href: null },
  { id: "ships", number: 6, name: "Ships", plate: "The Ocean Relay", when: "1500 CE", href: null },
  { id: "loom", number: 7, name: "Loom", plate: "The Pattern Engine", when: "1780 CE", href: null },
  { id: "rail", number: 8, name: "Rail", plate: "The Iron Horse", when: "1830 CE", href: null },
  { id: "engine", number: 9, name: "Engine", plate: "The Power Multiplier", when: "1880 CE", href: null },
  { id: "aaa-triad", number: 10, name: "AAA Triad", plate: "The Modern Network", when: "1980 CE", href: null },
  { id: "orbit", number: 11, name: "Orbit", plate: "The Third Dimension", when: "1960 CE", href: null },
  { id: "human-nodes", number: 12, name: "Human Nodes", plate: "Programmable Humans", when: "2020 CE", href: null },
  { id: "fractal-connector", number: 13, name: "Fractal Connector", plate: "The Exhibition Itself", when: "The hall card", href: null },
];

export type DoorRole = "substrate" | "relay" | "epilogue";

export type DoorStop = {
  id: string;
  mark: string;
  name: string;
  role: DoorRole;
  href: typeof FIRE_HALL_PATH | null;
};

/** Beside the hall cards. The zero is a substrate door, never a hall. */
export const DOOR_FRAME: readonly DoorStop[] = [
  { id: "planet", mark: "0", name: "Planet", role: "substrate", href: null },
  ...RELAYS.map((relay): DoorStop => ({
    id: `relay-${relay.number}`,
    mark: String(relay.number),
    name: relay.name,
    role: "relay",
    href: relay.number === 1 ? FIRE_HALL_PATH : null,
  })),
  { id: "fractal-epilogue", mark: "Epilogue", name: "Fractal Connector", role: "epilogue", href: null },
];

export type ReturnTurn = { kind: "return"; station: string; title: string; body: string };
export type PortalTurn = { kind: "fire" } | { kind: "reset" } | ReturnTurn;

const LOST_NOTHING = "Nothing is lost. You are back on the floor.";

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
  if (hall.href) return { kind: "fire" };
  if (hall.id === "human-nodes") {
    return returned(
      hall.id,
      "Human Nodes stays its own hall",
      `Human Nodes stays its own hall card. It is not the Fractal Connector. This first cut does not open it as a finished hall. ${LOST_NOTHING}`,
    );
  }
  if (hall.id === "fractal-connector") {
    return returned(
      hall.id,
      "The Fractal Connector hall card",
      `This is the Fractal Connector hall card, as printed on the plate. It is not Relay 12, and it is not the epilogue door. This first cut does not open it as a finished hall. ${LOST_NOTHING}`,
    );
  }
  return returned(
    hall.id,
    `${hall.name} returns you to the floor`,
    `${hall.name} is not open as a finished hall in this first cut. Fire is the live hall, and its set is harnessed discoveries. ${LOST_NOTHING}`,
  );
}

export function turnFromDoor(id: string): PortalTurn {
  if (id === "planet") return { kind: "reset" };
  const door = DOOR_FRAME.find((stop) => stop.id === id);
  if (!door) {
    return returned("unknown", "Back on the floor", `That turn comes back to the floor. ${LOST_NOTHING}`);
  }
  if (door.href) return { kind: "fire" };
  if (door.id === "relay-12") {
    return returned(
      door.id,
      "Relay 12 is Human Nodes",
      `Relay 12 is Human Nodes. It stays its own door. It is not the Fractal Connector. This first cut does not open it as a finished hall. ${LOST_NOTHING}`,
    );
  }
  if (door.id === "fractal-epilogue") {
    return returned(
      door.id,
      "The Fractal Connector is the epilogue",
      `The Fractal Connector is the epilogue. It stays apart from Human Nodes and apart from the hall card. This first cut does not open it as a finished hall. ${LOST_NOTHING}`,
    );
  }
  return returned(
    door.id,
    `${door.name} returns you to the floor`,
    `${door.name} is a door in the fourteen-door frame, not a finished hall. ${LOST_NOTHING}`,
  );
}
