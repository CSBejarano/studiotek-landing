'use client';

import { cn } from '@/lib/utils';

interface SectionDividerProps {
  className?: string;
  variant?: 'gradient' | 'line' | 'wave';
  color?: 'blue' | 'indigo' | 'emerald';
}

const colorMap = {
  blue: { from: 'from-blue-500/0', via: 'via-blue-500/30', to: 'to-blue-500/0' },
  indigo: { from: 'from-indigo-500/0', via: 'via-indigo-500/30', to: 'to-indigo-500/0' },
  emerald: { from: 'from-emerald-500/0', via: 'via-emerald-500/30', to: 'to-emerald-500/0' },
};

export function SectionDivider({
  className,
  variant = 'gradient',
  color = 'blue',
}: SectionDividerProps) {
  const colors = colorMap[color];

  if (variant === 'line') {
    return (
      <div className={cn('relative h-px w-full', className)}>
        <div className={cn(
          'absolute inset-0 bg-gradient-to-r',
          colors.from, colors.via, colors.to
        )} />
      </div>
    );
  }

  return (
    <div className={cn('relative h-24 w-full overflow-hidden', className)}>
      <div className={cn(
        'absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent'
      )} />
      <div className={cn(
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        'h-px w-2/3 bg-gradient-to-r',
        colors.from, colors.via, colors.to
      )} />
    </div>
  );
}
