'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';
import type { CardData } from '@/components/ui/CarouselCard';

export interface ServiceModalProps {
  card: CardData | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function ServiceModal({
  card,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: ServiceModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, onClose);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev && onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            e.preventDefault();
            onNext();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  // Don't render if no card
  if (!card) return null;

  const Icon = card.icon;

  return (
    <>
      {/* Backdrop - TRUE fullscreen overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />

      {/* Modal Container with Navigation - All inside containerRef for useOutsideClick */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 35
        }}
        className="fixed inset-0 flex items-center justify-center p-4 md:p-6 lg:p-8"
        style={{ zIndex: 99999 }}
      >
        {/* Navigation Button - Left */}
        {hasPrev && onPrev && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/90 border border-slate-700/50 text-white hover:bg-slate-700/90 hover:border-slate-600/50 transition-colors backdrop-blur-sm hover:scale-110"
            aria-label="Servicio anterior"
          >
            <ChevronLeft size={28} />
          </motion.button>
        )}

        {/* Navigation Button - Right */}
        {hasNext && onNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/90 border border-slate-700/50 text-white hover:bg-slate-700/90 hover:border-slate-600/50 transition-colors backdrop-blur-sm hover:scale-110"
            aria-label="Servicio siguiente"
          >
            <ChevronRight size={28} />
          </motion.button>
        )}

        {/* Modal Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.title}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35
            }}
            className="w-full max-w-4xl max-h-[92vh] min-h-[70vh] bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header with Gradient - Larger */}
            <div className={cn(
              "relative h-44 md:h-56 lg:h-64 flex-shrink-0 overflow-hidden",
              !card.image && `bg-gradient-to-br ${card.gradient}`
            )}>
              {card.image ? (
                <>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                </>
              ) : (
                <Icon className="absolute bottom-3 right-4 text-white/15" size={100} strokeWidth={1} />
              )}

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              {/* Title overlay on gradient */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-900 to-transparent">
                <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">
                  {card.category}
                </p>
                <h3 id="modal-title" className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                  {card.title}
                </h3>
              </div>
            </div>

            {/* Scrollable Content Area - More spacious */}
            <div
              className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 transparent'
              }}
            >
              <div className="text-slate-300 text-base md:text-lg leading-relaxed">
                {card.content}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
