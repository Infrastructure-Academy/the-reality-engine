import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  rotation: number;
  drift: number;
}

const COLORS = [
  "#f59e0b", "#ef4444", "#06b6d4", "#22c55e", "#a855f7",
  "#ec4899", "#3b82f6", "#f97316", "#fbbf24", "#34d399",
];

export function Confetti({ active, duration = 4000, particleCount = 60 }: ConfettiProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 100,
    }));
  }, [particleCount]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                x: `calc(${p.x}vw + ${p.drift}px)`,
                rotate: p.rotation + 720,
                opacity: [1, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size * (0.6 + Math.random() * 0.8),
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              }}
            />
          ))}

          {/* Center burst text */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 12 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-heading text-4xl md:text-5xl font-bold text-gold-gradient drop-shadow-lg"
              >
                FIELD COMPLETE
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-lg text-cyan-400 font-mono mt-2"
              >
                60/60 NODES ACTIVATED
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
