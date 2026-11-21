import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INVENTIONS } from "@shared/inventions";
import { HALL_CARDS } from "@shared/exhibitionPortal";
import {
  TECTON_TREES_DECK,
  TREE_CHAMBER_SRC,
  tectonTreeSrc,
} from "@shared/tectonTreesDeck";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

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
    expect(HALL_CARDS[1]).toMatchObject({ id: "tree", name: "Tree", href: null });
    expect(HALL_CARDS[0].href).toBe("/explore/1");
  });

  it("lists 48 trees in deck order, with the printed plate numbers", () => {
    expect(TECTON_TREES_DECK).toHaveLength(48);
    expect(TECTON_TREES_DECK.map((card) => card.order)).toEqual(Array.from({ length: 48 }, (_, index) => index + 1));
    expect(TECTON_TREES_DECK[0]).toMatchObject({ number: 2, name: "Norse Ash", category: "Sacred" });
    expect(TECTON_TREES_DECK[23]).toMatchObject({ number: 25, name: "Coffee", category: "Trade" });
    expect(TECTON_TREES_DECK[33]).toMatchObject({ number: 35, name: "Coffee", category: "Special" });
    expect(TECTON_TREES_DECK[38].name).toBe("Árbol del Tule");
    expect(TECTON_TREES_DECK[45].name).toBe("Árbol del Tule");
    expect(TECTON_TREES_DECK[45].file).not.toBe(TECTON_TREES_DECK[38].file);
    expect(TECTON_TREES_DECK[47]).toMatchObject({ number: 42, name: "Sugar Maple", category: "Ancient" });
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
    expect(page).toContain("IntersectionObserver");
    expect(page).not.toContain('loading="lazy"');
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
});
