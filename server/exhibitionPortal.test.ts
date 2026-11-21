import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RELAYS } from "../shared/gameData";
import { PLATE_EPISODES } from "../shared/plateGates";
import {
  DOOR_FRAME,
  EPISODE_ONE,
  FILM_SHA256,
  FILM_SRC,
  HALL_CARDS,
  LATER_EPISODES,
  TRILOGY_EPISODES,
  PLATE_SHA256,
  PLATE_SRC,
  PORTAL_PATH,
  RECEIVED_ZERO,
  SPIRAL_HELD,
  spiralSlot,
  turnFromDoor,
  turnFromHall,
} from "../shared/exhibitionPortal";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

describe("exhibition portal first cut", () => {
  it("keeps the issued film and the plate byte for byte", () => {
    expect(sha256("client/public/portal/film-0201.mp4")).toBe(FILM_SHA256);
    expect(sha256("client/public/portal/exhibition-plan-composite.png")).toBe(PLATE_SHA256);
    expect(FILM_SHA256).toBe("cacc1ada942163efbb2bdd5a964e29524fd4557a041dc228bd85773d5c4a3d2e");
    expect(PLATE_SHA256).toBe("e9f17f7338f73c3ac89c061120de6fd7ab68b66443e5184f2de48de4d6063d91");
  });

  it("opens from the landing on its own route and leaves the older exhibition door alone", () => {
    const app = source("client/src/App.tsx");
    const home = source("client/src/pages/Home.tsx");
    expect(app).toContain('path={"/portal"}');
    expect(app).toContain("ExhibitionPortal");
    expect(app).toContain('path={"/exhibition"} component={IGOUmbrella}');
    expect(app).toContain('path={"/explore/:relayNum"}');
    expect(home).toContain(`href="${PORTAL_PATH}"`);
    expect(home).toContain('data-testid="home-exhibition-portal"');
    expect(source("client/src/components/GameModeGates.tsx")).not.toContain("harnessed discoveries");
  });

  it("climbs 0–13 once for Episode 1 and leaves the later trilogy titles unopened", () => {
    expect(SPIRAL_HELD).toBe("The spiral is 0–13 three times.");
    expect(EPISODE_ONE).toEqual({
      id: 1,
      title: "Earthbound Foundations — The Lineage",
      line: "from civilisations to civilisation",
      state: "Available",
      inThisCut: true,
    });
    expect(LATER_EPISODES).toEqual([
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
    ]);
    expect(TRILOGY_EPISODES.filter((episode) => episode.inThisCut).map((episode) => episode.id)).toEqual([1]);
    expect(JSON.stringify(LATER_EPISODES)).not.toContain("href");
    expect(JSON.stringify(TRILOGY_EPISODES)).not.toContain("planetary foundations");
    expect(JSON.stringify(TRILOGY_EPISODES)).not.toContain("grey area");
    expect(JSON.stringify(TRILOGY_EPISODES)).not.toContain("Gray");
    expect(JSON.stringify(TRILOGY_EPISODES)).not.toContain("unnamed");
    expect(JSON.stringify(TRILOGY_EPISODES)).not.toContain("Kardashev");
    const slots = HALL_CARDS.map((_, index) => spiralSlot(index));
    expect(slots).toHaveLength(13);
    expect(slots[0].y).toBeGreaterThan(slots[12].y);
    for (let index = 1; index < slots.length; index += 1) {
      expect(slots[index].y).toBeLessThan(slots[index - 1].y);
    }
    expect(PLATE_EPISODES.map((episode) => episode.name)).toEqual([
      "Relay & Remember",
      "Explore Forward",
      "Build Forward",
    ]);
  });

  it("keeps thirteen hall cards, Fire first, and the zero off the card list", () => {
    expect(HALL_CARDS).toHaveLength(13);
    expect(HALL_CARDS.map((hall) => hall.name)).toEqual([
      "Fire",
      "Tree",
      "River",
      "Horse",
      "Roads",
      "Ships",
      "Loom",
      "Rail",
      "Engine",
      "AAA Triad",
      "Orbit",
      "Human Nodes",
      "Fractal Connector",
    ]);
    expect(HALL_CARDS[0].href).toBe("/explore/1");
    expect(HALL_CARDS.slice(1).every((hall) => hall.href === null)).toBe(true);
    expect(HALL_CARDS.map((hall) => hall.id)).not.toContain("planet");
    expect(HALL_CARDS.slice(0, 12).map((hall) => hall.name)).toEqual(RELAYS.map((relay) => relay.name));
    expect(HALL_CARDS.slice(4, 8).map((hall) => `${hall.number} ${hall.name} ${hall.plate} ${hall.when}`)).toEqual([
      "5 Roads The Roman Network 300 BCE",
      "6 Ships The Ocean Relay 1500 CE",
      "7 Loom The Pattern Engine 1780 CE",
      "8 Rail The Iron Horse 1830 CE",
    ]);
  });

  it("keeps Human Nodes and the Fractal Connector as two stations, and the zero as substrate", () => {
    expect(DOOR_FRAME).toHaveLength(14);
    expect(DOOR_FRAME[0]).toMatchObject({ id: "planet", mark: "0", role: "substrate", href: null });
    expect(DOOR_FRAME.slice(1, 13).map((door) => door.name)).toEqual(RELAYS.map((relay) => relay.name));
    expect(DOOR_FRAME[12].id).toBe("relay-12");
    expect(DOOR_FRAME[12].name).toBe("Human Nodes");
    expect(DOOR_FRAME[13]).toMatchObject({ id: "fractal-epilogue", role: "epilogue", name: "Fractal Connector" });
    expect(DOOR_FRAME[12].id).not.toBe(DOOR_FRAME[13].id);
    expect(HALL_CARDS[11].id).not.toBe(HALL_CARDS[12].id);
    expect(turnFromDoor("planet").kind).toBe("reset");
    expect(turnFromDoor("relay-1").kind).toBe("fire");
    expect(turnFromHall("fire").kind).toBe("fire");
    const relayTwelve = turnFromDoor("relay-12");
    const epilogue = turnFromDoor("fractal-epilogue");
    const hallTwelve = turnFromHall("human-nodes");
    const hallCard = turnFromHall("fractal-connector");
    expect(relayTwelve.kind).toBe("return");
    expect(epilogue.kind).toBe("return");
    expect(hallTwelve.kind).toBe("return");
    expect(hallCard.kind).toBe("return");
    if (relayTwelve.kind !== "return" || epilogue.kind !== "return" || hallTwelve.kind !== "return" || hallCard.kind !== "return") {
      throw new Error("expected returns");
    }
    expect(new Set([relayTwelve.station, epilogue.station, hallTwelve.station, hallCard.station]).size).toBe(4);
    expect(relayTwelve.body).not.toBe(epilogue.body);
    expect(hallTwelve.body).not.toBe(hallCard.body);
    expect(turnFromHall("tree").kind).toBe("return");
    expect(turnFromHall("missing").kind).toBe("return");
  });

  it("plays the issued film in the portal and does not add a later episode, speech, or a fire preview", () => {
    const page = source("client/src/pages/ExhibitionPortal.tsx");
    const model = source("shared/exhibitionPortal.ts");
    expect(page).toContain("src={FILM_SRC}");
    expect(page).toContain("src={PLATE_SRC}");
    expect(FILM_SRC).toBe("/portal/film-0201.mp4");
    expect(PLATE_SRC).toBe("/portal/exhibition-plan-composite.png");
    expect(page).toContain("playsInline");
    expect(page).toContain("mobile-content-pad");
    expect(page).toContain("{RECEIVED_ZERO}");
    expect(model).toContain(RECEIVED_ZERO);
    expect(RECEIVED_ZERO).toBe(
      "The planet is the zero (0). Without it there would be no our reality or the contest. It is the substrate from which the 13 rise, in episodes 1–3, spiralling upward, a boundary-condition reset to explore.",
    );
    expect(RECEIVED_ZERO).not.toContain("gender vision");
    expect(page).not.toContain("gender vision");
    expect(model).not.toContain("gender vision");
    expect(page).toContain("harnessed discoveries");
    expect(page).toContain('href={hall.href}');
    expect(page).toContain("portal-episode-1");
    expect(page).toContain("portal-later-episodes");
    expect(page).toContain("episode.title");
    expect(page).toContain("episode.line");
    expect(page).toContain("EPISODE_ONE.title");
    expect(page).toContain("EPISODE_ONE.line");
    expect(page).not.toContain("speechSynthesis");
    expect(page).not.toContain("fire-preview");
    expect(page).not.toContain("FirePreviewPlayer");
    expect(page).not.toContain("Memorial");
    expect(page).not.toContain("Kardashev");
    expect(page).not.toContain("Gray Arena");
    expect(page).not.toContain("Explore Forward");
    expect(page).not.toContain("unnamed");
    expect(page).not.toContain("planetary foundations");
    expect(page).not.toMatch(/invention/i);
    expect(model).not.toContain("PLATE_EPISODES");
    expect(model).toContain("Stewardship & Renewal — The Cosmic Scale");
    expect(model).toContain("Reality Engines — The Grey Arena");
    expect(model).not.toContain("Kardashev");
    expect(model).not.toContain("unnamed");
    expect(page).toContain("{ZERO_IS_NOT_A_HALL}");
    expect(model).toContain("The zero is not a fourteenth hall.");
    expect(page).toContain("<PlanetOpening");
    const opening = source("client/src/components/PlanetOpening.tsx");
    expect(opening).toContain("requestAnimationFrame");
    expect(opening).toContain("portal-planet-sequence");
    expect(opening).toContain("portal-pillar-");
    expect(opening).toContain("smouldering");
    expect(opening).not.toContain("fire-preview");
    expect(opening).not.toContain("speechSynthesis");
    expect(opening).not.toContain("gender vision");
    expect(opening).not.toContain("relay-1-fire-plate");
  });
});
