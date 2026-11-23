/**
 * Spoken read-back for the Asset Capture plate.
 *
 * iPhone Safari speaks only when the first utterance starts inside the tap
 * that chose the photograph, and it drops the line when cancel() and speak()
 * share that tap. A later sentence is queued onto the same session.
 * The plate reads aloud as the action itself, so this does not consult the
 * separate DAVID voice switch.
 */

let keepAlive: ReturnType<typeof setInterval> | null = null;

function clearKeepAlive() {
  if (keepAlive == null) return;
  clearInterval(keepAlive);
  keepAlive = null;
}

function pickVoice(synth: SpeechSynthesis): { voice: SpeechSynthesisVoice | null; lang: string } {
  const voices = synth.getVoices();
  const british = voices.find((voice) => /daniel|oliver/i.test(voice.name))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en-gb"));
  if (british) return { voice: british, lang: british.lang };
  const english = voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (english) return { voice: english, lang: english.lang };
  return { voice: null, lang: "en-GB" };
}

export function plateSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak a plate line. Pass queue when a sentence is already in the session. */
export function speakPlate(text: string, options?: { queue?: boolean }): boolean {
  if (!plateSpeechAvailable() || !text.trim()) return false;
  const synth = window.speechSynthesis;
  const idle = !synth.speaking && !synth.pending;
  if (!options?.queue && !idle) synth.cancel();
  const voices = synth.getVoices();
  if (voices.length > 0 && !voices.some((voice) => voice.lang.toLowerCase().startsWith("en"))) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  const chosen = pickVoice(synth);
  if (chosen.voice && !chosen.voice.lang.toLowerCase().startsWith("en")) return false;
  if (chosen.voice) utterance.voice = chosen.voice;
  utterance.lang = "en-GB";
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.volume = 1;
  const release = () => {
    if (!synth.speaking && !synth.pending) clearKeepAlive();
  };
  utterance.onend = release;
  utterance.onerror = release;
  synth.speak(utterance);
  if (synth.paused) synth.resume();
  synth.resume();
  if (keepAlive == null) {
    keepAlive = setInterval(() => {
      if (synth.speaking || synth.pending) synth.resume();
      else clearKeepAlive();
    }, 4000);
  }
  return true;
}

export function stopPlateSpeech() {
  clearKeepAlive();
  if (!plateSpeechAvailable()) return;
  window.speechSynthesis.cancel();
}
