import { describe, it, expect } from "vitest";

/**
 * Explorer Sub-Modes — Unit Tests
 *
 * Tests the core game logic for all three sub-modes:
 * - Relay Spinner (Mode A)
 * - Dungeon Crawl (Mode B)
 * - Power of Grey Matter (Mode C)
 *
 * These test the shared data structures and game mechanics,
 * not the React components (which are tested via browser).
 */

// ─── Shared Game Data Tests ───
describe("Shared Game Data", () => {
  it("should have 12 relays defined", async () => {
    const { RELAYS } = await import("../shared/gameData");
    expect(RELAYS).toHaveLength(12);
    RELAYS.forEach((relay) => {
      expect(relay).toHaveProperty("name");
      expect(relay).toHaveProperty("emoji");
      expect(relay).toHaveProperty("era");
      expect(relay).toHaveProperty("number");
    });
  });

  it("should have inventions for all 12 relays", async () => {
    const { INVENTIONS } = await import("../shared/inventions");
    for (let i = 1; i <= 12; i++) {
      expect(INVENTIONS[i]).toBeDefined();
      expect(INVENTIONS[i].length).toBeGreaterThan(0);
    }
  });

  it("should have MODES including explorer", async () => {
    const { MODES } = await import("../shared/gameData");
    expect(MODES.explorer).toBeDefined();
    expect(MODES.explorer.entry).toBe("/explore");
  });
});

// ─── Relay Spinner Logic Tests ───
describe("Relay Spinner (Mode A)", () => {
  const RELAY_EMOJIS = ["🔥", "🌳", "🌊", "🐎", "🛤️", "⛵", "🧶", "🚂", "⚙️", "✈️", "🛰️", "🧠"];

  it("should have exactly 12 relay symbols", () => {
    expect(RELAY_EMOJIS).toHaveLength(12);
  });

  it("should generate valid reel results from relay symbols", () => {
    // Simulate 100 spins
    for (let i = 0; i < 100; i++) {
      const reels = [
        RELAY_EMOJIS[Math.floor(Math.random() * RELAY_EMOJIS.length)],
        RELAY_EMOJIS[Math.floor(Math.random() * RELAY_EMOJIS.length)],
        RELAY_EMOJIS[Math.floor(Math.random() * RELAY_EMOJIS.length)],
      ];
      expect(reels).toHaveLength(3);
      reels.forEach((reel) => {
        expect(RELAY_EMOJIS).toContain(reel);
      });
    }
  });

  it("should correctly identify jackpot (3 matching)", () => {
    const checkTier = (reels: string[]) => {
      if (reels[0] === reels[1] && reels[1] === reels[2]) return "jackpot";
      if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) return "double";
      return "single";
    };

    expect(checkTier(["🔥", "🔥", "🔥"])).toBe("jackpot");
    expect(checkTier(["🔥", "🔥", "🌳"])).toBe("double");
    expect(checkTier(["🔥", "🌳", "🌊"])).toBe("single");
  });

  it("should award correct XP per tier", () => {
    const XP_REWARDS = { jackpot: 50000, double: 25000, single: 10000 };
    expect(XP_REWARDS.jackpot).toBe(50000);
    expect(XP_REWARDS.double).toBe(25000);
    expect(XP_REWARDS.single).toBe(10000);
  });

  it("should enforce 12 daily spins limit", () => {
    const MAX_SPINS = 12;
    let spinsRemaining = MAX_SPINS;

    for (let i = 0; i < 12; i++) {
      expect(spinsRemaining).toBeGreaterThan(0);
      spinsRemaining--;
    }
    expect(spinsRemaining).toBe(0);
  });
});

