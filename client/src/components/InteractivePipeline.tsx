import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

/* ── Mode definitions matching the Pipeline image exactly ── */
type PipelineMode = {
  letter: string;
  name: string;
  ages: string;
  status: "live" | "designed" | "aspirational";
  href: string;
  /** localStorage key to check for visit (null = check auth/DB instead) */
  visitKey: string | null;
};

const LAYER_1: PipelineMode[] = [
  { letter: "A", name: "Relay Spinner", ages: "8–10", status: "live", href: "/explore/spinner", visitKey: "tre_spinner_collection" },
  { letter: "B", name: "Dungeon Crawl", ages: "10–12", status: "live", href: "/explore/dungeon", visitKey: "tre_dungeon_created" },
  { letter: "C", name: "Grey Matter", ages: "12–14", status: "live", href: "/explore/grey-matter", visitKey: "tre_gm_missions" },
  { letter: "D", name: "Flight Deck", ages: "14–18", status: "live", href: "/flight-deck", visitKey: "tre_prologue_seen" },
];

const LAYER_2: PipelineMode[] = [
  { letter: "E", name: "Scholar Mode", ages: "18+", status: "designed", href: "/scholar", visitKey: null },
  { letter: "F", name: "Academic Mode", ages: "University", status: "designed", href: "/play/igo", visitKey: null },
];

const LAYER_3: PipelineMode[] = [
  { letter: "G", name: "Graduate", ages: "22–29", status: "aspirational", href: "/play/igo", visitKey: null },
  { letter: "H", name: "Chartered", ages: "30+", status: "aspirational", href: "/play/igo", visitKey: null },
  { letter: "I", name: "Senior Leader", ages: "40+", status: "aspirational", href: "/play/igo", visitKey: null },
  { letter: "J", name: "Industry Leader", ages: "50+", status: "aspirational", href: "/play/igo", visitKey: null },
  { letter: "K", name: "Industry Champion", ages: "60+", status: "aspirational", href: "/play/igo", visitKey: null },
  { letter: "L", name: "Master Class", ages: "65+", status: "aspirational", href: "/play/igo", visitKey: null },
];

/* ── Visit detection from localStorage ── */
function detectVisited(): Set<string> {
  const visited = new Set<string>();
  try {
    // A — Relay Spinner
    const spinner = localStorage.getItem("tre_spinner_collection");
    if (spinner) {
      const arr = JSON.parse(spinner);
      if (Array.isArray(arr) && arr.length > 0) visited.add("A");
    }
    // B — Dungeon Crawl
    if (localStorage.getItem("tre_dungeon_created") === "true") visited.add("B");
    // C — Grey Matter
    const gm = localStorage.getItem("tre_gm_missions");
    if (gm) {
      const missions = JSON.parse(gm);
      if (Object.values(missions).some(Boolean)) visited.add("C");
    }
    // D — Flight Deck (check prologue or guest_id as proxy)
    if (localStorage.getItem("tre_prologue_seen") === "true") visited.add("D");
  } catch { /* ignore corrupt data */ }
  return visited;
}

