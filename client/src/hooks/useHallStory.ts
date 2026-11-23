import { useCallback, useEffect, useRef } from "react";
import type { StoryPlayHandle } from "@/components/StoryPlayBar";
import { hallStoryGeneration, pauseHallStoryIfStale } from "@/lib/hallStory";
import { declareStoryPlayback, relayCardVoiceUrl } from "@/lib/storyAudio";

/**
 * Sonia story for halls 2–12.
 * The opening tap may already have started the shared element. If Safari blocked
 * that, the next pointerdown starts it. A missing card file stays silent.
 */
export function useHallStory(active: boolean, audioUrl: string | null) {
  const storyRef = useRef<StoryPlayHandle>(null);
  const cardRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!active || !audioUrl) return;
    let started = false;
    let removeGesture = () => {};
    let cancelled = false;
    const seen = hallStoryGeneration();

    const armGesture = () => {
      const onDown = () => {
        if (started || cancelled) return;
        storyRef.current
          ?.begin()
          .then(() => {
            started = true;
            window.removeEventListener("pointerdown", onDown, true);
          })
          .catch(() => undefined);
      };
      window.addEventListener("pointerdown", onDown, true);
      removeGesture = () => window.removeEventListener("pointerdown", onDown, true);
    };

    const pending = storyRef.current?.begin({ quiet: true });
    if (!pending) {
      armGesture();
    } else {
      pending
        .then(() => {
          if (cancelled) return;
          started = true;
        })
        .catch(() => {
          if (!cancelled) armGesture();
        });
    }

    return () => {
      cancelled = true;
      removeGesture();
      cardRef.current?.pause();
      pauseHallStoryIfStale(seen);
    };
  }, [active, audioUrl]);

  const playCard = useCallback((relayNumber: number, name: string) => {
    const card = cardRef.current;
    const url = relayCardVoiceUrl(relayNumber, name);
    if (!card || !url) return;
    declareStoryPlayback();
    storyRef.current?.pauseForCard();
    card.src = url;
    const pending = card.play();
    pending?.catch(() => {
      storyRef.current?.resumeIfHeld();
    });
  }, []);

  const finishCard = useCallback(() => {
    storyRef.current?.resumeIfHeld();
  }, []);

  return { storyRef, cardRef, playCard, finishCard };
}
