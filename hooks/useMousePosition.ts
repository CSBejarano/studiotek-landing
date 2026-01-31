"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MousePosition {
  /** Normalized X position from -1 (left) to 1 (right) */
  x: number;
  /** Normalized Y position from -1 (top) to 1 (bottom) */
  y: number;
}

/**
 * Custom hook that returns normalized mouse position relative to the viewport.
 *
 * - Returns `{ x, y }` normalized from -1 to 1.
 * - Uses requestAnimationFrame for throttling (60fps max).
 * - On touch devices (no fine pointer), returns static `{ x: 0, y: 0 }`.
 * - Cleans up all listeners on unmount.
 *
 * @example
 * ```tsx
 * const { x, y } = useMousePosition();
 * // x: -1 (left edge) to 1 (right edge)
 * // y: -1 (top edge) to 1 (bottom edge)
 * ```
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const isFinPointerRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPosition({ x, y });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    // Detect fine pointer (mouse) vs coarse (touch)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    isFinPointerRef.current = mediaQuery.matches;

    if (!isFinPointerRef.current) {
      // Touch device: keep static { x: 0, y: 0 }
      return;
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [handleMouseMove]);

  return position;
}

export type { MousePosition };
