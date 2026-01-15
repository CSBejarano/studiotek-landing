'use client';

import { Button } from '../ui/Button';
import { AnimatedGridPattern } from '../magicui/animated-grid-pattern';
import { TextAnimate } from '../magicui/text-animate';
import { BlurFade } from '../magicui/blur-fade';
import { ShimmerButton } from '../magicui/shimmer-button';
import { FloatingOrbs } from '../ui/FloatingOrbs';
import { OrbitingCircles } from '../magicui/orbiting-circles';

export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden"
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

      {/* Orbiting circles decoration */}
      <div className="absolute top-1/4 right-10 lg:right-1/4 opacity-30 pointer-events-none z-0">
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
        <BlurFade delay={0.1} inView>
          <TextAnimate
            as="h1"
            animation="blurInUp"
            by="word"
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            delay={0.2}
            duration={0.8}
          >
            Automatiza tu negocio con Inteligencia Artificial
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mt-8">
            Ayudamos a PYMEs a reducir costes y escalar operaciones mediante soluciones de IA personalizadas
          </p>
        </BlurFade>

        <BlurFade delay={0.6} inView>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <ShimmerButton
              shimmerColor="#ffffff"
              shimmerSize="0.05em"
              shimmerDuration="3s"
              background="rgba(59, 130, 246, 1)"
              shineColor={["#60a5fa", "#3b82f6", "#60a5fa"]}
              borderRadius="12px"
              className="text-lg px-8 py-4 font-semibold"
              onClick={() => scrollToSection('contact')}
            >
              Solicita una consulta gratuita
            </ShimmerButton>

            <Button
              variant="secondary"
              onClick={() => scrollToSection('services')}
            >
              Ver servicios
            </Button>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
