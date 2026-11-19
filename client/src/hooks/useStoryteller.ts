import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveStoryLocale, type StoryLocale, type StoryPassage } from "@/lib/storyLocale";
import {
  browserStorySynth,
  isSpeechSynthesisAvailable,
  StorytellerEngine,
  type StoryPhase,
} from "@/lib/storyteller";

export type { StoryPhase };

function browserTags(): string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages && navigator.languages.length > 0) return [...navigator.languages];
  return navigator.language ? [navigator.language] : [];
}

/** Interface language, then the browser list, decides which authored story is spoken. */
export function useStoryLocale(): StoryLocale {
  const { lang } = useLanguage();
  const [tags] = useState(browserTags);
  return resolveStoryLocale(lang, tags);
}

/**
 * Listen / pause / stop for one relay script.
 * Speech starts only from listen(). Changing relay or language stops it.
 * Unmount cancels any utterance still in the browser queue.
 */
export function useStoryteller(passages: readonly StoryPassage[], scriptKey: string) {
  const [phase, setPhase] = useState<StoryPhase>("idle");
  const [available] = useState(isSpeechSynthesisAvailable);
  const passagesRef = useRef(passages);
  passagesRef.current = passages;
  const engineRef = useRef<StorytellerEngine | null>(null);

  useEffect(() => {
    const synth = browserStorySynth();
    if (!synth) return;
    const engine = new StorytellerEngine(synth, () => passagesRef.current, setPhase);
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.stop();
  }, [scriptKey]);

  const listen = useCallback(() => engineRef.current?.listen(), []);
  const pause = useCallback(() => engineRef.current?.pause(), []);
  const resume = useCallback(() => engineRef.current?.resume(), []);
  const stop = useCallback(() => engineRef.current?.stop(), []);

  return { phase, available, listen, pause, resume, stop };
}
