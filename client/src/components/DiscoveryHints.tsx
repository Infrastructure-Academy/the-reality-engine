/**
 * UX Discovery Principle — iCard UX-001, Block 415
 * 
 * Four patterns for mobile-first hidden navigation discovery:
 * PULSE  — Gold ring animation on bottom tab bar (ANNOUNCE)
 * SWIPE  — Overlay arrow on horizontal scroll containers (GUIDE)
 * LABEL  — Temporary text label on floating nav (ORIENT)
 * GLOW   — Border pulse on recommended CTA (ATTRACT)
 * 
 * Rules:
 * - One-time only (localStorage gated)
 * - Auto-dismiss after 5-6s
 * - Mobile-only (≤768px)
 * - No recurring CTAs
 * - Dismiss on interaction
 */

import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/useMobile";

const HINT_KEY = "ux_discovery_seen";

/** Check if hints have already been shown */
function hasSeenHints(): boolean {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Mark hints as seen */
function markHintsSeen(): void {
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {
    // localStorage unavailable
  }
}

// ─── CSS injected once ───
const DISCOVERY_CSS = `
@keyframes discovery-ring-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(212,168,67,0.6); }
  50%  { box-shadow: 0 0 0 10px rgba(212,168,67,0); }
  100% { box-shadow: 0 0 0 0 rgba(212,168,67,0); }
}

@keyframes swipe-hint-slide {
  0%   { transform: translateX(0) translateY(-50%); opacity: 0.9; }
  50%  { transform: translateX(-20px) translateY(-50%); opacity: 0.5; }
  100% { transform: translateX(0) translateY(-50%); opacity: 0; }
}

@keyframes glow-border-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(6,182,212,0.5); }
  50%  { box-shadow: 0 0 0 8px rgba(6,182,212,0); }
  100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }
}

@keyframes hint-fade-out {
  0%   { opacity: 0.95; }
  75%  { opacity: 0.95; }
  100% { opacity: 0; }
}

.discovery-pulse-nav {
  animation: discovery-ring-pulse 1.5s ease-out 3;
}

.discovery-glow-cta {
  animation: glow-border-pulse 1.5s ease-out 3;
}
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  const style = document.createElement("style");
  style.textContent = DISCOVERY_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

// ─── PULSE: Bottom Tab Bar ───
function applyPulseToTabBar() {
  const nav = document.querySelector("nav.fixed.bottom-0");
  if (!nav) return;
  nav.classList.add("discovery-pulse-nav");
  const cleanup = () => nav.classList.remove("discovery-pulse-nav");
  nav.addEventListener("click", cleanup, { once: true });
  setTimeout(cleanup, 5000);
}

// ─── GLOW: Recommended CTA (Flight Deck) ───
function applyGlowToCTA() {
  // Find the "LAUNCH FLIGHT DECK" button — it's inside the recommended card
  const buttons = document.querySelectorAll("button");
  let target: Element | null = null;
  buttons.forEach((btn) => {
    if (btn.textContent?.includes("LAUNCH FLIGHT DECK")) {
      target = btn;
    }
  });
  if (!target) return;
  (target as HTMLElement).classList.add("discovery-glow-cta");
  const cleanup = () => (target as HTMLElement).classList.remove("discovery-glow-cta");
  (target as HTMLElement).addEventListener("click", cleanup, { once: true });
  setTimeout(cleanup, 5000);
}

// ─── LABEL: Bottom Tab Bar temporary label ───
function applyLabelToTabBar() {
  const nav = document.querySelector("nav.fixed.bottom-0");
  if (!nav) return;
  
  const label = document.createElement("div");
  label.textContent = "TAP TO NAVIGATE";
  label.style.cssText = `
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(212,168,67,0.9);
    color: #000;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 4px 12px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 60;
    animation: hint-fade-out 6s ease-out forwards;
  `;
  (nav as HTMLElement).style.position = "relative";
  nav.appendChild(label);
  
  const cleanup = () => { if (label.parentNode) label.remove(); };
  nav.addEventListener("click", cleanup, { once: true });
  setTimeout(cleanup, 6000);
}

// ─── SWIPE: Video carousel hint (if horizontal scroll exists) ───
function applySwipeHint() {
  // Look for horizontal scroll containers — the relay links flex-wrap
  const relayContainer = document.querySelector(".flex.flex-wrap.justify-center.gap-2");
  if (!relayContainer) return;
  
  // Check if it overflows horizontally on mobile
  const el = relayContainer as HTMLElement;
  if (el.scrollWidth <= el.clientWidth) return;
  
  const arrow = document.createElement("div");
  arrow.innerHTML = `
    <div style="display:flex;align-items:center;gap:4px;">
      <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:rgba(212,168,67,0.9);">SWIPE</span>
      <span style="font-size:16px;color:rgba(212,168,67,0.9);">→</span>
    </div>
  `;
  arrow.style.cssText = `
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 10;
    animation: swipe-hint-slide 1.2s ease-in-out 3 forwards;
  `;
  
  el.style.position = "relative";
  el.appendChild(arrow);
  
  const cleanup = () => { if (arrow.parentNode) arrow.remove(); };
  el.addEventListener("scroll", cleanup, { once: true });
  el.addEventListener("touchstart", cleanup, { once: true });
  setTimeout(cleanup, 5000);
}

// ─── Main Component ───
export function DiscoveryHints() {
  const isMobile = useIsMobile();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Gate: mobile-only, first-visit-only
    if (!isMobile || applied || hasSeenHints()) return;

    injectCSS();

    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      applyPulseToTabBar();
      applyLabelToTabBar();
      applyGlowToCTA();
      applySwipeHint();
      setApplied(true);

      // Mark as seen after 10 seconds
      setTimeout(markHintsSeen, 10000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMobile, applied]);

  // This component renders nothing — it only applies DOM effects
  return null;
}
