'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Moon, Users, Database, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { BorderBeam } from '@/components/magicui/border-beam';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Scene {
  id: string;
  tabLabel: string;
  headline: string;
  subheadline: string;
  solution: string;
  stat: {
    value: number | null;
    suffix?: string;
    text?: string;
    label: string;
  };
  icon: LucideIcon;
  image: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const scenes: Scene[] = [
  {
    id: 'tiempo',
    tabLabel: 'Tiempo',
    headline: '15 horas a la semana en tareas manuales',
    subheadline:
      'Eso son 2 días laborables que tu equipo dedica a copiar datos, responder lo mismo y perseguir confirmaciones.',
    solution:
      'Automatiza procesos repetitivos y libera a tu equipo para lo que genera ingresos reales',
    stat: { value: 15, suffix: 'h', label: 'perdidas a la semana' },
    icon: Clock,
    image: '/images/generated/pain-sin-tiempo.webp',
  },
  {
    id: 'clientes',
    tabLabel: 'Clientes',
    headline: '6 de cada 10 consultas llegan cuando estás cerrado',
    subheadline:
      'Sin nadie que responda, esos clientes potenciales llaman a tu competencia. O peor: desaparecen para siempre.',
    solution:
      'Un asistente IA que responde 24/7, cualifica leads y agenda citas mientras duermes',
    stat: { value: 60, suffix: '%', label: 'fuera de horario' },
    icon: Moon,
    image: '/images/generated/pain-clientes-night.webp',
  },
  {
    id: 'equipo',
    tabLabel: 'Equipo',
    headline: 'Perder un empleado te cuesta 6-9 meses de salario',
    subheadline:
      'No es solo el coste de reemplazo. Es el conocimiento perdido, los proyectos parados y la moral del equipo que se queda sobrecargado.',
    solution:
      'IA para lo repetitivo, humanos para lo estratégico. Recupera motivación y retén talento',
    stat: { value: null, text: '6-9 meses', label: 'coste de reemplazo' },
    icon: Users,
    image: '/images/generated/pain-procesos-manuales.webp',
  },
  {
    id: 'datos',
    tabLabel: 'Datos',
    headline: '73% de tus datos nunca se usan',
    subheadline:
      'Informes que nadie lee, CRMs desactualizados, métricas en 5 herramientas distintas. Tienes la información, pero no la visibilidad para actuar.',
    solution:
      'Centraliza y conecta tus datos. Decisiones basadas en hechos, no en intuición',
    stat: { value: 73, suffix: '%', label: 'datos sin explotar' },
    icon: Database,
    image: '/images/generated/pain-datos-new.webp',
  },
];

const ROTATE_INTERVAL = 6000;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PainPointsPAS() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentScene = scenes[activeIndex];
  const Icon = currentScene.icon;

  // Auto-rotate
  const rotate = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % scenes.length);
  }, []);

  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    const interval = setInterval(rotate, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, rotate]);

  const scrollToContact = useCallback(() => {
    document
      .getElementById('contacto')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const duration = shouldReduceMotion ? 0 : 0.5;

  return (
    <section
      data-section="pain-points-pas"
      role="region"
      aria-label="Problemas que resolvemos"
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ---- Background images with crossfade ---- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          aria-hidden="true"
        >
          <Image
            src={currentScene.image}
            alt=""
            fill
            className="object-cover brightness-[0.45]"
            priority={activeIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ---- Dark overlay ---- */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"
        aria-hidden="true"
      />

      {/* ---- Content layer ---- */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top: headline + subheadline + CTA */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentScene.id}`}
              className="flex flex-col items-center text-center gap-5 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.9),0_4px_24px_rgba(0,0,0,0.5)]">
                {currentScene.headline}
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-xl leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                {currentScene.subheadline}
              </p>

              <button
                onClick={scrollToContact}
                className="mt-2 px-8 py-3.5 rounded-full bg-white text-[#0A0A0A] font-semibold text-sm sm:text-base hover:bg-white/90 transition-colors duration-200 cursor-pointer shadow-lg"
              >
                Descubre cómo
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Card: Revolut-style glassmorphism mockup */}
        <div className="flex justify-center px-6 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`card-${currentScene.id}`}
              className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.1 }}
            >
              <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col items-center text-center gap-1">
                {/* Short label */}
                <span className="text-xs text-white/40 tracking-widest uppercase">
                  {currentScene.stat.label}
                </span>

                {/* Big stat */}
                <div key={currentScene.id}>
                  {currentScene.stat.value !== null ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                        <NumberTicker
                          value={currentScene.stat.value}
                          className="text-white"
                          delay={0.2}
                        />
                      </span>
                      {currentScene.stat.suffix && (
                        <span className="text-3xl sm:text-4xl font-bold text-white/40">
                          {currentScene.stat.suffix}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
                      {currentScene.stat.text}
                    </span>
                  )}
                </div>

                {/* Badge */}
                <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-white/50">
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {currentScene.tabLabel}
                </span>
              </div>

              <BorderBeam
                colorFrom="#ffffff"
                colorTo="transparent"
                size={60}
                duration={8}
                borderWidth={1}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <nav
          className="flex justify-center gap-2 sm:gap-3 px-4 pb-8 sm:pb-10 pt-2"
          aria-label="Seleccionar problema"
        >
          {scenes.map((scene, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={scene.id}
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                aria-label={`Ver: ${scene.tabLabel}`}
                className={`
                  px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                  transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? 'bg-white text-[#0A0A0A] shadow-lg'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {scene.tabLabel}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
