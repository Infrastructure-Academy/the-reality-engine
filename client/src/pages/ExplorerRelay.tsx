import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { RELAYS } from "@shared/gameData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Zap, Star, BookOpen,
  ArrowLeft, Sparkles, MessageCircle
} from "lucide-react";

// Simple guest ID generator stored in localStorage
function getGuestId(): string {
  let id = localStorage.getItem("tre_guest_id");
  if (!id) {
    id = "g_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("tre_guest_id", id);
  }
  return id;
}

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

  // Sample inventions for each relay (client-side for instant 2-tap experience)
  const inventions = useMemo(() => {
    const inventionSets: Record<number, string[]> = {
      1: ["Hearth", "Torch", "Kiln", "Charcoal", "Smelting", "Forge", "Signal Fire", "Cremation", "Slash-and-Burn"],
      2: ["Longhouse", "Palisade", "Dugout Canoe", "Wooden Plough", "Timber Frame", "Charcoal Kiln", "Mast", "Barrel"],
      3: ["Irrigation Canal", "Aqueduct", "Dam", "Shaduf", "Qanat", "Nilometer", "Reservoir", "Water Mill"],
      4: ["Chariot", "Saddle", "Stirrup", "Horseshoe", "Postal Relay", "Cavalry", "Horse Collar"],
      5: ["Paved Road", "Milestone", "Bridge", "Drainage", "Tunnel", "Causeway", "Way Station", "Toll Gate"],
      6: ["Keel", "Lateen Sail", "Compass", "Caravel", "Astrolabe", "Dry Dock", "Lighthouse", "Sextant", "Anchor"],
      7: ["Spinning Jenny", "Power Loom", "Jacquard Mechanism", "Flying Shuttle", "Cotton Gin", "Spinning Mule", "Punch Card"],
      8: ["Steam Locomotive", "Standard Gauge", "Signal System", "Steel Rail", "Railway Bridge", "Turntable", "Sleeper Car", "Telegraph"],
      9: ["Assembly Line", "Highway", "Fuel Station", "Traffic Light", "Diesel Engine", "Tractor", "Automobile"],
      10: ["Biplane", "Jet Engine", "Radio Broadcast", "Television", "Radar", "Motorway", "Airport", "Satellite Dish", "Transistor"],
      11: ["GPS", "Internet Protocol", "Cloud Computing", "Fibre Optic", "Solar Panel", "Space Station", "Microprocessor", "Smartphone"],
      12: ["Neural Interface", "Quantum Computer", "Collective Intelligence", "Bio-Digital Mesh", "Torus Network", "Consciousness Map", "AI Symbiosis", "Ethical Framework", "Planetary Node", "Digital Twin", "Empathy Engine", "Human Node"],
    };
    return inventionSets[relayNum] || [];
  }, [relayNum]);

  const xpPerItem = relay?.xpReward ? Math.floor(relay.xpReward / Math.max(inventions.length, 1)) : 10000;
  const totalXpEarned = discoveredItems.size * xpPerItem;
  const completionPct = inventions.length > 0 ? Math.round((discoveredItems.size / inventions.length) * 100) : 0;

  const canGoPrev = relayNum > 1;
  const canGoNext = relayNum < 12;

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

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm">
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-gold-gradient font-bold">{totalXpEarned.toLocaleString()} XP</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{completionPct}%</span>
          </div>
          <Button
            variant="ghost" size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">DAVID</span>
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-4xl mx-auto">
        {/* Relay Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost" size="sm" disabled={!canGoPrev}
            onClick={() => navigate(`/explore/${relayNum - 1}`)}
          >
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

          <Button
            variant="ghost" size="sm" disabled={!canGoNext}
            onClick={() => navigate(`/explore/${relayNum + 1}`)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Narrative */}
        {relay?.narrative && (
          <motion.div
            key={relayNum}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-foreground/90 italic">{relay.narrative}</p>
            {relay.quote && (
              <blockquote className="mt-3 pl-3 border-l-2 border-gold/40">
                <p className="text-xs text-muted-foreground italic">"{relay.quote}"</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">— {relay.quoteAuthor}</p>
              </blockquote>
            )}
          </motion.div>
        )}

        {/* Mission Objective */}
        {relay?.missionObjective && (
          <div className="mb-6 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs uppercase tracking-wider text-amber-400 mb-1 font-bold">Mission Objective</p>
            <p className="text-sm text-foreground/80">{relay.missionObjective}</p>
          </div>
        )}

        {/* Discovery Grid — TAP TO DISCOVER */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Tap to Discover — {inventions.length} Inventions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {inventions.map((inv, idx) => {
              const isDiscovered = discoveredItems.has(idx);
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDiscover(idx)}
                  className={`
                    relative p-3 rounded-lg border text-left transition-all duration-300
                    ${isDiscovered
                      ? "border-gold/40 bg-gold/10"
                      : "border-border/50 bg-card/30 hover:border-border"
                    }
                  `}
                >
                  <AnimatePresence>
                    {isDiscovered && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5"
                      >
                        <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className={`text-sm font-medium ${isDiscovered ? "text-gold-gradient" : "text-foreground/70"}`}>
                    {isDiscovered ? inv : "???"}
                  </p>
                  {isDiscovered && (
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">+{xpPerItem.toLocaleString()} XP</p>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Relay Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Relay Progress</span>
            <span>{discoveredItems.size}/{inventions.length}</span>
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

        {/* Relay Navigator */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {RELAYS.map((r) => (
            <Link key={r.number} href={`/explore/${r.number}`}>
              <button
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all
                  ${r.number === relayNum
                    ? "border-2 border-gold/60 bg-gold/10 scale-110"
                    : "border border-border/30 hover:border-border/60"
                  }
                `}
                title={r.name}
              >
                {r.emoji}
              </button>
            </Link>
          ))}
        </div>
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
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
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
