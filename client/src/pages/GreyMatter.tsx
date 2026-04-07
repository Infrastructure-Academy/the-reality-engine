import { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS } from "@shared/gameData";
import { INVENTIONS } from "@shared/inventions";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Zap, Clock, Shield, Eye, Lightbulb, ChevronRight, ChevronLeft, Flame, Star } from "lucide-react";
import { playDiscoverySound, playXpSound, hapticDiscovery } from "@/hooks/useSoundEffects";
import { XpCounter } from "@/components/XpCounter";
import { SoundToggle } from "@/components/SoundToggle";
import { ExplorerVideo } from "@/components/ExplorerVideo";
import { SiteHeader } from "@/components/SiteHeader";

// ─── Guest ID ───
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

// ─── Mission phases per relay ───
type MissionPhase = "discovery" | "knowledge" | "application";

interface MissionState {
  phase: MissionPhase;
  discoveryComplete: boolean;
  knowledgeComplete: boolean;
  applicationComplete: boolean;
  powerEarned: boolean;
}

const INITIAL_MISSION: MissionState = {
  phase: "discovery",
  discoveryComplete: false,
  knowledgeComplete: false,
  applicationComplete: false,
  powerEarned: false,
};

// ─── Power Icon Images (CDN) ───
const POWER_IMAGES: Record<number, string> = {
  1: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-01-flame_1a1a6e10.png",
  2: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-02-root-8gaSp4UTShaXtGupT9GMdp.png",
  3: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-03-flow-aTAP4LWmoa8aX2wdznHc9z.png",
  4: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-04-horse_1fe98d0a.png",
  5: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-05-roads_35354d7f.png",
  6: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-06-ships_8016f51a.png",
  7: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-07-loom_3ca5bc74.png",
  8: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-08-rail_2a2694e0.png",
  9: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-09-engine_c6d0b3ac.png",
  10: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-10-triad_367592e1.png",
  11: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-11-orbit_8627aa4b.png",
  12: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/power-12-nodes_76e7b719.png",
};

// ─── Relay Powers ───
const RELAY_POWERS: Record<number, { name: string; description: string; icon: string }> = {
  1: { name: "Flame Mastery", description: "Control the eternal constant — the power to ignite and transform", icon: "🔥" },
  2: { name: "Root Network", description: "Connect to the living foundation — the power of growth", icon: "🌳" },
  3: { name: "Flow State", description: "Channel the cradles of continuity — the power of adaptation", icon: "🌊" },
  4: { name: "Velocity", description: "Harness the velocity of intent — the power of speed", icon: "🐎" },
  5: { name: "Pathfinder", description: "Map the arteries of intent — the power of connection", icon: "🛤️" },
  6: { name: "Navigator", description: "Command the master weaver's reach — the power of exploration", icon: "⛵" },
  7: { name: "Binary Sight", description: "See the binary birth — the power of pattern recognition", icon: "🧶" },
  8: { name: "Standardizer", description: "Align the continental rhythm — the power of systems", icon: "🚂" },
  9: { name: "Engine Heart", description: "Drive the internal revolution — the power of energy", icon: "⚙️" },
  10: { name: "Triple Vision", description: "Perceive the triple convergence — the power of synthesis", icon: "✈️" },
  11: { name: "Orbital Mind", description: "Access the programmable frontier — the power of code", icon: "🛰️" },
  12: { name: "Node Consciousness", description: "Become the torus metaphor — the power of collective intelligence", icon: "🧠" },
};

// ─── Clock calculation ───
function calculateClockTime(powersEarned: number): { hours: number; minutes: number; label: string } {
  // Start at 10:51 AM (default S = 0.25), each power pushes clock back
  // 12 powers = push from 10:51 to ~6:00 (safe zone)
  const baseMinutes = 10 * 60 + 51; // 10:51 = 651 minutes
  const pushbackPerPower = 24; // ~24 minutes per power
  const currentMinutes = Math.max(baseMinutes - (powersEarned * pushbackPerPower), 6 * 60);
  const hours = Math.floor(currentMinutes / 60);
  const minutes = currentMinutes % 60;
  return { hours, minutes, label: `${hours}:${String(minutes).padStart(2, "0")}` };
}

