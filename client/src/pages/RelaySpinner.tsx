import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS } from "@shared/gameData";
import { INVENTIONS, type Invention } from "@shared/inventions";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Dices, Star, Sparkles, RotateCw, Gift, Zap } from "lucide-react";
import { playDiscoverySound, playXpSound, hapticDiscovery } from "@/hooks/useSoundEffects";
import { XpCounter } from "@/components/XpCounter";
import { SoundToggle } from "@/components/SoundToggle";

// ─── Guest ID ───
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

// ─── Spin state persistence ───
function getSpinsToday(): number {
  const key = `tre_spins_${new Date().toISOString().slice(0, 10)}`;
  return parseInt(localStorage.getItem(key) || "0", 10);
}
function incrementSpins(): number {
  const key = `tre_spins_${new Date().toISOString().slice(0, 10)}`;
  const next = getSpinsToday() + 1;
  localStorage.setItem(key, String(next));
  return next;
}

const MAX_SPINS = 12;

// ─── Reward tiers ───
type RewardTier = "jackpot" | "era_bonus" | "partial" | "explorer_find";

function getRewardTier(reels: number[]): RewardTier {
  if (reels[0] === reels[1] && reels[1] === reels[2]) return "jackpot";
  const relayData = reels.map(r => RELAYS[r]);
  if (relayData[0].era === relayData[1].era || relayData[1].era === relayData[2].era || relayData[0].era === relayData[2].era) return "era_bonus";
  if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) return "partial";
  return "explorer_find";
}

const REWARD_CONFIG: Record<RewardTier, { label: string; xp: number; color: string; emoji: string; description: string }> = {
  jackpot: { label: "JACKPOT!", xp: 50000, color: "#d4a843", emoji: "🎯", description: "Triple match! Full Discovery unlocked!" },
  era_bonus: { label: "ERA BONUS", xp: 25000, color: "#3b82f6", emoji: "⚡", description: "Same era connection found!" },
  partial: { label: "PARTIAL MATCH", xp: 15000, color: "#10b981", emoji: "✨", description: "Two matching — Lore Fragment earned!" },
  explorer_find: { label: "EXPLORER FIND", xp: 10000, color: "#94a3b8", emoji: "🔍", description: "Random discovery — every spin wins!" },
};

// ─── Reel animation ───
function SpinningReel({ targetIndex, spinning, delay }: { targetIndex: number; spinning: boolean; delay: number }) {
  const [displayIndex, setDisplayIndex] = useState(targetIndex);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (spinning) {
      let tick = 0;
      intervalRef.current = setInterval(() => {
        setDisplayIndex(Math.floor(Math.random() * 12));
        tick++;
      }, 80);

      // Stop after delay
      const timeout = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayIndex(targetIndex);
      }, 800 + delay);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        clearTimeout(timeout);
      };
    } else {
      setDisplayIndex(targetIndex);
    }
  }, [spinning, targetIndex, delay]);

  const relay = RELAYS[displayIndex];
  return (
    <motion.div
      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all"
      style={{
        borderColor: spinning ? "#ffffff30" : `${relay.color}60`,
        backgroundColor: spinning ? "#ffffff08" : `${relay.color}10`,
      }}
      animate={spinning ? { y: [0, -4, 0] } : {}}
      transition={spinning ? { repeat: Infinity, duration: 0.15 } : {}}
    >
      <span className="text-3xl sm:text-4xl">{relay.emoji}</span>
      <span className="text-[10px] font-mono text-muted-foreground">{relay.name}</span>
    </motion.div>
  );
}

