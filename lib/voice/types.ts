/**
 * Voice Agent Types
 *
 * TypeScript definitions for the voice agent system.
 * Includes state management, messages, and function calling types.
 */

// ============================================================================
// Voice State
// ============================================================================

/**
 * Possible states of the voice agent
 */
export type VoiceState =
  | 'idle'        // Agent is inactive, waiting to be activated
  | 'listening'   // Actively listening to user speech
  | 'processing'  // Processing user input / calling functions
  | 'speaking'    // Agent is speaking response
  | 'error';      // Error state

/**
 * Error types that can occur during voice interaction
 */
export type VoiceErrorType =
  | 'microphone_permission'   // User denied microphone access
  | 'speech_recognition'      // Speech recognition failed
  | 'api_error'               // OpenAI API error
  | 'network_error'           // Network connectivity issue
  | 'unknown';                // Unknown error

/**
 * Voice error with details
 */
export interface VoiceError {
  type: VoiceErrorType;
  message: string;
  timestamp: string;
  recoverable: boolean;
}

// ============================================================================
// Messages
// ============================================================================

/**
 * Role of a message in the conversation
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Function call made by the assistant
 */
export interface FunctionCall {
  /** Name of the function to call */
  name: string;
  /** Arguments passed to the function as JSON string */
  arguments: string;
  /** Result of the function call (set after execution) */
  result?: string;
  /** Whether the function executed successfully */
  success?: boolean;
  /** Timestamp when function was called */
  calledAt: string;
  /** Timestamp when function completed */
  completedAt?: string;
}

/**
 * A message in the conversation
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Text content of the message */
  content: string;
  /** Timestamp when message was created */
  timestamp: string;
  /** Optional function call (for assistant messages) */
  functionCall?: FunctionCall;
  /** Audio URL if message was spoken */
  audioUrl?: string;
}

// ============================================================================
// Function Definitions (for OpenAI function calling)
// ============================================================================

/**
 * Parameter definition for a function
 */
export interface FunctionParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  enum?: string[];
  required?: boolean;
}

/**
 * Definition of a callable function
 */
export interface FunctionDefinition {
  /** Function name (must match handler name) */
  name: string;
  /** Description shown to the AI */
  description: string;
  /** Parameters the function accepts */
  parameters: {
    type: 'object';
    properties: Record<string, FunctionParameter>;
    required?: string[];
  };
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Actions available in the voice agent context
 */
export interface VoiceAgentActions {
  /** Activate the voice agent */
  activate: () => void;
  /** Deactivate the voice agent */
  deactivate: () => void;
  /** Toggle voice agent on/off */
  toggle: () => void;
  /** Add a message to the conversation */
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  /** Update the current voice state */
  setVoiceState: (state: VoiceState) => void;
  /** Update the current transcript (while user is speaking) */
  setTranscript: (transcript: string) => void;
  /** Clear the conversation history */
  clearMessages: () => void;
  /** Set an error state */
  setError: (error: VoiceError | null) => void;
  /** Reset the agent to initial state */
  reset: () => void;
  /** Send a text message (fallback when voice is not available) */
  sendTextMessage: (text: string) => void;
  /** Register the message handler from VoiceAgent */
  registerMessageHandler: (handler: (text: string) => void) => void;
  /** Pause voice listening */
  pauseListening: () => void;
  /** Resume voice listening */
  resumeListening: () => void;
  /** Register pause/resume handlers from VoiceAgent */
  registerListeningHandlers: (pause: () => void, resume: () => void) => void;
}

/**
 * Full context type for the voice agent provider
 */
export interface VoiceAgentContextType {
  /** Whether the voice agent is currently active */
  isActive: boolean;
  /** Current state of the voice agent */
  voiceState: VoiceState;
  /** Conversation messages */
  messages: Message[];
  /** Current transcript (updated in real-time while listening) */
  currentTranscript: string;
  /** Current error (if any) */
  error: VoiceError | null;
  /** Whether the agent is ready to use (permissions granted, etc.) */
  isReady: boolean;
  /** Whether voice listening is paused (user can still type) */
  isListeningPaused: boolean;
  /** Available actions */
  actions: VoiceAgentActions;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Configuration options for the voice agent
 */
export interface VoiceAgentConfig {
  /** Language for speech recognition (default: 'es-ES') */
  language?: string;
  /** Whether to auto-activate on component mount */
  autoActivate?: boolean;
  /** Maximum conversation history to keep */
  maxMessages?: number;
  /** Silence timeout before auto-sending (ms) */
  silenceTimeout?: number;
  /** Custom function definitions for function calling */
  functions?: FunctionDefinition[];
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Create a new message with auto-generated id and timestamp
 */
export type CreateMessage = Omit<Message, 'id' | 'timestamp'>;

/**
 * Partial message update
 */
export type UpdateMessage = Partial<Omit<Message, 'id'>>;
