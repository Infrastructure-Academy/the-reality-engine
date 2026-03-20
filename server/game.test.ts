import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { RELAYS, WEBS, FITS_TYPES, CRAFTS, ABILITY_SCORES, MODES } from "../shared/gameData";
import { INVENTIONS, TOTAL_INVENTIONS, getInventionsForRelay } from "../shared/inventions";

// ─── Shared Game Data Tests ───
describe("Shared Game Data Constants", () => {
  it("has exactly 12 relays numbered 1-12", () => {
    expect(RELAYS).toHaveLength(12);
    RELAYS.forEach((r, i) => {
      expect(r.number).toBe(i + 1);
      expect(r.name).toBeTruthy();
      expect(r.emoji).toBeTruthy();
      expect(r.era).toBeTruthy();
    });
  });

  it("has exactly 5 Great Webs", () => {
    expect(WEBS).toHaveLength(5);
    const webNames = WEBS.map(w => w.name);
    expect(webNames).toContain("Natural");
    expect(webNames).toContain("Machine");
    expect(webNames).toContain("Digital");
    expect(webNames).toContain("Biological");
    expect(webNames).toContain("Consciousness");
  });

  it("has 5 FITS types with correct properties", () => {
    expect(FITS_TYPES).toHaveLength(5);
    const ids = FITS_TYPES.map(f => f.id);
    expect(ids).toContain("senser");
    expect(ids).toContain("thinker");
    expect(ids).toContain("intuitive");
    expect(ids).toContain("feeler");
    expect(ids).toContain("balanced");
    FITS_TYPES.forEach(f => {
      expect(f.name).toBeTruthy();
      expect(f.abbr).toBeTruthy();
      expect(f.web).toBeTruthy();
      expect(f.craft).toBeTruthy();
      expect(f.color).toBeTruthy();
    });
  });

  it("has 5 MPNC Fleet crafts with stats", () => {
    expect(CRAFTS).toHaveLength(5);
    CRAFTS.forEach(c => {
      expect(c.name).toBeTruthy();
      expect(c.stats).toBeDefined();
      expect(c.stats.speed).toBeGreaterThan(0);
      expect(c.stats.speed).toBeLessThanOrEqual(10);
      expect(c.fits).toBeTruthy();
      expect(c.web).toBeTruthy();
    });
  });

  it("has 6 ability scores", () => {
    expect(ABILITY_SCORES).toHaveLength(6);
    ABILITY_SCORES.forEach(ab => {
      expect(ab.id).toBeTruthy();
      expect(ab.name).toBeTruthy();
      expect(ab.description).toBeTruthy();
    });
  });

  it("has 3 game modes with correct age ranges", () => {
    expect(Object.keys(MODES)).toHaveLength(3);
    expect(MODES.explorer).toBeDefined();
    expect(MODES.flight_deck).toBeDefined();
    expect(MODES.scholar).toBeDefined();
    expect(MODES.explorer.ageRange).toContain("8");
    expect(MODES.flight_deck.ageRange).toContain("14");
    expect(MODES.scholar.ageRange).toContain("18");
  });

  it("Dearden Field produces 60 nodes (12 relays x 5 webs)", () => {
    const nodeCount = RELAYS.length * WEBS.length;
    expect(nodeCount).toBe(60);
  });
});

// ─── Invention Descriptions Tests ───
describe("Invention Descriptions", () => {
  it("has inventions for all 12 relays", () => {
    for (let i = 1; i <= 12; i++) {
      const inv = INVENTIONS[i];
      expect(inv).toBeDefined();
      expect(inv.length).toBeGreaterThan(0);
    }
  });

  it("has at least 91 total inventions", () => {
    expect(TOTAL_INVENTIONS).toBeGreaterThanOrEqual(91);
  });

  it("every invention has name, description, date, and significance", () => {
    for (let i = 1; i <= 12; i++) {
      INVENTIONS[i].forEach(inv => {
        expect(inv.name).toBeTruthy();
        expect(inv.description.length).toBeGreaterThan(20);
        expect(inv.date).toBeTruthy();
        expect(["foundational", "transformative", "revolutionary", "paradigm-shift"]).toContain(inv.significance);
      });
    }
  });

  it("invention names match the relay inventions in gameData order", () => {
    const relay1Names = INVENTIONS[1].map(i => i.name);
    expect(relay1Names).toContain("Hearth");
    expect(relay1Names).toContain("Forge");
    expect(relay1Names).toContain("Slash-and-Burn");
  });

  it("getInventionsForRelay helper works", () => {
    const relay7 = getInventionsForRelay(7);
    expect(relay7.length).toBeGreaterThan(0);
    expect(relay7[0].name).toBe("Spinning Jenny");
    const invalid = getInventionsForRelay(99);
    expect(invalid).toEqual([]);
  });
});

// ─── Router Structure Tests ───
describe("appRouter structure", () => {
  it("has auth, relays, webs, discoveries, profile, progress, dearden, character, david, and leaderboard routers", () => {
    const procedures = Object.keys(appRouter._def.procedures);
    expect(procedures).toContain("auth.me");
    expect(procedures).toContain("auth.logout");
    expect(procedures).toContain("relays.list");
    expect(procedures).toContain("relays.getByNumber");
    expect(procedures).toContain("webs.list");
    expect(procedures).toContain("discoveries.byRelay");
    expect(procedures).toContain("profile.getOrCreate");
    expect(procedures).toContain("profile.addXp");
    expect(procedures).toContain("progress.getForProfile");
    expect(procedures).toContain("progress.upsert");
    expect(procedures).toContain("dearden.nodes");
    expect(procedures).toContain("dearden.activations");
    expect(procedures).toContain("character.create");
    expect(procedures).toContain("character.getByProfile");
    expect(procedures).toContain("character.reroll");
    expect(procedures).toContain("david.chat");
    expect(procedures).toContain("david.history");
    expect(procedures).toContain("leaderboard.list");
  });
});

// ─── Auth Tests ───
describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: {
        id: 1, openId: "test-user", email: "test@example.com",
        name: "Test User", loginMethod: "manus", role: "user",
        createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: (name: string, options: Record<string, unknown>) => {
          clearedCookies.push({ name, options });
        },
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
  });
});
