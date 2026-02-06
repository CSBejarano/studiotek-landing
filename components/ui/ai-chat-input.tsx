'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRotatingPlaceholder } from '@/hooks/useRotatingPlaceholder';
import { useWhisperRecording } from '@/hooks/useWhisperRecording';
import { useNativeSpeechRecognition } from '@/hooks/useNativeSpeechRecognition';

interface AIChatInputProps {
  onSend?: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: (transcript: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  placeholders?: string[];
  className?: string;
  disabled?: boolean;
  isProcessing?: boolean;
}

const defaultPlaceholders = [
  '¿Que quieres automatizar?',
  'Cuentanos sobre tu negocio...',
  '¿Como podemos ayudarte?',
  'Describe tu proceso actual...',
  '¿Que tareas te quitan mas tiempo?',
];

export function AIChatInput({
  onSend, onVoiceStart, onVoiceEnd, onFocus,
  placeholder, placeholders = defaultPlaceholders,
  className, disabled = false, isProcessing = false,
}: AIChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [useWhisperFallback, setUseWhisperFallback] = useState(false);

  const native = useNativeSpeechRecognition({
    onTranscript: useCallback((text: string) => setValue(text), []),
    onEnd: useCallback((transcript: string) => { onVoiceEnd?.(transcript); setValue(''); }, [onVoiceEnd]),
    onError: useCallback((err: string) => setVoiceError(err), []),
    onNetworkError: useCallback(() => {
      setUseWhisperFallback(true);
      setVoiceError('Cambiando a modo alternativo...');
      setTimeout(() => setVoiceError(null), 2000);
    }, []),
    onStart: onVoiceStart,
  });

  const whisper = useWhisperRecording({
    onTranscript: useCallback((text: string) => setValue(text), []),
    onFinalTranscript: useCallback((text: string) => { onVoiceEnd?.(text); setValue(''); }, [onVoiceEnd]),
    onError: useCallback((err: string) => setVoiceError(err), []),
    onStart: onVoiceStart,
    transcriptionIntervalMs: 2500,
  });

  const isWhisper = useWhisperFallback || !native.isSupported;
  const isListening = native.isListening || whisper.isRecording;
  const isTranscribing = whisper.isTranscribing;
  const isVoiceActive = isListening || isTranscribing;

  const currentPlaceholder = useRotatingPlaceholder({
    placeholders, intervalMs: 3000,
    paused: isFocused || !!value || isVoiceActive,
  });

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled || isProcessing) return;
    onSend?.(value.trim());
    setValue('');
    setVoiceError(null);
  }, [value, disabled, isProcessing, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const toggleVoice = useCallback(() => {
    setVoiceError(null);
    if (isListening) {
      isWhisper ? whisper.stopRecording() : native.stopListening();
    } else {
      setValue('');
      isWhisper ? whisper.startRecording() : native.startListening();
    }
  }, [isListening, isWhisper, whisper, native]);

  type StatusType = 'listening-native' | 'listening-whisper' | 'transcribing' | 'processing' | 'error' | null;
  const currentStatus: StatusType = useMemo(() => {
    if (isListening && !isWhisper) return 'listening-native';
    if (isListening && isWhisper) return 'listening-whisper';
    if (isTranscribing) return 'transcribing';
    if (isProcessing && !isTranscribing) return 'processing';
    if (voiceError && !isListening && !isTranscribing) return 'error';
    return null;
  }, [isListening, isWhisper, isTranscribing, isProcessing, voiceError]);

  const displayPlaceholder = placeholder || placeholders[currentPlaceholder];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn('relative w-full mx-auto', className)}
    >
      <div
        className={cn(
          'relative flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300',
          'bg-white/[0.05] backdrop-blur-xl border border-white/[0.12]',
          isFocused && 'border-[#2563EB]/40 shadow-[0_0_40px_rgba(37,99,235,0.15),0_8px_32px_rgba(0,0,0,0.3)]',
          isListening && !isWhisper && 'border-[#2563EB]/40 shadow-lg shadow-[#2563EB]/20',
          isListening && isWhisper && 'border-red-500/30 shadow-lg shadow-red-500/20',
        )}
      >
        <div className="relative flex-1 flex items-center h-[24px]">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => { setIsFocused(true); onFocus?.(); }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isProcessing || isTranscribing}
            className={cn(
              'w-full bg-transparent text-white placeholder-transparent outline-none border-0 ring-0 focus:ring-0 focus:border-0 focus:outline-none text-base leading-6 p-0',
              disabled && 'opacity-50 cursor-not-allowed',
            )}
          />
          <AnimatePresence mode="wait">
            {!value && !isFocused && !isVoiceActive && !isProcessing && (
              <motion.span
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-base leading-6 text-white/40 pointer-events-none truncate"
              >
                {displayPlaceholder}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoice}
            disabled={disabled || isTranscribing}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              isListening && !isWhisper
                ? 'text-[#2563EB] bg-[#2563EB]/20 border border-[#2563EB]/30'
                : isListening && isWhisper
                  ? 'text-red-400 bg-red-500/20 border border-red-500/30 animate-pulse'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.06]',
            )}
            aria-label={isListening ? 'Detener grabacion' : 'Iniciar grabacion de voz'}
          >
            <Mic className={cn('w-5 h-5', isListening && 'animate-pulse')} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled || isProcessing || isTranscribing}
            className={cn(
              'p-3 rounded-full transition-all duration-200',
              value.trim() && !disabled && !isProcessing && !isTranscribing
                ? 'bg-[#2563EB] text-white hover:bg-[#3B82F6] shadow-lg shadow-[#2563EB]/25'
                : 'bg-white/[0.08] text-white/30 cursor-not-allowed',
            )}
            aria-label="Enviar mensaje"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <StatusIndicator status={currentStatus} voiceError={voiceError} />
    </motion.div>
  );
}

type StatusType = 'listening-native' | 'listening-whisper' | 'transcribing' | 'processing' | 'error' | null;

function StatusIndicator({ status, voiceError }: { status: StatusType; voiceError: string | null }) {
  if (!status) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={cn(
          'flex items-center justify-center gap-2 text-sm mt-3',
          status === 'listening-native' && 'text-[#2563EB]',
          status === 'listening-whisper' && 'text-red-400',
          status === 'transcribing' && 'text-[#3B82F6]',
          status === 'processing' && 'text-[#2563EB]',
          status === 'error' && 'text-red-400',
        )}>
          {status === 'listening-native' && <><BouncingDots color="bg-[#2563EB]" />Escuchando...</>}
          {status === 'listening-whisper' && <><BouncingDots color="bg-red-500" />Grabando... (toca para detener)</>}
          {status === 'transcribing' && <><Loader2 className="w-4 h-4 animate-spin" />Transcribiendo...</>}
          {status === 'processing' && <><Loader2 className="w-4 h-4 animate-spin" />Procesando...</>}
          {status === 'error' && voiceError}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function BouncingDots({ color }: { color: string }) {
  return (
    <span className="flex gap-1">
      <span className={cn('w-1.5 h-1.5 rounded-full animate-bounce', color)} style={{ animationDelay: '0ms' }} />
      <span className={cn('w-1.5 h-1.5 rounded-full animate-bounce', color)} style={{ animationDelay: '150ms' }} />
      <span className={cn('w-1.5 h-1.5 rounded-full animate-bounce', color)} style={{ animationDelay: '300ms' }} />
    </span>
  );
}
