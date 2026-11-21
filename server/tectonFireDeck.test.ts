import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INVENTIONS } from "@shared/inventions";
import { TECTON_FIRE_DECK, TECTON_GRID_NAMES } from "@shared/tectonFireDeck";
import { fireCaptionAt } from "@/lib/fireStoryCues";
import { FIRE_STORY_AUDIO_URL } from "@/lib/storyAudio";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const LIVE_NINE = ["Hearth", "Torch", "Kiln", "Charcoal", "Smelting", "Forge", "Signal Fire", "Cremation", "Slash-and-Burn"];

describe("Tecton Fire Deck learn-more", () => {
  it("leaves the live nine names and order alone", () => {
    expect(INVENTIONS[1].map((card) => card.name)).toEqual(LIVE_NINE);
  });

  it("lists 48 phenomena in deck order, matching the grid names but not the grid's score order", () => {
    expect(TECTON_FIRE_DECK).toHaveLength(48);
    expect(TECTON_FIRE_DECK.map((card) => card.number)).toEqual(Array.from({ length: 48 }, (_, index) => index + 1));
    const names = TECTON_FIRE_DECK.map((card) => card.name);
    expect(new Set(names)).toEqual(new Set(TECTON_GRID_NAMES));
    expect(names).not.toEqual([...TECTON_GRID_NAMES]);
    expect(names[0]).toBe("Hearth Fire");
    expect(names[27]).toBe("Gas Turbine Power Station");
    expect(names[28]).toBe("Internal Combustion Engine");
    expect(names[35]).toBe("Slash and Burn");
    expect(names[47]).toBe("Fire Triangle");
    expect(TECTON_FIRE_DECK.every((card) => card.latin.length > 0 && card.note.length > 40)).toBe(true);
  });

  it("shows the learn-more section under the nine and does not invent speech", () => {
    const page = source("client/src/components/TectonFireLearnMore.tsx");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay.indexOf("<DiscoveryGrid")).toBeLessThan(relay.indexOf("<TectonFireLearnMore"));
    expect(page).not.toContain("speechSynthesis");
    expect(page).not.toContain("gender vision");
    expect(page).toContain("tecton-learn-more");
    expect(page).toContain("Hear the recorded discovery");
    expect(FIRE_STORY_AUDIO_URL).toBe("/audio/fire-cards/volume-1-briefing.mp3");
    expect(fireCaptionAt(10)).toBe(
      "Understand the fundamental role of controlled fire in early human survival and societal development.",
    );
  });
});
