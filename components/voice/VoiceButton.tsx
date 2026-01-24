'use client';

import { motion, type Variants } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceAgentContext } from './VoiceAgentProvider';
import type { VoiceState } from '@/lib/voice/types';

// ============================================================================
// Types
// ============================================================================

interface VoiceButtonProps {
  className?: string;
}

// ============================================================================
// State Configuration
// ============================================================================

interface StateConfig {
  icon: typeof Mic;
  label: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
}

const stateConfigs: Record<VoiceState, StateConfig> = {
  idle: {
    icon: Mic,
    label: 'Activar asistente de voz',
    bgClass: 'from-purple-600 to-indigo-600',
    borderClass: 'border-purple-500/30',
    glowClass: 'shadow-purple-500/25',
  },
  listening: {
    icon: Mic,
    label: 'Escuchando... Hablá para interactuar',
    bgClass: 'from-emerald-500 to-green-600',
    borderClass: 'border-emerald-400/50',
    glowClass: 'shadow-emerald-500/40',
  },
  processing: {
    icon: Loader2,
    label: 'Procesando tu mensaje...',
    bgClass: 'from-amber-500 to-yellow-600',
    borderClass: 'border-amber-400/50',
    glowClass: 'shadow-amber-500/40',
  },
  speaking: {
    icon: Volume2,
    label: 'El asistente está hablando',
    bgClass: 'from-blue-500 to-cyan-600',
    borderClass: 'border-blue-400/50',
    glowClass: 'shadow-blue-500/40',
  },
  error: {
    icon: MicOff,
    label: 'Error - Click para reintentar',
    bgClass: 'from-red-500 to-rose-600',
    borderClass: 'border-red-400/50',
    glowClass: 'shadow-red-500/40',
  },
};

// ============================================================================
// Animation Variants
// ============================================================================

const buttonVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
};

const pulseVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 0,
  },
  listening: {
    scale: [1, 1.4, 1],
    opacity: [0.5, 0, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
  speaking: {
    scale: [1, 1.3, 1],
    opacity: [0.4, 0, 0.4],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const iconVariants: Variants = {
  idle: {
    rotate: 0,
  },
  processing: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
};

// ============================================================================
// Component
// ============================================================================

/**
 * VoiceButton
 *
 * Floating action button for activating/deactivating the voice agent.
 * Displays different visual states based on the current voice state.
 *
 * States:
 * - idle: Purple gradient, mic icon, subtle pulse
 * - listening: Green, mic with animated border waves
 * - processing: Amber, spinning loader
 * - speaking: Blue, volume icon with pulse
 * - error: Red, mic-off icon
 *
 * @example
 * ```tsx
 * <VoiceButton />
 * ```
 */
export function VoiceButton({ className }: VoiceButtonProps) {
  const { isActive, voiceState, isReady, actions } = useVoiceAgentContext();

  // Determine the effective state to display
  const displayState: VoiceState = isActive ? voiceState : 'idle';
  const config = stateConfigs[displayState];
  const IconComponent = config.icon;

  // Determine animation state
  const animationState = displayState === 'processing' ? 'processing' : 'idle';
  const pulseState = displayState === 'listening'
    ? 'listening'
    : displayState === 'speaking'
      ? 'speaking'
      : 'idle';

  const handleClick = () => {
    actions.toggle();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!isReady}
      className={cn(
        // Position
        'fixed bottom-6 right-6 z-50',
        // Size
        'w-16 h-16',
        // Shape
        'rounded-full',
        // Gradient background
        'bg-gradient-to-br',
        config.bgClass,
        // Border
        'border-2',
        config.borderClass,
        // Shadow with glow
        'shadow-lg',
        config.glowClass,
        // Focus ring for accessibility
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900',
        // Disabled state
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Cursor
        'cursor-pointer',
        // Touch optimization - eliminates 300ms delay on mobile
        'touch-fast',
        className
      )}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      aria-label={config.label}
      aria-pressed={isActive}
      role="button"
    >
      {/* Pulse animation ring */}
      <motion.span
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-gradient-to-br',
          config.bgClass,
          'pointer-events-none'
        )}
        variants={pulseVariants}
        animate={pulseState}
        aria-hidden="true"
      />

      {/* Inner glow effect */}
      <span
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-gradient-to-t from-white/0 to-white/20',
          'pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Icon container */}
      <motion.span
        className="relative flex items-center justify-center w-full h-full"
        variants={iconVariants}
        animate={animationState}
      >
        <IconComponent
          className="w-7 h-7 text-white drop-shadow-md"
          strokeWidth={2}
          aria-hidden="true"
        />
      </motion.span>

      {/* Active indicator dot */}
      {isActive && displayState !== 'error' && (
        <motion.span
          className={cn(
            'absolute top-1 right-1',
            'w-3 h-3 rounded-full',
            'bg-white shadow-sm',
            'border border-white/50'
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default VoiceButton;
