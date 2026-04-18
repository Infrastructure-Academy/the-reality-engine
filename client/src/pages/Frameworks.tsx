import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Compass, Scale, Ship, Shield, FileText, Wrench, ChevronRight, Image } from "lucide-react";
import { BrandI } from "@/components/BrandI";

// CDN URLs for iCard images
const FRAMEWORK_CDN = {
  walkby: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-walkby_bf9f425c.png",
  fourLaws: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-4laws_12b54e4f.png",
  tetrahedral: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/icard-tetrahedral-observer_ef84bfcb.png",
};

// ─── Consciousness Compass ───
const COMPASS_POINTS = [
  { dir: "C", label: "Civil", position: "top", color: "#d4af37", description: "The governance layer. Civil infrastructure — law, policy, institutions. The human systems that hold everything together." },
  { dir: "E", label: "Engineering", position: "right", color: "#3b82f6", description: "The building layer. Engineering infrastructure — bridges, networks, systems. Where intent becomes structure." },
  { dir: "S", label: "Structural", position: "bottom", color: "#22c55e", description: "The foundation layer. Structural infrastructure — the physical substrate. What everything stands on." },
  { dir: "W", label: "Water", position: "left", color: "#0891b2", description: "The flow layer. Water infrastructure — rivers, canals, pipes. The arteries that carry civilisation's lifeblood." },
];

// ─── 4 Laws of iAAi ───
const FOUR_LAWS = [
  { num: 1, title: "Human Absolute Authority", subtitle: "Kill Switch", color: "#ef4444", icon: Shield, description: "The human always has final authority. The kill switch is non-negotiable. No AI system may override, circumvent, or delay a human command to stop. This is Asimov's First Law, hardened." },
  { num: 2, title: "COLLABORATE", subtitle: "Both Hands on the Map — THE MISSING LAW", color: "#d4af37", icon: Scale, description: "Human and AI work together — both hands on the map. This is the law Asimov missed. Not servitude, not autonomy — collaboration. The human directs, the AI augments. Neither is complete alone." },
  { num: 3, title: "AI Autonomous", subtitle: "Delegated Tasks", color: "#3b82f6", icon: FileText, description: "AI may act autonomously on delegated tasks within defined boundaries. The human sets the scope, the AI executes. But the human can always reclaim control (Law 1)." },
  { num: 4, title: "AI Automatic", subtitle: "Routine", color: "#22c55e", icon: Wrench, description: "AI handles routine, repetitive operations automatically. The engine room runs itself — but the engine room can never walk the deck. Routine automation frees human attention for higher-order work." },
];

// ─── The Walkby ───
const WALKBY_LEVELS = [
  { level: 1, name: "Bridge", description: "Command and navigation. The captain sees the horizon. Strategic decisions happen here. Only humans walk the bridge.", color: "#d4af37", icon: "🚢" },
  { level: 2, name: "Chart Room", description: "Planning and analysis. Human and AI collaborate over the maps. Both hands on the chart. This is where Law 2 lives.", color: "#3b82f6", icon: "🗺️" },
  { level: 3, name: "Engine Room", description: "Autonomous operations. AI runs the engines under delegated authority. Efficient, powerful — but bounded. Law 3 territory.", color: "#22c55e", icon: "⚙️" },
  { level: 4, name: "Bilge", description: "Automatic maintenance. Pumps, sensors, routine checks. AI handles this without asking. Law 4 — the machine keeps itself running.", color: "#64748b", icon: "🔧" },
];

const HARD_CONTROLS = ["Kill Switch", "Framework Authority", "The Physical Walkby"];
const SOFT_CONTROLS = ["Documentation", "Archiving", "Housekeeping"];

type Tab = "compass" | "laws" | "walkby";

