'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CardData {
  title: string;
  category: string;
  gradient: string;
  icon: React.ElementType;
  content: React.ReactNode;
  image?: string;
}

interface CarouselCardProps {
  card: CardData;
  index: number;
  onClick?: () => void;
}

export function CarouselCard({ card, index, onClick }: CarouselCardProps) {
  const Icon = card.icon;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        "relative",
        "aspect-square sm:aspect-[3/4] w-full",
        "rounded-2xl sm:rounded-3xl bg-black overflow-hidden",
        "cursor-pointer group",
        "shadow-xl shadow-black/40",
        "hover:shadow-2xl hover:shadow-black/50"
      )}
    >
      {/* Full-bleed Image */}
      {card.image ? (
        <>
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/30" />
        </>
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', card.gradient)}>
          <Icon
            className="absolute bottom-8 right-8 text-white/20 transition-transform duration-500 group-hover:scale-110"
            size={120}
            strokeWidth={0.8}
          />
        </div>
      )}

      {/* Text overlaid on top */}
      <div className="absolute top-0 left-0 z-10 p-4 pt-5 sm:p-6 sm:pt-8">
        <p className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-widest font-medium mb-1 sm:mb-2">
          {card.category}
        </p>
        <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
          {card.title}
        </h3>
      </div>

      {/* Boton "+" */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={cn(
          "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20",
          "w-9 h-9 min-h-[36px] min-w-[36px] sm:w-11 sm:h-11 sm:min-h-[44px] sm:min-w-[44px] rounded-full",
          "bg-white/10 backdrop-blur-sm",
          "flex items-center justify-center",
          "text-white/90",
          "transition-all duration-300",
          "hover:bg-white/20 hover:scale-110"
        )}
        aria-label={`Ver detalles de ${card.title}`}
      >
        <Plus size={20} strokeWidth={2} />
      </button>
    </motion.div>
  );
}
