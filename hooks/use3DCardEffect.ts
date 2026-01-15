"use client";

import { useState, useCallback, useRef, CSSProperties, RefObject } from "react";

interface Use3DCardEffectOptions {
  /** Rotation intensity 1-20, default 10 */
  intensity?: number;
  /** Hover scale, default 1.02 */
  scale?: number;
  /** Enable dynamic shadow, default true */
  shadow?: boolean;
  /** Transition duration in ms, default 150 */
  transitionDuration?: number;
}

interface Use3DCardEffectReturn {
  /** CSS styles to apply to the card */
  style: CSSProperties;
  /** Event handlers to attach to the card */
  handlers: {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  /** Ref to attach to the card element */
  ref: RefObject<HTMLDivElement | null>;
  /** Whether the card is currently being hovered */
  isHovered: boolean;
}

/**
 * Hook for creating an intense 3D card effect on hover.
 * Tracks mouse position and calculates rotation based on cursor location.
 *
 * Features:
 * - Dynamic rotation based on mouse position (up to 15 degrees)
 * - Smooth transitions with cubic-bezier easing
 * - Dynamic shadow that moves with rotation
 * - Scale effect on hover
 *
 * @example
 * ```tsx
 * const { style, handlers, ref } = use3DCardEffect({ intensity: 12 });
 * return (
 *   <div ref={ref} style={style} {...handlers}>
 *     Card content
 *   </div>
 * );
 * ```
 */
export function use3DCardEffect(
  options: Use3DCardEffectOptions = {}
): Use3DCardEffectReturn {
  const {
    intensity = 10,
    scale = 1.02,
    shadow = true,
    transitionDuration = 150,
  } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Max rotation capped at 15 degrees, scaled by intensity (1-20 maps to 0.75-15 degrees)
  const maxRotation = Math.min(15, (intensity / 20) * 15);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to center (-1 to 1)
      const relativeX = (e.clientX - centerX) / (rect.width / 2);
      const relativeY = (e.clientY - centerY) / (rect.height / 2);

      // Calculate rotation (inverted for natural feel)
      // Mouse on right -> card rotates left (negative Y rotation)
      // Mouse on bottom -> card rotates up (negative X rotation)
      const rotateY = -relativeX * maxRotation;
      const rotateX = relativeY * maxRotation;

      setRotation({ x: rotateX, y: rotateY });
    },
    [maxRotation]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smooth reset to original position
    setRotation({ x: 0, y: 0 });
  }, []);

  // Calculate dynamic shadow based on rotation
  const shadowOffsetX = isHovered ? rotation.y * -2 : 0;
  const shadowOffsetY = isHovered ? 20 + rotation.x * 2 : 8;
  const shadowBlur = isHovered ? 50 : 30;
  const shadowSpread = isHovered ? -5 : 0;

  const style: CSSProperties = {
    perspective: "1000px",
    transformStyle: "preserve-3d" as const,
    transform: isHovered
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${scale}, ${scale}, ${scale})`
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: `transform ${transitionDuration}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    ...(shadow && {
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.4)`,
    }),
  };

  return {
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    ref,
    isHovered,
  };
}

export type { Use3DCardEffectOptions, Use3DCardEffectReturn };
