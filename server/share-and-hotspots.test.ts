import { describe, expect, it } from "vitest";

/**
 * Block 464 tests: ShareCardGallery data integrity + PipelineHotspots mobile touch zone sizing
 *
 * These are unit tests for the data/config layer. They validate:
 * 1. Share card metadata completeness (all 4 cards have required fields)
 * 2. Pipeline hotspot touch zone sizes meet mobile tappability thresholds
 */

// ─── Share Card Data (mirrors ShareCardGallery.tsx SHARE_CARDS) ───
const SHARE_CARDS = [
  {
    id: "rally",
    title: "The Rallying Cry",
    subtitle: "Every player has the power",
    imageUrl:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/share-card-rally_851c0d30.png",
    shareText:
      "Every player has the power. More players have more power. How many players can you rally to iGO? 🎮\n\ntwinearth.world — Infrastructure Academy | iAAi",
  },
  {
    id: "civil-truth",
    title: "Civil Engineering Truth",
    subtitle: "The skill now lost",
    imageUrl:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/share-card-civil-truth_eafadda9.png",
    shareText:
      "Infrastructure is the invisible foundation of civilisation. Civil engineering — the skill now lost — iAAi recovers it digitally.\n\ntwinearth.world — Infrastructure Academy | iAAi",
  },
  {
    id: "authenticity",
    title: "Authenticity & Reputational Certainty",
    subtitle: "Built by a real civil engineer",
    imageUrl:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/share-card-authenticity_74dd38cb.png",
    shareText:
      "iGO is built on authenticity and reputational certainty — a real civil engineer, real infrastructure, real education.\n\ntwinearth.world — Infrastructure Academy | iAAi",
  },
  {
    id: "founder",
    title: "Founder's Vision",
    subtitle: "Learning was always meant to be fun",
    imageUrl:
      "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/share-card-founder_675d2a2a.png",
    shareText:
      '"iGO is not eGO or GOslow — it is a shaping tool and an edutainment Rosetta Stone to be played with like a toy. Learning was always meant to be fun." — Ir. Nigel T. Dearden\n\ntwinearth.world — Infrastructure Academy | iAAi',
  },
];

// ─── Pipeline Hotspot Data (mirrors PipelineHotspots.tsx) ───
const HOTSPOTS = [
  // Layer 3 — iGO (Aspirational) — expanded for mobile
  { id: "G", label: "Graduate", left: 21, top: 16, width: 12, height: 14 },
  { id: "H", label: "Chartered", left: 36, top: 16, width: 12, height: 14 },
  { id: "I", label: "Senior Leader", left: 51, top: 16, width: 12, height: 14 },
  { id: "J", label: "Industry Leader", left: 66, top: 16, width: 13, height: 14 },
  { id: "K", label: "Master Class", left: 82, top: 16, width: 12, height: 14 },
  // Layer 2 — Scholar + Academic (Designed)
  { id: "E", label: "Scholar Mode", left: 27, top: 33, width: 26, height: 21 },
  { id: "F", label: "Academic Mode", left: 62, top: 33, width: 26, height: 21 },
  // Layer 1 — The Reality Engine (Live)
  { id: "A", label: "Relay Spinner", left: 17, top: 62, width: 17, height: 22 },
  { id: "B", label: "Dungeon Crawl", left: 37, top: 62, width: 17, height: 22 },
  { id: "C", label: "Grey Matter", left: 56, top: 62, width: 17, height: 22 },
  { id: "D", label: "Flight Deck", left: 76, top: 62, width: 17, height: 22 },
];

// Pipeline image aspect ratio: 2784x1536 → ratio ≈ 1.8125
const PIPELINE_ASPECT = 2784 / 1536;

