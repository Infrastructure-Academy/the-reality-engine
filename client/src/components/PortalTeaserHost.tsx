import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { TEASER_SRC } from "@shared/exhibitionPortal";
import {
  PORTAL_TEASER_ID,
  beginPortalTeaserFromGesture,
  claimPortalArrival,
  isPortalDoorHref,
  keepPictureMoving,
  pausePortalTeaser,
  subscribePortalTeaserSlot,
} from "@/lib/portalTeaser";

function onPortalPath(location: string): boolean {
  return isPortalDoorHref(location);
}

/**
 * One film element for the whole visit. A tap on a /portal link starts it
 * with sound. The portal frame then shows that same element. A later effect
 * must not call play() again.
 */
export function PortalTeaserHost() {
  const [location] = useLocation();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const onPortal = onPortalPath(location);
  const placed = Boolean(slot && onPortal);

  useEffect(() => subscribePortalTeaserSlot(setSlot), []);

  useEffect(() => {
    const startFromLink = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link || !isPortalDoorHref(link.getAttribute("href"))) return;
      void beginPortalTeaserFromGesture();
    };
    document.addEventListener("pointerdown", startFromLink, true);
    document.addEventListener("click", startFromLink, true);
    return () => {
      document.removeEventListener("pointerdown", startFromLink, true);
      document.removeEventListener("click", startFromLink, true);
    };
  }, []);

  useEffect(() => {
    if (!onPortal) {
      pausePortalTeaser();
      return;
    }
    let cancel = false;
    void claimPortalArrival().then((ok) => {
      if (cancel || ok) return;
      keepPictureMoving();
    });
    return () => {
      cancel = true;
    };
  }, [onPortal]);

  const film = (
    <video
      id={PORTAL_TEASER_ID}
      src={TEASER_SRC}
      loop
      playsInline
      preload="auto"
      data-testid="portal-entrance-teaser"
      aria-label="The whole exhibition. Halls 1 to 12, connected, on a loop."
      className={placed ? "h-[42svh] min-h-[240px] w-full bg-[#070b16] object-contain" : "pointer-events-none fixed h-[42svh] min-h-[240px] w-full max-w-3xl"}
      style={placed ? undefined : { left: "-9999px", top: 0 }}
      onEnded={(event) => {
        const node = event.currentTarget;
        node.currentTime = 0;
        if (node.muted) return;
        const pending = node.play();
        if (pending) pending.catch(() => undefined);
      }}
    />
  );

  if (placed && slot) return createPortal(film, slot);
  return film;
}
