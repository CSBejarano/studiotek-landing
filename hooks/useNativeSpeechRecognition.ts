'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

/** Minimal Web Speech API interface for internal use */
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((event: any) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface UseNativeSpeechRecognitionOptions {
  /** Called on each result (interim or final) with the current full transcript */
  onTranscript?: (text: string) => void;
  /** Called when recognition ends naturally, with the accumulated transcript */
  onEnd?: (transcript: string) => void;
  /** Called when an error occurs, with a user-facing message */
  onError?: (error: string) => void;
  /** Called when a network error triggers Whisper fallback */
  onNetworkError?: () => void;
  /** Called when recognition starts */
  onStart?: () => void;
  /** Language for recognition (default: 'es-ES') */
  lang?: string;
}

interface UseNativeSpeechRecognitionReturn {
  /** Whether the Web Speech API is available in this browser */
  isSupported: boolean;
  /** Whether currently listening */
  isListening: boolean;
  /** Start listening */
  startListening: () => void;
  /** Stop listening */
  stopListening: () => void;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Lightweight hook wrapping the browser Web Speech API for real-time
 * speech-to-text. Designed for the AIChatInput component.
 *
 * Unlike the full `useSpeechRecognition` hook this does NOT include:
 * - MediaRecorder / Whisper fallback (use `useWhisperRecording` instead)
 * - iOS Safari device detection
 * - Auto-restart logic
 */
export function useNativeSpeechRecognition(
  options: UseNativeSpeechRecognitionOptions = {}
): UseNativeSpeechRecognitionReturn {
  const { lang = 'es-ES' } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const transcriptRef = useRef('');

  // Callback refs so the recognition instance doesn't need to be recreated
  const onTranscriptRef = useRef(options.onTranscript);
  const onEndRef = useRef(options.onEnd);
  const onErrorRef = useRef(options.onError);
  const onNetworkErrorRef = useRef(options.onNetworkError);
  const onStartRef = useRef(options.onStart);

  useEffect(() => { onTranscriptRef.current = options.onTranscript; }, [options.onTranscript]);
  useEffect(() => { onEndRef.current = options.onEnd; }, [options.onEnd]);
  useEffect(() => { onErrorRef.current = options.onError; }, [options.onError]);
  useEffect(() => { onNetworkErrorRef.current = options.onNetworkError; }, [options.onNetworkError]);
  useEffect(() => { onStartRef.current = options.onStart; }, [options.onStart]);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!API) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new API() as ISpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: { results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } } }) => {
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
      onTranscriptRef.current?.(fullTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = transcriptRef.current;
      if (transcript) {
        onEndRef.current?.(transcript);
        transcriptRef.current = '';
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'network') {
        onNetworkErrorRef.current?.();
        return;
      }

      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          onErrorRef.current?.('Permisos de microfono denegados.');
          break;
        case 'no-speech':
          onErrorRef.current?.('No se detecto voz. Intenta de nuevo.');
          break;
        case 'audio-capture':
          onErrorRef.current?.('No se pudo acceder al microfono.');
          break;
        case 'aborted':
          break;
        default:
          onErrorRef.current?.('Error de reconocimiento. Intenta de nuevo.');
      }
    };

    recognitionRef.current = recognition;
    return () => { recognition.abort(); };
  }, [lang]);

  const startListening = useCallback(() => {
    transcriptRef.current = '';
    try {
      recognitionRef.current?.start();
      setIsListening(true);
      onStartRef.current?.();
    } catch {
      // If start fails, fire error so caller can fall back
      onErrorRef.current?.('Error al iniciar reconocimiento de voz.');
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, startListening, stopListening };
}
