import { readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RELAYS } from "@shared/gameData";
import { getRelayStory, RELAY_STORIES } from "@shared/relayStories";
import { EN } from "@/i18n/en";
import { createHash } from "node:crypto";
import { FIRE_STORY_AUDIO_URL, HALL_STORY_AUDIO, formatStoryTime, relayCardVoiceUrl, storyAudioUrl } from "@/lib/storyAudio";
import {
  buildStoryScript,
  chineseVariant,
  langFromBrowserTags,
  localizeRelayStory,
  pickStorytellerVoice,
  resolveStoryLocale,
} from "@/lib/storyLocale";
import { StorytellerEngine, setStorytellerOwnsSpeech, storytellerOwnsSpeech, type StorySynth, type StoryUtterance } from "@/lib/storyteller";

const REMARKABLE_TITLES = [
  "The First Platform",
  "The Living Machine",
  "The Liquid Highway",
  "The Steering Revolution",
  "The Path That Connected Everything",
  "The Vessel That Made the World One",
  "The Machine That Wove Civilisation",
  "The Iron Horse That Standardised Time",
  "The Machine That Multiplied Muscle",
  "Automobiles, Aviation & Airwaves",
  "Satellites, Space Stations & Planetary Infrastructure",
  "Robots, AI, Biosynthetics & Quantum",
] as const;

const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

class FakeSynth implements StorySynth {
  spoken: StoryUtterance[] = [];
  cancelled = 0;
  voices: { name: string; lang: string }[] = [];
  cancel() {
    this.cancelled += 1;
  }
  speak(utterance: StoryUtterance) {
    this.spoken.push(utterance);
  }
  resume() {}
  getVoices() {
    return this.voices;
  }
  finish() {
    const current = this.spoken[this.spoken.length - 1];
    current?.onend?.();
  }
}

describe("story language", () => {
  it("maps the browser list onto the interface language", () => {
    expect(langFromBrowserTags(["zh-HK", "zh", "en-GB"])).toBe("ZH");
    expect(langFromBrowserTags(["en-GB", "en"])).toBe("EN");
    expect(langFromBrowserTags(["fr-FR"])).toBeNull();
  });

  it("uses Traditional Chinese for Hong Kong and Taiwan tags", () => {
    expect(chineseVariant(["zh-HK"])).toBe("zh-HK");
    expect(chineseVariant(["zh-TW", "zh"])).toBe("zh-HK");
    expect(chineseVariant(["yue-HK"])).toBe("zh-HK");
    expect(chineseVariant(["zh-CN", "zh"])).toBe("zh-CN");
    expect(chineseVariant(["zh-Hans"])).toBe("zh-CN");
  });

  it("follows the interface language, and English when the story is not translated", () => {
    expect(resolveStoryLocale("ZH", ["zh-HK"])).toBe("zh-HK");
    expect(resolveStoryLocale("ZH", ["en-GB"])).toBe("zh-CN");
    expect(resolveStoryLocale("EN", ["zh-HK"])).toBe("en");
    expect(resolveStoryLocale("KO", ["ko-KR"])).toBe("en");
  });
});

