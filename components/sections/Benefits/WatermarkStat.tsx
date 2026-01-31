interface WatermarkStatProps {
  value: string;
  isDark?: boolean;
  align?: 'left' | 'right' | 'center';
}

export function WatermarkStat({ value, isDark = true, align = 'right' }: WatermarkStatProps) {
  const alignClass = {
    left: 'justify-start pl-[14%]',
    right: 'justify-end pr-4',
    center: 'justify-center',
  }[align];

  return (
    <div
      className={`absolute inset-0 flex items-end ${alignClass} overflow-hidden z-0 select-none pointer-events-none`}
      aria-hidden="true"
    >
      <span
        className={`font-mono font-black text-[18vw] sm:text-[20vw] leading-none pb-4
          ${isDark ? 'text-white/[0.03]' : 'text-black/[0.05]'}`}
      >
        {value}
      </span>
    </div>
  );
}
