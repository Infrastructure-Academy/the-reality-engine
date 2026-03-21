import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS } from "@shared/gameData";
import { INVENTIONS, type Invention } from "@shared/inventions";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Zap, Star, BookOpen,
  ArrowLeft, Sparkles, MessageCircle, Shuffle
} from "lucide-react";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useGamepad, type GamepadButtonName } from "@/hooks/useGamepad";

// ─── Guest ID ───
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

// ─── Layout Variant System (Jonathan Green's suggestion) ───
// 3 distinct layouts: same content blocks, different arrangements
// Randomized on each visit so "no two journeys are the same"
type LayoutVariant = 1 | 2 | 3;

function pickLayout(relayNum: number): LayoutVariant {
  // Combine relay number with session-random seed for variety
  const sessionSeed = Math.random();
  const pick = Math.floor(sessionSeed * 3) + 1;
  return pick as LayoutVariant;
}

// ─── Shared Sub-Components ───

function RelayHeader({
  relayMeta, relayNum, canGoPrev, canGoNext, navigate
}: {
  relayMeta: typeof RELAYS[number]; relayNum: number;
  canGoPrev: boolean; canGoNext: boolean; navigate: (to: string) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button variant="ghost" size="sm" disabled={!canGoPrev} onClick={() => navigate(`/explore/${relayNum - 1}`)}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="text-center">
        <div className="text-4xl mb-1">{relayMeta.emoji}</div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wide text-gold-gradient">
          Relay {relayNum}: {relayMeta.name}
        </h2>
        <p className="text-sm text-muted-foreground">{relayMeta.subtitle}</p>
        <p className="text-xs text-muted-foreground/60 font-mono mt-1">{relayMeta.era}</p>
      </div>
      <Button variant="ghost" size="sm" disabled={!canGoNext} onClick={() => navigate(`/explore/${relayNum + 1}`)}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

function NarrativeBlock({ relay }: { relay: any }) {
  if (!relay?.narrative) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-gold" />
        <span className="text-xs uppercase tracking-wider text-gold font-bold">The Story</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 italic">{relay.narrative}</p>
      {relay.quote && (
        <blockquote className="mt-3 pl-3 border-l-2 border-gold/40">
          <p className="text-xs text-muted-foreground italic">"{relay.quote}"</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">— {relay.quoteAuthor}</p>
        </blockquote>
      )}
    </motion.div>
  );
}

function MissionBlock({ relay }: { relay: any }) {
  if (!relay?.missionObjective) return null;
  return (
    <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
      <p className="text-xs uppercase tracking-wider text-amber-400 mb-1 font-bold">Mission Objective</p>
      <p className="text-sm text-foreground/80">{relay.missionObjective}</p>
    </div>
  );
}

function DiscoveryGrid({
  inventions, inventionData, discoveredItems, handleDiscover, xpPerItem, columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
}: {
  inventions: string[]; inventionData?: Invention[]; discoveredItems: Set<number>; handleDiscover: (idx: number) => void;
  xpPerItem: number; columns?: string;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        Tap to Discover — {inventions.length} Inventions
      </p>
      <div className={`grid ${columns} gap-3`}>
        {inventions.map((inv, idx) => {
          const isDiscovered = discoveredItems.has(idx);
          const meta = inventionData?.[idx];
          const isExpanded = expandedIdx === idx && isDiscovered;
          const sigColors: Record<string, string> = {
            "foundational": "text-emerald-400",
            "transformative": "text-sky-400",
            "revolutionary": "text-amber-400",
            "paradigm-shift": "text-purple-400",
          };
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isDiscovered) {
                  handleDiscover(idx);
                  setExpandedIdx(idx);
                } else {
                  setExpandedIdx(isExpanded ? null : idx);
                }
              }}
              className={`relative p-3 rounded-lg border text-left transition-all duration-300 ${
                isDiscovered
                  ? "border-gold/40 bg-gold/10"
                  : "border-border/50 bg-card/30 hover:border-border"
              } ${isExpanded ? "col-span-2 sm:col-span-2 md:col-span-2 row-span-2" : ""}`}
              layout
            >
              <AnimatePresence>
                {isDiscovered && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  </motion.div>
                )}
              </AnimatePresence>
              <p className={`text-sm font-medium ${isDiscovered ? "text-gold-gradient" : "text-foreground/70"}`}>
                {isDiscovered ? inv : "???"}
              </p>
              {isDiscovered && !isExpanded && (
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">+{xpPerItem.toLocaleString()} XP</p>
              )}
              <AnimatePresence>
                {isExpanded && meta && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1.5 overflow-hidden"
                  >
                    <p className="text-xs text-foreground/80 leading-relaxed">{meta.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted-foreground">{meta.date}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${sigColors[meta.significance] || "text-muted-foreground"}`}>
                        {meta.significance.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">+{xpPerItem.toLocaleString()} XP</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ discovered, total, completionPct }: { discovered: number; total: number; completionPct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Relay Progress</span>
        <span>{discovered}/{total}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, oklch(0.82 0.12 85), oklch(0.65 0.2 30))" }}
          initial={{ width: 0 }}
          animate={{ width: `${completionPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

function RelayNavigator({ currentRelay }: { currentRelay: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {RELAYS.map((r) => (
        <Link key={r.number} href={`/explore/${r.number}`}>
          <button
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all ${
              r.number === currentRelay
                ? "border-2 border-gold/60 bg-gold/10 scale-110"
                : "border border-border/30 hover:border-border/60"
            }`}
            title={r.name}
          >
            {r.emoji}
          </button>
        </Link>
      ))}
    </div>
  );
}

