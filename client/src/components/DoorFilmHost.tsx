import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import {
  DOOR_FILM_ID,
  activeDoorIntro,
  beginDoorFilmFromGesture,
  claimDoorArrival,
  keepDoorPictureMoving,
  pauseDoorFilm,
  subscribeDoorFilmSlot,
} from "@/lib/doorFilmPlayback";
import { isQuestDoorHref } from "@shared/questDoorFilms";

/**
 * The door short lives for the whole visit. A tap on Explore, Flight or Scholar
 * starts that door's own film. The three doors never share one reel.
 */
export function DoorFilmHost() {
  const [location] = useLocation();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const intro = activeDoorIntro(location);
  const placed = Boolean(slot && intro);

  useEffect(() => subscribeDoorFilmSlot(setSlot), []);

  useEffect(() => {
    const startFromLink = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      const href = link?.getAttribute("href");
      if (!href || !isQuestDoorHref(href)) return;
      const film = activeDoorIntro(href);
      if (!film) return;
      void beginDoorFilmFromGesture(film.src);
    };
    document.addEventListener("pointerdown", startFromLink, true);
    document.addEventListener("click", startFromLink, true);
    return () => {
      document.removeEventListener("pointerdown", startFromLink, true);
      document.removeEventListener("click", startFromLink, true);
    };
  }, []);

  useEffect(() => {
    if (!intro) {
      pauseDoorFilm();
      return;
    }
    let cancel = false;
    void claimDoorArrival(intro.src).then((ok) => {
      if (cancel || ok) return;
      keepDoorPictureMoving(intro.src);
    });
    return () => {
      cancel = true;
    };
  }, [intro]);

  const film = (
    <video
      id={DOOR_FILM_ID}
      loop
      playsInline
      preload="auto"
      data-testid="door-film-intro"
      aria-label={intro ? intro.title : "Door film"}
      className={placed ? "aspect-video w-full bg-black object-cover" : "pointer-events-none fixed aspect-video w-full max-w-3xl"}
      style={placed ? undefined : { left: "-9999px", top: 0 }}
    />
  );

  if (placed && slot) return createPortal(film, slot);
  return film;
}
