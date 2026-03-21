import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSoundMuted, toggleSoundMuted } from "@/hooks/useSoundEffects";

interface SoundToggleProps {
  /** Compact icon-only mode */
  compact?: boolean;
  /** Color variant */
  color?: "gold" | "cyan" | "default";
}

/**
 * Sound mute/unmute toggle button.
 * Reads from and writes to localStorage via useSoundEffects.
 * Listens for the custom event so multiple instances stay in sync.
 */
export function SoundToggle({ compact = false, color = "default" }: SoundToggleProps) {
  const [muted, setMuted] = useState(getSoundMuted);

  // Listen for changes from other components
  useEffect(() => {
    const handler = (e: Event) => {
      setMuted((e as CustomEvent).detail);
    };
    window.addEventListener("tre-sound-mute-change", handler);
    return () => window.removeEventListener("tre-sound-mute-change", handler);
  }, []);

  const toggle = useCallback(() => {
    const next = toggleSoundMuted();
    setMuted(next);
  }, []);

  const colorClass =
    color === "gold"
      ? muted ? "text-amber-400/40" : "text-amber-400"
      : color === "cyan"
        ? muted ? "text-cyan-400/40" : "text-cyan-400"
        : muted ? "text-muted-foreground/40" : "text-muted-foreground";

  if (compact) {
    return (
      <button
        onClick={toggle}
        className={`p-1 rounded transition-colors hover:bg-muted/50 ${colorClass}`}
        title={muted ? "Unmute sounds" : "Mute sounds"}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={`gap-1.5 ${colorClass}`}
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      <span className="text-xs hidden sm:inline">{muted ? "MUTED" : "SOUND"}</span>
    </Button>
  );
}
