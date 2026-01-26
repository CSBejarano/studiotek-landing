'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  contentTitle: string;
  description: string;
  secondaryDescription?: string;
  variant?: 'default' | 'pain';
  icon?: React.ComponentType<{ className?: string }>;
}

export function TextParallaxContent({
  imgUrl,
  subheading,
  heading,
  contentTitle,
  description,
  secondaryDescription,
  variant = 'default',
  icon: Icon
}: TextParallaxContentProps) {
  return (
    <div className="px-4 md:px-8 lg:px-20 py-3">
      <div className="relative h-[75vh] rounded-3xl overflow-hidden">
        <ParallaxImage imgUrl={imgUrl} variant={variant} />
        <OverlayCopy
          heading={heading}
          subheading={subheading}
          contentTitle={contentTitle}
          description={description}
          secondaryDescription={secondaryDescription}
          variant={variant}
          icon={Icon}
        />
      </div>
    </div>
  );
}

function ParallaxImage({ imgUrl, variant = 'default' }: { imgUrl: string; variant?: 'default' | 'pain' }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // Efecto parallax en la imagen
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  // Escala suave
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    variant === 'pain' ? [1.15, 1.05, 1] : [1.1, 1.02, 0.98]
  );

  // Blur y brightness al salir
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 4]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8]);
  const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;

  return (
    <motion.div
      ref={targetRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        y,
        scale,
        filter,
      }}
    >
      <div
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      />
      {/* Gradient overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
    </motion.div>
  );
}

function OverlayCopy({
  subheading,
  heading,
  contentTitle,
  description,
  secondaryDescription,
  variant = 'default',
  icon: Icon
}: {
  subheading: string;
  heading: string;
  contentTitle: string;
  description: string;
  secondaryDescription?: string;
  variant?: 'default' | 'pain';
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // Movimiento Y sutil del texto
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, opacity }}
      ref={targetRef}
      className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 md:px-12 z-10"
    >
      {/* Icono opcional */}
      {Icon && (
        <div className="mb-3">
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-white/80" />
        </div>
      )}

      {/* Subheading */}
      <p className="mb-2 text-center text-sm md:text-base font-medium tracking-widest uppercase text-white/70">
        {subheading}
      </p>

      {/* Heading principal */}
      <h2 className="text-center text-2xl md:text-4xl lg:text-5xl font-bold max-w-4xl leading-tight tracking-tight mb-6">
        {heading}
      </h2>

      {/* Separador visual */}
      <div className="w-16 h-0.5 bg-white/30 mb-6" />

      {/* Content Title */}
      <h3 className="text-center text-lg md:text-xl lg:text-2xl font-semibold text-white/90 mb-4 max-w-2xl">
        {contentTitle}
      </h3>

      {/* Description */}
      <p className="text-center text-sm md:text-base text-white/70 max-w-xl leading-relaxed">
        {description}
      </p>

      {/* Secondary Description */}
      {secondaryDescription && (
        <p className="text-center text-sm md:text-base text-white/60 max-w-xl leading-relaxed mt-3">
          {secondaryDescription}
        </p>
      )}
    </motion.div>
  );
}
