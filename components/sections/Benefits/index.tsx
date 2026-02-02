'use client';

import { useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { surfaceElements, SURFACE_WIDTH } from './data/surface-layout';
import { SurfaceElement } from './SurfaceElement';
import { MobileBenefits } from './MobileBenefits';
import { ProgressIndicator } from './ProgressIndicator';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Benefits() {
  const { containerRef, trackRef, scrollProgress } = useHorizontalScroll();
  const reducedMotion = useReducedMotion();

  const scrollToContact = useCallback(() => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Si reduced motion, mostrar layout vertical en todos los breakpoints
  if (reducedMotion) {
    return (
      <section
        id="benefits"
        data-section="benefits"
        role="region"
        aria-label="Beneficios de automatizar con IA"
      >
        <MobileBenefits scrollToContact={scrollToContact} />
      </section>
    );
  }

  return (
    <section
      id="benefits"
      data-section="benefits"
      role="region"
      aria-label="Beneficios de automatizar con IA"
    >
      {/* Desktop: superficie horizontal continua */}
      <div ref={containerRef} className="hidden md:block relative overflow-visible">
        <div
          ref={trackRef}
          className="relative h-screen bg-[#0A0A0A] will-change-transform overflow-visible"
          style={{ width: `${SURFACE_WIDTH}vw` }}
        >
          {surfaceElements.map((el) => (
            <SurfaceElement key={el.id} element={el} scrollYProgress={scrollProgress} />
          ))}
        </div>
        <ProgressIndicator scrollYProgress={scrollProgress} />
      </div>

      {/* Mobile: fallback vertical */}
      <div className="md:hidden">
        <MobileBenefits scrollToContact={scrollToContact} />
      </div>
    </section>
  );
}
