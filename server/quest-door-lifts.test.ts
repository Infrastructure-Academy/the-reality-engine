import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { filmById, filmsForDoor, QUEST_DOOR_FILMS } from "../shared/questDoorFilms";

const source = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const SISTER_EXPLORER = "isicalcexp-bqjsukv3.manus.space";
const RETIRED_CALCULATOR = "isicalc-uwdgcubw.manus.space";
const HELD_OFF = ["FINAL-v4b-starborne", "FINAL-v4b-starwars", "FINAL-v5b-v2", "flightdeck-clip-v5", "scholar-clip-v6"];

describe("quest door lifts", () => {
  it("keeps Asset Capture and Time Machine on the iGO door, on Quest", () => {
    const igo = source("client/src/pages/IGOUmbrella.tsx");
    const en = source("client/src/i18n/en.ts");
    const bay = source("client/src/components/QuestInstruments.tsx");
    expect(igo).toContain('<QuestInstrumentBay variant="both" />');
    expect(igo).not.toContain(RETIRED_CALCULATOR);
    expect(igo).not.toContain(SISTER_EXPLORER);
    expect(igo).not.toContain('target="_blank"');
    expect(en).toContain('"igo.assetCapture": "Asset Capture"');
    expect(en).toContain('"igo.infraDexScan": "InfraDex Scan"');
    expect(en).toContain('"igo.timeMachine": "Time Machine"');
    expect(en).toContain('"igo.historicalPortal": "Historical Portal"');
    expect(en).toContain('"igo.enterEra": "Enter era"');
    expect(bay).toContain('door="asset-capture"');
    expect(bay).toContain('door="time-machine"');
    expect(bay).toContain("data-door={door}");
    expect(bay).toContain("Analyse this era on the Collidoscope");
    expect(bay).toContain("300-node lattice");
    expect(bay).not.toContain(RETIRED_CALCULATOR);
    expect(bay).not.toContain(SISTER_EXPLORER);
    expect(bay).not.toContain("cse-reality");
    expect(igo.indexOf("QuestInstrumentBay")).toBeLessThan(igo.indexOf("SECTION 2"));
  });

  it("plays Flight's own films on the Flight door, before craft selection", () => {
    const flight = source("client/src/pages/FlightDeck.tsx");
    expect(flight).toContain('door="flight"');
    expect(filmById("v4a").src).toContain("FINAL-v4a-v2_4d1e0f2d.mp4");
    const gateStart = flight.indexOf("if (!isAuthenticated)");
    const craftStart = flight.indexOf("CRAFT SELECTION PHASE");
    expect(gateStart).toBeGreaterThan(-1);
    expect(craftStart).toBeGreaterThan(gateStart);
    const gate = flight.slice(gateStart, craftStart);
    expect(gate).toContain("<DoorFilmBay");
    expect(gate.indexOf("<DoorFilmBay")).toBeLessThan(gate.indexOf('t("flight.signIn")'));
    expect(gate).not.toContain("handleSelectCraft");
    const craft = flight.slice(craftStart);
    expect(craft).toContain("<DoorFilmBay");
    expect(craft).toContain("handleSelectCraft");
    for (const held of HELD_OFF) expect(flight).not.toContain(held);
    expect(flight).not.toContain(SISTER_EXPLORER);
  });

  it("plays Scholar's own films on the Scholar door, before the thesis", () => {
    const scholar = source("client/src/pages/ScholarCreate.tsx");
    expect(scholar).toContain('door="scholar"');
    expect(filmById("v5a").src).toContain("FINAL-v5a-v2_a35db770.mp4");
    const gateStart = scholar.indexOf("if (!isAuthenticated)");
    const signedInStart = scholar.indexOf("scholar.phase.thesis");
    expect(gateStart).toBeGreaterThan(-1);
    expect(signedInStart).toBeGreaterThan(gateStart);
    const gate = scholar.slice(gateStart, signedInStart);
    expect(gate).toContain("<DoorFilmBay");
    expect(gate.indexOf("<DoorFilmBay")).toBeLessThan(gate.indexOf('t("scholar.signIn")'));
    expect(gate).not.toContain("thesisTitle");
    const signedIn = scholar.slice(signedInStart);
    expect(signedIn).toContain("<DoorFilmBay");
    expect(signedIn).toContain("thesisTitle");
    for (const held of HELD_OFF) expect(scholar).not.toContain(held);
    expect(scholar).not.toContain(SISTER_EXPLORER);
  });

  it("keeps the fifteen-film map split by door and leaves the unrematched Flight cuts off", () => {
    expect(filmsForDoor("explore")).toHaveLength(5);
    expect(filmsForDoor("flight")).toHaveLength(3);
    expect(filmsForDoor("scholar")).toHaveLength(5);
    expect(QUEST_DOOR_FILMS).toHaveLength(13);
    expect(filmById("v4a").sha256).toBe("898584e9dd2617f1f197c5d3caf7560b98e8d15f2e6a96b30df5cca238b816f9");
    expect(filmById("film-0008").role).toBe("watch");
    expect(filmById("film-0008").door).toBe("scholar");
    const joined = QUEST_DOOR_FILMS.map((film) => film.src).join("\n");
    for (const held of HELD_OFF) expect(joined).not.toContain(held);
    expect(joined).not.toContain("b909a4c9418f39fa179f98364382759c7d764a45545ee15f49c32d66d72c02bc");
    expect(joined).not.toContain("b673d1475b1af0052d273eaa81f19aa3639e152c88066421a15c9b18299e410a");
    const home = source("client/src/pages/Home.tsx");
    const explore = source("client/src/pages/ExplorerSelect.tsx");
    expect(home).not.toContain("VideoGallery");
    expect(home).not.toContain("FINAL-v4b");
    expect(home).not.toContain("FINAL-v5b");
    expect(explore).toContain('door="explore"');
    expect(source("client/src/pages/RelaySpinner.tsx")).toContain('mode="spinner"');
    expect(source("client/src/pages/DungeonCrawl.tsx")).toContain('mode="dungeon"');
    expect(source("client/src/pages/GreyMatter.tsx")).toContain('mode="grey"');
    const bay = source("client/src/components/DoorFilmBay.tsx");
    expect(bay).toContain("EXHIBITION_PLATE_TYPE");
    expect(source("client/src/components/ExplorerVideo.tsx")).toContain('fontSize: "20pt"');
    expect(bay).toContain("playsInline");
    expect(bay).toContain("beginDoorFilmFromGesture");
    expect(source("client/src/components/DoorFilmHost.tsx")).toContain("loop");
    const david = source("client/src/hooks/useDavidVoice.ts");
    expect(david).toContain('utterance.lang = "en-GB"');
    expect(david).not.toContain("voices[0]");
    expect(source("client/src/pages/ExhibitionPortal.tsx")).not.toContain("Rematched draft");
    expect(source("client/src/components/ExhibitionClip.tsx")).not.toContain("clip.note");
    expect(source("client/index.html")).toContain('lang="en"');
  });
});