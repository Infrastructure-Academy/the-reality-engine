import { useState, useEffect, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVoiceEnabled, toggleVoiceEnabled, isSpeechAvailable } from "@/hooks/useDavidVoice";

interface VoiceToggleProps {
  /** Compact icon-only mode */
  compact?: boolean;
  /** Color variant */
  color?: "gold" | "cyan" | "default";
}

/**
 * DAVID voice narration toggle button.
 * Only renders if Web Speech API is available.
 * Reads from and writes to localStorage via useDavidVoice.
 */
export function VoiceToggle({ compact = false, color = "default" }: VoiceToggleProps) {
  const [enabled, setEnabled] = useState(getVoiceEnabled);

  // Don't render if speech synthesis is unavailable
  if (!isSpeechAvailable()) return null;

  // Listen for changes from other components
  useEffect(() => {
    const handler = (e: Event) => {
      setEnabled((e as CustomEvent).detail);
    };
    window.addEventListener("tre-voice-change", handler);
    return () => window.removeEventListener("tre-voice-change", handler);
  }, []);

  const toggle = useCallback(() => {
    const next = toggleVoiceEnabled();
    setEnabled(next);
  }, []);

  const colorClass =
    color === "gold"
      ? enabled ? "text-amber-400" : "text-amber-400/40"
      : color === "cyan"
        ? enabled ? "text-cyan-400" : "text-cyan-400/40"
        : enabled ? "text-muted-foreground" : "text-muted-foreground/40";

  if (compact) {
    return (
      <button
        onClick={toggle}
        className={`p-1 rounded transition-colors hover:bg-muted/50 ${colorClass}`}
        title={enabled ? "Disable DAVID voice" : "Enable DAVID voice"}
        aria-label={enabled ? "Disable DAVID voice narration" : "Enable DAVID voice narration"}
      >
        {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={`gap-1.5 ${colorClass}`}
      title={enabled ? "Disable DAVID voice" : "Enable DAVID voice"}
    >
      {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      <span className="text-xs hidden sm:inline">{enabled ? "VOICE" : "MUTED"}</span>
    </Button>
  );
}
