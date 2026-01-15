'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppleCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function AppleCarousel({ children, className }: AppleCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScrollability);
      }
      window.removeEventListener('resize', checkScrollability);
    };
  }, []);

  const scrollBy = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Navigation Button - Left */}
      <button
        onClick={() => scrollBy('left')}
        className={cn(
          "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-slate-800/90 text-white border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-700 hover:scale-110 shadow-lg",
          !canScrollLeft && "hidden"
        )}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Navigation Button - Right */}
      <button
        onClick={() => scrollBy('right')}
        className={cn(
          "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-slate-800/90 text-white border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-700 hover:scale-110 shadow-lg",
          !canScrollRight && "hidden"
        )}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>

      {/* Fade edges for visual polish - lower z-index to not interfere with modals */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-slate-950 to-transparent z-[5]" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-slate-950 to-transparent z-[5]" />

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-4 md:gap-6 overflow-x-auto py-8 px-8 md:px-16 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>

      {/* Custom scrollbar hiding */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
