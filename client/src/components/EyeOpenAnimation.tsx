/**
 * EyeOpenAnimation — Block 465
 * 
 * Full-screen overlay that plays on first visit:
 * 1. Dark screen with the iAAi eye logo centered
 * 2. Eye "opens" — iris scales up, gold light radiates outward
 * 3. Text fades in: "Open your eye."
 * 4. Overlay fades out, revealing the page beneath
 * 
 * localStorage-gated: plays once per device.
 * Click/tap dismisses early.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EYE_KEY = "iaai_eye_opened";
const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030220481/EPdHLKrneifLpbtrLUugQB/iaai-logo_4636799f.jpeg";

function hasSeenEye(): boolean {
  try {
    return localStorage.getItem(EYE_KEY) === "1";
  } catch {
    return false;
  }
}

function markEyeSeen(): void {
  try {
    localStorage.setItem(EYE_KEY, "1");
  } catch {
    // localStorage unavailable
  }
}

export function EyeOpenAnimation() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"closed" | "opening" | "text" | "done">("closed");

  useEffect(() => {
    if (hasSeenEye()) return;
    setShow(true);
    // Sequence: closed → opening → text → done
    const t1 = setTimeout(() => setPhase("opening"), 600);
    const t2 = setTimeout(() => setPhase("text"), 2000);
    const t3 = setTimeout(() => {
      setPhase("done");
      markEyeSeen();
    }, 4200);
    const t4 = setTimeout(() => setShow(false), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const dismiss = useCallback(() => {
    setPhase("done");
    markEyeSeen();
    setTimeout(() => setShow(false), 600);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "done" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black cursor-pointer"
          onClick={dismiss}
          role="button"
          aria-label="Dismiss intro animation"
        >
          {/* Radial gold glow behind the eye */}
          <motion.div
            className="absolute rounded-full"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={
              phase === "opening" || phase === "text" || phase === "done"
                ? { width: 500, height: 500, opacity: 0.3 }
                : {}
            }
            transition={{ duration: 1.8, ease: "easeOut" }}
            style={{
              background: "radial-gradient(circle, rgba(212,168,67,0.4) 0%, rgba(212,168,67,0) 70%)",
            }}
          />

          {/* The iAAi eye logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={
              phase === "closed"
                ? { scale: 0.6, opacity: 0.4 }
                : phase === "opening"
                ? { scale: 1.1, opacity: 1 }
                : phase === "text"
                ? { scale: 1, opacity: 1 }
                : { scale: 1.2, opacity: 0 }
            }
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <img
              src={LOGO_URL}
              alt="iAAi — Open your eye"
              className="w-28 h-28 md:w-36 md:h-36 object-contain"
              style={{
                filter: phase === "opening" || phase === "text"
                  ? "drop-shadow(0 0 20px rgba(212,168,67,0.6)) drop-shadow(0 0 40px rgba(212,168,67,0.3))"
                  : "none",
                transition: "filter 1s ease-out",
              }}
            />
          </motion.div>

          {/* "Open your eye." text */}
          <motion.p
            className="relative z-10 mt-6 font-heading text-lg md:text-xl tracking-[0.2em] text-amber-400/90"
            initial={{ opacity: 0, y: 10 }}
            animate={
              phase === "text"
                ? { opacity: 1, y: 0 }
                : phase === "done"
                ? { opacity: 0, y: -10 }
                : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.8 }}
          >
            Open your eye.
          </motion.p>

          {/* Subtle "tap to continue" */}
          <motion.p
            className="absolute bottom-12 text-[10px] tracking-widest uppercase text-white/20"
            initial={{ opacity: 0 }}
            animate={phase === "text" ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            tap to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
