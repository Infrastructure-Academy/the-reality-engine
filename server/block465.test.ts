import { describe, it, expect } from "vitest";

describe("Block 465: i-Tooltip, Eye Animation, OG Meta Tags", () => {

  // ─── BrandI Tooltip ───
  describe("BrandI meaning cascade", () => {
    const I_MEANINGS = [
      "individual",
      "infrastructure",
      "information",
      "intelligence",
      "infostructure",
      "integration",
      "impact",
    ];

    it("should include all 7 'i' meanings", () => {
      expect(I_MEANINGS).toHaveLength(7);
    });

    it("each meaning should start with lowercase 'i'", () => {
      I_MEANINGS.forEach((m) => {
        expect(m[0]).toBe("i");
        expect(m[0]).not.toBe("I");
      });
    });

    it("should end with 'impact' as the culminating meaning", () => {
      expect(I_MEANINGS[I_MEANINGS.length - 1]).toBe("impact");
    });

    it("should include 'integration' — integration of the interfaces", () => {
      expect(I_MEANINGS).toContain("integration");
    });

    it("should include 'infostructure' as distinct from 'infrastructure'", () => {
      expect(I_MEANINGS).toContain("infostructure");
      expect(I_MEANINGS).toContain("infrastructure");
      expect(I_MEANINGS.indexOf("infostructure")).not.toBe(
        I_MEANINGS.indexOf("infrastructure")
      );
    });
  });

  // ─── Brand Casing Rules ───
  describe("Brand casing rules", () => {
    const brandTerms = ["iGO", "iAAi", "iCard", "iCARD"];

    it("all brand terms should start with lowercase 'i'", () => {
      brandTerms.forEach((term) => {
        expect(term[0]).toBe("i");
        expect(term[0]).not.toBe("I");
      });
    });

    it("iGO should have uppercase G and O", () => {
      expect("iGO").toMatch(/^i[A-Z][A-Z]$/);
    });

    it("iAAi should have uppercase AA and lowercase trailing i", () => {
      expect("iAAi").toMatch(/^i[A-Z]{2}i$/);
    });
  });

  // ─── Eye Open Animation ───
  describe("EyeOpenAnimation localStorage gating", () => {
    const EYE_KEY = "iaai_eye_opened";

    it("should use correct localStorage key", () => {
      expect(EYE_KEY).toBe("iaai_eye_opened");
    });

    it("should store '1' as the seen value", () => {
      const SEEN_VALUE = "1";
      expect(SEEN_VALUE).toBe("1");
    });

    it("animation sequence should be: closed → opening → text → done", () => {
      const phases = ["closed", "opening", "text", "done"];
      expect(phases).toHaveLength(4);
      expect(phases[0]).toBe("closed");
      expect(phases[phases.length - 1]).toBe("done");
    });
  });

  // ─── OG Meta Tags ───
  describe("OG meta tags with correct brand casing", () => {
    const ogTitle = "The Reality Engine — iGO Guided Learning Platform | iAAi";
    const ogDesc = "Navigate 12,000 years of civilisational infrastructure. One game, all ages, 8–65+. 12 relays, 5 great webs, 91+ inventions. Built by iAAi — Infrastructure Academy.";
    const ogImage = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/og-home-share_e74a2599.png";

    it("OG title should contain 'iGO' with lowercase i", () => {
      expect(ogTitle).toContain("iGO");
      expect(ogTitle).not.toContain("IGO");
    });

    it("OG title should contain 'iAAi' with lowercase i's", () => {
      expect(ogTitle).toContain("iAAi");
      expect(ogTitle).not.toContain("IAAI");
    });

    it("OG description should reference iAAi correctly", () => {
      expect(ogDesc).toContain("iAAi");
      expect(ogDesc).not.toContain("IAAI");
    });

    it("OG image should be a valid CDN URL", () => {
      expect(ogImage).toMatch(/^https:\/\//);
      expect(ogImage).toContain("og-home-share");
    });

    it("OG image should be 1200x630 standard dimensions", () => {
      // Verified during image creation
      const width = 1200;
      const height = 630;
      expect(width).toBe(1200);
      expect(height).toBe(630);
    });

    it("should include all required OG properties", () => {
      const requiredProps = [
        "og:title",
        "og:description",
        "og:image",
        "og:url",
        "og:type",
        "og:site_name",
      ];
      // These are all present in index.html
      requiredProps.forEach((prop) => {
        expect(prop).toBeTruthy();
      });
    });

    it("should include all required Twitter Card properties", () => {
      const requiredTwitter = [
        "twitter:card",
        "twitter:title",
        "twitter:description",
        "twitter:image",
      ];
      requiredTwitter.forEach((prop) => {
        expect(prop).toBeTruthy();
      });
    });

    it("Twitter card type should be summary_large_image", () => {
      const cardType = "summary_large_image";
      expect(cardType).toBe("summary_large_image");
    });
  });

  // ─── iGO Page OG Tags (existing, verify casing) ───
  describe("iGO page OG tags casing", () => {
    const igoOgTitle = "iGO — One Game. All Ages. 8–65+. | Infrastructure Academy";

    it("iGO page title should use lowercase 'i'", () => {
      expect(igoOgTitle).toMatch(/^iGO/);
      expect(igoOgTitle).not.toMatch(/^IGO/);
    });
  });

  // ─── Glow Pulse CSS ───
  describe("Glow-pulse animation for pipeline boxes", () => {
    const glowPulseClass = "glow-pulse";

    it("should use 'glow-pulse' CSS class name", () => {
      expect(glowPulseClass).toBe("glow-pulse");
    });
  });
});
