/**
 * Story language for the relay briefing, the story, and the quote.
 * The in-app language wins when the player has chosen one.
 * Otherwise the browser language list is used.
 * Story copy exists in English, Hong Kong Traditional, and Simplified Chinese.
 * Other interface languages keep the authored English, rather than inventing a translation.
 */

import { getRelayStory, type StoryLocale } from "@shared/relayStories";

export type { StoryLocale };

export interface StoryChrome {
  group: string;
  briefing: string;
  objective: string;
  story: string;
  listen: string;
  listenTo: string;
  pause: string;
  pauseStory: string;
  resume: string;
  resumeStory: string;
  stop: string;
  stopStory: string;
  speaking: string;
  paused: string;
  stopped: string;
  unavailable: string;
  relayOf: string;
}

const CHROME: Record<StoryLocale, StoryChrome> = {
  en: {
    group: "Storyteller",
    briefing: "Mission Briefing",
    objective: "Mission Objective",
    story: "The Story",
    listen: "Listen",
    listenTo: "Listen to the mission briefing, the story, and the quote",
    pause: "Pause",
    pauseStory: "Pause the story",
    resume: "Resume",
    resumeStory: "Resume the story",
    stop: "Stop",
    stopStory: "Stop the story",
    speaking: "Speaking",
    paused: "Paused",
    stopped: "Stopped",
    unavailable: "Speech is not available in this browser",
    relayOf: "Relay {n} of 12",
  },
  "zh-HK": {
    group: "講述",
    briefing: "任務簡報",
    objective: "任務目標",
    story: "故事",
    listen: "聆聽",
    listenTo: "聆聽任務簡報、故事和引文",
    pause: "暫停",
    pauseStory: "暫停講述",
    resume: "繼續",
    resumeStory: "繼續講述",
    stop: "停止",
    stopStory: "停止講述",
    speaking: "正在講述",
    paused: "已暫停",
    stopped: "已停止",
    unavailable: "此瀏覽器不提供語音",
    relayOf: "第 {n} 程，共 12 程",
  },
  "zh-CN": {
    group: "讲述",
    briefing: "任务简报",
    objective: "任务目标",
    story: "故事",
    listen: "聆听",
    listenTo: "聆听任务简报、故事和引文",
    pause: "暂停",
    pauseStory: "暂停讲述",
    resume: "继续",
    resumeStory: "继续讲述",
    stop: "停止",
    stopStory: "停止讲述",
    speaking: "正在讲述",
    paused: "已暂停",
    stopped: "已停止",
    unavailable: "此浏览器不提供语音",
    relayOf: "第 {n} 程，共 12 程",
  },
};

const UI_TO_CODE: Array<[RegExp, "EN" | "ZH" | "KO" | "JA" | "HI" | "AR" | "ES" | "VI"]> = [
  [/^en(-|$)/i, "EN"],
  [/^(zh|yue)(-|$)/i, "ZH"],
  [/^ko(-|$)/i, "KO"],
  [/^ja(-|$)/i, "JA"],
  [/^hi(-|$)/i, "HI"],
  [/^ar(-|$)/i, "AR"],
  [/^es(-|$)/i, "ES"],
  [/^vi(-|$)/i, "VI"],
];

/** Map a browser language list to the Quest interface language. First match wins. */
export function langFromBrowserTags(tags: readonly string[]): "EN" | "ZH" | "KO" | "JA" | "HI" | "AR" | "ES" | "VI" | null {
  for (const tag of tags) {
    const trimmed = tag.trim();
    if (!trimmed) continue;
    for (const [pattern, code] of UI_TO_CODE) {
      if (pattern.test(trimmed)) return code;
    }
  }
  return null;
}

/** Hong Kong / Traditional tags use zh-HK. Mainland and unspecified Chinese use zh-CN. */
export function chineseVariant(tags: readonly string[]): "zh-HK" | "zh-CN" {
  const normalised = tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const traditional = normalised.some((tag) =>
    tag.startsWith("zh-hk") ||
    tag.startsWith("zh-mo") ||
    tag.startsWith("zh-tw") ||
    tag.includes("hant") ||
    tag.startsWith("yue")
  );
  if (traditional) return "zh-HK";
  return "zh-CN";
}

/**
 * Story locale follows the interface language.
 * Chinese interface copy is Traditional when the browser asks for it, otherwise Simplified.
 */
export function resolveStoryLocale(uiLang: string, browserTags: readonly string[]): StoryLocale {
  if (uiLang.toUpperCase() !== "ZH") return "en";
  return chineseVariant(browserTags);
}

