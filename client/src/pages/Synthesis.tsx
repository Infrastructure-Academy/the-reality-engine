import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS, WEBS, XP_CAP, GURU_THRESHOLD } from "@shared/gameData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Trophy, Star, Zap, Globe, Compass, BookOpen,
  Sparkles, ChevronRight, Award, Target, Map as MapIcon
} from "lucide-react";
import { XpCounter } from "@/components/XpCounter";

// ─── Civilizational Perspective Classification ───
// Each relay maps to a civilizational perspective based on its historical context
const RELAY_PERSPECTIVES: Record<number, "west" | "east" | "nomadic"> = {
  1: "nomadic",   // Fire — universal/nomadic
  2: "east",      // Tree — Eastern agricultural roots
  3: "east",      // River — Cradles (Mesopotamia, Indus, Yellow River)
  4: "nomadic",   // Horse — Steppe nomads, velocity of intent
  5: "west",      // Roads — Roman Empire, arteries of intent
  6: "nomadic",   // Ships — Master Weaver's reach, connecting all
  7: "east",      // Loom — Silk Road, Chinese invention, binary birth
  8: "west",      // Rail — British Industrial Revolution
  9: "west",      // Engine — Western industrialization
  10: "west",     // AAA Triad — Aviation/Automobile/Assembly (Western convergence)
  11: "nomadic",  // Orbit — Global/digital frontier
  12: "nomadic",  // Human Nodes — Universal consciousness
};

const PERSPECTIVE_META = {
  west: {
    name: "Western",
    color: "#3b82f6",
    icon: "🏛️",
    description: "Systems, standardization, and industrial scale",
    scholars: ["Aristotle", "Newton", "Brunel"],
  },
  east: {
    name: "Eastern",
    color: "#ef4444",
    icon: "🏯",
    description: "Harmony, continuity, and organic growth",
    scholars: ["Sima Qian", "Sun Tzu", "Zhuge Liang"],
  },
  nomadic: {
    name: "Nomadic",
    color: "#f59e0b",
    icon: "🏕️",
    description: "Connection, adaptation, and universal reach",
    scholars: ["Ibn Battuta", "Marco Polo", "Genghis Khan"],
  },
};

// ─── Guest ID helper ───
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

