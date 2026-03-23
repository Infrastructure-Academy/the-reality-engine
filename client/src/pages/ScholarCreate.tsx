import { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { FITS_TYPES, RELAYS, ABILITY_SCORES } from "@shared/gameData";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Dices, BookOpen, Brain, Scroll, Lock,
  ChevronRight, MessageCircle, GraduationCap, Star, Sparkles
} from "lucide-react";
import { useGamepad, type GamepadButtonName } from "@/hooks/useGamepad";
import { ExplorerVideo } from "@/components/ExplorerVideo";

type Phase = "fits_assessment" | "dice_roll" | "character_sheet" | "thesis_tracker";

const FITS_QUESTIONS = [
  { q: "When facing a new infrastructure challenge, you first:", a: [
    { text: "Examine the physical evidence and materials", type: "senser" },
    { text: "Imagine what could be built here", type: "intuitive" },
    { text: "Analyse the structural requirements", type: "thinker" },
    { text: "Consider the human impact", type: "feeler" },
  ]},
  { q: "The most important aspect of a civilisational relay is:", a: [
    { text: "The tangible inventions it produced", type: "senser" },
    { text: "The paradigm shift it enabled", type: "intuitive" },
    { text: "The logical progression from prior relays", type: "thinker" },
    { text: "How it changed people's lives", type: "feeler" },
  ]},
  { q: "When studying the Dearden Field, you focus on:", a: [
    { text: "Observable data points and measurements", type: "senser" },
    { text: "Hidden patterns and connections", type: "intuitive" },
    { text: "Systematic classification of nodes", type: "thinker" },
    { text: "The story each intersection tells", type: "feeler" },
  ]},
  { q: "Your thesis approach would be:", a: [
    { text: "Empirical — grounded in evidence", type: "senser" },
    { text: "Visionary — proposing new frameworks", type: "intuitive" },
    { text: "Analytical — rigorous methodology", type: "thinker" },
    { text: "Narrative — weaving human stories", type: "feeler" },
  ]},
  { q: "In a team expedition, you naturally:", a: [
    { text: "Handle logistics and practical details", type: "senser" },
    { text: "Scout ahead and spot opportunities", type: "intuitive" },
    { text: "Plan the route and strategy", type: "thinker" },
    { text: "Keep the team motivated and cohesive", type: "feeler" },
  ]},
  { q: "The Great Web that resonates most with you:", a: [
    { text: "Natural — tangible, elemental forces", type: "senser" },
    { text: "Consciousness — the frontier of possibility", type: "intuitive" },
    { text: "Digital — precise, logical systems", type: "thinker" },
    { text: "Biological — living, breathing networks", type: "feeler" },
  ]},
];

