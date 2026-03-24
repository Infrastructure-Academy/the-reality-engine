/**
 * MilestoneOverlay — Full-screen celebration overlay for 25/50/75/100% milestones.
 * Addresses Jonathan Green's feedback: "juice up the feedback on clicks (sounds, visuals, progression hooks)"
 */

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles, Crown } from "lucide-react";

interface MilestoneOverlayProps {
  level: 25 | 50 | 75 | 100 | null;
  onDismiss: () => void;
  context?: string; // e.g. "Explorer Relay 3" or "Flight Deck"
}

const MILESTONE_CONFIG = {
  25: {
    icon: Star,
    title: "Quarter Mark!",
    subtitle: "25% Complete",
    gradient: "from-blue-500 to-cyan-400",
    borderColor: "border-blue-400/50",
    message: "You're building momentum — keep exploring!",
  },
  50: {
    icon: Sparkles,
    title: "Halfway There!",
    subtitle: "50% Complete",
    gradient: "from-amber-500 to-yellow-400",
    borderColor: "border-amber-400/50",
    message: "The pattern is emerging — can you see it?",
  },
  75: {
    icon: Trophy,
    title: "Three Quarters!",
    subtitle: "75% Complete",
    gradient: "from-purple-500 to-pink-400",
    borderColor: "border-purple-400/50",
    message: "Almost there — the full picture awaits!",
  },
  100: {
    icon: Crown,
    title: "Complete!",
    subtitle: "100% Discovered",
    gradient: "from-amber-400 via-yellow-300 to-amber-500",
    borderColor: "border-amber-300/60",
    message: "Every node activated. The Dearden Field is yours.",
  },
};

export function MilestoneOverlay({ level, onDismiss, context }: MilestoneOverlayProps) {
  if (!level) return null;
  const config = MILESTONE_CONFIG[level];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className={`relative max-w-sm mx-4 p-8 rounded-2xl border ${config.borderColor} bg-background/95 text-center`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow ring */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} opacity-10 blur-xl`} />

          {/* Icon with pulse */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: 2, duration: 0.6 }}
            className="relative z-10"
          >
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4`}>
              <Icon className="w-10 h-10 text-black" />
            </div>
          </motion.div>

          <h2 className={`relative z-10 font-heading text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-1`}>
            {config.title}
          </h2>
          <p className="relative z-10 text-sm text-muted-foreground font-mono mb-3">{config.subtitle}</p>
          {context && (
            <p className="relative z-10 text-xs text-muted-foreground/60 mb-3">{context}</p>
          )}
          <p className="relative z-10 text-sm text-foreground/80 italic mb-6">{config.message}</p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDismiss}
            className={`relative z-10 px-6 py-2.5 rounded-lg bg-gradient-to-r ${config.gradient} text-black font-heading font-bold tracking-wider text-sm`}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
