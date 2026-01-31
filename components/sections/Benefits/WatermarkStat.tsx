interface WatermarkStatProps {
  value: string;
  isDark?: boolean;
  align?: 'left' | 'right' | 'center';
  mobile?: boolean;
}

export function WatermarkStat({ value, isDark = true, align = 'right', mobile = false }: WatermarkStatProps) {
  const alignClass = {
    left: 'justify-start pl-[14%]',
    right: 'justify-end pr-4',
    center: 'justify-center',
  }[align];

  const sizeClass = mobile
    ? 'text-[15vw]'
    : 'text-[18vw] sm:text-[20vw]';

  return (
    <div
      className={`absolute inset-0 flex items-end ${alignClass} overflow-hidden z-0 select-none pointer-events-none`}
      aria-hidden="true"
    >
      <span
        className={`font-mono font-black ${sizeClass} leading-none pb-4
          ${isDark ? 'text-white/[0.03]' : 'text-black/[0.05]'}`}
      >
        {value}
      </span>
    </div>
  );
}
