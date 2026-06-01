/**
 * FireRelayGame — Relay 1 (Fire) Trial Gameplay
 * Cockpit HUD card interaction system for HICE score generation.
 * 
 * Gameplay flow:
 * 1. BRIEFING → DAVID introduces the Fire relay trial
 * 2. CARDS → Player interacts with 12 Fire cards (subset of 48)
 *    - Comparison challenges (I-axis via COG)
 *    - Empathy choices (E-axis via SOC+CTRL)
 *    - Creative connections (C-axis via TRD+ISI)
 * 3. RESULTS → HICE score, Seesaw ratio, FITS temperament
 * 
 * Source: iAAi Principia Tectonica · Ir. Nigel T. Dearden CEng
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Flame, Brain, Heart, Lightbulb, ArrowRight, Trophy,
  BarChart3, Zap, Timer, CheckCircle2, XCircle, Scale
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useT } from "@/contexts/LanguageContext";
import {
  FIRE_CARDS, FIRE_CARD_GROUPS, STAT_LABELS, STAT_FULL_NAMES,
  STAT_AXIS_MAP, getCardStat, generateTrialDeck,
  type FireCard, type FireCardStat, type ChallengeType
} from "@shared/fireCards";
import { playNodeActivationSound, playXpSound, hapticTap } from "@/hooks/useSoundEffects";
import { playMilestoneFanfare, hapticMilestone } from "@/hooks/useEngagementFx";

interface FireRelayGameProps {
  profileId: number;
  onComplete: (scores: { iScore: number; eScore: number; cScore: number; hScore: number }) => void;
  onExit: () => void;
}

type GamePhase = "briefing" | "playing" | "results";

interface CardChallenge {
  card: FireCard;
  type: ChallengeType;
  opponentCard?: FireCard; // For comparison challenges
  stat?: FireCardStat; // The stat being compared
  options?: { label: string; value: string; axis: "I" | "E" | "C"; points: number }[];
}

interface AxisScores {
  I: number;
  E: number;
  C: number;
}

export function FireRelayGame({ profileId, onComplete, onExit }: FireRelayGameProps) {
  const t = useT();
  const [phase, setPhase] = useState<GamePhase>("briefing");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [challenges, setChallenges] = useState<CardChallenge[]>([]);
  const [axisScores, setAxisScores] = useState<AxisScores>({ I: 0, E: 0, C: 0 });
  const [answered, setAnswered] = useState(false);
  const [lastResult, setLastResult] = useState<{ correct: boolean; points: number; axis: "I" | "E" | "C" } | null>(null);
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const cardStartRef = useRef<number>(Date.now());

  const startSession = trpc.fire.startSession.useMutation();
  const recordResponse = trpc.fire.recordCardResponse.useMutation();
  const calculateHICE = trpc.fire.calculateHICE.useMutation();

  // Generate challenges from trial deck
  const initializeChallenges = useCallback(() => {
    const deck = generateTrialDeck(12);
    const generated: CardChallenge[] = deck.map((card) => {
      const groupMeta = FIRE_CARD_GROUPS.find(g => g.key === card.group);
      
      // Determine challenge type based on group
      if (card.group === "ORIGIN" || card.group === "FUEL" || card.group === "ENGINE") {
        // Comparison challenge — pick a random opponent and a stat
        const opponents = FIRE_CARDS.filter(c => c.number !== card.number && c.group === card.group);
        const opponent = opponents.length > 0 
          ? opponents[Math.floor(Math.random() * opponents.length)]
          : FIRE_CARDS[Math.floor(Math.random() * FIRE_CARDS.length)];
        const stats: FireCardStat[] = ["heat", "scale", "ctrl", "cog"];
        const stat = stats[Math.floor(Math.random() * stats.length)];
        return { card, type: "comparison" as ChallengeType, opponentCard: opponent, stat };
      }
      
      if (card.group === "SIGNAL" || card.group === "RITUAL" || card.group === "MYTH") {
        // Empathy choice — SOC+CTRL feeds E-axis
        const options = generateEmpathyOptions(card);
        return { card, type: "empathy_choice" as ChallengeType, options };
      }
      
      if (card.group === "TRANSFORM" || card.group === "ECOLOGY") {
        // Creative connection — TRD+ISI feeds C-axis
        const options = generateCreativeOptions(card);
        return { card, type: "creative_connection" as ChallengeType, options };
      }
      
      if (card.group === "SCIENCE") {
        // Ranking challenge — COG feeds I-axis
        return { card, type: "ranking" as ChallengeType, options: generateRankingOptions(card) };
      }
      
      // HAZARD — ISI assessment
      return { card, type: "isi_assessment" as ChallengeType, options: generateISIOptions(card) };
    });
    
    setChallenges(generated);
  }, []);

  // Start the game
  const handleStart = useCallback(async () => {
    initializeChallenges();
    startTimeRef.current = Date.now();
    
    try {
      const result = await startSession.mutateAsync({ profileId });
      if (result.success && result.sessionId) {
        setSessionId(result.sessionId);
      }
    } catch (e) {
      console.warn("[FireRelay] Failed to start session, playing offline");
    }
    
    setPhase("playing");
    cardStartRef.current = Date.now();
  }, [profileId, initializeChallenges]);

  // Handle player response
  const handleResponse = useCallback(async (
    responseValue: any,
    isCorrect: boolean | null,
    axis: "I" | "E" | "C",
    points: number
  ) => {
    if (answered) return;
    setAnswered(true);
    
    const challenge = challenges[currentIndex];
    if (!challenge) return;

    const timeTaken = Date.now() - cardStartRef.current;
    
    // Update axis scores
    setAxisScores(prev => ({ ...prev, [axis]: prev[axis] + points }));
    setLastResult({ correct: isCorrect ?? true, points, axis });
    
    // Sound/haptic feedback
    if (isCorrect !== false) {
      playNodeActivationSound();
      hapticTap(15);
    }

    // Record to backend
    if (sessionId) {
      try {
        await recordResponse.mutateAsync({
          sessionId,
          profileId,
          cardNumber: challenge.card.number,
          cardGroup: challenge.card.group,
          cardName: challenge.card.name,
          responseType: challenge.type,
          responseValue,
          isCorrect,
          axisContribution: axis,
          pointsEarned: points,
          timeTakenMs: timeTaken,
        });
      } catch (e) {
        console.warn("[FireRelay] Failed to record response");
      }
    }
  }, [answered, challenges, currentIndex, sessionId, profileId]);

  // Advance to next card
  const handleNext = useCallback(() => {
    if (currentIndex >= challenges.length - 1) {
      // Session complete — calculate HICE
      handleCalculateHICE();
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setAnswered(false);
    setLastResult(null);
    cardStartRef.current = Date.now();
  }, [currentIndex, challenges.length]);

  // Calculate final HICE score
  const handleCalculateHICE = useCallback(async () => {
    setIsCalculating(true);
    const sessionDurationSec = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (sessionId) {
      try {
        const result = await calculateHICE.mutateAsync({
          sessionId,
          profileId,
          sessionDurationSec,
        });
        if (result.success) {
          setResults(result);
          playMilestoneFanfare(100);
          hapticMilestone();
          setPhase("results");
          onComplete(result.scores!);
        }
      } catch (e) {
        console.warn("[FireRelay] HICE calculation failed, computing locally");
        computeLocalResults(sessionDurationSec);
      }
    } else {
      computeLocalResults(sessionDurationSec);
    }
    setIsCalculating(false);
  }, [sessionId, profileId, axisScores]);

  // Local fallback calculation
  const computeLocalResults = useCallback((durationSec: number) => {
    const maxPerAxis = 1200; // 12 cards × 100 max
    const normalizeToIQ = (raw: number) => Math.min(160, 70 + (raw / maxPerAxis) * 90);
    const scaleAxis = (norm: number) => Math.max(0.1, Math.min(10.0, ((norm - 70) / 90) * 9.9 + 0.1));

    const iScore = scaleAxis(normalizeToIQ(axisScores.I));
    const eScore = scaleAxis(normalizeToIQ(axisScores.E));
    const cScore = Math.max(0.1, Math.min(10.0, scaleAxis(normalizeToIQ(axisScores.C)) * 0.8 + 0.1));
    const hScore = Math.round((iScore * eScore * cScore) * 1000) / 1000;
    const seesawRatio = cScore > 0 ? Math.round((iScore / cScore) * 100) / 100 : 99;
    let seesawState = "balanced";
    if (seesawRatio > 1.5) seesawState = "body_heavy";
    else if (seesawRatio < 0.7) seesawState = "mind_heavy";

    const localResults = {
      success: true,
      scores: { iScore, eScore, cScore, hScore },
      seesaw: { ratio: seesawRatio, state: seesawState },
      fitsType: "balanced",
      stats: { totalResponses: challenges.length, iCount: 0, eCount: 0, cCount: 0 },
    };
    setResults(localResults);
    playMilestoneFanfare(100);
    hapticMilestone();
    setPhase("results");
    onComplete(localResults.scores);
  }, [axisScores, challenges.length, onComplete]);

  const currentChallenge = challenges[currentIndex];
  const progress = challenges.length > 0 ? ((currentIndex + (answered ? 1 : 0)) / challenges.length) * 100 : 0;

  // ═══════════════════════════════════════════════════════════════
  // RENDER: BRIEFING PHASE
  // ═══════════════════════════════════════════════════════════════
  if (phase === "briefing") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          {/* DAVID Avatar */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <span className="text-2xl font-bold text-white">D</span>
          </div>
          
          <h2 className="font-heading text-2xl font-bold text-cyan-400 mb-2">
            {t("fire.briefingTitle")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {t("fire.briefingDesc")}
          </p>

          {/* Mission Parameters */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
              <Brain className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-blue-400">{t("fire.axisI")}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.axisIDesc")}</p>
            </div>
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-red-400">{t("fire.axisE")}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.axisEDesc")}</p>
            </div>
            <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
              <Lightbulb className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-green-400">{t("fire.axisC")}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.axisCDesc")}</p>
            </div>
          </div>

          {/* Card count + time estimate */}
          <div className="flex items-center justify-center gap-4 mb-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" /> {t("fire.cardCount")}</span>
            <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5 text-cyan-400" /> {t("fire.timeEstimate")}</span>
          </div>

          <Button
            onClick={handleStart}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-heading tracking-wider px-8 py-3 text-base shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            <Flame className="w-5 h-5 mr-2" /> {t("fire.startTrial")}
          </Button>

          <button onClick={onExit} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t("fire.returnToDeck")}
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: PLAYING PHASE
  // ═══════════════════════════════════════════════════════════════
  if (phase === "playing" && currentChallenge) {
    return (
      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-cyan-400">
              {t("fire.card")} {currentIndex + 1}/{challenges.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-blue-400">I:{axisScores.I}</span>
              <span className="text-[10px] font-mono text-red-400">E:{axisScores.E}</span>
              <span className="text-[10px] font-mono text-green-400">C:{axisScores.C}</span>
            </div>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Card Header */}
            <div className="rounded-t-xl border border-b-0 border-orange-500/30 bg-gradient-to-r from-orange-600/10 to-red-600/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-orange-400/60 uppercase tracking-wider">
                    {FIRE_CARD_GROUPS.find(g => g.key === currentChallenge.card.group)?.emoji} {t(`fire.group.${currentChallenge.card.group.toLowerCase()}`)}
                  </p>
                  <h3 className="font-heading text-lg font-bold text-foreground mt-0.5">
                    {currentChallenge.card.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground italic">{currentChallenge.card.latinName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{t("fire.age")}</p>
                  <p className="text-sm font-mono font-bold text-orange-400">{currentChallenge.card.age}</p>
                </div>
              </div>

              {/* Stat Bar Preview */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {(["heat", "ctrl", "soc", "cog"] as FireCardStat[]).map(stat => (
                  <div key={stat} className="text-center">
                    <p className="text-[8px] font-mono text-muted-foreground uppercase">{t(`fire.stat.${stat}`)}</p>
                    <div className="h-1 bg-muted rounded-full overflow-hidden mt-0.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${getCardStat(currentChallenge.card, stat)}%`,
                          backgroundColor: STAT_AXIS_MAP[stat] === "I" ? "#3b82f6" : STAT_AXIS_MAP[stat] === "E" ? "#ef4444" : STAT_AXIS_MAP[stat] === "C" ? "#22c55e" : "#94a3b8"
                        }}
                      />
                    </div>
                    <p className="text-[9px] font-mono mt-0.5">{getCardStat(currentChallenge.card, stat)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Area */}
            <div className="rounded-b-xl border border-t-0 border-orange-500/30 bg-card/50 p-4">
              {/* COMPARISON CHALLENGE */}
              {currentChallenge.type === "comparison" && currentChallenge.opponentCard && currentChallenge.stat && (
                <ComparisonChallenge
                  card={currentChallenge.card}
                  opponent={currentChallenge.opponentCard}
                  stat={currentChallenge.stat}
                  answered={answered}
                  onAnswer={handleResponse}
                  t={t}
                />
              )}

              {/* EMPATHY CHOICE */}
              {currentChallenge.type === "empathy_choice" && currentChallenge.options && (
                <ChoiceChallenge
                  card={currentChallenge.card}
                  options={currentChallenge.options}
                  answered={answered}
                  challengeLabel={t("fire.empathyPrompt")}
                  onAnswer={handleResponse}
                  t={t}
                />
              )}

              {/* CREATIVE CONNECTION */}
              {currentChallenge.type === "creative_connection" && currentChallenge.options && (
                <ChoiceChallenge
                  card={currentChallenge.card}
                  options={currentChallenge.options}
                  answered={answered}
                  challengeLabel={t("fire.creativePrompt")}
                  onAnswer={handleResponse}
                  t={t}
                />
              )}

              {/* RANKING / ISI ASSESSMENT */}
              {(currentChallenge.type === "ranking" || currentChallenge.type === "isi_assessment") && currentChallenge.options && (
                <ChoiceChallenge
                  card={currentChallenge.card}
                  options={currentChallenge.options}
                  answered={answered}
                  challengeLabel={currentChallenge.type === "ranking" ? t("fire.rankingPrompt") : t("fire.isiPrompt")}
                  onAnswer={handleResponse}
                  t={t}
                />
              )}

              {/* Result Feedback */}
              {answered && lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {lastResult.correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-400" />
                    )}
                    <span className="text-sm font-bold" style={{
                      color: lastResult.axis === "I" ? "#3b82f6" : lastResult.axis === "E" ? "#ef4444" : "#22c55e"
                    }}>
                      +{lastResult.points} {lastResult.axis}-{t("fire.axis")}
                    </span>
                  </div>
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1"
                  >
                    {currentIndex < challenges.length - 1 ? t("fire.next") : t("fire.finish")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Running Axis Bars */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {([
            { key: "I", label: t("fire.intelligence"), color: "#3b82f6", icon: Brain },
            { key: "E", label: t("fire.emotional"), color: "#ef4444", icon: Heart },
            { key: "C", label: t("fire.creative"), color: "#22c55e", icon: Lightbulb },
          ] as const).map(({ key, label, color, icon: Icon }) => (
            <div key={key} className="p-2 rounded-lg border border-border/30 bg-card/30">
              <div className="flex items-center gap-1 mb-1">
                <Icon className="w-3 h-3" style={{ color }} />
                <span className="text-[9px] font-mono uppercase" style={{ color }}>{label}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ width: `${Math.min(100, (axisScores[key] / 1200) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[9px] font-mono text-muted-foreground mt-0.5 text-right">{axisScores[key]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: RESULTS PHASE
  // ═══════════════════════════════════════════════════════════════
  if (phase === "results" && results) {
    const { scores, seesaw, fitsType } = results;
    return (
      <div className="px-4 py-8 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Trophy */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-gold-gradient mb-1">
            {t("fire.trialComplete")}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{t("fire.hiceCalculated")}</p>

          {/* HICE Score */}
          <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 mb-6">
            <p className="text-[10px] font-mono text-amber-400/60 uppercase tracking-wider mb-1">H = I × E × C</p>
            <p className="text-5xl font-heading font-bold text-gold-gradient">
              {scores.hScore.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t("fire.hiceRange")}</p>
          </div>

          {/* ICE Axis Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-center">
              <Brain className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-400">{scores.iScore.toFixed(1)}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.intelligence")}</p>
            </div>
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-center">
              <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-400">{scores.eScore.toFixed(1)}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.emotional")}</p>
            </div>
            <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5 text-center">
              <Lightbulb className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-400">{scores.cScore.toFixed(1)}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.creative")}</p>
            </div>
          </div>

          {/* Seesaw & FITS */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg border border-border/30 bg-card/30">
              <Scale className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-sm font-bold">{seesaw.ratio}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.seesawRatio")}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{
                color: seesaw.state === "balanced" ? "#22c55e" : seesaw.state === "body_heavy" ? "#3b82f6" : "#a855f7"
              }}>
                {t(`fire.seesaw.${seesaw.state}`)}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border/30 bg-card/30">
              <BarChart3 className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-sm font-bold capitalize">{fitsType}</p>
              <p className="text-[9px] text-muted-foreground">{t("fire.fitsType")}</p>
              <p className="text-[10px] font-mono text-amber-400 mt-0.5">FITS</p>
            </div>
          </div>

          {/* XP Earned */}
          <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-lg font-bold text-cyan-400 font-mono">+200,000 XP</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{t("fire.relayXP")}</p>
          </div>

          <Button
            onClick={onExit}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-heading tracking-wider px-8"
          >
            {t("fire.returnToDeck")}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading / calculating state
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
        <p className="text-sm text-muted-foreground">{isCalculating ? t("fire.calculating") : t("fire.loading")}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ComparisonChallenge({ card, opponent, stat, answered, onAnswer, t }: {
  card: FireCard;
  opponent: FireCard;
  stat: FireCardStat;
  answered: boolean;
  onAnswer: (value: any, correct: boolean | null, axis: "I" | "E" | "C", points: number) => void;
  t: (key: string) => string;
}) {
  const cardValue = getCardStat(card, stat);
  const opponentValue = getCardStat(opponent, stat);
  const [selected, setSelected] = useState<"card" | "opponent" | null>(null);

  const handleSelect = (choice: "card" | "opponent") => {
    if (answered) return;
    setSelected(choice);
    const isCorrect = choice === "card" ? cardValue >= opponentValue : opponentValue > cardValue;
    const points = isCorrect ? Math.round(card.cog * 0.8) : Math.round(card.cog * 0.3);
    onAnswer({ choice, stat, cardValue, opponentValue }, isCorrect, "I", points);
  };

  return (
    <div>
      <p className="text-sm font-bold text-foreground mb-1">{t("fire.comparisonTitle")}</p>
      <p className="text-xs text-muted-foreground mb-3">
        {t("fire.whichHigher")} <span className="font-bold text-blue-400">{t(`fire.stat.${stat}`)}</span>?
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSelect("card")}
          disabled={answered}
          className={`p-3 rounded-lg border text-left transition-all ${
            answered && selected === "card"
              ? cardValue >= opponentValue ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
              : selected === "card" ? "border-cyan-500 bg-cyan-500/10" : "border-border/30 hover:border-cyan-500/50"
          }`}
        >
          <p className="text-xs font-bold truncate">{card.name}</p>
          {answered && <p className="text-lg font-mono font-bold mt-1">{cardValue}</p>}
        </button>
        <button
          onClick={() => handleSelect("opponent")}
          disabled={answered}
          className={`p-3 rounded-lg border text-left transition-all ${
            answered && selected === "opponent"
              ? opponentValue > cardValue ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
              : selected === "opponent" ? "border-cyan-500 bg-cyan-500/10" : "border-border/30 hover:border-cyan-500/50"
          }`}
        >
          <p className="text-xs font-bold truncate">{opponent.name}</p>
          {answered && <p className="text-lg font-mono font-bold mt-1">{opponentValue}</p>}
        </button>
      </div>
    </div>
  );
}

function ChoiceChallenge({ card, options, answered, challengeLabel, onAnswer, t }: {
  card: FireCard;
  options: { label: string; value: string; axis: "I" | "E" | "C"; points: number }[];
  answered: boolean;
  challengeLabel: string;
  onAnswer: (value: any, correct: boolean | null, axis: "I" | "E" | "C", points: number) => void;
  t: (key: string) => string;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    const option = options[idx];
    onAnswer({ choice: option.value, cardName: card.name }, null, option.axis, option.points);
  };

  return (
    <div>
      <p className="text-sm font-bold text-foreground mb-3">{challengeLabel}</p>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={answered}
            className={`w-full p-3 rounded-lg border text-left transition-all text-sm ${
              selected === idx
                ? "border-cyan-500 bg-cyan-500/10"
                : "border-border/30 hover:border-cyan-500/50"
            }`}
          >
            <span className="text-foreground">{opt.label}</span>
            {answered && selected === idx && (
              <span className="ml-2 text-[10px] font-mono" style={{
                color: opt.axis === "I" ? "#3b82f6" : opt.axis === "E" ? "#ef4444" : "#22c55e"
              }}>
                +{opt.points} {opt.axis}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHALLENGE GENERATORS
// ═══════════════════════════════════════════════════════════════

function generateEmpathyOptions(card: FireCard) {
  const socScore = card.soc;
  const ctrlScore = card.ctrl;
  const basePoints = Math.round((socScore + ctrlScore) / 2 * 0.6);

  // Generate contextual empathy choices based on card group
  const choices = getEmpathyChoices(card);
  return choices.map((choice, i) => ({
    label: choice.text,
    value: choice.id,
    axis: "E" as const,
    points: i === 0 ? basePoints + 20 : i === 1 ? basePoints + 10 : basePoints,
  }));
}

function generateCreativeOptions(card: FireCard) {
  const trdScore = card.trd;
  const isiScore = card.isi;
  const basePoints = Math.round((trdScore + isiScore / 3) / 2 * 0.5);

  const choices = getCreativeChoices(card);
  return choices.map((choice, i) => ({
    label: choice.text,
    value: choice.id,
    axis: "C" as const,
    points: i === 0 ? basePoints + 25 : i === 1 ? basePoints + 15 : basePoints + 5,
  }));
}

function generateRankingOptions(card: FireCard) {
  const cogScore = card.cog;
  const basePoints = Math.round(cogScore * 0.7);

  const choices = getRankingChoices(card);
  return choices.map((choice, i) => ({
    label: choice.text,
    value: choice.id,
    axis: "I" as const,
    points: i === 0 ? basePoints + 20 : i === 1 ? basePoints + 10 : basePoints,
  }));
}

function generateISIOptions(card: FireCard) {
  const isiScore = card.isi;
  const basePoints = Math.round(isiScore / 3 * 0.5);

  const choices = getISIChoices(card);
  return choices.map((choice, i) => ({
    label: choice.text,
    value: choice.id,
    axis: "C" as const,
    points: i === 0 ? basePoints + 30 : i === 1 ? basePoints + 15 : basePoints,
  }));
}

// ─── Contextual choice generators ───

function getEmpathyChoices(card: FireCard) {
  // Generate empathy-focused choices based on the card's social/cultural context
  const templates: Record<string, { text: string; id: string }[]> = {
    SIGNAL: [
      { text: "Consider how this connected communities across distance", id: "community_connection" },
      { text: "Reflect on the emotional power of shared symbols", id: "shared_symbols" },
      { text: "Think about who was excluded from this signal", id: "exclusion" },
    ],
    RITUAL: [
      { text: "Honour the grief and healing this practice enabled", id: "grief_healing" },
      { text: "Recognise the community bonds strengthened through ritual", id: "community_bonds" },
      { text: "Consider how this ritual evolved across cultures", id: "cultural_evolution" },
    ],
    MYTH: [
      { text: "Understand why humans needed this story to explain fire", id: "human_need" },
      { text: "Connect the myth to modern attitudes about technology", id: "modern_attitudes" },
      { text: "Consider the warning embedded in this narrative", id: "embedded_warning" },
    ],
  };
  return templates[card.group] || [
    { text: "Consider the human impact of this phenomenon", id: "human_impact" },
    { text: "Reflect on who benefited and who suffered", id: "benefit_suffering" },
    { text: "Think about the social changes this caused", id: "social_changes" },
  ];
}

function getCreativeChoices(card: FireCard) {
  const templates: Record<string, { text: string; id: string }[]> = {
    TRANSFORM: [
      { text: "Connect this to a modern manufacturing process", id: "modern_manufacturing" },
      { text: "Imagine how this could be reinvented sustainably", id: "sustainable_reinvention" },
      { text: "Link this transformation to another relay", id: "cross_relay_link" },
    ],
    ECOLOGY: [
      { text: "Design a system that mimics this natural process", id: "biomimicry" },
      { text: "Propose how this knowledge could prevent disaster", id: "disaster_prevention" },
      { text: "Connect this to urban planning challenges", id: "urban_planning" },
    ],
  };
  return templates[card.group] || [
    { text: "Propose an innovative application of this principle", id: "innovative_application" },
    { text: "Connect this to infrastructure you see daily", id: "daily_infrastructure" },
    { text: "Imagine teaching this concept to a younger student", id: "teaching_concept" },
  ];
}

function getRankingChoices(card: FireCard) {
  return [
    { text: "This phenomenon demonstrates fundamental scientific principles", id: "fundamental_science" },
    { text: "This phenomenon has practical engineering applications", id: "engineering_applications" },
    { text: "This phenomenon primarily serves as a teaching example", id: "teaching_example" },
  ];
}

function getISIChoices(card: FireCard) {
  return [
    { text: "High infrastructure significance — shaped civilisation permanently", id: "high_isi" },
    { text: "Moderate significance — important but replaceable", id: "moderate_isi" },
    { text: "Low significance — destructive without lasting positive infrastructure", id: "low_isi" },
  ];
}
