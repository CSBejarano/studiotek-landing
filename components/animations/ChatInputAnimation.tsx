'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ChatInputAnimationProps {
  className?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#f59e0b',   // amber-500
  secondary: '#ea580c', // orange-600
};

const TEXT = '¿Cómo puedo ayudarte?';
const TYPING_SPEED = 80; // ms per character
const PAUSE_DURATION = 1200; // ms pause after complete
const CLEAR_DURATION = 400; // ms for clear animation

export function ChatInputAnimation({
  className = '',
  colors = DEFAULT_COLORS,
}: ChatInputAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  const [animatedText, setAnimatedText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clear'>('typing');

  // Calculate displayed text: full text if reduced motion, animated otherwise
  const displayText = shouldReduceMotion ? TEXT : animatedText;

  useEffect(() => {
    // Skip animation logic if reduced motion is enabled
    if (shouldReduceMotion) {
      return;
    }

    let timeout: NodeJS.Timeout;

    if (phase === 'typing') {
      if (animatedText.length < TEXT.length) {
        timeout = setTimeout(() => {
          setAnimatedText(TEXT.slice(0, animatedText.length + 1));
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => {
          setPhase('pause');
        }, PAUSE_DURATION);
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => {
        setPhase('clear');
      }, 100);
    } else if (phase === 'clear') {
      timeout = setTimeout(() => {
        setAnimatedText('');
        setPhase('typing');
      }, CLEAR_DURATION);
    }

    return () => clearTimeout(timeout);
  }, [animatedText, phase, shouldReduceMotion]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
    >
      <div
        className="w-full h-12 rounded-xl px-4 flex items-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
          border: `1px solid ${colors.primary}40`,
        }}
      >
        <span
          className="text-sm font-medium whitespace-nowrap overflow-hidden"
          style={{ color: colors.primary }}
        >
          {displayText}
        </span>
        <motion.span
          className="ml-0.5 inline-block w-0.5 h-4"
          style={{ backgroundColor: colors.primary }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  opacity: [1, 0, 1],
                }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.5, 1],
          }}
        />
      </div>
    </div>
  );
}
