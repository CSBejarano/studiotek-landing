'use client';

import { useCallback } from 'react';
import { useScroll } from 'motion/react';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { panels, NUM_PANELS } from './data/benefits-data';
import { BenefitPanel } from './BenefitPanel';
import { CTAPanel } from './CTAPanel';
import { MobileBenefits } from './MobileBenefits';
import { ProgressIndicator } from './ProgressIndicator';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Benefits() {
  // containerRef is the GSAP pin trigger (desktop wrapper only)
  const { containerRef, trackRef } = useHorizontalScroll(NUM_PANELS);

  // useScroll for the progress indicator
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollToContact = useCallback(() => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="benefits"
      data-section="benefits"
      role="region"
      aria-label="Beneficios de automatizar con IA"
    >
      {/* Desktop horizontal scroll - GSAP pins this wrapper */}
      <div ref={containerRef} className="hidden md:block relative">
        {/* Horizontal track - controlled by GSAP */}
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: `${NUM_PANELS * 100}vw` }}
        >
          {/* Benefit Panels */}
          {panels.map((panel, index) => (
            <BenefitPanel key={panel.id} panel={panel} index={index} />
          ))}

          {/* CTA Panel */}
          <CTAPanel scrollToContact={scrollToContact} />
        </div>

        {/* Progress indicator */}
        <ProgressIndicator scrollYProgress={scrollYProgress} numPanels={NUM_PANELS} />
      </div>

      {/* Mobile Fallback */}
      <MobileBenefits panels={panels} scrollToContact={scrollToContact} />
    </section>
  );
}
