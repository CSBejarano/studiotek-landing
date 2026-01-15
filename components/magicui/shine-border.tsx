"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#3b82f6"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 * Creates a subtle, elegant glow effect that animates around the border.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#3b82f6",
  className,
  style,
  ...props
}: ShineBorderProps) {
  const colorString = Array.isArray(shineColor)
    ? shineColor.join(",")
    : shineColor

  return (
    <div
      style={{
        backgroundImage: `radial-gradient(transparent, transparent, ${colorString}, transparent, transparent)`,
        backgroundSize: "300% 300%",
        mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: `${borderWidth}px`,
        animation: `shine ${duration}s infinite linear`,
        ...style,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  )
}
