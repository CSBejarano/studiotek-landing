'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

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
  onFocus,
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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [useWhisperFallback, setUseWhisperFallback] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const transcriptRef = useRef<string>('');
  const onVoiceEndRef = useRef(onVoiceEnd);

  // MediaRecorder refs for Whisper fallback
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTranscribingRef = useRef(false);
  const mimeTypeRef = useRef<string>('audio/webm');

  // Keep onVoiceEnd ref updated
  useEffect(() => {
    onVoiceEndRef.current = onVoiceEnd;
  }, [onVoiceEnd]);

  // Rotating placeholders
  useEffect(() => {
    if (isFocused || value || isListening || isTranscribing) return;

    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFocused, value, isListening, isTranscribing, placeholders.length]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      // No Web Speech API available, use Whisper fallback
      setUseWhisperFallback(true);
      return;
    }

    const recognition = new SpeechRecognitionAPI() as ISpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      transcriptRef.current = fullTranscript;
      setValue(fullTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      const currentTranscript = transcriptRef.current;
      if (currentTranscript && onVoiceEndRef.current) {
        onVoiceEndRef.current(currentTranscript);
        // Reset input after sending - Bug #4 fix
        setValue('');
        transcriptRef.current = '';
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      // If network error, switch to Whisper fallback
      if (event.error === 'network') {
        console.log('Switching to Whisper fallback due to network error');
        setUseWhisperFallback(true);
        setVoiceError('Cambiando a modo alternativo...');
        // Auto-clear the error message
        setTimeout(() => setVoiceError(null), 2000);
        return;
      }

      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          setVoiceError('Permisos de micrófono denegados.');
          break;
        case 'no-speech':
          setVoiceError('No se detectó voz. Intenta de nuevo.');
          break;
        case 'audio-capture':
          setVoiceError('No se pudo acceder al micrófono.');
          break;
        case 'aborted':
          break;
        default:
          setVoiceError('Error de reconocimiento. Intenta de nuevo.');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // Cleanup MediaRecorder on unmount
  useEffect(() => {
    return () => {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled || isProcessing) return;
    onSend?.(value.trim());
    setValue('');
    setVoiceError(null);
  }, [value, disabled, isProcessing, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // No auto-resize - fixed height input

  // Whisper transcription (for partial/interim results)
  const transcribePartial = async () => {
    if (isTranscribingRef.current || audioChunksRef.current.length === 0) return;

    isTranscribingRef.current = true;

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });

      if (audioBlob.size < 1000) {
        isTranscribingRef.current = false;
        return; // Too small to transcribe
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        setValue(data.transcript);
        transcriptRef.current = data.transcript;
      }
    } catch (error) {
      console.error('Partial transcription error:', error);
    } finally {
      isTranscribingRef.current = false;
    }
  };

  // Whisper final transcription
  const transcribeWithWhisper = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setVoiceError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        setValue(data.transcript);
        transcriptRef.current = data.transcript;
        onVoiceEndRef.current?.(data.transcript);
        // Reset input after sending - Bug #4 fix
        setValue('');
        transcriptRef.current = '';
      } else {
        setVoiceError(data.error || 'Error al transcribir');
      }
    } catch (error) {
      console.error('Whisper transcription error:', error);
      setVoiceError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Start recording with MediaRecorder (for Whisper fallback)
  const startWhisperRecording = async () => {
    setVoiceError(null);
    setValue('');
    transcriptRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Clear the transcription interval
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        if (audioBlob.size > 0) {
          await transcribeWithWhisper(audioBlob);
        }
      };

      mediaRecorder.onerror = () => {
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }
        setVoiceError('Error durante la grabación');
        setIsListening(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);
      onVoiceStart?.();

      // Start periodic transcription (every 2.5 seconds)
      transcriptionIntervalRef.current = setInterval(() => {
        transcribePartial();
      }, 2500);

    } catch (error) {
      console.error('Error accessing microphone:', error);

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            setVoiceError('Permisos de micrófono denegados.');
            break;
          case 'NotFoundError':
            setVoiceError('No se encontró ningún micrófono.');
            break;
          default:
            setVoiceError('No se pudo acceder al micrófono.');
        }
      } else {
        setVoiceError('Error al iniciar la grabación.');
      }
    }
  };

  // Stop Whisper recording
  const stopWhisperRecording = () => {
    // Clear the transcription interval
    if (transcriptionIntervalRef.current) {
      clearInterval(transcriptionIntervalRef.current);
      transcriptionIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  // Start Web Speech API recognition
  const startSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    setValue('');
    transcriptRef.current = '';
    setVoiceError(null);

    try {
      recognitionRef.current.start();
      setIsListening(true);
      onVoiceStart?.();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      // Try Whisper fallback
      setUseWhisperFallback(true);
      startWhisperRecording();
    }
  };

  // Stop Web Speech API recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Toggle voice - decides which method to use
  const toggleVoice = () => {
    setVoiceError(null);

    if (isListening) {
      // Stop listening
      if (useWhisperFallback) {
        stopWhisperRecording();
      } else {
        stopSpeechRecognition();
      }
    } else {
      // Start listening
      if (useWhisperFallback) {
        startWhisperRecording();
      } else {
        startSpeechRecognition();
      }
    }
  };

  const displayPlaceholder = placeholder || placeholders[currentPlaceholder];
  const isVoiceActive = isListening || isTranscribing;

  // Computed status for single AnimatePresence - mutually exclusive states
  type StatusType = 'listening-native' | 'listening-whisper' | 'transcribing' | 'processing' | 'error' | null;

  const currentStatus: StatusType = useMemo(() => {
    if (isListening && !useWhisperFallback) return 'listening-native';
    if (isListening && useWhisperFallback) return 'listening-whisper';
    if (isTranscribing) return 'transcribing';
    if (isProcessing && !isTranscribing) return 'processing';
    if (voiceError && !isListening && !isTranscribing) return 'error';
    return null;
  }, [isListening, useWhisperFallback, isTranscribing, isProcessing, voiceError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "relative w-full mx-auto",
        className
      )}
    >

      {/* Main container con glassmorphism */}
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300",
          // Glassmorphism base
          "bg-white/[0.05] backdrop-blur-xl",
          "border border-white/[0.12]",
          // Focus state con glow de marca
          isFocused && cn(
            "border-[#2563EB]/40",
            "shadow-[0_0_40px_rgba(37,99,235,0.15),0_8px_32px_rgba(0,0,0,0.3)]"
          ),
          // Voice states
          isListening && !useWhisperFallback && "border-[#2563EB]/40 shadow-lg shadow-[#2563EB]/20",
          isListening && useWhisperFallback && "border-red-500/30 shadow-lg shadow-red-500/20"
        )}
      >
        {/* Input area */}
        <div className="relative flex-1 flex items-center h-[24px]">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => { setIsFocused(true); onFocus?.(); }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isProcessing || isTranscribing}
            className={cn(
              "w-full bg-transparent text-white placeholder-transparent outline-none border-0 ring-0 focus:ring-0 focus:border-0 focus:outline-none text-base leading-6 p-0",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />

          {/* Animated placeholder - hidden when processing or has value */}
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

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            disabled={disabled || isTranscribing}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              isListening && !useWhisperFallback
                ? "text-[#2563EB] bg-[#2563EB]/20 border border-[#2563EB]/30"
                : isListening && useWhisperFallback
                ? "text-red-400 bg-red-500/20 border border-red-500/30 animate-pulse"
                : "text-white/40 hover:text-white hover:bg-white/[0.06]"
            )}
            aria-label={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
          >
            <Mic className={cn("w-5 h-5", isListening && "animate-pulse")} />
          </button>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled || isProcessing || isTranscribing}
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              value.trim() && !disabled && !isProcessing && !isTranscribing
                ? "bg-[#2563EB] text-white hover:bg-[#3B82F6] shadow-lg shadow-[#2563EB]/25"
                : "bg-white/[0.08] text-white/30 cursor-not-allowed"
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

      {/* Status indicator - Positioned in document flow to avoid overlap */}
      <AnimatePresence mode="wait">
        {currentStatus && (
          <motion.div
            key={currentStatus}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "flex items-center justify-center gap-2 text-sm mt-3",
                currentStatus === 'listening-native' && "text-[#2563EB]",
                currentStatus === 'listening-whisper' && "text-red-400",
                currentStatus === 'transcribing' && "text-[#3B82F6]",
                currentStatus === 'processing' && "text-[#2563EB]",
                currentStatus === 'error' && "text-red-400"
              )}
            >
              {currentStatus === 'listening-native' && (
                <>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  Escuchando...
                </>
              )}
              {currentStatus === 'listening-whisper' && (
                <>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  Grabando... (toca para detener)
                </>
              )}
              {currentStatus === 'transcribing' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transcribiendo...
                </>
              )}
              {currentStatus === 'processing' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Procesando...
                </>
              )}
              {currentStatus === 'error' && voiceError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
