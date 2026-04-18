import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const I_MEANINGS = [
  { word: "individual", color: "text-amber-300" },
  { word: "infrastructure", color: "text-amber-400" },
  { word: "information", color: "text-amber-300" },
  { word: "intelligence", color: "text-amber-400" },
  { word: "infostructure", color: "text-amber-300" },
  { word: "integration", color: "text-amber-400" },
  { word: "impact", color: "text-gold font-bold" },
];

/**
 * BrandI — the lowercase 'i' with meaning cascade tooltip.
 * Hover (desktop) or tap (mobile) reveals the 7 meanings.
 * Renders as an inline <span> so it can replace the existing .brand-i spans.
 *
 * Usage: <BrandI />GO  →  renders as "iGO" with tooltip on the 'i'
 */
export function BrandI({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <span
      ref={containerRef}
      className={`brand-i relative inline-block cursor-pointer ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleTap}
      role="button"
      aria-label="The lowercase i — tap to reveal its meaning"
      tabIndex={0}
    >
      {/* The 'i' character */}
      <span className="relative z-10 transition-all duration-300" style={{
        textShadow: open ? "0 0 8px rgba(212,168,67,0.6)" : "none",
      }}>
        i
      </span>

      {/* Tooltip cascade */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[200] pointer-events-auto"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[oklch(0.18_0.02_85)] mx-auto" />

            {/* Card */}
            <div className="bg-[oklch(0.18_0.02_85)] border border-gold/30 rounded-lg px-4 py-3 min-w-[180px] shadow-lg shadow-gold/10">
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold/60 mb-2 text-center whitespace-nowrap">
                the eye carries
              </p>
              <div className="space-y-0.5">
                {I_MEANINGS.map((m, idx) => (
                  <motion.div
                    key={m.word}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-gold/40 text-xs font-mono">i</span>
                    <span className={`text-xs tracking-wide ${m.color}`}>
                      {m.word}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gold/15">
                <p className="text-[8px] text-gold/40 text-center italic">
                  reclaiming the i
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
