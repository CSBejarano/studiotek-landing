'use client';

import { useCallback } from 'react';
import { motion, type MotionValue } from 'motion/react';
import Image from 'next/image';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { useParallaxElement } from './hooks/useParallaxElement';
import type {
  SurfaceElement as SurfaceElementType,
  AttributionLink,
} from './data/surface-layout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurfaceElementProps {
  element: SurfaceElementType;
  scrollYProgress: MotionValue<number>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SurfaceElement({ element, scrollYProgress }: SurfaceElementProps) {
  const { style: parallaxStyle } = useParallaxElement(scrollYProgress, element.parallaxSpeed);

  const scrollToContact = useCallback(() => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${element.x}vw`,
        top: `${element.y}vh`,
        zIndex: element.zIndex,
        opacity: element.opacity ?? 1,
        x: parallaxStyle.x,
      }}
    >
      {renderContent(element, scrollToContact)}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Attribution Links
// ---------------------------------------------------------------------------

function AttributionLinks({ links, className }: { links: AttributionLink[]; className?: string }) {
  return (
    <span className={className}>
      {links.map((link, i) => (
        <span key={i}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/20 hover:text-white/50 hover:decoration-white/40 transition-colors"
          >
            {link.text}
          </a>
          {i < links.length - 1 && <span className="mx-1">·</span>}
        </span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Content Renderer
// ---------------------------------------------------------------------------

function renderContent(
  element: SurfaceElementType,
  scrollToContact: () => void,
) {
  switch (element.type) {
    case 'headline': {
      const lines = element.content.text.split('\n');
      return (
        <h2 className="text-[clamp(3rem,12vw,10rem)] font-black uppercase tracking-tight text-white leading-[0.85]">
          {lines.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h2>
      );
    }

    case 'image': {
      return (
        <div
          className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            width: `${element.content.width}vw`,
            transform: element.rotation ? `rotate(${element.rotation})` : undefined,
          }}
        >
          <Image
            src={element.content.src}
            alt={element.content.alt}
            width={600}
            height={400}
            className="object-cover"
            loading="eager"
            sizes="(max-width: 768px) 50vw, 40vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      );
    }

    case 'copy': {
      return (
        <div style={{ maxWidth: `${element.content.maxWidth}vw` }}>
          <p className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed text-white/70">
            {element.content.text}
          </p>
          {element.content.attribution && (
            <AttributionLinks
              links={element.content.attribution}
              className="block mt-1.5 text-[10px] font-normal text-white/25 tracking-wide italic"
            />
          )}
        </div>
      );
    }

    case 'stat-watermark': {
      return (
        <span
          className="font-mono font-black text-[18vw] leading-none text-white/[0.03] select-none pointer-events-none"
          aria-hidden="true"
        >
          {element.content.value}
        </span>
      );
    }

    case 'stat-ticker': {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              <NumberTicker value={element.content.value} className="text-white" />
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#2563EB]">
              {element.content.suffix}
            </span>
            <span className="text-xs font-medium tracking-widest uppercase text-white/50 ml-2">
              {element.content.label}
            </span>
          </div>
          {element.content.attribution && (
            <AttributionLinks
              links={element.content.attribution}
              className="text-[10px] font-normal text-white/30 tracking-wide"
            />
          )}
        </div>
      );
    }

    case 'badge': {
      return (
        <div className="px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
          <span className="text-xs font-bold tracking-widest uppercase text-white/60">
            {element.content.label}
          </span>
        </div>
      );
    }

    case 'cta-headline': {
      const lines = element.content.text.split('\n');
      return (
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-4xl">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line.includes('AUTOMATIZAR') ? (
                <>
                  {line.replace('AUTOMATIZAR.', '')}
                  <span className="text-[#2563EB]">AUTOMATIZAR.</span>
                </>
              ) : (
                line
              )}
            </span>
          ))}
        </h2>
      );
    }

    case 'cta-button': {
      return (
        <motion.button
          onClick={scrollToContact}
          aria-label="Ir a formulario de contacto"
          className="px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-white text-[#0A0A0A] font-bold text-base sm:text-lg hover:bg-white/90 transition-colors cursor-pointer shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {element.content.text}
        </motion.button>
      );
    }

    case 'cta-link': {
      const email = element.content.href?.replace('mailto:', '') ?? element.content.text;
      return (
        <a
          href={`mailto:${email}`}
          className="text-sm sm:text-base text-white/50 hover:text-white/80 transition-colors"
        >
          O escribenos a {email}
        </a>
      );
    }

    default:
      return null;
  }
}
