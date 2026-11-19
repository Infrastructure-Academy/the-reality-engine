import { useCallback, useEffect, useState } from "react";
import { INVENTIONS } from "@shared/inventions";
import {
  DISCOVERIES_KEY,
  GM_MISSIONS_KEY,
  PROGRESS_EVENT,
  SPINNER_COLLECTION_KEY,
  classicXpFromDiscoveries,
  earnedPowerRelays,
  litRelayIndexes,
  parseDiscoveredItems,
  readDiscoveryMap,
  recordDiscovery,
  type DiscoveryMap,
} from "@shared/playerProgress";

export function loadDiscoveries(): DiscoveryMap {
  try {
    return readDiscoveryMap(localStorage.getItem(DISCOVERIES_KEY));
  } catch {
    return {};
  }
}

export function saveDiscoveries(map: DiscoveryMap) {
  localStorage.setItem(DISCOVERIES_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function noteDiscovery(relayNumber: number, inventionIndex: number): boolean {
  const next = recordDiscovery(loadDiscoveries(), relayNumber, inventionIndex);
  if (!next.added) return false;
  saveDiscoveries(next.map);
  return true;
}

export function mergeServerDiscoveries(rows: Array<{ relayNumber: number; discoveredItems?: unknown }>) {
  let map = loadDiscoveries();
  let changed = false;
  for (const row of rows) {
    for (const index of parseDiscoveredItems(row.discoveredItems)) {
      const next = recordDiscovery(map, row.relayNumber, index);
      if (next.added) {
        map = next.map;
        changed = true;
      }
    }
  }
  if (changed) saveDiscoveries(map);
}

function readLitIndexes(): number[] {
  const discoveries = loadDiscoveries();
  try {
    const saved = JSON.parse(localStorage.getItem("tre_spinner_discoveries") || "{}") as Record<string, number[]>;
    for (const [index, items] of Object.entries(saved)) {
      const relay = Number(index) + 1;
      if (!Array.isArray(items) || relay < 1 || relay > 12) continue;
      const existing = discoveries[relay] ?? [];
      discoveries[relay] = Array.from(new Set([...existing, ...items.filter((item) => typeof item === "number")]));
    }
  } catch { /* ignore corrupt spinner discoveries */ }
  let spinnerCollection: number[] = [];
  let earnedPowers: number[] = [];
  try {
    const saved = JSON.parse(localStorage.getItem(SPINNER_COLLECTION_KEY) || "[]");
    if (Array.isArray(saved)) spinnerCollection = saved.filter((value) => typeof value === "number");
  } catch { /* ignore corrupt spinner data */ }
  try {
    earnedPowers = earnedPowerRelays(JSON.parse(localStorage.getItem(GM_MISSIONS_KEY) || "{}"));
  } catch { /* ignore corrupt mission data */ }
  return litRelayIndexes({ discoveries, spinnerCollection, earnedPowers });
}

const INVENTION_COUNTS: Record<number, number> = Object.fromEntries(
  Object.entries(INVENTIONS).map(([relay, items]) => [Number(relay), items.length]),
);

/** Classic Explorer XP already implied by the shared discovery map. Empty play is 0. */
export function readSharedDiscoveryXp(): number {
  return classicXpFromDiscoveries(loadDiscoveries(), INVENTION_COUNTS);
}

export function useSharedDiscoveryXp(): number {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const refresh = () => setXp(readSharedDiscoveryXp());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return xp;
}

/** Relays lit by a discovery, a spinner collection, or a Grey Matter power. */
export function useLitRelays(): Set<number> {
  const read = useCallback(() => new Set(readLitIndexes()), []);
  const [lit, setLit] = useState<Set<number>>(() => new Set(readLitIndexes()));

  useEffect(() => {
    const refresh = () => setLit(read());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [read]);

  return lit;
}
