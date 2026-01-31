"use client"

import { motion, Transition } from "motion/react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  transition?: Transition
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

export function BorderBeam({
  className,
  size = 30,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "transparent",
  transition,
  style,
  reverse = false,
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden",
        className
      )}
      style={
        {
          padding: borderWidth,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          ...style,
        } as React.CSSProperties
      }
    >
      <motion.div
        className="absolute inset-[-100%]"
        style={{
          background: `conic-gradient(from 0deg, transparent ${100 - size}%, ${colorFrom} ${100 - size / 2}%, ${colorTo} 100%)`,
        }}
        animate={{
          rotate: reverse ? [360, 0] : [0, 360],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}
