'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 h-[22rem] w-64 md:h-[30rem] md:w-80 lg:h-[32rem] lg:w-[22rem] overflow-hidden flex flex-col cursor-pointer hover:border-slate-600/50 hover:shadow-xl hover:shadow-indigo-500/20 flex-shrink-0 group"
    >
      {/* Image or Gradient Background */}
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </>
        ) : (
          <Icon className="absolute bottom-4 right-4 text-white/20 transition-transform duration-300 group-hover:scale-110" size={100} strokeWidth={1} />
        )}
      </div>

      {/* Card Info */}
      <div className="p-5 md:p-6">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1.5">
          {card.category}
        </p>
        <p className="text-xl md:text-2xl font-semibold text-white">
          {card.title}
        </p>
      </div>
    </motion.div>
  );
}
