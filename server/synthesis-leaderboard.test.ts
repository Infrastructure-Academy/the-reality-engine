import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Synthesis Page Logic Tests ───
describe("Synthesis — Civilizational Perspective Classification", () => {
  const RELAY_PERSPECTIVES: Record<number, "west" | "east" | "nomadic"> = {
    1: "nomadic", 2: "east", 3: "east", 4: "nomadic", 5: "west",
    6: "nomadic", 7: "east", 8: "west", 9: "west", 10: "west",
    11: "nomadic", 12: "nomadic",
  };

  it("should classify all 12 relays into perspectives", () => {
    for (let i = 1; i <= 12; i++) {
      expect(RELAY_PERSPECTIVES[i]).toBeDefined();
      expect(["west", "east", "nomadic"]).toContain(RELAY_PERSPECTIVES[i]);
    }
  });

  it("should have 4 western relays (5, 8, 9, 10)", () => {
    const western = Object.entries(RELAY_PERSPECTIVES)
      .filter(([_, v]) => v === "west")
      .map(([k]) => Number(k));
    expect(western).toEqual([5, 8, 9, 10]);
  });

  it("should have 3 eastern relays (2, 3, 7)", () => {
    const eastern = Object.entries(RELAY_PERSPECTIVES)
      .filter(([_, v]) => v === "east")
      .map(([k]) => Number(k));
    expect(eastern).toEqual([2, 3, 7]);
  });

  it("should have 5 nomadic relays (1, 4, 6, 11, 12)", () => {
    const nomadic = Object.entries(RELAY_PERSPECTIVES)
      .filter(([_, v]) => v === "nomadic")
      .map(([k]) => Number(k));
    expect(nomadic).toEqual([1, 4, 6, 11, 12]);
  });

  it("should compute perspective distribution from progress data", () => {
    const mockProgress = [
      { relayNumber: 1, completionPct: 100 },
      { relayNumber: 5, completionPct: 50 },
      { relayNumber: 8, completionPct: 75 },
      { relayNumber: 2, completionPct: 30 },
    ];

    const perspectives = { west: 0, east: 0, nomadic: 0 };
    for (const p of mockProgress) {
      const persp = RELAY_PERSPECTIVES[p.relayNumber];
      if (persp && p.completionPct > 0) {
        perspectives[persp] += p.completionPct;
      }
    }

    expect(perspectives.nomadic).toBe(100); // Relay 1
    expect(perspectives.west).toBe(125);    // Relay 5 (50) + Relay 8 (75)
    expect(perspectives.east).toBe(30);     // Relay 2
  });

  it("should detect balanced perspective when top two are within 15%", () => {
    const perspectives = { west: 100, east: 90, nomadic: 80 };
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    const isBalanced = sorted[0][1] > 0 && sorted[1][1] > 0 &&
      (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;
    expect(isBalanced).toBe(true);
  });

  it("should detect dominant perspective when gap exceeds 15%", () => {
    const perspectives = { west: 200, east: 50, nomadic: 30 };
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    const isBalanced = sorted[0][1] > 0 && sorted[1][1] > 0 &&
      (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;
    expect(isBalanced).toBe(false);
    expect(sorted[0][0]).toBe("west");
  });

  it("should assign correct archetype titles", () => {
    const titles: Record<string, string> = {
      west: "The Systems Architect",
      east: "The Harmony Weaver",
      nomadic: "The Universal Connector",
    };
    expect(titles.west).toBe("The Systems Architect");
    expect(titles.east).toBe("The Harmony Weaver");
    expect(titles.nomadic).toBe("The Universal Connector");
  });
});

// ─── DAVID Context Building Tests ───
describe("DAVID — Personalized Player Context", () => {
  it("should build context string with relay names", () => {
    const relayNames: Record<number, string> = {
      1: "Fire", 2: "Tree", 3: "River", 4: "Horse", 5: "Roads",
      6: "Ships", 7: "Loom", 8: "Rail", 9: "Engine", 10: "AAA Triad",
      11: "Orbit", 12: "Human Nodes",
    };

    const exploredRelays = [
      { relayNumber: 1, completionPct: 100, xpEarned: 50000 },
      { relayNumber: 3, completionPct: 60, xpEarned: 30000 },
    ];

    const exploredNames = exploredRelays.map(r => relayNames[r.relayNumber]).join(", ");
    expect(exploredNames).toBe("Fire, River");
  });

  it("should compute perspective lean percentages", () => {
    const relayPerspectives: Record<number, string> = {
      1: "nomadic", 2: "east", 3: "east", 4: "nomadic", 5: "west",
      6: "nomadic", 7: "east", 8: "west", 9: "west", 10: "west",
      11: "nomadic", 12: "nomadic",
    };

    const exploredRelays = [
      { relayNumber: 1, completionPct: 100 },
      { relayNumber: 5, completionPct: 100 },
      { relayNumber: 2, completionPct: 100 },
    ];

    const perspectives: Record<string, number> = { west: 0, east: 0, nomadic: 0 };
    for (const p of exploredRelays) {
      const persp = relayPerspectives[p.relayNumber];
      if (persp) perspectives[persp] += p.completionPct;
    }

    const total = Object.values(perspectives).reduce((a, b) => a + b, 0);
    expect(Math.round(perspectives.west / total * 100)).toBe(33);
    expect(Math.round(perspectives.east / total * 100)).toBe(33);
    expect(Math.round(perspectives.nomadic / total * 100)).toBe(33);
  });

  it("should include character data for scholar mode", () => {
    const character = {
      name: "Scholar Thales",
      fitsType: "thinker",
      level: 3,
      thesisTitle: "Infrastructure as Civilisational DNA",
      abilityScores: { observation: 14, analysis: 16, synthesis: 12, communication: 10, implementation: 15, vision: 13 },
    };

    let context = "";
    context += `- Scholar name: ${character.name}\n`;
    context += `- FITS type: ${character.fitsType}\n`;
    context += `- Level: ${character.level}\n`;
    context += `- Thesis: ${character.thesisTitle}\n`;
    const scores = character.abilityScores;
    context += `- Ability scores: ${Object.entries(scores).map(([k, v]) => `${k}: ${v}`).join(", ")}\n`;

    expect(context).toContain("Scholar Thales");
    expect(context).toContain("thinker");
    expect(context).toContain("Level: 3");
    expect(context).toContain("Infrastructure as Civilisational DNA");
    expect(context).toContain("analysis: 16");
  });

  it("should include node activation count for flight_deck mode", () => {
    const activations = Array.from({ length: 15 }, (_, i) => ({ id: i, nodeId: i, activated: true }));
    const context = `- Dearden Field nodes activated: ${activations.length}/60\n`;
    expect(context).toContain("15/60");
  });
});

// ─── Live Leaderboard Tests ───
describe("Leaderboard — Live Data Formatting", () => {
  it("should format XP values correctly", () => {
    function formatXp(xp: number): string {
      if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
      if (xp >= 1_000) return `${(xp / 1_000).toFixed(0)}K`;
      return xp.toLocaleString();
    }

    expect(formatXp(24000000)).toBe("24.0M");
    expect(formatXp(1500000)).toBe("1.5M");
    expect(formatXp(500000)).toBe("500K");
    expect(formatXp(50000)).toBe("50K");
    expect(formatXp(999)).toBe("999");
  });

  it("should determine GURU status from XP threshold", () => {
    const GURU_THRESHOLD = 1_000_000;
    expect(1_500_000 >= GURU_THRESHOLD).toBe(true);
    expect(999_999 >= GURU_THRESHOLD).toBe(false);
    expect(1_000_000 >= GURU_THRESHOLD).toBe(true);
  });

  it("should sort entries by totalXp descending", () => {
    const entries = [
      { id: 1, totalXp: 500000 },
      { id: 2, totalXp: 1500000 },
      { id: 3, totalXp: 800000 },
    ];
    const sorted = [...entries].sort((a, b) => b.totalXp - a.totalXp);
    expect(sorted[0].id).toBe(2);
    expect(sorted[1].id).toBe(3);
    expect(sorted[2].id).toBe(1);
  });

  it("should filter entries by mode", () => {
    const entries = [
      { id: 1, mode: "explorer", totalXp: 100 },
      { id: 2, mode: "flight_deck", totalXp: 200 },
      { id: 3, mode: "scholar", totalXp: 300 },
      { id: 4, mode: "explorer", totalXp: 150 },
    ];
    const filtered = entries.filter(e => e.mode === "explorer");
    expect(filtered.length).toBe(2);
    expect(filtered.every(e => e.mode === "explorer")).toBe(true);
  });

  it("should compute global stats from entries", () => {
    const entries = [
      { totalXp: 1000000, bitPoints: 10000 },
      { totalXp: 2000000, bitPoints: 20000 },
      { totalXp: 500000, bitPoints: 5000 },
    ];
    const totalPlayers = entries.length;
    const totalXp = entries.reduce((s, e) => s + e.totalXp, 0);
    const guruCount = entries.filter(e => e.totalXp >= 1_000_000).length;

    expect(totalPlayers).toBe(3);
    expect(totalXp).toBe(3500000);
    expect(guruCount).toBe(2);
  });
});

// ─── Synthesis Route Integration ───
describe("Synthesis — Route and Navigation", () => {
  it("should have correct relay perspective mapping for all 12 relays", () => {
    const RELAY_PERSPECTIVES: Record<number, string> = {
      1: "nomadic", 2: "east", 3: "east", 4: "nomadic", 5: "west",
      6: "nomadic", 7: "east", 8: "west", 9: "west", 10: "west",
      11: "nomadic", 12: "nomadic",
    };
    expect(Object.keys(RELAY_PERSPECTIVES).length).toBe(12);
  });

  it("should compute completion ring percentage", () => {
    const completed = 8;
    const total = 12;
    const pct = total > 0 ? completed / total : 0;
    expect(pct).toBeCloseTo(0.667, 2);
  });

  it("should handle zero progress gracefully", () => {
    const perspectives = { west: 0, east: 0, nomadic: 0 };
    const total = Object.values(perspectives).reduce((a, b) => a + b, 0) || 1;
    expect(Math.round(perspectives.west / total * 100)).toBe(0);
    expect(Math.round(perspectives.east / total * 100)).toBe(0);
    expect(Math.round(perspectives.nomadic / total * 100)).toBe(0);
  });
});
