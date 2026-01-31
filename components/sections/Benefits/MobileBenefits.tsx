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
    <div className="md:hidden absolute top-0 left-0 w-full">
      <div className="bg-[#0A0A0A] min-h-screen px-6 py-16">
        {panels.map((panel, index) => {
          const isDark = panel.bgVariant === 'dark';
          const isEven = index % 2 === 0;

          const textColor = isDark ? 'text-white' : 'text-[#0A0A0A]';
          const textMutedColor = isDark ? 'text-white/70' : 'text-[#0A0A0A]/70';
          const textMutedMoreColor = isDark ? 'text-white/50' : 'text-[#0A0A0A]/50';
          const bgClasses = isDark ? '' : 'bg-[#F5F5F5] -mx-6 px-6 py-16';

          return (
            <div key={panel.id} className={`mb-20 relative overflow-hidden ${bgClasses}`}>
              {/* Watermark - subtle on mobile */}
              <WatermarkStat
                value={panel.watermarkValue}
                isDark={isDark}
                align={index === 2 ? 'center' : isEven ? 'right' : 'left'}
              />

              <div className="relative z-10">
                <h2
                  className={`text-4xl font-black uppercase tracking-tight ${textColor} leading-[0.9] mb-6 ${!isEven ? 'text-right' : ''}`}
                >
                  {panel.headline.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < panel.headline.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>

                <p
                  className={`text-base ${textMutedColor} leading-relaxed mb-6 max-w-sm ${!isEven ? 'ml-auto text-right' : ''}`}
                >
                  {panel.copyBlocks[0]?.text}
                </p>

                {/* First image */}
                {panel.images[0] && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
                    <Image
                      src={panel.images[0].src}
                      alt={panel.images[0].alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Stat ticker */}
                <div className={`flex items-baseline gap-2 ${!isEven ? 'justify-end' : index === 2 ? 'justify-center' : ''}`}>
                  <span className={`text-3xl font-black ${textColor}`}>
                    <NumberTicker value={panel.stat.value} className={textColor} />
                  </span>
                  <span className="text-xl font-bold text-[#2563EB]">
                    {panel.stat.suffix}
                  </span>
                  <span className={`text-sm ${textMutedMoreColor} ml-2 uppercase`}>
                    {panel.stat.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* CTA Mobile */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
            SI HAS LLEGADO HASTA AQUI
            <br />
            ES PORQUE SABES QUE
            <br />
            NECESITAS <span className="text-[#2563EB]">AUTOMATIZAR.</span>
          </h2>
          <button
            onClick={scrollToContact}
            className="px-8 py-4 rounded-full bg-white text-[#0A0A0A] font-bold text-base hover:bg-white/90 transition-colors cursor-pointer"
          >
            Empieza ahora
          </button>
          <a
            href="mailto:hola@studiotek.es"
            className="block mt-4 text-sm text-white/50 hover:text-white/80"
          >
            O escribenos a hola@studiotek.es
          </a>
        </div>
      </div>
    </div>
  );
}
