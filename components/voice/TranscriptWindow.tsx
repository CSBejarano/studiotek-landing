'use client';

import { useRef, useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Mic, MicOff, Loader2, Volume2, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceAgentContext } from './VoiceAgentProvider';
import type { Message, VoiceState } from '@/lib/voice/types';

// ============================================================================
// Types
// ============================================================================

interface TranscriptWindowProps {
  className?: string;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

// ============================================================================
// Animation Variants
// ============================================================================

const windowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const messageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
};

// ============================================================================
// State Indicator Configuration
// ============================================================================

interface StateIndicatorConfig {
  icon: typeof Mic;
  text: string;
  colorClass: string;
  animate?: boolean;
}

const stateIndicators: Record<VoiceState, StateIndicatorConfig> = {
  idle: {
    icon: Mic,
    text: 'Listo para escuchar',
    colorClass: 'text-slate-400',
    animate: false,
  },
  listening: {
    icon: Mic,
    text: 'Escuchando...',
    colorClass: 'text-emerald-400',
    animate: true,
  },
  processing: {
    icon: Loader2,
    text: 'Procesando...',
    colorClass: 'text-amber-400',
    animate: true,
  },
  speaking: {
    icon: Volume2,
    text: 'Hablando...',
    colorClass: 'text-blue-400',
    animate: true,
  },
  error: {
    icon: AlertCircle,
    text: 'Error',
    colorClass: 'text-red-400',
    animate: false,
  },
};

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Format timestamp to readable time
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Message Bubble Component
 */
function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Don't render system messages
  if (isSystem) return null;

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      {/* Message content */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5',
          'text-sm leading-relaxed',
          isUser
            ? 'bg-blue-600/20 text-blue-50 rounded-br-md'
            : 'bg-slate-800/50 text-slate-200 rounded-bl-md'
        )}
      >
        {message.content}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-slate-500 px-2">
        {formatTime(message.timestamp)}
      </span>
    </motion.div>
  );
}

/**
 * Skeleton Loader for processing state
 */
function SkeletonLoader() {
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-1.5 w-[70%]">
        <div className="h-4 bg-slate-700/50 rounded-full animate-pulse" />
        <div className="h-4 bg-slate-700/50 rounded-full animate-pulse w-[80%]" />
        <div className="h-4 bg-slate-700/50 rounded-full animate-pulse w-[60%]" />
      </div>
    </div>
  );
}

/**
 * State Indicator Component
 */
function StateIndicator({ state }: { state: VoiceState }) {
  const config = stateIndicators[state];
  const IconComponent = config.icon;

  return (
    <div className={cn('flex items-center gap-2 text-xs', config.colorClass)}>
      <IconComponent
        className={cn(
          'w-3.5 h-3.5',
          config.animate && state === 'processing' && 'animate-spin',
          config.animate && state === 'listening' && 'animate-pulse'
        )}
      />
      <span>{config.text}</span>
      {config.animate && state === 'listening' && (
        <span className="flex gap-0.5">
          <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
        </span>
      )}
    </div>
  );
}

/**
 * Text Input Component for fallback when voice is not available
 */
interface TextInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

