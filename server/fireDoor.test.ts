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
import { fireBedSettled } from "@/lib/firePlayback";
import { buildStoryScript, localizeRelayStory } from "@/lib/storyLocale";
import {
  FIRE_STORY_CUES,
  FIRE_STORY_SPEECH_SECONDS,
  FIRE_STORY_VOICE,
  FIRE_STORY_WORDS,
  fireCaptionAt,
} from "@/lib/fireStoryCues";

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(new URL(`../${path}`, import.meta.url))).digest("hex");

const STORY_HASH = "8edf3af7e66e227e4a7b2aa004312f7ae242829a871d576d4406fb3b9db9ee20";

describe("fire door experience", () => {
  it("keeps the issued story recording and adds a voice for each of the nine cards", () => {
    expect(sha256("client/public/audio/relay-1-fire-en.mp3")).toBe(STORY_HASH);
    expect(sha256("docs/audio/relay-1-fire-en.mp3")).toBe(STORY_HASH);
    expect(sha256("client/public/audio/fire-cards/volume-1-briefing.mp3")).not.toBe(STORY_HASH);
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
    const playback = source("client/src/lib/firePlayback.ts");
    expect(door).toContain("begin({ quiet: true })");
    expect(door).toContain("beginFireBedFromGesture");
    expect(door).toContain("fireBedSettled");
    expect(door).toContain('addEventListener("pointerdown"');
    expect(door).not.toMatch(/muted\s*=/);
    expect(playback).toContain("story.play()");
    expect(playback).toContain("ambience.play()");
    expect(playback).toContain("FIRE_STORY_AUDIO_URL");
    expect(source("client/src/pages/ExhibitionPortal.tsx")).toContain("beginFireBedFromGesture");
    expect(source("client/src/components/PlanetOpening.tsx")).toContain("beginFireBedFromGesture");
    expect(fireBedSettled(true, false)).toBe(false);
    expect(fireBedSettled(false, true)).toBe(false);
    expect(fireBedSettled(true, true)).toBe(true);
    const preview = source("client/src/components/FirePreviewPlayer.tsx");
    expect(preview).not.toMatch(/autoPlay|autoplay|\.play\(/);
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    const stage = relay.slice(relay.indexOf('data-testid="fire-stage"'));
    expect(stage.indexOf("<FirePit")).toBeGreaterThanOrEqual(0);
    expect(stage.indexOf("<FirePit")).toBeLessThan(stage.indexOf("compact"));
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
    expect(bar).toContain("inline-flex h-8 min-w-8");
    expect(bar).not.toMatch(/autoPlay|autoplay/);
  });

  it("reads the existing Fire script in Sonia's voice, with captions and a full-width pit", () => {
    const script = buildStoryScript(localizeRelayStory(1, "en")!).map((part) => part.text);
    expect(FIRE_STORY_CUES.map((cue) => cue.text)).toEqual(script);
    expect(FIRE_STORY_VOICE).toBe("en-GB-SoniaNeural");
    expect(FIRE_STORY_WORDS).toBe(86);
    const wordsPerMinute = FIRE_STORY_WORDS / (FIRE_STORY_SPEECH_SECONDS / 60);
    expect(wordsPerMinute).toBeGreaterThanOrEqual(120);
    expect(wordsPerMinute).toBeLessThanOrEqual(140);
    expect(fireCaptionAt(0)).toBe("Mission Briefing");
    expect(fireCaptionAt(21)).toContain("explosion of intent");
    expect(fireCaptionAt(44)).toBe("Ferdinand Foch");
    const pit = source("client/src/components/FirePit.tsx");
    expect(pit).toContain("w-full");
    expect(pit).toContain("requestAnimationFrame");
    expect(pit).toContain("relay-1-fire-plate.jpg");
    expect(pit).toContain("bison");
    expect(pit).toContain("handprints");
    expect(pit).toContain("drawImage");
    expect(pit).not.toContain("<img");
    expect(pit).not.toContain("fire-hall-plate");
    expect(pit).not.toContain("fire-preview");
    expect(pit).not.toContain("speechSynthesis");
    const story = source("client/src/lib/storyAudio.ts");
    expect(story).toContain('"/audio/fire-cards/volume-1-briefing.mp3"');
    expect(story).not.toContain("relay-1-fire-en.mp3");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain("<FirePit");
    expect(relay).not.toContain("FirePreviewPlayer");
    expect(pit).toContain('data-testid="fire-caption"');
  });

  it("names this door's nine-set harnessed discoveries and leaves the home door alone", () => {
    expect(EN["explore.harnessedDiscoveries"]).toBe("Harnessed discoveries");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain('t("explore.harnessedDiscoveries")');
    expect(relay).toContain("livingFire");
    expect(relay).toContain("fire-card");
    expect(relay).toContain("livingFire || isDiscovered ? inv : \"???\"");
    expect(relay).toContain('discoveryNoun={fireDoor ? "harnessed discoveries" : undefined}');
    const home = source("client/src/components/GameModeGates.tsx");
    expect(home).toContain('href="/explore/spinner"');
    expect(home).not.toContain("harnessed discoveries");
    expect(EN["home.pressPlay"]).toBe("Press Play to engage NOW");
  });
});