describe("authored Fire copy", () => {
  it("keeps the seeded English briefing, story, and quote", () => {
    const fire = getRelayStory(1);
    expect(fire?.narrative.en).toContain("Civilisation ignited — an epic of incalculable possibility.");
    expect(fire?.missionObjective.en).toBe(
      "Understand the fundamental role of controlled fire in early human survival and societal development.",
    );
    expect(fire?.quote.en).toBe("The most powerful weapon on earth is the human soul on fire.");
    expect(fire?.quoteAuthor).toBe("Ferdinand Foch");
  });

  it("translates only those strings into Traditional and Simplified Chinese", () => {
    const hk = localizeRelayStory(1, "zh-HK");
    const cn = localizeRelayStory(1, "zh-CN");
    expect(hk?.narrative).toContain("文明被點燃");
    expect(hk?.narrative).not.toContain("文明被点燃");
    expect(cn?.narrative).toContain("文明被点燃");
    expect(hk?.quoteAuthor).toBe("Ferdinand Foch");
    expect(cn?.missionObjective).toContain("受控之火");
  });

  it("speaks the briefing, the story, and the quote, and nothing invented", () => {
    const story = localizeRelayStory(1, "en");
    expect(story).not.toBeNull();
    const script = buildStoryScript(story!);
    const spoken = script.map((part) => part.text).join(" ");
    expect(spoken).toContain("Mission Briefing");
    expect(spoken).toContain("Relay 1 of 12 — The First Platform");
    expect(spoken).toContain("controlled fire");
    expect(spoken).toContain("The Story");
    expect(spoken).toContain("Twelve thousand years ago");
    expect(spoken).toContain("human soul on fire");
    expect(spoken).toContain("Ferdinand Foch");
    expect(spoken).not.toContain("Welcome to Relay");
    expect(script.every((part) => part.lang === "en-GB")).toBe(true);
  });
});

describe("storyteller voice", () => {
  it("does not choose a German voice for an English line", () => {
    expect(pickStorytellerVoice([{ name: "Anna", lang: "de-DE" }, { name: "Markus", lang: "de-DE" }], "en")).toBeNull();
  });

  it("prefers a warm English voice over an announcer", () => {
    const chosen = pickStorytellerVoice(
      [
        { name: "Google UK English Male", lang: "en-GB" },
        { name: "Microsoft Sonia", lang: "en-GB" },
      ],
      "en",
    );
    expect(chosen?.name).toBe("Microsoft Sonia");
  });

  it("picks a Hong Kong voice for Traditional Chinese and a mainland voice for Simplified", () => {
    const voices = [
      { name: "Ting-Ting", lang: "zh-CN" },
      { name: "Sinji", lang: "zh-HK" },
    ];
    expect(pickStorytellerVoice(voices, "zh-HK")?.name).toBe("Sinji");
    expect(pickStorytellerVoice(voices, "zh-CN")?.name).toBe("Ting-Ting");
  });
});

describe("remarkable relay titles", () => {
  it("uses the printed titles as the door identity", () => {
    expect(RELAYS.map((relay) => relay.subtitle)).toEqual([...REMARKABLE_TITLES]);
    expect(RELAY_STORIES.map((story) => story.subtitle.en)).toEqual([...REMARKABLE_TITLES]);
    for (let number = 1; number <= 12; number += 1) {
      expect(EN[`relay.subtitle.${number}`]).toBe(REMARKABLE_TITLES[number - 1]);
    }
    expect(RELAYS[0].subtitle).toBe("The First Platform");
    expect(REMARKABLE_TITLES[6]).toContain("Civilisation");
    expect(REMARKABLE_TITLES[7]).toContain("Standardised");
  });
});

