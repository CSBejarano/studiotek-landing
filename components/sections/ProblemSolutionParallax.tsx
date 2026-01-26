'use client';

import { TextParallaxContent } from './TextParallaxContent';
import { AlertTriangle, Zap } from 'lucide-react';

export function ProblemSolutionParallax() {
  return (
    <section className="bg-slate-950">
      {/* PROBLEMA */}
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80"
        subheading="El problema"
        heading="¿Tu negocio sufre esto?"
        contentTitle="El 78% de las PYMEs pierden clientes por procesos manuales"
        description="Pierdes 15+ horas/semana en tareas repetitivas. Tu equipo está quemado. Pierdes clientes fuera de horario."
        secondaryDescription="Datos dispersos, decisiones a ciegas. Es hora de cambiar."
        variant="pain"
        icon={AlertTriangle}
      />

      {/* SOLUCION */}
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80"
        subheading="La solución"
        heading="Así lo transformamos"
        contentTitle="Resultados reales en las primeras 4 semanas"
        description="Automatización que trabaja por ti. Atención 24/7 sin contratar. Datos que generan ventas."
        secondaryDescription="Escalas sin limites con inteligencia artificial."
        variant="default"
        icon={Zap}
      />
    </section>
  );
}
