/**
 * Prologue — "The Last Human After Midnight"
 * Narrative framing before Relay 1 begins.
 * DAVID narrates the story of why the player is here.
 * Addresses Node 018 Khanh Huynh's feedback: "need a story before gameplay starts"
 * and GDP v2.1 Section 15.4 Design Implications.
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { davidSpeak, davidStop, getVoiceEnabled, setVoiceEnabled } from "@/hooks/useDavidVoice";

const PROLOGUE_SCENES = [
  {
    id: "scene1",
    text: "The clock reads one minute to midnight.",
    subtext: "Not a clock on a wall. The Civilisation Clock — the one that measures whether humanity remembers what it built.",
    davidLine: "The clock reads one minute to midnight. Not a clock on a wall. The Civilisation Clock. The one that measures whether humanity remembers what it built.",
    visual: "clock",
    delay: 0,
  },
  {
    id: "scene2",
    text: "Twelve thousand years of infrastructure — fire, roads, engines, satellites — reduced to a fading signal.",
    subtext: "The knowledge is still there. Scattered across twelve relays. But no one is listening.",
    davidLine: "Twelve thousand years of infrastructure. Fire. Roads. Engines. Satellites. All of it reduced to a fading signal. The knowledge is still there, scattered across twelve relays. But no one is listening.",
    visual: "signal",
    delay: 0,
  },
  {
    id: "scene3",
    text: "Except you.",
    subtext: "You are the last human after midnight. The one who chose to look back before moving forward.",
    davidLine: "Except you. You are the last human after midnight. The one who chose to look back before moving forward.",
    visual: "human",
    delay: 0,
  },
  {
    id: "scene4",
    text: "My name is DAVID.",
    subtext: "I am your guide through the twelve Civilisational Relays. Each one holds the inventions that built this world. Your mission: rediscover them. Every discovery pushes the clock back from midnight.",
    davidLine: "My name is DAVID. I am your guide through the twelve Civilisational Relays. Each one holds the inventions that built this world. Your mission is to rediscover them. Every discovery pushes the clock back from midnight.",
    visual: "david",
    delay: 0,
  },
  {
    id: "scene5",
    text: "But this is not just a journey of discovery.",
    subtext: "At the end of each relay, you will face a choice. A real dilemma from history. What you choose will shape who you become — Builder, Philosopher, Pragmatist, or Visionary.",
    davidLine: "But this is not just a journey of discovery. At the end of each relay, you will face a choice. A real dilemma from history. What you choose will shape who you become. Builder. Philosopher. Pragmatist. Or Visionary.",
    visual: "choice",
    delay: 0,
  },
  {
    id: "scene6",
    text: "The first relay awaits. Fire — the eternal constant.",
    subtext: "Are you ready to begin?",
    davidLine: "The first relay awaits. Fire. The eternal constant. Are you ready to begin?",
    visual: "fire",
    delay: 0,
  },
];

const VISUAL_ELEMENTS: Record<string, { emoji: string; gradient: string }> = {
  clock: { emoji: "🕐", gradient: "from-red-600/30 via-orange-600/20 to-transparent" },
  signal: { emoji: "📡", gradient: "from-blue-600/30 via-indigo-600/20 to-transparent" },
  human: { emoji: "🧍", gradient: "from-amber-600/30 via-yellow-600/20 to-transparent" },
  david: { emoji: "🤖", gradient: "from-amber-500/30 via-orange-500/20 to-transparent" },
  choice: { emoji: "⚖️", gradient: "from-purple-600/30 via-violet-600/20 to-transparent" },
  fire: { emoji: "🔥", gradient: "from-red-500/30 via-orange-500/20 to-transparent" },
};

export default function Prologue() {
  const [, navigate] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [voiceOn, setVoiceOn] = useState(getVoiceEnabled);
  const [isNarrating, setIsNarrating] = useState(false);
  const [hasSeenPrologue, setHasSeenPrologue] = useState(false);

  // Check if player has already seen the prologue
  useEffect(() => {
    const seen = localStorage.getItem("tre_prologue_seen");
    if (seen === "true") {
      setHasSeenPrologue(true);
    }
  }, []);

  // DAVID narrates each scene
  useEffect(() => {
    if (voiceOn && currentScene < PROLOGUE_SCENES.length) {
      setIsNarrating(true);
      const timer = setTimeout(() => {
        davidSpeak(PROLOGUE_SCENES[currentScene].davidLine, {
          rate: 0.82,
          pitch: 0.85,
          onEnd: () => setIsNarrating(false),
        });
      }, 800);
      return () => {
        clearTimeout(timer);
        davidStop();
      };
    }
  }, [currentScene, voiceOn]);

  const handleNext = useCallback(() => {
    davidStop();
    setIsNarrating(false);
    if (currentScene < PROLOGUE_SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      // Mark prologue as seen and proceed to Relay 1
      localStorage.setItem("tre_prologue_seen", "true");
      navigate("/explore/1");
    }
  }, [currentScene, navigate]);

  const handleSkip = useCallback(() => {
    davidStop();
    localStorage.setItem("tre_prologue_seen", "true");
    navigate("/explore/1");
  }, [navigate]);

  const toggleVoice = useCallback(() => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
    if (!next) davidStop();
  }, [voiceOn]);

  const scene = PROLOGUE_SCENES[currentScene];
  const visual = VISUAL_ELEMENTS[scene.visual];
  const isLastScene = currentScene === PROLOGUE_SCENES.length - 1;
  const progress = ((currentScene + 1) / PROLOGUE_SCENES.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative overflow-hidden mobile-content-pad">
      {/* Ambient gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} transition-all duration-1000 pointer-events-none`} />

      {/* Top controls */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center cursor-pointer">
              <span className="text-[10px] font-bold text-black">D</span>
            </div>
          </Link>
          <span className="text-xs font-mono text-amber-400/80 tracking-wider">DAVID PROLOGUE</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleVoice} className="text-muted-foreground">
            {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          {!isLastScene && (
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground text-xs">
              SKIP
            </Button>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 mx-4">
        <div className="h-0.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500/60 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[9px] text-muted-foreground/40 font-mono mt-1 text-right">
          {currentScene + 1} / {PROLOGUE_SCENES.length}
        </p>
      </div>

      {/* Main scene content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-lg"
          >
            {/* Visual emoji */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-6xl mb-8"
            >
              {visual.emoji}
            </motion.div>

            {/* Main text */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-4 text-foreground"
            >
              {scene.text}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {scene.subtext}
            </motion.p>

            {/* DAVID narrating indicator */}
            {voiceOn && isNarrating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 mt-6"
              >
                <Volume2 className="w-3 h-3 text-amber-400/60 animate-pulse" />
                <span className="text-[9px] text-amber-400/60 font-mono">DAVID NARRATING</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="relative z-10 flex justify-center pb-8 px-6">
        <Button
          onClick={handleNext}
          size="lg"
          className="gap-2 font-heading tracking-wider min-w-[200px] bg-amber-600 hover:bg-amber-500 text-white"
        >
          {isLastScene ? (
            <>
              BEGIN RELAY 1 🔥
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>

      {/* "Already seen" quick-start option */}
      {hasSeenPrologue && currentScene === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 text-center pb-4"
        >
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline underline-offset-2"
          >
            You've seen this before — skip to Relay 1
          </button>
        </motion.div>
      )}
    </div>
  );
}
