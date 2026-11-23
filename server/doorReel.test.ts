import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HELD_DOOR_FILMS, doorReelFrom } from "../client/src/lib/doorReel";

const source = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

describe("door reel", () => {
  it("loops already-held films and leaves the issued hall films out of the reel", () => {
    const urls = HELD_DOOR_FILMS.map((film) => film.src);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.some((url) => url.includes("flightdeck-clip-v5"))).toBe(true);
    expect(urls.some((url) => url.includes("scholar-clip-v6"))).toBe(true);
    expect(urls.some((url) => url.includes("iGO_trailer_v7"))).toBe(true);
    expect(urls.some((url) => url.includes("FINAL-v2-dungeon-crawl"))).toBe(true);
    expect(urls.join(" ")).not.toContain("film-0201");
    expect(urls.join(" ")).not.toContain("v6-exhibition");
    expect(urls.join(" ")).not.toContain("github.com");
    expect(urls.join(" ")).not.toContain("releases/download");

    const flight = doorReelFrom(urls[0]);
    expect(flight[0]).toBe(urls[0]);
    expect(flight).toHaveLength(urls.length);
    expect(flight[flight.length - 1]).toBe(urls[urls.length - 1]);
    expect(doorReelFrom(urls[3])[0]).toBe(urls[3]);
  });

  it("keeps the public intro doors playing instead of collapsing to a watched badge", () => {
    const video = source("client/src/components/ExplorerVideo.tsx");
    expect(video).toContain("autoPlay");
    expect(video).toContain("playsInline");
    expect(video).toContain('loop={reel.length < 2}');
    expect(video).toContain("Tap to hear the film");
    expect(video).toContain("pointerdown");
    expect(video).not.toContain("tap to rewatch");
    expect(video).not.toContain("Watch Intro");
    expect(video).toContain('fontSize: "20pt"');
    expect(video).toContain("if (!plate)");

    for (const file of [
      "client/src/pages/FlightDeck.tsx",
      "client/src/pages/ScholarCreate.tsx",
      "client/src/pages/RelaySpinner.tsx",
      "client/src/pages/DungeonCrawl.tsx",
      "client/src/pages/GreyMatter.tsx",
    ]) {
      const page = source(file);
      expect(page).toContain("playlist={doorReelFrom(");
      expect(page).not.toContain("releases/download");
    }
  });
});
