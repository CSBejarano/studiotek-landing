'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const }
  }
};

const steps = [
  {
    number: '01',
    title: 'Analizamos tu negocio',
    description: 'Identificamos los procesos que más tiempo te quitan y diseñamos la solución perfecta.',
    gradient: 'from-blue-500 to-cyan-500',
    cardGradient: 'from-blue-500/20 to-cyan-500/20',
    glowColor: '59, 130, 246',
    image: '/images/generated/step-analisis.webp',
  },
  {
    number: '02',
    title: 'Diseñamos la estrategia',
    description: 'Creamos un plan de automatización con objetivos claros y ROI definido.',
    gradient: 'from-violet-500 to-purple-500',
    cardGradient: 'from-violet-500/20 to-purple-500/20',
    glowColor: '139, 92, 246',
    image: '/images/generated/step-planificacion.webp',
  },
  {
    number: '03',
    title: 'Implementamos la IA',
    description: 'Desarrollamos y desplegamos tu solución en semanas, no meses.',
    gradient: 'from-amber-500 to-orange-500',
    cardGradient: 'from-amber-500/20 to-orange-500/20',
    glowColor: '245, 158, 11',
    image: '/images/generated/step-implementacion.webp',
  },
  {
    number: '04',
    title: 'Monitorizamos resultados',
    description: 'Seguimiento continuo para asegurar que todo funciona perfectamente.',
    gradient: 'from-emerald-500 to-green-500',
    cardGradient: 'from-emerald-500/20 to-green-500/20',
    glowColor: '16, 185, 129',
    image: '/images/generated/step-monitoreo.webp',
  },
  {
    number: '05',
    title: 'Optimizamos sin parar',
    description: 'Mejoras constantes basadas en datos reales de tu negocio.',
    gradient: 'from-pink-500 to-rose-500',
    cardGradient: 'from-pink-500/20 to-rose-500/20',
    glowColor: '236, 72, 153',
    image: '/images/generated/step-optimizacion.webp',
  },
  {
    number: '06',
    title: 'Tu negocio transformado',
    description: 'Disfrutas de un negocio más eficiente, rentable y escalable.',
    gradient: 'from-teal-500 to-cyan-500',
    cardGradient: 'from-teal-500/20 to-cyan-500/20',
    glowColor: '20, 184, 166',
    image: '/images/generated/step-entrega.webp',
  },
];

export function HowItWorks() {
  // Illuminated steps accumulate: [] -> [0] -> [0,1] -> [0,1,2] -> [0,1,2,3] -> [] (reset)
  const [illuminatedSteps, setIlluminatedSteps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const STEP_DURATION = 3000; // 3 seconds between each step illumination

  // Auto-cycle effect - accumulative illumination
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const timeout = setTimeout(() => {
      setIlluminatedSteps((prev) => {
        // If all steps are illuminated, reset
        if (prev.length >= steps.length) {
          return [];
        }
        // Add next step to illuminated array
        return [...prev, prev.length];
      });
    }, STEP_DURATION);

    return () => clearTimeout(timeout);
  }, [isPaused, shouldReduceMotion, illuminatedSteps]);

  const handleCardHover = useCallback((index: number) => {
    setIsPaused(true);
    // On hover, illuminate up to and including the hovered card
    setIlluminatedSteps(Array.from({ length: index + 1 }, (_, i) => i));
  }, []);

  const handleCardLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <section id="how-it-works" className="relative bg-slate-950 py-24 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950 pointer-events-none" />

      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

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
            Cómo Trabajamos
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <p className="text-xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
            Un proceso probado para transformar tu negocio
          </p>
        </BlurFade>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20"
          role="list"
          aria-label="Pasos de nuestro proceso de trabajo"
        >
          {steps.map((step, index) => {
            const isIlluminated = illuminatedSteps.includes(index);
            const isLatest = illuminatedSteps.length > 0 && illuminatedSteps[illuminatedSteps.length - 1] === index;

            return (
              <Fragment key={step.number}>
                {/* Card */}
                <motion.div
                  variants={itemVariants}
                  className="group relative"
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={handleCardLeave}
                  role="listitem"
                  aria-current={isLatest ? 'step' : undefined}
                >
                  <motion.div
                    animate={shouldReduceMotion ? {} : {
                      scale: isIlluminated ? 1.02 : 0.98,
                      opacity: isIlluminated ? 1 : 0.6,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{
                      boxShadow: isIlluminated && !shouldReduceMotion
                        ? `0 0 40px rgba(${step.glowColor}, 0.3), 0 0 80px rgba(${step.glowColor}, 0.15)`
                        : 'none',
                    }}
                    className="h-full"
                  >
                    <div className={`
                      relative overflow-hidden rounded-2xl
                      bg-slate-900/80
                      backdrop-blur-xl
                      border transition-colors duration-500
                      ${isIlluminated ? 'border-white/30' : 'border-white/10'}
                      p-8
                      min-h-[280px]
                      h-full
                    `}>
                      {/* Background image */}
                      {step.image && (
                        <div className="absolute inset-0 opacity-90 overflow-hidden rounded-2xl">
                          <Image
                            src={step.image}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
                        </div>
                      )}

                      {/* Dot pattern inside card */}
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                          backgroundSize: '16px 16px',
                        }}
                      />

                      {/* Glow effect */}
                      <motion.div
                        className={`
                          absolute -top-20 -right-20 w-40 h-40
                          bg-gradient-to-br ${step.cardGradient}
                          rounded-full blur-3xl
                          pointer-events-none
                        `}
                        animate={{
                          opacity: isIlluminated ? 0.6 : 0,
                        }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center text-center pt-4">
                        {/* Step number badge with check when illuminated */}
                        <motion.div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg mb-6`}
                          animate={{
                            scale: isLatest ? [1, 1.1, 1] : 1,
                          }}
                          transition={{
                            duration: 0.5,
                            ease: 'easeInOut',
                          }}
                        >
                          {isIlluminated ? (
                            <Check size={18} strokeWidth={2.5} />
                          ) : (
                            step.number
                          )}
                        </motion.div>

                        {/* Title */}
                        <h3 className={`text-2xl font-semibold mb-4 transition-colors duration-500 ${isIlluminated ? 'text-white' : 'text-white/80'}`}>
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className={`text-base leading-relaxed transition-colors duration-500 ${isIlluminated ? 'text-slate-300' : 'text-slate-400'}`}>
                          {step.description}
                        </p>
                      </div>

                      {/* Active indicator line at bottom */}
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient}`}
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: isIlluminated ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease: 'easeOut',
                        }}
                        style={{ originX: 0 }}
                      />

                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    </div>
                  </motion.div>
                </motion.div>

              </Fragment>
            );
          })}
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((step, index) => {
            const isIlluminated = illuminatedSteps.includes(index);
            return (
              <button
                key={step.number}
                onClick={() => {
                  // Illuminate up to and including this step
                  setIlluminatedSteps(Array.from({ length: index + 1 }, (_, i) => i));
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 5000);
                }}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300 bg-slate-500
                  ${isIlluminated ? 'scale-125 opacity-100' : 'opacity-50'}
                `}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
