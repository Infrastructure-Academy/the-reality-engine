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

/**
 * Unique DAVID narration for each relay summary card.
 * Each relay gets a bespoke spoken line reflecting its civilisational significance.
 * Called when the RelaySummaryCard appears between relay transitions.
 */
const RELAY_SUMMARY_NARRATIONS: Record<number, string[]> = {
  1: [
    "Fire. The eternal constant. Without this relay, none of the others exist. You've touched the foundation of all infrastructure.",
    "From the first controlled flame came warmth, cooking, and community. Fire is where the human story begins.",
  ],
  2: [
    "The Tree relay. Living foundations that gave us shelter, tools, and the first permanent structures. Roots run deep.",
    "Trees taught humanity to build upward. From timber frames to paper, the living foundation shaped civilisation.",
  ],
  3: [
    "Rivers. The cradles of continuity. Every great civilisation began beside water. Mesopotamia, the Indus, the Nile.",
    "Where rivers flow, cities grow. You've traced the waterways that connected the ancient world.",
  ],
  4: [
    "The Horse. Velocity of intent. Suddenly, distance collapsed. Empires could communicate, trade, and conquer.",
    "Before the horse, the world was walking pace. After it, the steppe nomads rewrote the map of power.",
  ],
  5: [
    "Roads. The arteries of intent. Rome didn't just build roads — it built the concept of connection as infrastructure.",
    "Every road is a promise that two places matter enough to link. The Romans understood this better than anyone.",
  ],
  6: [
    "Ships. The master weaver's reach. When sails caught wind, continents stopped being separate worlds.",
    "The age of sail connected every coastline on Earth. Trade, culture, and ideas flowed across oceans.",
  ],
  7: [
    "The Loom. The binary birth. Jacquard's punch cards didn't just weave fabric — they wove the logic of computing.",
    "From silk threads to silicon threads. The loom is where the digital age was born, centuries before anyone knew it.",
  ],
  8: [
    "Rail. Standardising the continental rhythm. For the first time, clocks had to agree. Time zones exist because of trains.",
    "Steel rails stitched nations together. The railway didn't just move goods — it synchronised civilisation.",
  ],
  9: [
    "The Engine. The internal revolution. Combustion gave every individual the power of a hundred horses.",
    "When the engine roared to life, it wasn't just mechanics — it was personal freedom, mechanised.",
  ],
  10: [
    "The Triple Convergence. Aviation, automobile, and assembly. Three technologies that compressed the twentieth century.",
    "Flight, the production line, and the motor car. Together they made the modern world inevitable.",
  ],
  11: [
    "Orbit. The programmable frontier. Satellites, the internet, GPS. The invisible infrastructure you use every second.",
    "From Sputnik to starlink. The orbital relay is the infrastructure you can't see but can't live without.",
  ],
  12: [
    "Human Nodes. The torus metaphor. You are the infrastructure now. Consciousness is the final relay.",
    "The twelfth relay is you. Every human node in the network carries the weight of twelve thousand years.",
  ],
};

export function narrateRelaySummary(relayNumber: number, inventionsFound: number, totalInventions: number) {
  const lines = RELAY_SUMMARY_NARRATIONS[relayNumber];
  if (!lines || lines.length === 0) return;
  const line = lines[Math.floor(Math.random() * lines.length)];
  
  // Add a performance comment if they found everything
  const suffix = inventionsFound >= totalInventions
    ? " Perfect discovery. Every invention accounted for."
    : inventionsFound > totalInventions * 0.7
    ? " Strong work. Most of the relay's secrets are yours."
    : "";
  
  davidSpeak(line + suffix, { rate: 0.85, pitch: 0.85 });
}

export function narrateBadgeEarned(badgeName: string) {
  davidSpeak(
    `Achievement unlocked. ${badgeName}. Your journey through the infrastructure odyssey is recognised.`,
    { rate: 0.85, pitch: 0.9 }
  );
}
