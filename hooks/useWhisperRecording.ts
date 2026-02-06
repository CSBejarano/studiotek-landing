'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UseWhisperRecordingOptions {
  /** Called with interim transcript text during periodic transcription */
  onTranscript?: (text: string) => void;
  /** Called with the final transcript when recording stops */
  onFinalTranscript?: (text: string) => void;
  /** Called when a transcription or recording error occurs */
  onError?: (error: string) => void;
  /** Called when recording starts successfully */
  onStart?: () => void;
  /** Interval in ms between periodic transcription requests (default: 2500) */
  transcriptionIntervalMs?: number;
}

interface UseWhisperRecordingReturn {
  /** Whether the MediaRecorder is currently recording */
  isRecording: boolean;
  /** Whether a final transcription request is in flight */
  isTranscribing: boolean;
  /** Start recording from the microphone */
  startRecording: () => Promise<void>;
  /** Stop recording and trigger final transcription */
  stopRecording: () => void;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useWhisperRecording
 *
 * Records audio via MediaRecorder and sends it to /api/voice/stt (Whisper)
 * for transcription. Supports periodic partial transcription every N seconds
 * so the user sees interim results while still speaking.
 */
export function useWhisperRecording(
  options: UseWhisperRecordingOptions = {}
): UseWhisperRecordingReturn {
  const {
    onTranscript,
    onFinalTranscript,
    onError,
    onStart,
    transcriptionIntervalMs = 2500,
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Refs for MediaRecorder resources
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTranscribingRef = useRef(false);
  const mimeTypeRef = useRef<string>('audio/webm');

  // Callback refs to avoid re-creating closures
  const onTranscriptRef = useRef(onTranscript);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);

  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
  useEffect(() => { onFinalTranscriptRef.current = onFinalTranscript; }, [onFinalTranscript]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);

  // ------------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ------------------------------------------------------------------
  // Periodic (partial) transcription
  // ------------------------------------------------------------------
  const transcribePartial = useCallback(async () => {
    if (isTranscribingRef.current || audioChunksRef.current.length === 0) return;

    isTranscribingRef.current = true;

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeTypeRef.current,
      });

      // Skip blobs too small to contain meaningful audio
      if (audioBlob.size < 1000) {
        isTranscribingRef.current = false;
        return;
      }

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        onTranscriptRef.current?.(data.transcript);
      }
    } catch (error) {
      console.error('Partial transcription error:', error);
    } finally {
      isTranscribingRef.current = false;
    }
  }, []);

  // ------------------------------------------------------------------
  // Final transcription (after recording stops)
  // ------------------------------------------------------------------
  const transcribeFinal = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        onFinalTranscriptRef.current?.(data.transcript);
      } else {
        onErrorRef.current?.(data.error || 'Error al transcribir');
      }
    } catch (error) {
      console.error('Whisper transcription error:', error);
      onErrorRef.current?.('Error de conexion. Intenta de nuevo.');
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Start recording
  // ------------------------------------------------------------------
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      mimeTypeRef.current = mimeType;

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Clear periodic transcription
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (audioBlob.size > 0) {
          await transcribeFinal(audioBlob);
        }
      };

      mediaRecorder.onerror = () => {
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }
        onErrorRef.current?.('Error durante la grabacion');
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      onStartRef.current?.();

      // Start periodic transcription
      transcriptionIntervalRef.current = setInterval(() => {
        transcribePartial();
      }, transcriptionIntervalMs);
    } catch (error) {
      console.error('Error accessing microphone:', error);

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            onErrorRef.current?.('Permisos de microfono denegados.');
            break;
          case 'NotFoundError':
            onErrorRef.current?.('No se encontro ningun microfono.');
            break;
          default:
            onErrorRef.current?.('No se pudo acceder al microfono.');
        }
      } else {
        onErrorRef.current?.('Error al iniciar la grabacion.');
      }
    }
  }, [transcribePartial, transcribeFinal, transcriptionIntervalMs]);

  // ------------------------------------------------------------------
  // Stop recording
  // ------------------------------------------------------------------
  const stopRecording = useCallback(() => {
    if (transcriptionIntervalRef.current) {
      clearInterval(transcriptionIntervalRef.current);
      transcriptionIntervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
}
