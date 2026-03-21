// ─── Achievement Badge System ───
// Badges are derived from XP thresholds — no extra DB table needed.
// Big numbers to make players feel valued per Nigel's reward philosophy.

export interface Badge {
  id: string;
  name: string;
  tier: number;       // 1-5 for sorting
  emoji: string;
  color: string;      // CSS color
  bgColor: string;    // CSS bg color
  borderColor: string;
  threshold: number;  // XP required
  description: string;
}

export const BADGES: Badge[] = [
  {
    id: "bronze",
    name: "Bronze Pathfinder",
    tier: 1,
    emoji: "🥉",
    color: "#CD7F32",
    bgColor: "rgba(205,127,50,0.15)",
    borderColor: "rgba(205,127,50,0.4)",
    threshold: 100_000,
    description: "First steps on the infrastructure odyssey",
  },
  {
    id: "silver",
    name: "Silver Navigator",
    tier: 2,
    emoji: "🥈",
    color: "#C0C0C0",
    bgColor: "rgba(192,192,192,0.15)",
    borderColor: "rgba(192,192,192,0.4)",
    threshold: 500_000,
    description: "Charting the webs of civilisation",
  },
  {
    id: "gold",
    name: "Gold Architect",
    tier: 3,
    emoji: "🥇",
    color: "#FFD700",
    bgColor: "rgba(255,215,0,0.15)",
    borderColor: "rgba(255,215,0,0.4)",
    threshold: 1_000_000,
    description: "Master builder of the Dearden Field",
  },
  {
    id: "platinum",
    name: "Platinum Weaver",
    tier: 4,
    emoji: "💎",
    color: "#E5E4E2",
    bgColor: "rgba(229,228,226,0.15)",
    borderColor: "rgba(229,228,226,0.4)",
    threshold: 5_000_000,
    description: "Weaving all five Great Webs into one tapestry",
  },
  {
    id: "diamond",
    name: "Diamond GURU",
    tier: 5,
    emoji: "👑",
    color: "#B9F2FF",
    bgColor: "rgba(185,242,255,0.15)",
    borderColor: "rgba(185,242,255,0.4)",
    threshold: 10_000_000,
    description: "Supreme mastery of the Infrastructure Odyssey",
  },
];

/**
 * Get the highest badge a player has earned based on their XP.
 * Returns null if below the lowest threshold.
 */
export function getPlayerBadge(totalXp: number): Badge | null {
  let earned: Badge | null = null;
  for (const badge of BADGES) {
    if (totalXp >= badge.threshold) {
      earned = badge;
    }
  }
  return earned;
}

/**
 * Get all badges a player has earned (for timeline/collection display).
 */
export function getAllEarnedBadges(totalXp: number): Badge[] {
  return BADGES.filter(b => totalXp >= b.threshold);
}

/**
 * Get the next badge the player is working toward.
 * Returns null if they've earned all badges.
 */
export function getNextBadge(totalXp: number): { badge: Badge; progress: number; remaining: number } | null {
  for (const badge of BADGES) {
    if (totalXp < badge.threshold) {
      const prevThreshold = BADGES[BADGES.indexOf(badge) - 1]?.threshold ?? 0;
      const range = badge.threshold - prevThreshold;
      const progress = Math.min(1, (totalXp - prevThreshold) / range);
      return { badge, progress, remaining: badge.threshold - totalXp };
    }
  }
  return null; // All badges earned
}

/**
 * Format badge for display — short label like "🥇 Gold"
 */
export function badgeLabel(badge: Badge): string {
  return `${badge.emoji} ${badge.name.split(" ")[0]}`;
}
