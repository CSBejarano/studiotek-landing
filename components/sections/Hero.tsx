'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { TextAnimate } from '../magicui/text-animate';
import { BlurFade } from '../magicui/blur-fade';
import RotatingText from '../magicui/rotating-text';
import { ShimmerButton } from '../magicui/shimmer-button';
import { BorderBeam } from '../magicui/border-beam';
import { useResponsiveParticles } from '@/hooks/useResponsiveParticles';


// Dynamic import for heavy canvas component (perf optimization)
const Particles = dynamic(
  () => import('../magicui/particles').then((mod) => ({ default: mod.Particles })),
  { ssr: false }
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const particleQuantity = useResponsiveParticles();

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen-safe flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] pt-16 pb-10 sm:pt-20 sm:pb-16"
      aria-label="Hero principal de StudioTek"
    >
      {/* Particles Background - conditionally rendered */}
      {!shouldReduceMotion && (
        <Particles
          className="absolute inset-0 z-0"
          quantity={particleQuantity}
          color="#2563EB"
          ease={80}
          size={0.6}
          staticity={40}
          refresh
        />
      )}

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] z-[1]" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Badge */}
        <BlurFade delay={0.1} inView>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-[#9CA3AF] mb-4 sm:mb-6 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
            Automatización con IA
          </span>
        </BlurFade>

        {/* H1: Static + WordRotate (max 8 words visible at any time) */}
        <TextAnimate
          animation="blurInUp"
          by="word"
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
        >
          Automatiza tu
        </TextAnimate>

        <BlurFade delay={0.1} inView>
          <div className="overflow-hidden max-w-[90vw] sm:max-w-none">
            <RotatingText
              texts={[
                'reservas y citas',
                'atención al cliente',
                'facturación',
                'gestión de leads',
                'procesos internos',
              ]}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              mainClassName="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-1 sm:mt-2 text-[#3B82F6] whitespace-nowrap"
              staggerDuration={0.03}
              rotationInterval={3000}
            />
          </div>
        </BlurFade>

        {/* Gradient accent line */}
        <BlurFade delay={0.2} inView>
          <p className="mt-3 sm:mt-4 text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
            Menos tareas manuales. Más crecimiento.
          </p>
        </BlurFade>

        {/* Subheadline (max 20 words) */}
        <BlurFade delay={0.3} inView>
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Chatbots con IA, reservas automáticas y flujos sin intervención manual
            para clínicas, barberías, inmobiliarias y más.
          </p>
        </BlurFade>

        {/* Primary CTA + Secondary CTA */}
        <BlurFade delay={0.4} inView>
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative rounded-full w-full sm:w-auto">
              <ShimmerButton
                shimmerColor="#2563EB"
                background="#1D4ED8"
                className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-lg font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Empieza Ahora
              </ShimmerButton>
              <BorderBeam
                size={25}
                duration={4}
                borderWidth={1.5}
                colorFrom="#2563EB"
                colorTo="transparent"
              />
            </div>
            <button
              className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Demo
            </button>
          </div>
        </BlurFade>

        {/* Social Proof Bar */}
        <BlurFade delay={0.45} inView>
          <div className="mt-6 sm:mt-10 w-full max-w-3xl mx-auto border-t border-white/10 pt-5 sm:pt-8">
            {/* Headline */}
            <p className="text-xs sm:text-sm text-[#9CA3AF] text-center mb-4 sm:mb-6">
              Resultados reales de negocios que ya automatizan con nosotros
            </p>

            {/* Stats Grid - flex wrap on mobile for better 375px fit */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 sm:grid sm:grid-cols-4 sm:gap-6 mb-4 sm:mb-6">
              {[
                { value: '15h', label: 'Ahorradas por semana' },
                { value: '3x', label: 'Más capacidad' },
                { value: '98%', label: 'Satisfacción' },
                { value: '24/7', label: 'Disponibilidad IA' },
              ].map((stat) => (
                <div key={stat.label} className="text-center min-w-[70px]">
                  <p className="text-xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] sm:text-sm text-[#9CA3AF] mt-0.5 sm:mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Sector Pills - scrollable on very narrow screens */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {['Clínicas y Salud', 'Barbería', 'Tatuajes', 'Inmobiliaria'].map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-[#9CA3AF]"
                >
                  {sector}
                </span>
              ))}
            </div>

            {/* Trust Line */}
            <p className="text-[10px] sm:text-xs text-[#9CA3AF]/60 text-center">
              Certificados en IA responsable y RGPD compliant
            </p>
          </div>
        </BlurFade>

      </div>
    </section>
  );
}
