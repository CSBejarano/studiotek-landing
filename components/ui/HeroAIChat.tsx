'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatInput } from './ai-chat-input';
import { handleFunctionCall, type FunctionCall } from '@/lib/voice/functionHandlers';
import { Bot, X, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatApiResponse {
  message: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export function HeroAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-hide response after 10 seconds
  useEffect(() => {
    if (lastResponse) {
      const timer = setTimeout(() => {
        setLastResponse(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [lastResponse]);

  const handleSend = useCallback(async (userText: string) => {
    if (!userText.trim() || isProcessing) return;

    setIsProcessing(true);
    setLastResponse(null);

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Get last 10 messages for context
      const historyMessages = [...messages, userMessage].slice(-10);

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

      // Check if aborted
      if (abortControllerRef.current?.signal.aborted) {
        setIsProcessing(false);
        return;
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLastResponse(data.message);

      // Execute function call if present
      if (data.functionCall) {
        try {
          const parsedArgs = JSON.parse(data.functionCall.arguments);
          const functionCall: FunctionCall = {
            name: data.functionCall.name,
            arguments: parsedArgs,
          };
          await handleFunctionCall(functionCall);
        } catch (error) {
          console.error('Error executing function call:', error);
        }
      }

      // Optional: Play TTS
      try {
        const ttsResponse = await fetch('/api/voice/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data.message }),
        });

        if (ttsResponse.ok) {
          const audioBlob = await ttsResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onended = () => URL.revokeObjectURL(audioUrl);
          await audio.play();
        }
      } catch {
        // TTS is optional, continue without it
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setIsProcessing(false);
        return;
      }

      console.error('Error processing message:', error);
      setLastResponse('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.');
    }

    setIsProcessing(false);
  }, [messages, isProcessing]);

  const handleVoiceStart = useCallback(() => {
    setLastResponse(null);
  }, []);

  const handleVoiceEnd = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleSend(transcript);
    }
  }, [handleSend]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat Input */}
      <AIChatInput
        onSend={handleSend}
        onVoiceStart={handleVoiceStart}
        onVoiceEnd={handleVoiceEnd}
        isProcessing={isProcessing}
        placeholders={[
          "¿Qué quieres automatizar?",
          "Cuéntame sobre tu negocio...",
          "¿Cómo puedo ayudarte hoy?",
          "Describe el proceso que te quita más tiempo...",
          "¿Qué tareas repetitivas tienes?",
        ]}
      />

      {/* Response bubble */}
      <AnimatePresence>
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-6 relative"
          >
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 pr-10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">{lastResponse}</p>
              </div>
              <button
                onClick={() => setLastResponse(null)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat history toggle */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex justify-center"
          >
            <button
              onClick={() => setShowChat(!showChat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
                showChat
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              {showChat ? 'Ocultar historial' : `Ver conversación (${messages.length})`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat history panel */}
      <AnimatePresence>
        {showChat && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 max-h-64 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                        msg.role === 'user'
                          ? "bg-slate-700"
                          : "bg-gradient-to-br from-blue-500 to-cyan-400"
                      )}
                    >
                      {msg.role === 'user' ? (
                        <span className="text-xs text-slate-300">Tú</span>
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex-1 text-sm rounded-xl px-3 py-2",
                        msg.role === 'user'
                          ? "bg-slate-800 text-slate-200 text-right"
                          : "bg-slate-800/50 text-slate-300"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
