'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseHorizontalScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
}

// ---------------------------------------------------------------------------
// Register Plugin
// ---------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHorizontalScroll(numPanels: number): UseHorizontalScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current || !containerRef.current) return;

    // Calculate total scroll distance
    const scrollDistance = (numPanels - 1) * window.innerWidth;

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
      },
    });

    // Cleanup function - only kill this specific ScrollTrigger, not all
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: containerRef, dependencies: [numPanels] });

  return { containerRef, trackRef };
}
