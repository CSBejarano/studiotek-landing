import React, { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  rippleColor?: string;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  rippleColor = "var(--foreground)",
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;

        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full border shadow-xl"
            style={
              {
                "--i": i,
                "--duration": "3.5s",
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: rippleColor,
                backgroundColor: `${rippleColor}15`,
                top: "50%",
                left: "50%",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
