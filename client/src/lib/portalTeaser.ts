import { TEASER_SRC } from "@shared/exhibitionPortal";
import { normaliseQuestPath } from "@shared/questPaths";
import { declareStoryPlayback } from "@/lib/storyAudio";

/** One element for the life of the app, so the opening tap can start the teaser. */
export const PORTAL_TEASER_ID = "portal-teaser-bed";

export type TeaserFace = "pending" | "audible" | "blocked";

let gestureAttempt: Promise<boolean> | null = null;
let slot: HTMLElement | null = null;
const faceListeners = new Set<(face: TeaserFace) => void>();
const slotListeners = new Set<(node: HTMLElement | null) => void>();

function video(): HTMLVideoElement | null {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById(PORTAL_TEASER_ID);
  return existing instanceof HTMLVideoElement ? existing : null;
}

export function setPortalTeaserSlot(node: HTMLElement | null): void {
  slot = node;
  slotListeners.forEach((listener) => listener(node));
}

export function subscribePortalTeaserSlot(listener: (node: HTMLElement | null) => void): () => void {
  slotListeners.add(listener);
  listener(slot);
  return () => slotListeners.delete(listener);
}

function notify(face: TeaserFace): void {
  faceListeners.forEach((listener) => listener(face));
}

export function subscribePortalTeaserFace(listener: (face: TeaserFace) => void): () => void {
  faceListeners.add(listener);
  return () => faceListeners.delete(listener);
}

function audible(node: HTMLVideoElement): boolean {
  return !node.paused && !node.muted;
}

/**
 * Start FILM-0126 in the same tap that opens /portal.
 * A later effect must not call play() again: that second call is outside the
 * gesture and iPhone Safari answers it by muting the film.
 */
export function beginPortalTeaserFromGesture(): Promise<boolean> {
  const node = video();
  if (!node) return Promise.resolve(false);
  declareStoryPlayback();
  if (audible(node)) return Promise.resolve(true);
  if (gestureAttempt && !node.muted) return gestureAttempt;
  node.muted = false;
  node.loop = true;
  node.playsInline = true;
  if (node.ended) node.currentTime = 0;
  const pending = node.play();
  const done = (pending ?? Promise.resolve())
    .then(() => audible(node))
    .catch(() => false);
  gestureAttempt = done;
  void done.then((ok) => {
    if (gestureAttempt === done) gestureAttempt = null;
    notify(ok ? "audible" : "blocked");
  });
  return done;
}

/** Arrival. Reuses the gesture play() when one is already in flight. */
export function claimPortalArrival(): Promise<boolean> {
  const node = video();
  if (!node) return Promise.resolve(false);
  if (audible(node)) {
    notify("audible");
    return Promise.resolve(true);
  }
  if (gestureAttempt) return gestureAttempt;
  return beginPortalTeaserFromGesture();
}

/** Cold visit only. The picture may move while the one tap is still owed. */
export function keepPictureMoving(): void {
  const node = video();
  if (!node || audible(node)) return;
  node.muted = true;
  node.loop = true;
  const pending = node.play();
  if (pending) pending.catch(() => undefined);
  notify("blocked");
}

export function pausePortalTeaser(): void {
  video()?.pause();
  gestureAttempt = null;
}

export function portalTeaserSrc(): string {
  return TEASER_SRC;
}

/** True when an anchor is the in-app door to the portal, not the epilogue. /portal/ is the same door. */
export function isPortalDoorHref(href: string | null): boolean {
  if (!href) return false;
  const path = normaliseQuestPath(href);
  return path === "/portal" || path.startsWith("/portal?") || path.startsWith("/portal#");
}
