/**
 * Engagement FX — Enhanced feedback system addressing Jonathan Green's inspector feedback.
 * 
 * KEY IMPROVEMENTS:
 * 1. Web-typed discovery sounds — each of the 5 Great Webs has a distinct audio signature
 * 2. Streak combo system — consecutive discoveries trigger escalating feedback
 * 3. Milestone celebrations — 25%, 50%, 75%, 100% relay completion triggers
 * 4. Phase transition fanfares — Scholar mode phase changes feel significant
 * 5. Discovery variety — randomized pitch/timing so no two taps sound identical
 * 
 * All procedurally generated via Web Audio API — zero external files.
 */

import { getSoundMuted } from "./useSoundEffects";

// ─── Audio Context (shared with useSoundEffects) ───
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (getSoundMuted()) return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch { return null; }
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

// ─── Web-Typed Discovery Sounds ───
// Each web has a unique tonal character so the ear never habituates

const WEB_SOUND_PROFILES: Record<string, { baseFreq: number; type: OscillatorType; harmonics: number[]; decay: number }> = {
  Natural:       { baseFreq: 392, type: "sine",     harmonics: [1, 1.5, 2],    decay: 0.4 },   // G4 — warm, organic
  Machine:       { baseFreq: 330, type: "sawtooth", harmonics: [1, 2],          decay: 0.3 },   // E4 — metallic, industrial
  Digital:       { baseFreq: 523, type: "square",   harmonics: [1, 1.26, 1.5],  decay: 0.25 },  // C5 — crisp, digital
  Biological:    { baseFreq: 440, type: "sine",     harmonics: [1, 1.2, 1.5, 2], decay: 0.45 }, // A4 — flowing, alive
  Consciousness: { baseFreq: 587, type: "triangle", harmonics: [1, 1.5, 2, 3],  decay: 0.5 },   // D5 — ethereal, expansive
};

export function playWebTypedDiscovery(webType: string, streakCount: number = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const profile = WEB_SOUND_PROFILES[webType] || WEB_SOUND_PROFILES.Natural;

  // Randomize pitch slightly (+/- 5%) so no two taps are identical
  const pitchVariation = 0.95 + Math.random() * 0.1;
  // Streak raises pitch and adds shimmer
  const streakPitchBoost = 1 + Math.min(streakCount, 10) * 0.03;

  profile.harmonics.forEach((harmonic, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = profile.baseFreq * harmonic * pitchVariation * streakPitchBoost;

    osc.type = profile.type;
    osc.frequency.setValueAtTime(freq, now + i * 0.04);

    // Volume decreases for higher harmonics
    const vol = (0.12 - i * 0.025) * (1 + Math.min(streakCount, 5) * 0.05);
    gain.gain.setValueAtTime(0, now + i * 0.04);
    gain.gain.linearRampToValueAtTime(Math.max(vol, 0.02), now + i * 0.04 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + profile.decay);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.04);
    osc.stop(now + i * 0.04 + profile.decay + 0.05);
  });

  // Streak combo: add a rising arpeggio tail for streaks >= 3
  if (streakCount >= 3) {
    const arpeggioNotes = [1, 1.25, 1.5, 2].slice(0, Math.min(streakCount - 1, 4));
    arpeggioNotes.forEach((mult, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(profile.baseFreq * mult * streakPitchBoost, now + 0.15 + i * 0.06);
      gain.gain.setValueAtTime(0, now + 0.15 + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.15 + i * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15 + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.15 + i * 0.06);
      osc.stop(now + 0.15 + i * 0.06 + 0.25);
    });
  }
}

// ─── Milestone Fanfare ───
// Triggered at 25%, 50%, 75%, 100% completion — each level more elaborate

