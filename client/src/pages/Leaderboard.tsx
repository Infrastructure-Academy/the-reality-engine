import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { RELAYS } from "@shared/gameData";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trophy, Zap, Star, Crown, Flame, Rocket, Brain,
  Medal, TrendingUp
} from "lucide-react";

type ModeFilter = "all" | "explorer" | "flight_deck" | "scholar";

// Demo leaderboard data (will be replaced by tRPC query)
const DEMO_ENTRIES = [
  { id: 1, displayName: "Commander Vex", mode: "scholar", totalXp: 18500000, relaysCompleted: 11, isGuru: true, bitPoints: 185000 },
  { id: 2, displayName: "Navigator Zara", mode: "flight_deck", totalXp: 14200000, relaysCompleted: 10, isGuru: true, bitPoints: 142000 },
  { id: 3, displayName: "Scholar Meridian", mode: "scholar", totalXp: 12800000, relaysCompleted: 9, isGuru: true, bitPoints: 128000 },
  { id: 4, displayName: "Explorer-7b2f91", mode: "explorer", totalXp: 9500000, relaysCompleted: 8, isGuru: false, bitPoints: 95000 },
  { id: 5, displayName: "Pilot Orion", mode: "flight_deck", totalXp: 8200000, relaysCompleted: 7, isGuru: false, bitPoints: 82000 },
  { id: 6, displayName: "Cadet Nova", mode: "flight_deck", totalXp: 6100000, relaysCompleted: 6, isGuru: false, bitPoints: 61000 },
  { id: 7, displayName: "Explorer-a3e4c1", mode: "explorer", totalXp: 4800000, relaysCompleted: 5, isGuru: false, bitPoints: 48000 },
  { id: 8, displayName: "Scholar Thales", mode: "scholar", totalXp: 3500000, relaysCompleted: 4, isGuru: false, bitPoints: 35000 },
  { id: 9, displayName: "Explorer-f9d2b7", mode: "explorer", totalXp: 2100000, relaysCompleted: 3, isGuru: false, bitPoints: 21000 },
  { id: 10, displayName: "Cadet Lyra", mode: "flight_deck", totalXp: 1200000, relaysCompleted: 2, isGuru: false, bitPoints: 12000 },
];

const modeIcons: Record<string, React.ElementType> = {
  explorer: Flame,
  flight_deck: Rocket,
  scholar: Brain,
};

const modeColors: Record<string, string> = {
  explorer: "#ef4444",
  flight_deck: "#06b6d4",
  scholar: "#f59e0b",
};

const modeLabels: Record<string, string> = {
  explorer: "Explorer",
  flight_deck: "Flight Deck",
  scholar: "Scholar",
};

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-sm font-mono text-muted-foreground w-5 text-center">{rank}</span>;
}

export default function Leaderboard() {
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");

  const filteredEntries = useMemo(() => {
    if (modeFilter === "all") return DEMO_ENTRIES;
    return DEMO_ENTRIES.filter(e => e.mode === modeFilter);
  }, [modeFilter]);

  // Stats
  const totalPlayers = DEMO_ENTRIES.length;
  const totalXp = DEMO_ENTRIES.reduce((s, e) => s + e.totalXp, 0);
  const guruCount = DEMO_ENTRIES.filter(e => e.isGuru).length;

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
          <h1 className="font-heading text-sm font-bold tracking-wider text-gold-gradient">LEADERBOARD</h1>
          <div />
        </div>
      </header>

      <div className="container py-8 max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="font-heading text-3xl font-bold text-gold-gradient">Hall of Infrastructure</h2>
          <p className="text-sm text-muted-foreground mt-1">Top explorers, pilots, and scholars across all modes</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-lg border border-border/50 bg-card/30 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Players</p>
            <p className="text-2xl font-bold font-mono">{totalPlayers}</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card/30 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Combined XP</p>
            <p className="text-2xl font-bold font-mono text-gold-gradient">{(totalXp / 1000000).toFixed(1)}M</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card/30 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">GURU Status</p>
            <p className="text-2xl font-bold font-mono text-amber-400">{guruCount}</p>
          </div>
        </div>

        {/* Mode Filter */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["all", "explorer", "flight_deck", "scholar"] as ModeFilter[]).map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                modeFilter === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "all" ? "All Modes" : modeLabels[mode]}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="rounded-xl border border-border/50 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[50px_1fr_100px_100px_80px_80px] gap-2 px-4 py-3 bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">XP</span>
            <span className="text-right">BitPoints</span>
            <span className="text-center">Relays</span>
            <span className="text-center">Status</span>
          </div>

          {/* Entries */}
          {filteredEntries.map((entry, idx) => {
            const ModeIcon = modeIcons[entry.mode] || Flame;
            const rank = idx + 1;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`grid grid-cols-[50px_1fr_100px_100px_80px_80px] gap-2 px-4 py-3 items-center border-b border-border/30 transition-colors hover:bg-muted/10 ${
                  rank <= 3 ? "bg-amber-500/5" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex items-center justify-center">{getRankIcon(rank)}</div>

                {/* Player */}
                <div className="flex items-center gap-2 min-w-0">
                  <ModeIcon className="w-4 h-4 shrink-0" style={{ color: modeColors[entry.mode] }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{entry.displayName}</p>
                    <p className="text-[10px] text-muted-foreground">{modeLabels[entry.mode]}</p>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-sm font-bold font-mono text-gold-gradient">{(entry.totalXp / 1000000).toFixed(1)}M</p>
                </div>

                {/* BitPoints */}
                <div className="text-right flex items-center justify-end gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="text-sm font-mono">{(entry.bitPoints / 1000).toFixed(0)}K</span>
                </div>

                {/* Relays */}
                <div className="text-center">
                  <span className="text-sm font-mono">{entry.relaysCompleted}/12</span>
                </div>

                {/* Status */}
                <div className="text-center">
                  {entry.isGuru ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-amber-400">GURU</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">Active</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* XP Cap Info */}
        <div className="mt-6 p-4 rounded-lg border border-border/50 bg-card/30 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-heading font-bold">XP System</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum XP cap: <span className="text-gold-gradient font-bold">24,000,000</span> | 
            BitPoints earned at 1:100 XP ratio | 
            GURU status awarded to early testers and top performers
          </p>
        </div>
      </div>
    </div>
  );
}
