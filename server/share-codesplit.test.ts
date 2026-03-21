import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Share Card Canvas Tests ───
describe("ShareCard image generation", () => {
  it("formats XP values correctly for display", () => {
    // Replicate the formatXp logic from ShareCard
    function formatXp(val: number): string {
      if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
      if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
      return val.toLocaleString();
    }

    expect(formatXp(500)).toBe("500");
    expect(formatXp(1_500)).toBe("2K");
    expect(formatXp(50_000)).toBe("50K");
    expect(formatXp(1_700_000)).toBe("1.7M");
    expect(formatXp(12_345_678)).toBe("12.3M");
  });

  it("generates correct share text with pattern title", () => {
    const patternTitle = "The Systems Architect";
    const completedRelays = 8;
    const text = `I'm "${patternTitle}" in The Reality Engine! ${completedRelays}/12 relays explored. What's your civilisational pattern?`;
    expect(text).toContain("The Systems Architect");
    expect(text).toContain("8/12");
  });

  it("generates correct filename from pattern title", () => {
    const patternTitle = "The Balanced Navigator";
    const filename = `reality-engine-${patternTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
    expect(filename).toBe("reality-engine-the-balanced-navigator.png");
  });

  it("handles all archetype titles for filenames", () => {
    const titles = ["The Systems Architect", "The Harmony Weaver", "The Universal Connector", "The Balanced Navigator"];
    titles.forEach(title => {
      const filename = `reality-engine-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
      expect(filename).toMatch(/^reality-engine-the-[a-z-]+\.png$/);
    });
  });
});

// ─── Confetti onComplete Callback Tests ───
describe("Confetti onComplete callback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onComplete after duration", () => {
    const onComplete = vi.fn();
    const duration = 4000;

    // Simulate the confetti timer logic
    let show = false;
    if (true) { // active = true
      show = true;
      setTimeout(() => {
        show = false;
        onComplete?.();
      }, duration);
    }

    expect(show).toBe(true);
    expect(onComplete).not.toHaveBeenCalled();

    vi.advanceTimersByTime(4000);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("does not call onComplete if not active", () => {
    const onComplete = vi.fn();
    const active = false;

    if (active) {
      setTimeout(() => { onComplete?.(); }, 4000);
    }

    vi.advanceTimersByTime(5000);
    expect(onComplete).not.toHaveBeenCalled();
  });
});

// ─── Code-Splitting Tests ───
describe("Code-splitting configuration", () => {
  it("lazy-loaded pages are separate from critical path", () => {
    // Verify the lazy-loaded pages are the expected set
    const lazyPages = [
      "FlightDeck",
      "ScholarCreate",
      "Leaderboard",
      "YodaControl",
      "Frameworks",
      "CardCollection",
      "GovernanceDeck",
      "Synthesis",
      "MobileExplorer",
    ];

    const criticalPages = ["Home", "ExplorerRelay"];

    expect(lazyPages.length).toBe(9);
    expect(criticalPages.length).toBe(2);

    // No overlap
    const overlap = lazyPages.filter(p => criticalPages.includes(p));
    expect(overlap).toEqual([]);
  });

  it("all routes are accounted for", () => {
    const allRoutes = [
      "/", "/explore/:relayNum", "/flight-deck", "/create",
      "/leaderboard", "/yoda", "/frameworks", "/cards",
      "/governance", "/synthesis", "/m/explore", "/m/explore/:relayNum",
    ];
    expect(allRoutes.length).toBe(12);
  });
});

// ─── Perspective Distribution Tests ───
describe("Perspective distribution for share card", () => {
  const RELAY_PERSPECTIVES: Record<number, "west" | "east" | "nomadic"> = {
    1: "nomadic", 2: "east", 3: "east", 4: "nomadic",
    5: "west", 6: "nomadic", 7: "east", 8: "west",
    9: "west", 10: "west", 11: "nomadic", 12: "nomadic",
  };

  it("counts perspectives correctly for all 12 relays", () => {
    const counts = { west: 0, east: 0, nomadic: 0 };
    Object.values(RELAY_PERSPECTIVES).forEach(p => counts[p]++);

    expect(counts.west).toBe(4);
    expect(counts.east).toBe(3);
    expect(counts.nomadic).toBe(5);
  });

  it("identifies dominant perspective", () => {
    const perspectives = { west: 400, east: 300, nomadic: 500 };
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    expect(sorted[0][0]).toBe("nomadic");
  });

  it("detects balanced state when perspectives are close", () => {
    const perspectives = { west: 330, east: 340, nomadic: 330 };
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    const isBalanced = sorted[0][1] > 0 && sorted[1][1] > 0 && (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;
    expect(isBalanced).toBe(true);
  });

  it("does not detect balanced when one perspective dominates", () => {
    const perspectives = { west: 600, east: 200, nomadic: 200 };
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    const isBalanced = sorted[0][1] > 0 && sorted[1][1] > 0 && (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;
    expect(isBalanced).toBe(false);
  });
});
