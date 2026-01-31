'use client';

import Image from 'next/image';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { PanelData } from './data/benefits-data';
import { WatermarkStat } from './WatermarkStat';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MobileBenefitsProps {
  panels: PanelData[];
  scrollToContact: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MobileBenefits({ panels, scrollToContact }: MobileBenefitsProps) {
  return (
    <div className="md:hidden">
      <div className="bg-[#0A0A0A] px-5 py-14 space-y-16">
        {panels.map((panel, index) => {
          const isDark = panel.bgVariant === 'dark';
          const isEven = index % 2 === 0;

          const textColor = isDark ? 'text-white' : 'text-[#0A0A0A]';
          const textMutedColor = isDark ? 'text-white/70' : 'text-[#0A0A0A]/70';
          const bgClasses = isDark ? '' : 'bg-[#F5F5F5] -mx-5 px-5 py-14 rounded-2xl';

          return (
            <article
              key={panel.id}
              className={`relative overflow-hidden ${bgClasses}`}
            >
              {/* Watermark - scaled down for mobile */}
              <WatermarkStat
                value={panel.watermarkValue}
                isDark={isDark}
                align={index === 2 ? 'center' : isEven ? 'right' : 'left'}
                mobile
              />

              <div className="relative z-10 space-y-5">
                {/* 1. Headline */}
                <h2
                  className={`text-[2rem] font-black uppercase tracking-tight ${textColor} leading-[0.9] ${!isEven ? 'text-right' : ''}`}
                >
                  {panel.headline.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h2>

                {/* 2. Stat ticker - centered, big for impact */}
                <div className="flex items-baseline justify-center gap-2 py-2">
                  <span className={`text-4xl font-black ${textColor}`}>
                    <NumberTicker value={panel.stat.value} className={textColor} />
                  </span>
                  <span className="text-2xl font-bold text-[#2563EB]">
                    {panel.stat.suffix}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-[#0A0A0A]/50'} ml-1 uppercase tracking-wider`}>
                    {panel.stat.label}
                  </span>
                </div>

                {/* 3. Images - 2-column grid when 2 images available */}
                {panel.images.length >= 2 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {panel.images.slice(0, 2).map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          loading={imgIdx === 0 && index === 0 ? 'eager' : 'lazy'}
                          sizes="(max-width: 768px) 45vw"
                        />
                      </div>
                    ))}
                  </div>
                ) : panel.images[0] ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={panel.images[0].src}
                      alt={panel.images[0].alt}
                      fill
                      className="object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 90vw"
                    />
                  </div>
                ) : null}

                {/* 4. Description */}
                <p
                  className={`text-[0.95rem] ${textMutedColor} leading-relaxed ${!isEven ? 'text-right' : ''}`}
                >
                  {panel.copyBlocks[0]?.text}
                </p>
              </div>
            </article>
          );
        })}

        {/* CTA Mobile */}
        <div className="text-center pt-4 pb-8 space-y-5">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-[0.95]">
            SI HAS LLEGADO HASTA AQUI
            <br />
            ES PORQUE SABES QUE
            <br />
            NECESITAS <span className="text-[#2563EB]">AUTOMATIZAR.</span>
          </h2>

          <button
            onClick={scrollToContact}
            aria-label="Ir a formulario de contacto"
            className="w-full min-h-[48px] px-8 py-4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-bold text-base hover:from-[#3B82F6] hover:to-[#2563EB] transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(37,99,235,0.3)]"
          >
            Empieza ahora
          </button>

          <a
            href="mailto:hola@studiotek.es"
            className="block text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            O escribenos a hola@studiotek.es
          </a>
        </div>
      </div>
    </div>
  );
}
