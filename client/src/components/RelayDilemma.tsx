/**
 * RelayDilemma — "What Would You Do?" branching choice card.
 * Shown after the RelaySummaryCard when a relay is completed.
 * Player faces a historical dilemma with two choices.
 * Choices build a Decision Profile across 12 relays.
 *
 * Design source: GDP v2.1 Section 15.4
 * Inspired by: Murder on the Yangtze River, Underdog Detective
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RELAY_DILEMMAS, ARCHETYPES, type DilemmaChoice, type RelayDilemma as DilemmaType } from "@shared/relayDilemmas";
import { RELAYS } from "@shared/gameData";
import { Button } from "@/components/ui/button";
import { ChevronRight, Scale, Sparkles, Volume2 } from "lucide-react";
import { davidSpeak, davidStop, getVoiceEnabled } from "@/hooks/useDavidVoice";
import { trpc } from "@/lib/trpc";

interface RelayDilemmaProps {
  relayNumber: number;
  profileId: number | null;
  onComplete: () => void;
}

export function RelayDilemmaCard({ relayNumber, profileId, onComplete }: RelayDilemmaProps) {
  const [phase, setPhase] = useState<"loading" | "dilemma" | "response">("loading");
  const [selectedChoice, setSelectedChoice] = useState<DilemmaChoice | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const skipFired = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const dilemma = RELAY_DILEMMAS.find(d => d.relayNumber === relayNumber);
  const relay = RELAYS.find(r => r.number === relayNumber);
  const saveMutation = trpc.decisions.save.useMutation();

  // Fetch existing decisions to show profile
  const { data: existingDecisions, isLoading: decisionsLoading } = trpc.decisions.getForProfile.useQuery(
    { profileId: profileId! },
    { enabled: !!profileId }
  );

  // Check if already answered this relay's dilemma
  const alreadyAnswered = existingDecisions?.some(d => d.relayNumber === relayNumber);

  // Handle skip cases in useEffect (never during render)
  // Use ref for onComplete to avoid re-triggering when parent re-renders
  useEffect(() => {
    if (skipFired.current) return;

    // No dilemma content for this relay — skip
    if (!dilemma) {
      skipFired.current = true;
      setTimeout(() => onCompleteRef.current(), 0);
      return;
    }

    // Still loading decisions — wait
    if (profileId && decisionsLoading) return;

    // Already answered — skip
    if (alreadyAnswered) {
      skipFired.current = true;
      setTimeout(() => onCompleteRef.current(), 0);
      return;
    }

    // Ready to show dilemma
    setPhase("dilemma");
  }, [dilemma, alreadyAnswered, decisionsLoading, profileId]);

  const handleChoice = (choice: DilemmaChoice) => {
    if (!dilemma) return;
    setSelectedChoice(choice);
    setPhase("response");

    // Save to database
    if (profileId) {
      saveMutation.mutate({
        profileId,
        relayNumber,
        choiceId: choice.id,
        choiceLabel: choice.label,
        dilemmaTitle: dilemma.title,
        archetype: choice.archetype,
      });
    }

    // DAVID speaks the response
    if (getVoiceEnabled()) {
      setIsNarrating(true);
      setTimeout(() => {
        davidSpeak(choice.davidResponse, {
          rate: 0.82,
          pitch: 0.85,
          onEnd: () => setIsNarrating(false),
        });
      }, 500);
    }
  };

  const handleContinue = () => {
    davidStop();
    onCompleteRef.current();
  };

  const archetype = selectedChoice ? ARCHETYPES[selectedChoice.archetype] : null;

  // Loading state while checking decisions
  if (phase === "loading") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto p-6 rounded-2xl border border-amber-500/20 bg-card/50 backdrop-blur-sm text-center"
      >
        <Scale className="w-6 h-6 text-amber-400 mx-auto mb-3 animate-pulse" />
        <p className="text-xs font-mono text-amber-400/60 tracking-wider">PREPARING DILEMMA...</p>
      </motion.div>
    );
  }

  if (!dilemma) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-lg mx-auto"
    >
      <AnimatePresence mode="wait">
        {phase === "dilemma" && (
          <motion.div
            key="dilemma"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-card/50 backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono text-amber-400/80 tracking-wider uppercase">What Would You Do?</span>
            </div>

            {/* Dilemma title */}
            <h3 className="font-heading text-xl font-bold mb-2" style={{ color: relay?.color }}>
              {dilemma.title}
            </h3>

            {/* Scenario */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {dilemma.scenario}
            </p>

            {/* Two choices */}
            <div className="space-y-3">
              {dilemma.choices.map((choice, i) => (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left p-4 rounded-xl border border-border/50 hover:border-amber-500/40 bg-muted/20 hover:bg-muted/40 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <span className="text-sm font-bold text-amber-400">{String.fromCharCode(65 + i)}</span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground mb-1">{choice.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{choice.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Hint */}
            <p className="text-[10px] text-muted-foreground/40 text-center mt-4 font-mono">
              Your choices shape your civilisational archetype
            </p>
          </motion.div>
        )}

        {phase === "response" && selectedChoice && archetype && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl border border-amber-500/20 bg-card/50 backdrop-blur-sm"
          >
            {/* DAVID response header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">D</span>
              </div>
              <span className="text-xs font-mono text-amber-400/80 tracking-wider">DAVID RESPONDS</span>
              {isNarrating && (
                <Volume2 className="w-3 h-3 text-amber-400/60 animate-pulse ml-auto" />
              )}
            </div>

            {/* Your choice */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/30 mb-4">
              <p className="text-xs text-muted-foreground/60 mb-1">You chose:</p>
              <p className="text-sm font-bold text-foreground">{selectedChoice.label}</p>
            </div>

            {/* DAVID's spoken response */}
            <p className="text-sm text-foreground leading-relaxed mb-4 italic">
              "{selectedChoice.davidResponse}"
            </p>

            {/* Archetype reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-border/30"
              style={{ backgroundColor: `${archetype.color}10`, borderColor: `${archetype.color}30` }}
            >
              <span className="text-2xl">{archetype.emoji}</span>
              <div>
                <p className="text-xs text-muted-foreground/60">This choice aligns with</p>
                <p className="text-sm font-bold" style={{ color: archetype.color }}>{archetype.name}</p>
              </div>
              <Sparkles className="w-4 h-4 ml-auto" style={{ color: archetype.color }} />
            </motion.div>

            {/* Continue button */}
            <Button
              onClick={handleContinue}
              className="w-full mt-5 gap-2 font-heading tracking-wider bg-amber-600 hover:bg-amber-500 text-white"
            >
              Continue Journey
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
