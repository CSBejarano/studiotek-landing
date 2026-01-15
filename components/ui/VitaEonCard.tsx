import { cn } from "@/lib/utils";
import { ShineBorder } from "@/components/magicui/shine-border";

interface VitaEonCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet';
  showAccentLine?: boolean;
  variant?: 'default' | 'form'; // form = sin transform 3D para no interferir con inputs
}

export function VitaEonCard({
  children,
  className,
  glowColor = 'blue',
  showAccentLine = true,
  variant = 'default'
}: VitaEonCardProps) {
  const glowColors = {
    blue: 'bg-blue-500/30',
    purple: 'bg-purple-500/30',
    indigo: 'bg-indigo-500/30',
    cyan: 'bg-cyan-500/30',
    emerald: 'bg-emerald-500/30',
    amber: 'bg-amber-500/30',
    violet: 'bg-violet-500/30',
  };

  const accentColors = {
    blue: 'via-blue-500',
    purple: 'via-purple-500',
    indigo: 'via-indigo-500',
    cyan: 'via-cyan-500',
    emerald: 'via-emerald-500',
    amber: 'via-amber-500',
    violet: 'via-violet-500',
  };

  const shineColorMap = {
    blue: ['#3b82f6', '#06b6d4'],
    purple: ['#a855f7', '#ec4899'],
    indigo: ['#6366f1', '#8b5cf6'],
    cyan: ['#06b6d4', '#22d3ee'],
    emerald: ['#10b981', '#059669'],
    amber: ['#f59e0b', '#f97316'],
    violet: ['#8b5cf6', '#a855f7'],
  };

  return (
    <div className="[perspective:1000px] group h-full">
      <div className={cn(
        // Base styles
        "relative overflow-hidden rounded-xl h-full",
        "bg-slate-900/85 backdrop-blur-sm",
        "border border-blue-500/20",
        "shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
        "transition-all duration-500 ease-out",
        "[transform-style:preserve-3d]",
        // Hover styles
        "hover:border-blue-500/50",
        "hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)]",
        // Transform 3D solo para variant="default" y md+
        variant === 'default' && "md:hover:[transform:perspective(1000px)_rotateY(-3deg)_rotateX(2deg)_translateY(-8px)_translateZ(10px)]",
        className
      )}>
        {/* ShineBorder - efecto shimmer sutil */}
        <ShineBorder
          borderWidth={1}
          duration={12}
          shineColor={shineColorMap[glowColor]}
        />

        {/* Glow decorativo - top right */}
        <div
          className={cn(
            "absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl",
            "opacity-0 pointer-events-none transition-opacity duration-500",
            "group-hover:opacity-70",
            glowColors[glowColor]
          )}
        />

        {/* Glow decorativo - bottom left */}
        <div
          className={cn(
            "absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl",
            "opacity-0 pointer-events-none transition-opacity duration-500",
            "group-hover:opacity-50",
            glowColors[glowColor]
          )}
        />

        {/* Contenido */}
        <div className="relative z-10 h-full">
          {children}
        </div>

        {/* Linea de acento */}
        {showAccentLine && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1",
              "bg-gradient-to-r from-transparent to-transparent",
              "opacity-0 group-hover:opacity-50 transition-opacity duration-300",
              accentColors[glowColor]
            )}
          />
        )}
      </div>
    </div>
  );
}
