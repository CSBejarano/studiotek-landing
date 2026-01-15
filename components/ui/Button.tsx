"use client"

import { cn } from "@/lib/utils"
import { ShineBorder } from "@/components/magicui/shine-border"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base container
        "relative overflow-hidden rounded-xl",
        // Marco exterior oscuro y grueso (efecto 3D relieve)
        "border-[3px] border-[#0f172a]",
        // Shadow exterior para profundidad
        "shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
        // Padding y tipografia
        "px-6 py-3 font-medium",
        // Transiciones
        "transition-all duration-200",
        // Variantes de color
        variant === 'primary'
          ? "bg-primary text-white hover:bg-primary-hover"
          : "bg-transparent text-slate-200 hover:bg-slate-800/50",
        // Hover: efecto "presionable" 3D
        "hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]",
        // Active: presionado
        "active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {/* ShineBorder - bucle de luz dentro del marco oscuro */}
      <ShineBorder
        borderWidth={2}
        duration={12}
        shineColor={variant === 'primary'
          ? ["#60a5fa", "#3b82f6", "#60a5fa"]
          : ["#3b82f6", "#60a5fa", "#3b82f6"]
        }
      />

      {/* Contenido con z-index para estar sobre ShineBorder */}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