function TextInput({ onSend, disabled }: TextInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        disabled={disabled}
        className={cn(
          'flex-1 px-3 py-2 rounded-lg',
          'bg-slate-800/50 border border-slate-700/50',
          'text-sm text-slate-200 placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-150'
        )}
        aria-label="Escribe tu mensaje"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className={cn(
          'p-2 rounded-lg',
          'bg-purple-600/80 hover:bg-purple-600',
          'text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
          'transition-all duration-150'
        )}
        aria-label="Enviar mensaje"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * TranscriptWindow
 *
 * Displays the voice conversation transcript in a floating window.
 * Shows messages from both user and assistant with timestamps.
 *
 * Features:
 * - Auto-scroll to new messages
 * - Glassmorphism styling
 * - State indicator in footer
 * - AnimatePresence for smooth transitions
 * - Skeleton loader during processing
 *
 * @example
 * ```tsx
 * <TranscriptWindow />
 * ```
 */
export function TranscriptWindow({ className }: TranscriptWindowProps) {
  const {
    isActive,
    voiceState,
    messages,
    currentTranscript,
    isListeningPaused,
    actions,
  } = useVoiceAgentContext();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showMicTip, setShowMicTip] = useState(false);
  const tipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript]);

  // Show mic tip after 8 seconds in listening state with no user messages
  useEffect(() => {
    const userMessages = messages.filter(m => m.role === 'user');

    if (voiceState === 'listening' && userMessages.length === 0 && !isListeningPaused) {
      tipTimerRef.current = setTimeout(() => {
        setShowMicTip(true);
      }, 8000);
    } else {
      setShowMicTip(false);
      if (tipTimerRef.current) {
        clearTimeout(tipTimerRef.current);
        tipTimerRef.current = null;
      }
    }

    return () => {
      if (tipTimerRef.current) {
        clearTimeout(tipTimerRef.current);
      }
    };
  }, [voiceState, messages, isListeningPaused]);

  // Filter out system messages for display
  const displayMessages = messages.filter((m) => m.role !== 'system');

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          variants={windowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            // Position: above VoiceButton
            'fixed bottom-24 right-6 z-50',
            // Size
            'w-80 max-h-96',
            // Glassmorphism
            'bg-slate-900/80 backdrop-blur-md',
            // Border
            'border border-slate-700/50',
            // Rounded
            'rounded-2xl',
            // Shadow
            'shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
            // Flex layout
            'flex flex-col',
            // Overflow
            'overflow-hidden',
            className
          )}
          role="dialog"
          aria-label="Transcripcion de conversacion"
          aria-live="polite"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-medium text-slate-200">
                Asistente StudioTek
              </h2>
            </div>
            <button
              onClick={() => actions.deactivate()}
              className={cn(
                'p-1.5 rounded-lg',
                'text-slate-400 hover:text-slate-200',
                'hover:bg-slate-700/50',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/50'
              )}
              aria-label="Cerrar transcripcion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Message list */}
          <div
            ref={scrollRef}
            className={cn(
              'flex-1 overflow-y-auto',
              'px-4 py-3',
              'space-y-3',
              // Custom scrollbar
              'scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent'
            )}
          >
            {displayMessages.length === 0 && voiceState !== 'processing' ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Mic className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">
                  Habla o escribe para comenzar
                </p>
                {/* Mic tip when voice is not working */}
                <AnimatePresence>
                  {showMicTip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                    >
                      <p className="text-xs text-amber-400">
                        Tip: Si el microfono no captura tu voz, escribe tu mensaje en el campo de texto
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {displayMessages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    index={index}
                  />
                ))}

                {/* Show current transcript while user is speaking */}
                {currentTranscript && voiceState === 'listening' && (
                  <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-end gap-1"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 bg-blue-600/10 text-blue-200/70 text-sm italic">
                      {currentTranscript}...
                    </div>
                  </motion.div>
                )}

                {/* Skeleton loader while processing */}
                {voiceState === 'processing' && <SkeletonLoader />}
              </>
            )}
          </div>

          {/* Footer: Text input + State indicator + Mic toggle */}
          <div className="border-t border-slate-700/50 bg-slate-900/50">
            {/* Text Input - always visible as fallback */}
            <div className="px-4 pt-3 pb-2">
              <TextInput
                onSend={(text) => actions.sendTextMessage(text)}
                disabled={voiceState === 'processing' || voiceState === 'speaking'}
              />
            </div>
            {/* State indicator + Mic toggle */}
            <div className="px-4 pb-2.5 flex items-center justify-between">
              <StateIndicator state={isListeningPaused ? 'idle' : voiceState} />
              {/* Mic toggle button */}
              <button
                onClick={() => isListeningPaused ? actions.resumeListening() : actions.pauseListening()}
                disabled={voiceState === 'processing' || voiceState === 'speaking'}
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isListeningPaused
                    ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                )}
                aria-label={isListeningPaused ? 'Activar micrófono' : 'Pausar micrófono'}
                title={isListeningPaused ? 'Activar micrófono' : 'Pausar micrófono'}
              >
                {isListeningPaused ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default TranscriptWindow;
