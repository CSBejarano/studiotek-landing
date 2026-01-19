'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Web Speech API Type Declarations
// ============================================================================

/**
 * SpeechRecognition event with results
 */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

/**
 * SpeechRecognition error event
 */
interface SpeechRecognitionErrorEvent extends Event {
  readonly error:
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-allowed'
    | 'bad-grammar'
    | 'language-not-supported';
  readonly message: string;
}

/**
 * SpeechRecognition result list
 */
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

/**
 * SpeechRecognition result
 */
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

/**
 * SpeechRecognition alternative
 */
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

/**
 * SpeechRecognition interface
 */
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  grammars: SpeechGrammarList;

  start(): void;
  stop(): void;
  abort(): void;

  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
}

/**
 * SpeechGrammarList interface
 */
interface SpeechGrammarList {
  readonly length: number;
}

/**
 * SpeechRecognition constructor type
 */
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Configuration options for the speech recognition hook
 */
export interface UseSpeechRecognitionOptions {
  /** Language for recognition (default: 'es-ES') */
  lang?: string;
  /** Enable continuous listening (default: true) */
  continuous?: boolean;
  /** Enable interim results (default: true) */
  interimResults?: boolean;
  /** Callback when final transcript is received */
  onResult?: (transcript: string) => void;
  /** Callback when interim transcript updates */
  onInterimResult?: (transcript: string) => void;
  /** Callback when an error occurs */
  onError?: (error: string) => void;
  /** Callback when listening starts */
  onStart?: () => void;
  /** Callback when listening ends */
  onEnd?: () => void;
}

/**
 * Return type for the useSpeechRecognition hook
 */
export interface UseSpeechRecognitionReturn {
  /** Whether Web Speech API is supported in this browser */
  isSupported: boolean;
  /** Whether currently listening to speech */
  isListening: boolean;
  /** Final transcript (accumulated from all final results) */
  transcript: string;
  /** Interim transcript (current partial result) */
  interimTranscript: string;
  /** Current error message (null if no error) */
  error: string | null;
  /** Start listening for speech */
  startListening: () => void;
  /** Stop listening for speech */
  stopListening: () => void;
  /** Reset the transcript to empty */
  resetTranscript: () => void;
}

