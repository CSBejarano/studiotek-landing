'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Rocket, Lightbulb, GraduationCap } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { CarouselCard, CardData } from '@/components/ui/CarouselCard';
import { HeroServiceCard } from '@/components/ui/HeroServiceCard';
import { ServiceModal } from '@/components/ui/ServiceModal';
import { useExpandingCard } from '@/hooks/useExpandingCard';

// ---------------------------------------------------------------------------
// Services Data (3 cards)
// ---------------------------------------------------------------------------

const services = [
  {
    title: 'Consultoria Estrategica',
    description:
      'Analizamos tu negocio y disenamos un plan de automatizacion con ROI claro. Sabras cuanto ahorraras antes de empezar.',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-600',
    category: 'Estrategia',
    features: [
      'Auditoria completa de procesos',
      'Identificacion de cuellos de botella',
      'Roadmap de implementacion',
      'Calculo de ROI proyectado',
      'Priorizacion de iniciativas',
      'Benchmarking con tu sector',
    ],
    benefits: ['Claridad sobre donde invertir', 'Decisiones basadas en datos'],
    shimmerGradient: { from: '#f59e0b', to: '#ea580c' },
    image: '/images/generated/service-consultoria.webp',
  },
  {
    title: 'Implementacion de IA',
    description:
      'Chatbots WhatsApp con IA, reservas automaticas y flujos sin intervencion. Para clinicas, barberias, estudios de tatuaje e inmobiliarias.',
    icon: Rocket,
    gradient: 'from-blue-600 to-indigo-600',
    category: 'Desarrollo',
    features: [
      'Chatbots con IA conversacional',
      'Automatizacion de procesos repetitivos',
      'Integraciones con tu stack existente',
      'Dashboards en tiempo real',
      'APIs personalizadas',
      'Soporte tecnico 24/7',
    ],
    benefits: ['Reduce 70% el tiempo en tareas manuales', 'Disponibilidad 24/7'],
    shimmerGradient: { from: '#2563eb', to: '#4f46e5' },
    image: '/images/generated/service-implementacion-ia.webp',
  },
  {
    title: 'Formacion y Capacitacion',
    description:
      'Tu equipo domina la IA en dias, no meses. Formacion practica con casos reales de salud, belleza e inmobiliaria.',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    category: 'Educacion',
    features: [
      'Workshops practicos hands-on',
      'Certificaciones oficiales',
      'Material actualizado',
      'Sesiones de seguimiento',
      'Casos de uso reales del sector',
      'Soporte post-formacion',
    ],
    benefits: ['Equipo autonomo y capacitado', 'Adopcion rapida'],
    shimmerGradient: { from: '#10b981', to: '#0d9488' },
    image: '/images/generated/service-formacion.webp',
  },
];

// ---------------------------------------------------------------------------
// Transform to CardData format
// ---------------------------------------------------------------------------

