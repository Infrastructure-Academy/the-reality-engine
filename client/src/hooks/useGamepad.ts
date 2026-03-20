import { useEffect, useRef, useCallback, useState } from "react";

// Standard Gamepad Button Mapping (mapping === "standard")
export const GAMEPAD_BUTTONS = {
  A: 0,        // Cross (PS) / A (Xbox) — Confirm
  B: 1,        // Circle (PS) / B (Xbox) — Back
  X: 2,        // Square (PS) / X (Xbox) — Action / DAVID toggle
  Y: 3,        // Triangle (PS) / Y (Xbox) — Menu / Info
  LB: 4,       // L1 / LB — Previous
  RB: 5,       // R1 / RB — Next
  LT: 6,       // L2 / LT — Zoom out
  RT: 7,       // R2 / RT — Discover / Zoom in
  BACK: 8,     // Share / Back
  START: 9,    // Options / Start — Pause
  L3: 10,      // Left stick press
  R3: 11,      // Right stick press
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
  HOME: 16,    // PS / Guide — Home
} as const;

export type GamepadButtonName = keyof typeof GAMEPAD_BUTTONS;

export interface GamepadState {
  connected: boolean;
  id: string;
  axes: { lx: number; ly: number; rx: number; ry: number };
  buttons: Record<GamepadButtonName, boolean>;
}

const DEAD_ZONE = 0.4;

function applyDeadZone(value: number): number {
  return Math.abs(value) < DEAD_ZONE ? 0 : value;
}

const defaultState: GamepadState = {
  connected: false,
  id: "",
  axes: { lx: 0, ly: 0, rx: 0, ry: 0 },
  buttons: Object.fromEntries(
    Object.keys(GAMEPAD_BUTTONS).map((k) => [k, false])
  ) as Record<GamepadButtonName, boolean>,
};

type ButtonHandler = (button: GamepadButtonName) => void;

/**
 * useGamepad — React hook for Web Gamepad API
 * Polls connected gamepad each frame, returns current state,
 * and fires onButtonPress callback on rising-edge presses.
 */
export function useGamepad(onButtonPress?: ButtonHandler) {
  const [state, setState] = useState<GamepadState>(defaultState);
  const prevButtonsRef = useRef<Record<number, boolean>>({});
  const rafRef = useRef<number>(0);
  const onButtonPressRef = useRef(onButtonPress);
  onButtonPressRef.current = onButtonPress;

  const poll = useCallback(() => {
    const gamepads = navigator.getGamepads?.();
    if (!gamepads) {
      rafRef.current = requestAnimationFrame(poll);
      return;
    }

    // Use first connected gamepad
    let gp: Gamepad | null = null;
    for (const pad of gamepads) {
      if (pad && pad.connected) {
        gp = pad;
        break;
      }
    }

    if (!gp) {
      setState((prev) =>
        prev.connected ? { ...defaultState } : prev
      );
      rafRef.current = requestAnimationFrame(poll);
      return;
    }

    // Read axes
    const axes = {
      lx: applyDeadZone(gp.axes[0] ?? 0),
      ly: applyDeadZone(gp.axes[1] ?? 0),
      rx: applyDeadZone(gp.axes[2] ?? 0),
      ry: applyDeadZone(gp.axes[3] ?? 0),
    };

    // Read buttons and detect rising edges
    const buttons: Record<string, boolean> = {};
    const entries = Object.entries(GAMEPAD_BUTTONS) as [GamepadButtonName, number][];
    for (const [name, index] of entries) {
      const pressed = gp.buttons[index]?.pressed ?? false;
      buttons[name] = pressed;

      // Rising edge detection
      if (pressed && !prevButtonsRef.current[index]) {
        onButtonPressRef.current?.(name);
      }
      prevButtonsRef.current[index] = pressed;
    }

    setState({
      connected: true,
      id: gp.id,
      axes,
      buttons: buttons as Record<GamepadButtonName, boolean>,
    });

    rafRef.current = requestAnimationFrame(poll);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, [poll]);

  return state;
}
