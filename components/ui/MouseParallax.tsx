"use client";

import { cn } from "@/lib/utils";
import { useMousePosition } from "@/hooks/useMousePosition";

interface ParallaxLayer {
  /** The React node to render in this layer */
  element: React.ReactNode;
  /** Depth factor: 0 = static, 1 = maximum movement */
  depth: number;
}

interface MouseParallaxProps {
  /** Content rendered above all parallax layers */
  children?: React.ReactNode;
  /** Array of layers with depth-based parallax movement */
  layers: ParallaxLayer[];
  /** Maximum offset in pixels at depth=1 (default: 40) */
  maxOffset?: number;
  className?: string;
}

/**
 * Container with depth-based parallax layers that respond to mouse position.
 *
 * Features:
 * - Each layer moves proportionally to its `depth` value and the mouse position.
 * - `depth: 0` = static, `depth: 1` = maximum displacement.
 * - Uses `useMousePosition` hook (returns 0,0 on touch devices = no movement).
 * - GPU-accelerated via `transform: translate3d()`.
 * - `will-change: transform` on each layer for compositor optimization.
 * - Children are rendered above all layers at z-10.
 *
 * @example
 * ```tsx
 * <MouseParallax
 *   layers={[
 *     { element: <div className="bg-blue-500/20 w-32 h-32 rounded-full blur-xl" />, depth: 0.3 },
 *     { element: <div className="bg-purple-500/20 w-24 h-24 rounded-full blur-lg" />, depth: 0.7 },
 *   ]}
 *   maxOffset={50}
 * >
 *   <h2>Content on top</h2>
 * </MouseParallax>
 * ```
 */
export function MouseParallax({
  children,
  layers,
  maxOffset = 40,
  className,
}: MouseParallaxProps) {
  const { x, y } = useMousePosition();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Parallax layers */}
      {layers.map((layer, index) => {
        const offsetX = layer.depth * x * maxOffset;
        const offsetY = layer.depth * y * maxOffset;

        return (
          <div
            key={index}
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
              willChange: "transform",
            }}
          >
            {layer.element}
          </div>
        );
      })}

      {/* Main content above layers */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export type { MouseParallaxProps, ParallaxLayer };
