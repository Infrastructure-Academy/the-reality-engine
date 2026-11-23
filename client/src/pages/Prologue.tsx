/**
 * Prologue — "The Last Human After Midnight"
 * Narrative framing before Relay 1 begins.
 * DAVID narrates the story of why the player is here.
 * Addresses Node 018 Khanh Huynh's feedback: "need a story before gameplay starts"
 * and GDP v2.1 Section 15.4 Design Implications.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { davidStop } from "@/hooks/useDavidVoice";
import { useLanguage, useT } from "@/contexts/LanguageContext";
import { declareStoryPlayback } from "@/lib/storyAudio";
import { resolveStoryLocale } from "@/lib/storyLocale";
import { prologueRecordingUrl } from "@/lib/prologueAudio";
import { PROLOGUE_BEGIN_LABEL, PROLOGUE_SCENES } from "@shared/prologueScenes";

const VISUAL_ELEMENTS: Record<string, { emoji: string; gradient: string }> = {
  clock: { emoji: "🕐", gradient: "from-red-600/30 via-orange-600/20 to-transparent" },
  signal: { emoji: "📡", gradient: "from-blue-600/30 via-indigo-600/20 to-transparent" },
  human: { emoji: "🧍", gradient: "from-amber-600/30 via-yellow-600/20 to-transparent" },
  david: { emoji: "🤖", gradient: "from-amber-500/30 via-orange-500/20 to-transparent" },
  choice: { emoji: "⚖️", gradient: "from-purple-600/30 via-violet-600/20 to-transparent" },
  fire: { emoji: "🔥", gradient: "from-red-500/30 via-orange-500/20 to-transparent" },
};

export default function Prologue() {
  const t = useT();
  const { lang } = useLanguage();
  const locale = resolveStoryLocale(lang, typeof navigator === "undefined" ? [] : navigator.languages ?? []);
  const [, navigate] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isNarrating, setIsNarrating] = useState(false);
  const [hasSeenPrologue, setHasSeenPrologue] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceOnRef = useRef(voiceOn);
  voiceOnRef.current = voiceOn;
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const generation = useRef(0);

  const startScene = useCallback((index: number): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    generation.current += 1;
    const mine = generation.current;
    if (!voiceOnRef.current) {
      audio.pause();
      return Promise.resolve();
    }
    const scene = PROLOGUE_SCENES[index];
    const url = scene ? prologueRecordingUrl(scene.id, localeRef.current) : null;
    if (!url) {
      audio.pause();
      return Promise.resolve();
    }
    declareStoryPlayback();
    const absolute = new URL(url, window.location.href).href;
    if (audio.src !== absolute) {
      audio.src = url;
      audio.currentTime = 0;
    } else if (audio.ended) {
      audio.currentTime = 0;
    }
    const pending = audio.play();
    if (!pending) return Promise.resolve();
    return pending.then(() => {
      if (generation.current !== mine) return;
    });
  }, []);

  // Check if player has already seen the prologue
  useEffect(() => {
    const seen = localStorage.getItem("tre_prologue_seen");
    if (seen === "true") {
      setHasSeenPrologue(true);
    }
  }, []);

  useEffect(() => {
    davidStop();
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Sonia reads the scene. A blocked autoplay waits for the next tap.
  useEffect(() => {
    if (!voiceOn) {
      audioRef.current?.pause();
      setIsNarrating(false);
      return;
    }
    let removeGesture = () => {};
    let cancelled = false;
    const attempt = startScene(currentScene);
    const mine = generation.current;
    attempt
      .then(() => {
        if (!cancelled && prologueRecordingUrl(PROLOGUE_SCENES[currentScene]?.id ?? "", locale)) setIsNarrating(true);
      })
      .catch(() => {
        if (cancelled) return;
        setIsNarrating(false);
        const onDown = () => {
          startScene(currentScene)
            .then(() => setIsNarrating(true))
            .catch(() => setIsNarrating(false));
          window.removeEventListener("pointerdown", onDown, true);
        };
        window.addEventListener("pointerdown", onDown, true);
        removeGesture = () => window.removeEventListener("pointerdown", onDown, true);
      });
    return () => {
      cancelled = true;
      removeGesture();
      if (generation.current === mine) audioRef.current?.pause();
    };
  }, [currentScene, voiceOn, locale, startScene]);

  const handleNext = useCallback(() => {
    davidStop();
    if (currentScene < PROLOGUE_SCENES.length - 1) {
      const next = currentScene + 1;
      void startScene(next).then(() => setIsNarrating(true)).catch(() => setIsNarrating(false));
      setCurrentScene(next);
    } else {
      audioRef.current?.pause();
      setIsNarrating(false);
      // Mark prologue as seen and proceed to Relay 1
      localStorage.setItem("tre_prologue_seen", "true");
      navigate("/explore/1");
    }
  }, [currentScene, navigate, startScene]);

  const handleSkip = useCallback(() => {
    davidStop();
    generation.current += 1;
    audioRef.current?.pause();
    setIsNarrating(false);
    localStorage.setItem("tre_prologue_seen", "true");
    navigate("/explore/1");
  }, [navigate]);

  const toggleVoice = useCallback(() => {
    const next = !voiceOnRef.current;
    voiceOnRef.current = next;
    setVoiceOn(next);
    if (!next) {
      generation.current += 1;
      audioRef.current?.pause();
      setIsNarrating(false);
      return;
    }
    void startScene(currentScene).then(() => setIsNarrating(true)).catch(() => setIsNarrating(false));
  }, [currentScene, startScene]);

  const scene = PROLOGUE_SCENES[currentScene];
  const visual = VISUAL_ELEMENTS[scene.visual];
  const isLastScene = currentScene === PROLOGUE_SCENES.length - 1;
  const progress = ((currentScene + 1) / PROLOGUE_SCENES.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground bg-starfield relative overflow-hidden mobile-content-pad">
      <audio ref={audioRef} data-testid="prologue-recording" preload="auto" onEnded={() => setIsNarrating(false)} />
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
          <span className="text-xs font-mono text-amber-400/80 tracking-wider">{t("prologue.title")}</span>
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
          <div key={scene.id} className="text-center max-w-lg">
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
            <h1 className="font-heading text-2xl md:text-3xl font-bold leading-tight mb-4 text-foreground">
              {scene.text}
            </h1>

            {/* Subtext */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {scene.subtext}
            </p>

            {/* DAVID narrating indicator */}
            {voiceOn && isNarrating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-1.5 mt-6"
              >
                <Volume2 className="w-3 h-3 text-amber-400/60 animate-pulse" />
                <span className="text-[9px] text-amber-400/60 font-mono">{t("prologue.davidNarrating")}</span>
              </motion.div>
            )}
          </div>
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
              {PROLOGUE_BEGIN_LABEL} 🔥
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
