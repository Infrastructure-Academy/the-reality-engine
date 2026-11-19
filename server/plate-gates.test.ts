import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GREY_MATTER_PATH, SCHOLAR_PATH, classicXpFromDiscoveries } from "../shared/playerProgress";
import { INVENTIONS } from "../shared/inventions";
import { QUEST_GA_MEASUREMENT_ID } from "../client/src/const";
import {
  PLATE_EPISODES,
  PLATE_FOUNDATION,
  PLATE_GATES,
  PLATE_SUBTITLE,
  PLATE_TITLE,
} from "../shared/plateGates";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("Home plate gates", () => {
  it("uses the plate title, subtitle, and foundation line", () => {
    expect(PLATE_TITLE).toBe("iGO — One Game. All Ages.");
    expect(PLATE_SUBTITLE).toBe("The Infrastructure Discovery Game | Ages 8–65+");
    expect(PLATE_FOUNDATION).toBe("12 Relays × 5 Webs = 60-node Dearden Field.");
    expect(PLATE_EPISODES.map((episode) => `${episode.id}:${episode.name}:${episode.ages}`)).toEqual([
      "1:Relay & Remember:8–22",
      "2:Explore Forward:22–50",
      "3:Build Forward:40–65+",
    ]);
  });

  it("lists the eleven plate gates with their age bands, and no twelfth mode", () => {
    expect(PLATE_GATES.map((gate) => `${gate.name} ${gate.ages}`)).toEqual([
      "Relay Spinner 8–10",
      "Dungeon Crawl 10–12",
      "Grey Matter 12–14",
      "Flight Deck 14–18",
      "Scholar 18–22",
      "Graduate 22–29",
      "Chartered 30+",
      "Senior Leader 40+",
      "Industry Leader 50+",
      "Champion 60+",
      "Mentor Class 65+",
    ]);
    const names = PLATE_GATES.map((gate) => gate.name);
    expect(names).not.toContain("Academic");
    expect(names).not.toContain("Industry Champion");
    expect(names).not.toContain("Master Class");
  });

  it("keeps the legacy hooks and does not invent later-mode routes", () => {
    const byId = Object.fromEntries(PLATE_GATES.map((gate) => [gate.id, gate.hook]));
    expect(byId["relay-spinner"]).toBe("Spin to discover");
    expect(byId["dungeon-crawl"]).toBe("Begin your quest");
    expect(byId["grey-matter"]).toBe("Test your brain");
    expect(byId["flight-deck"]).toBe("Take the helm");
    expect(byId["scholar"]).toBe("Shape your study");
    expect(PLATE_EPISODES.map((episode) => episode.hook)).toEqual([
      "Five live ways to play.",
      "The career doors, still ahead.",
      "Leadership, still ahead.",
    ]);
  });

  it("enters Episode 1 through the existing play routes", () => {
    const playable = PLATE_GATES.filter((gate) => gate.episode === 1);
    expect(playable.map((gate) => gate.href)).toEqual([
      "/explore/spinner",
      "/explore/dungeon",
      GREY_MATTER_PATH,
      "/flight-deck",
      SCHOLAR_PATH,
    ]);
    expect(playable.every((gate) => Boolean(gate.href))).toBe(true);
  });

  it("leaves Graduate through Mentor Class unlinked", () => {
    const later = PLATE_GATES.filter((gate) => gate.episode !== 1);
    expect(later.map((gate) => gate.name)).toEqual([
      "Graduate",
      "Chartered",
      "Senior Leader",
      "Industry Leader",
      "Champion",
      "Mentor Class",
    ]);
    expect(later.every((gate) => gate.href === null)).toBe(true);
  });

  it("renders every gate on Home, and only links a gate that has a route", () => {
    const home = source("client/src/pages/Home.tsx");
    const gates = source("client/src/components/GameModeGates.tsx");
    expect(home).toContain("<GameModeGates />");
    expect(home).not.toContain("PipelineHotspots");
    expect(gates).toContain("ComingSoonGate");
    expect(gates).toContain("episode-door-");
    expect(gates).toContain("home-progress-strip");
    expect(gates).toContain("gate.href");
    expect(gates).not.toContain("twinearth");
    expect(gates).not.toContain("Manus");
    expect(gates).not.toContain("MICE");
    expect(gates).not.toContain("Academic");
    expect(gates).not.toContain("Industry Champion");
    expect(gates).not.toContain("Master Class");
    expect(gates).not.toContain("%");
    expect(gates).not.toContain("Memorial");
    expect(gates).not.toContain("Hui");
    expect(gates).not.toContain("peer review");
    expect(gates).toContain("press-play-engage");
    expect(gates).toContain('href="/explore/spinner"');
    expect(gates).toContain("useSharedDiscoveryXp");
    expect(gates).not.toContain('0 {t("home.door.xp")}');
    expect(gates).toContain("whitespace-nowrap");
    expect(gates).not.toContain("PoC LIVE");
    expect(source("client/index.html")).toContain(QUEST_GA_MEASUREMENT_ID);
    expect(source("client/index.html")).toContain("googletagmanager.com/gtag/js?id=G-2V0JTTFM97");
    expect(QUEST_GA_MEASUREMENT_ID).toBe("G-2V0JTTFM97");
  });

  it("sums classic Explorer XP from stored discoveries and leaves an empty map at zero", () => {
    expect(classicXpFromDiscoveries({}, { 1: INVENTIONS[1].length })).toBe(0);
    const one = classicXpFromDiscoveries({ 1: [0] }, { 1: INVENTIONS[1].length });
    expect(one).toBe(Math.floor(10_000 / INVENTIONS[1].length));
    expect(one).toBeGreaterThan(0);
  });

  it("does not recut the twelve-mode list on the iGO page", () => {
    const page = source("client/src/pages/IGOUmbrella.tsx");
    expect(page).toContain('name: "Academic"');
    expect(page).toContain('name: "Industry Champion"');
    expect(page).toContain('name: "Master Class"');
    expect(page).not.toContain("Mentor Class");
  });

  it("does not put the retired host back on Share iGO, and hides a missing image", () => {
    const gallery = source("client/src/components/ShareCardGallery.tsx");
    expect(gallery).not.toContain("twinearth.world");
    expect(gallery).not.toContain("share-card-civil-truth_eafadda9.png");
    expect(gallery).toContain("onError={() => setImageReady(false)}");
    expect(gallery).toContain("{imageReady ? (");
  });
});