// ─── Radar Chart SVG ───
function PerspectiveRadar({ west, east, nomadic }: { west: number; east: number; nomadic: number }) {
  const cx = 150, cy = 150, r = 110;
  const total = west + east + nomadic || 1;
  const wPct = west / total;
  const ePct = east / total;
  const nPct = nomadic / total;

  // Triangle vertices (top, bottom-left, bottom-right)
  const points = [
    { x: cx, y: cy - r },                              // West (top)
    { x: cx - r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) }, // East (bottom-left)
    { x: cx + r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) }, // Nomadic (bottom-right)
  ];

  // Data point
  const dx = cx + (wPct * (points[0].x - cx) + ePct * (points[1].x - cx) + nPct * (points[2].x - cx));
  const dy = cy + (wPct * (points[0].y - cy) + ePct * (points[1].y - cy) + nPct * (points[2].y - cy));

  // Grid lines (3 levels)
  const gridLevels = [0.33, 0.66, 1];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {gridLevels.map((level, i) => (
        <polygon
          key={i}
          points={points.map(p => `${cx + (p.x - cx) * level},${cy + (p.y - cy) * level}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {points.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
      ))}

      {/* Data triangle */}
      <polygon
        points={`${cx + wPct * (points[0].x - cx) * 2},${cy + wPct * (points[0].y - cy) * 2} ${cx + ePct * (points[1].x - cx) * 2},${cy + ePct * (points[1].y - cy) * 2} ${cx + nPct * (points[2].x - cx) * 2},${cy + nPct * (points[2].y - cy) * 2}`}
        fill="url(#radarGrad)"
        fillOpacity={0.3}
        stroke="url(#radarGrad)"
        strokeWidth={2}
      />

      {/* Center point */}
      <circle cx={dx} cy={dy} r={6} fill="#f59e0b" stroke="#fff" strokeWidth={2}>
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Labels */}
      <text x={points[0].x} y={points[0].y - 12} textAnchor="middle" className="fill-blue-400 text-xs font-bold">
        🏛️ WEST ({Math.round(wPct * 100)}%)
      </text>
      <text x={points[1].x - 8} y={points[1].y + 18} textAnchor="middle" className="fill-red-400 text-xs font-bold">
        🏯 EAST ({Math.round(ePct * 100)}%)
      </text>
      <text x={points[2].x + 8} y={points[2].y + 18} textAnchor="middle" className="fill-amber-400 text-xs font-bold">
        🏕️ NOMADIC ({Math.round(nPct * 100)}%)
      </text>

      {/* Gradient */}
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Relay Completion Ring ───
function CompletionRing({ completed, total }: { completed: number; total: number }) {
  const pct = total > 0 ? completed / total : 0;
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24">
      <circle cx={60} cy={60} r={r} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={8} />
      <circle
        cx={60} cy={60} r={r} fill="none"
        stroke="url(#ringGrad)" strokeWidth={8}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        className="transition-all duration-1000"
      />
      <text x={60} y={55} textAnchor="middle" className="fill-foreground text-lg font-bold">{completed}</text>
      <text x={60} y={72} textAnchor="middle" className="fill-muted-foreground text-[10px]">/ {total}</text>
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Synthesis() {
  const guestId = useMemo(() => getGuestId(), []);

  // Get or create profile
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    profileMutation.mutate({ guestId, mode: "explorer" }, {
      onSuccess: (profile) => { if (profile) setProfileId(profile.id); },
    });
  }, [guestId]);

  // Fetch relay progress
  const { data: progressData } = trpc.progress.getForProfile.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  // Compute synthesis data
  const synthesis = useMemo(() => {
    if (!progressData) return null;

    const completedRelays = progressData.filter(p => (p.completionPct ?? 0) >= 100);
    const allRelayProgress = new Map(progressData.map(p => [p.relayNumber, p]));

    // Count perspective distribution based on which relays have ANY progress
    const perspectives = { west: 0, east: 0, nomadic: 0 };
    let totalXpEarned = 0;
    let totalDiscoveries = 0;

    for (const p of progressData) {
      const perspective = RELAY_PERSPECTIVES[p.relayNumber];
      const pct = p.completionPct ?? 0;
      if (perspective && pct > 0) {
        // Weight by completion percentage
        perspectives[perspective] += pct;
      }
      totalXpEarned += p.xpEarned ?? 0;
      const items = p.discoveredItems;
      if (Array.isArray(items)) totalDiscoveries += items.length;
      else if (typeof items === "string") {
        try { totalDiscoveries += JSON.parse(items).length; } catch {}
      }
    }

    // Determine dominant perspective
    const sorted = Object.entries(perspectives).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0] as "west" | "east" | "nomadic";
    const isBalanced = sorted[0][1] > 0 && sorted[1][1] > 0 && (sorted[0][1] - sorted[1][1]) / sorted[0][1] < 0.15;

    return {
      completedRelays,
      allRelayProgress,
      perspectives,
      dominant,
      isBalanced,
      totalXpEarned,
      totalDiscoveries,
      completionCount: completedRelays.length,
      isComplete: completedRelays.length >= 12,
    };
  }, [progressData]);

  // Determine pattern title
  const patternTitle = useMemo(() => {
    if (!synthesis) return "Loading...";
    if (synthesis.isBalanced) return "The Balanced Navigator";
    const meta = PERSPECTIVE_META[synthesis.dominant];
    const titles: Record<string, string> = {
      west: "The Systems Architect",
      east: "The Harmony Weaver",
      nomadic: "The Universal Connector",
    };
    return titles[synthesis.dominant] || meta.name;
  }, [synthesis]);

  const [showDetails, setShowDetails] = useState(false);

  if (!synthesis) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center mobile-content-pad">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />
          <p className="text-muted-foreground">Analyzing your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad bg-starfield">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
          <h1 className="font-heading text-sm font-bold tracking-wider text-gold-gradient">SYNTHESIS</h1>
          <XpCounter value={synthesis.totalXpEarned} compact color="gold" />
        </div>
      </header>

      <div className="container py-8 max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-amber-400">
              {synthesis.isComplete ? "ODYSSEY COMPLETE" : `${synthesis.completionCount}/12 RELAYS EXPLORED`}
            </span>
          </div>

          <h2 className="font-heading text-4xl font-bold text-gold-gradient mb-2">
            Your Discovered Pattern
          </h2>
          <p className="text-lg text-muted-foreground">
            {synthesis.isComplete
              ? "You have traversed all 12 Civilisational Relays. Your pattern has been revealed."
              : "Your civilisational perspective is emerging as you explore more relays."}
          </p>
        </motion.div>

        {/* Pattern Title Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent mb-8 text-center"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-amber-400/60 mb-2">YOUR CIVILISATIONAL ARCHETYPE</p>
          <h3 className="font-heading text-3xl font-bold mb-3">
            {synthesis.isBalanced ? (
              <span className="bg-gradient-to-r from-blue-400 via-amber-400 to-red-400 bg-clip-text text-transparent">{patternTitle}</span>
            ) : (
              <span style={{ color: PERSPECTIVE_META[synthesis.dominant].color }}>{patternTitle}</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {synthesis.isBalanced
              ? "You gravitate equally toward all civilisational perspectives — a rare and valuable trait. You see infrastructure through every lens."
              : PERSPECTIVE_META[synthesis.dominant].description}
          </p>
          {!synthesis.isBalanced && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Aligned scholars:</span>
              {PERSPECTIVE_META[synthesis.dominant].scholars.map(s => (
                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/30 text-foreground">{s}</span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Radar Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="p-6 rounded-xl border border-border/50 bg-card/30">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">PERSPECTIVE DISTRIBUTION</p>
            <PerspectiveRadar
              west={synthesis.perspectives.west}
              east={synthesis.perspectives.east}
              nomadic={synthesis.perspectives.nomadic}
            />
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-card/30 flex flex-col items-center justify-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-4">RELAY COMPLETION</p>
            <CompletionRing completed={synthesis.completionCount} total={12} />
            <div className="mt-4 grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <p className="text-lg font-bold font-mono">{synthesis.totalDiscoveries}</p>
                <p className="text-[9px] text-muted-foreground uppercase">Discoveries</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-mono text-gold-gradient">
                  {synthesis.totalXpEarned >= 1_000_000
                    ? `${(synthesis.totalXpEarned / 1_000_000).toFixed(1)}M`
                    : `${(synthesis.totalXpEarned / 1000).toFixed(0)}K`}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-mono text-amber-400">
                  {Math.floor(synthesis.totalXpEarned / 100).toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase">BitPoints</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relay Progress Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
            <span>Relay-by-Relay Breakdown</span>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {RELAYS.map(relay => {
                    const progress = synthesis.allRelayProgress.get(relay.number);
                    const pct = progress?.completionPct ?? 0;
                    const perspective = RELAY_PERSPECTIVES[relay.number];
                    const perspectiveMeta = PERSPECTIVE_META[perspective];

                    return (
                      <Link key={relay.number} href={`/explore/${relay.number}`}>
                        <div className={`p-3 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer ${
                          pct >= 100
                            ? "border-amber-500/40 bg-amber-500/5"
                            : pct > 0
                              ? "border-border/50 bg-card/30"
                              : "border-border/20 bg-card/10 opacity-50"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{relay.emoji}</span>
                            <span className="text-xs font-bold truncate">{relay.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px]" style={{ color: perspectiveMeta.color }}>
                              {perspectiveMeta.icon} {perspectiveMeta.name}
                            </span>
                            <span className={`text-[10px] font-mono ${pct >= 100 ? "text-amber-400" : "text-muted-foreground"}`}>
                              {pct}%
                            </span>
                          </div>
                          {/* Mini progress bar */}
                          <div className="mt-1.5 h-1 rounded-full bg-muted/30 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: pct >= 100 ? "#f59e0b" : relay.color,
                              }}
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thesis Materials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-xl border border-border/50 bg-card/30 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold">Deeper Exploration</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your journey through the 12 Civilisational Relays is part of a larger work:
            <strong className="text-foreground"> An Infrastructure Odyssey — Episode 1: Calories to Consciousness</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-border/30 bg-muted/10">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold">The Perspective</span>
              </div>
              <p className="text-[10px] text-muted-foreground">The narrative foundation — 12,000 years of infrastructure told as story</p>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-muted/10">
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold">The Guide</span>
              </div>
              <p className="text-[10px] text-muted-foreground">The 4-Pillar Framework — Observational, Educational, Application, Thesis</p>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-muted/10">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">The Game</span>
              </div>
              <p className="text-[10px] text-muted-foreground">The Reality Engine — the Guided Learning Platform you just experienced</p>
            </div>
          </div>
        </motion.div>

        {/* Status Badge */}
        {synthesis.totalXpEarned >= GURU_THRESHOLD && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-transparent text-center mb-8"
          >
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <h3 className="font-heading text-xl font-bold text-amber-400 mb-1">GURU STATUS ACHIEVED</h3>
            <p className="text-xs text-muted-foreground">
              You have surpassed {(GURU_THRESHOLD / 1_000_000).toFixed(0)}M XP — you are among the first to master the Infrastructure Odyssey.
            </p>
          </motion.div>
        )}

        {/* Continue Exploring CTA */}
        <div className="text-center pb-8">
          <p className="text-xs text-muted-foreground mb-4">
            {synthesis.isComplete
              ? "Your odyssey is complete, but the infrastructure never stops. Return to any relay to deepen your understanding."
              : `${12 - synthesis.completionCount} relays remain. Continue your odyssey.`}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/explore/1">
              <Button variant="outline" className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                <MapIcon className="w-4 h-4" /> Explorer Mode
              </Button>
            </Link>
            <Link href="/flight-deck">
              <Button variant="outline" className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                <Compass className="w-4 h-4" /> Flight Deck
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2 border-border/50">
                <Trophy className="w-4 h-4" /> Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
