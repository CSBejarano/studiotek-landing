'use client';

import { motion, useReducedMotion } from 'motion/react';

interface SpeedGaugeAnimationProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#a855f7',   // purple-500
  secondary: '#ec4899', // pink-500
};

export function SpeedGaugeAnimation({
  className = '',
  colors = DEFAULT_COLORS,
}: SpeedGaugeAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  // Arc parameters
  const cx = 50;
  const cy = 50;
  const radius = 35;
  const startAngle = 180; // Left side
  const endAngle = 0;     // Right side

  // Convert angle to radians and get point on arc
  const getPointOnArc = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  // Create arc path
  const arcPath = `M ${getPointOnArc(startAngle).x} ${getPointOnArc(startAngle).y} A ${radius} ${radius} 0 0 1 ${getPointOnArc(endAngle).x} ${getPointOnArc(endAngle).y}`;

  // Tick marks
  const tickAngles = [180, 150, 120, 90, 60, 30, 0];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 100 70"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath}
          stroke={`${colors.secondary}30`}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Colored arc */}
        <path
          d={arcPath}
          stroke="url(#gaugeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Tick marks */}
        {tickAngles.map((angle, i) => {
          const innerRadius = radius - 8;
          const outerRadius = radius - 4;
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + innerRadius * Math.cos(rad);
          const y1 = cy - innerRadius * Math.sin(rad);
          const x2 = cx + outerRadius * Math.cos(rad);
          const y2 = cy - outerRadius * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.primary}
              strokeWidth="1.5"
              opacity="0.5"
            />
          );
        })}

        {/* Needle - using translate wrapper pattern for correct SVG rotation */}
        <g transform={`translate(${cx} ${cy})`}>
          <motion.g
            animate={
              shouldReduceMotion
                ? { rotate: -60 } // Static at high position
                : {
                    rotate: [-150, -30, -150], // From 20% to 85% and back
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <g transform={`translate(${-cx} ${-cy})`}>
              {/* Needle shape */}
              <polygon
                points={`${cx},${cy - 3} ${cx + 28},${cy} ${cx},${cy + 3}`}
                fill={colors.primary}
              />
              {/* Center dot */}
              <circle cx={cx} cy={cy} r="4" fill={colors.primary} />
              <circle cx={cx} cy={cy} r="2" fill={colors.secondary} />
            </g>
          </motion.g>
        </g>

        {/* Labels */}
        <text
          x="18"
          y="58"
          fontSize="6"
          fill={colors.secondary}
          opacity="0.7"
        >
          LOW
        </text>
        <text
          x="74"
          y="58"
          fontSize="6"
          fill={colors.primary}
          opacity="0.7"
        >
          HIGH
        </text>
      </svg>
    </div>
  );
}
