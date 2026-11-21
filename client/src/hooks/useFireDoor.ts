import { useCallback, useEffect, useRef } from "react";
import {
  FIRE_AMBIENCE_UNDER_CARD,
  FIRE_AMBIENCE_UNDER_STORY,
  FIRE_AMBIENCE_URL,
  fireCardVoiceUrl,
} from "@/lib/fireDoorAudio";
import {
  beginFireBedFromGesture,
  fireBedAttempt,
  fireBedSettled,
  pauseFireBed,
  setFireAmbienceLevel,
} from "@/lib/firePlayback";
import { declareStoryPlayback } from "@/lib/storyAudio";
import type { StoryPlayHandle } from "@/components/StoryPlayBar";

/**
 * Recorded briefing plus fire crackle for the Fire door.
 * The click that opens the hall starts both tracks. If that click was spent on
 * navigation, or the browser blocked one of them, the next tap starts both
 * again. A card voice pauses the briefing until the card ends.
 * The preview video is never started here.
 */
export function useFireDoor(active: boolean) {
  const storyRef = useRef<StoryPlayHandle>(null);
  const ambienceRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLAudioElement>(null);
  const started = useRef(false);

  const setAmbience = useCallback((level: number) => {
    setFireAmbienceLevel(level);
  }, []);

  const beginBed = useCallback((quiet: boolean) => {
    declareStoryPlayback();
    const attempt = beginFireBedFromGesture();
    const pending = storyRef.current?.begin({ quiet });
    const story = pending ?? attempt.story;
    return Promise.all([story, attempt.ambience]).then(([storyResult, ambienceResult]) => {
      void storyResult;
      void ambienceResult;
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    started.current = false;
    let removeGesture = () => {};
    let cancelled = false;

    const armGesture = () => {
      const onDown = () => {
        if (started.current) return;
        beginBed(false)
          .then(() => {
            if (!fireBedSettled(true, true)) return;
            started.current = true;
            window.removeEventListener("pointerdown", onDown, true);
          })
          .catch(() => {});
      };
      window.addEventListener("pointerdown", onDown, true);
      removeGesture = () => window.removeEventListener("pointerdown", onDown, true);
    };

    const settle = (storyOk: Promise<unknown>, ambienceOk: Promise<unknown>) => {
      Promise.all([storyOk, ambienceOk])
        .then(() => {
          if (cancelled) return;
          if (!fireBedSettled(true, true)) {
            armGesture();
            return;
          }
          started.current = true;
        })
        .catch(() => {
          if (!cancelled) armGesture();
        });
    };

    const existing = fireBedAttempt();
    if (existing) {
      settle(existing.story, existing.ambience);
    } else {
      const attempt = beginFireBedFromGesture();
      const pending = storyRef.current?.begin({ quiet: true });
      settle(pending ?? attempt.story, attempt.ambience);
    }

    return () => {
      cancelled = true;
      removeGesture();
      pauseFireBed();
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
