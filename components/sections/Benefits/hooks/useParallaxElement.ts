'use client';

import { useTransform, type MotionValue, type MotionStyle } from 'motion/react';
import { SURFACE_WIDTH } from '../data/surface-layout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UseParallaxElementReturn {
  style: MotionStyle;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Computes a horizontal parallax offset for an element on the surface.
 *
 * - speed === 1 : no extra offset (moves with the track)
 * - speed < 1  : element lags behind (appears farther / background)
 * - speed > 1  : element moves ahead (appears closer / foreground)
 *
 * Uses useTransform for direct scroll-linked response (no spring lag).
 */
export function useParallaxElement(
  scrollYProgress: MotionValue<number>,
  parallaxSpeed: number,
): UseParallaxElementReturn {
  // Factor: how many extra px of offset over the full scroll range.
  // 0.15 of total surface width gives a subtle but visible effect.
  // typeof window check required for Next.js SSR; 19.2 = 1920/100 fallback.
  const pxPerVw =
    typeof window !== 'undefined' ? window.innerWidth / 100 : 19.2;
  const maxOffset = (1 - parallaxSpeed) * SURFACE_WIDTH * pxPerVw * 0.15;

  const x = useTransform(scrollYProgress, [0, 1], [0, maxOffset]);

  return { style: { x } };
}
