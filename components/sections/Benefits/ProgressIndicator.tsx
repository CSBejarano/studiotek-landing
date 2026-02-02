'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ZONES = ['ahorro', 'clientes', 'satisfaccion', 'cta'] as const;

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function ProgressDot({ scrollYProgress, index }: { scrollYProgress: MotionValue<number>; index: number }) {
  const backgroundColor = useTransform(
    scrollYProgress,
    [index / ZONES.length, (index + 1) / ZONES.length],
    ['rgba(255,255,255,0.3)', '#2563EB'],
  );

  return <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor }} />;
}

export function ProgressIndicator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
      {ZONES.map((_, idx) => (
        <ProgressDot key={idx} scrollYProgress={scrollYProgress} index={idx} />
      ))}
    </div>
  );
}
