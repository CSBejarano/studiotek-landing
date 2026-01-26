'use client';

import Image from 'next/image';
import { VitaEonCard } from '@/components/ui/VitaEonCard';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

const benefits = [
  {
    title: 'Ahorra 2.500 euros/mes',
    description:
      'Reduce un 40% los costes automatizando tareas repetitivas. Cero errores, cero horas extra.',
    gradient: 'from-blue-500 to-cyan-500',
    shimmerGradient: { from: '#3b82f6', to: '#06b6d4' },
    shineColor: ['#06b6d4', '#3b82f6', '#06b6d4'],
    image: '/images/generated/benefit-ahorro-costes.webp',
    cta: 'Calcular mi ahorro',
  },
  {
    title: 'Atiende 3x más clientes',
    description:
      'Procesos 5x más rápidos = más clientes atendidos al día. Crece sin contratar.',
    gradient: 'from-purple-500 to-pink-500',
    shimmerGradient: { from: '#a855f7', to: '#ec4899' },
    shineColor: ['#ec4899', '#a855f7', '#ec4899'],
    image: '/images/generated/benefit-eficiencia.webp',
    cta: 'Ver cómo funciona',
  },
  {
    title: 'Nunca pierdas un cliente',
    description:
      'Respuesta instantánea 24/7. El 98% de clientes reporta mayor satisfacción de usuarios.',
    gradient: 'from-orange-500 to-red-500',
    shimmerGradient: { from: '#f97316', to: '#ef4444' },
    shineColor: ['#ef4444', '#f97316', '#ef4444'],
    image: '/images/generated/benefit-escalabilidad.webp',
    cta: 'Empezar ahora',
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative bg-slate-950 py-24 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <BlurFade delay={0.1} inView>
          <TextAnimate
            as="h2"
            animation="blurInUp"
            by="word"
            className="text-4xl md:text-5xl font-bold text-center text-white"
            delay={0.1}
            duration={0.6}
          >
            El ROI de automatizar con IA
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <p className="text-xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
            Números reales de clientes como tú
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => {
            return (
              <BlurFade key={benefit.title} delay={0.3 + index * 0.15} inView className="h-full">
                <VitaEonCard glowColor="blue" showAccentLine className="h-full">
                  <div className="relative h-full">
                    {/* Imagen de fondo */}
                    {benefit.image && (
                      <div className="absolute inset-0 opacity-50 overflow-hidden rounded-xl">
                        <Image
                          src={benefit.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    {/* Contenido */}
                    <div className="relative z-10 flex flex-col items-center text-center h-full group p-8 pt-12">
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed flex-grow">{benefit.description}</p>
                      <ShimmerButton
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        background={`linear-gradient(to right, ${benefit.shimmerGradient.from}, ${benefit.shimmerGradient.to})`}
                        shimmerColor="#ffffff"
                        shineColor={benefit.shineColor}
                        borderRadius="12px"
                        className="mt-auto pt-6 w-full"
                      >
                        {benefit.cta}
                      </ShimmerButton>
                    </div>
                  </div>
                </VitaEonCard>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
