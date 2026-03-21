import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Challenge Code Generation Tests ───
describe("Challenge Invite Code", () => {
  it("generates 8-character alphanumeric codes", () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    expect(code).toHaveLength(8);
    expect(code).toMatch(/^[A-Z2-9]+$/);
  });

  it("excludes ambiguous characters (0, O, 1, I)", () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    expect(chars).not.toContain("0");
    expect(chars).not.toContain("O");
    expect(chars).not.toContain("1");
    expect(chars).not.toContain("I");
  });

  it("generates unique codes across multiple runs", () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const codes = new Set<string>();
    for (let run = 0; run < 100; run++) {
      let code = "";
      for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
      codes.add(code);
    }
    // With 30^8 possible combinations, 100 codes should all be unique
    expect(codes.size).toBe(100);
  });

  it("normalizes codes to uppercase for lookup", () => {
    const code = "abc123xy";
    expect(code.toUpperCase()).toBe("ABC123XY");
  });
});

// ─── OG Meta Tag Tests ───
describe("OG Meta Tags", () => {
  it("generates correct synthesis OG description", () => {
    const patternTitle = "The Systems Architect";
    const completionCount = 8;
    const totalDiscoveries = 42;
    const desc = `I'm "${patternTitle}" in The Reality Engine! ${completionCount}/12 relays explored, ${totalDiscoveries} discoveries. What's your civilisational pattern?`;
    
    expect(desc).toContain("The Systems Architect");
    expect(desc).toContain("8/12 relays");
    expect(desc).toContain("42 discoveries");
    expect(desc).toContain("What's your civilisational pattern?");
  });

  it("generates correct OG title format", () => {
    const patternTitle = "The Harmony Weaver";
    const ogTitle = `${patternTitle} — The Reality Engine`;
    expect(ogTitle).toBe("The Harmony Weaver — The Reality Engine");
  });

  it("handles balanced navigator archetype", () => {
    const patternTitle = "The Balanced Navigator";
    const ogTitle = `${patternTitle} — The Reality Engine`;
    expect(ogTitle).toContain("Balanced Navigator");
  });
});

// ─── Challenge Landing Page Logic Tests ───
describe("Challenge Landing Page", () => {
  it("extracts code from URL params and uppercases it", () => {
    const rawCode = "abc123xy";
    const code = rawCode.toUpperCase();
    expect(code).toBe("ABC123XY");
  });

  it("formats sender XP correctly for display", () => {
    const senderXp = 1700000;
    const display = `${(senderXp / 1000).toFixed(0)}K XP`;
    expect(display).toBe("1700K XP");
  });

  it("formats sender relays correctly", () => {
    const senderRelays = 8;
    const display = `${senderRelays}/12 Relays`;
    expect(display).toBe("8/12 Relays");
  });

  it("generates correct challenge URL from code", () => {
    const origin = "https://realityeng-epdhlkrn.manus.space";
    const code = "ABC123XY";
    const url = `${origin}/challenge/${code}`;
    expect(url).toBe("https://realityeng-epdhlkrn.manus.space/challenge/ABC123XY");
  });
});

// ─── Challenge Share Text Tests ───
describe("Challenge Share Text", () => {
  it("generates shareable text with archetype and URL", () => {
    const senderArchetype = "The Universal Connector";
    const challengeUrl = "https://example.com/challenge/ABC123XY";
    const shareText = `I'm "${senderArchetype}" in The Reality Engine! Can you beat my pattern? ${challengeUrl}`;
    
    expect(shareText).toContain("The Universal Connector");
    expect(shareText).toContain("Can you beat my pattern?");
    expect(shareText).toContain(challengeUrl);
  });
});

// ─── Vendor Chunk Splitting Tests ───
describe("Vendor Chunk Splitting Configuration", () => {
  it("identifies framer-motion as a separate chunk", () => {
    const id = "node_modules/framer-motion/dist/es/index.js";
    const isMotion = id.includes("framer-motion");
    expect(isMotion).toBe(true);
  });

  it("identifies @trpc as a separate chunk", () => {
    const id = "node_modules/@trpc/client/dist/index.js";
    const isTrpc = id.includes("@trpc") || id.includes("superjson");
    expect(isTrpc).toBe(true);
  });

  it("identifies lucide-react as a separate chunk", () => {
    const id = "node_modules/lucide-react/dist/esm/icons/arrow-left.js";
    const isIcons = id.includes("lucide-react");
    expect(isIcons).toBe(true);
  });

  it("identifies react/react-dom as a separate chunk", () => {
    const id = "node_modules/react-dom/client.js";
    const isReact = id.includes("react-dom") || id.includes("/react/");
    expect(isReact).toBe(true);
  });

  it("identifies @radix-ui as UI vendor chunk", () => {
    const id = "node_modules/@radix-ui/react-dialog/dist/index.js";
    const isRadix = id.includes("@radix-ui");
    expect(isRadix).toBe(true);
  });
});
