import { useCallback, useEffect, useRef } from "react";
import {
  FIRE_AMBIENCE_UNDER_CARD,
  FIRE_AMBIENCE_UNDER_STORY,
  FIRE_AMBIENCE_URL,
  fireCardVoiceUrl,
} from "@/lib/fireDoorAudio";
import { declareStoryPlayback } from "@/lib/storyAudio";
import type { StoryPlayHandle } from "@/components/StoryPlayBar";

/**
 * Story recording plus fire ambience for the Fire door.
 * Tries to start when the door opens. If the browser blocks that, the next
 * tap anywhere starts both. A card voice pauses the story until the card ends.
 * The preview video is never started here.
 */
export function useFireDoor(active: boolean) {
  const storyRef = useRef<StoryPlayHandle>(null);
  const ambienceRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLAudioElement>(null);
  const started = useRef(false);

  const setAmbience = useCallback((level: number) => {
    const ambience = ambienceRef.current;
    if (!ambience) return;
    ambience.volume = level;
    if (ambience.paused) {
      const pending = ambience.play();
      pending?.catch(() => {});
    }
  }, []);

  const beginBed = useCallback((quiet: boolean) => {
    declareStoryPlayback();
    setAmbience(FIRE_AMBIENCE_UNDER_STORY);
    const pending = storyRef.current?.begin({ quiet });
    pending?.then(() => {
      started.current = true;
    }).catch(() => {});
    return pending ?? Promise.reject(new Error("story control missing"));
  }, [setAmbience]);

  useEffect(() => {
    if (!active) return;
    started.current = false;
    let removeGesture = () => {};
    const armGesture = () => {
      const onDown = () => {
        if (started.current) return;
        beginBed(false)?.then(() => {
          started.current = true;
          window.removeEventListener("pointerdown", onDown, true);
        }).catch(() => {});
      };
      window.addEventListener("pointerdown", onDown, true);
      removeGesture = () => window.removeEventListener("pointerdown", onDown, true);
    };
    beginBed(true)?.then(() => {
      started.current = true;
    }).catch(() => {
      armGesture();
    });
    return () => {
      removeGesture();
      ambienceRef.current?.pause();
      cardRef.current?.pause();
      started.current = false;
    };
  }, [active, beginBed]);

  const playCard = useCallback((name: string) => {
    const card = cardRef.current;
    if (!card) return;
    declareStoryPlayback();
    started.current = true;
    storyRef.current?.pauseForCard();
    setAmbience(FIRE_AMBIENCE_UNDER_CARD);
    card.src = fireCardVoiceUrl(name);
    const pending = card.play();
    pending?.catch(() => {
      setAmbience(FIRE_AMBIENCE_UNDER_STORY);
      storyRef.current?.resumeIfHeld();
    });
  }, [setAmbience]);

  const finishCard = useCallback(() => {
    setAmbience(FIRE_AMBIENCE_UNDER_STORY);
    storyRef.current?.resumeIfHeld();
  }, [setAmbience]);

  return { storyRef, ambienceRef, cardRef, playCard, finishCard, ambienceUrl: FIRE_AMBIENCE_URL };
}
