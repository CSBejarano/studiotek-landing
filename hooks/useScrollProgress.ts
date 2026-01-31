"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

interface ScrollProgressResult {
  /** Scroll progress from 0 (element entering from bottom) to 1 (element exiting from top) */
  progress: number;
  /** Whether the element is currently visible in the viewport */
  isInView: boolean;
}

/**
 * Custom hook that tracks scroll progress of a referenced element.
 *
 * - Uses IntersectionObserver for `isInView` detection.
 * - Calculates `progress` based on element position relative to the viewport:
 *   - 0 = element just entering from the bottom
 *   - 1 = element just exiting from the top
 * - Listens to scroll events only when the element is in view (performance).
 * - Cleans up observers and listeners on unmount.
 *
 * @param ref - RefObject pointing to the target HTML element.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const { progress, isInView } = useScrollProgress(ref);
 *
 * return (
 *   <div ref={ref} style={{ opacity: isInView ? 1 : 0 }}>
 *     Progress: {Math.round(progress * 100)}%
 *   </div>
 * );
 * ```
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>
): ScrollProgressResult {
  const [isInView, setIsInView] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // When rect.top === windowHeight, element is just entering (progress = 0)
    // When rect.bottom === 0, element has just exited (progress = 1)
    const totalTravel = windowHeight + rect.height;
    const traveled = windowHeight - rect.top;
    const rawProgress = traveled / totalTravel;

    setProgress(Math.min(1, Math.max(0, rawProgress)));
  }, [ref]);

  // IntersectionObserver for isInView
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  // Scroll listener only when in view
  useEffect(() => {
    if (!isInView) return;

    // Calculate immediately on becoming visible
    calculateProgress();

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInView, calculateProgress]);

  return { progress, isInView };
}

export type { ScrollProgressResult };
