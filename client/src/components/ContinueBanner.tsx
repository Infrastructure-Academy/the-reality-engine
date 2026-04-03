import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Flame, Dices, Sword, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RELAYS } from "@shared/gameData";

type SavedProgress = {
  mode: string;
  label: string;
  icon: typeof Flame;
  color: string;
  href: string;
  detail: string;
};

function detectProgress(): SavedProgress | null {
  try {
    const hasGuest = localStorage.getItem("tre_guest_id");
    if (!hasGuest) return null;

    // Check Spinner progress
    const spinnerCollection = localStorage.getItem("tre_spinner_collection");
    if (spinnerCollection) {
      const collected = JSON.parse(spinnerCollection) as number[];
      if (collected.length > 0) {
        return {
          mode: "spinner",
          label: "Relay Spinner",
          icon: Dices,
          color: "#3b82f6",
          href: "/explore/spinner",
          detail: `${collected.length}/12 relays collected`,
        };
      }
    }

    // Check Dungeon Crawl progress
    const dungeonCreated = localStorage.getItem("tre_dungeon_created");
    if (dungeonCreated === "true") {
      const dungeonRelay = parseInt(localStorage.getItem("tre_dungeon_relay") || "0", 10);
      const relayName = RELAYS[dungeonRelay]?.name || "Fire";
      return {
        mode: "dungeon",
        label: "Dungeon Crawl",
        icon: Sword,
        color: "#a855f7",
        href: "/explore/dungeon",
        detail: `Relay ${dungeonRelay + 1}: ${relayName}`,
      };
    }

    // Check Grey Matter progress
    const gmMissions = localStorage.getItem("tre_gm_missions");
    if (gmMissions) {
      const missions = JSON.parse(gmMissions);
      const completed = Object.values(missions).filter(Boolean).length;
      if (completed > 0) {
        return {
          mode: "greymatter",
          label: "Grey Matter",
          icon: Brain,
          color: "#6b7280",
          href: "/explore/grey-matter",
          detail: `${completed} missions completed`,
        };
      }
    }

    // Check if prologue was seen (implies Classic Explorer was started)
    const prologueSeen = localStorage.getItem("tre_prologue_seen");
    if (prologueSeen === "true") {
      return {
        mode: "classic",
        label: "Classic Explorer",
        icon: Flame,
        color: "#ef4444",
        href: "/explore/1",
        detail: "Continue your odyssey",
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function ContinueBanner() {
  const [progress, setProgress] = useState<SavedProgress | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed this session
    if (sessionStorage.getItem("tre_continue_dismissed") === "1") {
      setDismissed(true);
      return;
    }
    setProgress(detectProgress());
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("tre_continue_dismissed", "1");
  };

  if (!progress || dismissed) return null;

  const Icon = progress.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="relative z-10 mb-4"
      >
        <div
          className="relative rounded-xl border px-4 py-3 flex items-center gap-3 backdrop-blur-sm"
          style={{
            borderColor: `${progress.color}40`,
            background: `linear-gradient(135deg, ${progress.color}15, transparent)`,
          }}
        >
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${progress.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: progress.color }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-heading tracking-wide text-foreground">
              Welcome back — continue your journey?
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {progress.label} · {progress.detail}
            </p>
          </div>

          {/* Continue Button */}
          <Link href={progress.href}>
            <Button
              size="sm"
              className="shrink-0 gap-1.5 font-heading tracking-wider text-xs text-white"
              style={{ backgroundColor: progress.color }}
            >
              <Play className="w-3 h-3" /> Continue
            </Button>
          </Link>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="absolute top-1.5 right-1.5 p-1 rounded-full text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