/* ── Status colours ── */
const statusConfig = {
  live: { badge: "LIVE", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40", glow: "rgba(34,197,94,0.25)" },
  designed: { badge: "DESIGNED", bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/40", glow: "rgba(245,158,11,0.25)" },
  aspirational: { badge: "ASPIRATIONAL", bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/40", glow: "rgba(168,85,247,0.15)" },
};

/* ── Single mode box ── */
function ModeBox({ mode, visited, delay }: { mode: PipelineMode; visited: boolean; delay: number }) {
  const cfg = statusConfig[mode.status];
  const isLive = mode.status === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link href={mode.href}>
        <div
          className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-300 group ${
            visited
              ? "border-amber-400/60 bg-gradient-to-br from-amber-500/15 via-amber-600/5 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              : `${cfg.border} bg-gradient-to-br from-white/[0.03] to-transparent`
          } ${isLive ? "hover:scale-[1.04] hover:shadow-lg" : "hover:scale-[1.02]"}`}
          style={visited ? { boxShadow: `0 0 24px ${cfg.glow}, inset 0 1px 0 rgba(234,179,8,0.15)` } : undefined}
        >
          {/* Status badge */}
          <div className="absolute top-1 right-1">
            <span className={`text-[7px] md:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
              {cfg.badge}
            </span>
          </div>

          {/* Visited indicator */}
          {visited && (
            <div className="absolute top-1 left-1">
              <span className="text-[7px] md:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/30">
                ✦ VISITED
              </span>
            </div>
          )}

          {/* Letter + Name */}
          <div className="flex items-center gap-1.5 mt-3 mb-0.5">
            <span
              className={`font-heading text-lg md:text-xl font-bold ${visited ? "text-amber-400" : cfg.text}`}
            >
              {mode.letter}
            </span>
            <span className={`font-heading text-[10px] md:text-xs font-semibold truncate ${visited ? "text-foreground" : "text-foreground/80"}`}>
              {mode.name}
            </span>
          </div>

          {/* Age range */}
          <p className="text-[9px] md:text-[10px] text-muted-foreground font-mono">
            Ages {mode.ages}
          </p>

          {/* Play arrow for live modes */}
          {isLive && (
            <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-amber-400">▶</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Arrow connector ── */
function Arrow({ direction = "right", className = "" }: { direction?: "right" | "up"; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {direction === "right" ? (
        <span className="text-amber-500/40 text-xs">→</span>
      ) : (
        <span className="text-amber-500/40 text-xs">↑</span>
      )}
    </div>
  );
}

/* ── Main Interactive Pipeline ── */
export function InteractivePipeline() {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setVisited(detectVisited());
    setLoaded(true);
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handler = () => setVisited(detectVisited());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!loaded) return null;

  const visitedCount = visited.size;

  return (
    <div className="container max-w-5xl pb-4 pt-2">
      <div
        className="relative border border-amber-500/20 rounded-xl overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(10,15,30,0.98))" }}
      >
        {/* Title bar */}
        <div className="border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xs md:text-sm tracking-[0.2em] uppercase text-amber-400/90">
              <span className="brand-i">i</span>GO Lifecycle Timeline
            </span>
            <span className="text-[8px] text-muted-foreground/60 font-mono hidden sm:inline">— The Complete Pipeline</span>
          </div>
          {visitedCount > 0 && (
            <span className="text-[9px] font-mono text-amber-400/70">
              {visitedCount}/12 modes explored
            </span>
          )}
        </div>

        <div className="p-3 md:p-5 space-y-4">
          {/* ── LAYER 3 (top): iGO — Aspirational ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] md:text-[9px] font-mono tracking-wider text-purple-400/70 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                LAYER 3 — <span className="brand-i">i</span>GO (ASPIRATIONAL)
              </span>
              <span className="text-[8px] text-muted-foreground/50 hidden sm:inline">Professional Tools • D20 → D10/D12</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {LAYER_3.map((m, i) => (
                <ModeBox key={m.letter} mode={m} visited={visited.has(m.letter)} delay={0.3 + i * 0.04} />
              ))}
            </div>
          </div>

          {/* Arrow up */}
          <Arrow direction="up" className="py-0.5" />

          {/* ── LAYER 2 (middle): Scholar + Academic — Designed ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] md:text-[9px] font-mono tracking-wider text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                LAYER 2 — SCHOLAR + ACADEMIC (DESIGNED)
              </span>
              <span className="text-[8px] text-muted-foreground/50 hidden sm:inline">D8 → D10/D12</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
              {LAYER_2.map((m, i) => (
                <ModeBox key={m.letter} mode={m} visited={visited.has(m.letter)} delay={0.2 + i * 0.06} />
              ))}
            </div>
          </div>

          {/* Arrow up */}
          <Arrow direction="up" className="py-0.5" />

          {/* ── LAYER 1 (bottom): The Reality Engine — Live ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] md:text-[9px] font-mono tracking-wider text-green-400/70 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                LAYER 1 — THE REALITY ENGINE (LIVE)
              </span>
              <span className="text-[8px] text-muted-foreground/50 hidden sm:inline">Spinner → D6 → D8</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LAYER_1.map((m, i) => (
                <ModeBox key={m.letter} mode={m} visited={visited.has(m.letter)} delay={0.05 + i * 0.06} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar — matching pipeline image */}
        <div className="border-t border-amber-500/20 px-4 py-2 text-center">
          <p className="text-[8px] md:text-[9px] font-mono tracking-[0.15em] text-amber-400/50 uppercase">
            Same 12 Relays · Same 5 Webs · Same 91+ Inventions · Same DAVID AI
          </p>
        </div>

        {/* Bottom equation */}
        <div className="px-4 pb-3 text-center">
          <p className="text-[7px] md:text-[8px] font-mono tracking-wider text-muted-foreground/40">
            12 Civilisational Relays × 5 Great Webs = 60-Node Dearden Field — The Permanent Foundation
          </p>
        </div>
      </div>
    </div>
  );
}
