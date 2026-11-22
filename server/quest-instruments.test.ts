import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INFRADEX, INFRADEX_TOTAL } from "../shared/infradexCatalogue";
import {
  QUEST_LATTICE_COUNT,
  awardCapture,
  autofillSuggestion,
  blankCaptureBook,
  capturedCount,
  cuesFromRgba,
  formatYear,
  latticeNodes,
  matchSpecies,
  relayFromCues,
  scanAsset,
  timeMachineScan,
  type ImageCue,
} from "../shared/questInstruments";

const source = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const warmPlate: ImageCue = { warm: 0.72, green: 0.05, blue: 0.04, grey: 0.19, bright: 0.62, edge: 0.22, horizontal: 0.48 };

describe("Quest InfraDex and Time Machine", () => {
  it("holds the 143 species and a 300-node field", () => {
    expect(INFRADEX).toHaveLength(INFRADEX_TOTAL);
    expect(new Set(INFRADEX.map((species) => species.id)).size).toBe(143);
    expect(latticeNodes()).toHaveLength(QUEST_LATTICE_COUNT);
    expect(QUEST_LATTICE_COUNT).toBe(300);
  });

  it("names a suspension bridge and a harbour from the typed plate", () => {
    expect(matchSpecies("suspension bridge")?.species.name).toBe("Suspension Bridge");
    expect(matchSpecies("harbour")?.species.name).toBe("Fishing Harbour");
    expect(matchSpecies("bridge")?.species.name).toBe("Bridge");
    expect(autofillSuggestion("dam")?.name).toBe("Dam");
  });

  it("returns an ISI plate for a named asset without leaving Quest", () => {
    const reading = scanAsset({ text: "Suspension bridge across the harbour" });
    expect(reading.matched).toBe(true);
    expect(reading.species?.name).toBe("Suspension Bridge");
    expect(reading.relayName).toBe("Roads");
    expect(reading.plateIndex).toBeGreaterThanOrEqual(36);
    expect(reading.plateIndex).toBeLessThanOrEqual(300);
    expect(reading.A).toBeGreaterThan(0);
    expect(reading.P).toBeGreaterThan(0);
    expect(reading.beta).toBeGreaterThan(0);
    expect(reading.signal).toBeCloseTo((reading.A * reading.P) / reading.beta, 1);
    expect(reading.explanation).toContain("out of 300");
    expect(reading.explanation).not.toMatch(/manus\.space/i);
  });

  it("reads a warm photograph toward the Fire relay without inventing a plate index", () => {
    expect(relayFromCues(warmPlate)).toBe("R01");
    const reading = scanAsset({ cues: warmPlate, photographHeld: true });
    expect(reading.source).toBe("photograph");
    expect(reading.relay).toBe("R01");
    expect(reading.matched).toBe(true);
    expect(reading.scored).toBe(false);
    expect(reading.confidence).toBeLessThan(0.6);
    expect(reading.spoken).toContain(reading.assetName);
    expect(reading.spoken).toContain("not fixed from the photograph alone");
    expect(reading.spoken).not.toContain("out of 300");
  });

  it("reads a blue harbour photograph without requiring a typed name", () => {
    const harbour: ImageCue = { warm: 0.08, green: 0.12, blue: 0.46, grey: 0.34, bright: 0.58, edge: 0.42, horizontal: 0.62 };
    const reading = scanAsset({ cues: harbour, photographHeld: true });
    expect(reading.scored).toBe(false);
    expect(reading.species).not.toBeNull();
    expect(reading.spoken.toLowerCase()).toContain("photograph reads as");
    expect(reading.spoken).not.toMatch(/amplitude/i);
  });

  it("derives colour cues from pixels", () => {
    const rgba = new Uint8ClampedArray(4 * 4);
    for (let i = 0; i < 4; i += 1) {
      rgba[i * 4] = 220;
      rgba[i * 4 + 1] = 40;
      rgba[i * 4 + 2] = 20;
      rgba[i * 4 + 3] = 255;
    }
    const cues = cuesFromRgba(rgba, 2, 2);
    expect(cues.warm).toBeGreaterThan(0.5);
  });

  it("records a new species against the 143 and a smaller award on a repeat", () => {
    const species = INFRADEX.find((item) => item.name === "Dam");
    expect(species).toBeTruthy();
    const first = awardCapture(blankCaptureBook(), species!, 2);
    expect(first.award.isNew).toBe(true);
    expect(capturedCount(first.book)).toBe(1);
    const second = awardCapture(first.book, species!, 2);
    expect(second.award.isNew).toBe(false);
    expect(second.award.xpAwarded).toBeLessThan(first.award.xpAwarded);
    expect(capturedCount(second.book)).toBe(1);
  });

  it("reads Tang China in 800 CE with Loom awake and Orbit still dark", () => {
    const reading = timeMachineScan({ civilisationEra: "Tang Dynasty, 800 CE" });
    expect("error" in reading).toBe(false);
    if ("error" in reading) return;
    expect(reading.regionId).toBe("e_asia");
    expect(reading.year).toBe(800);
    expect(formatYear(reading.year)).toBe("800 CE");
    expect(reading.civilisation).toBe("Tang Dynasty");
    expect(reading.activeRelays).toContain("R07");
    expect(reading.darkRelays).toContain("R11");
    expect(reading.darkRelays).toContain("R12");
    expect(reading.plateIndex).toBeGreaterThanOrEqual(36);
    expect(reading.present.year).toBe(2026);
    expect(reading.present.plateIndex).not.toBe(reading.plateIndex);
    expect(reading.explanation).toContain("Tang Dynasty");
  });

  it("refuses a portal reading that names neither region nor year", () => {
    const reading = timeMachineScan({ civilisationEra: "a quiet afternoon" });
    expect(reading).toEqual({ error: "Choose a region and an era, or name a civilisation and a year." });
  });

  it("puts Asset Capture on every live group door and keeps both windows on iGO", () => {
    const app = source("client/src/App.tsx");
    const gates = source("client/src/components/GameModeGates.tsx");
    const igo = source("client/src/pages/IGOUmbrella.tsx");
    expect(igo).toContain('variant="both"');
    expect(gates).toContain('variant="capture"');
    for (const door of [
      'path={"/explore"}',
      'path={"/explore/spinner"}',
      'path={"/explore/dungeon"}',
      'path={"/explore/greymatter"}',
      'path={"/explore/grey-matter"}',
      'path={"/explore/:relayNum"}',
      'path={"/flight-deck"}',
      'path={"/create"}',
      'path={"/scholar"}',
      'path={"/m/explore"}',
      'path={"/m/explore/:relayNum"}',
    ]) {
      const at = app.indexOf(door);
      expect(at).toBeGreaterThan(-1);
      expect(app.slice(at, at + 180)).toContain("CaptureDoor");
    }
    const plate = source("client/src/components/QuestInstruments.tsx");
    const speech = source("client/src/lib/plateSpeech.ts");
    expect(plate).toContain('data-testid="asset-capture-action"');
    expect(plate).toContain("visualViewport");
    expect(plate).toContain("speakPlate(next.spoken");
    expect(plate).toContain("A photograph on the plate is enough to read.");
    expect(plate).not.toContain("Point at an asset and photograph it, use a photograph you already have");
    expect(speech).toContain("synth.speak");
    expect(speech).not.toContain("manus.space");
    expect(app).not.toContain("isicalc-uwdgcubw");
    expect(app).not.toContain("isicalcexp-bqjsukv3");
    expect(source("shared/questInstruments.ts")).not.toContain("manus.space");
    expect(source("client/src/components/QuestInstruments.tsx")).not.toContain("manus.space");
  });
});
