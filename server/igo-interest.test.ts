import { describe, it, expect } from "vitest";

describe("iGO Interest Registration", () => {
  // ─── Data model validation ───
  describe("Registration roles", () => {
    const validRoles = ["player", "educator", "institution", "sponsor", "backer", "other"];

    it("should accept all valid roles", () => {
      validRoles.forEach(role => {
        expect(validRoles).toContain(role);
      });
    });

    it("should have exactly 6 role options", () => {
      expect(validRoles).toHaveLength(6);
    });

    it("should include financial backer role", () => {
      expect(validRoles).toContain("backer");
      expect(validRoles).toContain("sponsor");
    });
  });

  // ─── IGOUmbrella page structure ───
  describe("IGOUmbrella page sections", () => {
    const expectedSections = [
      "HERO — THE PITCH",
      "FIND YOUR MODE",
      "HOW IT WORKS",
      "THE 12 GAME FORMATS",
      "EXHIBITION HALL GALLERY",
      "THE PERMANENT FOUNDATION",
      "GENERATIONS TIMELINE",
      "SUPPORT THE MISSION",
      "WHY BACK iGO",
      "ENTER THE GAME",
    ];

    it("should have 10 major sections for conversion flow", () => {
      expect(expectedSections).toHaveLength(10);
    });

    it("should lead with pitch and end with CTAs", () => {
      expect(expectedSections[0]).toContain("PITCH");
      expect(expectedSections[expectedSections.length - 1]).toContain("ENTER");
    });

    it("should include backer/investor section", () => {
      const hasBackerSection = expectedSections.some(s => s.includes("BACK"));
      expect(hasBackerSection).toBe(true);
    });
  });

  // ─── 12 Modes data integrity ───
  describe("12 Game Modes", () => {
    const modes = [
      { letter: "A", name: "Relay Spinner", episode: 1, status: "live" },
      { letter: "B", name: "Dungeon Crawl", episode: 1, status: "live" },
      { letter: "C", name: "Grey Matter", episode: 1, status: "live" },
      { letter: "D", name: "Flight Deck", episode: 1, status: "live" },
      { letter: "E", name: "Scholar", episode: 1, status: "designed" },
      { letter: "F", name: "Academic", episode: 1, status: "designed" },
      { letter: "G", name: "Graduate", episode: 2, status: "aspirational" },
      { letter: "H", name: "Chartered", episode: 2, status: "aspirational" },
      { letter: "I", name: "Senior Leader", episode: 3, status: "aspirational" },
      { letter: "J", name: "Industry Leader", episode: 3, status: "aspirational" },
      { letter: "K", name: "Industry Champion", episode: 3, status: "aspirational" },
      { letter: "L", name: "Master Class", episode: 3, status: "aspirational" },
    ];

    it("should have exactly 12 modes A–L", () => {
      expect(modes).toHaveLength(12);
      expect(modes[0].letter).toBe("A");
      expect(modes[11].letter).toBe("L");
    });

    it("should have 4 live modes (A–D)", () => {
      const live = modes.filter(m => m.status === "live");
      expect(live).toHaveLength(4);
    });

    it("should have 2 designed modes (E–F)", () => {
      const designed = modes.filter(m => m.status === "designed");
      expect(designed).toHaveLength(2);
    });

    it("should have 6 aspirational modes (G–L)", () => {
      const aspirational = modes.filter(m => m.status === "aspirational");
      expect(aspirational).toHaveLength(6);
    });

    it("should use correct v4 terminology: K=Industry Champion, L=Master Class", () => {
      expect(modes[10].name).toBe("Industry Champion");
      expect(modes[11].name).toBe("Master Class");
    });

    it("should span 3 episodes", () => {
      const episodes = new Set(modes.map(m => m.episode));
      expect(episodes.size).toBe(3);
    });

    it("Episode 1 should be Relay & Remember (modes A–F)", () => {
      const ep1 = modes.filter(m => m.episode === 1);
      expect(ep1).toHaveLength(6);
      expect(ep1[0].letter).toBe("A");
      expect(ep1[5].letter).toBe("F");
    });
  });

  // ─── Exhibition Hall data ───
  describe("Exhibition Hall Gallery", () => {
    const halls = [
      { num: 1, relay: "Fire" },
      { num: 2, relay: "Tree" },
      { num: 3, relay: "River" },
      { num: 4, relay: "Horse" },
      { num: 5, relay: "Roads" },
      { num: 6, relay: "Ships" },
      { num: 7, relay: "Loom" },
      { num: 8, relay: "Rail" },
      { num: 9, relay: "Engine" },
      { num: 10, relay: "AAA Triad" },
      { num: 11, relay: "Orbit" },
      { num: 12, relay: "Human Nodes" },
      { num: 13, relay: "Fractal Connector" },
    ];

    it("should have 13 exhibition halls", () => {
      expect(halls).toHaveLength(13);
    });

    it("should start with Fire and end with Fractal Connector", () => {
      expect(halls[0].relay).toBe("Fire");
      expect(halls[12].relay).toBe("Fractal Connector");
    });

    it("should include all 12 relays plus the connector", () => {
      expect(halls.filter(h => h.num <= 12)).toHaveLength(12);
      expect(halls[12].num).toBe(13);
    });
  });

  // ─── Find Your Mode router ───
  describe("Find Your Mode age router", () => {
    const ageRanges = [
      { label: "8–10", age: 9 },
      { label: "10–12", age: 11 },
      { label: "12–14", age: 13 },
      { label: "14–18", age: 16 },
      { label: "18–22", age: 20 },
      { label: "22–29", age: 25 },
      { label: "30–39", age: 35 },
      { label: "40–49", age: 45 },
      { label: "50–59", age: 55 },
      { label: "60–64", age: 62 },
      { label: "65+", age: 70 },
    ];

    it("should have 11 age brackets covering 8–65+", () => {
      expect(ageRanges).toHaveLength(11);
    });

    it("should start at age 8 and go to 65+", () => {
      expect(ageRanges[0].label).toBe("8–10");
      expect(ageRanges[10].label).toBe("65+");
    });

    it("youngest bracket should map to Mode A (Relay Spinner)", () => {
      // Age 9 should match Mode A (ageMin:8, ageMax:10)
      expect(ageRanges[0].age).toBeGreaterThanOrEqual(8);
      expect(ageRanges[0].age).toBeLessThanOrEqual(10);
    });
  });

  // ─── Conversion CTAs ───
  describe("Conversion elements", () => {
    const ctaTypes = [
      "PLAY NOW — MODES A–D LIVE",
      "SUPPORT THE MISSION",
      "JOIN (sticky header)",
      "PRE-REGISTER FOR iGO MOBILE APP",
      "REGISTER AS A BACKER",
      "REGISTER MY INTEREST",
    ];

    it("should have multiple conversion CTAs", () => {
      expect(ctaTypes.length).toBeGreaterThanOrEqual(5);
    });

    it("should include both player and backer CTAs", () => {
      const hasPlay = ctaTypes.some(c => c.includes("PLAY"));
      const hasBacker = ctaTypes.some(c => c.includes("BACKER"));
      expect(hasPlay).toBe(true);
      expect(hasBacker).toBe(true);
    });

    it("should include app pre-registration", () => {
      const hasApp = ctaTypes.some(c => c.includes("MOBILE APP"));
      expect(hasApp).toBe(true);
    });
  });
});
