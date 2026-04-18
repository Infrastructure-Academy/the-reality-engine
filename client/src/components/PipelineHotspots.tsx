import { useState, useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Touch-zone hotspot overlay on the original pipeline PNG.
 * All positions are percentage-based so they scale identically
 * on mobile (320px wide) and laptop (1200px wide).
 *
 * Visited detection:
 *  - Layer 1 (LIVE) modes: read from their own localStorage keys
 *    (tre_spinner_collection, tre_dungeon_created, tre_gm_missions, tre_prologue_seen)
 *  - All modes: also tracked via tre_pipeline_visited (set of mode IDs clicked)
 *    so DESIGNED and ASPIRATIONAL modes light up as quick links too.
 */

const VISIT_STORE_KEY = "tre_pipeline_visited";

type Hotspot = {
  id: string;
  label: string;
  href: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const HOTSPOTS: Hotspot[] = [
  // ── LAYER 3 — iGO (Aspirational) ──
  { id: "G", label: "Graduate",        href: "/play/igo", left: 21,  top: 20, width: 12, height: 9 },
  { id: "H", label: "Chartered",       href: "/play/igo", left: 36,  top: 20, width: 12, height: 9 },
  { id: "I", label: "Senior Leader",   href: "/play/igo", left: 51,  top: 20, width: 12, height: 9 },
  { id: "J", label: "Industry Leader", href: "/play/igo", left: 66,  top: 20, width: 13, height: 9 },
  { id: "K", label: "Master Class",    href: "/play/igo", left: 82,  top: 20, width: 12, height: 9 },

  // ── LAYER 2 — Scholar + Academic (Designed) ──
  { id: "E", label: "Scholar Mode",    href: "/scholar",  left: 27, top: 36, width: 26, height: 17 },
  { id: "F", label: "Academic Mode",   href: "/play/igo", left: 62, top: 36, width: 26, height: 17 },

  // ── LAYER 1 — The Reality Engine (Live) ──
  { id: "A", label: "Relay Spinner",   href: "/explore/spinner",     left: 17, top: 62, width: 17, height: 22 },
  { id: "B", label: "Dungeon Crawl",   href: "/explore/dungeon",     left: 37, top: 62, width: 17, height: 22 },
  { id: "C", label: "Grey Matter",     href: "/explore/grey-matter", left: 56, top: 62, width: 17, height: 22 },
  { id: "D", label: "Flight Deck",     href: "/flight-deck",         left: 76, top: 62, width: 17, height: 22 },
];

const PIPELINE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iGO_Pipeline_v3_fixed_4c69f89d.png";

/** Read visited modes from all sources */
function detectVisited(): Set<string> {
  const visited = new Set<string>();
  try {
    // Layer 1 LIVE modes — detect from their own game-state keys
    const spinner = localStorage.getItem("tre_spinner_collection");
    if (spinner) { const a = JSON.parse(spinner); if (Array.isArray(a) && a.length > 0) visited.add("A"); }
    if (localStorage.getItem("tre_dungeon_created") === "true") visited.add("B");
    const gm = localStorage.getItem("tre_gm_missions");
    if (gm) { const m = JSON.parse(gm); if (Object.values(m).some(Boolean)) visited.add("C"); }
    if (localStorage.getItem("tre_prologue_seen") === "true") visited.add("D");

    // All modes — detect from pipeline click history
    const clickHistory = localStorage.getItem(VISIT_STORE_KEY);
    if (clickHistory) {
      const ids: string[] = JSON.parse(clickHistory);
      ids.forEach((id) => visited.add(id));
    }
  } catch { /* ignore corrupt data */ }
  return visited;
}

/** Record a mode click to localStorage */
function recordVisit(modeId: string) {
  try {
    const raw = localStorage.getItem(VISIT_STORE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (!ids.includes(modeId)) {
      ids.push(modeId);
      localStorage.setItem(VISIT_STORE_KEY, JSON.stringify(ids));
    }
  } catch { /* ignore */ }
}

export function PipelineHotspots() {
  const [, navigate] = useLocation();
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    setVisited(detectVisited());
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = () => setVisited(detectVisited());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleClick = (spot: Hotspot) => {
    recordVisit(spot.id);
    setVisited((prev) => { const next = new Set(Array.from(prev)); next.add(spot.id); return next; });
    navigate(spot.href);
  };

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ maxWidth: "100%" }}>
        {/* The original pipeline image */}
        <img
          src={PIPELINE_IMG}
          alt="iGO Lifecycle Timeline — The Complete Pipeline: 3 Layers, 12 Modes, Ages 8–65+"
          className="w-full h-auto block"
          loading="lazy"
          draggable={false}
        />

        {/* Invisible touch zones */}
        {HOTSPOTS.map((spot) => {
          const isVisited = visited.has(spot.id);
          return (
            <button
              key={spot.id}
              onClick={() => handleClick(spot)}
              aria-label={`${spot.label}${isVisited ? " (visited)" : ""}`}
              title={spot.label}
              className="absolute cursor-pointer border-0 p-0 m-0 transition-all duration-200"
              style={{
                left: `${spot.left}%`,
                top: `${spot.top}%`,
                width: `${spot.width}%`,
                height: `${spot.height}%`,
                background: isVisited
                  ? "rgba(234, 179, 8, 0.15)"
                  : "transparent",
                borderRadius: "4px",
                boxShadow: isVisited
                  ? "0 0 12px rgba(234, 179, 8, 0.3), inset 0 0 8px rgba(234, 179, 8, 0.1)"
                  : "none",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(234, 179, 8, 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isVisited
                  ? "rgba(234, 179, 8, 0.15)"
                  : "transparent";
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
