import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RELAYS } from "../shared/gameData";
import { PLATE_EPISODES } from "../shared/plateGates";
import {
  DOOR_FRAME,
  EPISODE_ONE,
  FILM_SHA256,
  FILM_SRC,
  TEASER_BYTES,
  TEASER_SHA256,
  TEASER_SRC,
  HALL_CARDS,
  LATER_EPISODES,
  TRILOGY_EPISODES,
  PLATE_SHA256,
  PLATE_SRC,
  PORTAL_PATH,
  RECEIVED_ZERO,
  SPIRAL_HELD,
  TREE_HALL_PATH,
  V6_CLIPS,
  V6_FILM_CLIPS,
  V6_FIRE,
  V6_INTRO,
  V6_TREE,
  spiralSlot,
  turnFromDoor,
  turnFromHall,
  v6ClipSrc,
  v6HallClip,
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
    expect(HALL_CARDS[1]).toMatchObject({ id: "tree", name: "Tree", plate: "The Living Structure", href: TREE_HALL_PATH });
    expect(TREE_HALL_PATH).toBe("/explore/2");
    expect(HALL_CARDS.slice(2, 12).map((hall) => hall.href)).toEqual([
      "/explore/3",
      "/explore/4",
      "/explore/5",
      "/explore/6",
      "/explore/7",
      "/explore/8",
      "/explore/9",
      "/explore/10",
      "/explore/11",
      "/explore/12",
    ]);
    expect(HALL_CARDS[12].href).toBe("/portal/close");
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
    expect(turnFromDoor("relay-1")).toEqual({ kind: "hall", path: "/explore/1" });
    expect(turnFromDoor("relay-2")).toEqual({ kind: "hall", path: "/explore/2" });
    expect(turnFromDoor("relay-3")).toEqual({ kind: "hall", path: "/explore/3" });
    expect(turnFromHall("fire")).toEqual({ kind: "hall", path: "/explore/1" });
    expect(turnFromHall("tree")).toEqual({ kind: "hall", path: "/explore/2" });
    expect(turnFromHall("river")).toEqual({ kind: "hall", path: "/explore/3" });
    expect(turnFromDoor("relay-12")).toEqual({ kind: "hall", path: "/explore/12" });
    expect(turnFromHall("human-nodes")).toEqual({ kind: "hall", path: "/explore/12" });
    expect(turnFromDoor("fractal-epilogue")).toEqual({ kind: "hall", path: "/portal/close" });
    expect(turnFromHall("fractal-connector")).toEqual({ kind: "hall", path: "/portal/close" });
    expect(turnFromHall("human-nodes")).not.toEqual(turnFromHall("fractal-connector"));
    expect(turnFromHall("missing").kind).toBe("return");
    expect(HALL_CARDS[11].name).toBe("Human Nodes");
    expect(HALL_CARDS[11].plate).toBe("Programmable Humans");
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
    expect(page).toContain("Open the live Tree hall.");
    expect(page).toContain("The twelve halls open.");
    expect(page).toContain("navigate(turn.path)");
    expect(page).toContain("hall.href === FIRE_HALL_PATH");
    expect(page).not.toContain("first draft, not issued");
    expect(page).not.toContain("Substrate, not a hall");
    expect(model).not.toContain("first draft");
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
    expect(opening).toContain("hall.href === FIRE_HALL_PATH");
    expect(opening).toContain("requestAnimationFrame");
    expect(opening).toContain("portal-planet-sequence");
    expect(opening).toContain("portal-pillar-");
    expect(opening).toContain("smouldering");
    expect(opening).toContain("src={TEASER_SRC}");
    expect(source("shared/exhibitionPortal.ts")).toContain(`export const TEASER_SRC = "${TEASER_SRC}"`);
    expect(opening).toContain("autoPlay");
    expect(opening).toContain("loop");
    expect(opening).toContain("playsInline");
    expect(opening).toContain("pointerdown");
    expect(opening).toContain("portal-entrance-teaser");
    expect(opening).toContain("The whole exhibition");
    expect(opening).toContain("Halls 1 to 12, connected");
    expect(opening).toContain("not a thirteenth hall beside them");
    expect(opening).not.toContain("13_close.mp4");
    expect(opening).not.toContain("twelve pillars");
    expect(TEASER_SRC).not.toContain("13_close");
    expect(opening).not.toContain("entrance-portal.jpg");
    expect(opening).not.toContain("portal-entrance-still");
    expect(opening).not.toContain("0d17d284ba4cb711");
    expect(opening).not.toContain("1032bf4ca81672d3");
    expect(opening).not.toContain("6b35989234b76400");
    expect(opening).not.toContain("releases/download");
    expect(TEASER_SHA256).toBe("79d75df9932a4e122146792456a28777ae19deb753896fbd646e074cc5a2d8c0");
    expect(TEASER_BYTES).toBe(27950258);
    for (const root of ["client/public", "docs"]) {
      const path = `${root}${TEASER_SRC}`;
      const file = new URL(`../${path}`, import.meta.url);
      if (!existsSync(file)) continue;
      expect(sha256(path)).toBe(TEASER_SHA256);
      expect(statSync(file).size).toBe(TEASER_BYTES);
    }
    expect(opening).not.toContain("drawPlanet");
    expect(opening).not.toContain("quadraticCurveTo");
    expect(opening).not.toContain('beat === "pillars" && !done');
    expect(opening).not.toContain("Substrate, not a hall");
    expect(page).not.toContain("Substrate, not a hall");
    expect(opening).not.toContain("fire-preview");
    expect(opening).not.toContain("speechSynthesis");
    expect(opening).not.toContain("gender vision");
    expect(opening).not.toContain("relay-1-fire-plate");
  });

  it("plays the V6 hall clips same-origin and leaves FILM-0201 untouched", () => {
    expect(V6_CLIPS).toHaveLength(13);
    expect(new Set(V6_CLIPS.map((clip) => clip.file)).size).toBe(13);
    for (const clip of V6_CLIPS) {
      const src = v6ClipSrc(clip.file);
      expect(src).toBe(`/portal/v6-exhibition/${clip.file}`);
      expect(src).not.toContain("http");
      expect(src).not.toContain("github");
      for (const root of ["client/public", "docs"]) {
        const path = `${root}/portal/v6-exhibition/${clip.file}`;
        expect(sha256(path)).toBe(clip.sha256);
        expect(statSync(new URL(`../${path}`, import.meta.url)).size).toBe(clip.bytes);
      }
    }
    expect(sha256("client/public/portal/film-0201.mp4")).toBe(FILM_SHA256);
    expect(sha256("docs/portal/film-0201.mp4")).toBe(FILM_SHA256);
    expect(V6_INTRO).toMatchObject({ file: "00_intro.mp4", label: "iAAi Exhibition approach", place: { kind: "portal-floor" } });
    expect(V6_FIRE).toMatchObject({ file: "01_fire.mp4", label: "Fire", place: { kind: "explore", hall: "fire" } });
    expect(V6_TREE).toMatchObject({ file: "02_tree.mp4", label: "Tree", place: { kind: "explore", hall: "tree" } });
    expect(v6HallClip("river")?.file).toBe("03_river.mp4");
    expect(v6HallClip("roads")).toMatchObject({ file: "06_road.mp4", label: "RELAY 6: ROAD - 2000 BC" });
    expect(v6HallClip("rail")?.file).toBe("08_rail_steam.mp4");
    expect(v6HallClip("human-nodes")).toMatchObject({ label: "RELAY 12 PROGRAMMABLE HUMANS - NOW" });
    expect(v6HallClip("aaa-triad")).toBe(v6HallClip("orbit"));
    expect(v6HallClip("aaa-triad")?.file).toBe("10_11_modern_orbit.mp4");
    expect(v6HallClip("aaa-triad")?.label).toBe("RELAY 10-11");
    expect(v6HallClip("fractal-connector")).toMatchObject({ file: "13_close.mp4", label: "Episode 1 Complete / N+T=D" });
    expect(v6HallClip("fire")).toBeNull();
    expect(v6HallClip("tree")).toBeNull();
    for (const id of ["horse", "ships", "loom", "engine"]) {
      expect(v6HallClip(id)).toBeNull();
    }
    expect(V6_FILM_CLIPS.map((clip) => clip.file)).toEqual([
      "04_stone_wheel.mp4",
      "05_forge.mp4",
      "07_gunpowder.mp4",
      "09_steel.mp4",
    ]);
    expect(V6_FILM_CLIPS.map((clip) => clip.label)).toEqual([
      "Stone and wheel (provisional)",
      "Forge (provisional)",
      "RELAY 7: GUNPOWDER - 1605",
      "RELAY 9: 9: STEEL \u2013 1869",
    ]);
    expect(HALL_CARDS.find((hall) => hall.id === "roads")).toMatchObject({ number: 5, name: "Roads", href: "/explore/5" });
    expect(HALL_CARDS.find((hall) => hall.id === "engine")).toMatchObject({ number: 9, name: "Engine", href: "/explore/9" });

    const page = source("client/src/pages/ExhibitionPortal.tsx");
    const player = source("client/src/components/ExhibitionClip.tsx");
    const video = source("client/src/components/ExplorerVideo.tsx");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const close = source("client/src/pages/ExhibitionClose.tsx");
    const app = source("client/src/App.tsx");
    expect(page).toContain("portal-v6-intro");
    expect(page).toContain("portal-v6-floor");
    expect(page).toContain("portal-v6-films");
    expect(page).not.toContain("v6HallClip(hall.id)");
    expect(relay).toContain("IssuedHallPlate");
    expect(relay).toContain("v6HallClip(hall.id)");
    expect(relay).toContain("This hall is walked from the issued plate.");
    expect(relay).not.toContain("09_steel.mp4");
    expect(relay).not.toContain("07_gunpowder.mp4");
    expect(close).toContain("portal-close-film");
    expect(close).toContain('clip.id === "13_close"');
    expect(app).toContain('path={"/portal/close"}');
    expect(page).toContain("src={FILM_SRC}");
    expect(page).not.toContain("releases/download");
    expect(page).not.toContain("github.com");
    expect(player).toContain("ensurePlayback");
    expect(player).toContain("v6ClipSrc(clip.file)");
    expect(player).not.toContain("http");
    expect(video).toContain('fontSize: "20pt"');
    expect(video).toContain("playsInline");
    expect(video).toContain("Watch Intro");
    const fireStage = relay.slice(relay.indexOf('data-testid="fire-stage"'), relay.indexOf('data-testid="tree-stage"'));
    const treeStart = relay.indexOf('data-testid="tree-stage"');
    const treeStage = relay.slice(treeStart, relay.indexOf(") : (", treeStart));
    expect(fireStage.indexOf("<StoryPlayBar")).toBeLessThan(fireStage.indexOf("explore-v6-fire"));
    expect(fireStage.indexOf("<DiscoveryGrid")).toBeLessThan(fireStage.indexOf("explore-v6-fire"));
    expect(fireStage.indexOf("<TectonFireLearnMore")).toBeLessThan(fireStage.indexOf("explore-v6-fire"));
    expect(fireStage).toContain("pauseFireBed()");
    expect(treeStage.indexOf("<TectonTreesLearnMore")).toBeLessThan(treeStage.indexOf("explore-v6-tree"));
    expect(treeStage).not.toContain("explore-v6-fire");
    expect(treeStage).not.toContain("pauseFireBed");
    expect(treeStage).not.toContain("<audio");
  });
});
