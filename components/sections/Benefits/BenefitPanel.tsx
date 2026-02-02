'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { PanelData } from './data/benefits-data';
import { WatermarkStat } from './WatermarkStat';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BenefitPanelProps {
  panel: PanelData;
  index: number;
}

// ---------------------------------------------------------------------------
// Shared image animation props
// ---------------------------------------------------------------------------

const imgEntrance = (delay: number) => ({
  initial: { opacity: 0, y: 30, scale: 0.92 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BenefitPanel({ panel, index }: BenefitPanelProps) {
  // Unified dark background -- no light variant
  const bgColor = 'bg-[#0A0A0A]';
  const textColor = 'text-white';
  const textMutedColor = 'text-white/70';
  const textMutedMoreColor = 'text-white/50';
  const borderColor = 'border-white/10';

  // Headline renderer
  const headline = (
    <h2
      className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight ${textColor} leading-[0.85] z-20 relative`}
    >
      {panel.headline.split('\n').map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </h2>
  );

  // Stat ticker
  const statTicker = (align: string = '') => (
    <div className={`flex items-baseline gap-2 z-10 relative ${align}`}>
      <span className={`text-3xl sm:text-4xl md:text-5xl font-black ${textColor}`}>
        <NumberTicker value={panel.stat.value} className={textColor} />
      </span>
      <span className="text-xl sm:text-2xl font-bold text-[#2563EB]">
        {panel.stat.suffix}
      </span>
      <span className={`text-[clamp(0.75rem,1vw,0.875rem)] font-medium tracking-widest uppercase ${textMutedMoreColor} ml-2`}>
        {panel.stat.label}
      </span>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Layout: editorial-left (Panel 0 - Ahorro)
  // Headline top-left, main image right overlapping, secondary bottom-left
  // ---------------------------------------------------------------------------
  if (panel.layoutVariant === 'editorial-left') {
    return (
      <div className={`h-full flex-shrink-0 relative ${bgColor} overflow-hidden`} style={{ width: '100vw' }}>
        <WatermarkStat value={panel.watermarkValue} align="right" />

        <div className="relative h-full w-full px-8 sm:px-14 md:px-20 lg:px-28 pt-12 sm:pt-16 pb-20 sm:pb-24 flex flex-col justify-between">
          {/* Top: Headline + Copy 1 */}
          <div className="max-w-[55%]">
            {headline}
            <p className={`mt-6 max-w-sm text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor} z-10 relative`}>
              {panel.copyBlocks[0]?.text}
            </p>
          </div>

          {/* Main image - absolute, right side, overlaps into headline area */}
          {panel.images[0] && (
            <motion.div
              className="absolute top-[12%] right-[5%] w-[42%] max-w-[520px] z-10"
              {...imgEntrance(0.3)}
            >
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
                style={{ transform: `rotate(${panel.images[0].rotation})` }}
              >
                <Image
                  src={panel.images[0].src}
                  alt={panel.images[0].alt}
                  width={600}
                  height={400}
                  className="object-cover"
                  priority={panel.images[0].priority}
                  loading={panel.images[0].priority ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 50vw, 40vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </motion.div>
          )}

          {/* Secondary image - bottom left, partially behind main */}
          {panel.images[1] && (
            <motion.div
              className="absolute bottom-[18%] left-[8%] w-[30%] max-w-[350px] z-5"
              {...imgEntrance(0.55)}
            >
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
                style={{ transform: `rotate(${panel.images[1].rotation})` }}
              >
                <Image
                  src={panel.images[1].src}
                  alt={panel.images[1].alt}
                  width={450}
                  height={300}
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 40vw, 28vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </motion.div>
          )}

          {/* Bottom: Copy 2 (right-aligned) + Stat */}
          <div className="flex flex-col items-end gap-4">
            <p className={`max-w-sm text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor} text-right z-10 relative`}>
              {panel.copyBlocks[1]?.text}
            </p>
            {statTicker()}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Layout: editorial-right (Panel 1 - Clientes)
  // Headline top-right, main image left overlapping, secondary bottom-right
  // ---------------------------------------------------------------------------
  if (panel.layoutVariant === 'editorial-right') {
    return (
      <div className={`h-full flex-shrink-0 relative ${bgColor} overflow-hidden`} style={{ width: '100vw' }}>
        <WatermarkStat value={panel.watermarkValue} align="left" />

        <div className="relative h-full w-full px-8 sm:px-14 md:px-20 lg:px-28 pt-12 sm:pt-16 pb-20 sm:pb-24 flex flex-col justify-between">
          {/* Top: Headline right-aligned */}
          <div className="ml-auto max-w-[55%] text-right">
            {headline}
          </div>

          {/* Main image - absolute, left side, overlaps headline area */}
          {panel.images[0] && (
            <motion.div
              className="absolute top-[8%] left-[5%] w-[42%] max-w-[520px] z-10"
              {...imgEntrance(0.3)}
            >
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
                style={{ transform: `rotate(${panel.images[0].rotation})` }}
              >
                <Image
                  src={panel.images[0].src}
                  alt={panel.images[0].alt}
                  width={600}
                  height={400}
                  className="object-cover"
                  priority={panel.images[0].priority}
                  loading={panel.images[0].priority ? 'eager' : 'lazy'}
                  sizes="(max-width: 768px) 50vw, 40vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </motion.div>
          )}

          {/* Copy 1 - left-center, below image area */}
          <p className={`max-w-sm text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor} z-10 relative ml-[15%]`}>
            {panel.copyBlocks[0]?.text}
          </p>

          {/* Secondary image - center-right area */}
          {panel.images[1] && (
            <motion.div
              className="absolute bottom-[14%] right-[32%] w-[34%] max-w-[400px] z-5"
              {...imgEntrance(0.55)}
            >
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
                style={{ transform: `rotate(${panel.images[1].rotation})` }}
              >
                <Image
                  src={panel.images[1].src}
                  alt={panel.images[1].alt}
                  width={450}
                  height={300}
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 40vw, 28vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </motion.div>
          )}

          {/* Copy 2 - right of image, no overlap */}
          <p className={`absolute bottom-[24%] right-[5%] max-w-[26%] text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor} text-right z-20`}>
            {panel.copyBlocks[1]?.text}
          </p>

          {/* Stat - bottom right, below copy 2 */}
          <div className="absolute bottom-6 right-[5%] z-10">
            {statTicker('justify-end')}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Layout: editorial-center (Panel 2 - Satisfacción)
  // Headline centered, images flanking from left and right
  // ---------------------------------------------------------------------------
  return (
    <div className={`h-full flex-shrink-0 relative ${bgColor} overflow-hidden`} style={{ width: '100vw' }}>
      <WatermarkStat value={panel.watermarkValue} align="center" />

      <div className="relative h-full w-full px-8 sm:px-14 md:px-20 lg:px-28 pt-12 sm:pt-16 pb-20 sm:pb-24 flex flex-col items-center justify-between">
        {/* Top: Headline centered */}
        <div className="text-center w-full">
          {headline}
        </div>

        {/* Main image - left side, below headline */}
        {panel.images[0] && (
          <motion.div
            className="absolute top-[38%] left-[5%] w-[34%] max-w-[420px] z-5"
            {...imgEntrance(0.3)}
          >
            <div
              className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
              style={{ transform: `rotate(${panel.images[0].rotation})` }}
            >
              <Image
                src={panel.images[0].src}
                alt={panel.images[0].alt}
                width={600}
                height={400}
                className="object-cover"
                priority={panel.images[0].priority}
                loading={panel.images[0].priority ? 'eager' : 'lazy'}
                sizes="(max-width: 768px) 45vw, 38vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </motion.div>
        )}

        {/* Secondary image - right side, below headline */}
        {panel.images[1] && (
          <motion.div
            className="absolute top-[42%] right-[5%] w-[28%] max-w-[340px] z-5"
            {...imgEntrance(0.55)}
          >
            <div
              className={`relative rounded-xl overflow-hidden shadow-2xl border ${borderColor}`}
              style={{ transform: `rotate(${panel.images[1].rotation})` }}
            >
              <Image
                src={panel.images[1].src}
                alt={panel.images[1].alt}
                width={450}
                height={300}
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 40vw, 30vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </motion.div>
        )}

        {/* Center: Copy blocks */}
        <div className="text-center max-w-md z-10 relative">
          <p className={`text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor} mb-4`}>
            {panel.copyBlocks[0]?.text}
          </p>
          <p className={`text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed ${textMutedColor}`}>
            {panel.copyBlocks[1]?.text}
          </p>
        </div>

        {/* Bottom: Stat centered */}
        {statTicker('justify-center')}
      </div>
    </div>
  );
}
