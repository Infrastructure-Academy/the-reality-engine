import { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { CRAFTS, RELAYS, WEBS, FITS_TYPES } from "@shared/gameData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Zap, Shield, Radio, Compass, Eye, Gauge,
  ChevronRight, MessageCircle, Lock, Rocket
} from "lucide-react";
import { useGamepad, type GamepadButtonName } from "@/hooks/useGamepad";
import { playNodeActivationSound, playXpSound, hapticTap } from "@/hooks/useSoundEffects";
import { trpc } from "@/lib/trpc";
import { XpCounter } from "@/components/XpCounter";
import { SoundToggle } from "@/components/SoundToggle";

type Phase = "craft_select" | "hud";

export default function FlightDeck() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>("craft_select");
  const [selectedCraft, setSelectedCraft] = useState<typeof CRAFTS[number] | null>(null);
  const [activeNode, setActiveNode] = useState<{ relay: number; web: string } | null>(null);
  const [activatedNodes, setActivatedNodes] = useState<Set<string>>(new Set());
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [cursorRelay, setCursorRelay] = useState(1);
  const [cursorWeb, setCursorWeb] = useState(0);

  // ─── Profile & DB persistence ───
  const profileMutation = trpc.profile.getOrCreate.useMutation();
  const [profileId, setProfileId] = useState<number | null>(null);
  const activateNodeMutation = trpc.dearden.activate.useMutation();

  useEffect(() => {
    if (user?.id) {
      profileMutation.mutate({ mode: "flight_deck" }, {
        onSuccess: (data) => { if (data) setProfileId(data.id); }
      });
    }
  }, [user?.id]);

  // Load saved node activations from DB
  const { data: savedActivations } = trpc.dearden.activations.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  // Fetch all dearden nodes to map relay+web to nodeId
  const { data: deardenNodesData } = trpc.dearden.nodes.useQuery();

  // Restore activated nodes from DB
  useEffect(() => {
    if (savedActivations && savedActivations.length > 0 && deardenNodesData) {
      const restoredKeys = new Set<string>();
      savedActivations.forEach((act: any) => {
        const node = deardenNodesData.find((n: any) => n.id === act.nodeId);
        if (node) {
          restoredKeys.add(`${node.relayNumber}-${node.webName}`);
        }
      });
      if (restoredKeys.size > 0) {
        setActivatedNodes(prev => {
          const merged = new Set(prev);
          restoredKeys.forEach(k => merged.add(k));
          return merged;
        });
      }
    }
  }, [savedActivations, deardenNodesData]);

  // Gamepad support for Flight Deck
  const handleGamepadButton = useCallback(
    (button: GamepadButtonName) => {
      if (phase === "craft_select") {
        // In craft select: D-pad to pick, A to confirm
        if (button === "B") navigate("/");
        return;
      }
      // HUD mode: navigate the 60-node matrix
      if (button === "DPAD_UP" || button === "LB") {
        setCursorRelay((prev) => Math.max(1, prev - 1));
      } else if (button === "DPAD_DOWN" || button === "RB") {
        setCursorRelay((prev) => Math.min(12, prev + 1));
      } else if (button === "DPAD_LEFT") {
        setCursorWeb((prev) => Math.max(0, prev - 1));
      } else if (button === "DPAD_RIGHT") {
        setCursorWeb((prev) => Math.min(4, prev + 1));
      } else if (button === "A") {
        handleNodeClick(cursorRelay, WEBS[cursorWeb].name);
      } else if (button === "X") {
        setShowChat((prev) => !prev);
      } else if (button === "B") {
        setPhase("craft_select");
      }
    },
    [phase, cursorRelay, cursorWeb, navigate]
  );
  useGamepad(handleGamepadButton);

  const handleSelectCraft = useCallback((craft: typeof CRAFTS[number]) => {
    setSelectedCraft(craft);
    setPhase("hud");
  }, []);

  const nodeKey = (relay: number, web: string) => `${relay}-${web}`;

  const handleNodeClick = useCallback((relay: number, web: string) => {
    const key = nodeKey(relay, web);
    setActiveNode({ relay, web });
    setActivatedNodes(prev => {
      const isNew = !prev.has(key);
      const next = new Set(prev);
      next.add(key);
      if (isNew) {
        playNodeActivationSound();
        hapticTap(25);

        // Persist to DB
        if (profileId && deardenNodesData) {
          const nodeRecord = deardenNodesData.find(
            (n: any) => n.relayNumber === relay && n.webName === web
          );
          if (nodeRecord) {
            activateNodeMutation.mutate({
              profileId, nodeId: nodeRecord.id,
              relayNumber: relay, webName: web,
            });
            setTimeout(() => playXpSound(), 200);
          }
        }
      }
      return next;
    });
  }, [profileId, deardenNodesData]);

  const totalActivated = activatedNodes.size;
  const totalNodes = 60;
  const activationPct = Math.round((totalActivated / totalNodes) * 100);

  // Stat icons
  const statIcons: Record<string, React.ElementType> = {
    speed: Gauge, armour: Shield, sensors: Radio, range: Compass, stealth: Eye,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground mobile-content-pad bg-starfield flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Rocket className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-gold-gradient mb-3">Flight Deck Access Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            The Flight Deck requires authentication. Sign in to select your craft and navigate the Dearden Field.
          </p>
          <div className="flex flex-col gap-3">
            <a href={getLoginUrl()}>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-heading tracking-wider">
                <Lock className="w-4 h-4 mr-2" /> Sign In to Launch
              </Button>
            </a>
            <Link href="/">
              <Button variant="ghost" className="w-full text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Mode Select
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── CRAFT SELECTION PHASE ───
  if (phase === "craft_select") {
    return (
      <div className="min-h-screen bg-background text-foreground mobile-content-pad bg-starfield">
        <header className="border-b border-border/50 backdrop-blur-md bg-background/80">
          <div className="container flex items-center justify-between h-12">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Modes
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white">BETA</span>
              <h1 className="font-heading text-sm font-bold tracking-wider text-gold-gradient">MPNC FLEET — CRAFT SELECTION</h1>
            </div>
            <div />
          </div>
        </header>

        <div className="container py-8 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-cyan-400 mb-2">FITS Temperament Alignment</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wide">Select Your Craft</h2>
            <p className="text-sm text-muted-foreground mt-2">Each vessel aligns with a FITS temperament and a Great Web</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRAFTS.map((craft) => {
              const fits = FITS_TYPES.find(f => f.id === craft.fits);
              return (
                <motion.div
                  key={craft.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCraft(craft)}
                  className="cursor-pointer rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 bg-gradient-to-b from-cyan-600/10 to-transparent p-5 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold">{craft.name}</h3>
                      <p className="text-[10px] text-cyan-400 font-mono">{craft.className} — {craft.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{craft.description}</p>

                  {/* FITS Badge */}
                  <div className="flex items-center gap-2 mb-3 px-2 py-1 rounded bg-muted/50 w-fit">
                    <span className="text-[10px] font-bold text-cyan-400">{fits?.abbr}</span>
                    <span className="text-[10px] text-muted-foreground">{fits?.name} — {craft.web} Web</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-5 gap-1">
                    {Object.entries(craft.stats).map(([stat, val]) => {
                      const Icon = statIcons[stat] || Zap;
                      return (
                        <div key={stat} className="text-center">
                          <Icon className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${val * 10}%` }} />
                          </div>
                          <p className="text-[8px] text-muted-foreground mt-0.5 uppercase">{stat}</p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-cyan-400/60 mt-2 font-mono">{craft.xpBonus}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── HUD PHASE — DEARDEN FIELD ───
  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad relative overflow-hidden">
      {/* HUD Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none hud-scanline z-50" />

      {/* HUD Header */}
      <header className="sticky top-0 z-20 border-b border-cyan-500/20 backdrop-blur-md bg-background/90">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setPhase("craft_select")} className="text-muted-foreground gap-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="font-heading text-sm font-bold text-cyan-400">{selectedCraft?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white">BETA</span>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">ONLINE</span>
            </div>
            <span className="text-cyan-400 text-[10px] sm:text-xs">{totalActivated}/{totalNodes}</span>
            <XpCounter value={totalActivated * 50000} compact color="cyan" />
            <span className="text-muted-foreground text-[10px] sm:text-xs">{activationPct}%</span>
          </div>

          <div className="flex items-center gap-1">
            <SoundToggle compact color="cyan" />
            <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)} className="text-muted-foreground gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">DAVID</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-4">
        {/* Dearden Field Title */}
        <div className="text-center mb-4">
          <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/60 font-mono">DEARDEN FIELD — 60-NODE MATRIX</p>
          <p className="text-xs text-muted-foreground">12 Relays x 5 Great Webs</p>
        </div>

        {/* Progress Prompt */}
        {totalActivated < totalNodes && (
          <div className="mb-4 p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-1.5 flex-1 max-w-[200px] bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${activationPct}%` }} />
              </div>
              <span className="text-xs font-mono text-cyan-400">{totalActivated}/{totalNodes}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Tap each node to activate. Complete all 60 to unlock the Synthesis page.
            </p>
          </div>
        )}
        {totalActivated >= totalNodes && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded-lg border border-amber-500/40 bg-amber-500/10 text-center"
          >
            <p className="text-sm font-heading font-bold text-gold-gradient mb-1">ALL NODES ACTIVATED</p>
            <p className="text-xs text-muted-foreground mb-2">The Dearden Field is fully mapped. View your civilizational pattern.</p>
            <Link href="/synthesis">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-heading tracking-wider">
                View Synthesis <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Dearden Field Grid — Mobile-Responsive */}
        <div className="overflow-x-auto pb-4 relative">
          {/* Scroll hint for mobile */}
          <div className="sm:hidden absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-cyan-400/60 animate-pulse" />
          </div>
          <div className="min-w-[520px]">
            {/* Web Headers */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] sm:grid-cols-[100px_repeat(5,1fr)] gap-0.5 sm:gap-1 mb-1">
              <div />
              {WEBS.map(web => (
                <div key={web.name} className="text-center px-0.5 sm:px-1 py-1 sm:py-1.5 rounded-t-lg" style={{ backgroundColor: `${web.color}15` }}>
                  <span className="text-xs sm:text-sm">{web.icon}</span>
                  <p className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider" style={{ color: web.color }}>{web.name}</p>
                </div>
              ))}
            </div>

            {/* Relay Rows */}
            {RELAYS.map(relay => (
              <div key={relay.number} className="grid grid-cols-[60px_repeat(5,1fr)] sm:grid-cols-[100px_repeat(5,1fr)] gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                {/* Relay Label */}
                <div className="flex items-center gap-1 sm:gap-1.5 pr-1 sm:pr-2">
                  <span className="text-xs sm:text-sm">{relay.emoji}</span>
                  <div>
                    <p className="text-[8px] sm:text-[10px] font-bold leading-tight truncate">{relay.name}</p>
                    <p className="text-[7px] sm:text-[8px] text-muted-foreground font-mono">R{relay.number}</p>
                  </div>
                </div>

                {/* Node Cells */}
                {WEBS.map(web => {
                  const key = nodeKey(relay.number, web.name);
                  const isActivated = activatedNodes.has(key);
                  const isActive = activeNode?.relay === relay.number && activeNode?.web === web.name;
                  const isMatchingWeb = selectedCraft?.web === web.name;

                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNodeClick(relay.number, web.name)}
                      className={`
                        relative h-8 sm:h-10 rounded border transition-all duration-200
                        ${isActive
                          ? "border-white/60 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                          : isActivated
                            ? "border-cyan-500/40 bg-cyan-500/10"
                            : isMatchingWeb
                              ? "border-cyan-500/20 bg-cyan-500/5 hover:border-cyan-400/40"
                              : "border-border/30 hover:border-border/60"
                        }
                      `}
                    >
                      {isActivated && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full" style={{ backgroundColor: web.color, opacity: 0.8 }} />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Active Node Detail */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{RELAYS.find(r => r.number === activeNode.relay)?.emoji}</span>
                <div>
                  <h3 className="font-heading text-lg font-bold">
                    Node {activeNode.relay}-{activeNode.web.charAt(0)}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    {RELAYS.find(r => r.number === activeNode.relay)?.name} x {activeNode.web} Web
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-muted-foreground">XP Value</p>
                  <p className="text-sm font-bold text-gold-gradient font-mono">50,000</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Intersection of the {RELAYS.find(r => r.number === activeNode.relay)?.name} relay with the {activeNode.web} web.
                {selectedCraft?.web === activeNode.web && (
                  <span className="text-cyan-400"> Your craft has affinity here — bonus XP applies.</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Craft Stats HUD */}
        {selectedCraft && (
          <div className="mt-4 p-3 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="font-heading text-sm font-bold">{selectedCraft.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono ml-auto">{selectedCraft.xpBonus}</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(selectedCraft.stats).map(([stat, val]) => {
                const Icon = statIcons[stat] || Zap;
                return (
                  <div key={stat} className="text-center">
                    <Icon className="w-3.5 h-3.5 mx-auto text-cyan-400/60 mb-1" />
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all" style={{ width: `${val * 10}%` }} />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-0.5 uppercase font-mono">{stat} {val}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DAVID Co-Pilot Chat */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-12 bottom-0 w-80 sm:w-96 border-l border-cyan-500/20 bg-background/95 backdrop-blur-md z-30 flex flex-col"
          >
            <div className="p-3 border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">D</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-cyan-400">DAVID</p>
                  <p className="text-[10px] text-muted-foreground">Flight Deck Co-Pilot</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">DAVID co-pilot standing by.</p>
                  <p className="text-xs text-cyan-400/60 mt-1">Request mission briefings, node analysis, or navigation guidance.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user" ? "bg-cyan-600 text-white" : "bg-muted text-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-cyan-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && chatInput.trim()) {
                      setChatMessages(prev => [...prev, { role: "user", content: chatInput.trim() }]);
                      setChatInput("");
                    }
                  }}
                  placeholder="Request briefing..."
                  className="flex-1 bg-input border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">Send</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
