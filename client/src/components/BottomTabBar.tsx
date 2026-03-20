import { useLocation, Link } from "wouter";
import { Home, Flame, Rocket, GraduationCap, Trophy, Gamepad2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";  // .tsx file
import { useGamepad, type GamepadButtonName } from "@/hooks/useGamepad";
import { useCallback, useState, useEffect } from "react";

const TABS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore/1", label: "Explore", icon: Flame },
  { path: "/flight-deck", label: "Flight", icon: Rocket },
  { path: "/create", label: "Scholar", icon: GraduationCap },
  { path: "/leaderboard", label: "Board", icon: Trophy },
] as const;

export function BottomTabBar() {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [gamepadConnected, setGamepadConnected] = useState(false);

  const handleGamepadButton = useCallback(
    (button: GamepadButtonName) => {
      // Find current tab index
      const currentIdx = TABS.findIndex(
        (t) => location === t.path || (t.path !== "/" && location.startsWith(t.path.split("/").slice(0, 2).join("/")))
      );
      const idx = currentIdx === -1 ? 0 : currentIdx;

      if (button === "RB" || button === "DPAD_RIGHT") {
        const next = (idx + 1) % TABS.length;
        setLocation(TABS[next].path);
      } else if (button === "LB" || button === "DPAD_LEFT") {
        const prev = (idx - 1 + TABS.length) % TABS.length;
        setLocation(TABS[prev].path);
      } else if (button === "HOME") {
        setLocation("/");
      }
    },
    [location, setLocation]
  );

  const gamepad = useGamepad(handleGamepadButton);

  useEffect(() => {
    setGamepadConnected(gamepad.connected);
  }, [gamepad.connected]);

  if (!isMobile) return null;

  return (
    <>
      {/* Gamepad indicator */}
      {gamepadConnected && (
        <div className="fixed top-2 right-2 z-[60] flex items-center gap-1.5 bg-card/90 border border-green-500/40 rounded-full px-3 py-1.5 backdrop-blur-sm">
          <Gamepad2 className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] text-green-400 font-mono">CONNECTED</span>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.path === "/"
                ? location === "/"
                : location.startsWith(tab.path.split("/").slice(0, 2).join("/"));

            return (
              <Link key={tab.path} href={tab.path}>
                <button
                  className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-lg transition-all ${
                    isActive
                      ? "text-gold bg-gold/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_6px_rgba(212,168,67,0.5)]" : ""}`} />
                  <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind tab bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
