"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees (default: 10) */
  maxTilt?: number;
  /** CSS perspective value in px (default: 1000) */
  perspective?: number;
  /** Show a glare/glossy overlay that follows the tilt (default: false) */
  glareEffect?: boolean;
}

/**
 * Wrapper component that applies a 3D tilt effect on mouse hover.
 *
 * Features:
 * - Calculates rotateX/rotateY based on mouse position WITHIN the card.
 * - Optional glare overlay with radial gradient that moves with tilt.
 * - Dynamic shadow that adjusts with inclination.
 * - Respects `prefers-reduced-motion` (disables tilt, shows hover glow only).
 * - On touch devices: disables tilt, maintains hover glow.
 * - Smooth spring physics for enter/leave transitions (framer-motion).
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={12} glareEffect>
 *   <div className="p-6">Card content</div>
 * </TiltCard>
 * ```
 */
export function TiltCard({
  children,
  className,
  maxTilt = 10,
  perspective = 1000,
  glareEffect = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth spring animation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring config for natural physics feel
  const springConfig = { stiffness: 300, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const tiltDisabled = prefersReducedMotion || isTouchDevice;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tiltDisabled || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Relative position from -1 to 1
      const relX = (e.clientX - centerX) / (rect.width / 2);
      const relY = (e.clientY - centerY) / (rect.height / 2);

      // Inverted for natural tilt feel:
      // Mouse moves right -> card tilts left (negative rotateY)
      // Mouse moves down  -> card tilts up   (positive rotateX)
      rotateX.set(relY * maxTilt);
      rotateY.set(-relX * maxTilt);

      // Glare position: percentage-based for radial gradient origin
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [tiltDisabled, maxTilt, rotateX, rotateY, glareX, glareY]
  );

  const handleMouseEnter = useCallback(() => {
    // Detect touch on first interaction
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) {
      setIsTouchDevice(true);
      return;
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rotateX, rotateY, glareX, glareY]);

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative", className)}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        rotateX: tiltDisabled ? 0 : springRotateX,
        rotateY: tiltDisabled ? 0 : springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={
        tiltDisabled
          ? { boxShadow: "0 0 20px rgba(59, 130, 246, 0.15)" }
          : undefined
      }
    >
      {children}

      {/* Glare overlay */}
      {glareEffect && isHovered && !tiltDisabled && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}

export type { TiltCardProps };
