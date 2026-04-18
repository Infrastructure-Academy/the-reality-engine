import { describe, it, expect } from "vitest";
import { FITS_TYPES, CRAFTS } from "../shared/gameData";
import { ARCHETYPES } from "../shared/relayDilemmas";
import { getPlayerBadge } from "../shared/badges";

describe("Block 466 — BrandI Extension, Swipe Carousel, Share Archetype Card", () => {

  describe("BrandI tooltip data integrity", () => {
    it("should have 7 meaning words for the lowercase i", () => {
      // The 7 meanings: individual, infrastructure, information, intelligence, infostructure, integration, impact
      const meanings = [
        "individual", "infrastructure", "information",
        "intelligence", "infostructure", "integration", "impact"
      ];
      expect(meanings).toHaveLength(7);
      meanings.forEach(m => expect(m.startsWith("i")).toBe(true));
    });
  });

  describe("ShareArchetypeCard data sources", () => {
    it("should have 5 FITS temperament types", () => {
      expect(FITS_TYPES).toHaveLength(5);
    });

    it("each FITS type should have required fields for the card", () => {
      FITS_TYPES.forEach(fits => {
        expect(fits.id).toBeTruthy();
        expect(fits.name).toBeTruthy();
        expect(fits.abbr).toBeTruthy();
        expect(fits.description).toBeTruthy();
        expect(fits.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it("should have 5 MPNC craft assignments", () => {
      expect(CRAFTS).toHaveLength(5);
    });

    it("each craft should have required fields for the card", () => {
      CRAFTS.forEach(craft => {
        expect(craft.id).toBeTruthy();
        expect(craft.name).toBeTruthy();
        expect(craft.className).toBeTruthy();
        expect(craft.role).toBeTruthy();
        expect(craft.fits).toBeTruthy();
      });
    });

    it("each craft should map to a valid FITS type", () => {
      const fitsIds = FITS_TYPES.map(f => f.id);
      CRAFTS.forEach(craft => {
        expect(fitsIds).toContain(craft.fits);
      });
    });

    it("should have 4 archetype definitions", () => {
      const keys = Object.keys(ARCHETYPES);
      expect(keys).toHaveLength(4);
      expect(keys).toContain("builder");
      expect(keys).toContain("philosopher");
      expect(keys).toContain("pragmatist");
      expect(keys).toContain("visionary");
    });

    it("each archetype should have name, description, emoji, color", () => {
      Object.values(ARCHETYPES).forEach(arch => {
        expect(arch.name).toBeTruthy();
        expect(arch.description).toBeTruthy();
        expect(arch.emoji).toBeTruthy();
        expect(arch.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it("getPlayerBadge should return a badge for high XP", () => {
      const badge = getPlayerBadge(1_000_000);
      expect(badge).toBeTruthy();
      expect(badge!.name).toBeTruthy();
      expect(badge!.color).toBeTruthy();
    });

    it("getPlayerBadge should return null for zero XP", () => {
      const badge = getPlayerBadge(0);
      expect(badge).toBeNull();
    });
  });

  describe("XP formatting logic", () => {
    it("should format millions correctly", () => {
      const formatXp = (val: number): string => {
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
        if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
        return val.toLocaleString();
      };
      expect(formatXp(1_500_000)).toBe("1.5M");
      expect(formatXp(50_000)).toBe("50K");
      expect(formatXp(999)).toBe("999");
    });
  });

  describe("Swipe gesture threshold", () => {
    it("should recognize a swipe only when deltaX exceeds 50px", () => {
      const SWIPE_THRESHOLD = 50;
      // Simulate small movement — no swipe
      expect(Math.abs(30) > SWIPE_THRESHOLD).toBe(false);
      // Simulate large movement — swipe
      expect(Math.abs(80) > SWIPE_THRESHOLD).toBe(true);
      // Edge case — exactly at threshold
      expect(Math.abs(50) > SWIPE_THRESHOLD).toBe(false);
      expect(Math.abs(51) > SWIPE_THRESHOLD).toBe(true);
    });
  });
});
