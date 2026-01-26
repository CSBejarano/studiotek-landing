'use client';

import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import { TextAnimate } from '../magicui/text-animate';
import { BlurFade } from '../magicui/blur-fade';
import { FloatingOrbs } from '../ui/FloatingOrbs';
import { OrbitingCircles } from '../magicui/orbiting-circles';
import { HeroAIChat } from '../ui/HeroAIChat';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden py-20"
    >
      {/* Animated Grid Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={3}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
      />

      {/* Floating decorative orbs */}
      <FloatingOrbs color="blue" count={2} className="opacity-50" />

      {/* Orbiting circles decoration - left side */}
      <div className="absolute top-1/3 left-10 lg:left-1/6 opacity-20 pointer-events-none z-0">
        <div className="relative h-32 w-32">
          <OrbitingCircles
            radius={50}
            duration={18}
            path={false}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400/50" />
          </OrbitingCircles>
          <OrbitingCircles
            radius={70}
            duration={22}
            reverse
            path={false}
          >
            <div className="h-2 w-2 rounded-full bg-blue-500/40" />
          </OrbitingCircles>
        </div>
      </div>

      {/* Orbiting circles decoration - right side */}
      <div className="absolute top-1/4 right-10 lg:right-1/6 opacity-20 pointer-events-none z-0">
        <div className="relative h-40 w-40">
          <OrbitingCircles
            radius={60}
            duration={20}
            path={false}
          >
            <div className="h-3 w-3 rounded-full bg-blue-500/40" />
          </OrbitingCircles>
          <OrbitingCircles
            radius={80}
            duration={25}
            reverse
            path={false}
          >
            <div className="h-2 w-2 rounded-full bg-cyan-400/40" />
          </OrbitingCircles>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Logo badge */}
        <BlurFade delay={0.05} inView>
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">Asistente IA disponible 24/7</span>
          </div>
        </BlurFade>

        <BlurFade delay={0.1} inView>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            {/* Main keyword - SEO critical */}
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="block mb-2"
              delay={0.2}
              duration={0.8}
            >
              Automatización IA
            </TextAnimate>

            {/* Secondary keyword */}
            <span className="block text-slate-400 text-3xl md:text-4xl lg:text-5xl mb-4">
              para empresas
            </span>

            {/* Benefit highlight - visual impact */}
            <span className="block">
              <span className="text-emerald-400">Ahorra 40%</span>
              <span className="text-slate-300 text-3xl md:text-4xl lg:text-5xl"> en costes</span>
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <div className="max-w-3xl mx-auto mt-8 mb-12 space-y-4">
            {/* Benefit bullets - scaneable */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base md:text-lg">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>Atención cliente <span className="text-emerald-400 font-semibold">24/7</span></span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2 text-slate-300">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>Tareas <span className="text-emerald-400 font-semibold">automatizadas</span></span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2 text-slate-300">
                <div className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>Ahorra <span className="text-emerald-400 font-semibold">2.500€/mes</span></span>
              </div>
            </div>

            {/* Supporting copy - shorter */}
            <p className="text-slate-400 text-sm md:text-base">
              Implementamos soluciones de IA que empresas españolas ya usan para reducir costes operativos
            </p>
          </div>
        </BlurFade>

        {/* AI Chat Input - Centro del Hero */}
        <BlurFade delay={0.6} inView>
          <HeroAIChat />
        </BlurFade>

        {/* Trust indicators */}
        <BlurFade delay={0.8} inView>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-16 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Sin compromiso</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Respuesta inmediata</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Consulta gratuita</span>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
