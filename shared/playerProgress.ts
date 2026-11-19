/**
 * Shared explorer progress.
 *
 * Modes are views of the same 12 relays and the same inventions.
 * Discoveries, collection-grid lights, and Grey Matter powers are shared.
 * XP amounts stay mode-specific (Game-Design-Parameters §3.3); this module
 * only stops a later mode from erasing an earlier reward.
 */

export const DISCOVERIES_KEY = "tre_shared_discoveries";
export const SPINNER_COLLECTION_KEY = "tre_spinner_collection";
export const GM_MISSIONS_KEY = "tre_gm_missions";
export const PROGRESS_EVENT = "tre-progress";

export const GREY_MATTER_PATH = "/explore/greymatter";
export const SCHOLAR_PATH = "/create";
export const ACADEMY_URL = "https://www.infrastructure-academy.com";
export const ACADEMY_HOST = "www.infrastructure-academy.com";

/** Classic Explorer fallback when a relay has no xpReward. Matches the existing large-number economy, not a flat token. */
export const CLASSIC_XP_FALLBACK = 10_000;
export const STATED_GENERATIONS = 500;
export const DUNGEON_ROOM_COUNT = 8;
export const DUNGEON_COUNT = 12;

export type DiscoveryMap = Record<number, number[]>;

export type RelayProgressSnapshot = {
  discoveredItems?: unknown;
  completionPct?: number | null;
  xpEarned?: number | null;
};

export function classicXpPerDiscovery(xpReward: number | null | undefined, inventionCount: number): number {
  const reward = typeof xpReward === "number" && Number.isFinite(xpReward) && xpReward > 0
    ? xpReward
    : CLASSIC_XP_FALLBACK;
  return Math.floor(reward / Math.max(1, inventionCount));
}

export function parseRelayQuery(search: string): number | null {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const raw = new URLSearchParams(query).get("relay");
  if (raw == null || raw === "") return null;
  if (!/^\d+$/.test(raw)) return null;
  const relay = Number(raw);
  if (relay < 1 || relay > 12) return null;
  return relay;
}

export function parseDiscoveredItems(value: unknown): number[] {
  let raw = value;
  if (typeof raw === "string") {
    try { raw = JSON.parse(raw); } catch { return []; }
  }
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is number => typeof item === "number" && Number.isInteger(item) && item >= 0);
}

export function readDiscoveryMap(serialized: string | null | undefined): DiscoveryMap {
  if (!serialized) return {};
  try {
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    const map: DiscoveryMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      const relay = Number(key);
      if (!Number.isInteger(relay) || relay < 1 || relay > 12) continue;
      const items = parseDiscoveredItems(value);
      if (items.length > 0) map[relay] = Array.from(new Set(items)).sort((a, b) => a - b);
    }
    return map;
  } catch {
    return {};
  }
}

export function recordDiscovery(map: DiscoveryMap, relayNumber: number, inventionIndex: number): { map: DiscoveryMap; added: boolean } {
  if (!Number.isInteger(relayNumber) || relayNumber < 1 || relayNumber > 12) return { map, added: false };
  if (!Number.isInteger(inventionIndex) || inventionIndex < 0) return { map, added: false };
  const existing = map[relayNumber] ?? [];
  if (existing.includes(inventionIndex)) return { map, added: false };
  return {
    map: { ...map, [relayNumber]: [...existing, inventionIndex].sort((a, b) => a - b) },
    added: true,
  };
}

export function discoveryCount(map: DiscoveryMap): number {
  return Object.values(map).reduce((sum, items) => sum + items.length, 0);
}

export function earnedPowerRelays(missions: unknown): number[] {
  if (!missions || typeof missions !== "object") return [];
  return Object.entries(missions as Record<string, { powerEarned?: boolean }>)
    .filter(([, mission]) => Boolean(mission?.powerEarned))
    .map(([relay]) => Number(relay))
    .filter((relay) => Number.isInteger(relay) && relay >= 1 && relay <= 12)
    .sort((a, b) => a - b);
}

/** 0-based indexes for the home collection grid. */
export function litRelayIndexes(input: {
  discoveries: DiscoveryMap;
  spinnerCollection: number[];
  earnedPowers: number[];
}): number[] {
  const lit = new Set<number>();
  for (const [relay, items] of Object.entries(input.discoveries)) {
    const number = Number(relay);
    if (number >= 1 && number <= 12 && items.length > 0) lit.add(number - 1);
  }
  for (const index of input.spinnerCollection) {
    if (Number.isInteger(index) && index >= 0 && index <= 11) lit.add(index);
  }
  for (const relay of input.earnedPowers) {
    if (relay >= 1 && relay <= 12) lit.add(relay - 1);
  }
  return Array.from(lit).sort((a, b) => a - b);
}

export function countExploredRelays(rows: Array<{ relayNumber: number; completionPct?: number | null; discoveredItems?: unknown }>): number {
  const seen = new Set<number>();
  for (const row of rows) {
    if (row.relayNumber < 1 || row.relayNumber > 12) continue;
    if (parseDiscoveredItems(row.discoveredItems).length > 0 || (row.completionPct ?? 0) > 0) {
      seen.add(row.relayNumber);
    }
  }
  return seen.size;
}

export function mergeRelayProgress(
  existing: RelayProgressSnapshot | null | undefined,
  incoming: { discoveredItems: number[]; completionPct: number; xpEarned: number },
): { discoveredItems: number[]; completionPct: number; xpEarned: number } {
  const discoveredItems = Array.from(new Set([
    ...parseDiscoveredItems(existing?.discoveredItems),
    ...parseDiscoveredItems(incoming.discoveredItems),
  ])).sort((a, b) => a - b);
  return {
    discoveredItems,
    completionPct: Math.max(existing?.completionPct ?? 0, incoming.completionPct),
    xpEarned: Math.max(existing?.xpEarned ?? 0, incoming.xpEarned),
  };
}

/** A dungeon is cleared only when all eight rooms of that relay are cleared. */
export function dungeonsCleared(
  clearedRooms: Iterable<string>,
  roomCount = DUNGEON_ROOM_COUNT,
  dungeonCount = DUNGEON_COUNT,
): number {
  const cleared = new Set(clearedRooms);
  let count = 0;
  for (let relay = 1; relay <= dungeonCount; relay++) {
    let complete = true;
    for (let room = 0; room < roomCount; room++) {
      if (!cleared.has(`${relay}-${room}`)) {
        complete = false;
        break;
      }
    }
    if (complete) count++;
  }
  return count;
}

export function continueDungeonLabel(
  storedRelay: number,
  relays: ReadonlyArray<{ number: number; name: string }>,
): { number: number; name: string } {
  const match = relays.find((relay) => relay.number === storedRelay);
  if (match) return { number: match.number, name: match.name };
  const first = relays[0];
  return { number: first?.number ?? 1, name: first?.name ?? "Fire" };
}

export function hydrateTotalXp(current: number, profileTotal: number | null | undefined): number {
  const stored = typeof profileTotal === "number" && Number.isFinite(profileTotal) ? profileTotal : 0;
  return Math.max(current, stored);
}

/**
 * Repair the copy class seen on the live door: a missing space after a sentence
 * stop, and raw markdown emphasis left in narrative text.
 */
export function presentPlayerCopy(text: string): string {
  if (!text) return "";
  const plain = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1");
  return plain.replace(/([.!?])([A-Za-z])/g, "$1 $2");
}