export default function RelaySpinner() {
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

  // Spin state
  const [spinsUsed, setSpinsUsed] = useState(getSpinsToday);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([0, 4, 8]); // Initial display
  const [lastReward, setLastReward] = useState<RewardTier | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Collection grid — which relays have been hit by jackpot
  const [collection, setCollection] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("tre_spinner_collection");
      return saved ? new Set(JSON.parse(saved)) : new Set<number>();
    } catch { return new Set<number>(); }
  });

  // Discovery tracking — inventions unlocked per relay
  const [discoveries, setDiscoveries] = useState<Record<number, number[]>>(() => {
    try {
      const saved = localStorage.getItem("tre_spinner_discoveries");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  // Save collection and discoveries to localStorage
  useEffect(() => {
    localStorage.setItem("tre_spinner_collection", JSON.stringify(Array.from(collection)));
  }, [collection]);
  useEffect(() => {
    localStorage.setItem("tre_spinner_discoveries", JSON.stringify(discoveries));
  }, [discoveries]);

  const spinsRemaining = MAX_SPINS - spinsUsed;

  const handleSpin = useCallback(() => {
    if (spinning || spinsRemaining <= 0) return;

    setShowReward(false);
    setSpinning(true);
    hapticDiscovery();

    // Generate random results
    const newReels = [
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 12),
    ];

    // Bias toward partial matches (30% chance of at least 2 matching)
    if (Math.random() < 0.3) {
      newReels[1] = newReels[0];
    }
    // Jackpot chance ~5%
    if (Math.random() < 0.05) {
      newReels[1] = newReels[0];
      newReels[2] = newReels[0];
    }

    setReels(newReels);

    // After animation completes
    setTimeout(() => {
      setSpinning(false);
      const tier = getRewardTier(newReels);
      setLastReward(tier);
      setShowReward(true);

      const reward = REWARD_CONFIG[tier];
      setTotalXp(prev => prev + reward.xp);
      incrementSpins();
      setSpinsUsed(getSpinsToday());

      playDiscoverySound();
      setTimeout(() => playXpSound(), 300);

      // Log XP
      if (profileId) {
        addXpMutation.mutate({
          profileId,
          amount: reward.xp,
          source: "spinner",
          sourceId: `spin-${Date.now()}`,
          description: `Spinner ${tier}: ${RELAYS[newReels[0]].name}/${RELAYS[newReels[1]].name}/${RELAYS[newReels[2]].name}`,
        });
      }

      // Unlock discovery for the dominant relay
      const dominantRelay = newReels[0]; // Use first reel
      const relayInventions = INVENTIONS[dominantRelay + 1] || [];
      const existing = discoveries[dominantRelay] || [];
      if (existing.length < relayInventions.length) {
        const nextIdx = existing.length;
        const updated = { ...discoveries, [dominantRelay]: [...existing, nextIdx] };
        setDiscoveries(updated);
      }

      // Jackpot adds to collection
      if (tier === "jackpot") {
        setCollection(prev => new Set(Array.from(prev).concat([newReels[0]])));
      }
    }, 1400);
  }, [spinning, spinsRemaining, profileId, discoveries]);

  const totalDiscoveries = Object.values(discoveries).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative mobile-content-pad">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-blue-600 text-white">SPINNER</span>
            <XpCounter value={totalXp} compact color="gold" />
          </div>
          <SoundToggle compact color="gold" />
        </div>
      </header>

      <div className="container py-6 max-w-lg mx-auto">
        {/* Spins remaining */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-1">Daily Spins</p>
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: MAX_SPINS }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < spinsUsed ? "bg-blue-600/30" : "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]"
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-mono mt-2">
            <span className="text-blue-400 font-bold">{spinsRemaining}</span>
            <span className="text-muted-foreground"> spins remaining today</span>
          </p>
        </div>

        {/* Slot Machine */}
        <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 mb-6">
          {/* Machine frame */}
          <div className="text-center mb-4">
            <h2 className="font-heading text-xl font-bold tracking-wider text-gold-gradient">RELAY SPINNER</h2>
            <p className="text-[10px] text-muted-foreground">Match symbols to unlock discoveries</p>
          </div>

          {/* Reels */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <SpinningReel targetIndex={reels[0]} spinning={spinning} delay={0} />
            <SpinningReel targetIndex={reels[1]} spinning={spinning} delay={200} />
            <SpinningReel targetIndex={reels[2]} spinning={spinning} delay={400} />
          </div>

          {/* Spin Button */}
          <Button
            onClick={handleSpin}
            disabled={spinning || spinsRemaining <= 0}
            className="w-full h-14 text-lg font-heading tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-40"
            size="lg"
          >
            {spinning ? (
              <RotateCw className="w-6 h-6 animate-spin" />
            ) : spinsRemaining <= 0 ? (
              "COME BACK TOMORROW"
            ) : (
              <>
                <Dices className="w-5 h-5 mr-2" />
                PULL THE LEVER
              </>
            )}
          </Button>
        </div>

        {/* Reward Display */}
        <AnimatePresence>
          {showReward && lastReward && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-xl border p-4 mb-6 text-center"
              style={{
                borderColor: `${REWARD_CONFIG[lastReward].color}40`,
                backgroundColor: `${REWARD_CONFIG[lastReward].color}10`,
              }}
            >
              <p className="text-2xl mb-1">{REWARD_CONFIG[lastReward].emoji}</p>
              <p className="font-heading text-lg font-bold tracking-wider" style={{ color: REWARD_CONFIG[lastReward].color }}>
                {REWARD_CONFIG[lastReward].label}
              </p>
              <p className="text-sm text-muted-foreground mb-2">{REWARD_CONFIG[lastReward].description}</p>
              <p className="text-lg font-mono font-bold text-gold-gradient">
                +{REWARD_CONFIG[lastReward].xp.toLocaleString()} XP
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collection Grid */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase tracking-wider text-gold font-bold">Relay Collection</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{collection.size}/12</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {RELAYS.map((relay, idx) => {
              const collected = collection.has(idx);
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all ${
                    collected
                      ? "border-gold/40 bg-gold/10"
                      : "border-border/30 bg-card/20 opacity-40"
                  }`}
                  title={collected ? `${relay.name} — Collected!` : `${relay.name} — Need Jackpot`}
                >
                  <span className="text-lg">{relay.emoji}</span>
                  <span className="text-[8px] font-mono text-muted-foreground">{relay.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discovery Stats */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Discoveries Unlocked</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {RELAYS.map((relay, idx) => {
              const count = (discoveries[idx] || []).length;
              const total = (INVENTIONS[idx + 1] || []).length;
              return (
                <div key={idx} className="text-center">
                  <span className="text-base">{relay.emoji}</span>
                  <p className="text-[10px] font-mono text-muted-foreground">{count}/{total}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-center">
            <p className="text-sm font-mono">
              <span className="text-blue-400 font-bold">{totalDiscoveries}</span>
              <span className="text-muted-foreground"> total discoveries</span>
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total XP", value: totalXp.toLocaleString(), icon: Zap, color: "#d4a843" },
            { label: "Spins Today", value: String(spinsUsed), icon: Dices, color: "#3b82f6" },
            { label: "Collection", value: `${collection.size}/12`, icon: Star, color: "#10b981" },
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
