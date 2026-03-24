/**
 * RelaySummaryCard — Shown between relay completions to summarise what was discovered.
 * Breaks the tap-reveal monotony with a reflective pause and progress context.
 * Addresses Jonathan Green's feedback: "introduce meaningful choices that affect the story faster"
 */

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Sparkles, Trophy, MessageSquarePlus, Volume2 } from "lucide-react";
import { RELAYS } from "@shared/gameData";
import { Button } from "@/components/ui/button";
import { narrateRelaySummary } from "@/hooks/useDavidVoice";
import { getVoiceEnabled } from "@/hooks/useDavidVoice";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface RelaySummaryCardProps {
  relayNumber: number;
  inventionsFound: number;
  totalInventions: number;
  xpEarned: number;
  timeSpent?: number; // seconds
  onContinue: () => void;
  nextRelayNumber?: number;
}

export function RelaySummaryCard({
  relayNumber,
  inventionsFound,
  totalInventions,
  xpEarned,
  timeSpent,
  onContinue,
  nextRelayNumber,
}: RelaySummaryCardProps) {
  const relay = RELAYS.find((r) => r.number === relayNumber);
  const nextRelay = nextRelayNumber ? RELAYS.find((r) => r.number === nextRelayNumber) : null;
  const completionPct = totalInventions > 0 ? Math.round((inventionsFound / totalInventions) * 100) : 0;
  const isPerfect = completionPct === 100;
  const [narrated, setNarrated] = useState(false);

  // DAVID narrates a unique line when the summary card appears
  useEffect(() => {
    if (!narrated) {
      // Small delay so the card animation plays first
      const timer = setTimeout(() => {
        narrateRelaySummary(relayNumber, inventionsFound, totalInventions);
        setNarrated(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [relayNumber, inventionsFound, totalInventions, narrated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${relay?.color}20`, border: `1px solid ${relay?.color}40` }}
        >
          {relay?.emoji}
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">Relay {relayNumber} Complete</h3>
          <p className="text-xs text-muted-foreground">{relay?.name} — {relay?.subtitle}</p>
        </div>
        {isPerfect && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: 2, duration: 0.4 }}
          >
            <Trophy className="w-6 h-6 text-amber-400 ml-auto" />
          </motion.div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-muted/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Found</p>
          <p className="text-lg font-bold font-mono" style={{ color: relay?.color }}>
            {inventionsFound}/{totalInventions}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">XP Earned</p>
          <p className="text-lg font-bold font-mono text-gold-gradient">
            +{xpEarned.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</p>
          <p className={`text-lg font-bold font-mono ${isPerfect ? "text-amber-400" : "text-foreground"}`}>
            {completionPct}%
          </p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: relay?.color }}
        />
      </div>

      {/* Fun fact / reflection prompt */}
      <div className="p-3 rounded-lg bg-muted/20 border border-border/30 mb-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isPerfect
              ? `Perfect discovery! You found every invention in the ${relay?.name} relay. The ${relay?.webType} web reveals its secrets to the persistent explorer.`
              : `You discovered ${inventionsFound} of ${totalInventions} inventions. Return later to uncover what you missed — each relay holds hidden connections.`
            }
          </p>
        </div>
      </div>

      {/* Continue button */}
      <Button
        onClick={onContinue}
        className="w-full font-heading tracking-wider"
        style={{ backgroundColor: nextRelay?.color || relay?.color }}
      >
        {nextRelay ? (
          <>
            Continue to {nextRelay.emoji} {nextRelay.name}
            <ChevronRight className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            All Relays Complete!
          </>
        )}
      </Button>

      {timeSpent !== undefined && timeSpent > 0 && (
        <p className="text-[10px] text-muted-foreground/50 text-center mt-2 font-mono">
          Time: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </p>
      )}

      {/* DAVID voice indicator */}
      {getVoiceEnabled() && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Volume2 className="w-3 h-3 text-amber-400/60 animate-pulse" />
          <span className="text-[9px] text-amber-400/60 font-mono">DAVID NARRATING</span>
        </div>
      )}

      {/* Give Feedback link */}
      {!nextRelayNumber && (
        <Link href="/appraisal">
          <div className="mt-3 p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-pointer flex items-center gap-2 justify-center">
            <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium">Share Your Feedback</span>
          </div>
        </Link>
      )}
    </motion.div>
  );
}