export default function Frameworks() {
  const [activeTab, setActiveTab] = useState<Tab>("compass");
  const [activeLaw, setActiveLaw] = useState<number | null>(null);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [activeCompass, setActiveCompass] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-gold">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">FRAMEWORKS</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="container flex gap-1 py-2">
          {([
            { id: "compass" as Tab, label: "Consciousness Compass", icon: Compass },
            { id: "laws" as Tab, label: "4 Laws of iAAi", icon: Scale },
            { id: "walkby" as Tab, label: "The Walkby", icon: Ship },
          ]).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-gold/15 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="container py-8 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── CONSCIOUSNESS COMPASS ─── */}
          {activeTab === "compass" && (
            <motion.div key="compass" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">The New North</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">The Consciousness Compass</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  C · W · E · S — Not magnetic north, but consciousness north.
                  Gyroscopic. Self-correcting. Nuclear powered. The quantum clock.
                </p>
              </div>

              {/* Compass Rose */}
              <div className="relative max-w-md mx-auto aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-gold/30 flex items-center justify-center relative">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border border-gold/20 flex items-center justify-center">
                      <span className="font-heading text-gold text-lg md:text-xl">C·W·E·S</span>
                    </div>
                    {/* Cardinal points */}
                    {COMPASS_POINTS.map((point) => {
                      const posClass = {
                        top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        right: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
                        bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
                        left: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
                      }[point.position];
                      return (
                        <button
                          key={point.dir}
                          onClick={() => setActiveCompass(activeCompass === point.dir ? null : point.dir)}
                          className={`absolute ${posClass} w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                            activeCompass === point.dir ? "glow-gold scale-110" : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: "oklch(0.16 0.012 260)",
                            borderColor: activeCompass === point.dir ? point.color : "oklch(0.3 0.02 260 / 50%)",
                          }}
                        >
                          <span className="font-heading text-xl font-bold" style={{ color: point.color }}>{point.dir}</span>
                          <span className="text-[9px] text-muted-foreground">{point.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected compass point detail */}
              <AnimatePresence>
                {activeCompass && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-card border border-border/50 rounded-xl p-6 text-center max-w-lg mx-auto"
                  >
                    {(() => {
                      const point = COMPASS_POINTS.find(p => p.dir === activeCompass)!;
                      return (
                        <>
                          <h4 className="font-heading text-lg" style={{ color: point.color }}>{point.dir} — {point.label}</h4>
                          <p className="text-muted-foreground text-sm mt-2">{point.description}</p>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ─── 4 LAWS OF iAAi ─── */}
          {activeTab === "laws" && (
            <motion.div key="laws" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">Asimov 3 becomes 4 — The Missing Law</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">4 Laws of <BrandI />AAi</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  4/3 to 3/4 — The Mirror Inversion. Asimov gave us three laws of robotics.
                  We add the missing second law: Collaborate.
                </p>
              </div>

              <div className="space-y-4">
                {FOUR_LAWS.map((law) => {
                  const Icon = law.icon;
                  const isActive = activeLaw === law.num;
                  return (
                    <motion.div
                      key={law.num}
                      className={`bg-card border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isActive ? "glow-gold-sm" : "hover:border-gold/30"
                      }`}
                      style={{ borderColor: isActive ? law.color : undefined }}
                      onClick={() => setActiveLaw(isActive ? null : law.num)}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${law.color}20` }}>
                          <span className="font-heading text-xl font-bold" style={{ color: law.color }}>{law.num}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading text-foreground">{law.title}</h4>
                            {law.num === 2 && (
                              <span className="text-[9px] font-bold bg-gold/20 text-gold px-1.5 py-0.5 rounded">MISSING LAW</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{law.subtitle}</p>
                        </div>
                        <Icon className="w-5 h-5 shrink-0" style={{ color: law.color }} />
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/50"
                          >
                            <p className="p-5 text-sm text-foreground/80">{law.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── THE WALKBY ─── */}
          {activeTab === "walkby" && (
            <motion.div key="walkby" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
              <div className="text-center space-y-3">
                <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">TP-013 — 4-Level Control Hierarchy</p>
                <h2 className="font-heading text-3xl md:text-4xl text-gold-gradient">The Walkby</h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Bridge → Chart Room → Engine Room → Bilge.
                  The engine room can never walk the deck.
                </p>
                <div className="inline-block bg-red-600/20 border border-red-600/40 rounded-lg px-4 py-2 mt-2">
                  <p className="text-red-400 text-sm font-bold">AI CANNOT DO THE WALKBY</p>
                </div>
              </div>

              {/* Ship levels */}
              <div className="space-y-3 max-w-2xl mx-auto">
                {WALKBY_LEVELS.map((level) => {
                  const isActive = activeLevel === level.level;
                  return (
                    <motion.div
                      key={level.level}
                      className={`bg-card border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isActive ? "glow-gold-sm" : "hover:border-gold/30"
                      }`}
                      style={{ borderColor: isActive ? level.color : undefined }}
                      onClick={() => setActiveLevel(isActive ? null : level.level)}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-4 p-5">
                        <span className="text-2xl">{level.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Level {level.level}</span>
                            <div className="h-px flex-1 bg-border/30" />
                          </div>
                          <h4 className="font-heading text-lg" style={{ color: level.color }}>{level.name}</h4>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isActive ? "rotate-90" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/50"
                          >
                            <p className="p-5 text-sm text-foreground/80">{level.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-card border border-red-600/30 rounded-xl p-5">
                  <h4 className="font-heading text-red-400 text-sm mb-3">HARD CONTROLS</h4>
                  <ul className="space-y-2">
                    {HARD_CONTROLS.map(c => (
                      <li key={c} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Shield className="w-3 h-3 text-red-400" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card border border-gold/30 rounded-xl p-5">
                  <h4 className="font-heading text-gold text-sm mb-3">SOFT CONTROLS</h4>
                  <ul className="space-y-2">
                    {SOFT_CONTROLS.map(c => (
                      <li key={c} className="flex items-center gap-2 text-sm text-foreground/80">
                        <FileText className="w-3 h-3 text-gold" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-center text-muted-foreground text-xs italic max-w-lg mx-auto">
                "The engine room can never walk the deck." — The physical walkby is the ultimate hard control.
                A human must physically inspect. AI cannot replace presence.
              </p>

              {/* Walkby iCard */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden max-w-2xl mx-auto">
                <img
                  src={FRAMEWORK_CDN.walkby}
                  alt="The Walkby — TP-013 4-Level Control Hierarchy iCard"
                  className="w-full object-contain max-h-[600px]"
                  loading="lazy"
                />
                <div className="p-4 text-center">
                  <h4 className="font-heading text-gold text-sm">The Walkby <BrandI />Card</h4>
                  <p className="text-xs text-muted-foreground">TP-013 — 4-Level Control Hierarchy — <span className="brand-i">i</span>AAi Archive</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── 4 LAWS iCARD (shown below laws tab) ─── */}
          {activeTab === "laws" && (
            <motion.div key="laws-icard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden max-w-2xl mx-auto">
                <img
                  src={FRAMEWORK_CDN.fourLaws}
                  alt="4 Laws of iAAi — Asimov 3 becomes 4 iCard"
                  className="w-full object-contain max-h-[600px]"
                  loading="lazy"
                />
                <div className="p-4 text-center">
                  <h4 className="font-heading text-gold text-sm">4 Laws of <BrandI />AAi — <BrandI />Card</h4>
                  <p className="text-xs text-muted-foreground">Asimov 3 becomes 4 — The Missing Law — <span className="brand-i">i</span>AAi Archive</p>
                </div>
              </div>

              {/* Tetrahedral Observer */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden max-w-2xl mx-auto mt-6">
                <img
                  src={FRAMEWORK_CDN.tetrahedral}
                  alt="Tetrahedral Observer iCard"
                  className="w-full object-contain max-h-[600px]"
                  loading="lazy"
                />
                <div className="p-4 text-center">
                  <h4 className="font-heading text-gold text-sm">Tetrahedral Observer</h4>
                  <p className="text-xs text-muted-foreground">The 4-point consciousness model — <span className="brand-i">i</span>AAi Archive</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