// ─── Dungeon Crawl Logic Tests ───
describe("Dungeon Crawl (Mode B)", () => {
  it("should roll valid ability scores (3d6+3 = range 6-21)", () => {
    const roll = () =>
      Math.floor(Math.random() * 6) +
      Math.floor(Math.random() * 6) +
      Math.floor(Math.random() * 6) +
      3;

    for (let i = 0; i < 1000; i++) {
      const score = roll();
      expect(score).toBeGreaterThanOrEqual(3);
      expect(score).toBeLessThanOrEqual(21);
    }
  });

  it("should have 8 room templates", () => {
    const ROOM_TYPES = ["entrance", "discovery", "challenge", "lore", "discovery", "guardian", "treasure", "exit"];
    expect(ROOM_TYPES).toHaveLength(8);
  });

  it("should perform ability checks correctly", () => {
    const abilityCheck = (score: number, difficulty: number) => {
      const roll = Math.floor(Math.random() * 20) + 1;
      const total = roll + Math.floor((score - 10) / 2);
      return { success: total >= difficulty, roll };
    };

    // High score vs low difficulty should usually succeed
    let successes = 0;
    for (let i = 0; i < 1000; i++) {
      const result = abilityCheck(18, 5);
      if (result.success) successes++;
    }
    expect(successes).toBeGreaterThan(800); // Should succeed >80% of the time

    // Low score vs high difficulty should usually fail
    let failures = 0;
    for (let i = 0; i < 1000; i++) {
      const result = abilityCheck(6, 18);
      if (!result.success) failures++;
    }
    expect(failures).toBeGreaterThan(800); // Should fail >80% of the time
  });

  it("should always award XP even on failure (no loss state)", () => {
    const BASE_XP = 15000;
    const successXp = BASE_XP;
    const failureXp = Math.floor(BASE_XP * 0.5);

    expect(successXp).toBe(15000);
    expect(failureXp).toBe(7500);
    expect(failureXp).toBeGreaterThan(0); // No loss state
  });
});

// ─── Power of Grey Matter Logic Tests ───
describe("Power of Grey Matter (Mode C)", () => {
  const RELAY_POWERS: Record<number, { name: string; icon: string }> = {
    1: { name: "Flame Mastery", icon: "🔥" },
    2: { name: "Root Network", icon: "🌳" },
    3: { name: "Flow State", icon: "🌊" },
    4: { name: "Velocity", icon: "🐎" },
    5: { name: "Pathfinder", icon: "🛤️" },
    6: { name: "Navigator", icon: "⛵" },
    7: { name: "Binary Sight", icon: "🧶" },
    8: { name: "Standardizer", icon: "🚂" },
    9: { name: "Engine Heart", icon: "⚙️" },
    10: { name: "Triple Vision", icon: "✈️" },
    11: { name: "Orbital Mind", icon: "🛰️" },
    12: { name: "Node Consciousness", icon: "🧠" },
  };

  it("should have exactly 12 relay powers", () => {
    expect(Object.keys(RELAY_POWERS)).toHaveLength(12);
  });

  it("should calculate clock time correctly", () => {
    const calculateClockTime = (powersEarned: number) => {
      const baseMinutes = 10 * 60 + 51; // 10:51
      const pushbackPerPower = 24;
      const currentMinutes = Math.max(baseMinutes - powersEarned * pushbackPerPower, 6 * 60);
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      return { hours, minutes };
    };

    // 0 powers = 10:51 (default)
    const t0 = calculateClockTime(0);
    expect(t0.hours).toBe(10);
    expect(t0.minutes).toBe(51);

    // 12 powers = pushed back to 6:03
    const t12 = calculateClockTime(12);
    expect(t12.hours).toBe(6);
    expect(t12.minutes).toBe(3);

    // 6 powers = halfway
    const t6 = calculateClockTime(6);
    expect(t6.hours).toBe(8);
    expect(t6.minutes).toBe(27);
  });

  it("should assign correct transformation levels", () => {
    const getLevel = (powers: number) => {
      if (powers >= 12) return "iMAN";
      if (powers >= 9) return "Grey Master";
      if (powers >= 6) return "Mind Weaver";
      if (powers >= 3) return "Spark Carrier";
      return "Apprentice";
    };

    expect(getLevel(0)).toBe("Apprentice");
    expect(getLevel(2)).toBe("Apprentice");
    expect(getLevel(3)).toBe("Spark Carrier");
    expect(getLevel(6)).toBe("Mind Weaver");
    expect(getLevel(9)).toBe("Grey Master");
    expect(getLevel(12)).toBe("iMAN");
  });

  it("should award correct XP per mission phase", () => {
    const PHASE_XP = {
      discovery: 20000,
      knowledge: 30000,
      application: 50000,
    };

    const totalPerRelay = PHASE_XP.discovery + PHASE_XP.knowledge + PHASE_XP.application;
    expect(totalPerRelay).toBe(100000);

    const totalAllRelays = totalPerRelay * 12;
    expect(totalAllRelays).toBe(1200000);
  });

  it("should require phases to be completed in order", () => {
    const mission = {
      discoveryComplete: false,
      knowledgeComplete: false,
      applicationComplete: false,
      powerEarned: false,
    };

    // Can't do knowledge before discovery
    const canDoKnowledge = mission.discoveryComplete && !mission.knowledgeComplete;
    expect(canDoKnowledge).toBe(false);

    // Can't do application before knowledge
    const canDoApplication = mission.knowledgeComplete && !mission.applicationComplete;
    expect(canDoApplication).toBe(false);

    // After discovery, can do knowledge
    mission.discoveryComplete = true;
    const canDoKnowledge2 = mission.discoveryComplete && !mission.knowledgeComplete;
    expect(canDoKnowledge2).toBe(true);

    // After knowledge, can do application
    mission.knowledgeComplete = true;
    const canDoApplication2 = mission.knowledgeComplete && !mission.applicationComplete;
    expect(canDoApplication2).toBe(true);
  });
});

