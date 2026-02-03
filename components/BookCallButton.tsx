'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { BookingModal } from '@/components/BookingModal';
import { cn } from '@/lib/utils';

interface BookCallButtonProps {
  leadId?: string;
  leadName?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  className?: string;
}

const variantStyles: Record<NonNullable<BookCallButtonProps['variant']>, string> = {
  primary: cn(
    'inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold',
    'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/25',
    'transition-all hover:bg-[#2563eb] hover:shadow-[#3b82f6]/40 hover:scale-[1.02]',
    'focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]',
    'active:scale-[0.98]'
  ),
  secondary: cn(
    'inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold',
    'border border-[#3b82f6]/40 text-[#60a5fa] bg-transparent',
    'transition-all hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]',
    'focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50'
  ),
  inline: cn(
    'inline-flex items-center gap-1.5 text-sm font-medium',
    'text-[#60a5fa] underline-offset-2',
    'transition-colors hover:text-[#93bbfd] hover:underline',
    'focus:outline-none focus:underline'
  ),
};

export function BookCallButton({
  leadId,
  leadName,
  variant = 'primary',
  className,
}: BookCallButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(variantStyles[variant], className)}
        aria-label="Agendar llamada gratuita"
      >
        {variant !== 'inline' && <Calendar size={18} aria-hidden="true" />}
        Agendar llamada gratuita
      </button>

      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        leadId={leadId}
        leadName={leadName}
      />
    </>
  );
}

BookCallButton.displayName = 'BookCallButton';
