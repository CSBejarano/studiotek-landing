"use client"

import React, { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"
import { ShineBorder } from "@/components/magicui/shine-border"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  shineColor?: string | string[]  // Color del ShineBorder
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 102, 255, 1)",
      shineColor = ["#60a5fa", "#3b82f6", "#60a5fa"],
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-medium",
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-all duration-300 ease-in-out",
          // Marco exterior oscuro y grueso (efecto 3D relieve)
          "border-[3px] border-[#0f172a]",
          // Shadow exterior para profundidad
          "shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
          // Hover 3D
          "hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]",
          "active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "[container-type:size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-[shimmer-slide_8s_ease-in-out_infinite] [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="absolute -inset-full w-auto rotate-0 animate-[spin-around_4s_linear_infinite] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transform-gpu transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [inset:var(--cut)] [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />

        {/* ShineBorder - línea de luz recorriendo el borde */}
        <ShineBorder
          borderWidth={2}
          duration={12}
          shineColor={shineColor}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