describe("fire recording", () => {
  it("plays a file for English Fire and does not autoplay", () => {
    expect(storyAudioUrl(1, "en")).toBe(FIRE_STORY_AUDIO_URL);
    expect(storyAudioUrl(1, "zh-HK")).toBeNull();
    expect(storyAudioUrl(2, "en")).toBe("/audio/hall-stories/02_the-living-machine.mp3");
    expect(storyAudioUrl(9, "en")).toBe("/audio/hall-stories/09_the-machine-that-multiplied-muscle.mp3");
    expect(storyAudioUrl(12, "en")).toBe("/audio/hall-stories/12_robots-ai-biosynthetics-quantum.mp3");
    expect(storyAudioUrl(9, "zh-CN")).toBeNull();
    expect(storyAudioUrl(2, "zh-HK")).toBeNull();
    expect(relayCardVoiceUrl(4, "Horse Collar")).toBe("/audio/relay-cards/04/horse-collar.mp3");
    expect(relayCardVoiceUrl(9, "Internal Combustion")).toBe("/audio/relay-cards/09/internal-combustion.mp3");
    expect(relayCardVoiceUrl(1, "Hearth")).toBeNull();
    for (const row of HALL_STORY_AUDIO) {
      for (const root of ["client/public", "docs"]) {
        const bytes = readFileSync(new URL(`../${root}/audio/hall-stories/${row.file}`, import.meta.url));
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(row.sha256);
      }
      expect(storyAudioUrl(row.relay, "en")).toBe(`/audio/hall-stories/${row.file}`);
    }
    const bar = source("client/src/components/StoryPlayBar.tsx");
    expect(bar).not.toContain("speech.listen(");
    expect(source("client/src/pages/ExplorerRelay.tsx")).not.toContain("narrateDiscovery");
    expect(existsSync(new URL("../client/public/audio/relay-1-fire-en.mp3", import.meta.url))).toBe(true);
    expect(bar).not.toMatch(/autoPlay|autoplay/);
    expect(bar).toContain('data-testid="story-play"');
    expect(bar).toContain("min-h-11");
    expect(bar).toContain("onPlaying");
    const relay = source("client/src/pages/ExplorerRelay.tsx");
    expect(relay).toContain("StoryPlayBar");
    expect(relay).not.toContain("StorytellerControl");
    const home = source("client/src/components/GameModeGates.tsx");
    expect(home).toContain('href="/explore/spinner"');
    expect(home).not.toContain("relay-1-fire");
    const app = source("client/src/App.tsx");
    expect(app).toContain('import RelaySpinner from "./pages/RelaySpinner"');
    expect(app).not.toContain('lazy(() => import("./pages/RelaySpinner"))');
  });

  it("formats the scrubber clock", () => {
    expect(formatStoryTime(0)).toBe("0:00");
    expect(formatStoryTime(65)).toBe("1:05");
    expect(formatStoryTime(Number.NaN)).toBe("0:00");
  });
});

describe("storyteller controls", () => {
  function setup() {
    const synth = new FakeSynth();
    const phases: string[] = [];
    const story = localizeRelayStory(1, "en")!;
    const passages = buildStoryScript(story);
    const engine = new StorytellerEngine(synth, () => passages, (phase) => phases.push(phase));
    return { synth, phases, engine, passages };
  }

  it("does not speak until Listen, and does not claim speaking before the voice starts", () => {
    const { synth, engine } = setup();
    expect(synth.spoken).toHaveLength(0);
    expect(engine.phase).toBe("idle");
    engine.listen();
    expect(synth.cancelled).toBe(0);
    expect(synth.spoken[0]?.text).toBe("Mission Briefing");
    expect(synth.spoken[0]?.rate).toBeLessThan(1);
    expect(synth.spoken[0]?.pitch).toBeGreaterThan(1);
    expect(engine.phase).toBe("idle");
    expect(storytellerOwnsSpeech()).toBe(false);
    synth.spoken[0]?.onstart?.();
    expect(engine.phase).toBe("speaking");
    expect(storytellerOwnsSpeech()).toBe(true);
  });

  it("pauses, resumes, and stops without continuing on its own", () => {
    const { synth, engine } = setup();
    engine.listen();
    synth.spoken[0]?.onstart?.();
    expect(synth.spoken).toHaveLength(1);
    engine.pause();
    synth.finish();
    expect(synth.spoken).toHaveLength(1);
    expect(engine.phase).toBe("paused");
    engine.resume();
    expect(synth.spoken).toHaveLength(2);
    synth.spoken[1]?.onstart?.();
    expect(engine.phase).toBe("speaking");
    engine.stop();
    expect(engine.phase).toBe("idle");
    expect(storytellerOwnsSpeech()).toBe(false);
    expect(synth.cancelled).toBeGreaterThan(0);
  });

  it("stops on dispose, as navigation must", () => {
    const { engine, synth } = setup();
    engine.listen();
    synth.spoken[0]?.onstart?.();
    engine.dispose();
    expect(engine.phase).toBe("idle");
    setStorytellerOwnsSpeech(false);
  });
});
