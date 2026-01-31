'use client';

import { motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CTAPanelProps {
  scrollToContact: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CTAPanel({ scrollToContact }: CTAPanelProps) {
  return (
    <div className="h-full flex-shrink-0 relative bg-[#0A0A0A] overflow-hidden" style={{ width: '100vw' }}>
      <div className="relative h-full w-full flex flex-col items-center justify-center px-6 sm:px-12 md:px-20 text-center">
        {/* Headline CTA */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-4xl mb-4">
          SI HAS LLEGADO
          <br />
          HASTA AQUI
          <br />
          ES PORQUE SABES QUE
          <br />
          NECESITAS{' '}
          <span className="text-[#2563EB]">AUTOMATIZAR.</span>
        </h2>

        {/* CTA Button */}
        <motion.button
          onClick={scrollToContact}
          aria-label="Ir a formulario de contacto"
          className="mt-8 sm:mt-12 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-white text-[#0A0A0A] font-bold text-base sm:text-lg hover:bg-white/90 transition-colors duration-200 cursor-pointer shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Empieza ahora
        </motion.button>

        {/* Secondary CTA */}
        <a
          href="mailto:hola@studiotek.es"
          className="mt-6 text-sm sm:text-base text-white/50 hover:text-white/80 transition-colors"
        >
          O escríbenos a hola@studiotek.es
        </a>
      </div>
    </div>
  );
}
