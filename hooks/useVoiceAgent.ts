'use client';

import { useMemo } from 'react';
import {
  useVoiceAgentContext,
  useVoiceAgentContextSafe,
} from '@/components/voice/VoiceAgentProvider';
import type {
  VoiceState,
  Message,
  VoiceError,
  CreateMessage,
} from '@/lib/voice/types';

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for the useVoiceAgent hook
 */
export interface UseVoiceAgentReturn {
  // === State ===
  /** Whether the voice agent is currently active */
  isActive: boolean;
  /** Current state of the voice agent */
  voiceState: VoiceState;
  /** Conversation messages */
  messages: Message[];
  /** Current transcript being captured (real-time) */
  currentTranscript: string;
  /** Current error (if any) */
  error: VoiceError | null;
  /** Whether the agent is ready (browser supports required APIs) */
  isReady: boolean;

  // === Derived State ===
  /** Whether the agent is currently listening */
  isListening: boolean;
  /** Whether the agent is currently processing */
  isProcessing: boolean;
  /** Whether the agent is currently speaking */
  isSpeaking: boolean;
  /** Whether the agent is in an error state */
  hasError: boolean;
  /** Number of messages in the conversation */
  messageCount: number;
  /** Last message in the conversation */
  lastMessage: Message | null;
  /** Last assistant message */
  lastAssistantMessage: Message | null;
  /** Last user message */
  lastUserMessage: Message | null;

  // === Actions ===
  /** Activate the voice agent */
  activate: () => void;
  /** Deactivate the voice agent */
  deactivate: () => void;
  /** Toggle voice agent on/off */
  toggleActive: () => void;
  /** Add a message to the conversation */
  addMessage: (message: CreateMessage) => void;
  /** Set the voice state */
  setVoiceState: (state: VoiceState) => void;
  /** Set the current transcript */
  setTranscript: (transcript: string) => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Set an error */
  setError: (error: VoiceError | null) => void;
  /** Reset to initial state */
  reset: () => void;
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * useVoiceAgent
 *
 * Public hook to interact with the voice agent system.
 * Provides both raw state and derived convenience properties.
 *
 * Must be used within a VoiceAgentProvider.
 *
 * @example
 * ```tsx
 * function VoiceButton() {
 *   const { isActive, isListening, toggleActive } = useVoiceAgent();
 *
 *   return (
 *     <button onClick={toggleActive}>
 *       {isActive ? (isListening ? 'Listening...' : 'Active') : 'Start'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useVoiceAgent(): UseVoiceAgentReturn {
  const context = useVoiceAgentContext();

  // Destructure for convenience
  const {
    isActive,
    voiceState,
    messages,
    currentTranscript,
    error,
    isReady,
    actions,
  } = context;

  // Derived state
  const derivedState = useMemo(() => {
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    const userMessages = messages.filter((m) => m.role === 'user');

    return {
      isListening: voiceState === 'listening',
      isProcessing: voiceState === 'processing',
      isSpeaking: voiceState === 'speaking',
      hasError: voiceState === 'error' || error !== null,
      messageCount: messages.length,
      lastMessage,
      lastAssistantMessage:
        assistantMessages.length > 0
          ? assistantMessages[assistantMessages.length - 1]
          : null,
      lastUserMessage:
        userMessages.length > 0 ? userMessages[userMessages.length - 1] : null,
    };
  }, [voiceState, messages, error]);

  return {
    // State
    isActive,
    voiceState,
    messages,
    currentTranscript,
    error,
    isReady,

    // Derived state
    ...derivedState,

    // Actions (renamed for public API clarity)
    activate: actions.activate,
    deactivate: actions.deactivate,
    toggleActive: actions.toggle,
    addMessage: actions.addMessage,
    setVoiceState: actions.setVoiceState,
    setTranscript: actions.setTranscript,
    clearMessages: actions.clearMessages,
    setError: actions.setError,
    reset: actions.reset,
  };
}

// ============================================================================
// Safe Hook (doesn't throw if outside provider)
// ============================================================================

/**
 * Safe version of useVoiceAgent that returns null when used outside provider.
 * Useful for components that may or may not be within the voice agent context.
 *
 * @example
 * ```tsx
 * function OptionalVoiceIndicator() {
 *   const voice = useVoiceAgentSafe();
 *
 *   if (!voice) return null; // Not in provider
 *
 *   return voice.isActive ? <VoiceIndicator /> : null;
 * }
 * ```
 */
export function useVoiceAgentSafe(): UseVoiceAgentReturn | null {
  const context = useVoiceAgentContextSafe();

  const derivedState = useMemo(() => {
    if (!context) return null;

    const { voiceState, messages, error } = context;
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    const userMessages = messages.filter((m) => m.role === 'user');

    return {
      isListening: voiceState === 'listening',
      isProcessing: voiceState === 'processing',
      isSpeaking: voiceState === 'speaking',
      hasError: voiceState === 'error' || error !== null,
      messageCount: messages.length,
      lastMessage,
      lastAssistantMessage:
        assistantMessages.length > 0
          ? assistantMessages[assistantMessages.length - 1]
          : null,
      lastUserMessage:
        userMessages.length > 0 ? userMessages[userMessages.length - 1] : null,
    };
  }, [context]);

  if (!context || !derivedState) {
    return null;
  }

  const { isActive, voiceState, messages, currentTranscript, error, isReady, actions } =
    context;

  return {
    isActive,
    voiceState,
    messages,
    currentTranscript,
    error,
    isReady,
    ...derivedState,
    activate: actions.activate,
    deactivate: actions.deactivate,
    toggleActive: actions.toggle,
    addMessage: actions.addMessage,
    setVoiceState: actions.setVoiceState,
    setTranscript: actions.setTranscript,
    clearMessages: actions.clearMessages,
    setError: actions.setError,
    reset: actions.reset,
  };
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook that only returns voice state (optimized for components that only need state)
 */
export function useVoiceState(): VoiceState {
  const { voiceState } = useVoiceAgentContext();
  return voiceState;
}

/**
 * Hook that only returns whether voice is active
 */
export function useVoiceActive(): boolean {
  const { isActive } = useVoiceAgentContext();
  return isActive;
}

/**
 * Hook that only returns messages (optimized for message display components)
 */
export function useVoiceMessages(): Message[] {
  const { messages } = useVoiceAgentContext();
  return messages;
}

