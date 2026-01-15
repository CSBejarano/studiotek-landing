'use client';

import { cn } from '@/lib/utils';

interface FiberOpticsProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export function FiberOptics({
  className,
  color = '#3B82F6',
  opacity = 0.6
}: FiberOpticsProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* SVG Fiber Optic Lines - V-shape pointing up */}
      <svg
        className="absolute w-[100%] h-[45%] bottom-0"
        viewBox="0 0 1200 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filters */}
          <filter id="fiber-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="fiber-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradients for left side fibers (bottom-left to top-center) */}
          <linearGradient id="fiber-left-1" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.9} />
            <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>

          <linearGradient id="fiber-left-2" x1="0%" y1="100%" x2="50%" y2="20%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.7} />
            <stop offset="70%" stopColor={color} stopOpacity={opacity * 0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>

          {/* Gradients for right side fibers (bottom-right to top-center) */}
          <linearGradient id="fiber-right-1" x1="100%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.9} />
            <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>

          <linearGradient id="fiber-right-2" x1="100%" y1="100%" x2="50%" y2="20%">
            <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.7} />
            <stop offset="70%" stopColor={color} stopOpacity={opacity * 0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* LEFT SIDE FIBERS - converging to top center */}
        <g filter="url(#fiber-glow-strong)">
          {/* Primary thick fibers */}
          <path
            d="M -100 1100 L 600 150"
            fill="none"
            stroke="url(#fiber-left-1)"
            strokeWidth="45"
            strokeLinecap="round"
          />
          <path
            d="M -50 1100 L 600 180"
            fill="none"
            stroke="url(#fiber-left-1)"
            strokeWidth="35"
            strokeLinecap="round"
          />
          <path
            d="M 0 1100 L 600 210"
            fill="none"
            stroke="url(#fiber-left-1)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </g>

        <g filter="url(#fiber-glow)">
          {/* Secondary fibers */}
          <path
            d="M 50 1100 L 600 240"
            fill="none"
            stroke="url(#fiber-left-2)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 100 1100 L 600 270"
            fill="none"
            stroke="url(#fiber-left-2)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 150 1100 L 600 300"
            fill="none"
            stroke="url(#fiber-left-2)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 200 1100 L 600 330"
            fill="none"
            stroke="url(#fiber-left-2)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 250 1100 L 600 360"
            fill="none"
            stroke="url(#fiber-left-2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        {/* Thinner accent fibers - left */}
        <g filter="url(#fiber-glow)" opacity="0.6">
          <path
            d="M 300 1100 L 600 390"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            opacity={opacity * 0.5}
          />
          <path
            d="M 350 1100 L 600 420"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={opacity * 0.4}
          />
          <path
            d="M 400 1100 L 600 450"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={opacity * 0.3}
          />
        </g>

        {/* RIGHT SIDE FIBERS - converging to top center */}
        <g filter="url(#fiber-glow-strong)">
          {/* Primary thick fibers */}
          <path
            d="M 1300 1100 L 600 150"
            fill="none"
            stroke="url(#fiber-right-1)"
            strokeWidth="45"
            strokeLinecap="round"
          />
          <path
            d="M 1250 1100 L 600 180"
            fill="none"
            stroke="url(#fiber-right-1)"
            strokeWidth="35"
            strokeLinecap="round"
          />
          <path
            d="M 1200 1100 L 600 210"
            fill="none"
            stroke="url(#fiber-right-1)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </g>

        <g filter="url(#fiber-glow)">
          {/* Secondary fibers */}
          <path
            d="M 1150 1100 L 600 240"
            fill="none"
            stroke="url(#fiber-right-2)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 1100 1100 L 600 270"
            fill="none"
            stroke="url(#fiber-right-2)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M 1050 1100 L 600 300"
            fill="none"
            stroke="url(#fiber-right-2)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 1000 1100 L 600 330"
            fill="none"
            stroke="url(#fiber-right-2)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 950 1100 L 600 360"
            fill="none"
            stroke="url(#fiber-right-2)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        {/* Thinner accent fibers - right */}
        <g filter="url(#fiber-glow)" opacity="0.6">
          <path
            d="M 900 1100 L 600 390"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            opacity={opacity * 0.5}
          />
          <path
            d="M 850 1100 L 600 420"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={opacity * 0.4}
          />
          <path
            d="M 800 1100 L 600 450"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={opacity * 0.3}
          />
        </g>
      </svg>

      {/* Glow overlays for ambient lighting */}
      <div
        className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full blur-[120px]"
        style={{ backgroundColor: color, opacity: opacity * 0.2 }}
      />
      <div
        className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full blur-[120px]"
        style={{ backgroundColor: color, opacity: opacity * 0.2 }}
      />
    </div>
  );
}
