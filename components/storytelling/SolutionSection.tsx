"use client";

import { Zap, Target, Rocket, BarChart } from "lucide-react";
import { Card3D } from "./Card3D";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "@/components/magicui/dot-pattern";

const solutions = [
  {
    icon: Zap,
    title: "Automatizacion inteligente",
    description: "Liberamos tu tiempo automatizando lo repetitivo",
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "blue" as const,
  },
  {
    icon: Target,
    title: "Enfoque estrategico",
    description: "Tomas decisiones informadas con IA como aliado",
    gradient: "from-cyan-500 to-emerald-500",
    glowColor: "cyan" as const,
  },
  {
    icon: Rocket,
    title: "Ventaja competitiva",
    description: "Te adelantas al mercado con tecnologia de punta",
    gradient: "from-emerald-500 to-blue-500",
    glowColor: "emerald" as const,
  },
  {
    icon: BarChart,
    title: "Datos que hablan",
    description: "Transformamos tu informacion en insights accionables",
    gradient: "from-blue-500 to-indigo-500",
    glowColor: "indigo" as const,
  },
];

/**
 * SolutionSection - Hopeful section showing how we solve pain points
 *
 * Uses vibrant positive colors (blue, cyan, emerald) to convey hope
 * Grid layout: 2x2 on desktop, single column on mobile
 * More pronounced 3D effect (higher intensity)
 * Visual transition from problems to solutions
 */
export function SolutionSection() {
  return (
    <section
      id="solutions"
      className="relative bg-slate-950 py-24 overflow-hidden"
    >
      {/* Background gradient - more vibrant than pain points */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle dot pattern background with blue tint */}
      <DotPattern
        className="fill-blue-500/20 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_70%)]"
        width={20}
        height={20}
        cr={1}
        glow={true}
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
              Asi lo resolvemos
            </TextAnimate>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="text-xl text-slate-400 mt-4 max-w-2xl mx-auto">
              Transformamos cada desafio en una oportunidad
            </p>
          </BlurFade>
        </div>

        {/* Solutions grid - 2x2 on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <BlurFade
              key={solution.title}
              delay={0.3 + index * 0.1}
              inView
              className="h-full"
            >
              <Card3D
                title={solution.title}
                description={solution.description}
                icon={solution.icon}
                gradient={solution.gradient}
                glowColor={solution.glowColor}
                intensity={14}
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