const servicesCardData: CardData[] = services.map((service) => ({
  title: service.title,
  category: service.category,
  gradient: service.gradient,
  icon: service.icon,
  image: service.image,
  content: (
    <div className="space-y-6">
      <p className="text-white/80 text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed">{service.description}</p>

      {service.benefits && (
        <div className="flex flex-wrap gap-3">
          {service.benefits.map((benefit: string) => (
            <span
              key={benefit}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20"
            >
              {benefit}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.3] text-white">Que incluye?</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`,
                }}
              />
              <span className="text-white/70">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 min-h-[44px] rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`,
          }}
        >
          Solicitar informacion
        </button>
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 min-h-[44px] rounded-xl font-semibold text-white transition-all duration-300 hover:bg-white/10 border border-white/20"
        >
          Agendar llamada
        </button>
      </div>
    </div>
  ),
}));

// Hero card data (index 1 = Implementacion de IA)
const heroCardData = servicesCardData[1];

// Indices: 0=Consultoria(left), 1=Implementacion(hero/center), 2=Formacion(right)
const HERO_INDEX = 1;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track active slide on scroll
  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / servicesCardData.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlide(Math.min(index, servicesCardData.length - 1));
  }, []);

  const {
    sectionRef,
    overlayRef,
    bgHeroRef,
    sideCardLeftRef,
    sideCardRightRef,
    centerCardRef,
    titleRef,
    heroTitleRef,
  } = useExpandingCard(isDesktop);

  useEffect(() => {
    setMounted(true);
    // Check if desktop (expanding card only on md+)
    const mql = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Voice agent custom event listener
  useEffect(() => {
    const handleVoiceOpenModal = (event: CustomEvent<{ index: number }>) => {
      const { index } = event.detail;
      if (index >= 0 && index < servicesCardData.length) {
        setOpenIndex(index);
      }
    };

    document.addEventListener(
      'voice-open-service-modal',
      handleVoiceOpenModal as EventListener
    );

    return () => {
      document.removeEventListener(
        'voice-open-service-modal',
        handleVoiceOpenModal as EventListener
      );
    };
  }, []);

  // Body scroll lock for modal
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  const handleOpen = (index: number) => setOpenIndex(index);
  const handleClose = () => setOpenIndex(null);
  const handleNext = () => {
    if (openIndex !== null && openIndex < servicesCardData.length - 1) {
      setOpenIndex(openIndex + 1);
    }
  };
  const handlePrev = () => {
    if (openIndex !== null && openIndex > 0) {
      setOpenIndex(openIndex - 1);
    }
  };

  // ─── MOBILE / REDUCED-MOTION LAYOUT ─────────────────────────────────
  if (!isDesktop || prefersReducedMotion) {
    return (
      <section id="services" className="relative bg-[#0A0A0A] py-[clamp(4rem,8vw,8rem)] overflow-hidden">
        {/* Glow connector from Benefits - very subtle radial at top */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at center top, rgba(59,130,246,0.02) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.015] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.15] tracking-tight text-center text-white">
            Nuestros Servicios
          </h2>
          <p className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed text-white/60 text-center mt-3 max-w-2xl mx-auto">
            Automatizacion real para negocios de servicios
          </p>

          {/* Mobile: horizontal swipe carousel */}
          <div className="mt-10 sm:hidden">
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2"
            >
              {servicesCardData.map((card, index) => (
                <div
                  key={card.title}
                  className="flex-shrink-0 w-[46%] snap-start first:ml-4 last:mr-4"
                >
                  <CarouselCard
                    card={card}
                    index={index}
                    onClick={() => handleOpen(index)}
                  />
                </div>
              ))}
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {servicesCardData.map((card, i) => (
                <button
                  key={card.title}
                  onClick={() => {
                    const el = carouselRef.current;
                    if (!el) return;
                    const cardWidth = el.scrollWidth / servicesCardData.length;
                    el.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center`}
                  aria-label={`Ir a servicio ${i + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      activeSlide === i
                        ? 'w-6 h-2 bg-[#2563EB]'
                        : 'w-2 h-2 bg-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tablet+: 3-col grid */}
          <div className="mt-10 hidden sm:grid grid-cols-3 gap-5">
            {servicesCardData.map((card, index) => (
              <CarouselCard
                key={card.title}
                card={card}
                index={index}
                onClick={() => handleOpen(index)}
              />
            ))}
          </div>
        </div>

        {mounted &&
          createPortal(
            <ServiceModal
              card={openIndex !== null ? servicesCardData[openIndex] : null}
              onClose={handleClose}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={openIndex !== null && openIndex < servicesCardData.length - 1}
              hasPrev={openIndex !== null && openIndex > 0}
            />,
            document.body
          )}
      </section>
    );
  }

  // ─── DESKTOP LAYOUT (>= 768px) -- Expanding Card ──────────────
  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-screen overflow-hidden"
    >
      {/* ── CAPA 0: Hero Card de Fondo (z-0) ── */}
      <div
        ref={bgHeroRef}
        className="absolute inset-0 z-0"
      >
        <HeroServiceCard card={heroCardData} />

        {/* Gradiente semi-transparente para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/40 to-transparent pointer-events-none" />

        {/* Marco decorativo glass-morphism (estilo Revolut) */}
        <div className="absolute top-[8%] right-[8%] bottom-[8%] left-[38%] md:left-[25%] lg:left-[38%] border border-white/15 rounded-3xl pointer-events-none" />
      </div>

      {/* ── Hero Title (z-5) - Visible in initial state, top-left ── */}
      <div
        ref={heroTitleRef}
        className="absolute z-15 top-[15%] left-[5%] lg:left-[6%] max-w-[35%] pointer-events-none"
      >
        <p className="text-[clamp(0.75rem,1vw,0.875rem)] font-medium tracking-widest uppercase text-white/50 mb-4">
          {heroCardData.category}
        </p>
        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white mb-6">
          {heroCardData.title}
        </h2>
        <p className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed text-white/60 max-w-md">
          Chatbots con IA, reservas automaticas y flujos sin intervencion humana.
        </p>
      </div>

      {/* ── CAPA 1: Overlay con clip-path (z-10) ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-[#0A0A0A]"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.015] via-transparent to-transparent pointer-events-none" />

        {/* Content container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div ref={titleRef} className="text-center mb-10">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.15] tracking-tight text-white">
              Nuestros Servicios
            </h2>
            <p className="text-[clamp(1rem,1.5vw,1.125rem)] font-normal leading-relaxed text-white/60 mt-4 max-w-2xl mx-auto">
              Automatizacion real para negocios de servicios
            </p>
          </div>

          {/* Grid of 3 Cards */}
          <div className="grid grid-cols-3 gap-5 w-full max-w-5xl">
            {/* Card 0: Consultoria (Left) */}
            <div ref={sideCardLeftRef}>
              <CarouselCard
                card={servicesCardData[0]}
                index={0}
                onClick={() => handleOpen(0)}
              />
            </div>

            {/* Card 1: Implementacion (Center - Hero) */}
            <div ref={centerCardRef}>
              <CarouselCard
                card={servicesCardData[HERO_INDEX]}
                index={HERO_INDEX}
                onClick={() => handleOpen(HERO_INDEX)}
              />
            </div>

            {/* Card 2: Formacion (Right) */}
            <div ref={sideCardRightRef}>
              <CarouselCard
                card={servicesCardData[2]}
                index={2}
                onClick={() => handleOpen(2)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ServiceModal Portal ── */}
      {mounted &&
        createPortal(
          <ServiceModal
            card={openIndex !== null ? servicesCardData[openIndex] : null}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={openIndex !== null && openIndex < servicesCardData.length - 1}
            hasPrev={openIndex !== null && openIndex > 0}
          />,
          document.body
        )}
    </section>
  );
}
