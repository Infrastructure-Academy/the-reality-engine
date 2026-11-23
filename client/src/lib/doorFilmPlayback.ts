import { doorIntroForPath, exploreIntro, type ExploreDoorMode, type QuestFilm } from "@shared/questDoorFilms";

/** One element for the visit, so the tap that opens a door can start its short with sound. */
export const DOOR_FILM_ID = "quest-door-film";

export type DoorFace = "pending" | "audible" | "blocked";

let exploreMode: ExploreDoorMode = "spinner";
let gestureAttempt: Promise<boolean> | null = null;
let slot: HTMLElement | null = null;
const faceListeners = new Set<(face: DoorFace) => void>();
const slotListeners = new Set<(node: HTMLElement | null) => void>();

function video(): HTMLVideoElement | null {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById(DOOR_FILM_ID);
  return existing instanceof HTMLVideoElement ? existing : null;
}

function notify(face: DoorFace): void {
  faceListeners.forEach((listener) => listener(face));
}

function tail(src: string): string {
  const file = src.slice(src.lastIndexOf("/") + 1);
  try {
    return decodeURIComponent(file);
  } catch {
    return file;
  }
}

function sameFilm(node: HTMLVideoElement, src: string): boolean {
  const current = node.currentSrc || node.src || "";
  return tail(current) === tail(src);
}

function audible(node: HTMLVideoElement, src: string): boolean {
  return !node.paused && !node.muted && sameFilm(node, src);
}

function applySrc(node: HTMLVideoElement, src: string): void {
  if (!sameFilm(node, src)) node.src = src;
  node.loop = true;
  node.playsInline = true;
}

export function setExploreDoorMode(mode: ExploreDoorMode): void {
  exploreMode = mode;
}

export function resetExploreDoorMode(): void {
  exploreMode = "spinner";
}

export function activeDoorIntro(path: string): QuestFilm | null {
  const clean = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (clean === "/explore") return exploreIntro(exploreMode);
  return doorIntroForPath(path);
}

export function setDoorFilmSlot(node: HTMLElement | null): void {
  slot = node;
  slotListeners.forEach((listener) => listener(node));
}

export function subscribeDoorFilmSlot(listener: (node: HTMLElement | null) => void): () => void {
  slotListeners.add(listener);
  listener(slot);
  return () => slotListeners.delete(listener);
}

export function subscribeDoorFilmFace(listener: (face: DoorFace) => void): () => void {
  faceListeners.add(listener);
  return () => faceListeners.delete(listener);
}

/**
 * Start the door short inside the tap that opens the door.
 * iPhone Safari will mute a later play() that is outside that tap.
 */
export function beginDoorFilmFromGesture(src: string): Promise<boolean> {
  const node = video();
  if (!node) return Promise.resolve(false);
  applySrc(node, src);
  if (audible(node, src)) return Promise.resolve(true);
  node.muted = false;
  if (node.ended) node.currentTime = 0;
  const pending = node.play();
  const done = (pending ?? Promise.resolve())
    .then(() => audible(node, src))
    .catch(() => false);
  gestureAttempt = done;
  void done.then((ok) => {
    if (gestureAttempt === done) gestureAttempt = null;
    notify(ok ? "audible" : "blocked");
  });
  return done;
}

export function claimDoorArrival(src: string): Promise<boolean> {
  const node = video();
  if (!node) return Promise.resolve(false);
  if (audible(node, src)) {
    notify("audible");
    return Promise.resolve(true);
  }
  if (gestureAttempt) return gestureAttempt;
  return Promise.resolve(false);
}

/** Cold visit. The picture may move while the tap for sound is still owed. */
export function keepDoorPictureMoving(src: string): void {
  const node = video();
  if (!node || audible(node, src)) return;
  applySrc(node, src);
  node.muted = true;
  const pending = node.play();
  if (pending) pending.catch(() => undefined);
  notify("blocked");
}

export function pauseDoorFilm(): void {
  video()?.pause();
  gestureAttempt = null;
}