// Roll 4d6 drop lowest
function roll4d6DropLowest(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

// D20 roll
function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export default function ScholarCreate() {
  const { user, isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<Phase>("fits_assessment");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [fitsScores, setFitsScores] = useState<Record<string, number>>({ senser: 0, intuitive: 0, thinker: 0, feeler: 0 });
  const [fitsResult, setFitsResult] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [abilityRolls, setAbilityRolls] = useState<Record<string, number>>({});
  const [rollsRemaining, setRollsRemaining] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [d20Result, setD20Result] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Thesis tracking state
  const [thesisTitle, setThesisTitle] = useState("");
  const [thesisRelays, setThesisRelays] = useState<Set<number>>(new Set());
  const [thesisGrade, setThesisGrade] = useState<string>("Ungraded");

  const handleFitsAnswer = useCallback((type: string) => {
    setFitsScores(prev => ({ ...prev, [type]: prev[type] + 1 }));
    if (currentQuestion < FITS_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate result
      const scores = { ...fitsScores, [type]: fitsScores[type] + 1 };
      const maxScore = Math.max(...Object.values(scores));
      const maxTypes = Object.entries(scores).filter(([, v]) => v === maxScore);
      const result = maxTypes.length > 1 ? "balanced" : maxTypes[0][0];
      setFitsResult(result);
      setPhase("dice_roll");
    }
  }, [currentQuestion, fitsScores]);

  const handleRollAll = useCallback(() => {
    if (rollsRemaining <= 0) return;
    setIsRolling(true);
    setD20Result(null);

    // Animate rolling
    let count = 0;
    const interval = setInterval(() => {
      const tempRolls: Record<string, number> = {};
      ABILITY_SCORES.forEach(ab => {
        tempRolls[ab.id] = roll4d6DropLowest();
      });
      setAbilityRolls(tempRolls);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        // Final roll
        const finalRolls: Record<string, number> = {};
        ABILITY_SCORES.forEach(ab => {
          finalRolls[ab.id] = roll4d6DropLowest();
        });
        setAbilityRolls(finalRolls);
        setD20Result(rollD20());
        setRollsRemaining(prev => prev - 1);
        setIsRolling(false);
      }
    }, 100);
  }, [rollsRemaining]);

  const totalAbilityScore = useMemo(() => Object.values(abilityRolls).reduce((s, v) => s + v, 0), [abilityRolls]);

  // XP calculation based on ability scores (big numbers per user preference)
  const baseXp = totalAbilityScore * 10000;
  const d20Bonus = d20Result ? d20Result * 5000 : 0;
  const startingXp = baseXp + d20Bonus;

  // Academic grade calculation
  const calculateGrade = useCallback((relaysCompleted: number, xp: number) => {
    if (relaysCompleted >= 12 && xp >= 20000000) return "Distinction (First Class)";
    if (relaysCompleted >= 10 && xp >= 15000000) return "Merit (Upper Second)";
    if (relaysCompleted >= 8 && xp >= 10000000) return "Pass (Lower Second)";
    if (relaysCompleted >= 6 && xp >= 5000000) return "Third Class";
    return "In Progress";
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground mobile-content-pad bg-starfield flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <GraduationCap className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-gold-gradient mb-3">Scholar Access Required</h2>
          <p className="text-muted-foreground text-sm mb-6">
            The Scholar path requires authentication. Sign in to begin your character creation and thesis journey.
          </p>
          <div className="flex flex-col gap-3">
            <a href={getLoginUrl()}>
              <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider">
                <Lock className="w-4 h-4 mr-2" /> Sign In to Begin
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

  return (
    <div className="min-h-screen bg-background text-foreground mobile-content-pad bg-starfield relative">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-amber-500/20 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between h-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Modes
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-red-600 text-white">BETA</span>
            <h1 className="font-heading text-sm font-bold tracking-wider text-gold-gradient">
              SCHOLAR — {phase === "fits_assessment" ? "FITS ASSESSMENT" : phase === "dice_roll" ? "ABILITY SCORES" : phase === "character_sheet" ? "CHARACTER SHEET" : "THESIS TRACKER"}
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)} className="text-muted-foreground gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">DAVID</span>
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-3xl mx-auto">

        {/* Intro Video */}
        <ExplorerVideo
          videoUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/FINAL-v5-scholar_b3868d3a.mp4"
          title="The Deepest Journey of All"
          subtitle="32s intro"
          accentColor="#f59e0b"
          glowColor="rgba(245,158,11,0.3)"
        />

        {/* Phase Navigation */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: "fits_assessment", label: "FITS", icon: Brain },
            { id: "dice_roll", label: "D20", icon: Dices },
            { id: "character_sheet", label: "Sheet", icon: Scroll },
            { id: "thesis_tracker", label: "Thesis", icon: BookOpen },
          ].map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (p.id === "fits_assessment" || (fitsResult && p.id === "dice_roll") || (Object.keys(abilityRolls).length > 0 && (p.id === "character_sheet" || p.id === "thesis_tracker"))) {
                    setPhase(p.id as Phase);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  phase === p.id ? "bg-amber-500/20 border border-amber-500/40 text-amber-400" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <p.icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
              {i < 3 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
            </div>
          ))}
        </div>

        {/* FITS ASSESSMENT */}
        <AnimatePresence mode="wait">
          {phase === "fits_assessment" && (
            <motion.div key="fits" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-6">
                <Brain className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="font-heading text-2xl font-bold">FITS Temperament Assessment</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Feeler · Intuitive · Thinker · Senser — Discover your civilisational temperament
                </p>
                <p className="text-xs text-muted-foreground/60 font-mono mt-2">
                  Question {currentQuestion + 1} of {FITS_QUESTIONS.length}
                </p>
              </div>

              {/* Progress */}
              <div className="h-1 bg-muted rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                  animate={{ width: `${((currentQuestion) / FITS_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-6">
                <p className="text-lg font-medium mb-6">{FITS_QUESTIONS[currentQuestion].q}</p>
                <div className="grid gap-3">
                  {FITS_QUESTIONS[currentQuestion].a.map((answer, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleFitsAnswer(answer.type)}
                      className="text-left p-4 rounded-lg border border-border/50 hover:border-amber-500/40 bg-card/30 hover:bg-amber-500/5 transition-all"
                    >
                      <span className="text-sm">{answer.text}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Current Scores */}
              <div className="grid grid-cols-4 gap-2">
                {FITS_TYPES.map(f => (
                  <div key={f.id} className="text-center p-2 rounded-lg border border-border/30">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.abbr}</p>
                    <p className="text-lg font-bold font-mono" style={{ color: f.color }}>{fitsScores[f.id]}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* DICE ROLL */}
          {phase === "dice_roll" && (
            <motion.div key="dice" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-6">
                <Dices className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="font-heading text-2xl font-bold">Roll Your Ability Scores</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  4d6 drop lowest for each ability + D20 bonus roll
                </p>
                {fitsResult && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                    <span className="text-xs text-amber-400 font-bold">FITS: {FITS_TYPES.find(f => f.id === fitsResult)?.name || "Balanced"}</span>
                  </div>
                )}
              </div>

              {/* Character Name */}
              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Character Name</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter your scholar name..."
                  className="w-full bg-input border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-heading text-lg"
                />
              </div>

              {/* Roll Button */}
              <div className="text-center mb-6">
                <Button
                  onClick={handleRollAll}
                  disabled={rollsRemaining <= 0 || isRolling}
                  className="bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider text-lg px-8 py-6"
                  size="lg"
                >
                  <Dices className={`w-5 h-5 mr-2 ${isRolling ? "animate-spin" : ""}`} />
                  {isRolling ? "Rolling..." : `Roll Ability Scores (${rollsRemaining} remaining)`}
                </Button>
              </div>

              {/* Ability Score Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {ABILITY_SCORES.map(ab => {
                  const val = abilityRolls[ab.id] || 0;
                  const modifier = Math.floor((val - 10) / 2);
                  return (
                    <div key={ab.id} className="p-4 rounded-lg border border-border/50 bg-card/30 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{ab.name}</p>
                      <p className={`text-3xl font-bold font-mono ${val >= 15 ? "text-amber-400" : val >= 12 ? "text-foreground" : "text-muted-foreground"}`}>
                        {val || "—"}
                      </p>
                      {val > 0 && (
                        <p className={`text-xs font-mono ${modifier >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {modifier >= 0 ? "+" : ""}{modifier}
                        </p>
                      )}
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{ab.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* D20 Bonus Roll */}
              {d20Result !== null && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5"
                >
                  <p className="text-xs uppercase tracking-wider text-amber-400 mb-1">D20 Bonus Roll</p>
                  <p className={`text-5xl font-bold font-mono ${d20Result === 20 ? "text-amber-400 animate-pulse" : "text-foreground"}`}>
                    {d20Result}
                  </p>
                  {d20Result === 20 && <p className="text-sm text-amber-400 mt-1 font-bold">NATURAL 20 — Critical Success!</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Starting XP: <span className="text-gold-gradient font-bold">{startingXp.toLocaleString()}</span>
                  </p>
                </motion.div>
              )}

              {/* Summary & Continue */}
              {Object.keys(abilityRolls).length > 0 && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Score</p>
                    <p className="text-xl font-bold font-mono">{totalAbilityScore}</p>
                  </div>
                  <Button
                    onClick={() => setPhase("character_sheet")}
                    disabled={!characterName.trim()}
                    className="bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider"
                  >
                    View Character Sheet <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* CHARACTER SHEET */}
          {phase === "character_sheet" && (
            <motion.div key="sheet" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-gold-gradient">{characterName || "Unnamed Scholar"}</h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      {FITS_TYPES.find(f => f.id === fitsResult)?.name || "Balanced"} Scholar — Infrastructure Odyssey
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Starting XP</p>
                    <p className="text-lg font-bold text-gold-gradient font-mono">{startingXp.toLocaleString()}</p>
                  </div>
                </div>

                {/* FITS Type */}
                <div className="mb-6 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="text-sm font-bold">{FITS_TYPES.find(f => f.id === fitsResult)?.name || "Balanced"}</p>
                      <p className="text-xs text-muted-foreground">{FITS_TYPES.find(f => f.id === fitsResult)?.description || "A balanced approach to civilisational study"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {FITS_TYPES.map(f => (
                      <div key={f.id} className={`text-center p-1.5 rounded ${f.id === fitsResult ? "bg-amber-500/20 border border-amber-500/30" : ""}`}>
                        <p className="text-[10px] font-bold" style={{ color: f.color }}>{f.abbr}</p>
                        <p className="text-sm font-mono">{fitsScores[f.id]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ability Scores */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {ABILITY_SCORES.map(ab => {
                    const val = abilityRolls[ab.id] || 10;
                    const mod = Math.floor((val - 10) / 2);
                    return (
                      <div key={ab.id} className="text-center p-3 rounded-lg border border-border/50 bg-card/30">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{ab.name}</p>
                        <p className="text-2xl font-bold font-mono">{val}</p>
                        <p className={`text-xs font-mono ${mod >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {mod >= 0 ? "+" : ""}{mod}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* D20 Result */}
                {d20Result !== null && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30 mb-6">
                    <div className="flex items-center gap-2">
                      <Dices className="w-5 h-5 text-amber-400" />
                      <span className="text-sm">D20 Bonus Roll</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-amber-400">{d20Result}</span>
                  </div>
                )}

                {/* XP Cap Info */}
                <div className="p-3 rounded-lg border border-border/50 bg-card/30 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">XP Cap</span>
                    <span className="text-sm font-mono text-gold-gradient font-bold">24,000,000 XP</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${Math.min((startingXp / 24000000) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{startingXp.toLocaleString()} / 24,000,000</p>
                </div>

                <Button
                  onClick={() => setPhase("thesis_tracker")}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black font-heading tracking-wider"
                  size="lg"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Begin Thesis Journey
                </Button>
              </div>
            </motion.div>
          )}

          {/* THESIS TRACKER */}
          {phase === "thesis_tracker" && (
            <motion.div key="thesis" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="font-heading text-2xl font-bold">Thesis Development</h2>
                <p className="text-sm text-muted-foreground">
                  Navigate the 12 Relays to build your infrastructure thesis — DAVID serves as your Dungeon Master
                </p>
              </div>

              {/* Thesis Title */}
              <div className="mb-6">
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Thesis Title</label>
                <input
                  type="text"
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  placeholder="e.g., 'The Role of Water Infrastructure in Civilisational Emergence'"
                  className="w-full bg-input border border-border/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {/* Relay Completion Grid */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Relay Research Progress</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {RELAYS.map(relay => {
                    const isCompleted = thesisRelays.has(relay.number);
                    return (
                      <button
                        key={relay.number}
                        onClick={() => {
                          setThesisRelays(prev => {
                            const next = new Set(prev);
                            if (next.has(relay.number)) next.delete(relay.number);
                            else next.add(relay.number);
                            return next;
                          });
                        }}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                          isCompleted
                            ? "border-amber-500/40 bg-amber-500/10"
                            : "border-border/50 hover:border-border"
                        }`}
                      >
                        <span className="text-lg">{relay.emoji}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isCompleted ? "text-amber-400" : "text-foreground/70"}`}>
                            {relay.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{relay.era}</p>
                        </div>
                        {isCompleted && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Academic Grading */}
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-500" />
                    <span className="font-heading text-sm font-bold">Academic Assessment</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">{calculateGrade(thesisRelays.size, startingXp)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-card/30 text-center">
                    <p className="text-[10px] text-muted-foreground">Relays Researched</p>
                    <p className="text-xl font-bold font-mono">{thesisRelays.size}/12</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card/30 text-center">
                    <p className="text-[10px] text-muted-foreground">Current XP</p>
                    <p className="text-xl font-bold font-mono text-gold-gradient">{startingXp.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  <p className="font-bold mb-1">Grading Thresholds:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span>Distinction: 12 relays + 20M XP</span>
                    <span>Merit: 10 relays + 15M XP</span>
                    <span>Pass: 8 relays + 10M XP</span>
                    <span>Third: 6 relays + 5M XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DAVID Dungeon Master Chat */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-12 bottom-0 w-80 sm:w-96 border-l border-amber-500/20 bg-background/95 backdrop-blur-md z-30 flex flex-col"
          >
            <div className="p-3 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">D</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-400">DAVID</p>
                  <p className="text-[10px] text-muted-foreground">Dungeon Master</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">DAVID awaits your command, Scholar.</p>
                  <p className="text-xs text-amber-400/60 mt-1">Ask for thesis guidance, relay analysis, or Socratic inquiry.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user" ? "bg-amber-600 text-black" : "bg-muted text-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-amber-500/20">
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
                  placeholder="Consult the Dungeon Master..."
                  className="flex-1 bg-input border border-amber-500/20 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
                <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-black">Send</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
