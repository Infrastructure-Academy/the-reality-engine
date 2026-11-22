import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const ASSET_CAPTURE_URL = "https://isicalc-uwdgcubw.manus.space";
const SISTER_EXPLORER = "isicalcexp-bqjsukv3.manus.space";
const FLIGHT_CLIP = "flightdeck-clip-v5_b45064f9.mp4";
const SCHOLAR_CLIP = "scholar-clip-v6_adca97d1.mp4";

describe("quest door lifts", () => {
  it("puts a visible Asset Capture control on the iGO door", () => {
    const igo = source("client/src/pages/IGOUmbrella.tsx");
    const en = source("client/src/i18n/en.ts");
    expect(igo).toContain(`const ASSET_CAPTURE_URL = "${ASSET_CAPTURE_URL}"`);
    expect(igo).toContain("href={ASSET_CAPTURE_URL}");
    expect(igo).toContain('target="_blank"');
    expect(igo).toContain('rel="noopener noreferrer"');
    expect(igo).toContain('data-door="asset-capture"');
    expect(igo).toContain("igo.assetCapture");
    expect(igo).toContain("igo.infraDexScan");
    expect(en).toContain('"igo.assetCapture": "Asset Capture"');
    expect(en).toContain('"igo.infraDexScan": "InfraDex Scan"');
    expect(igo.indexOf('data-door="asset-capture"')).toBeLessThan(igo.indexOf("SECTION 2"));
    expect(igo).not.toContain(SISTER_EXPLORER);
    expect(igo).not.toContain("300-NODE");
    expect(igo).not.toContain("300-node");
  });

  it("plays the existing Flight intro on the unauthenticated gate, before craft selection", () => {
    const flight = source("client/src/pages/FlightDeck.tsx");
    expect(flight).toContain(FLIGHT_CLIP);
    const gateStart = flight.indexOf("if (!isAuthenticated)");
    const craftStart = flight.indexOf("CRAFT SELECTION PHASE");
    expect(gateStart).toBeGreaterThan(-1);
    expect(craftStart).toBeGreaterThan(gateStart);
    const gate = flight.slice(gateStart, craftStart);
    expect(gate).toContain("<ExplorerVideo");
    expect(gate).toContain("ensurePlayback");
    expect(gate).toContain("FLIGHT_INTRO_CLIP");
    expect(gate.indexOf("<ExplorerVideo")).toBeLessThan(gate.indexOf('t("flight.signIn")'));
    expect(gate).not.toContain("handleSelectCraft");
    const craft = flight.slice(craftStart);
    expect(craft).toContain("FLIGHT_INTRO_CLIP");
    expect(craft).toContain("handleSelectCraft");
    expect(flight).not.toContain(SISTER_EXPLORER);
  });

  it("plays the existing Scholar intro on the unauthenticated gate, before the thesis", () => {
    const scholar = source("client/src/pages/ScholarCreate.tsx");
    expect(scholar).toContain(SCHOLAR_CLIP);
    const gateStart = scholar.indexOf("if (!isAuthenticated)");
    const signedInStart = scholar.indexOf("scholar.phase.thesis");
    expect(gateStart).toBeGreaterThan(-1);
    expect(signedInStart).toBeGreaterThan(gateStart);
    const gate = scholar.slice(gateStart, signedInStart);
    expect(gate).toContain("<ExplorerVideo");
    expect(gate).toContain("ensurePlayback");
    expect(gate).toContain("SCHOLAR_INTRO_CLIP");
    expect(gate.indexOf("<ExplorerVideo")).toBeLessThan(gate.indexOf('t("scholar.signIn")'));
    expect(gate).not.toContain("thesisTitle");
    const signedIn = scholar.slice(signedInStart);
    expect(signedIn).toContain("SCHOLAR_INTRO_CLIP");
    expect(signedIn).toContain("thesisTitle");
    expect(scholar).not.toContain(SISTER_EXPLORER);
  });
});
