import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, BookOpen, Brain, Eye, Zap, Target, ChevronDown, ChevronUp } from "lucide-react";

const SCADA_NODES = [
  {
    id: "top",
    label: "TOP NODE",
    title: "Mentally Embodied",
    subtitle: "Willful Intent — The Mind Directing",
    icon: Brain,
    color: "#d4af37",
    description: "The supervisory layer. Your conscious mind observes, decides, and directs. This is where human authority lives — the captain on the bridge.",
    position: "top",
  },
  {
    id: "bottom-left",
    label: "BOTTOM LEFT NODE",
    title: "Digitally Embodied",
    subtitle: "Man Inside Machine — VR/AR/Game/Simulation",
    icon: Eye,
    color: "#3b82f6",
    description: "The control interface. You step inside the digital world — through VR, AR, games, or simulation. The machine becomes an extension of your senses.",
    position: "bottom-left",
  },
  {
    id: "bottom-right",
    label: "BOTTOM RIGHT NODE",
    title: "Reality Transform",
    subtitle: "AI on Man — Suit/Sensors/Feedback",
    icon: Zap,
    color: "#a855f7",
    description: "The feedback loop. AI systems, sensors, and suits feed reality data back to you. Data acquisition transforms into actionable intelligence.",
    position: "bottom-right",
  },
];

const SCADA_SCHEMA = [
  { letter: "S", word: "Supervisory", meaning: "Mental Embodiment (mind observing)", color: "#d4af37" },
  { letter: "C", word: "Control", meaning: "Willful Intent (mind directing)", color: "#ef4444" },
  { letter: "A", word: "& Action", meaning: "Willful Intent (mind directing)", color: "#f59e0b" },
  { letter: "DA", word: "Data Acquisition", meaning: "Reality Transform (sensors feeding back)", color: "#3b82f6" },
];

const YODA_STEPS = [
  { letter: "Y", word: "Yoke", description: "Connect to the system. Strap in. The human takes the controls.", icon: Target, color: "#ef4444" },
  { letter: "O", word: "Orient", description: "Survey the field. Read the data. Understand where you are in the matrix.", icon: Eye, color: "#f59e0b" },
  { letter: "D", word: "Decisive", description: "Make the call. The human decides — not the machine. This is Law 1.", icon: Brain, color: "#3b82f6" },
  { letter: "A", word: "Action", description: "Execute. Transform intent into reality. The loop completes.", icon: Zap, color: "#22c55e" },
];