function WebTypeTag({ webType, color }: { webType: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono"
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
    >
      {webType} Web
    </span>
  );
}

function EraTimeline({ relayNum }: { relayNum: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {RELAYS.map((r) => (
        <div key={r.number} className={`shrink-0 h-1.5 rounded-full transition-all ${
          r.number <= relayNum ? "bg-gold/60 w-6" : "bg-muted w-4"
        } ${r.number === relayNum ? "bg-gold w-8" : ""}`}
          title={`${r.name} (${r.era})`}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT VARIANT 1 — "Classic Scroll"
// Top-down: Header → Narrative → Mission → Discovery Grid → Progress → Navigator
// The original linear layout — clean, predictable, story-first
// ═══════════════════════════════════════════════════════════
function LayoutClassic({
  relay, relayMeta, relayNum, inventions, inventionData, discoveredItems, handleDiscover,
  xpPerItem, completionPct, canGoPrev, canGoNext, navigate
}: LayoutProps) {
  return (
    <div className="space-y-6">
      <RelayHeader relayMeta={relayMeta} relayNum={relayNum} canGoPrev={canGoPrev} canGoNext={canGoNext} navigate={navigate} />
      <NarrativeBlock relay={relay} />
      <MissionBlock relay={relay} />
      <DiscoveryGrid inventions={inventions} inventionData={inventionData} discoveredItems={discoveredItems} handleDiscover={handleDiscover} xpPerItem={xpPerItem} />
      <ProgressBar discovered={discoveredItems.size} total={inventions.length} completionPct={completionPct} />
      <RelayNavigator currentRelay={relayNum} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT VARIANT 2 — "Split Horizon"
// Two-column: Left = big discovery grid, Right = stacked narrative + mission + progress
// Discovery-first — emphasizes the tap-to-explore mechanic
// ═══════════════════════════════════════════════════════════
function LayoutSplitHorizon({
  relay, relayMeta, relayNum, inventions, inventionData, discoveredItems, handleDiscover,
  xpPerItem, completionPct, canGoPrev, canGoNext, navigate
}: LayoutProps) {
  return (
    <div className="space-y-6">
      <RelayHeader relayMeta={relayMeta} relayNum={relayNum} canGoPrev={canGoPrev} canGoNext={canGoNext} navigate={navigate} />

      {/* Web type + era context bar */}
      <div className="flex items-center justify-between">
        <WebTypeTag webType={relayMeta.webType} color={relayMeta.color} />
        <EraTimeline relayNum={relayNum} />
      </div>

      {/* Two-column split */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left: Discovery Grid (hero position) */}
        <div className="space-y-4">
          <DiscoveryGrid inventions={inventions} inventionData={inventionData} discoveredItems={discoveredItems} handleDiscover={handleDiscover}
            xpPerItem={xpPerItem} columns="grid-cols-2 sm:grid-cols-3" />
        </div>

        {/* Right: Narrative + Mission + Progress stacked */}
        <div className="space-y-4">
          <NarrativeBlock relay={relay} />
          <MissionBlock relay={relay} />
          <ProgressBar discovered={discoveredItems.size} total={inventions.length} completionPct={completionPct} />
        </div>
      </div>

      <RelayNavigator currentRelay={relayNum} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT VARIANT 3 — "Mission Briefing"
// Immersive: Full-width mission banner → side-by-side narrative + progress → discovery below
// Feels like a military briefing — mission-first, then context, then action
// ═══════════════════════════════════════════════════════════
function LayoutMissionBriefing({
  relay, relayMeta, relayNum, inventions, inventionData, discoveredItems, handleDiscover,
  xpPerItem, completionPct, canGoPrev, canGoNext, navigate
}: LayoutProps) {
  return (
    <div className="space-y-6">
      {/* Compact header with era timeline */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" disabled={!canGoPrev} onClick={() => navigate(`/explore/${relayNum - 1}`)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{relayMeta.emoji}</span>
            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold tracking-wide text-gold-gradient">
                {relayMeta.name}
              </h2>
              <p className="text-[10px] text-muted-foreground font-mono">{relayMeta.era}</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" disabled={!canGoNext} onClick={() => navigate(`/explore/${relayNum + 1}`)}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Full-width mission banner (hero position) */}
      {relay?.missionObjective && (
        <div className="p-5 rounded-xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Mission Briefing</p>
              <p className="text-[10px] text-muted-foreground">Relay {relayNum} of 12 — {relayMeta.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{relay.missionObjective}</p>
        </div>
      )}

      {/* Side-by-side: Narrative + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
        <NarrativeBlock relay={relay} />
        <div className="space-y-4">
          <ProgressBar discovered={discoveredItems.size} total={inventions.length} completionPct={completionPct} />
          <WebTypeTag webType={relayMeta.webType} color={relayMeta.color} />
          <div className="text-center p-3 rounded-lg border border-border/50 bg-card/30">
            <p className="text-2xl font-bold font-mono text-gold-gradient">{discoveredItems.size}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Found</p>
          </div>
        </div>
      </div>

      {/* Discovery grid (wider) */}
      <DiscoveryGrid inventions={inventions} inventionData={inventionData} discoveredItems={discoveredItems} handleDiscover={handleDiscover}
        xpPerItem={xpPerItem} columns="grid-cols-3 sm:grid-cols-4 md:grid-cols-5" />

      {/* Relay navigator */}
      <EraTimeline relayNum={relayNum} />
      <RelayNavigator currentRelay={relayNum} />
    </div>
  );
}

// ─── Layout Props Type ───
interface LayoutProps {
  relay: any;
  relayMeta: typeof RELAYS[number];
  relayNum: number;
  inventions: string[];
  inventionData: Invention[];
  discoveredItems: Set<number>;
  handleDiscover: (idx: number) => void;
  xpPerItem: number;
  completionPct: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  navigate: (to: string) => void;
}

const LAYOUT_NAMES: Record<LayoutVariant, string> = {
  1: "Classic Scroll",
  2: "Split Horizon",
  3: "Mission Briefing",
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ExplorerRelay() {
  const params = useParams<{ relayNum: string }>();
  const [, navigate] = useLocation();
  const relayNum = parseInt(params.relayNum || "1", 10);
  const relayMeta = RELAYS.find(r => r.number === relayNum) || RELAYS[0];

  const [guestId] = useState(getGuestId);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [discoveredItems, setDiscoveredItems] = useState<Set<number>>(new Set());

  // Randomize layout per relay visit — changes each time you navigate
  const [layoutVariant] = useState<LayoutVariant>(() => pickLayout(relayNum));

  // Fetch relay data from DB
  const { data: relay, isLoading } = trpc.relays.getByNumber.useQuery({ number: relayNum });

  // Create guest profile
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    profileMutation.mutate({ guestId, mode: "explorer" }, {
      onSuccess: (data) => { if (data) setProfileId(data.id); }
    });
  }, [guestId]);

  // DAVID chat mutation
  const chatMutation = trpc.david.chat.useMutation();

  const handleChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: msg }]);
    chatMutation.mutate({
      profileId, guestId, mode: "explorer", message: msg, relayContext: relayNum,
    }, {
      onSuccess: (data) => {
        setChatMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    });
  }, [chatInput, profileId, guestId, relayNum]);

  // Discovery tap handler
  const handleDiscover = useCallback((idx: number) => {
    setDiscoveredItems(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  // Inventions per relay — from shared data with historical descriptions
  const inventionData = useMemo(() => INVENTIONS[relayNum] || [], [relayNum]);
  const inventions = useMemo(() => inventionData.map(i => i.name), [inventionData]);

  const xpPerItem = relay?.xpReward ? Math.floor(relay.xpReward / Math.max(inventions.length, 1)) : 10000;
  const totalXpEarned = discoveredItems.size * xpPerItem;
  const completionPct = inventions.length > 0 ? Math.round((discoveredItems.size / inventions.length) * 100) : 0;
  const canGoPrev = relayNum > 1;
  const canGoNext = relayNum < 12;

  // ─── Hooks MUST be called before any early return (React rules of hooks) ───

  // Swipe navigation between relays
  const swipeRef = useSwipeNavigation<HTMLDivElement>({
    onSwipeLeft: canGoNext ? () => navigate(`/explore/${relayNum + 1}`) : undefined,
    onSwipeRight: canGoPrev ? () => navigate(`/explore/${relayNum - 1}`) : undefined,
  });

  // Gamepad navigation
  const handleGamepadButton = useCallback(
    (button: GamepadButtonName) => {
      if (button === "RB" && canGoNext) navigate(`/explore/${relayNum + 1}`);
      else if (button === "LB" && canGoPrev) navigate(`/explore/${relayNum - 1}`);
      else if (button === "X") setShowChat((prev) => !prev);
      else if (button === "B") navigate("/");
    },
    [canGoNext, canGoPrev, relayNum, navigate]
  );
  useGamepad(handleGamepadButton);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading relay data...</p>
        </div>
      </div>
    );
  }

  const layoutProps: LayoutProps = {
    relay, relayMeta, relayNum, inventions, inventionData, discoveredItems, handleDiscover,
    xpPerItem, completionPct, canGoPrev, canGoNext, navigate,
  };

  return (
    <div ref={swipeRef} className="min-h-screen bg-background text-foreground bg-starfield relative mobile-content-pad">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white">BETA</span>
            <div className="flex items-center gap-2 font-mono text-sm">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-gold-gradient font-bold">{totalXpEarned.toLocaleString()} XP</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{completionPct}%</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-muted-foreground/50 font-mono hidden sm:inline" title="Layout variant">
              <Shuffle className="w-3 h-3 inline mr-0.5" />{LAYOUT_NAMES[layoutVariant]}
            </span>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => setShowChat(!showChat)}>
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">DAVID</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-4xl mx-auto">
        {/* Render the randomly selected layout */}
        {layoutVariant === 1 && <LayoutClassic {...layoutProps} />}
        {layoutVariant === 2 && <LayoutSplitHorizon {...layoutProps} />}
        {layoutVariant === 3 && <LayoutMissionBriefing {...layoutProps} />}
      </div>

      {/* DAVID Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-12 bottom-0 w-80 sm:w-96 border-l border-border/50 bg-background/95 backdrop-blur-md z-30 flex flex-col"
          >
            <div className="p-3 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">D</span>
                </div>
                <div>
                  <p className="text-sm font-bold">DAVID</p>
                  <p className="text-[10px] text-muted-foreground">Explorer Narrator</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Ask DAVID about Relay {relayNum}: {relayMeta.name}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">I'm your narrator — ask me anything!</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted px-3 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChat()}
                  placeholder={`Ask about ${relayMeta.name}...`}
                  className="flex-1 bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Button size="sm" onClick={handleChat} disabled={chatMutation.isPending}>
                  Send
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
