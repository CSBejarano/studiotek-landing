"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevolutCarouselProps {
  /** Array of items to display as carousel cards */
  items: React.ReactNode[];
  className?: string;
  /** Show pagination dots (default: true) */
  showDots?: boolean;
  /** Show prev/next arrow buttons on desktop (default: true) */
  showArrows?: boolean;
}

/**
 * Premium horizontal carousel with Revolut/Blaze-style interactions.
 *
 * Features:
 * - Native scroll-snap for precise card alignment.
 * - Framer Motion drag gesture for momentum scrolling.
 * - Progress dots synchronized with scroll position.
 * - Active card (center) scales to 1.02 for emphasis.
 * - Desktop: optional prev/next arrow buttons.
 * - Mobile: native swipe + drag support.
 * - Keyboard navigation: ArrowLeft/ArrowRight moves cards.
 * - Smooth scroll behavior with CSS scroll-behavior.
 * - Respects `prefers-reduced-motion` (disables scale animation).
 *
 * @example
 * ```tsx
 * <RevolutCarousel
 *   items={cards.map((card) => (
 *     <div className="min-w-[300px] p-6 bg-slate-900 rounded-xl">
 *       {card.title}
 *     </div>
 *   ))}
 * />
 * ```
 */
export function RevolutCarousel({
  items,
  className,
  showDots = true,
  showArrows = true,
}: RevolutCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const totalItems = items.length;

  // Determine which card is closest to center based on scroll position
  const updateActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth } = container;
    const children = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let closestDistance = Infinity;
    const containerCenter = scrollLeft + clientWidth / 2;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);

    // Update scroll boundary states
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(
      scrollLeft < container.scrollWidth - clientWidth - 5
    );
  }, []);

  // Listen to scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      requestAnimationFrame(updateActiveIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    // Initial check
    updateActiveIndex();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateActiveIndex]);

  // Scroll to a specific card index
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const target = children[index];
    if (!target) return;

    const containerCenter = container.clientWidth / 2;
    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    const scrollTarget = targetCenter - containerCenter;

    container.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, []);

  const scrollPrev = useCallback(() => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  }, [activeIndex, scrollToIndex]);

  const scrollNext = useCallback(() => {
    if (activeIndex < totalItems - 1) {
      scrollToIndex(activeIndex + 1);
    }
  }, [activeIndex, totalItems, scrollToIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <div
      className={cn("relative group", className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
      aria-roledescription="carousel"
    >
      {/* Arrow buttons - desktop */}
      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            className={cn(
              "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20",
              "p-2 md:p-3 rounded-full",
              "bg-slate-800/90 text-white border border-slate-700/50",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-slate-700 hover:scale-110 shadow-lg",
              "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              !canScrollLeft && "hidden"
            )}
            disabled={!canScrollLeft}
            aria-label="Previous item"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20",
              "p-2 md:p-3 rounded-full",
              "bg-slate-800/90 text-white border border-slate-700/50",
              "opacity-0 group-hover:opacity-100 transition-all duration-300",
              "hover:bg-slate-700 hover:scale-110 shadow-lg",
              "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              !canScrollRight && "hidden"
            )}
            disabled={!canScrollRight}
            aria-label="Next item"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-950 to-transparent z-[5]" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-950 to-transparent z-[5]" />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto py-8 px-8 md:px-16"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0"
            style={{
              scrollSnapAlign: "center",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: index === activeIndex ? 1.02 : 1,
                    opacity: index === activeIndex ? 1 : 0.7,
                  }
            }
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Item ${index + 1} of ${totalItems}`}
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Pagination dots */}
      {showDots && totalItems > 1 && (
        <div
          className="flex justify-center gap-2 mt-4"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                index === activeIndex
                  ? "bg-blue-500 w-6"
                  : "bg-slate-600 hover:bg-slate-500"
              )}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to item ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hide scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export type { RevolutCarouselProps };