export default function YodaControl() {
  const [yodaMode, setYodaMode] = useState<"search" | "remember">("search");
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

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
            <h1 className="font-heading text-gold text-sm md:text-base tracking-wider">YODA CONTROL LEVER</h1>
            <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">BETA</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-5xl mx-auto space-y-12">
        {/* Title Section */}
        <section className="text-center space-y-4">
          <p className="text-gold-dim text-xs tracking-[0.3em] uppercase">The SCADA of Consciousness</p>
          <h2 className="font-heading text-3xl md:text-5xl text-gold-gradient">YODA Control Lever</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Yoke → Orient → Decisive → Action. Three embodiments. One control system.
            The human always holds the lever.
          </p>
        </section>

        {/* YODA Toggle — Search / Remember */}
        <section className="flex justify-center">
          <div className="bg-card border border-border/50 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setYodaMode("search")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                yodaMode === "search"
                  ? "bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/40 glow-cyan"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="w-4 h-4" /> SEARCH MODE
            </button>
            <button
              onClick={() => setYodaMode("remember")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                yodaMode === "remember"
                  ? "bg-gold/20 text-gold border border-gold/40 glow-gold-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" /> REMEMBER MODE
            </button>
          </div>
        </section>

        {/* Mode Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={yodaMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border/50 rounded-xl p-6 text-center"
          >
            {yodaMode === "search" ? (
              <div className="space-y-2">
                <h3 className="font-heading text-cyan-glow text-lg">Search Mode — The Yaka Arrow</h3>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Active scanning. The YODA lever points outward — seeking new data, new connections, new nodes in the Dearden Field.
                  Like the Yaka Arrow, it follows your intent through the matrix, finding what you need before you know you need it.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-heading text-gold text-lg">Remember Mode — The Quill Mask</h3>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                  Reflective integration. The YODA lever turns inward — consolidating knowledge, connecting patterns, building your thesis.
                  Like the Quill Mask visor, it overlays what you've learned onto what you see, revealing hidden structures.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Y-O-D-A Steps */}
        <section className="space-y-4">
          <h3 className="font-heading text-gold text-xl text-center">The Four Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {YODA_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isExpanded = expandedStep === i;
              return (
                <motion.div
                  key={step.letter}
                  className="bg-card border border-border/50 rounded-xl p-5 cursor-pointer hover:border-gold/40 transition-all"
                  onClick={() => setExpandedStep(isExpanded ? null : i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading text-3xl" style={{ color: step.color }}>{step.letter}</span>
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h4 className="font-heading text-foreground text-lg mb-1">{step.word}</h4>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-muted-foreground text-sm mt-2"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-center mt-2">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SCADA Triangle */}
        <section className="space-y-6">
          <h3 className="font-heading text-gold text-xl text-center">The Three Embodiments</h3>
          <div className="relative max-w-2xl mx-auto">
            {/* Triangle visualization */}
            <div className="flex flex-col items-center gap-8">
              {/* Top node */}
              <motion.div
                className={`bg-card border-2 rounded-xl p-6 max-w-sm w-full text-center cursor-pointer transition-all ${
                  activeNode === "top" ? "border-gold glow-gold" : "border-border/50 hover:border-gold/40"
                }`}
                onClick={() => setActiveNode(activeNode === "top" ? null : "top")}
                whileHover={{ scale: 1.02 }}
              >
                <Brain className="w-8 h-8 mx-auto mb-2" style={{ color: SCADA_NODES[0].color }} />
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{SCADA_NODES[0].label}</p>
                <h4 className="font-heading text-lg" style={{ color: SCADA_NODES[0].color }}>{SCADA_NODES[0].title}</h4>
                <p className="text-xs text-muted-foreground">{SCADA_NODES[0].subtitle}</p>
                <AnimatePresence>
                  {activeNode === "top" && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-foreground/80 mt-3 border-t border-border/50 pt-3">
                      {SCADA_NODES[0].description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Connecting lines visual */}
              <div className="flex items-center justify-center gap-2 text-gold/30">
                <div className="h-px w-16 bg-gold/30" />
                <span className="text-xs text-gold/50 font-mono">SCADA LOOP</span>
                <div className="h-px w-16 bg-gold/30" />
              </div>

              {/* Bottom two nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {SCADA_NODES.slice(1).map((node) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      className={`bg-card border-2 rounded-xl p-6 text-center cursor-pointer transition-all ${
                        activeNode === node.id ? "glow-gold" : "hover:border-gold/40"
                      }`}
                      style={{ borderColor: activeNode === node.id ? node.color : undefined }}
                      onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: node.color }} />
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{node.label}</p>
                      <h4 className="font-heading text-lg" style={{ color: node.color }}>{node.title}</h4>
                      <p className="text-xs text-muted-foreground">{node.subtitle}</p>
                      <AnimatePresence>
                        {activeNode === node.id && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-sm text-foreground/80 mt-3 border-t border-border/50 pt-3">
                            {node.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SCADA Schema Legend */}
        <section className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
          <h3 className="font-heading text-gold text-lg text-center">SCADA Schema</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SCADA_SCHEMA.map((item) => (
              <div key={item.letter} className="bg-background/50 rounded-lg p-4 text-center border border-border/30">
                <span className="font-heading text-2xl font-bold" style={{ color: item.color }}>{item.letter}</span>
                <p className="text-sm font-medium text-foreground mt-1">{item.word}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.meaning}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs italic">
            "Three Embodiments. One Control System. iAAi."
          </p>
        </section>

        {/* Connection to Game */}
        <section className="bg-card border border-gold/30 rounded-xl p-6 text-center space-y-3">
          <h3 className="font-heading text-gold text-lg">In The Reality Engine</h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Every mode uses the YODA loop. Explorer taps to <strong className="text-foreground">Search</strong>.
            Flight Deck pilots <strong className="text-foreground">Orient</strong> through the Dearden Field.
            Scholars make <strong className="text-foreground">Decisive</strong> thesis choices.
            Every action completes the loop — <strong className="text-foreground">Action</strong> transforms reality.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/explore">
              <Button variant="outline" size="sm" className="border-ember text-ember hover:bg-ember/10">Explorer</Button>
            </Link>
            <Link href="/flight-deck">
              <Button variant="outline" size="sm" className="border-cyan-glow text-cyan-glow hover:bg-cyan-glow/10">Flight Deck</Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="sm" className="border-gold text-gold hover:bg-gold/10">Scholar</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
