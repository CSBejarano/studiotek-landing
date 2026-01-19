'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface AIChatInputProps {
  onSend?: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: (transcript: string) => void;
  placeholder?: string;
  placeholders?: string[];
  className?: string;
  disabled?: boolean;
  isProcessing?: boolean;
}

const defaultPlaceholders = [
  "¿Qué quieres automatizar?",
  "Cuéntanos sobre tu negocio...",
  "¿Cómo podemos ayudarte?",
  "Describe tu proceso actual...",
  "¿Qué tareas te quitan más tiempo?",
];

export function AIChatInput({
  onSend,
  onVoiceStart,
  onVoiceEnd,
  placeholder,
  placeholders = defaultPlaceholders,
  className,
  disabled = false,
  isProcessing = false,
}: AIChatInputProps) {
  const [value, setValue] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Rotating placeholders
  useEffect(() => {
    if (isFocused || value) return;

    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, value, placeholders.length]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) return;
      recognitionRef.current = new SpeechRecognitionAPI() as ISpeechRecognition;
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (value && onVoiceEnd) {
          onVoiceEnd(value);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [value, onVoiceEnd]);

  const handleSubmit = () => {
    if (!value.trim() || disabled || isProcessing) return;
    onSend?.(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setValue('');
      recognitionRef.current.start();
      setIsListening(true);
      onVoiceStart?.();
    }
  };

  const displayPlaceholder = placeholder || placeholders[currentPlaceholder];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "relative w-full max-w-2xl mx-auto",
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full opacity-20 blur-lg" />

      {/* Main container - Pill shape with dark background */}
      <div
        className={cn(
          "relative flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl rounded-full px-6 py-4 transition-all duration-300",
          isFocused && "shadow-lg shadow-blue-500/10",
          isListening && "shadow-lg shadow-green-500/20"
        )}
      >
        {/* Input area */}
        <div className="relative flex-1 flex items-center min-h-[24px] pl-4">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isProcessing}
            className={cn(
              "w-full bg-transparent text-white placeholder-transparent outline-none border-0 ring-0 focus:ring-0 focus:border-0 focus:outline-none text-base leading-6 p-0",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />

          {/* Animated placeholder - hides on focus */}
          <AnimatePresence mode="wait">
            {!value && !isFocused && (
              <motion.span
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-base leading-6 text-slate-400 pointer-events-none"
              >
                {displayPlaceholder}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            disabled={disabled}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              isListening
                ? "text-green-400 bg-green-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            )}
            aria-label={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
          >
            <Mic className={cn("w-5 h-5", isListening && "animate-pulse")} />
          </button>

          {/* Send button - Circular blue */}
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled || isProcessing}
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              value.trim() && !disabled && !isProcessing
                ? "bg-blue-500 text-white hover:bg-blue-400 shadow-md shadow-blue-500/30 hover:shadow-lg"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            )}
            aria-label="Enviar mensaje"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Status indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-green-500"
          >
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            Escuchando...
          </motion.div>
        )}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-blue-500"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Procesando...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
