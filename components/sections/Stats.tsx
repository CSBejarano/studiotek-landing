'use client';

import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { BlurFade } from '@/components/magicui/blur-fade';
import { NumberTicker } from '@/components/magicui/number-ticker';

const Particles = dynamic(
  () => import('@/components/magicui/particles').then((mod) => ({ default: mod.Particles })),
  { ssr: false }
);

const stats = [
  {
    value: 40,
    suffix: '%',
    label: 'menos costes',
    description: 'operativos de media',
  },
  {
    value: 300,
    suffix: '+',
    label: 'negocios',
    description: 'automatizados con éxito',
  },
  {
    value: 98,
    suffix: '%',
    label: 'satisfacción',
    description: 'de nuestros clientes',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'disponibilidad',
    description: 'atención automatizada',
  },
];

export function Stats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="stats" className="relative bg-[#0A0A0A] py-24 overflow-hidden">
      {/* Particles Background */}
      {!shouldReduceMotion && (
        <Particles
          className="absolute inset-0"
          quantity={200}
          color="#2563EB"
          size={2}
          staticity={30}
          ease={50}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Resultados que hablan por sí solos
          </h2>
          <p className="text-[#9CA3AF] text-center max-w-xl mx-auto mb-16">
            Números reales de clientes que han transformado su negocio con nuestras soluciones
          </p>
        </BlurFade>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <BlurFade key={stat.label} delay={0.2 + index * 0.1} inView>
              <div className="text-center">
                <div className="flex items-baseline justify-center">
                  <NumberTicker
                    value={stat.value}
                    delay={0.3 + index * 0.15}
                    className="text-5xl md:text-6xl font-bold text-white"
                  />
                  <span className="text-3xl md:text-4xl font-bold text-[#2563EB] ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-3">
                  {stat.label}
                </h3>
                <p className="text-sm text-[#9CA3AF] mt-1">
                  {stat.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
