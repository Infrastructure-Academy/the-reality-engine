import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getRelayStory } from "@shared/relayStories";
import {
  buildStoryScript,
  chineseVariant,
  langFromBrowserTags,
  localizeRelayStory,
  pickStorytellerVoice,
  resolveStoryLocale,
} from "@/lib/storyLocale";
import { RecordedStoryPlayer, recordedStorySrc, seekStory, type StoryMedia } from "@/lib/recordedStory";
import { StorytellerEngine, setStorytellerOwnsSpeech, storytellerOwnsSpeech, type StorySynth, type StoryUtterance } from "@/lib/storyteller";

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
  start() {
    const current = this.spoken[this.spoken.length - 1];
    current?.onstart?.();
  }
}

class FakeMedia implements StoryMedia {
  plays = 0;
  currentTime = 0;
  duration = 40;
  reject = false;
  play() {
    this.plays += 1;
    if (this.reject) return Promise.reject(new Error("NotAllowedError"));
    return Promise.resolve();
  }
  pause() {}
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
    expect(spoken).toContain("Relay 1 of 12 — The Eternal Constant");
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

describe("storyteller controls", () => {
  function setup() {
    const synth = new FakeSynth();
    const phases: string[] = [];
    const story = localizeRelayStory(1, "en")!;
    const passages = buildStoryScript(story);
    const engine = new StorytellerEngine(synth, () => passages, (phase) => phases.push(phase));
    return { synth, phases, engine, passages };
  }

  it("speaks inside the tap and does not claim Speaking before the voice starts", () => {
    const { synth, engine } = setup();
    expect(synth.spoken).toHaveLength(0);
    expect(engine.phase).toBe("idle");
    engine.listen();
    expect(synth.spoken).toHaveLength(1);
    expect(synth.spoken[0]?.text).toBe("Mission Briefing");
    expect(synth.spoken[0]?.rate).toBeLessThan(1);
    expect(synth.spoken[0]?.pitch).toBeGreaterThan(1);
    expect(engine.phase).toBe("idle");
    expect(storytellerOwnsSpeech()).toBe(false);
    synth.start();
    expect(engine.phase).toBe("speaking");
    expect(storytellerOwnsSpeech()).toBe(true);
  });

  it("pauses, resumes, and stops without continuing on its own", () => {
    const { synth, engine } = setup();
    engine.listen();
    synth.start();
    expect(synth.spoken).toHaveLength(1);
    engine.pause();
    synth.finish();
    expect(synth.spoken).toHaveLength(1);
    expect(engine.phase).toBe("paused");
    engine.resume();
    expect(synth.spoken).toHaveLength(2);
    synth.start();
    expect(engine.phase).toBe("speaking");
    engine.stop();
    expect(engine.phase).toBe("idle");
    expect(storytellerOwnsSpeech()).toBe(false);
    expect(synth.cancelled).toBeGreaterThan(0);
  });

  it("stops on dispose, as navigation must", () => {
    const { engine } = setup();
    engine.listen();
    engine.dispose();
    expect(engine.phase).toBe("idle");
    setStorytellerOwnsSpeech(false);
  });
});

describe("recorded Fire story", () => {
  const audioFile = path.resolve(import.meta.dirname, "../client/public/audio/relay-1-fire-en.mp3");
  const transcriptFile = path.resolve(import.meta.dirname, "../client/public/audio/relay-1-fire-en.txt");

  it("points English Fire at the recording and leaves every other story on speech", () => {
    expect(recordedStorySrc(1, "en")).toBe("/audio/relay-1-fire-en.mp3");
    expect(recordedStorySrc(1, "zh-HK")).toBeNull();
    expect(recordedStorySrc(1, "zh-CN")).toBeNull();
    expect(recordedStorySrc(2, "en")).toBeNull();
  });

  it("covers the authored briefing, story, and quote", () => {
    const script = buildStoryScript(localizeRelayStory(1, "en")!);
    const transcript = fs.readFileSync(transcriptFile, "utf8");
    for (const part of script) {
      expect(transcript).toContain(part.text);
    }
  });

  it("does not play until Play, and does not claim Speaking if playback is rejected", async () => {
    setStorytellerOwnsSpeech(false);
    const media = new FakeMedia();
    const phases: string[] = [];
    let blocked = false;
    const player = new RecordedStoryPlayer(media, (phase) => phases.push(phase), (next) => {
      blocked = next;
    });
    expect(media.plays).toBe(0);
    expect(player.phase).toBe("idle");
    player.play();
    expect(media.plays).toBe(1);
    expect(player.phase).toBe("idle");
    await Promise.resolve();
    expect(player.phase).toBe("speaking");
    expect(storytellerOwnsSpeech()).toBe(true);
    player.pause();
    expect(player.phase).toBe("paused");
    player.play();
    await Promise.resolve();
    player.stop();
    expect(player.phase).toBe("idle");
    expect(media.currentTime).toBe(0);
    expect(storytellerOwnsSpeech()).toBe(false);
    expect(phases).toContain("speaking");

    media.reject = true;
    player.play();
    await Promise.resolve();
    expect(player.phase).toBe("idle");
    expect(blocked).toBe(true);
    expect(storytellerOwnsSpeech()).toBe(false);
    setStorytellerOwnsSpeech(false);
  });

  it("seeks inside the recording without starting it", () => {
    const media = new FakeMedia();
    seekStory(media, 12.5);
    expect(media.currentTime).toBe(12.5);
    expect(media.plays).toBe(0);
    seekStory(media, 99);
    expect(media.currentTime).toBe(40);
  });

  it("ships an audible Fire recording", () => {
    expect(fs.existsSync(audioFile)).toBe(true);
    expect(fs.statSync(audioFile).size).toBeGreaterThan(100_000);
    const probe = spawnSync("ffmpeg", ["-i", audioFile, "-af", "volumedetect", "-f", "null", "-"], { encoding: "utf8" });
    if (probe.error && (probe.error as NodeJS.ErrnoException).code === "ENOENT") return;
    const log = `${probe.stderr ?? ""}\n${probe.stdout ?? ""}`;
    const mean = log.match(/mean_volume:\s*(-?[\d.]+)\s*dB/);
    const duration = log.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    expect(mean).not.toBeNull();
    expect(Number(mean?.[1])).toBeGreaterThan(-30);
    expect(duration).not.toBeNull();
    const seconds = Number(duration?.[1]) * 3600 + Number(duration?.[2]) * 60 + Number(duration?.[3]);
    expect(seconds).toBeGreaterThan(30);
  });
});

describe("storyteller placement", () => {
  it("keeps the player out of the relay header and off Home's Press Play", () => {
    const page = fs.readFileSync(path.resolve(import.meta.dirname, "../client/src/pages/ExplorerRelay.tsx"), "utf8");
    const header = page.slice(page.indexOf("<header"), page.indexOf("</header>"));
    expect(header).not.toContain("StorytellerControl");
    expect(page).not.toMatch(/storyteller\.listen\(\)/);
    expect(page).toContain("storyPlayer");
    const control = fs.readFileSync(path.resolve(import.meta.dirname, "../client/src/components/StorytellerControl.tsx"), "utf8");
    expect(control).toContain("min-h-11");
    expect(control).not.toMatch(/autoPlay|autoplay/);
    const gates = fs.readFileSync(path.resolve(import.meta.dirname, "../client/src/components/GameModeGates.tsx"), "utf8");
    expect(gates).toContain('href="/explore/spinner"');
    expect(gates).not.toContain("relay-1-fire");
  });
});
