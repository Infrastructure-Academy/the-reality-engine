/**
 * DAVID prologue — six distinct beats before Relay 1 (Fire).
 * The final beat keeps its story text and still enters Relay 1.
 */
export type PrologueScene = {
  id: string;
  text: string;
  subtext: string;
  davidLine: string;
  visual: "clock" | "signal" | "human" | "david" | "choice" | "fire";
};

export const PROLOGUE_SCENES: PrologueScene[] = [
  {
    id: "scene1",
    text: "The clock reads one minute to midnight.",
    subtext: "Not a clock on a wall. The Civilisation Clock — the one that measures whether humanity remembers what it built.",
    davidLine: "The clock reads one minute to midnight. Not a clock on a wall. The Civilisation Clock. The one that measures whether humanity remembers what it built.",
    visual: "clock",
  },
  {
    id: "scene2",
    text: "Twelve thousand years of infrastructure — fire, roads, engines, satellites — reduced to a fading signal.",
    subtext: "The knowledge is still there. Scattered across twelve relays. But no one is listening.",
    davidLine: "Twelve thousand years of infrastructure. Fire. Roads. Engines. Satellites. All of it reduced to a fading signal. The knowledge is still there, scattered across twelve relays. But no one is listening.",
    visual: "signal",
  },
  {
    id: "scene3",
    text: "Except you.",
    subtext: "You are the last human after midnight. The one who chose to look back before moving forward.",
    davidLine: "Except you. You are the last human after midnight. The one who chose to look back before moving forward.",
    visual: "human",
  },
  {
    id: "scene4",
    text: "My name is DAVID.",
    subtext: "I am your guide through the twelve Civilisational Relays. Each one holds the inventions that built this world. Your mission: rediscover them. Every discovery pushes the clock back from midnight.",
    davidLine: "My name is DAVID. I am your guide through the twelve Civilisational Relays. Each one holds the inventions that built this world. Your mission is to rediscover them. Every discovery pushes the clock back from midnight.",
    visual: "david",
  },
  {
    id: "scene5",
    text: "But this is not just a journey of discovery.",
    subtext: "At the end of each relay, you will face a choice. A real dilemma from history. What you choose will shape who you become — Builder, Philosopher, Pragmatist, or Visionary.",
    davidLine: "But this is not just a journey of discovery. At the end of each relay, you will face a choice. A real dilemma from history. What you choose will shape who you become. Builder. Philosopher. Pragmatist. Or Visionary.",
    visual: "choice",
  },
  {
    id: "scene6",
    text: "The first relay awaits. Fire — the eternal constant.",
    subtext: "Are you ready to begin?",
    davidLine: "The first relay awaits. Fire. The eternal constant. Are you ready to begin?",
    visual: "fire",
  },
];

export const PROLOGUE_BEGIN_LABEL = "BEGIN RELAY 1";
