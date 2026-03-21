import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface NodeTooltipProps {
  visible: boolean;
  relayName: string;
  relayEmoji: string;
  relayNumber: number;
  webName: string;
  webColor: string;
  webIcon: string;
  isActivated: boolean;
  isMatchingWeb: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export function NodeTooltip({
  visible,
  relayName,
  relayEmoji,
  relayNumber,
  webName,
  webColor,
  webIcon,
  isActivated,
  isMatchingWeb,
  position,
  onClose,
}: NodeTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-[60]" onClick={onClose} onTouchEnd={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[70] w-56 p-3 rounded-xl border border-cyan-500/30 bg-background/95 backdrop-blur-md shadow-xl"
            style={{
              left: Math.min(position.x - 112, window.innerWidth - 240),
              top: Math.max(position.y - 120, 60),
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{relayEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-bold truncate">
                  R{relayNumber}: {relayName}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{webIcon}</span>
                  <p className="text-[10px] font-mono font-bold" style={{ color: webColor }}>
                    {webName} Web
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">Status:</span>
              {isActivated ? (
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                  ACTIVATED
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
                  INACTIVE
                </span>
              )}
            </div>

            {/* XP Value */}
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">XP Value:</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="font-mono font-bold text-gold-gradient">50,000</span>
              </div>
            </div>

            {/* Craft Affinity */}
            {isMatchingWeb && (
              <div className="mt-2 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-[10px] text-cyan-400 text-center font-mono">
                  Craft affinity bonus active
                </p>
              </div>
            )}

            {/* Node ID */}
            <p className="text-[9px] text-muted-foreground/50 font-mono mt-2 text-center">
              NODE {relayNumber}-{webName.charAt(0)} | TAP TO CLOSE
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
