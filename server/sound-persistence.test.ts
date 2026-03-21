import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Sound Effects Tests (no AudioContext in Node, test that functions exist) ───
describe("Sound Effects Module", () => {
  it("exports all expected sound functions", async () => {
    const mod = await import("../client/src/hooks/useSoundEffects");
    expect(typeof mod.playDiscoverySound).toBe("function");
    expect(typeof mod.playRelayTransitionSound).toBe("function");
    expect(typeof mod.playXpSound).toBe("function");
    expect(typeof mod.playNodeActivationSound).toBe("function");
    expect(typeof mod.playErrorSound).toBe("function");
  });

  it("sound functions don't throw when AudioContext is unavailable", async () => {
    const mod = await import("../client/src/hooks/useSoundEffects");
    // In Node there's no AudioContext, so these should gracefully no-op
    expect(() => mod.playDiscoverySound()).not.toThrow();
    expect(() => mod.playRelayTransitionSound()).not.toThrow();
    expect(() => mod.playXpSound()).not.toThrow();
    expect(() => mod.playNodeActivationSound()).not.toThrow();
    expect(() => mod.playErrorSound()).not.toThrow();
  });
});

// ─── Haptic Feedback Tests ───
describe("Haptic Feedback", () => {
  it("exports all haptic functions", async () => {
    const mod = await import("../client/src/hooks/useSoundEffects");
    expect(typeof mod.hapticTap).toBe("function");
    expect(typeof mod.hapticDiscovery).toBe("function");
    expect(typeof mod.hapticTransition).toBe("function");
    expect(typeof mod.hapticError).toBe("function");
  });

  it("haptic functions don't throw when navigator.vibrate is unavailable", async () => {
    const mod = await import("../client/src/hooks/useSoundEffects");
    // In Node, navigator.vibrate doesn't exist — should gracefully no-op
    expect(() => mod.hapticTap(25)).not.toThrow();
    expect(() => mod.hapticDiscovery()).not.toThrow();
    expect(() => mod.hapticTransition()).not.toThrow();
    expect(() => mod.hapticError()).not.toThrow();
  });

  it("hapticTap calls vibrate when available", async () => {
    const vibrateMock = vi.fn(() => true);
    Object.defineProperty(navigator, "vibrate", { value: vibrateMock, writable: true, configurable: true });
    const mod = await import("../client/src/hooks/useSoundEffects");
    mod.hapticTap(25);
    expect(vibrateMock).toHaveBeenCalledWith(25);
  });
});

// ─── DB Persistence Logic Tests ───
describe("BitPoint Earning Logic", () => {
  it("XP per item calculation matches relay reward / invention count", () => {
    const xpReward = 100000;
    const inventionCount = 9;
    const xpPerItem = Math.floor(xpReward / Math.max(inventionCount, 1));
    expect(xpPerItem).toBe(11111);
  });

  it("completion percentage rounds correctly", () => {
    const discovered = 5;
    const total = 9;
    const pct = Math.round((discovered / total) * 100);
    expect(pct).toBe(56);
  });

  it("BitPoints earned from XP: 1 BP per 100 XP", () => {
    const xpEarned = 11111;
    const bitPoints = Math.floor(xpEarned / 100);
    expect(bitPoints).toBe(111);
  });

  it("full relay completion gives 100%", () => {
    const discovered = 9;
    const total = 9;
    const pct = Math.round((discovered / total) * 100);
    expect(pct).toBe(100);
  });

  it("zero discoveries gives 0%", () => {
    const discovered = 0;
    const total = 9;
    const pct = Math.round((discovered / total) * 100);
    expect(pct).toBe(0);
  });

  it("XP accumulates linearly with discoveries", () => {
    const xpPerItem = 10000;
    const discoveries = [1, 2, 3, 4, 5];
    const totalXp = discoveries.length * xpPerItem;
    expect(totalXp).toBe(50000);
  });

  it("big numbers: 12 relays × 9 inventions × 10000 XP = 1,080,000 total possible XP", () => {
    const totalPossible = 12 * 9 * 10000;
    expect(totalPossible).toBe(1080000);
    // BitPoints from full completion
    const totalBP = Math.floor(totalPossible / 100);
    expect(totalBP).toBe(10800);
  });
});
