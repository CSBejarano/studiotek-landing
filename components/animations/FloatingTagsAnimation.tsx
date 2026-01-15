'use client';

import { motion, useReducedMotion } from 'motion/react';

interface FloatingTagsAnimationProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#f97316',   // orange-500
  secondary: '#ef4444', // red-500
};

const TAGS = ['Growth', 'Scale', '+50%'];

export function FloatingTagsAnimation({
  className = '',
  colors = DEFAULT_COLORS,
}: FloatingTagsAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  const tagPositions = [
    { x: 15, delay: 0 },
    { x: 50, delay: 0.6 },
    { x: 30, delay: 1.2 },
  ];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
    >
      <div className="relative w-full h-full overflow-hidden">
        {TAGS.map((tag, index) => (
          <motion.span
            key={tag}
            className="absolute text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
            style={{
              left: `${tagPositions[index].x}%`,
              transform: 'translateX(-50%)',
              background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`,
              border: `1px solid ${index === 2 ? colors.secondary : colors.primary}40`,
              color: index === 2 ? colors.secondary : colors.primary,
            }}
            initial={
              shouldReduceMotion
                ? { opacity: 1, top: `${30 + index * 20}%` }
                : { opacity: 0, top: '85%' }
            }
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: [0, 1, 1, 0],
                    top: ['85%', '60%', '35%', '10%'],
                  }
            }
            transition={
              shouldReduceMotion
                ? {}
                : {
                    duration: 3,
                    delay: tagPositions[index].delay,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: 'easeOut',
                    times: [0, 0.2, 0.7, 1],
                  }
            }
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