export function playMilestoneFanfare(level: 25 | 50 | 75 | 100) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Base chord: C major triad, gets richer at higher milestones
  const chords: Record<number, number[]> = {
    25:  [261.6, 329.6],                         // C4, E4
    50:  [261.6, 329.6, 392.0],                   // C4, E4, G4
    75:  [261.6, 329.6, 392.0, 523.3],            // C4, E4, G4, C5
    100: [261.6, 329.6, 392.0, 523.3, 659.3],     // C4, E4, G4, C5, E5
  };

  const notes = chords[level] || chords[25];
  const duration = level === 100 ? 1.5 : level === 75 ? 1.0 : 0.7;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = level >= 75 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.05);
    gain.gain.setValueAtTime(0, now + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.03);
    gain.gain.setValueAtTime(0.1, now + i * 0.05 + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + duration + 0.1);
  });

  // 100% gets a triumphant ascending run
  if (level === 100) {
    const run = [523.3, 587.3, 659.3, 784.0, 1046.5]; // C5 D5 E5 G5 C6
    run.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.8 + i * 0.08);
      gain.gain.setValueAtTime(0, now + 0.8 + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.8 + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.8 + i * 0.08);
      osc.stop(now + 0.8 + i * 0.08 + 0.5);
    });
  }
}

// ─── Phase Transition Sound (Scholar mode) ───
export function playPhaseTransition() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Whoosh + ascending bell tone
  const sweep = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  sweep.type = "sawtooth";
  sweep.frequency.setValueAtTime(200, now);
  sweep.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
  sweepGain.gain.setValueAtTime(0.04, now);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  sweep.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  sweep.start(now);
  sweep.stop(now + 0.35);

  // Bell tone
  [659.3, 784.0].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + 0.15 + i * 0.1);
    gain.gain.setValueAtTime(0, now + 0.15 + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.15 + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15 + i * 0.1 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.15 + i * 0.1);
    osc.stop(now + 0.15 + i * 0.1 + 0.55);
  });
}

// ─── Node Activation with Web Type (Flight Deck) ───
export function playWebTypedNodeActivation(webName: string) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const profile = WEB_SOUND_PROFILES[webName] || WEB_SOUND_PROFILES.Machine;

  // Deep resonant ping + web-specific overtone
  const fundamental = profile.baseFreq * 0.5;
  [fundamental, fundamental * 2].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i === 0 ? "sine" : profile.type;
    osc.frequency.setValueAtTime(freq * (0.98 + Math.random() * 0.04), now);
    gain.gain.setValueAtTime(i === 0 ? 0.1 : 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  });
}

// ─── Streak Haptics ───
export function hapticStreak(streakCount: number) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (streakCount <= 1) {
    navigator.vibrate([20, 30, 40]);
  } else if (streakCount <= 3) {
    navigator.vibrate([15, 20, 30, 20, 40]);
  } else if (streakCount <= 6) {
    navigator.vibrate([10, 15, 20, 15, 30, 15, 40]);
  } else {
    navigator.vibrate([10, 10, 15, 10, 20, 10, 25, 10, 35, 10, 50]);
  }
}

// ─── Milestone Haptic ───
export function hapticMilestone() {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate([50, 30, 80, 30, 120]);
}

// ─── Streak Tracker Hook ───
// Returns current streak count and a function to register a new discovery

let _lastDiscoveryTime = 0;
let _streakCount = 0;
const STREAK_WINDOW_MS = 3000; // 3 seconds between taps to maintain streak

export function registerDiscovery(): number {
  const now = Date.now();
  if (now - _lastDiscoveryTime < STREAK_WINDOW_MS) {
    _streakCount++;
  } else {
    _streakCount = 1;
  }
  _lastDiscoveryTime = now;
  return _streakCount;
}

export function getStreakCount(): number {
  if (Date.now() - _lastDiscoveryTime > STREAK_WINDOW_MS) {
    _streakCount = 0;
  }
  return _streakCount;
}

// ─── Milestone Detection ───
export function checkMilestone(discovered: number, total: number): 25 | 50 | 75 | 100 | null {
  if (total <= 0) return null;
  const pct = (discovered / total) * 100;
  const prevPct = ((discovered - 1) / total) * 100;

  if (pct >= 100 && prevPct < 100) return 100;
  if (pct >= 75 && prevPct < 75) return 75;
  if (pct >= 50 && prevPct < 50) return 50;
  if (pct >= 25 && prevPct < 25) return 25;
  return null;
}
