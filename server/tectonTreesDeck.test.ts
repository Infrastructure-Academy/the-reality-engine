import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INVENTIONS } from "@shared/inventions";
import { HALL_CARDS, relayNavigatorHref, stepFromRelay, turnFromHall, unfinishedRelayFloor } from "@shared/exhibitionPortal";
import { FIRE_STORY_AUDIO_URL, storyAudioUrl } from "@/lib/storyAudio";
import {
  TECTON_TREES_DECK,
  TREE_CHAMBER_SRC,
  tectonTreeSrc,
} from "@shared/tectonTreesDeck";
import {
  COFFEE_TRADE_FACE_AS_PRINTED,
  COFFEE_WOKE_FACE_AS_PRINTED,
  NORSE_ASH_FACE_AS_PRINTED,
  NORSE_ASH_PLATE_SHA256,
  TREE_GRID_PROTOCOL,
  treeProtocolFor,
} from "@shared/tectonTreesProtocol";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const fileHash = (file: string) =>
  createHash("sha256").update(readFileSync(new URL(`../client/public/tecton-trees/${file}`, import.meta.url))).digest("hex");

const LIVE_NINE = [
  "Longhouse",
  "Palisade",
  "Dugout Canoe",
  "Wooden Plough",
  "Timber Frame",
  "Charcoal Kiln",
  "Mast",
  "Barrel",
  "Cork Harvest",
];

