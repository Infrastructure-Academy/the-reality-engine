/**
 * StreakIndicator — Shows a combo counter when the player makes rapid consecutive discoveries.
 * Addresses Jonathan Green's feedback: "add variety to interactions, progression hooks"
 */

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface StreakIndicatorProps {
  count: number;
  visible: boolean;
}

export function StreakIndicator({ count, visible }: StreakIndicatorProps) {
  if (!visible || count < 2) return null;

  const intensity = Math.min(count, 10);
  const colors = [
    "", "",
    "text-blue-400",    // 2
    "text-cyan-400",    // 3
    "text-green-400",   // 4
    "text-yellow-400",  // 5
    "text-amber-400",   // 6
    "text-orange-400",  // 7
    "text-red-400",     // 8
    "text-pink-400",    // 9
    "text-purple-400",  // 10+
  ];
  const color = colors[Math.min(intensity, colors.length - 1)];

  return (
    <AnimatePresence>
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 300 }}
        className="fixed top-20 right-4 z-40 pointer-events-none"
      >
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 border border-border/50 backdrop-blur-sm ${color}`}>
          {count >= 5 ? <Flame className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          <span className="font-mono font-bold text-sm">
            {count}x {count >= 7 ? "BLAZING" : count >= 5 ? "ON FIRE" : count >= 3 ? "COMBO" : "STREAK"}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
