'use client';

import { cn } from '@/lib/utils';

interface FloatingOrbsProps {
  className?: string;
  color?: 'blue' | 'indigo' | 'cyan';
  count?: number;
}

export function FloatingOrbs({
  className,
  color = 'blue',
  count = 2,
}: FloatingOrbsProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10',
    indigo: 'bg-indigo-500/10',
    cyan: 'bg-cyan-500/10',
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {count >= 1 && (
        <div
          className={cn(
            'absolute top-20 right-20 h-96 w-96 rounded-full blur-3xl animate-float',
            colorClasses[color]
          )}
          aria-hidden="true"
        />
      )}
      {count >= 2 && (
        <div
          className={cn(
            'absolute bottom-20 left-20 h-80 w-80 rounded-full blur-3xl animate-float-delayed',
            colorClasses[color]
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