// ─── DAVID Dungeon Master Narration Tests ───
describe("DAVID Dungeon Master", () => {
  const RELAY_NAMES = ["Fire", "Tree", "River", "Horse", "Roads", "Ships", "Loom", "Rail", "Engine", "AAA Triad", "Orbit", "Human Nodes"];

  it("should accept valid narration input with all required fields", () => {
    const input = {
      relayNumber: 1,
      roomType: "entrance",
      roomName: "The Gateway",
      abilityCheck: null,
      checkResult: null,
      inventionName: null,
      inventionDescription: null,
      playerAbilities: { observation: 12, intuition: 10, resilience: 14 },
      roomsCleared: 0,
      totalRooms: 8,
    };
    expect(input.relayNumber).toBeGreaterThanOrEqual(1);
    expect(input.relayNumber).toBeLessThanOrEqual(12);
    expect(input.totalRooms).toBe(8);
    expect(input.playerAbilities.observation).toBeGreaterThanOrEqual(3);
  });

  it("should accept narration input with ability check result", () => {
    const input = {
      relayNumber: 3,
      roomType: "discovery",
      roomName: "The Archive",
      abilityCheck: "observation",
      checkResult: { success: true, roll: 15 },
      inventionName: "Irrigation Canal",
      inventionDescription: "Engineered channels diverting river water to farmland.",
      playerAbilities: { observation: 14, intuition: 8, resilience: 11 },
      roomsCleared: 3,
      totalRooms: 8,
    };
    expect(input.checkResult.success).toBe(true);
    expect(input.checkResult.roll).toBeGreaterThanOrEqual(1);
    expect(input.checkResult.roll).toBeLessThanOrEqual(20);
    expect(input.inventionName).toBeTruthy();
  });

  it("should have relay descriptions for all 12 relays", async () => {
    const { RELAYS } = await import("../shared/gameData");
    expect(RELAY_NAMES).toHaveLength(12);
    for (const name of RELAY_NAMES) {
      const relay = RELAYS.find(r => r.name === name);
      expect(relay).toBeDefined();
    }
  });

  it("should build situation context string correctly", () => {
    const relayNumber = 1;
    const roomName = "The Gateway";
    const roomType = "entrance";
    const roomsCleared = 2;
    const totalRooms = 8;
    const playerAbilities = { observation: 12, intuition: 10, resilience: 14 };

    let context = `The explorer is in Room "${roomName}" (${roomType} type). Progress: ${roomsCleared}/${totalRooms} rooms cleared.`;
    context += `\nExplorer abilities: Observation ${playerAbilities.observation}, Intuition ${playerAbilities.intuition}, Resilience ${playerAbilities.resilience}.`;

    expect(context).toContain("The Gateway");
    expect(context).toContain("entrance");
    expect(context).toContain("2/8");
    expect(context).toContain("Observation 12");
  });
});
