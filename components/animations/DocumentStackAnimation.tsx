'use client';

import { motion, useReducedMotion } from 'motion/react';

interface DocumentStackAnimationProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#10b981',   // emerald-500
  secondary: '#14b8a6', // teal-500
};

export function DocumentStackAnimation({
  className = '',
  colors = DEFAULT_COLORS,
}: DocumentStackAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  const documentStyle = (offset: number, zIndex: number, isPrimary: boolean) => ({
    position: 'absolute' as const,
    width: '70%',
    height: '80%',
    borderRadius: '8px',
    backgroundColor: isPrimary ? `${colors.primary}20` : `${colors.secondary}15`,
    border: `1px solid ${isPrimary ? colors.primary : colors.secondary}30`,
    transform: `translate(${offset}px, ${offset}px)`,
    zIndex,
  });

  const lineStyle = (color: string, width: string) => ({
    height: '6px',
    borderRadius: '3px',
    backgroundColor: `${color}40`,
    width,
  });

  return (
    <div
      className={`flex items-center justify-center ${className}`}
    >
      <div className="relative w-full h-full">
        {/* Back document */}
        <div style={documentStyle(8, 1, false)}>
          <div className="p-2 space-y-1.5">
            <div style={lineStyle(colors.secondary, '80%')} />
            <div style={lineStyle(colors.secondary, '60%')} />
            <div style={lineStyle(colors.secondary, '70%')} />
          </div>
        </div>

        {/* Middle document */}
        <div style={documentStyle(4, 2, false)}>
          <div className="p-2 space-y-1.5">
            <div style={lineStyle(colors.secondary, '85%')} />
            <div style={lineStyle(colors.secondary, '55%')} />
            <div style={lineStyle(colors.secondary, '75%')} />
          </div>
        </div>

        {/* Front document - animated */}
        <motion.div
          style={documentStyle(0, 3, true)}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.02, 1],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="p-2 space-y-1.5">
            <div style={lineStyle(colors.primary, '90%')} />
            <div style={lineStyle(colors.primary, '50%')} />
            <div style={lineStyle(colors.primary, '70%')} />
            <div style={lineStyle(colors.primary, '40%')} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
