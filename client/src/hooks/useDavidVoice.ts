/**
 * DAVID Voice Narration — Web Speech API text-to-speech
 * Provides a narrator voice for key discovery moments.
 * Separate toggle from sound effects (voice vs SFX).
 * Persisted to localStorage.
 */

// ─── Global Voice State ───
const VOICE_KEY = "tre_voice_enabled";

let _voiceEnabled: boolean | null = null;

function isVoiceEnabled(): boolean {
  if (_voiceEnabled === null) {
    if (typeof localStorage !== "undefined") {
      // Default to OFF — user opts in
      _voiceEnabled = localStorage.getItem(VOICE_KEY) === "true";
    } else {
      _voiceEnabled = false;
    }
  }
  return _voiceEnabled;
}

export function getVoiceEnabled(): boolean {
  return isVoiceEnabled();
}

export function setVoiceEnabled(enabled: boolean) {
  _voiceEnabled = enabled;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(VOICE_KEY, enabled ? "true" : "false");
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tre-voice-change", { detail: enabled }));
  }
}

export function toggleVoiceEnabled(): boolean {
  const next = !isVoiceEnabled();
  setVoiceEnabled(next);
  return next;
}

// ─── Speech Synthesis ───

let _preferredVoice: SpeechSynthesisVoice | null = null;
let _voicesLoaded = false;

/**
 * Find the best DAVID-like voice:
 * Prefer a deep British English male voice.
 * Falls back to any English voice, then default.
 */
function findBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Priority list of voice name patterns (deep, authoritative, male)
  const preferred = [
    // Google voices (Chrome)
    /google uk english male/i,
    /google us english/i,
    // Microsoft voices (Edge)
    /microsoft ryan/i,
    /microsoft guy/i,
    /microsoft mark/i,
    /microsoft david/i,
    // Apple voices (Safari)
    /daniel/i,
    /alex/i,
    /oliver/i,
    // Generic English male
    /english.*male/i,
    /male.*english/i,
  ];

  for (const pattern of preferred) {
    const match = voices.find(v => pattern.test(v.name));
    if (match) return match;
  }

  // Fallback: any en-GB or en-US voice
  const enGB = voices.find(v => v.lang.startsWith("en-GB"));
  if (enGB) return enGB;

  const enUS = voices.find(v => v.lang.startsWith("en-US"));
  if (enUS) return enUS;

  // Last resort: any English voice
  const anyEn = voices.find(v => v.lang.startsWith("en"));
  if (anyEn) return anyEn;

  return voices[0] || null;
}

function getVoice(): SpeechSynthesisVoice | null {
  if (_preferredVoice) return _preferredVoice;
  _preferredVoice = findBestVoice();
  return _preferredVoice;
}

// Listen for voices to load (some browsers load async)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    _preferredVoice = null; // Reset to re-evaluate
    _voicesLoaded = true;
  };
}

/**
 * Speak text as DAVID narrator.
 * Automatically skips if voice is disabled or speech synthesis unavailable.
 */
export function davidSpeak(text: string, options?: {
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}) {
  if (!isVoiceEnabled()) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getVoice();
  if (voice) utterance.voice = voice;

  // DAVID voice profile: measured, authoritative, slightly deep
  utterance.rate = options?.rate ?? 0.9;
  utterance.pitch = options?.pitch ?? 0.85;
  utterance.volume = options?.volume ?? 0.9;
  utterance.lang = "en-GB";

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing DAVID narration.
 */
export function davidStop() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/**
 * Check if speech synthesis is available in this browser.
 */
export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// ─── Pre-built narration lines for discovery moments ───

export function narrateDiscovery(inventionName: string, relayName: string) {
  const lines = [
    `${inventionName}. A pivotal discovery in the ${relayName} relay.`,
    `You've uncovered ${inventionName}. The ${relayName} story deepens.`,
    `${inventionName} revealed. Another thread in the ${relayName} web.`,
    `Excellent. ${inventionName}. The infrastructure of ${relayName} grows clearer.`,
    `${inventionName}. Every discovery builds the pattern.`,
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  davidSpeak(line);
}

export function narrateRelayIntro(relayName: string, era: string) {
  davidSpeak(
    `Welcome to Relay ${relayName}. Era: ${era}. Tap to discover the inventions that shaped this chapter of civilisation.`,
    { rate: 0.85 }
  );
}

export function narrateRelayComplete(relayName: string) {
  davidSpeak(
    `Outstanding. Relay ${relayName} is complete. Every invention discovered. The pattern grows stronger.`,
    { rate: 0.85 }
  );
}

export function narrateBadgeEarned(badgeName: string) {
  davidSpeak(
    `Achievement unlocked. ${badgeName}. Your journey through the infrastructure odyssey is recognised.`,
    { rate: 0.85, pitch: 0.9 }
  );
}
