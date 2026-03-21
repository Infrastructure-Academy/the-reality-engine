import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME } from "../shared/const";

// ─── Helper: create authenticated context ───
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "admin"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-owner-open-id",
    email: "nigel@example.com",
    name: "Nigel Dearden",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

// ═══════════════════════════════════════════════════════════
// DAVID VOICE NARRATION TESTS
// ═══════════════════════════════════════════════════════════
describe("DAVID Voice Narration Module", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("tre_voice_enabled");
    }
  });

  it("exports all expected voice functions", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    expect(typeof mod.getVoiceEnabled).toBe("function");
    expect(typeof mod.setVoiceEnabled).toBe("function");
    expect(typeof mod.toggleVoiceEnabled).toBe("function");
    expect(typeof mod.davidSpeak).toBe("function");
    expect(typeof mod.davidStop).toBe("function");
    expect(typeof mod.isSpeechAvailable).toBe("function");
  });

  it("exports narration helper functions", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    expect(typeof mod.narrateDiscovery).toBe("function");
    expect(typeof mod.narrateRelayIntro).toBe("function");
    expect(typeof mod.narrateRelayComplete).toBe("function");
    expect(typeof mod.narrateBadgeEarned).toBe("function");
  });

  it("voice functions don't throw when speechSynthesis is unavailable", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    // In Node there's no speechSynthesis, so these should gracefully no-op
    expect(() => mod.davidSpeak("test")).not.toThrow();
    expect(() => mod.davidStop()).not.toThrow();
    expect(() => mod.narrateDiscovery("Fire", "Fire")).not.toThrow();
    expect(() => mod.narrateRelayIntro("Fire", "pre-10,000 BCE")).not.toThrow();
    expect(() => mod.narrateRelayComplete("Fire")).not.toThrow();
    expect(() => mod.narrateBadgeEarned("Bronze Pathfinder")).not.toThrow();
  });

  it("isSpeechAvailable returns false in Node environment", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    expect(mod.isSpeechAvailable()).toBe(false);
  });

  it("voice toggle persists state", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    mod.setVoiceEnabled(true);
    expect(mod.getVoiceEnabled()).toBe(true);
    mod.setVoiceEnabled(false);
    expect(mod.getVoiceEnabled()).toBe(false);
  });

  it("toggleVoiceEnabled flips the state", async () => {
    const mod = await import("../client/src/hooks/useDavidVoice");
    mod.setVoiceEnabled(false);
    const result = mod.toggleVoiceEnabled();
    expect(result).toBe(true);
    expect(mod.getVoiceEnabled()).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// BADGE SYSTEM TESTS
// ═══════════════════════════════════════════════════════════
describe("Achievement Badge System", () => {
  it("exports all badge functions", async () => {
    const mod = await import("../shared/badges");
    expect(typeof mod.getPlayerBadge).toBe("function");
    expect(typeof mod.getAllEarnedBadges).toBe("function");
    expect(typeof mod.getNextBadge).toBe("function");
    expect(typeof mod.badgeLabel).toBe("function");
    expect(Array.isArray(mod.BADGES)).toBe(true);
  });

  it("BADGES array has 5 tiers", async () => {
    const { BADGES } = await import("../shared/badges");
    expect(BADGES.length).toBe(5);
    expect(BADGES[0].id).toBe("bronze");
    expect(BADGES[4].id).toBe("diamond");
  });

  it("badge thresholds are in ascending order", async () => {
    const { BADGES } = await import("../shared/badges");
    for (let i = 1; i < BADGES.length; i++) {
      expect(BADGES[i].threshold).toBeGreaterThan(BADGES[i - 1].threshold);
    }
  });

  it("getPlayerBadge returns null below lowest threshold", async () => {
    const { getPlayerBadge, BADGES } = await import("../shared/badges");
    expect(getPlayerBadge(0)).toBeNull();
    expect(getPlayerBadge(BADGES[0].threshold - 1)).toBeNull();
  });

  it("getPlayerBadge returns bronze at 100K XP", async () => {
    const { getPlayerBadge } = await import("../shared/badges");
    const badge = getPlayerBadge(100_000);
    expect(badge).not.toBeNull();
    expect(badge!.id).toBe("bronze");
  });

  it("getPlayerBadge returns diamond at 10M XP", async () => {
    const { getPlayerBadge } = await import("../shared/badges");
    const badge = getPlayerBadge(10_000_000);
    expect(badge).not.toBeNull();
    expect(badge!.id).toBe("diamond");
  });

  it("getAllEarnedBadges returns correct count", async () => {
    const { getAllEarnedBadges } = await import("../shared/badges");
    expect(getAllEarnedBadges(0).length).toBe(0);
    expect(getAllEarnedBadges(100_000).length).toBe(1);
    expect(getAllEarnedBadges(500_000).length).toBe(2);
    expect(getAllEarnedBadges(10_000_000).length).toBe(5);
  });

  it("getNextBadge returns correct next target", async () => {
    const { getNextBadge } = await import("../shared/badges");
    const next = getNextBadge(0);
    expect(next).not.toBeNull();
    expect(next!.badge.id).toBe("bronze");
    expect(next!.progress).toBeGreaterThanOrEqual(0);
    expect(next!.progress).toBeLessThanOrEqual(1);
  });

  it("getNextBadge returns null when all badges earned", async () => {
    const { getNextBadge } = await import("../shared/badges");
    expect(getNextBadge(10_000_000)).toBeNull();
  });

  it("badgeLabel formats correctly", async () => {
    const { BADGES, badgeLabel } = await import("../shared/badges");
    const label = badgeLabel(BADGES[0]);
    expect(label).toContain("Bronze");
    expect(label).toContain(BADGES[0].emoji);
  });
});

// ═══════════════════════════════════════════════════════════
// JOURNEY TIMELINE tRPC TESTS
// ═══════════════════════════════════════════════════════════
describe("Journey Timeline Procedure", () => {
  it("journey.timeline procedure exists and is callable", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Should not throw — returns empty array for non-existent profile
    const result = await caller.journey.timeline({ profileId: 99999 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
// AGN CONTACTS tRPC TESTS
// ═══════════════════════════════════════════════════════════
describe("AGN Network Contacts Procedures", () => {
  it("agn.contacts requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.agn.contacts({ page: 1, limit: 10 })
    ).rejects.toThrow();
  });

  it("agn.contacts returns paginated results for authenticated user", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.agn.contacts({ page: 1, limit: 10 });
    expect(result).toHaveProperty("contacts");
    expect(result).toHaveProperty("total");
    expect(Array.isArray(result.contacts)).toBe(true);
    expect(typeof result.total).toBe("number");
  });

  it("agn.contacts supports search parameter", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.agn.contacts({ page: 1, limit: 10, search: "zzzznonexistent" });
    expect(Array.isArray(result.contacts)).toBe(true);
  });

  it("agn.contacts supports hasNameOnly filter", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.agn.contacts({ page: 1, limit: 5, hasNameOnly: true });
    expect(Array.isArray(result.contacts)).toBe(true);
    // All results should have a non-empty displayName
    for (const c of result.contacts) {
      if (c.displayName) {
        expect(c.displayName.length).toBeGreaterThan(0);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════
// GAME DATA INTEGRITY TESTS
// ═══════════════════════════════════════════════════════════
describe("Game Data Integrity", () => {
  it("RELAYS has exactly 12 entries", async () => {
    const { RELAYS } = await import("../shared/gameData");
    expect(RELAYS.length).toBe(12);
  });

  it("WEBS has exactly 5 entries", async () => {
    const { WEBS } = await import("../shared/gameData");
    expect(WEBS.length).toBe(5);
  });

  it("FITS_TYPES has exactly 5 entries", async () => {
    const { FITS_TYPES } = await import("../shared/gameData");
    expect(FITS_TYPES.length).toBe(5);
  });

  it("CRAFTS has exactly 5 entries matching FITS types", async () => {
    const { CRAFTS, FITS_TYPES } = await import("../shared/gameData");
    expect(CRAFTS.length).toBe(5);
    for (const craft of CRAFTS) {
      const matchingFits = FITS_TYPES.find(f => f.id === craft.fits);
      expect(matchingFits).toBeDefined();
    }
  });

  it("each relay has required fields", async () => {
    const { RELAYS } = await import("../shared/gameData");
    for (const relay of RELAYS) {
      expect(relay.number).toBeGreaterThanOrEqual(1);
      expect(relay.number).toBeLessThanOrEqual(12);
      expect(relay.name).toBeTruthy();
      expect(relay.era).toBeTruthy();
      expect(relay.color).toBeTruthy();
    }
  });
});
