/**
 * DiscoveryBurst — Animated particle burst that plays when a knowledge card is revealed.
 * Uses CSS-only animations for performance. Web-typed colors match the 5 Great Webs.
 * Addresses Jonathan Green's feedback: "juice up the feedback on clicks (sounds, visuals)"
 */

import { useEffect, useState } from "react";

interface DiscoveryBurstProps {
  trigger: number; // increment to trigger a new burst
  webColor?: string; // hex color from the web type
  x?: number; // optional position (relative to parent)
  y?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  color: string;
}

let particleId = 0;

export function DiscoveryBurst({ trigger, webColor = "#f59e0b", x = 50, y = 50 }: DiscoveryBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger <= 0) return;

    const count = 8 + Math.floor(Math.random() * 5);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: ++particleId,
        x,
        y,
        angle: (360 / count) * i + (Math.random() * 30 - 15),
        distance: 30 + Math.random() * 50,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.1,
        color: i % 3 === 0 ? webColor : i % 3 === 1 ? "#ffffff" : adjustBrightness(webColor, 40),
      });
    }

    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => setParticles([]), 800);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animation: `discoveryBurst 0.6s ease-out ${p.delay}s forwards`,
              transform: `translate(-50%, -50%)`,
              ["--tx" as any]: `${tx}px`,
              ["--ty" as any]: `${ty}px`,
              opacity: 0,
            }}
          />
        );
      })}
      <style>{`
        @keyframes discoveryBurst {
          0% { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1); }
          70% { opacity: 0.8; transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.3); }
        }
      `}</style>
    </div>
  );
}

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
