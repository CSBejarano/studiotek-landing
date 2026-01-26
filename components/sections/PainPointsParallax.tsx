'use client';

import { TextParallaxContent } from './TextParallaxContent';
import { Clock, Users, Moon, Database } from 'lucide-react';

interface PainPoint {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  subheading: string;
  heading: string;
  contentTitle: string;
  description: string;
  secondaryDescription?: string;
  image: string;
}

const painPoints: PainPoint[] = [
  {
    id: 'tiempo',
    icon: Clock,
    subheading: 'Automatiza',
    heading: 'Pierdes 15+ horas/semana en tareas repetitivas',
    contentTitle: 'El tiempo perdido no vuelve',
    description: 'Cada minuto en tareas manuales es un minuto menos para crecer tu negocio. Las PYMEs pierden una media de 15 horas semanales en procesos que podrían automatizarse.',
    secondaryDescription: 'Con la automatización adecuada, tu equipo puede enfocarse en lo que realmente importa: hacer crecer el negocio.',
    image: '/images/generated/pain-sin-tiempo.webp',
  },
  {
    id: 'equipo',
    icon: Users,
    subheading: 'Colabora',
    heading: 'Tu equipo está quemado',
    contentTitle: 'El burnout afecta a todos',
    description: 'El burnout no es solo un problema de bienestar, es un problema de negocio. Empleados agotados cometen más errores, son menos productivos y tienen mayor rotación.',
    secondaryDescription: 'La automatización elimina las tareas repetitivas que drenan la energia de tu equipo.',
    image: '/images/generated/pain-procesos-manuales.webp',
  },
  {
    id: 'clientes',
    icon: Moon,
    subheading: 'Disponibilidad',
    heading: 'Pierdes clientes fuera de horario',
    contentTitle: 'Tu competencia nunca duerme',
    description: 'Mientras duermes, tu competencia cierra ventas. Los clientes esperan respuestas inmediatas, sin importar la hora.',
    secondaryDescription: 'Un asistente IA puede atender consultas 24/7, cualificando leads y cerrando citas automaticamente.',
    image: '/images/generated/pain-competencia.webp',
  },
  {
    id: 'datos',
    icon: Database,
    subheading: 'Analiza',
    heading: 'Datos dispersos, decisiones a ciegas',
    contentTitle: 'Sin datos, solo intuicion',
    description: 'Sin datos unificados, cada decisión es una apuesta. La información dispersa en hojas de cálculo, emails y sistemas desconectados impide ver el panorama completo.',
    secondaryDescription: 'Centraliza tus datos y toma decisiones basadas en información real, no en corazonadas.',
    image: '/images/generated/pain-datos.webp',
  }
];

export function PainPointsParallax() {
  return (
    <section className="bg-slate-950">
      {painPoints.map((pain) => (
        <TextParallaxContent
          key={pain.id}
          imgUrl={pain.image}
          subheading={pain.subheading}
          heading={pain.heading}
          contentTitle={pain.contentTitle}
          description={pain.description}
          secondaryDescription={pain.secondaryDescription}
          variant="pain"
          icon={pain.icon}
        />
      ))}
    </section>
  );
}
