"use client";

import { useState, useEffect } from "react";
import { useInView, IntersectionOptions } from "react-intersection-observer";

interface UseScrollAnimationOptions {
  /** Percentage of element visible to trigger (0-1), default 0.1 */
  threshold?: number;
  /** Only trigger animation once, default true */
  triggerOnce?: boolean;
  /** Root margin for intersection observer, default "0px" */
  rootMargin?: string;
}

interface UseScrollAnimationReturn {
  /** Ref to attach to the element */
  ref: (node?: Element | null) => void;
  /** Whether element is currently in view */
  isInView: boolean;
  /** Whether the animation has already been triggered (useful for triggerOnce) */
  hasAnimated: boolean;
}

/**
 * Hook for detecting when elements enter the viewport.
 * Useful for scroll-triggered animations.
 *
 * Uses react-intersection-observer under the hood.
 *
 * @example
 * ```tsx
 * const { ref, isInView, hasAnimated } = useScrollAnimation({ threshold: 0.2 });
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial={{ opacity: 0, y: 20 }}
 *     animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = "0px",
  } = options;

  const [hasAnimated, setHasAnimated] = useState(false);

  const intersectionOptions: IntersectionOptions = {
    threshold,
    triggerOnce,
    rootMargin,
  };

  const { ref, inView } = useInView(intersectionOptions);

  // Track if animation has been triggered
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  return {
    ref,
    isInView: inView,
    hasAnimated,
  };
}

export type { UseScrollAnimationOptions, UseScrollAnimationReturn };
