'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseExpandingCardReturn {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  bgHeroRef: React.RefObject<HTMLDivElement | null>;
  sideCardLeftRef: React.RefObject<HTMLDivElement | null>;
  sideCardRightRef: React.RefObject<HTMLDivElement | null>;
  centerCardRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLDivElement | null>;
  heroTitleRef: React.RefObject<HTMLDivElement | null>;
}

interface BreakpointConfig {
  sideCardXOffset: number;
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// Register Plugin (idempotent)
// ---------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Breakpoint Config
// ---------------------------------------------------------------------------

function getBreakpointConfig(): BreakpointConfig {
  if (typeof window === 'undefined') {
    return {
      sideCardXOffset: 0,
      enabled: false,
    };
  }

  const width = window.innerWidth;

  if (width < 768) {
    return {
      sideCardXOffset: 0,
      enabled: false,
    };
  }

  if (width < 1024) {
    // Tablet
    return {
      sideCardXOffset: 60,
      enabled: true,
    };
  }

  // Desktop
  return {
    sideCardXOffset: 100,
    enabled: true,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useExpandingCard(isDesktop: boolean): UseExpandingCardReturn {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgHeroRef = useRef<HTMLDivElement>(null);
  const sideCardLeftRef = useRef<HTMLDivElement>(null);
  const sideCardRightRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !sectionRef.current ||
      !overlayRef.current ||
      !bgHeroRef.current ||
      !sideCardLeftRef.current ||
      !sideCardRightRef.current ||
      !centerCardRef.current ||
      !titleRef.current ||
      !heroTitleRef.current
    ) {
      return;
    }

    const config = getBreakpointConfig();

    // Mobile: no animation
    if (!config.enabled) return;

    // Set initial states
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(bgHeroRef.current, { opacity: 1 });
    gsap.set(heroTitleRef.current, { opacity: 1 });
    gsap.set(sideCardLeftRef.current, { x: -config.sideCardXOffset, opacity: 0 });
    gsap.set(sideCardRightRef.current, { x: config.sideCardXOffset, opacity: 0 });
    gsap.set(centerCardRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(titleRef.current, { opacity: 0, y: 30 });

    // Timeline — all animations start at t=0 with same duration
    // so forward (scroll down) and reverse (scroll up) look identical
    const tl = gsap.timeline();
    const d = 1;
    const ease = 'power3.inOut';

    // Overlay fades in to cover the hero image
    tl.to(overlayRef.current, { opacity: 1, duration: d, ease }, 0);

    // Background fades out
    tl.to(bgHeroRef.current, { opacity: 0, duration: d, ease }, 0);

    // Hero title fades out
    tl.to(heroTitleRef.current, { opacity: 0, y: -40, duration: d, ease }, 0);

    // Side cards slide in
    tl.to(sideCardLeftRef.current, { x: 0, opacity: 1, duration: d, ease }, 0);
    tl.to(sideCardRightRef.current, { x: 0, opacity: 1, duration: d, ease }, 0);

    // Center card fades in
    tl.to(centerCardRef.current, { opacity: 1, scale: 1, duration: d, ease }, 0);

    // Section title fades in
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: d, ease }, 0);

    // ScrollTrigger: pin the section.
    // Minimal scroll distance — any scroll triggers the snap immediately.
    // The snap then drives the full 1s transition automatically.
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      scrub: 0.1,
      start: 'top top',
      end: () => `+=${window.innerHeight}`,
      animation: tl,
      snap: {
        snapTo: [0, 1],
        duration: 2.5,
        delay: 0,
        ease: 'power3.inOut',
      },
      invalidateOnRefresh: true,
    });

    // Cleanup
    return () => {
      st.kill();
      tl.kill();
    };
  }, { scope: sectionRef, dependencies: [isDesktop] });

  return {
    sectionRef,
    overlayRef,
    bgHeroRef,
    sideCardLeftRef,
    sideCardRightRef,
    centerCardRef,
    titleRef,
    heroTitleRef,
  };
}
