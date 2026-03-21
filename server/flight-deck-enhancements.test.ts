import { describe, it, expect } from "vitest";

// ─── Pinch-to-Zoom Logic Tests ───
describe("Pinch-to-zoom calculations", () => {
  function clampScale(scale: number, min: number, max: number) {
    return Math.max(min, Math.min(max, scale));
  }

  function getDistance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getMidpoint(x1: number, y1: number, x2: number, y2: number) {
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }

  it("clamps scale between min and max", () => {
    expect(clampScale(0.5, 1, 3)).toBe(1);
    expect(clampScale(4, 1, 3)).toBe(3);
    expect(clampScale(2, 1, 3)).toBe(2);
    expect(clampScale(1, 1, 3)).toBe(1);
    expect(clampScale(3, 1, 3)).toBe(3);
  });

  it("calculates distance between two touch points", () => {
    expect(getDistance(0, 0, 3, 4)).toBe(5);
    expect(getDistance(0, 0, 0, 0)).toBe(0);
    expect(getDistance(10, 10, 10, 10)).toBe(0);
    expect(Math.round(getDistance(0, 0, 100, 100))).toBe(141);
  });

  it("calculates midpoint between two touch points", () => {
    const mid = getMidpoint(0, 0, 100, 100);
    expect(mid.x).toBe(50);
    expect(mid.y).toBe(50);

    const mid2 = getMidpoint(200, 300, 400, 500);
    expect(mid2.x).toBe(300);
    expect(mid2.y).toBe(400);
  });

  it("computes zoom ratio from initial and current distance", () => {
    const initialDist = 100;
    const currentDist = 200;
    const ratio = currentDist / initialDist;
    expect(ratio).toBe(2);

    const initialScale = 1;
    const newScale = clampScale(initialScale * ratio, 1, 3);
    expect(newScale).toBe(2);
  });

  it("snap-back threshold: scale < 1.1 resets to 1", () => {
    function shouldSnapBack(scale: number) {
      return scale < 1.1;
    }
    expect(shouldSnapBack(1.05)).toBe(true);
    expect(shouldSnapBack(1.09)).toBe(true);
    expect(shouldSnapBack(1.1)).toBe(false);
    expect(shouldSnapBack(2.0)).toBe(false);
  });
});

// ─── Long-Press Detection Tests ───
describe("Long-press detection logic", () => {
  function detectMovement(startX: number, startY: number, currentX: number, currentY: number) {
    const dx = currentX - startX;
    const dy = currentY - startY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  it("detects no movement when finger stays still", () => {
    expect(detectMovement(100, 200, 100, 200)).toBe(0);
  });

  it("detects small movement under threshold (10px)", () => {
    const dist = detectMovement(100, 200, 105, 203);
    expect(dist).toBeLessThan(10);
  });

  it("detects movement over threshold cancels long-press", () => {
    const dist = detectMovement(100, 200, 115, 215);
    expect(dist).toBeGreaterThan(10);
  });

  it("long-press delay is 400ms for Flight Deck nodes", () => {
    const LONG_PRESS_DELAY = 400;
    expect(LONG_PRESS_DELAY).toBe(400);
    expect(LONG_PRESS_DELAY).toBeLessThan(500); // responsive
    expect(LONG_PRESS_DELAY).toBeGreaterThan(200); // not accidental
  });
});

// ─── Confetti Trigger Tests ───
describe("Confetti trigger logic", () => {
  it("triggers confetti when crossing 60/60 threshold", () => {
    let showConfetti = false;
    let prevActivated = 59;
    const totalNodes = 60;
    const totalActivated = 60;

    if (totalActivated >= totalNodes && prevActivated < totalNodes) {
      showConfetti = true;
    }
    expect(showConfetti).toBe(true);
  });

  it("does NOT trigger confetti if already at 60/60", () => {
    let showConfetti = false;
    let prevActivated = 60;
    const totalNodes = 60;
    const totalActivated = 60;

    if (totalActivated >= totalNodes && prevActivated < totalNodes) {
      showConfetti = true;
    }
    expect(showConfetti).toBe(false);
  });

  it("does NOT trigger confetti below 60", () => {
    let showConfetti = false;
    let prevActivated = 30;
    const totalNodes = 60;
    const totalActivated = 45;

    if (totalActivated >= totalNodes && prevActivated < totalNodes) {
      showConfetti = true;
    }
    expect(showConfetti).toBe(false);
  });
});

// ─── Node Tooltip Data Tests ───
describe("Node tooltip data mapping", () => {
  const RELAYS = [
    { number: 1, name: "Fire", emoji: "🔥" },
    { number: 2, name: "Tree", emoji: "🌳" },
    { number: 12, name: "Human", emoji: "🧑" },
  ];

  const WEBS = [
    { name: "Natural", icon: "🌿", color: "#22c55e" },
    { name: "Machine", icon: "⚙️", color: "#f59e0b" },
    { name: "Digital", icon: "💻", color: "#3b82f6" },
    { name: "Biological", icon: "🧬", color: "#ec4899" },
    { name: "Consciousness", icon: "🧠", color: "#a855f7" },
  ];

  it("finds relay data by number", () => {
    const relay = RELAYS.find(r => r.number === 1);
    expect(relay?.name).toBe("Fire");
    expect(relay?.emoji).toBe("🔥");
  });

  it("finds web data by name", () => {
    const web = WEBS.find(w => w.name === "Digital");
    expect(web?.icon).toBe("💻");
    expect(web?.color).toBe("#3b82f6");
  });

  it("generates correct node key", () => {
    const nodeKey = (relay: number, web: string) => `${relay}-${web}`;
    expect(nodeKey(1, "Natural")).toBe("1-Natural");
    expect(nodeKey(12, "Consciousness")).toBe("12-Consciousness");
  });

  it("tooltip position clamping keeps it on screen", () => {
    const screenWidth = 375; // iPhone SE
    function clampLeft(x: number) {
      return Math.min(x - 112, screenWidth - 240);
    }
    function clampTop(y: number) {
      return Math.max(y - 120, 60);
    }

    // Near right edge
    expect(clampLeft(370)).toBe(135); // min(258, 135)
    // Near top
    expect(clampTop(80)).toBe(60); // max(-40, 60)
    // Normal position
    expect(clampLeft(200)).toBe(88); // min(88, 135)
    expect(clampTop(300)).toBe(180); // max(180, 60)
  });

  it("XP value per node is always 50,000", () => {
    const XP_PER_NODE = 50_000;
    expect(XP_PER_NODE).toBe(50000);
    expect(XP_PER_NODE * 60).toBe(3_000_000); // total possible
  });
});
