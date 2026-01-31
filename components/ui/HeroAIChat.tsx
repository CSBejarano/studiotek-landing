'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAIChatPanel } from './AIChatPanelContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function HeroAIChat() {
  const { openPanel, isPanelOpen } = useAIChatPanel();

  const handleClick = useCallback(() => {
    openPanel();
  }, [openPanel]);

  return (
    <AnimatePresence>
      {!isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="fixed bottom-6 right-6 z-[60]"
        >
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
              // Shape - rounded square like the logo
              "relative w-14 h-14 rounded-2xl overflow-hidden",
              // Shadow
              "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
              "hover:shadow-[0_6px_32px_rgba(0,0,0,0.5)]",
              "transition-shadow duration-300",
              // Focus
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
              // Flex center
              "flex items-center justify-center"
            )}
            aria-label="Abrir chat con StudioTek IA"
          >
            <Image
              src="/logo-icon.png"
              alt="StudioTek AI"
              width={56}
              height={56}
              className="w-full h-full object-cover"
              priority
            />

            {/* Online pulse indicator */}
            <span className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white">
              <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
