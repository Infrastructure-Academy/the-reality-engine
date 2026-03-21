import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface XpCounterProps {
  /** Current total XP value */
  value: number;
  /** Label shown below the number */
  label?: string;
  /** Compact mode for tight headers */
  compact?: boolean;
  /** Color theme — gold for Explorer, cyan for Flight Deck */
  color?: "gold" | "cyan";
}

/**
 * Animated XP counter with pinball-machine rolling digits.
 * Pulses and glows when the value increases.
 */
export function XpCounter({ value, label = "XP", compact = false, color = "gold" }: XpCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  const [delta, setDelta] = useState(0);
  const prevValue = useRef(value);
  const animFrame = useRef<number>(0);

  // Animate the counter rolling up
  useEffect(() => {
    const prev = prevValue.current;
    const target = value;
    prevValue.current = value;

    if (target === prev) return;

    // Show delta popup
    const diff = target - prev;
    if (diff > 0) {
      setDelta(diff);
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 800);
      setTimeout(() => setDelta(0), 1500);
    }

    // Rolling animation
    const startTime = performance.now();
    const duration = Math.min(1200, Math.max(300, Math.abs(diff) / 100));

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(prev + (target - prev) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        animFrame.current = requestAnimationFrame(animate);
      }
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [value]);

  const formattedValue = useMemo(() => {
    if (displayValue >= 1_000_000) return `${(displayValue / 1_000_000).toFixed(1)}M`;
    if (displayValue >= 100_000) return `${Math.floor(displayValue / 1000)}K`;
    if (displayValue >= 10_000) return `${(displayValue / 1000).toFixed(1)}K`;
    return displayValue.toLocaleString();
  }, [displayValue]);

  const formattedDelta = useMemo(() => {
    if (delta >= 1000) return `+${(delta / 1000).toFixed(0)}K`;
    return `+${delta.toLocaleString()}`;
  }, [delta]);

  const colorClasses = color === "cyan"
    ? {
        text: "text-cyan-400",
        glow: "shadow-[0_0_12px_rgba(6,182,212,0.5)]",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/30",
        deltaText: "text-cyan-300",
      }
    : {
        text: "text-amber-400",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.5)]",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        deltaText: "text-amber-300",
      };

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1">
        <Zap className={`w-3 h-3 ${colorClasses.text} ${isPulsing ? "animate-pulse" : ""}`} />
        <motion.span
          className={`font-mono text-xs font-bold ${colorClasses.text} tabular-nums`}
          animate={isPulsing ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {formattedValue}
        </motion.span>
        <AnimatePresence>
          {delta > 0 && (
            <motion.span
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -14 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8 }}
              className={`absolute -top-1 right-0 text-[10px] font-bold ${colorClasses.deltaText} pointer-events-none whitespace-nowrap`}
            >
              {formattedDelta}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col items-center">
      <motion.div
        className={`
          flex items-center gap-1.5 px-3 py-1 rounded-lg border
          ${colorClasses.bg} ${colorClasses.border}
          ${isPulsing ? colorClasses.glow : ""}
          transition-shadow duration-300
        `}
        animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Zap className={`w-4 h-4 ${colorClasses.text} ${isPulsing ? "animate-pulse" : ""}`} />
        <span className={`font-mono text-lg font-bold ${colorClasses.text} tabular-nums tracking-tight`}>
          {formattedValue}
        </span>
      </motion.div>

      {label && (
        <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-0.5">{label}</span>
      )}

      {/* Delta popup */}
      <AnimatePresence>
        {delta > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -36, scale: 0.6 }}
            transition={{ duration: 1 }}
            className={`absolute -top-2 text-sm font-bold ${colorClasses.deltaText} pointer-events-none`}
          >
            {formattedDelta}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
