/**
 * Storyteller speech session.
 * Speaks only after listen() — never from construction.
 * Pause holds the current sentence. Stop cancels and returns to the start.
 * A caller must dispose() on navigation so speech does not continue off the page.
 */

import {
  pickStorytellerVoice,
  storytellerProsody,
  type StoryPassage,
  type VoiceLike,
} from "@/lib/storyLocale";

export type StoryPhase = "idle" | "speaking" | "paused";

export interface StoryUtterance {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  voice: VoiceLike | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((error: string) => void) | null;
}

export interface StorySynth {
  cancel: () => void;
  speak: (utterance: StoryUtterance) => void;
  resume: () => void;
  getVoices: () => readonly VoiceLike[];
}

let storytellerActive = false;

export function storytellerOwnsSpeech(): boolean {
  return storytellerActive;
}

export function setStorytellerOwnsSpeech(active: boolean) {
  storytellerActive = active;
}

export class StorytellerEngine {
  phase: StoryPhase = "idle";
  index = 0;
  private generation = 0;
  private keepAlive: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly synth: StorySynth,
    private readonly readPassages: () => readonly StoryPassage[],
    private readonly onPhase: (phase: StoryPhase) => void,
  ) {}

  listen() {
    const passages = this.readPassages();
    if (passages.length === 0) return;
    // iOS drops speech when cancel() and speak() happen in the same tap.
    // From idle the queue is already empty, so the first speak stays in the gesture.
    if (this.phase !== "idle") {
      this.generation += 1;
      this.synth.cancel();
      this.clearKeepAlive();
    }
    this.index = 0;
    this.speakIndex(0);
  }

  pause() {
    this.generation += 1;
    this.synth.cancel();
    this.clearKeepAlive();
    if (this.phase === "speaking") this.setPhase("paused");
  }

  resume() {
    if (this.phase !== "paused") return;
    this.speakIndex(this.index);
  }

  stop() {
    this.generation += 1;
    this.synth.cancel();
    this.clearKeepAlive();
    this.index = 0;
    this.setPhase("idle");
  }

  dispose() {
    this.stop();
  }

  private setPhase(phase: StoryPhase) {
    this.phase = phase;
    setStorytellerOwnsSpeech(phase !== "idle");
    this.onPhase(phase);
  }

  private speakIndex(index: number) {
    const passages = this.readPassages();
    if (index >= passages.length) {
      this.clearKeepAlive();
      this.index = 0;
      this.setPhase("idle");
      return;
    }
    const passage = passages[index];
    this.index = index;
    const generation = ++this.generation;
    const prosody = storytellerProsody(passage.locale);
    const voice = pickStorytellerVoice(this.synth.getVoices(), passage.locale);
    const utterance: StoryUtterance = {
      text: passage.text,
      lang: passage.lang,
      rate: prosody.rate,
      pitch: prosody.pitch,
      voice,
      // Speaking is lit only after the browser accepts the utterance.
      // Setting it on the tap made iPhone show SPEAKING with no sound.
      onstart: () => {
        if (generation !== this.generation) return;
        this.setPhase("speaking");
        this.ensureKeepAlive();
      },
      onend: () => {
        if (generation !== this.generation) return;
        if (this.phase !== "speaking") return;
        this.speakIndex(index + 1);
      },
      onerror: (error) => {
        if (generation !== this.generation) return;
        if (error === "interrupted" || error === "canceled" || error === "cancelled") return;
        if (this.phase !== "speaking") {
          this.clearKeepAlive();
          this.setPhase("idle");
          return;
        }
        this.speakIndex(index + 1);
      },
    };
    this.synth.speak(utterance);
  }

  private ensureKeepAlive() {
    if (this.keepAlive != null) return;
    // Some browsers suspend a long utterance unless resume() is nudged.
    this.keepAlive = setInterval(() => {
      if (this.phase === "speaking") this.synth.resume();
    }, 10000);
    const timer = this.keepAlive as { unref?: () => void };
    timer.unref?.();
  }

  private clearKeepAlive() {
    if (this.keepAlive == null) return;
    clearInterval(this.keepAlive);
    this.keepAlive = null;
  }
}

export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Adapt the browser Web Speech API. No network and no key. */
export function browserStorySynth(): StorySynth | null {
  if (!isSpeechSynthesisAvailable()) return null;
  const synth = window.speechSynthesis;
  return {
    cancel: () => synth.cancel(),
    resume: () => synth.resume(),
    getVoices: () => synth.getVoices(),
    speak: (utterance) => {
      const spoken = new SpeechSynthesisUtterance(utterance.text);
      const voices = synth.getVoices();
      let lang = utterance.lang;
      if (utterance.voice) {
        const match = voices.find((voice) =>
          voice.name === utterance.voice?.name && voice.lang === utterance.voice?.lang
        );
        if (match) spoken.voice = match;
      }
      // iOS stays silent if lang is en-GB and that voice was never installed.
      if (!spoken.voice && lang.toLowerCase().startsWith("en-gb") && voices.length > 0) {
        const hasBritish = voices.some((voice) => voice.lang.toLowerCase().startsWith("en-gb"));
        if (!hasBritish) {
          const english = voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
          if (english) lang = english.lang;
        }
      }
      spoken.lang = lang;
      spoken.rate = utterance.rate;
      spoken.pitch = utterance.pitch;
      spoken.volume = 1;
      spoken.onstart = () => utterance.onstart?.();
      spoken.onend = () => utterance.onend?.();
      spoken.onerror = (event) => utterance.onerror?.(event.error);
      synth.speak(spoken);
      // iOS often leaves the utterance paused, with speaking still true.
      if (synth.paused) synth.resume();
      synth.resume();
    },
  };
}
