import { useGamepad, type GamepadButtonName } from "@/hooks/useGamepad";
import { Gamepad2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useLocation } from "wouter";
import { useCallback } from "react";

/**
 * GamepadIndicator — Desktop-only controller status badge.
 * Also handles global gamepad navigation (Home button, Start for settings).
 * Mobile version is handled by BottomTabBar.
 */
export function GamepadIndicator() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();

  const handleButton = useCallback(
    (button: GamepadButtonName) => {
      if (button === "HOME") {
        setLocation("/");
      } else if (button === "START") {
        // Could open settings/pause menu in future
      }
    },
    [setLocation]
  );

  const gamepad = useGamepad(handleButton);

  // Mobile shows indicator in BottomTabBar
  if (isMobile || !gamepad.connected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-card/90 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm shadow-lg">
      <Gamepad2 className="w-4 h-4 text-green-400" />
      <div>
        <p className="text-xs text-green-400 font-mono">Controller Connected</p>
        <p className="text-[9px] text-muted-foreground truncate max-w-[200px]">{gamepad.id}</p>
      </div>
    </div>
  );
}
