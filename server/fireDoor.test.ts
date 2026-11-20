import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INVENTIONS } from "@shared/inventions";
import { EN } from "@/i18n/en";
import {
  FIRE_AMBIENCE_UNDER_CARD,
  FIRE_AMBIENCE_UNDER_STORY,
  FIRE_AMBIENCE_URL,
  fireCardFinished,
  fireCardSpeech,
  fireCardTapped,
  fireCardVoiceUrl,
  fireDoorGesture,
  fireDoorOpened,
} from "@/lib/fireDoorAudio";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

const STORY_HASH = "d96598f919a50defe601f8996ff29372b4e5932ea8996b9668f5fe07f2172870";

describe("fire door experience", () => {
  it("keeps the issued story recording and adds a voice for each of the nine cards", () => {
    expect(sha256("client/public/audio/relay-1-fire-en.mp3")).toBe(STORY_HASH);
    expect(sha256("docs/audio/relay-1-fire-en.mp3")).toBe(STORY_HASH);
    expect(INVENTIONS[1]).toHaveLength(9);
    for (const card of INVENTIONS[1]) {
      expect(fireCardSpeech(card)).toBe(`${card.name}. ${card.description}`);
      const relative = fireCardVoiceUrl(card.name).replace(/^\//, "");
      expect(existsSync(new URL(`../client/public/${relative}`, import.meta.url))).toBe(true);
      expect(existsSync(new URL(`../docs/${relative}`, import.meta.url))).toBe(true);
      expect(readFileSync(new URL(`../client/public/${relative}`, import.meta.url)).length).toBeGreaterThan(20_000);
    }
    expect(FIRE_AMBIENCE_URL).toBe("/audio/fire-ambience.mp3");
    expect(existsSync(new URL("../client/public/audio/fire-ambience.mp3", import.meta.url))).toBe(true);
    expect(existsSync(new URL("../docs/audio/fire-ambience.mp3", import.meta.url))).toBe(true);
  });

  it("starts the story and ambience on open, and falls back to the first gesture when blocked", () => {
    const blocked = fireDoorOpened(true);
    expect(blocked.story).toBe("idle");
    expect(blocked.ambience).toBe("idle");
    expect(blocked.card).toBe("idle");
    const opened = fireDoorOpened(false);
    expect(opened.story).toBe("playing");
    expect(opened.ambience).toBe("playing");
    expect(opened.ambienceLevel).toBe(FIRE_AMBIENCE_UNDER_STORY);
    expect(fireDoorGesture(blocked).story).toBe("playing");
    expect(fireDoorGesture(opened)).toEqual(opened);

    const door = source("client/src/hooks/useFireDoor.ts");
    expect(door).toContain("begin({ quiet })");
    expect(door).toContain("beginBed(true)");
    expect(door).toContain('addEventListener("pointerdown"');
    expect(door).not.toMatch(/muted\s*=/);
    const preview = source("client/src/components/FirePreviewPlayer.tsx");
    expect(preview).not.toMatch(/autoPlay|autoplay|\.play\(/);
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const stage = relay.slice(relay.indexOf('data-testid="fire-stage"'));
    expect(stage.indexOf("<FirePreviewPlayer />")).toBeGreaterThanOrEqual(0);
    expect(stage.indexOf("<FirePreviewPlayer />")).toBeLessThan(stage.indexOf("compact"));
  });

  it("pauses the story for a card voice and keeps ambience under the voice", () => {
    const playing = fireDoorOpened(false);
    const during = fireCardTapped(playing);
    expect(during.story).toBe("paused");
    expect(during.card).toBe("playing");
    expect(during.resumeStory).toBe(true);
    expect(during.ambienceLevel).toBe(FIRE_AMBIENCE_UNDER_CARD);
    expect(during.ambienceLevel).toBeLessThan(FIRE_AMBIENCE_UNDER_STORY);
    const after = fireCardFinished(during);
    expect(after.card).toBe("idle");
    expect(after.story).toBe("playing");
    expect(after.ambienceLevel).toBe(FIRE_AMBIENCE_UNDER_STORY);

    const idle = fireDoorOpened(true);
    const fromIdle = fireCardTapped(idle);
    expect(fromIdle.resumeStory).toBe(false);
    expect(fireCardFinished(fromIdle).story).toBe("idle");

    const bar = source("client/src/components/StoryPlayBar.tsx");
    expect(bar).toContain("pauseForCard");
    expect(bar).toContain("resumeIfHeld");
    expect(bar).toContain('data-compact={compact ? "true" : "false"}');
    expect(bar).toContain("min-h-11 min-w-11");
    expect(bar).not.toMatch(/autoPlay|autoplay/);
  });

  it("names this door's nine-set harnessed discoveries and leaves the home door alone", () => {
    expect(EN["explore.harnessedDiscoveries"]).toBe("Harnessed discoveries");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain('t("explore.harnessedDiscoveries")');
    expect(relay).toContain("livingFire");
    expect(relay).toContain("fire-card");
    expect(relay).toContain('discoveryNoun={fireDoor ? "harnessed discoveries" : undefined}');
    const home = source("client/src/components/GameModeGates.tsx");
    expect(home).toContain('href="/explore/spinner"');
    expect(home).not.toContain("harnessed discoveries");
    expect(EN["home.pressPlay"]).toBe("Press Play to engage NOW");
  });
});
