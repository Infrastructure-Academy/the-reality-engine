/**
 * Storyteller speech session, used when a relay has no recorded track.
 * Speaks only after listen() — never from construction.
 * The first utterance is spoken inside the tap. Speaking is reported only from onstart,
 * so a browser that accepts the call and stays silent does not light Speaking first.
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
  private intent: StoryPhase = "idle";
  private keepAlive: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly synth: StorySynth,
    private readonly readPassages: () => readonly StoryPassage[],
    private readonly onPhase: (phase: StoryPhase) => void,
  ) {}

  listen() {
    const passages = this.readPassages();
    if (passages.length === 0) return;
    this.generation += 1;
    this.synth.cancel();
    this.index = 0;
    this.intent = "speaking";
    // Stay idle until onstart. A queued speak that produces nothing must not say Speaking.
    if (this.phase !== "idle") this.setPhase("idle");
    this.speakIndex(0);
  }

  pause() {
    if (this.intent !== "speaking") return;
    this.generation += 1;
    this.intent = "paused";
    this.synth.cancel();
    this.clearKeepAlive();
    this.setPhase("paused");
  }

  resume() {
    if (this.intent !== "paused") return;
    this.intent = "speaking";
    this.speakIndex(this.index);
  }

  stop() {
    this.generation += 1;
    this.intent = "idle";
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
    if (this.intent !== "speaking") return;
    if (index >= passages.length) {
      this.intent = "idle";
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
      onstart: () => {
        if (generation !== this.generation) return;
        if (this.intent !== "speaking") return;
        this.setPhase("speaking");
      },
      onend: () => {
        if (generation !== this.generation) return;
        if (this.intent !== "speaking") return;
        this.speakIndex(index + 1);
      },
      onerror: (error) => {
        if (generation !== this.generation) return;
        if (error === "interrupted" || error === "canceled" || error === "cancelled") return;
        if (this.intent !== "speaking") return;
        // A failure before any sound must not march through the script as if it were speaking.
        if (this.phase !== "speaking") {
          this.intent = "idle";
          this.clearKeepAlive();
          this.setPhase("idle");
          return;
        }
        this.speakIndex(index + 1);
      },
    };
    this.ensureKeepAlive();
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
      spoken.lang = utterance.lang;
      spoken.rate = utterance.rate;
      spoken.pitch = utterance.pitch;
      spoken.volume = 1;
      if (utterance.voice) {
        const match = synth.getVoices().find((voice) =>
          voice.name === utterance.voice?.name && voice.lang === utterance.voice?.lang
        );
        if (match) spoken.voice = match;
      }
      spoken.onstart = () => utterance.onstart?.();
      spoken.onend = () => utterance.onend?.();
      spoken.onerror = (event) => utterance.onerror?.(event.error);
      synth.speak(spoken);
      // iOS leaves the synth paused after cancel(). resume() has to happen in this same tap.
      synth.resume();
    },
  };
}
