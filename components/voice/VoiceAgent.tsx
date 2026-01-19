'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useVoiceAgentContextSafe } from './VoiceAgentProvider';
import { VoiceButton } from './VoiceButton';
import { TranscriptWindow } from './TranscriptWindow';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { handleFunctionCall, type FunctionCall } from '@/lib/voice/functionHandlers';
import type { Message, VoiceError } from '@/lib/voice/types';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Configuration for the voice agent orchestrator
 */
interface VoiceAgentConfig {
  /** Silence timeout in ms before sending to API (default: 2500) */
  silenceTimeout?: number;
  /** Language for speech recognition (default: 'es-ES') */
  language?: string;
  /** Maximum messages to keep in history (default: 10) */
  maxHistoryMessages?: number;
  /** Error recovery timeout in ms (default: 3000) */
  errorRecoveryTimeout?: number;
}

const DEFAULT_CONFIG: Required<VoiceAgentConfig> = {
  silenceTimeout: 2500,
  language: 'es-ES',
  maxHistoryMessages: 10,
  errorRecoveryTimeout: 3000,
};

// ============================================================================
// Types
// ============================================================================

interface VoiceAgentProps {
  config?: VoiceAgentConfig;
  className?: string;
}

interface ChatApiResponse {
  message: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

// ============================================================================
// State Machine
// ============================================================================

/**
 * Voice Agent State Machine:
 *
 * idle -> listening (on activate)
 * listening -> processing (on speech end / silence timeout)
 * processing -> speaking (on response received)
 * speaking -> listening (on audio end)
 * * -> idle (on deactivate)
 * * -> error (on any error)
 * error -> idle (after timeout)
 */

// ============================================================================
// Component
// ============================================================================

/**
 * VoiceAgent
 *
 * Main orchestrator component that coordinates the entire voice agent system.
 * Manages the flow: listen -> process -> speak -> execute -> listen
 *
 * Features:
 * - Silence detection with configurable timeout
 * - Automatic speech-to-text via Web Speech API
 * - API integration for chat responses
 * - Text-to-speech via OpenAI TTS
 * - Function call execution
 * - Request cancellation on deactivate
 * - Conversation history management
 *
 * @example
 * ```tsx
 * <VoiceAgentProvider>
 *   <VoiceAgent config={{ silenceTimeout: 3000 }} />
 * </VoiceAgentProvider>
 * ```
 */
export function VoiceAgent({ config: userConfig, className }: VoiceAgentProps) {
  // Merge config with defaults
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  // Context (safe version that returns null during SSR/SSG)
  const context = useVoiceAgentContextSafe();

  // Extract values with defaults for when context is not available
  const isActive = context?.isActive ?? false;
  const voiceState = context?.voiceState ?? 'idle';
  const messages = context?.messages ?? [];
  const actions = context?.actions;

  // Refs for lifecycle management
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const pendingTranscriptRef = useRef<string>('');

  // ========== Speech Recognition ==========
  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: config.language,
    continuous: true,
    interimResults: true,
    onResult: handleSpeechResult,
    onInterimResult: handleInterimResult,
    onError: handleSpeechError,
    onStart: handleSpeechStart,
    onEnd: handleSpeechEnd,
  });

  // ========== Handlers ==========

  /**
   * Handle final speech result
   */
  function handleSpeechResult(text: string) {
    lastSpeechTimeRef.current = Date.now();
    pendingTranscriptRef.current = text.trim();

    // Clear existing silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    // Start new silence timeout
    silenceTimeoutRef.current = setTimeout(() => {
      if (pendingTranscriptRef.current && !isProcessingRef.current) {
        processUserMessage(pendingTranscriptRef.current);
      }
    }, config.silenceTimeout);
  }

  /**
   * Handle interim speech result (real-time transcript update)
   */
  function handleInterimResult(text: string) {
    actions?.setTranscript(text);
    lastSpeechTimeRef.current = Date.now();
  }

  /**
   * Handle speech recognition error
   */
  function handleSpeechError(errorMessage: string) {
    const voiceError: VoiceError = {
      type: 'speech_recognition',
      message: errorMessage,
      timestamp: new Date().toISOString(),
      recoverable: true,
    };
    actions?.setError(voiceError);

    // Auto-recover after timeout
    setTimeout(() => {
      if (isActive) {
        actions?.setVoiceState('idle');
        actions?.setError(null);
      }
    }, config.errorRecoveryTimeout);
  }

  /**
   * Handle speech recognition start
   */
  function handleSpeechStart() {
    if (voiceState !== 'processing' && voiceState !== 'speaking') {
      actions?.setVoiceState('listening');
    }
  }

  /**
   * Handle speech recognition end
   */
  function handleSpeechEnd() {
    // Process any pending transcript after speech ends
    if (pendingTranscriptRef.current && !isProcessingRef.current && isActive) {
      // Small delay to catch any final results
      setTimeout(() => {
        if (pendingTranscriptRef.current && !isProcessingRef.current) {
          processUserMessage(pendingTranscriptRef.current);
        }
      }, 300);
    }
  }

  // ========== Core Processing Flow ==========

  /**
   * Process user message: send to API, handle response, execute functions, speak
   */
  const processUserMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isProcessingRef.current) return;

    isProcessingRef.current = true;
    pendingTranscriptRef.current = '';

    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // Stop listening during processing
    stopListening();
    actions?.setVoiceState('processing');
    actions?.setTranscript('');
    resetTranscript();

    // Add user message to history
    actions?.addMessage({
      role: 'user',
      content: userText.trim(),
    });

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Prepare message history (limited to maxHistoryMessages)
      const historyMessages = messages.slice(-config.maxHistoryMessages);

      // Call chat API
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyMessages,
          userMessage: userText.trim(),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        isProcessingRef.current = false;
        return;
      }

      // Add assistant message to history
      actions?.addMessage({
        role: 'assistant',
        content: data.message,
      });

      // Execute function call if present
      if (data.functionCall) {
        await executeFunctionCall(data.functionCall);
      }

      // Speak the response
      await speakResponse(data.message);

    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        isProcessingRef.current = false;
        return;
      }

      console.error('Error processing message:', error);

      const voiceError: VoiceError = {
        type: 'api_error',
        message: error instanceof Error ? error.message : 'Error al procesar el mensaje',
        timestamp: new Date().toISOString(),
        recoverable: true,
      };
      actions?.setError(voiceError);

      // Auto-recover after timeout
      setTimeout(() => {
        if (isActive) {
          actions?.setVoiceState('idle');
          actions?.setError(null);
          isProcessingRef.current = false;
          // Resume listening
          startListening();
        }
      }, config.errorRecoveryTimeout);

      return;
    }

    isProcessingRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messages,
    config.maxHistoryMessages,
    config.errorRecoveryTimeout,
    stopListening,
    resetTranscript,
    startListening,
    isActive,
  ]);

  /**
   * Execute a function call from the assistant
   */
  const executeFunctionCall = useCallback(async (
    functionCallData: { name: string; arguments: string }
  ) => {
    try {
      const parsedArgs = JSON.parse(functionCallData.arguments);
      const functionCall: FunctionCall = {
        name: functionCallData.name,
        arguments: parsedArgs,
      };

      const result = await handleFunctionCall(functionCall);

      if (!result.success) {
        console.warn('Function call failed:', result.error);
      }
    } catch (error) {
      console.error('Error executing function call:', error);
    }
  }, []);

  /**
   * Speak response using TTS API
   */
  const speakResponse = useCallback(async (text: string) => {
    if (!text.trim()) {
      // No text to speak, resume listening
      if (isActive) {
        actions?.setVoiceState('listening');
        startListening();
      }
      return;
    }

    actions?.setVoiceState('speaking');

    // Create abort controller for TTS request
    const ttsAbortController = new AbortController();
    abortControllerRef.current = ttsAbortController;

    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: ttsAbortController.signal,
      });

      if (!response.ok) {
        // TTS failed - fallback to just resuming listening
        console.warn('TTS unavailable, skipping speech');
        if (isActive) {
          actions?.setVoiceState('listening');
          startListening();
        }
        return;
      }

      // Check if aborted
      if (ttsAbortController.signal.aborted) {
        return;
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Handle audio end - resume listening
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;

        if (isActive) {
          actions?.setVoiceState('listening');
          startListening();
        }
      };

      // Handle audio error
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        console.warn('Audio playback error');

        if (isActive) {
          actions?.setVoiceState('listening');
          startListening();
        }
      };

      await audio.play();

    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.warn('TTS error:', error);

      // Resume listening on error
      if (isActive) {
        actions?.setVoiceState('listening');
        startListening();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, startListening]);

  // ========== Register handlers ==========

  /**
   * Register processUserMessage with the context so text input can use it
   */
  useEffect(() => {
    if (actions?.registerMessageHandler) {
      actions.registerMessageHandler(processUserMessage);
    }
  }, [actions, processUserMessage]);

  /**
   * Register pause/resume handlers with the context
   */
  useEffect(() => {
    if (actions?.registerListeningHandlers) {
      actions.registerListeningHandlers(stopListening, startListening);
    }
  }, [actions, stopListening, startListening]);

  // ========== Activation / Deactivation ==========

  /**
   * Handle activation - start listening
   */
  useEffect(() => {
    if (isActive && voiceState === 'idle' && speechSupported) {
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        actions?.setVoiceState('listening');
        startListening();
      }, 100);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, voiceState, speechSupported, startListening]);

  /**
   * Handle deactivation - cleanup
   */
  useEffect(() => {
    if (!isActive) {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Stop audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Clear silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      // Stop speech recognition
      stopListening();
      resetTranscript();

      // Reset processing state
      isProcessingRef.current = false;
      pendingTranscriptRef.current = '';
    }
  }, [isActive, stopListening, resetTranscript]);

  // ========== Cleanup on Unmount ==========

  useEffect(() => {
    return () => {
      // Cancel requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Clear timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // ========== Update transcript in context ==========

  useEffect(() => {
    if (isListening && interimTranscript) {
      actions?.setTranscript(transcript + ' ' + interimTranscript);
    } else if (transcript) {
      actions?.setTranscript(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, interimTranscript, isListening]);

  // ========== Render ==========

  // Don't render if context is not available (SSR/SSG)
  if (!context) {
    return null;
  }

  return (
    <div className={className}>
      <VoiceButton />
      <TranscriptWindow />
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default VoiceAgent;
