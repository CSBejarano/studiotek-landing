'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rocket, Lightbulb, GraduationCap, Cpu } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { AppleCarousel } from '@/components/ui/AppleCarousel';
import { CarouselCard, CardData } from '@/components/ui/CarouselCard';
import { ServiceModal } from '@/components/ui/ServiceModal';

const services = [
  {
    title: 'Implementacion de IA',
    description:
      'Desplegamos soluciones de automatizacion e inteligencia artificial adaptadas a las necesidades especificas de tu negocio. Desde chatbots conversacionales hasta sistemas de automatizacion complejos, transformamos tus operaciones.',
    icon: Rocket,
    gradient: 'from-blue-600 to-indigo-600',
    features: [
      'Chatbots inteligentes con IA conversacional',
      'Automatizacion de procesos repetitivos',
      'Integraciones con tu stack existente',
      'Dashboards de monitoreo en tiempo real',
      'APIs personalizadas para tu negocio',
      'Soporte tecnico 24/7'
    ],
    benefits: ['Reduce hasta 70% el tiempo en tareas manuales', 'Disponibilidad 24/7 para tus clientes'],
    shimmerGradient: { from: '#2563eb', to: '#4f46e5' },
    // image: '/images/services/implementacion-ia.jpg', // Descomentar cuando tengas imagenes
  },
  {
    title: 'Consultoria Estrategica',
    description:
      'Analizamos en profundidad tus procesos actuales e identificamos oportunidades de mejora. Creamos un roadmap claro de implementacion con metricas de exito definidas y ROI proyectado.',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Auditoria completa de procesos',
      'Identificacion de cuellos de botella',
      'Roadmap de implementacion detallado',
      'Calculo de ROI proyectado',
      'Priorizacion de iniciativas',
      'Benchmarking con la industria'
    ],
    benefits: ['Claridad total sobre donde invertir', 'Decisiones basadas en datos'],
    shimmerGradient: { from: '#f59e0b', to: '#ea580c' },
    // image: '/images/services/consultoria-estrategica.jpg',
  },
  {
    title: 'Formacion y Capacitacion',
    description:
      'Formamos a tu equipo en el uso efectivo de herramientas de IA. Desde conceptos basicos hasta tecnicas avanzadas, aseguramos que tu equipo pueda aprovechar al maximo las nuevas tecnologias.',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'Workshops practicos hands-on',
      'Certificaciones oficiales',
      'Material de formacion actualizado',
      'Sesiones de seguimiento',
      'Casos de uso reales de tu industria',
      'Soporte post-formacion'
    ],
    benefits: ['Equipo autonomo y capacitado', 'Adopcion rapida de nuevas herramientas'],
    shimmerGradient: { from: '#10b981', to: '#0d9488' },
    // image: '/images/services/formacion-ia.jpg',
  },
  {
    title: 'Procesos de IA Personalizada',
    description:
      'Desarrollamos modelos de IA completamente a medida para resolver los desafios unicos de tu negocio. Desde el entrenamiento hasta el despliegue gestionado, te acompanamos en todo el proceso.',
    icon: Cpu,
    gradient: 'from-rose-500 to-pink-600',
    features: [
      'Modelos de ML personalizados',
      'Fine-tuning de LLMs',
      'Entrenamiento con tus datos',
      'Deploy en cloud o on-premise',
      'Monitoreo y reentrenamiento',
      'Escalabilidad garantizada'
    ],
    benefits: ['Solucion 100% adaptada a ti', 'Ventaja competitiva unica'],
    shimmerGradient: { from: '#f43f5e', to: '#ec4899' },
    // image: '/images/services/ia-personalizada.jpg',
  },
];

// Helper function to get category from gradient
function getCategoryFromGradient(gradient: string): string {
  if (gradient.includes('blue') || gradient.includes('indigo')) return 'Desarrollo';
  if (gradient.includes('amber') || gradient.includes('orange')) return 'Estrategia';
  if (gradient.includes('emerald') || gradient.includes('teal')) return 'Educacion';
  if (gradient.includes('rose') || gradient.includes('pink')) return 'Innovacion';
  return 'Servicio';
}

// Transform services to CardData format - COMPACT for modal fit
const servicesCarouselData: CardData[] = services.map((service) => ({
  title: service.title,
  category: getCategoryFromGradient(service.gradient),
  gradient: service.gradient,
  icon: service.icon,
  // image: service.image, // Descomentar cuando tengas imagenes
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
        <h4 className="font-semibold text-white text-lg">Que incluye:</h4>
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
          Solicitar informacion
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
              Soluciones adaptadas a las necesidades de tu negocio
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.3} inView>
          <div className="mt-12">
            <AppleCarousel>
              {servicesCarouselData.map((card, index) => (
                <CarouselCard
                  key={card.title}
                  card={card}
                  index={index}
                  onClick={() => handleOpen(index)}
                />
              ))}
            </AppleCarousel>
          </div>
        </BlurFade>

        {/* Hint text for mobile */}
        <BlurFade delay={0.4} inView>
          <p className="text-center text-slate-500 text-sm mt-4 md:hidden">
            Desliza para ver mas servicios
          </p>
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