// ─── Transformation levels ───
function getTransformationLevel(powers: number): { title: string; color: string; description: string } {
  if (powers >= 12) return { title: "iMAN", color: "#d4a843", description: "Full transformation — all 12 powers earned. The Clock is pushed back." };
  if (powers >= 9) return { title: "Grey Master", color: "#a855f7", description: "Neural pathways blazing. Three more powers to full transformation." };
  if (powers >= 6) return { title: "Mind Weaver", color: "#3b82f6", description: "Halfway there. The Clock is slowing." };
  if (powers >= 3) return { title: "Spark Carrier", color: "#10b981", description: "The first connections are forming." };
  return { title: "Apprentice", color: "#94a3b8", description: "The journey begins. Earn your first power." };
}

export default function GreyMatter() {
  const [, navigate] = useLocation();
  const guestId = useMemo(() => getGuestId(), []);

  // Profile
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const addXpMutation = trpc.profile.addXp.useMutation();
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    profileMutation.mutate(
      { guestId, mode: "explorer" },
      { onSuccess: (p) => { if (p) setProfileId(p.id); } }
    );
  }, [guestId]);

  // State
  const [currentRelay, setCurrentRelay] = useState(1);
  const [missions, setMissions] = useState<Record<number, MissionState>>(() => {
    try {
      const saved = localStorage.getItem("tre_gm_missions");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [totalXp, setTotalXp] = useState(0);
  const [showPowerUp, setShowPowerUp] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem("tre_gm_missions", JSON.stringify(missions));
  }, [missions]);

  const currentMission = missions[currentRelay] || INITIAL_MISSION;
  const relay = RELAYS[currentRelay - 1];
  const inventions = INVENTIONS[currentRelay] || [];
  const power = RELAY_POWERS[currentRelay];
  const powersEarned = Object.values(missions).filter(m => m.powerEarned).length;
  const clockTime = calculateClockTime(powersEarned);
  const transformation = getTransformationLevel(powersEarned);

  const updateMission = useCallback((relayNum: number, update: Partial<MissionState>) => {
    setMissions(prev => ({
      ...prev,
      [relayNum]: { ...(prev[relayNum] || INITIAL_MISSION), ...update },
    }));
  }, []);

  const handleDiscoveryPhase = useCallback(() => {
    if (currentMission.discoveryComplete) return;
    updateMission(currentRelay, { discoveryComplete: true, phase: "knowledge" });
    setTotalXp(prev => prev + 20000);
    playDiscoverySound();
    if (profileId) {
      addXpMutation.mutate({
        profileId, amount: 20000, source: "greymatter",
        sourceId: `gm-${currentRelay}-discovery`,
        description: `Discovery phase complete for Relay ${currentRelay}: ${relay.name}`,
      });
    }
  }, [currentMission, currentRelay, profileId, relay.name]);

  const handleKnowledgePhase = useCallback(() => {
    if (currentMission.knowledgeComplete) return;
    updateMission(currentRelay, { knowledgeComplete: true, phase: "application" });
    setTotalXp(prev => prev + 30000);
    playXpSound();
    if (profileId) {
      addXpMutation.mutate({
        profileId, amount: 30000, source: "greymatter",
        sourceId: `gm-${currentRelay}-knowledge`,
        description: `Knowledge phase complete for Relay ${currentRelay}: ${relay.name}`,
      });
    }
  }, [currentMission, currentRelay, profileId, relay.name]);

  const handleApplicationPhase = useCallback(() => {
    if (currentMission.applicationComplete) return;
    updateMission(currentRelay, { applicationComplete: true, powerEarned: true });
    setTotalXp(prev => prev + 50000);
    setShowPowerUp(true);
    hapticDiscovery();
    playDiscoverySound();
    setTimeout(() => playXpSound(), 500);
    if (profileId) {
      addXpMutation.mutate({
        profileId, amount: 50000, source: "greymatter",
        sourceId: `gm-${currentRelay}-application`,
        description: `POWER EARNED: ${power.name} from Relay ${currentRelay}: ${relay.name}`,
      });
    }
    setTimeout(() => setShowPowerUp(false), 3000);
  }, [currentMission, currentRelay, profileId, relay.name, power.name]);

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative mobile-content-pad">
      <SiteHeader title="Grey Matter" showBack />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Power-up overlay */}
      <AnimatePresence>
        {showPowerUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center p-8"
            >
              {POWER_IMAGES[currentRelay] ? (
                <motion.img
                  src={POWER_IMAGES[currentRelay]}
                  alt={power.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ) : (
                <motion.p
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {power.icon}
                </motion.p>
              )}
              <p className="font-heading text-2xl font-bold tracking-wider text-gold-gradient mb-2">POWER EARNED!</p>
              <p className="font-heading text-xl font-bold text-amber-400 mb-2">{power.name}</p>
              <p className="text-sm text-muted-foreground mb-4">{power.description}</p>
              <p className="text-lg font-mono font-bold text-gold-gradient">+50,000 XP</p>
              <p className="text-xs text-muted-foreground mt-2">Clock pushed back to {calculateClockTime(powersEarned).label}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-amber-600 text-black">GREY MATTER</span>
            <XpCounter value={totalXp} compact color="gold" />
          </div>
          <SoundToggle compact color="gold" />
        </div>
      </header>

      <div className="container py-2 max-w-lg mx-auto">
        {/* Intro Video */}
        <ExplorerVideo
          videoUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v3-grey-matter_5eaff673.mp4"
          title="Unlock the Powers That Built Everything"
          subtitle="30s intro"
          accentColor="#d4a843"
          glowColor="rgba(212,168,67,0.15)"
        />

        {/* Clock & Transformation Status */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Transformation Level</p>
              <p className="font-heading text-lg font-bold" style={{ color: transformation.color }}>{transformation.title}</p>
              <p className="text-[10px] text-muted-foreground">{transformation.description}</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-amber-400 mx-auto mb-1" />
              <p className="font-mono text-lg font-bold text-amber-400">{clockTime.label}</p>
              <p className="text-[9px] text-muted-foreground">Civilisation Clock</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Powers: {powersEarned}/12</span>
              <span>{powersEarned >= 12 ? "iMAN ACHIEVED" : `${12 - powersEarned} powers to iMan`}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border/30 mt-1.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(powersEarned / 12) * 100}%`,
                  backgroundColor: transformation.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Relay Selector */}
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={() => currentRelay > 1 && setCurrentRelay(prev => prev - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <p className="text-2xl">{relay.emoji}</p>
            <p className="font-heading text-sm font-bold tracking-wider">{relay.name}</p>
            <p className="text-[10px] text-muted-foreground">{relay.era}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => currentRelay < 12 && setCurrentRelay(prev => prev + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mission Card */}
        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 mb-3">
          {currentMission.powerEarned ? (
            /* Power already earned */
            <div className="text-center py-4">
              <motion.p className="text-4xl mb-2" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                {power.icon}
              </motion.p>
              <p className="font-heading text-lg font-bold text-gold-gradient">{power.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Power earned! This relay is complete.</p>
              <p className="text-xs text-emerald-400 mt-2 font-bold uppercase tracking-wider">✓ ALL PHASES COMPLETE</p>
            </div>
          ) : (
            /* Active mission phases */
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Mission: Earn the Power of <span className="text-amber-400 font-bold">{power.name}</span>
              </p>

              {/* Phase 1: Discovery */}
              <div className={`rounded-lg border p-4 mb-3 transition-all ${
                currentMission.discoveryComplete
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : !currentMission.discoveryComplete
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/30 bg-card/20 opacity-50"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-bold">Phase 1: Discovery</p>
                    <p className="text-[10px] text-muted-foreground">Explore the relay's inventions and uncover its secrets</p>
                  </div>
                </div>
                {!currentMission.discoveryComplete ? (
                  <Button
                    onClick={handleDiscoveryPhase}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-black text-xs font-heading tracking-wider mt-2"
                    size="sm"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> EXPLORE {inventions.length} INVENTIONS
                  </Button>
                ) : (
                  <p className="text-xs text-emerald-400 font-bold mt-2">✓ Discovery Complete — +20,000 XP</p>
                )}
              </div>

              {/* Phase 2: Knowledge */}
              <div className={`rounded-lg border p-4 mb-3 transition-all ${
                currentMission.knowledgeComplete
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : currentMission.discoveryComplete && !currentMission.knowledgeComplete
                    ? "border-blue-500/30 bg-blue-500/5"
                    : "border-border/30 bg-card/20 opacity-50"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-bold">Phase 2: Knowledge</p>
                    <p className="text-[10px] text-muted-foreground">Connect the dots — how does this relay link to others?</p>
                  </div>
                </div>
                {currentMission.discoveryComplete && !currentMission.knowledgeComplete ? (
                  <Button
                    onClick={handleKnowledgePhase}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-heading tracking-wider mt-2"
                    size="sm"
                  >
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5" /> STUDY THE CONNECTIONS
                  </Button>
                ) : currentMission.knowledgeComplete ? (
                  <p className="text-xs text-emerald-400 font-bold mt-2">✓ Knowledge Complete — +30,000 XP</p>
                ) : null}
              </div>

              {/* Phase 3: Application */}
              <div className={`rounded-lg border p-4 transition-all ${
                currentMission.applicationComplete
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : currentMission.knowledgeComplete && !currentMission.applicationComplete
                    ? "border-purple-500/30 bg-purple-500/5"
                    : "border-border/30 bg-card/20 opacity-50"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-bold">Phase 3: Application</p>
                    <p className="text-[10px] text-muted-foreground">Apply the knowledge — earn the power, push the Clock back</p>
                  </div>
                </div>
                {currentMission.knowledgeComplete && !currentMission.applicationComplete ? (
                  <Button
                    onClick={handleApplicationPhase}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading tracking-wider mt-2"
                    size="sm"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" /> EARN THE POWER
                  </Button>
                ) : currentMission.applicationComplete ? (
                  <p className="text-xs text-emerald-400 font-bold mt-2">✓ Power Earned — +50,000 XP</p>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Powers Grid */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Powers of Grey Matter</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(RELAY_POWERS).map(([num, p]) => {
              const earned = missions[Number(num)]?.powerEarned;
              return (
                <div
                  key={num}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                    earned
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-border/30 bg-card/20 opacity-40 grayscale"
                  }`}
                  onClick={() => setCurrentRelay(Number(num))}
                  title={earned ? `${p.name} — Earned!` : `${p.name} — Locked`}
                >
                  {POWER_IMAGES[Number(num)] ? (
                    <img
                      src={POWER_IMAGES[Number(num)]}
                      alt={p.name}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg">{p.icon}</span>
                  )}
                  <span className="text-[7px] font-mono text-muted-foreground mt-0.5">{p.name.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* iMan transformation banner */}
        {powersEarned >= 12 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-gold/40 bg-gradient-to-b from-amber-600/20 to-transparent p-6 text-center mb-6"
          >
            <motion.p
              className="text-4xl mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🧠
            </motion.p>
            <p className="font-heading text-2xl font-bold tracking-wider text-gold-gradient mb-2">
              BY THE POWER OF GREY MATTER!
            </p>
            <p className="font-heading text-xl font-bold text-amber-400 mb-2">I HAVE THE KNOWLEDGE!</p>
            <p className="text-sm text-muted-foreground">
              You are now <span className="text-gold font-bold">iMan</span>. All 12 powers earned.
              The Civilisation Clock has been pushed back to {clockTime.label}.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Total XP: {totalXp.toLocaleString()}</p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[
            { label: "Powers", value: `${powersEarned}/12`, icon: Star, color: "#d4a843" },
            { label: "Clock", value: clockTime.label, icon: Clock, color: "#f59e0b" },
            { label: "Total XP", value: totalXp.toLocaleString(), icon: Zap, color: "#a855f7" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border/30 p-3 text-center bg-card/20">
              <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
              <p className="text-sm font-mono font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
