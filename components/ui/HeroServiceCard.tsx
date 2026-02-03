'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CardData } from '@/components/ui/CarouselCard';

interface HeroServiceCardProps {
  card: CardData;
  className?: string;
}

/**
 * HeroServiceCard - Decorative large card for expanding card background.
 *
 * Renders a large version of a service card WITHOUT Framer Motion.
 * Visible through the clip-path "window" of the overlay.
 * Uses CardData interface from CarouselCard for data consistency.
 *
 * IMPORTANT: No motion.div, no whileHover, no whileTap.
 * GSAP controls this element's opacity via ref from parent.
 */
export function HeroServiceCard({ card, className }: HeroServiceCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute inset-0',
        'bg-black overflow-hidden',
        'pointer-events-none select-none',
        className
      )}
    >
      {/* Full-viewport Image */}
      {card.image ? (
        <>
          <Image
            src={card.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </>
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', card.gradient)} />
      )}
    </div>
  );
}
