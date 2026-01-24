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
// Device Detection Utilities
// ============================================================================

/**
 * Detects if the current device is a mobile device
 * Includes detection for iPadOS (which reports as Macintosh but has touch)
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
         (navigator.maxTouchPoints > 0 && /Macintosh/.test(ua)); // iPad iPadOS
};

/**
 * Detects if the current browser is Safari on iOS
 * iOS Safari has unreliable Web Speech API support, especially for continuous mode
 */
const isIOSSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isChrome = /CriOS/.test(ua);
  return isIOS && isWebkit && !isChrome;
};

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
  /** Whether currently using Whisper mode (server-side transcription) */
  isWhisperMode: boolean;
  /** Start Whisper-based listening (mobile fallback) */
  startWhisperListening: () => Promise<void>;
  /** Stop Whisper-based listening */
  stopWhisperListening: () => void;
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

  // Whisper mode state and refs (for mobile fallback via server-side transcription)
  const [isWhisperMode, setIsWhisperMode] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');

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

  // Force Whisper mode on iOS Safari where Web Speech API is unreliable
  useEffect(() => {
    if (isMobileDevice() && isIOSSafari()) {
      console.log('[SpeechRecognition] iOS Safari detected, using Whisper fallback');
      setIsWhisperMode(true);
      setIsSupported(true); // Whisper is always supported
    }
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
    // iOS Safari has unreliable continuous mode - it often stops after a few seconds
    // or fails silently. Disable continuous mode on iOS Safari to prevent issues.
    recognition.continuous = continuous && !isIOSSafari();
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

      // Cleanup MediaStream and MediaRecorder (Whisper mode)
      if (streamRef.current) {
        console.log('[SpeechRecognition] Cleanup - stopping media stream tracks');
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log('[SpeechRecognition] Cleanup - stopping media recorder');
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore cleanup errors
        }
        mediaRecorderRef.current = null;
      }
    };
  }, [isSupported, lang, continuous, interimResults]); // Removed callbacks from deps - using refs instead

  // ============================================================================
  // Whisper Mode Functions (Mobile Fallback)
  // These must be declared BEFORE startListening/stopListening because they
  // are used as dependencies in those functions.
  // ============================================================================

  /**
   * Gets the best supported MIME type for MediaRecorder
   * Falls back through a chain of formats for maximum compatibility
   */
  const getSupportedMimeType = useCallback((): string => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('[Whisper] Using MIME type:', type);
        return type;
      }
    }
    console.log('[Whisper] No preferred MIME type supported, defaulting to audio/webm');
    return 'audio/webm';
  }, []);

  /**
   * Transcribes audio blob using Whisper API via server endpoint
   */
  const transcribeWithWhisper = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    try {
      console.log('[Whisper] Transcribing audio, size:', audioBlob.size, 'type:', mimeTypeRef.current);

      const formData = new FormData();
      const ext = mimeTypeRef.current.includes('mp4') ? 'mp4' : 'webm';
      formData.append('audio', audioBlob, `recording.${ext}`);

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('[Whisper] API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      if (data.success && data.transcript) {
        console.log('[Whisper] Transcription successful:', data.transcript);
        return data.transcript;
      }

      console.warn('[Whisper] Transcription returned no result');
      return null;
    } catch (error) {
      console.error('[Whisper] Transcription error:', error);
      return null;
    }
  }, []);

  /**
   * Starts Whisper-based listening using MediaRecorder
   * Used as fallback on mobile devices where Web Speech API is unreliable
   */
  const startWhisperListening = useCallback(async () => {
    console.log('[Whisper] Starting Whisper listening mode');

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    audioChunksRef.current = [];

    try {
      // Request microphone with mobile-friendly constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1,
        }
      });

      streamRef.current = stream;

      // Detect best MIME type for this device
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('[Whisper] MediaRecorder stopped, processing audio...');

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        if (audioBlob.size > 0) {
          setInterimTranscript('Procesando audio...');

          const result = await transcribeWithWhisper(audioBlob);

          setInterimTranscript('');

          if (result) {
            setTranscript(result);
            onResultRef.current?.(result);
          } else {
            setError('No se pudo transcribir el audio. Intenta de nuevo.');
            onErrorRef.current?.('No se pudo transcribir el audio.');
          }
        }

        setIsListening(false);
        onEndRef.current?.();
      };

      mediaRecorder.onerror = () => {
        console.error('[Whisper] MediaRecorder error');
        setError('Error durante la grabacion');
        setIsListening(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        onErrorRef.current?.('Error durante la grabacion');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms

      setIsListening(true);
      setIsWhisperMode(true);
      onStartRef.current?.();

      console.log('[Whisper] MediaRecorder started successfully');

    } catch (error) {
      console.error('[Whisper] Error accessing microphone:', error);

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            setError('Permisos de microfono denegados. Por favor, permite el acceso al microfono.');
            break;
          case 'NotFoundError':
            setError('No se encontro ningun microfono.');
            break;
          default:
            setError('No se pudo acceder al microfono.');
        }
      } else {
        setError('Error al iniciar la grabacion.');
      }

      onErrorRef.current?.(error instanceof Error ? error.message : 'Error al iniciar la grabacion');
    }
  }, [getSupportedMimeType, transcribeWithWhisper]);

  /**
   * Stops Whisper-based listening
   * The actual transcription is handled in the onstop handler
   */
  const stopWhisperListening = useCallback(() => {
    console.log('[Whisper] Stopping Whisper listening');

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Note: isListening will be set to false in onstop handler after transcription
    } else {
      // Clean up if recorder wasn't active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsListening(false);
    }

    setIsWhisperMode(false);
  }, []);

  // ============================================================================
  // Main Listening Functions
  // These depend on the Whisper functions declared above.
  // ============================================================================

  // Start listening (handles both Web Speech API and Whisper mode)
  const startListening = useCallback(() => {
    console.log('[SpeechRecognition] startListening called, isSupported:', isSupported, 'isListening:', isListening, 'isWhisperMode:', isWhisperMode);

    // If in Whisper mode, delegate to Whisper listening
    if (isWhisperMode) {
      console.log('[SpeechRecognition] Using Whisper mode for listening');
      startWhisperListening();
      return;
    }

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
  }, [isSupported, isListening, isWhisperMode, startWhisperListening]);

  // Stop listening (handles both Web Speech API and Whisper mode)
  const stopListening = useCallback(() => {
    console.log('[SpeechRecognition] stopListening called, isWhisperMode:', isWhisperMode);

    // If in Whisper mode, delegate to Whisper stop
    if (isWhisperMode) {
      console.log('[SpeechRecognition] Using Whisper mode for stopping');
      stopWhisperListening();
      return;
    }

    if (!recognitionRef.current) return;

    isStoppingRef.current = true;

    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore - may not be started
    }

    setIsListening(false);
    setInterimTranscript('');
  }, [isWhisperMode, stopWhisperListening]);

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
    // Whisper mode exports (for mobile fallback)
    isWhisperMode,
    startWhisperListening,
    stopWhisperListening,
  };
}

export type { SpeechRecognitionEvent, SpeechRecognitionErrorEvent };
