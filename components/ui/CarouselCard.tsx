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
        "relative flex flex-col",
        "aspect-[3/4] sm:aspect-[9/16] w-full",
        "rounded-3xl bg-black overflow-hidden",
        "cursor-pointer group",
        "shadow-xl shadow-black/40",
        "hover:shadow-2xl hover:shadow-black/50"
      )}
    >
      {/* Texto ARRIBA */}
      <div className="relative z-10 p-6 pt-8">
        <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium mb-2">
          {card.category}
        </p>
        <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
          {card.title}
        </h3>
      </div>

      {/* Imagen ABAJO */}
      <div className={cn(
        "relative flex-1 overflow-hidden",
        !card.image && `bg-gradient-to-br ${card.gradient}`
      )}>
        {card.image ? (
          <>
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
          </>
        ) : (
          <Icon
            className="absolute bottom-8 right-8 text-white/20 transition-transform duration-500 group-hover:scale-110"
            size={120}
            strokeWidth={0.8}
          />
        )}
      </div>

      {/* Boton "+" */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={cn(
          "absolute bottom-4 right-4 z-20",
          "w-11 h-11 min-h-[44px] min-w-[44px] rounded-full",
          "bg-slate-800/80 backdrop-blur-sm",
          "flex items-center justify-center",
          "text-white/90",
          "transition-all duration-300",
          "hover:bg-slate-700 hover:scale-110"
        )}
        aria-label={`Ver detalles de ${card.title}`}
      >
        <Plus size={20} strokeWidth={2} />
      </button>
    </motion.div>
  );
}
