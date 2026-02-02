'use client';

import Image from 'next/image';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { surfaceElements, type SurfaceElement } from './data/surface-layout';
import { WatermarkStat } from './WatermarkStat';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MobileBenefitsProps {
  scrollToContact: () => void;
}

// ---------------------------------------------------------------------------
// Zone helpers
// ---------------------------------------------------------------------------

const ZONES = ['ahorro', 'clientes', 'satisfaccion'] as const;

function getElementsByZone(zone: string): SurfaceElement[] {
  return surfaceElements.filter((el) => el.zone === zone);
}

function getHeadline(elements: SurfaceElement[]) {
  return elements.find((el) => el.type === 'headline');
}

function getImages(elements: SurfaceElement[]) {
  return elements.filter((el) => el.type === 'image');
}

function getCopies(elements: SurfaceElement[]) {
  return elements.filter((el) => el.type === 'copy');
}

function getStatTicker(elements: SurfaceElement[]) {
  return elements.find((el) => el.type === 'stat-ticker');
}

function getStatWatermark(elements: SurfaceElement[]) {
  return elements.find((el) => el.type === 'stat-watermark');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MobileBenefits({ scrollToContact }: MobileBenefitsProps) {
  return (
    <div>
      <div className="bg-[#0A0A0A] px-5 pt-6 pb-8 space-y-8">
        {ZONES.map((zone, index) => {
          const elements = getElementsByZone(zone);
          const headline = getHeadline(elements);
          const images = getImages(elements);
          const copies = getCopies(elements);
          const statTicker = getStatTicker(elements);
          const watermark = getStatWatermark(elements);

          const isEven = index % 2 === 0;

          return (
            <article key={zone} className="relative overflow-hidden">
              {/* Watermark - scaled down for mobile */}
              {watermark && watermark.type === 'stat-watermark' && (
                <WatermarkStat
                  value={watermark.content.label}
                  align={index === 2 ? 'center' : isEven ? 'right' : 'left'}
                  mobile
                />
              )}

              <div className="relative z-10 space-y-5">
                {/* 1. Headline */}
                {headline && headline.type === 'headline' && (
                  <h2
                    className="text-[2rem] font-black uppercase tracking-tight text-white leading-[0.9] text-center"
                  >
                    {headline.content.text.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                )}

                {/* 2. Stat ticker - centered, big for impact */}
                {statTicker && statTicker.type === 'stat-ticker' && (
                  <div className="flex items-baseline justify-center gap-2 py-2">
                    <span className="text-3xl font-black text-white">
                      <NumberTicker value={statTicker.content.value} className="text-white" />
                    </span>
                    <span className="text-2xl font-bold text-[#2563EB]">
                      {statTicker.content.suffix}
                    </span>
                    <span className="text-[clamp(0.75rem,1vw,0.875rem)] font-medium tracking-widest uppercase text-white/50 ml-1">
                      {statTicker.content.label}
                    </span>
                  </div>
                )}

                {/* 3. Images - 2-column grid when 2 images, full-width if 1 */}
                {images.length >= 2 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {images.slice(0, 2).map((img, imgIdx) =>
                      img.type === 'image' ? (
                        <div
                          key={img.id}
                          className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg"
                        >
                          <Image
                            src={img.content.src}
                            alt={img.content.alt}
                            fill
                            className="object-cover"
                            loading={imgIdx === 0 && index === 0 ? 'eager' : 'lazy'}
                            sizes="(max-width: 768px) 45vw"
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                ) : images[0] && images[0].type === 'image' ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={images[0].content.src}
                      alt={images[0].content.alt}
                      fill
                      className="object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 90vw"
                    />
                  </div>
                ) : null}

                {/* 4. First copy block */}
                {copies[0] && copies[0].type === 'copy' && (
                  <p
                    className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-normal text-white/70 text-center"
                  >
                    {copies[0].content.text}
                  </p>
                )}
              </div>
            </article>
          );
        })}

        {/* CTA Mobile */}
        <div className="text-center pt-4 pb-8 space-y-5">
          <h2 className="text-[clamp(2.25rem,7vw,3.5rem)] font-black leading-[1.1] text-white uppercase tracking-tight text-center">
            SI HAS LLEGADO HASTA AQUÍ ES PORQUE SABES QUE NECESITAS
            <br />
            <span className="text-[#2563EB]">AUTOMATIZAR.</span>
          </h2>

          <button
            onClick={scrollToContact}
            aria-label="Ir a formulario de contacto"
            className="min-h-[44px] px-8 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-semibold text-sm hover:from-[#3B82F6] hover:to-[#2563EB] transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(37,99,235,0.3)]"
          >
            Empieza ahora
          </button>
        </div>
      </div>
    </div>
  );
}
