'use client';

import { PiggyBank, Zap, TrendingUp } from 'lucide-react';
import { VitaEonCard } from '@/components/ui/VitaEonCard';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

const benefits = [
  {
    title: 'Ahorro de Costes',
    description:
      'Reduce hasta un 40% los costes operativos automatizando tareas repetitivas y liberando tiempo de tu equipo para lo que realmente importa.',
    icon: PiggyBank,
    gradient: 'from-blue-500 to-cyan-500',
    shimmerGradient: { from: '#3b82f6', to: '#06b6d4' },
    shineColor: ['#06b6d4', '#3b82f6', '#06b6d4'], // cyan-blue
  },
  {
    title: 'Eficiencia Operativa',
    description:
      'Optimiza tus procesos con flujos de trabajo inteligentes que eliminan errores y reducen tiempos de ejecucion.',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    shimmerGradient: { from: '#a855f7', to: '#ec4899' },
    shineColor: ['#ec4899', '#a855f7', '#ec4899'], // pink-purple
  },
  {
    title: 'Escalabilidad',
    description:
      'Crece sin aumentar proporcionalmente tu equipo. La automatizacion te permite atender mas clientes con los mismos recursos.',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-red-500',
    shimmerGradient: { from: '#f97316', to: '#ef4444' },
    shineColor: ['#ef4444', '#f97316', '#ef4444'], // red-orange
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
            Por que automatizar
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <p className="text-xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
            La automatizacion inteligente transforma tu negocio
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <BlurFade key={benefit.title} delay={0.3 + index * 0.15} inView className="h-full">
                <VitaEonCard glowColor="blue" showAccentLine className="h-full p-8">
                  <div className="flex flex-col items-center text-center h-full group">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon size={32} strokeWidth={1.5} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed flex-grow">{benefit.description}</p>
                    <ShimmerButton
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      background={`linear-gradient(to right, ${benefit.shimmerGradient.from}, ${benefit.shimmerGradient.to})`}
                      shimmerColor="#ffffff"
                      shineColor={benefit.shineColor}
                      borderRadius="12px"
                      className="mt-auto pt-6 w-full"
                    >
                      Descubrir cómo
                    </ShimmerButton>
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