// ============================================================================
// Error Messages
// ============================================================================

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Permiso de micrófono denegado. Por favor, permite el acceso al micrófono en la configuración del navegador.',
  'no-speech': 'No se detectó voz. Por favor, intenta hablar de nuevo.',
  'network': 'Error de red. Verifica tu conexión a internet.',
  'audio-capture': 'No se pudo capturar audio. Verifica que el micrófono esté conectado.',
  'aborted': 'El reconocimiento de voz fue cancelado.',
  'service-not-allowed': 'El servicio de reconocimiento de voz no está permitido.',
  'bad-grammar': 'Error en la gramática del reconocimiento.',
  'language-not-supported': 'El idioma seleccionado no está soportado.',
  'not-supported': 'Tu navegador no soporta reconocimiento de voz. Prueba con Chrome, Edge o Safari.',
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useSpeechRecognition
 *
 * Custom hook for Web Speech API (speech-to-text).
 * Provides browser support detection, permission handling, and real-time transcription.
 *
 * @example
 * ```tsx
 * function VoiceInput() {
 *   const {
 *     isSupported,
 *     isListening,
 *     transcript,
 *     interimTranscript,
 *     error,
 *     startListening,
 *     stopListening,
 *     resetTranscript,
 *   } = useSpeechRecognition({
 *     lang: 'es-ES',
 *     onResult: (text) => console.log('Final:', text),
 *   });
 *
 *   if (!isSupported) {
 *     return <p>Speech recognition not supported</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={isListening ? stopListening : startListening}>
 *         {isListening ? 'Stop' : 'Start'}
 *       </button>
 *       <p>Transcript: {transcript}</p>
 *       <p>Interim: {interimTranscript}</p>
 *       {error && <p className="text-red-500">{error}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const {
    lang = 'es-ES',
    continuous = true,
    interimResults = true,
    onResult,
    onInterimResult,
    onError,
    onStart,
    onEnd,
  } = options;

  // State
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  // Refs for callbacks (to avoid recreating recognition on callback changes)
  const onResultRef = useRef(onResult);
  const onInterimResultRef = useRef(onInterimResult);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);

  // Keep refs updated
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onInterimResultRef.current = onInterimResult; }, [onInterimResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  // Initialize recognition instance
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();

    // Configure
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interimText += text;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => {
          const newTranscript = prev ? `${prev} ${finalTranscript}` : finalTranscript;
          onResultRef.current?.(finalTranscript.trim());
          return newTranscript.trim();
        });
        setInterimTranscript('');
      }

      if (interimText) {
        setInterimTranscript(interimText);
        onInterimResultRef.current?.(interimText);
      }
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Don't treat no-speech as a fatal error - just log it
      if (event.error === 'no-speech') {
        console.log('[SpeechRecognition] No speech detected, continuing to listen...');
        return;
      }

      const errorMessage = ERROR_MESSAGES[event.error] || `Error desconocido: ${event.error}`;
      console.error('[SpeechRecognition] Error:', event.error, errorMessage);
      setError(errorMessage);
      setIsListening(false);
      onErrorRef.current?.(errorMessage);
    };

    // Handle start
    recognition.onstart = () => {
      console.log('[SpeechRecognition] Started listening');
      setIsListening(true);
      setError(null);
      onStartRef.current?.();
    };

    // Handle audio events for debugging
    recognition.onaudiostart = () => {
      console.log('[SpeechRecognition] Audio capture started');
    };

    recognition.onspeechstart = () => {
      console.log('[SpeechRecognition] Speech detected');
    };

    recognition.onspeechend = () => {
      console.log('[SpeechRecognition] Speech ended');
    };

    // Handle end
    recognition.onend = () => {
      console.log('[SpeechRecognition] Recognition ended, isStoppingRef:', isStoppingRef.current);
      setIsListening(false);
      setInterimTranscript('');
      onEndRef.current?.();

      // Auto-restart if continuous mode and not intentionally stopped
      if (continuous && !isStoppingRef.current && recognitionRef.current) {
        console.log('[SpeechRecognition] Auto-restarting...');
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('[SpeechRecognition] Auto-restart failed:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      console.log('[SpeechRecognition] Cleanup - aborting recognition');
      isStoppingRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, [isSupported, lang, continuous, interimResults]); // Removed callbacks from deps - using refs instead

  // Start listening
  const startListening = useCallback(() => {
    console.log('[SpeechRecognition] startListening called, isSupported:', isSupported, 'isListening:', isListening);

    if (!isSupported) {
      setError(ERROR_MESSAGES['not-supported']);
      return;
    }

    if (!recognitionRef.current) {
      console.error('[SpeechRecognition] Recognition not initialized');
      setError('El reconocimiento de voz no está inicializado.');
      return;
    }

    if (isListening) {
      console.log('[SpeechRecognition] Already listening, skipping');
      return; // Already listening
    }

    setError(null);
    isStoppingRef.current = false;

    try {
      console.log('[SpeechRecognition] Calling recognition.start()');
      recognitionRef.current.start();
    } catch (err) {
      // Handle case where recognition is already started
      if (err instanceof Error && err.message.includes('already started')) {
        console.log('[SpeechRecognition] Recognition already started');
      } else {
        console.error('[SpeechRecognition] Start error:', err);
        setError('Error al iniciar el reconocimiento de voz.');
        onErrorRef.current?.('Error al iniciar el reconocimiento de voz.');
      }
    }
  }, [isSupported, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    isStoppingRef.current = true;

    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore - may not be started
    }

    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export type { SpeechRecognitionEvent, SpeechRecognitionErrorEvent };
