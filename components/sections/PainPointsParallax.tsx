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
    description: 'Cada minuto en tareas manuales es tiempo que no dedicas a crecer. Las PYMEs pierden 15 horas semanales en procesos automatizables.',
    secondaryDescription: 'Automatiza y enfoca a tu equipo en lo que realmente importa: hacer crecer el negocio.',
    image: '/images/generated/pain-sin-tiempo.webp',
  },
  {
    id: 'equipo',
    icon: Users,
    subheading: 'Colabora',
    heading: 'Tu equipo está quemado',
    contentTitle: 'El burnout afecta a todos',
    description: 'Empleados agotados cometen más errores, rinden menos y rotan más. El burnout no es solo bienestar, es un problema de negocio.',
    secondaryDescription: 'La automatización elimina las tareas repetitivas que drenan la energía de tu equipo.',
    image: '/images/generated/pain-procesos-manuales.webp',
  },
  {
    id: 'clientes',
    icon: Moon,
    subheading: 'Disponibilidad',
    heading: 'Pierdes clientes fuera de horario',
    contentTitle: 'Tu competencia nunca duerme',
    description: 'Mientras duermes, tu competencia cierra ventas. Los clientes esperan respuestas inmediatas, sin importar la hora.',
    secondaryDescription: 'Un asistente IA atiende 24/7, cualifica leads y cierra citas automáticamente.',
    image: '/images/generated/pain-competencia.webp',
  },
  {
    id: 'datos',
    icon: Database,
    subheading: 'Analiza',
    heading: 'Datos dispersos, decisiones a ciegas',
    contentTitle: 'Sin datos, solo intuición',
    description: 'Información dispersa en Excel, emails y sistemas desconectados. Sin visión completa, cada decisión es una apuesta.',
    secondaryDescription: 'Centraliza tus datos y decide con información real, no con corazonadas.',
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
