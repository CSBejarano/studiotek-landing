'use client';

import { motion, useReducedMotion } from 'motion/react';

interface AreaChartAnimationProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#3b82f6',   // blue-500
  secondary: '#06b6d4', // cyan-500
};

export function AreaChartAnimation({
  className = '',
  colors = DEFAULT_COLORS,
}: AreaChartAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  // Path for descending trend (showing savings/cost reduction)
  const linePath = 'M 5 15 Q 25 18, 40 25 T 70 35 Q 85 40, 95 45';
  const areaPath = 'M 5 15 Q 25 18, 40 25 T 70 35 Q 85 40, 95 45 L 95 55 L 5 55 Z';

  // Data points for stagger animation
  const dataPoints = [
    { x: 5, y: 15 },
    { x: 40, y: 25 },
    { x: 70, y: 35 },
    { x: 95, y: 45 },
  ];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.02" />
          </linearGradient>
          {/* Glow filter for premium effect */}
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={colors.primary} floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Dot glow */}
          <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={colors.primary} floodOpacity="0.8" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines with fade-in */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <line x1="5" y1="20" x2="95" y2="20" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="5" y1="35" x2="95" y2="35" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke={colors.secondary} strokeWidth="0.5" strokeDasharray="2 2" />
        </motion.g>

        {/* Area fill with glow */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: shouldReduceMotion ? 0 : 1.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* Animated line with glow filter */}
        <motion.path
          d={linePath}
          stroke={colors.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 2.5,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: [0.34, 1.56, 0.64, 1], // Premium overshoot
          }}
        />

        {/* Data points with stagger */}
        {dataPoints.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill={colors.secondary}
            initial={shouldReduceMotion ? { opacity: 0.6 } : { opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: shouldReduceMotion ? 0 : 0.5 + index * 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        ))}

        {/* End point dot with pulse glow */}
        <motion.circle
          cx="95"
          cy="45"
          r="4"
          fill={colors.primary}
          filter="url(#dotGlow)"
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: [0, 1, 1, 1],
                  scale: [0, 1.2, 1, 1.1],
                }
          }
          transition={{
            duration: 2,
            delay: shouldReduceMotion ? 0 : 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
    </div>
  );
}
