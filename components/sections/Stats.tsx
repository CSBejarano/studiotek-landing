'use client';

import { BlurFade } from '@/components/magicui/blur-fade';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Particles } from '@/components/magicui/particles';

const stats = [
  {
    value: 40,
    suffix: '%',
    label: 'Reduccion de costes',
    description: 'promedio en operaciones',
  },
  {
    value: 150,
    suffix: '+',
    label: 'Proyectos completados',
    description: 'con exito',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Satisfaccion del cliente',
    description: 'indice de retencion',
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Soporte disponible',
    description: 'para tu negocio',
  },
];

export function Stats() {
  return (
    <section className="relative bg-slate-950 py-24 overflow-hidden">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={200}
        color="#60a5fa"
        size={2}
        staticity={30}
        ease={50}
      />


      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Resultados que hablan por si solos
          </h2>
          <p className="text-slate-400 text-center max-w-xl mx-auto mb-16">
            Numeros reales de clientes que han transformado su negocio con nuestras soluciones
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
                  <span className="text-3xl md:text-4xl font-bold text-blue-400 ml-1">
                    {stat.suffix}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-3">
                  {stat.label}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
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
