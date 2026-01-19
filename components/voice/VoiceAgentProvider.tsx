'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type {
  VoiceAgentContextType,
  VoiceAgentConfig,
  VoiceState,
  VoiceError,
  Message,
  CreateMessage,
} from '@/lib/voice/types';

// ============================================================================
// Context
// ============================================================================

const VoiceAgentContext = createContext<VoiceAgentContextType | undefined>(undefined);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a unique ID for messages
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get current ISO timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: Required<VoiceAgentConfig> = {
  language: 'es-ES',
  autoActivate: false,
  maxMessages: 50,
  silenceTimeout: 2000,
  functions: [],
};

// ============================================================================
// Provider Component
// ============================================================================

interface VoiceAgentProviderProps {
  children: ReactNode;
  config?: VoiceAgentConfig;
}

/**
 * VoiceAgentProvider
 *
 * Provides voice agent state and actions to the component tree.
 * Handles state management for the voice conversation system.
 *
 * @example
 * ```tsx
 * <VoiceAgentProvider config={{ language: 'es-ES' }}>
 *   <App />
 * </VoiceAgentProvider>
 * ```
 */
export function VoiceAgentProvider({
  children,
  config: userConfig,
}: VoiceAgentProviderProps) {
  // Merge user config with defaults
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig]
  );

  // ========== State ==========
  const [isActive, setIsActive] = useState(false);
  const [voiceState, setVoiceStateInternal] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setErrorInternal] = useState<VoiceError | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isListeningPaused, setIsListeningPaused] = useState(false);

  // Ref to hold the message handler from VoiceAgent
  const messageHandlerRef = useRef<((text: string) => void) | null>(null);
  // Refs to hold pause/resume handlers from VoiceAgent
  const pauseHandlerRef = useRef<(() => void) | null>(null);
  const resumeHandlerRef = useRef<(() => void) | null>(null);

  // ========== Hydration Safety ==========
  useEffect(() => {
    setMounted(true);
    // Check if browser supports necessary APIs
    const hasSpeechRecognition =
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    const hasSpeechSynthesis =
      typeof window !== 'undefined' && 'speechSynthesis' in window;

    setIsReady(hasSpeechRecognition && hasSpeechSynthesis);
  }, []);

  // ========== Actions ==========

  /**
   * Activate the voice agent
   */
  const activate = useCallback(() => {
    if (!isReady) {
      setErrorInternal({
        type: 'unknown',
        message: 'Voice agent is not ready. Browser may not support required APIs.',
        timestamp: getTimestamp(),
        recoverable: false,
      });
      return;
    }
    setIsActive(true);
    setVoiceStateInternal('idle');
    setErrorInternal(null);
  }, [isReady]);

  /**
   * Deactivate the voice agent
   */
  const deactivate = useCallback(() => {
    setIsActive(false);
    setVoiceStateInternal('idle');
    setCurrentTranscript('');
  }, []);

  /**
   * Toggle voice agent on/off
   */
  const toggle = useCallback(() => {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }, [isActive, activate, deactivate]);

  /**
   * Add a message to the conversation
   */
  const addMessage = useCallback(
    (messageData: CreateMessage) => {
      const newMessage: Message = {
        ...messageData,
        id: generateId(),
        timestamp: getTimestamp(),
      };

      setMessages((prev) => {
        const updated = [...prev, newMessage];
        // Trim to max messages if exceeded
        if (updated.length > config.maxMessages) {
          // Keep system messages and trim oldest non-system messages
          const systemMessages = updated.filter((m) => m.role === 'system');
          const nonSystemMessages = updated.filter((m) => m.role !== 'system');
          const trimmedNonSystem = nonSystemMessages.slice(
            nonSystemMessages.length - (config.maxMessages - systemMessages.length)
          );
          return [...systemMessages, ...trimmedNonSystem];
        }
        return updated;
      });

      return newMessage;
    },
    [config.maxMessages]
  );

  /**
   * Update voice state
   */
  const setVoiceState = useCallback((state: VoiceState) => {
    setVoiceStateInternal(state);
    // Clear error when transitioning to non-error state
    if (state !== 'error') {
      setErrorInternal(null);
    }
  }, []);

  /**
   * Update current transcript
   */
  const setTranscript = useCallback((transcript: string) => {
    setCurrentTranscript(transcript);
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((err: VoiceError | null) => {
    setErrorInternal(err);
    if (err) {
      setVoiceStateInternal('error');
    }
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setIsActive(false);
    setVoiceStateInternal('idle');
    setMessages([]);
    setCurrentTranscript('');
    setErrorInternal(null);
  }, []);

  /**
   * Register a message handler from VoiceAgent
   */
  const registerMessageHandler = useCallback((handler: (text: string) => void) => {
    messageHandlerRef.current = handler;
  }, []);

  /**
   * Send a text message (fallback when voice is not available)
   */
  const sendTextMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // If we have a registered handler, use it
    if (messageHandlerRef.current) {
      messageHandlerRef.current(text.trim());
    } else {
      console.warn('No message handler registered. VoiceAgent may not be mounted.');
    }
  }, []);

  /**
   * Register listening handlers from VoiceAgent
   */
  const registerListeningHandlers = useCallback((pause: () => void, resume: () => void) => {
    pauseHandlerRef.current = pause;
    resumeHandlerRef.current = resume;
  }, []);

  /**
   * Pause voice listening
   */
  const pauseListening = useCallback(() => {
    if (pauseHandlerRef.current) {
      pauseHandlerRef.current();
      setIsListeningPaused(true);
    }
  }, []);

  /**
   * Resume voice listening
   */
  const resumeListening = useCallback(() => {
    if (resumeHandlerRef.current) {
      resumeHandlerRef.current();
      setIsListeningPaused(false);
    }
  }, []);

  // ========== Context Value ==========
  const actions = useMemo(
    () => ({
      activate,
      deactivate,
      toggle,
      addMessage,
      setVoiceState,
      setTranscript,
      clearMessages,
      setError,
      reset,
      sendTextMessage,
      registerMessageHandler,
      pauseListening,
      resumeListening,
      registerListeningHandlers,
    }),
    [
      activate,
      deactivate,
      toggle,
      addMessage,
      setVoiceState,
      setTranscript,
      clearMessages,
      setError,
      reset,
      sendTextMessage,
      registerMessageHandler,
      pauseListening,
      resumeListening,
      registerListeningHandlers,
    ]
  );

  const contextValue = useMemo<VoiceAgentContextType>(
    () => ({
      isActive,
      voiceState,
      messages,
      currentTranscript,
      error,
      isReady,
      isListeningPaused,
      actions,
    }),
    [isActive, voiceState, messages, currentTranscript, error, isReady, isListeningPaused, actions]
  );

  // ========== Render ==========
  // Avoid hydration mismatch by rendering children without context on server
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <VoiceAgentContext.Provider value={contextValue}>
      {children}
    </VoiceAgentContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access the voice agent context.
 * Must be used within a VoiceAgentProvider.
 *
 * @throws Error if used outside of VoiceAgentProvider
 *
 * @example
 * ```tsx
 * const { isActive, voiceState, actions } = useVoiceAgentContext();
 * ```
 */
export function useVoiceAgentContext(): VoiceAgentContextType {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error(
      'useVoiceAgentContext must be used within a VoiceAgentProvider'
    );
  }
  return context;
}

/**
 * Safe version that returns null when provider is not available.
 * Useful for components that might render outside the provider.
 */
export function useVoiceAgentContextSafe(): VoiceAgentContextType | null {
  return useContext(VoiceAgentContext) ?? null;
}

// ============================================================================
// Exports
// ============================================================================

export { VoiceAgentContext };
