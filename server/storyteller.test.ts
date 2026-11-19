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

  it("does not speak until Listen", async () => {
    const { synth, engine } = setup();
    expect(synth.spoken).toHaveLength(0);
    expect(engine.phase).toBe("idle");
    engine.listen();
    await Promise.resolve();
    expect(synth.spoken[0]?.text).toBe("Mission Briefing");
    expect(synth.spoken[0]?.rate).toBeLessThan(1);
    expect(synth.spoken[0]?.pitch).toBeGreaterThan(1);
    expect(storytellerOwnsSpeech()).toBe(true);
  });

  it("pauses, resumes, and stops without continuing on its own", async () => {
    const { synth, engine } = setup();
    engine.listen();
    await Promise.resolve();
    expect(synth.spoken).toHaveLength(1);
    engine.pause();
    synth.finish();
    expect(synth.spoken).toHaveLength(1);
    expect(engine.phase).toBe("paused");
    engine.resume();
    expect(synth.spoken).toHaveLength(2);
    engine.stop();
    expect(engine.phase).toBe("idle");
    expect(storytellerOwnsSpeech()).toBe(false);
    expect(synth.cancelled).toBeGreaterThan(0);
  });

  it("stops on dispose, as navigation must", async () => {
    const { engine } = setup();
    engine.listen();
    await Promise.resolve();
    engine.dispose();
    expect(engine.phase).toBe("idle");
    setStorytellerOwnsSpeech(false);
  });
});
