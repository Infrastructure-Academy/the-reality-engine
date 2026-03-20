import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Star, Trophy, Flame, TreePine, Waves, Compass, Map, Ship, Scissors, TrainFront, Cog, Satellite, Globe, Zap } from "lucide-react";
import { RELAYS } from "@shared/gameData";
import { INVENTIONS } from "@shared/inventions";

const RELAY_ICONS = [Flame, TreePine, Waves, Compass, Map, Ship, Scissors, TrainFront, Cog, Zap, Satellite, Globe];
const RELAY_COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#06b6d4", "#ec4899", "#6366f1", "#f97316", "#eab308", "#8b5cf6", "#14b8a6"];

export default function MobileExplorer() {
  const params = useParams<{ relayNum?: string }>();
  const initialRelay = params.relayNum ? parseInt(params.relayNum) - 1 : 0;
  const [currentRelay, setCurrentRelay] = useState(Math.max(0, Math.min(11, initialRelay)));
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const dragX = useMotionValue(0);
  const swipeThreshold = 50;

  const relay = RELAYS[currentRelay];
  const relayInventions = useMemo(() => {
    return (INVENTIONS[currentRelay + 1] || []).map((inv, idx) => ({ ...inv, idx }));
  }, [currentRelay]);

  const relayKey = `relay-${currentRelay}`;
  const relayDiscovered = useMemo(() => {
    return Array.from(discoveredItems).filter(id => id.startsWith(relayKey)).length;
  }, [discoveredItems, relayKey]);

  const handleDiscover = useCallback((inventionId: string) => {
    const key = `${relayKey}-${inventionId}`;
    if (!discoveredItems.has(key)) {
      setDiscoveredItems(prev => { const next = new Set(Array.from(prev)); next.add(key); return next; });
      setTotalXP(prev => prev + 100);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }
  }, [discoveredItems, relayKey]);

  const goToRelay = useCallback((dir: number) => {
    setCurrentRelay(prev => {
      const next = prev + dir;
      if (next < 0) return 11;
      if (next > 11) return 0;
      return next;
    });
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -swipeThreshold) goToRelay(1);
    else if (info.offset.x > swipeThreshold) goToRelay(-1);
  };

  const Icon = RELAY_ICONS[currentRelay];
  const color = RELAY_COLORS[currentRelay];

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad flex flex-col overflow-hidden" style={{ touchAction: "pan-y" }}>
      {/* Top Bar — minimal */}
      <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50 shrink-0">
        <Link href="/">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          <span className="font-heading text-gold text-sm">EXPLORER</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-gold" />
          <span className="text-sm font-bold text-gold">{totalXP.toLocaleString()}</span>
        </div>
      </header>

      {/* Relay Dots Navigator */}
      <div className="flex items-center justify-center gap-2 py-3 bg-card/50 shrink-0">
        {RELAYS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentRelay(i)}
            className="relative"
          >
            <div
              className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                i === currentRelay ? "scale-125" : "opacity-50"
              }`}
              style={{ backgroundColor: i === currentRelay ? RELAY_COLORS[i] : `${RELAY_COLORS[i]}40` }}
            >
              <span className="text-[8px] font-bold text-white">{i + 1}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Swipeable Relay Content */}
      <motion.div
        className="flex-1 overflow-y-auto"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRelay}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-6 space-y-6"
          >
            {/* Relay Hero */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${color}20`, border: `2px solid ${color}60` }}>
                <Icon className="w-10 h-10" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Relay {currentRelay + 1} of 12</p>
                <h2 className="font-heading text-2xl" style={{ color }}>{relay.name}</h2>
                <p className="text-xs text-muted-foreground">{relay.era}</p>
              </div>
            </div>

            {/* Story Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-3">
              <h3 className="font-heading text-gold text-sm">The Story</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {relay.subtitle} — spanning {relay.era}. Part of the {relay.webType} Web.
              </p>
            </div>

            {/* Discovery Grid — Large Tap Targets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-gold text-sm">Discoveries</h3>
                <span className="text-xs text-muted-foreground">{relayDiscovered}/{relayInventions.length} found</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {relayInventions.map((inv) => {
                  const invKey = `${inv.name.toLowerCase().replace(/\s+/g, '-')}`;
                  const key = `${relayKey}-${invKey}`;
                  const isDiscovered = discoveredItems.has(key);
                  return (
                    <motion.button
                      key={invKey}
                      onClick={() => handleDiscover(invKey)}
                      className={`relative rounded-2xl p-5 text-left transition-all min-h-[100px] ${
                        isDiscovered
                          ? "bg-card border-2"
                          : "bg-card/50 border-2 border-dashed border-border/30"
                      }`}
                      style={isDiscovered ? { borderColor: `${color}60` } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isDiscovered ? (
                        <>
                          <Sparkles className="w-5 h-5 mb-2" style={{ color }} />
                          <p className="text-sm font-heading text-foreground">{inv.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{inv.date}</p>
                          <p className="text-[10px] text-foreground/60 mt-1 line-clamp-2">{inv.description}</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-10 h-10 rounded-full bg-border/20 flex items-center justify-center">
                            <span className="text-lg">?</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">Tap to discover</p>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Relay Progress</span>
                <span className="font-bold" style={{ color }}>
                  {relayInventions.length > 0 ? Math.round((relayDiscovered / relayInventions.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-3 bg-background rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${relayInventions.length > 0 ? (relayDiscovered / relayInventions.length) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Swipe Hint */}
            <div className="flex items-center justify-center gap-4 py-4">
              <button onClick={() => goToRelay(-1)} className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>
              <span className="text-[10px] text-muted-foreground/50">Swipe to navigate</span>
              <button onClick={() => goToRelay(1)} className="flex items-center gap-1 text-xs text-muted-foreground">
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bottom Tab Bar */}
      <nav className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-card/90 backdrop-blur-sm border-t border-border/50 shrink-0">
        <Link href="/">
          <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground">
            <Globe className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
        </Link>
        <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-gold">
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>
        <Link href="/leaderboard">
          <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground">
            <Trophy className="w-5 h-5" />
            <span className="text-[10px]">Rank</span>
          </button>
        </Link>
      </nav>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-card/95 backdrop-blur-sm border-2 border-gold/50 rounded-3xl p-8 text-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-3" />
              <p className="font-heading text-gold text-xl">Discovery!</p>
              <p className="text-sm text-muted-foreground mt-1">+100 XP</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