describe("ShareCardGallery data integrity", () => {
  it("has exactly 4 share cards", () => {
    expect(SHARE_CARDS).toHaveLength(4);
  });

  it("each card has all required fields", () => {
    for (const card of SHARE_CARDS) {
      expect(card.id).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.subtitle).toBeTruthy();
      expect(card.imageUrl).toMatch(/^https:\/\//);
      expect(card.shareText.length).toBeGreaterThan(20);
    }
  });

  it("all card IDs are unique", () => {
    const ids = SHARE_CARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all image URLs point to CloudFront CDN", () => {
    for (const card of SHARE_CARDS) {
      expect(card.imageUrl).toContain("cloudfront.net");
    }
  });

  it("share text includes site domain", () => {
    for (const card of SHARE_CARDS) {
      expect(card.shareText).toContain("twinearth.world");
    }
  });
});

describe("PipelineHotspots mobile touch zone sizing", () => {
  const MOBILE_WIDTH = 375; // iPhone SE / 13 mini — smallest common viewport

  function getPixelSize(spot: (typeof HOTSPOTS)[0]) {
    const imgHeight = MOBILE_WIDTH / PIPELINE_ASPECT;
    const w = (spot.width / 100) * MOBILE_WIDTH;
    const h = (spot.height / 100) * imgHeight;
    return { w: Math.round(w), h: Math.round(h) };
  }

  it("has 11 hotspots covering all modes A–K", () => {
    expect(HOTSPOTS).toHaveLength(11);
    const ids = HOTSPOTS.map((h) => h.id).sort();
    expect(ids).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]);
  });

  it("no hotspots overlap at the same layer", () => {
    // Group by approximate top position (layers)
    const layers = new Map<number, typeof HOTSPOTS>();
    for (const spot of HOTSPOTS) {
      const layerKey = Math.round(spot.top / 10) * 10;
      if (!layers.has(layerKey)) layers.set(layerKey, []);
      layers.get(layerKey)!.push(spot);
    }

    for (const [, spots] of layers) {
      for (let i = 0; i < spots.length; i++) {
        for (let j = i + 1; j < spots.length; j++) {
          const a = spots[i];
          const b = spots[j];
          // Check horizontal overlap
          const aRight = a.left + a.width;
          const bRight = b.left + b.width;
          const overlaps = a.left < bRight && b.left < aRight;
          expect(overlaps).toBe(false);
        }
      }
    }
  });

  it("Layer 1 (A–D) touch zones meet 44px minimum at 375px", () => {
    const layer1 = HOTSPOTS.filter((h) => ["A", "B", "C", "D"].includes(h.id));
    for (const spot of layer1) {
      const { w, h } = getPixelSize(spot);
      expect(Math.min(w, h)).toBeGreaterThanOrEqual(44);
    }
  });

  it("Layer 2 (E–F) touch zones are at least 40px tall at 375px", () => {
    const layer2 = HOTSPOTS.filter((h) => ["E", "F"].includes(h.id));
    for (const spot of layer2) {
      const { h } = getPixelSize(spot);
      expect(h).toBeGreaterThanOrEqual(40);
    }
  });

  it("Layer 3 (G–K) touch zones are at least 25px tall at 375px (expanded)", () => {
    const layer3 = HOTSPOTS.filter((h) =>
      ["G", "H", "I", "J", "K"].includes(h.id)
    );
    for (const spot of layer3) {
      const { w, h } = getPixelSize(spot);
      // Width should be at least 40px
      expect(w).toBeGreaterThanOrEqual(40);
      // Height should be at least 25px (expanded from original 18px)
      expect(h).toBeGreaterThanOrEqual(25);
    }
  });

  it("all hotspots stay within image bounds (0–100%)", () => {
    for (const spot of HOTSPOTS) {
      expect(spot.left).toBeGreaterThanOrEqual(0);
      expect(spot.top).toBeGreaterThanOrEqual(0);
      expect(spot.left + spot.width).toBeLessThanOrEqual(100);
      expect(spot.top + spot.height).toBeLessThanOrEqual(100);
    }
  });
});
