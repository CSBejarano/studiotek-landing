'use client';

import { TrendingDown, Users, Clock, type LucideIcon } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { RevolutCarousel } from '@/components/ui/RevolutCarousel';

interface BenefitStat {
  value: number;
  suffix: string;
  label: string;
}

interface BenefitCard {
  title: string;
  description: string;
  stat: BenefitStat;
  gradient: string;
  gradientColors: { from: string; to: string };
  shimmerGradient: { from: string; to: string };
  shineColor: string[];
  icon: LucideIcon;
  cta: string;
}

const benefits: BenefitCard[] = [
  {
    title: 'Ahorra 2.500\u20AC/mes',
    description:
      'Reduce un 40% los costes automatizando tareas repetitivas. Cero errores, cero horas extra.',
    stat: { value: 40, suffix: '%', label: 'menos costes' },
    gradient: 'from-blue-500 to-cyan-500',
    gradientColors: { from: '#3b82f6', to: '#06b6d4' },
    shimmerGradient: { from: '#3b82f6', to: '#06b6d4' },
    shineColor: ['#06b6d4', '#3b82f6', '#06b6d4'],
    icon: TrendingDown,
    cta: 'Calcular mi ahorro',
  },
  {
    title: 'Atiende 3x mas clientes',
    description:
      'Procesos 5x mas rapidos = mas clientes atendidos al dia. Crece sin contratar.',
    stat: { value: 3, suffix: 'x', label: 'mas capacidad' },
    gradient: 'from-purple-500 to-pink-500',
    gradientColors: { from: '#a855f7', to: '#ec4899' },
    shimmerGradient: { from: '#a855f7', to: '#ec4899' },
    shineColor: ['#ec4899', '#a855f7', '#ec4899'],
    icon: Users,
    cta: 'Ver como funciona',
  },
  {
    title: 'Nunca pierdas un cliente',
    description:
      'Respuesta instantanea 24/7. El 98% de clientes reporta mayor satisfaccion.',
    stat: { value: 98, suffix: '%', label: 'satisfaccion' },
    gradient: 'from-orange-500 to-red-500',
    gradientColors: { from: '#f97316', to: '#ef4444' },
    shimmerGradient: { from: '#f97316', to: '#ef4444' },
    shineColor: ['#ef4444', '#f97316', '#ef4444'],
    icon: Clock,
    cta: 'Empezar ahora',
  },
];

function BenefitCardItem({ benefit }: { benefit: BenefitCard }) {
  const Icon = benefit.icon;

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]"
      style={{ width: 380, minHeight: 480 }}
    >
      {/* Gradient accent top border */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${benefit.gradient} opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg`}
      >
        <Icon size={24} className="text-white" strokeWidth={2} />
      </div>

      {/* Stat */}
      <div className="mt-6">
        <div className="flex items-baseline gap-1">
          <span
            className="text-6xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${benefit.gradientColors.from}, ${benefit.gradientColors.to})`,
            }}
          >
            <NumberTicker value={benefit.stat.value} delay={0.3} />
          </span>
          <span
            className="text-4xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${benefit.gradientColors.from}, ${benefit.gradientColors.to})`,
            }}
          >
            {benefit.stat.suffix}
          </span>
        </div>
        <p className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-400">
          {benefit.stat.label}
        </p>
      </div>

      {/* Title */}
      <h3 className="mt-6 text-2xl font-semibold text-white">
        {benefit.title}
      </h3>

      {/* Description */}
      <p className="mt-3 flex-grow text-base leading-relaxed text-slate-300">
        {benefit.description}
      </p>

      {/* CTA */}
      <ShimmerButton
        onClick={() =>
          document
            .getElementById('contact')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        background={`linear-gradient(to right, ${benefit.shimmerGradient.from}, ${benefit.shimmerGradient.to})`}
        shimmerColor="#ffffff"
        shineColor={benefit.shineColor}
        borderRadius="12px"
        className="mt-6 w-full"
      >
        {benefit.cta}
      </ShimmerButton>
    </div>
  );
}

export function BenefitsCarousel() {
  const carouselItems = benefits.map((benefit) => (
    <BenefitCardItem key={benefit.title} benefit={benefit} />
  ));

  return (
    <section
      id="benefits-carousel"
      data-section="benefits-carousel"
      aria-label="Beneficios de automatizar con IA"
      className="relative overflow-hidden bg-slate-950 py-24"
    >
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <TextAnimate
            as="h2"
            animation="blurInUp"
            by="word"
            className="text-center text-4xl font-bold text-white md:text-5xl"
            delay={0.1}
            duration={0.6}
          >
            El ROI de automatizar con IA
          </TextAnimate>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xl text-slate-400">
            Numeros reales de clientes como tu
          </p>
        </BlurFade>

        {/* Desktop: 3-column grid */}
        <div className="mt-16 hidden md:grid md:grid-cols-3 md:gap-8">
          {benefits.map((benefit, index) => (
            <BlurFade key={benefit.title} delay={0.3 + index * 0.15} inView>
              <BenefitCardItem benefit={benefit} />
            </BlurFade>
          ))}
        </div>

        {/* Mobile: RevolutCarousel */}
        <div className="mt-16 md:hidden">
          <BlurFade delay={0.3} inView>
            <RevolutCarousel
              items={carouselItems}
              showArrows={false}
              showDots
            />
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
