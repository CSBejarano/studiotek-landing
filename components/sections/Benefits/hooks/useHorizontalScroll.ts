'use client';

import { useRef } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SURFACE_WIDTH } from '../data/surface-layout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseHorizontalScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  scrollProgress: MotionValue<number>;
}

// ---------------------------------------------------------------------------
// Register Plugin
// ---------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHorizontalScroll(): UseHorizontalScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useMotionValue(0);

  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return;

    // Calculate total scroll distance:
    // SURFACE_WIDTH is in vw (e.g. 500). Subtract 100vw (the visible viewport).
    // Convert to px: (vw units) * (px per vw).
    const scrollDistance = (SURFACE_WIDTH - 100) * (window.innerWidth / 100);

    // Create horizontal scroll tween
    const tween = gsap.to(trackRef.current, {
      x: -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollDistance}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.set(self.progress);
        },
      },
    });

    // Force overflow visible on GSAP pin-spacer to prevent clipping
    const pinSpacer = containerRef.current.parentElement;
    if (pinSpacer?.classList.contains('pin-spacer')) {
      pinSpacer.style.overflow = 'visible';
    }

    // Cleanup function - only kill this specific ScrollTrigger, not all
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: containerRef });

  return { containerRef, trackRef, scrollProgress };
}
