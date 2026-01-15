"use client";

import { type LucideIcon } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { use3DCardEffect } from "@/hooks/use3DCardEffect";

interface Card3DProps extends Omit<HTMLMotionProps<"div">, "style"> {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Gradient for icon background (tailwind classes), e.g., "from-blue-500 to-cyan-500" */
  gradient?: string;
  /** Additional CSS classes */
  className?: string;
  /** 3D effect intensity (1-20), default 12 */
  intensity?: number;
  /** Glow color for hover effect */
  glowColor?: "blue" | "purple" | "indigo" | "cyan" | "emerald" | "amber" | "violet" | "orange" | "pink";
  /** Whether to show the subtle border glow */
  showBorderGlow?: boolean;
}

const glowColorMap = {
  blue: {
    border: "group-hover:border-blue-500/40",
    shadow: "rgba(59, 130, 246, 0.15)",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  },
  purple: {
    border: "group-hover:border-purple-500/40",
    shadow: "rgba(168, 85, 247, 0.15)",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
  indigo: {
    border: "group-hover:border-indigo-500/40",
    shadow: "rgba(99, 102, 241, 0.15)",
    bg: "bg-indigo-500/20",
    text: "text-indigo-400",
  },
  cyan: {
    border: "group-hover:border-cyan-500/40",
    shadow: "rgba(6, 182, 212, 0.15)",
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
  },
  emerald: {
    border: "group-hover:border-emerald-500/40",
    shadow: "rgba(16, 185, 129, 0.15)",
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
  },
  amber: {
    border: "group-hover:border-amber-500/40",
    shadow: "rgba(245, 158, 11, 0.15)",
    bg: "bg-amber-500/20",
    text: "text-amber-400",
  },
  violet: {
    border: "group-hover:border-violet-500/40",
    shadow: "rgba(139, 92, 246, 0.15)",
    bg: "bg-violet-500/20",
    text: "text-violet-400",
  },
  orange: {
    border: "group-hover:border-orange-500/40",
    shadow: "rgba(249, 115, 22, 0.15)",
    bg: "bg-orange-500/20",
    text: "text-orange-400",
  },
  pink: {
    border: "group-hover:border-pink-500/40",
    shadow: "rgba(236, 72, 153, 0.15)",
    bg: "bg-pink-500/20",
    text: "text-pink-400",
  },
};

/**
 * Apple-style 3D card component with intense hover effects.
 *
 * Features:
 * - Intense 3D rotation on mouse movement (up to 15 degrees)
 * - Glassmorphism background
 * - Dynamic shadow that moves with rotation
 * - Subtle border glow on hover
 * - Compatible with framer-motion animations
 *
 * @example
 * ```tsx
 * <Card3D
 *   title="Automation"
 *   description="Streamline your workflow"
 *   icon={Zap}
 *   gradient="from-blue-500 to-cyan-500"
 *   intensity={12}
 * />
 * ```
 */
export function Card3D({
  title,
  description,
  icon: Icon,
  gradient = "from-blue-500 to-cyan-500",
  className,
  intensity = 12,
  glowColor = "blue",
  showBorderGlow = true,
  ...motionProps
}: Card3DProps) {
  const { style, handlers, ref, isHovered } = use3DCardEffect({
    intensity,
    scale: 1.02,
    shadow: false, // We handle shadow separately for more control
  });

  const colors = glowColorMap[glowColor];

  return (
    <motion.div
      ref={ref}
      className={cn("group", className)}
      style={style}
      {...handlers}
      {...motionProps}
    >
      <div
        className={cn(
          // Base styles - Glassmorphism
          "relative overflow-hidden rounded-2xl h-full",
          "bg-slate-900/60 backdrop-blur-md",
          "border border-slate-700/50",
          // Transitions
          "transition-all duration-300 ease-out",
          // Hover border glow
          showBorderGlow && colors.border
        )}
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${colors.shadow}`
            : "0 8px 30px -12px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Top glow decoration */}
        <div
          className={cn(
            "absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl",
            "opacity-0 pointer-events-none transition-opacity duration-500",
            "group-hover:opacity-60",
            colors.bg
          )}
          aria-hidden="true"
        />

        {/* Bottom glow decoration */}
        <div
          className={cn(
            "absolute -bottom-16 -left-16 h-32 w-32 rounded-full blur-2xl",
            "opacity-0 pointer-events-none transition-opacity duration-500",
            "group-hover:opacity-40",
            colors.bg
          )}
          aria-hidden="true"
        />

        {/* Card content */}
        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
          {/* Icon with gradient background */}
          <div
            className={cn(
              "inline-flex items-center justify-center",
              "w-14 h-14 rounded-xl mb-5",
              "bg-gradient-to-br",
              gradient,
              "shadow-lg"
            )}
          >
            <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed flex-grow">{description}</p>
        </div>

        {/* Bottom accent line */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-px",
            "bg-gradient-to-r from-transparent via-current to-transparent",
            "opacity-0 group-hover:opacity-40 transition-opacity duration-300",
            colors.text
          )}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}

export type { Card3DProps };
