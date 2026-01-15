"use client"

import React, { useEffect, useId, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()
  const [animationProps, setAnimationProps] = useState<{
    delay: number
    duration: number
  } | null>(null)

  useEffect(() => {
    if (glow) {
      setAnimationProps({
        delay: -Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })
    }
  }, [glow])

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/50",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          {glow && animationProps ? (
            <motion.circle
              cx={cx}
              cy={cy}
              r={cr}
              fill="currentColor"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: animationProps.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: animationProps.delay,
              }}
            />
          ) : (
            <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
