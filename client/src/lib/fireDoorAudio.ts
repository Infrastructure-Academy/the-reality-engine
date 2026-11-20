import type { Invention } from "@shared/inventions";

/** Looping crackle with a low drum pulse. Quieter than the story and the card reads. */
export const FIRE_AMBIENCE_URL = "/audio/fire-ambience.mp3";

/** Spoken story stays at full level. Ambience sits underneath it. */
export const FIRE_AMBIENCE_UNDER_STORY = 0.18;

/** A tapped card is the voice in front. The fire bed drops further. */
export const FIRE_AMBIENCE_UNDER_CARD = 0.08;

export function fireCardSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function fireCardVoiceUrl(name: string): string {
  return `/audio/fire-cards/${fireCardSlug(name)}.mp3`;
}

/** The card's own name and description. No extra wording. */
export function fireCardSpeech(card: Pick<Invention, "name" | "description">): string {
  return `${card.name}. ${card.description}`;
}

export interface FireMix {
  story: "idle" | "playing" | "paused";
  ambience: "idle" | "playing";
  ambienceLevel: number;
  card: "idle" | "playing";
  resumeStory: boolean;
}

export function fireDoorOpened(blocked: boolean): FireMix {
  if (blocked) {
    return {
      story: "idle",
      ambience: "idle",
      ambienceLevel: FIRE_AMBIENCE_UNDER_STORY,
      card: "idle",
      resumeStory: false,
    };
  }
  return {
    story: "playing",
    ambience: "playing",
    ambienceLevel: FIRE_AMBIENCE_UNDER_STORY,
    card: "idle",
    resumeStory: false,
  };
}

export function fireDoorGesture(state: FireMix): FireMix {
  if (state.story === "playing" || state.card === "playing") return state;
  return fireDoorOpened(false);
}

export function fireCardTapped(state: FireMix): FireMix {
  return {
    story: state.story === "playing" ? "paused" : state.story,
    ambience: "playing",
    ambienceLevel: FIRE_AMBIENCE_UNDER_CARD,
    card: "playing",
    resumeStory: state.story === "playing" || state.resumeStory,
  };
}

export function fireCardFinished(state: FireMix): FireMix {
  return {
    story: state.resumeStory ? "playing" : state.story === "playing" ? "paused" : state.story,
    ambience: state.ambience,
    ambienceLevel: FIRE_AMBIENCE_UNDER_STORY,
    card: "idle",
    resumeStory: false,
  };
}
