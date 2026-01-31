'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rocket, Lightbulb, GraduationCap, Cpu } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { CarouselCard, CardData } from '@/components/ui/CarouselCard';
import { ServiceModal } from '@/components/ui/ServiceModal';

const services = [
  {
    title: 'Implementación de IA',
    description:
      'Chatbots WhatsApp con IA, reservas automáticas y flujos sin intervención. Para clínicas, barberías, estudios de tatuaje e inmobiliarias.',
    icon: Rocket,
    gradient: 'from-blue-600 to-indigo-600',
    features: [
      'Chatbots con IA conversacional',
      'Automatización de procesos repetitivos',
      'Integraciones con tu stack existente',
      'Dashboards en tiempo real',
      'APIs personalizadas',
      'Soporte técnico 24/7'
    ],
    benefits: ['Reduce 70% el tiempo en tareas manuales', 'Disponibilidad 24/7'],
    shimmerGradient: { from: '#2563eb', to: '#4f46e5' },
    image: '/images/generated/service-implementacion-ia.webp',
  },
  {
    title: 'Consultoría Estratégica',
    description:
      'Analizamos tu negocio y diseñamos un plan de automatización con ROI claro. Sabrás cuánto ahorrarás antes de empezar.',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Auditoría completa de procesos',
      'Identificación de cuellos de botella',
      'Roadmap de implementación',
      'Cálculo de ROI proyectado',
      'Priorización de iniciativas',
      'Benchmarking con tu sector'
    ],
    benefits: ['Claridad sobre dónde invertir', 'Decisiones basadas en datos'],
    shimmerGradient: { from: '#f59e0b', to: '#ea580c' },
    image: '/images/generated/service-consultoria.webp',
  },
  {
    title: 'Formación y Capacitación',
    description:
      'Tu equipo domina la IA en días, no meses. Formación práctica con casos reales de salud, belleza e inmobiliaria.',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'Workshops prácticos hands-on',
      'Certificaciones oficiales',
      'Material actualizado',
      'Sesiones de seguimiento',
      'Casos de uso reales del sector',
      'Soporte post-formación'
    ],
    benefits: ['Equipo autónomo y capacitado', 'Adopción rápida'],
    shimmerGradient: { from: '#10b981', to: '#0d9488' },
    image: '/images/generated/service-formacion.webp',
  },
  {
    title: 'IA Personalizada',
    description:
      'Soluciones a medida para tus desafíos únicos. IA entrenada con tus datos, en tu infraestructura.',
    icon: Cpu,
    gradient: 'from-rose-500 to-pink-600',
    features: [
      'Modelos ML personalizados',
      'Fine-tuning de LLMs',
      'Entrenamiento con tus datos',
      'Deploy en cloud u on-premise',
      'Monitoreo y reentrenamiento',
      'Escalabilidad garantizada'
    ],
    benefits: ['Solución 100% adaptada a ti', 'Ventaja competitiva única'],
    shimmerGradient: { from: '#f43f5e', to: '#ec4899' },
    image: '/images/generated/service-ia-personalizada.webp',
  },
];

// Helper function to get category from gradient
function getCategoryFromGradient(gradient: string): string {
  if (gradient.includes('blue') || gradient.includes('indigo')) return 'Desarrollo';
  if (gradient.includes('amber') || gradient.includes('orange')) return 'Estrategia';
  if (gradient.includes('emerald') || gradient.includes('teal')) return 'Educación';
  if (gradient.includes('rose') || gradient.includes('pink')) return 'Innovación';
  return 'Servicio';
}

// Transform services to CardData format - COMPACT for modal fit
const servicesCarouselData: CardData[] = services.map((service) => ({
  title: service.title,
  category: getCategoryFromGradient(service.gradient),
  gradient: service.gradient,
  icon: service.icon,
  image: service.image,
  content: (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-slate-200 text-lg leading-relaxed">{service.description}</p>

      {/* Benefits highlight */}
      {'benefits' in service && service.benefits && (
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

      {/* Features list */}
      <div className="space-y-3">
        <h4 className="font-semibold text-white text-lg">¿Qué incluye?</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`
                }}
              />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`
          }}
        >
          Solicitar información
        </button>
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:bg-white/10 border border-white/20"
        >
          Agendar llamada
        </button>
      </div>
    </div>
  ),
}));

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for voice agent custom event to open service modal
  useEffect(() => {
    const handleVoiceOpenModal = (event: CustomEvent<{ index: number }>) => {
      const { index } = event.detail;
      if (index >= 0 && index < servicesCarouselData.length) {
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

  // Body scroll lock cuando modal abierto
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
    if (openIndex !== null && openIndex < servicesCarouselData.length - 1) {
      setOpenIndex(openIndex + 1);
    }
  };
  const handlePrev = () => {
    if (openIndex !== null && openIndex > 0) {
      setOpenIndex(openIndex - 1);
    }
  };

  return (
    <section id="services" className="relative bg-slate-950 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/30 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-4">
          <BlurFade delay={0.1} inView>
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="word"
              className="text-4xl md:text-5xl font-bold text-center text-white"
              delay={0.1}
              duration={0.6}
            >
              Nuestros Servicios
            </TextAnimate>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="text-xl text-slate-400 text-center mt-4 max-w-2xl mx-auto">
              Automatización real para negocios de servicios
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.3} inView>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-6">
            {servicesCarouselData.map((card, index) => (
              <CarouselCard
                key={card.title}
                card={card}
                index={index}
                onClick={() => handleOpen(index)}
              />
            ))}
          </div>
        </BlurFade>
      </div>

      {/* Service Modal Portal */}
      {mounted && createPortal(
        <ServiceModal
          card={openIndex !== null ? servicesCarouselData[openIndex] : null}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={openIndex !== null && openIndex < servicesCarouselData.length - 1}
          hasPrev={openIndex !== null && openIndex > 0}
        />,
        document.body
      )}
    </section>
  );
}