describe("Tecton Trees Deck learn-more", () => {
  it("leaves the live nine names and the Tree hall card alone", () => {
    expect(INVENTIONS[2].map((card) => card.name)).toEqual(LIVE_NINE);
    expect(HALL_CARDS[1]).toMatchObject({ id: "tree", name: "Tree", plate: "The Living Structure", href: "/explore/2" });
    expect(HALL_CARDS[0].href).toBe("/explore/1");
  });

  it("lists the unique trees in deck order, with the printed plate numbers", () => {
    expect(TECTON_TREES_DECK).toHaveLength(47);
    expect(TECTON_TREES_DECK.map((card) => card.order)).toEqual(Array.from({ length: 47 }, (_, index) => index + 1));
    expect(TECTON_TREES_DECK[0]).toMatchObject({ number: 2, name: "Norse Ash", category: "Sacred" });
    expect(TECTON_TREES_DECK[0].note).toContain("Yggdrasil");
    expect(JSON.stringify(TECTON_TREES_DECK[0])).not.toMatch(/\b(225|237)\b/);
    expect(TECTON_TREES_DECK[23]).toMatchObject({ number: 25, name: "Coffee", category: "Trade", file: "24-coffee.webp" });
    expect(TECTON_TREES_DECK[23].note).toContain("penny universities");
    expect(TECTON_TREES_DECK[33]).toMatchObject({ number: 35, name: "Coffee", category: "Special", file: "34-coffee-woke.webp" });
    expect(TECTON_TREES_DECK[33].note).toContain("Enlightenment");
    expect(fileHash("24-coffee.webp")).not.toBe(fileHash("34-coffee-woke.webp"));
    const tule = TECTON_TREES_DECK.filter((card) => card.name === "Árbol del Tule");
    expect(tule).toEqual([
      expect.objectContaining({ number: 40, category: "Brehon", file: "39-arbol-del-tule.webp" }),
    ]);
    expect(TECTON_TREES_DECK.map((card) => card.file)).not.toContain("46-arbol-del-tule-repeat.webp");
    expect(existsSync(new URL("../client/public/tecton-trees/46-arbol-del-tule-repeat.webp", import.meta.url))).toBe(false);
    expect(new Set(TECTON_TREES_DECK.map((card) => fileHash(card.file))).size).toBe(TECTON_TREES_DECK.length);
    expect(TECTON_TREES_DECK.find((card) => card.name === "Lebanese Cedar")).toMatchObject({ number: 23, file: "25-lebanese-cedar.webp" });
    expect(TECTON_TREES_DECK.find((card) => card.name === "Mulberry")).toMatchObject({ number: 22, file: "21-mulberry.webp" });
    expect(TECTON_TREES_DECK[45]).toMatchObject({ number: 41, name: "Monkey Puzzle", file: "47-monkey-puzzle.webp" });
    expect(TECTON_TREES_DECK[46]).toMatchObject({ number: 42, name: "Sugar Maple", category: "Ancient", file: "48-sugar-maple.webp" });
    expect(new Set(TECTON_TREES_DECK.map((card) => card.category))).toEqual(
      new Set(["Sacred", "Medicine", "Trade", "Structural", "Special", "Sustainable", "Ancient", "Brehon"]),
    );
    expect(TECTON_TREES_DECK.every((card) => card.latin.length > 0 && card.note.length > 40)).toBe(true);
  });

  it("shows the trees under the unamended hall and does not invent speech or borrow the Fire door", () => {
    const page = source("client/src/components/TectonTreesLearnMore.tsx");
    const canopy = source("client/src/components/TreeCanopy.tsx");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const fireStage = relay.slice(relay.indexOf('data-testid="fire-stage"'), relay.indexOf('data-testid="tree-stage"'));
    const treeStage = relay.slice(relay.indexOf('data-testid="tree-stage"'));
    expect(fireStage).toContain("<TectonFireLearnMore");
    expect(fireStage).not.toContain("TectonTreesLearnMore");
    expect(fireStage).not.toContain("TreeCanopy");
    expect(treeStage.indexOf("<LayoutClassic")).toBeLessThan(treeStage.indexOf("<TectonTreesLearnMore"));
    expect(treeStage).toContain("<TreeCanopy");
    expect(treeStage).not.toContain("livingFire");
    expect(treeStage).not.toContain("useFireDoor");
    expect(treeStage).not.toContain("relay-1-fire");
    expect(page).not.toContain("speechSynthesis");
    expect(page).not.toContain("gender vision");
    expect(page).not.toContain("first draft");
    expect(page).not.toContain("Substrate");
    expect(page).not.toContain("fire-ambience");
    expect(page).not.toContain("Hear the recorded");
    expect(page).toContain("tecton-trees-learn-more");
    expect(page).toContain("This tree has no separate recording.");
    expect(page).toContain("The nine discoveries above are unchanged.");
    expect(page).toContain("Forty-seven trees, in deck order.");
    expect(page).not.toContain("Forty-eight");
    expect(page).toContain("src={tectonTreeSrc(card.order)}");
    expect(page).not.toContain("IntersectionObserver");
    expect(page).not.toContain('loading="lazy"');
    expect(page).not.toContain("first draft, not issued");
    expect(page).not.toContain("Substrate, not a hall");
    expect(TREE_CHAMBER_SRC).toBe("/exhibition/relay-2-tree-chamber.webp");
    expect(canopy).toContain("TREE_CHAMBER_SRC");
    expect(canopy).not.toContain("flicker");
    expect(canopy.toLowerCase()).not.toContain("fire");
    expect(canopy).toContain('fetchPriority="high"');
    const css = source("client/src/index.css");
    expect(css).toContain("treeCanopyBreath 7.5s");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).not.toContain("treeCanopyBreath 0.68s");
  });

  it("keeps web-sized plates for every tree and the chamber", () => {
    let total = 0;
    for (const card of TECTON_TREES_DECK) {
      const path = new URL(`../client/public/tecton-trees/${card.file}`, import.meta.url);
      expect(existsSync(path), card.file).toBe(true);
      const bytes = statSync(path).size;
      expect(bytes).toBeGreaterThan(8_000);
      expect(bytes).toBeLessThan(120_000);
      total += bytes;
      expect(tectonTreeSrc(card.order)).toBe(`/tecton-trees/${card.file}`);
    }
    expect(total).toBeLessThan(4_000_000);
    const chamber = new URL(`../client/public${TREE_CHAMBER_SRC}`, import.meta.url);
    expect(existsSync(chamber)).toBe(true);
    expect(statSync(chamber).size).toBeLessThan(250_000);
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const treeStart = relay.indexOf('data-testid="tree-stage"');
    const treeStage = relay.slice(treeStart, relay.indexOf(") : (", treeStart));
    const copy = [
      TECTON_TREES_DECK.map((card) => card.note).join("\n"),
      source("client/src/components/TectonTreesLearnMore.tsx"),
      source("client/src/components/TreeCanopy.tsx"),
      treeStage,
    ].join("\n");
    expect(copy).not.toMatch(/\b(civilization|color|fiber|liter|fueled|favorite)\b/i);
    expect(copy).toContain("civilisation");
    expect(copy).toContain("22°C");
  });

  it("keeps Fire's briefing and plays the recorded Tree story without a browser voice", () => {
    expect(FIRE_STORY_AUDIO_URL).toBe("/audio/fire-cards/volume-1-briefing.mp3");
    expect(storyAudioUrl(1, "en")).toBe("/audio/fire-cards/volume-1-briefing.mp3");
    expect(storyAudioUrl(1, "zh-HK")).toBeNull();
    expect(storyAudioUrl(2, "en")).toBe("/audio/hall-stories/02_the-living-machine.mp3");
    expect(storyAudioUrl(2, "zh-HK")).toBeNull();
    const story = source("client/src/lib/storyAudio.ts");
    expect(story).not.toContain("relay-1-fire-en.mp3");
    expect(existsSync(new URL("../client/public/audio/relay-1-fire-en.mp3", import.meta.url))).toBe(true);
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const fireStage = relay.slice(relay.indexOf('data-testid="fire-stage"'), relay.indexOf('data-testid="tree-stage"'));
    const treeStart = relay.indexOf('data-testid="tree-stage"');
    const treeStage = relay.slice(treeStart, relay.indexOf(") : (", treeStart));
    expect(fireStage).toContain("<StoryPlayBar");
    expect(fireStage).toContain("storyAudioUrl(relayMeta.number, storyLocale)");
    expect(fireStage).not.toContain("storyBed=\"hall\"");
    expect(treeStage).toContain("{hallStoryBar}");
    expect(treeStage).not.toContain("fire-ambience");
    expect(treeStage).not.toContain("speechSynthesis");
    expect(relay).not.toContain("narrateDiscovery");
    expect(relay).toContain("narrate={false}");
    expect(relay).toContain("speak={false}");
    expect(relay).not.toContain("/portal?station=tree");
    expect(relay).not.toContain("relay-1-fire-en.mp3");
  });

  it("steps through the twelve halls and does not bounce a direct address back to the floor", () => {
    expect(stepFromRelay(1, "back")).toBeNull();
    expect(stepFromRelay(1, "forward")).toBe("/explore/2");
    expect(stepFromRelay(2, "back")).toBe("/explore/1");
    expect(stepFromRelay(2, "forward")).toBe("/explore/3");
    expect(stepFromRelay(12, "forward")).toBeNull();
    expect(relayNavigatorHref(2, 1)).toBe("/explore/1");
    expect(relayNavigatorHref(2, 2)).toBe("/explore/2");
    expect(relayNavigatorHref(2, 3)).toBe("/explore/3");
    expect(relayNavigatorHref(1, 3)).toBe("/explore/3");
    expect(unfinishedRelayFloor(1)).toBeNull();
    expect(unfinishedRelayFloor(2)).toBeNull();
    for (let number = 3; number <= 12; number += 1) {
      expect(relayNavigatorHref(1, number)).toBe(`/explore/${number}`);
      expect(relayNavigatorHref(2, number)).toBe(`/explore/${number}`);
      expect(unfinishedRelayFloor(number)).toBeNull();
      expect(turnFromHall(HALL_CARDS[number - 1].id)).toEqual({ kind: "hall", path: `/explore/${number}` });
    }
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain("relayNavigatorHref(currentRelay, r.number)");
    expect(relay).not.toContain("href={`/explore/${r.number}`}");
    expect(relay).toContain("const floor = unfinishedRelayFloor(relayNum)");
    expect(relay).toContain("else if (floor)");
    expect(relay).toContain("navigate(floor, { replace: true })");
    expect(relay).toContain("if (!relayValid || floor) return null");
    const fireOnly = relay.slice(relay.indexOf('data-testid="fire-stage"'), relay.indexOf('data-testid="tree-stage"'));
    expect(fireOnly).not.toContain("relay-navigator");
    expect(fireOnly).not.toContain("RelayNavigator");
    expect(relay).toContain("stepFromRelay(relayNum, \"back\")");
    expect(relay).toContain("stepFromRelay(relayNum, \"forward\")");
    expect(relay).toContain('data-testid="relay-prev"');
    expect(relay).toContain('data-testid="relay-next"');
    expect(relay).toContain('event.key === "ArrowLeft"');
    expect(relay).toContain('event.key === "ArrowRight"');
    expect(relay).toContain("if (forwardTo)");
    expect(source("client/src/components/TectonTreesLearnMore.tsx")).toContain('event.key === "Escape"');
    expect(relay).toContain('href="/"');
    expect(relay).toContain("endLabel={treeDoor ? \"Continue in the Tree hall\" : undefined}");
  });

  it("shows the v1.1 grid as protocol and keeps the printed faces on record", () => {
    expect(TREE_GRID_PROTOCOL).toHaveLength(51);
    expect(TREE_GRID_PROTOCOL[0]).toMatchObject({ name: "Norse Ash", srv: 80, trd: 52, soc: 85, cog: 90, isi: 225 });
    expect(NORSE_ASH_FACE_AS_PRINTED).toMatchObject({ srv: 75, trd: 65, soc: 82, cog: 92, isi: 237 });
    expect(fileHash("01-norse-ash.webp")).toBe(NORSE_ASH_PLATE_SHA256);
    expect(treeProtocolFor(TECTON_TREES_DECK[0])?.isi).toBe(225);
    expect(COFFEE_TRADE_FACE_AS_PRINTED.isi).toBe(215);
    expect(treeProtocolFor({ name: "Coffee", file: "24-coffee.webp" })).toMatchObject({ isi: 215, trd: 85 });
    expect(COFFEE_WOKE_FACE_AS_PRINTED.isi).toBe(235);
    expect(treeProtocolFor({ name: "Coffee", file: "34-coffee-woke.webp" })).toBeNull();
    expect(treeProtocolFor({ name: "Sessile Oak", file: "40-sessile-oak.webp" })).toBeNull();
    expect(TREE_GRID_PROTOCOL.find((row) => row.name === "Irish Oak")?.isi).toBe(230);
    expect(treeProtocolFor({ name: "Árbol del Tule", file: "39-arbol-del-tule.webp" })?.isi).toBe(208);
    expect(treeProtocolFor({ name: "Socotra Dragon Tree", file: "44-socotra-dragon-tree.webp" })?.name).toBe("Socotra Dragon");
    const page = source("client/src/components/TectonTreesLearnMore.tsx");
    expect(page).toContain("protocolLine(protocol)");
    expect(page).toContain('data-testid={`tree-protocol-${pad(card.order)}`}');
    const app = source("client/src/App.tsx");
    expect(app).toContain('location === "/explore/1" || location.startsWith("/portal")');
    expect(app).toContain("if (!carryFireAudio) return null");
    const tabs = source("client/src/components/BottomTabBar.tsx");
    expect(tabs).toContain('location === "/explore/1" || location === "/explore/2"');
    expect(tabs).toContain("if (!isMobile) return null");
    expect(page).toContain("history.pushState({ treePlate: opened }");
    expect(page).not.toContain("history.back");
    expect(source("client/src/App.tsx")).toContain('import IGOUmbrella from "./pages/IGOUmbrella"');
    expect(source("client/src/App.tsx")).not.toContain('lazy(() => import("./pages/IGOUmbrella"))');
    expect(source("client/src/pages/Leaderboard.tsx")).toContain("boardWaited");
    expect(source("client/src/pages/Leaderboard.tsx")).toContain("retry: false");
    expect(source("client/src/components/NetworkBar.tsx")).toContain("https://xchangeapp-adbvx9fr.manus.space");
    expect(source("client/src/components/NetworkBar.tsx")).toContain("https://nigelmemorial-ucmtq9dn.manus.space");
    expect(source("client/src/components/NetworkBar.tsx")).toContain("https://xgrowthtrk-2a93yo5z.manus.space");
    const fireStage = source("client/src/pages/ExplorerRelay.tsx");
    const fireOnly = fireStage.slice(fireStage.indexOf('data-testid="fire-stage"'), fireStage.indexOf('data-testid="tree-stage"'));
    expect(fireOnly).not.toContain("Tree hall");
    expect(fireOnly).toContain("<FirePit");
  });
});