export function speechLangFor(locale: StoryLocale): string {
  if (locale === "zh-HK") return "zh-HK";
  if (locale === "zh-CN") return "zh-CN";
  return "en-GB";
}

export function storytellerProsody(locale: StoryLocale): { rate: number; pitch: number } {
  // Slightly slower than a newsreader. English pitch sits a little warmer;
  // Chinese pitch stays level so tones remain intelligible.
  if (locale === "en") return { rate: 0.84, pitch: 1.04 };
  return { rate: 0.86, pitch: 1 };
}

export interface VoiceLike {
  name: string;
  lang: string;
  voiceURI?: string;
}

const WARM_EN = /female|samantha|karen|moira|fiona|serena|libby|sonia|kate|martha|natural|premium|enhanced|neural/i;
const COLD_EN = /\bmale\b|\bdavid\b|\bdaniel\b|\balex\b|\bfred\b|\brishi\b|\bgeorge\b|\bmark\b|\bguy\b|\bryan\b/i;
const WARM_HK = /sinji|sin-ji|meijia|sinji|香港|粵|粤/i;
const WARM_CN = /xiaoxiao|xiaoyi|yaoyao|ting-ting|tingting|huihui|xiaoxuan/i;
const COLD_CN = /yunyang|kangkang|yunjian/i;

function scoreVoice(voice: VoiceLike, locale: StoryLocale): number {
  const lang = voice.lang.toLowerCase();
  const name = voice.name;
  if (locale === "en") {
    if (!lang.startsWith("en")) return -1;
    let score = 10;
    if (lang.startsWith("en-gb")) score += 100;
    else if (lang.startsWith("en-ie") || lang.startsWith("en-au")) score += 60;
    else if (lang.startsWith("en-us")) score += 40;
    if (WARM_EN.test(name)) score += 50;
    if (COLD_EN.test(name)) score -= 60;
    return score;
  }
  if (locale === "zh-HK") {
    const chinese = lang.startsWith("zh") || lang.startsWith("yue");
    if (!chinese) return -1;
    let score = 10;
    if (lang.startsWith("zh-hk") || lang.startsWith("yue")) score += 100;
    else if (lang.startsWith("zh-tw") || lang.includes("hant")) score += 70;
    else if (lang.startsWith("zh-cn")) score += 15;
    if (WARM_HK.test(name)) score += 40;
    return score;
  }
  const chinese = lang.startsWith("zh") || lang.startsWith("yue");
  if (!chinese) return -1;
  let score = 10;
  if (lang.startsWith("zh-cn") || lang.includes("hans")) score += 100;
  else if (lang.startsWith("zh-hk") || lang.startsWith("zh-tw")) score += 15;
  if (WARM_CN.test(name)) score += 40;
  if (COLD_CN.test(name)) score -= 30;
  return score;
}

/** Prefer a warm narrative voice in the story language. Null when the browser has none. */
export function pickStorytellerVoice(voices: readonly VoiceLike[], locale: StoryLocale): VoiceLike | null {
  let best: VoiceLike | null = null;
  let bestScore = 0;
  for (const voice of voices) {
    const score = scoreVoice(voice, locale);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

export interface StoryPassage {
  lang: string;
  text: string;
  locale: StoryLocale;
}

export interface LocalizedRelay {
  number: number;
  xpReward: number;
  locale: StoryLocale;
  speechLang: string;
  subtitle: string;
  quote: string;
  quoteAuthor: string;
  narrative: string;
  missionObjective: string;
  labels: StoryChrome;
}

export function localizeRelayStory(number: number, locale: StoryLocale): LocalizedRelay | null {
  const story = getRelayStory(number);
  if (!story) return null;
  return {
    number: story.number,
    xpReward: story.xpReward,
    locale,
    speechLang: speechLangFor(locale),
    subtitle: story.subtitle[locale],
    quote: story.quote[locale],
    quoteAuthor: story.quoteAuthor,
    narrative: story.narrative[locale],
    missionObjective: story.missionObjective[locale],
    labels: CHROME[locale],
  };
}

export function splitStorySentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?。！？])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

/**
 * Spoken order: mission briefing, relay line, objective, the story, the quote, the author.
 * No extra narration is added.
 */
export function buildStoryScript(story: LocalizedRelay): StoryPassage[] {
  const relayLine = `${story.labels.relayOf.replace("{n}", String(story.number))} — ${story.subtitle}`;
  const chunks = [
    story.labels.briefing,
    relayLine,
    story.missionObjective,
    story.labels.story,
    ...splitStorySentences(story.narrative),
    story.quote,
    story.quoteAuthor,
  ];
  return chunks.filter(Boolean).map((text) => ({
    lang: story.speechLang,
    text,
    locale: story.locale,
  }));
}
