'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Loader2, MicOff } from 'lucide-react';
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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [useWhisperFallback, setUseWhisperFallback] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

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

      {/* Main container */}
      <div
        className={cn(
          "relative flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl rounded-3xl px-6 py-3 transition-all duration-300",
          isFocused && "shadow-lg shadow-blue-500/10",
          isListening && !useWhisperFallback && "shadow-lg shadow-green-500/20",
          isListening && useWhisperFallback && "shadow-lg shadow-red-500/20"
        )}
      >
        {/* Input area */}
        <div className="relative flex-1 flex items-center min-h-[24px] pl-4 py-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isProcessing || isTranscribing}
            rows={1}
            className={cn(
              "w-full bg-transparent text-white placeholder-transparent outline-none border-0 ring-0 focus:ring-0 focus:border-0 focus:outline-none text-base leading-6 p-0 resize-none overflow-hidden my-auto",
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
                className="absolute left-4 right-0 top-1/2 -translate-y-1/2 text-base leading-6 text-slate-400 pointer-events-none truncate"
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
                ? "text-green-400 bg-green-500/20"
                : isListening && useWhisperFallback
                ? "text-red-400 bg-red-500/20 animate-pulse"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            )}
            aria-label={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className={cn("w-5 h-5", isListening && !useWhisperFallback && "animate-pulse")} />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || disabled || isProcessing || isTranscribing}
            className={cn(
              "p-3 rounded-full transition-all duration-200",
              value.trim() && !disabled && !isProcessing && !isTranscribing
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
        {isListening && !useWhisperFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-green-400"
          >
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            Escuchando...
          </motion.div>
        )}
        {isListening && useWhisperFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-red-400"
          >
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            Grabando... (toca para detener)
          </motion.div>
        )}
        {isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-blue-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Transcribiendo...
          </motion.div>
        )}
        {isProcessing && !isTranscribing && (
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
        {voiceError && !isListening && !isTranscribing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-red-400"
          >
            {voiceError}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
