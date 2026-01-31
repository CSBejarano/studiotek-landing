'use client';

import { motion, useTransform, MotionValue } from 'motion/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProgressIndicatorProps {
  scrollYProgress: MotionValue<number>;
  numPanels: number;
}

interface ProgressDotProps {
  scrollYProgress: MotionValue<number>;
  index: number;
  numPanels: number;
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function ProgressDot({ scrollYProgress, index, numPanels }: ProgressDotProps) {
  const backgroundColor = useTransform(
    scrollYProgress,
    [index / numPanels, (index + 1) / numPanels],
    ['rgba(255,255,255,0.3)', '#2563EB']
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor }}
    />
  );
}

export function ProgressIndicator({ scrollYProgress, numPanels }: ProgressIndicatorProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
      {Array.from({ length: numPanels }).map((_, idx) => (
        <ProgressDot 
          key={idx} 
          scrollYProgress={scrollYProgress} 
          index={idx} 
          numPanels={numPanels} 
        />
      ))}
    </div>
  );
}
