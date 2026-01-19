"use client";

import { Clock, Brain, TrendingDown, Database } from "lucide-react";
import { Card3D } from "./Card3D";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "@/components/magicui/dot-pattern";

const painPoints = [
  {
    icon: Clock,
    title: "Procesos manuales consumen horas",
    description:
      "Y un gran coste en personal. Tareas repetitivas que podrian automatizarse te roban recursos valiosos",
    gradient: "from-slate-500 to-slate-600",
    glowColor: "purple" as const,
    image: "/images/generated/pain-procesos-manuales.png",
  },
  {
    icon: Brain,
    title: "Sin tiempo para lo estrategico",
    description: "Ahogado en operaciones diarias, no puedes enfocarte en hacer crecer tu negocio",
    gradient: "from-slate-500 to-slate-600",
    glowColor: "indigo" as const,
    image: "/images/generated/pain-sin-tiempo.png",
  },
  {
    icon: TrendingDown,
    title: "La competencia se adelanta",
    description: "Mientras otros adoptan IA y automatizan, tu negocio pierde terreno cada dia",
    gradient: "from-slate-500 to-slate-600",
    glowColor: "violet" as const,
    image: "/images/generated/pain-competencia.png",
  },
  {
    icon: Database,
    title: "Datos sin explotar, decisiones sin tomar",
    description: "Tienes informacion valiosa que no estas aprovechando para tomar mejores decisiones",
    gradient: "from-slate-500 to-slate-600",
    glowColor: "purple" as const,
    image: "/images/generated/pain-datos.png",
  },
];

/**
 * PainPointsSection - Empathetic section highlighting customer pain points
 *
 * Uses cool/neutral colors (slate, gray gradients) to convey empathy
 * Grid layout: 2x2 on desktop, single column on mobile
 * Stagger animations with Card3D on scroll
 */
export function PainPointsSection() {
  return (
    <section
      id="pain-points"
      className="relative bg-slate-950 py-24 overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle dot pattern background */}
      <DotPattern
        className="fill-slate-700/30 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"
        width={20}
        height={20}
        cr={1}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <BlurFade delay={0.1} inView>
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="word"
              className="text-4xl md:text-5xl font-bold text-white"
              delay={0.1}
              duration={0.6}
            >
              Te identificas con esto?
            </TextAnimate>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="text-xl text-slate-400 mt-4 max-w-2xl mx-auto">
              Estos problemas son mas comunes de lo que crees
            </p>
          </BlurFade>
        </div>

        {/* Pain points grid - 2x2 on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {painPoints.map((point, index) => (
            <BlurFade
              key={point.title}
              delay={0.3 + index * 0.1}
              inView
              className="h-full"
            >
              <Card3D
                title={point.title}
                description={point.description}
                icon={point.icon}
                gradient={point.gradient}
                glowColor={point.glowColor}
                image={point.image}
                imageOpacity={55}
                intensity={8}
                showBorderGlow={true}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="h-full"
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
