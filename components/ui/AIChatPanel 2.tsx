'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIChatInput } from './ai-chat-input';
import { useAIChatPanel } from './AIChatPanelContext';
import { handleFunctionCall, type FunctionCall } from '@/lib/voice/functionHandlers';
import { X } from 'lucide-react';
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

// Logo StudioTek como componente inline
function StudioTekLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="24"
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="currentColor"
      >
        StudioTek
      </text>
    </svg>
  );
}

// Typing indicator con motion dots
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className={cn(
        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
        "bg-[#2563EB]/20 border border-[#2563EB]/30"
      )}>
        <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 py-2.5 px-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-[#2563EB]/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Quick reply suggestions
const quickReplies = [
  { id: 'what', label: '¿Qué automatizais?' },
  { id: 'cost', label: '¿Cuánto cuesta?' },
  { id: 'demo', label: 'Ver una demo' },
  { id: 'time', label: '¿Cuánto tarda?' },
];

export function AIChatPanel() {
  const { isPanelOpen, openPanel, closePanel } = useAIChatPanel();

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isVoiceInputRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcuts - solo Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPanelOpen) {
          closePanel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen, closePanel]);

  // Audio helpers
  const unlockAudioContext = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.warn('[Audio] Could not unlock audio context:', error);
    }
  }, []);

  const playAudioViaWebAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('[TTS] Web Audio API playback error:', error);
    }
  }, []);

  // Chat logic
  const handleSend = useCallback(async (userText: string) => {
    if (!userText.trim() || isProcessing) return;
    const wasVoiceInput = isVoiceInputRef.current;
    isVoiceInputRef.current = false;
    setIsProcessing(true);

    if (!isPanelOpen) {
      openPanel();
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    abortControllerRef.current = new AbortController();

    try {
      const historyMessages = [...messages, userMessage].slice(-10);
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyMessages, userMessage: userText.trim() }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: ChatApiResponse = await response.json();
      if (abortControllerRef.current?.signal.aborted) { setIsProcessing(false); return; }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.functionCall) {
        try {
          const parsedArgs = JSON.parse(data.functionCall.arguments);
          const functionCall: FunctionCall = { name: data.functionCall.name, arguments: parsedArgs };
          await handleFunctionCall(functionCall);
        } catch (error) {
          console.error('Error executing function call:', error);
        }
      }

      // TTS playback
      if (wasVoiceInput) {
        try {
          const ttsResponse = await fetch('/api/voice/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: data.message }),
          });
          if (ttsResponse.ok) {
            const audioBlob = await ttsResponse.blob();
            await playAudioViaWebAudio(audioBlob);
          }
        } catch (ttsError) {
          console.error('[TTS] Error with TTS:', ttsError);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') { setIsProcessing(false); return; }
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsProcessing(false);
  }, [messages, isProcessing, isPanelOpen, openPanel, playAudioViaWebAudio]);

  const handleVoiceStart = useCallback(() => {
    isVoiceInputRef.current = true;
    unlockAudioContext();
  }, [unlockAudioContext]);

  const handleVoiceEnd = useCallback((transcript: string) => {
    if (transcript.trim()) {
      isVoiceInputRef.current = true;
      unlockAudioContext();
      handleSend(transcript);
    }
  }, [handleSend, unlockAudioContext]);

  return (
    <>
      {/* ========== SIDE PANEL (PANEL_OPEN) ========== */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={closePanel}
            />

            {/* Panel con glassmorphism premium */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 220,
              }}
              className={cn(
                "fixed top-0 right-0 bottom-0 z-50 flex flex-col",
                "bg-[#0A0A0A]/40 backdrop-blur-2xl",
                "border-l border-white/[0.08]",
                "w-full lg:w-[440px]"
              )}
            >
              {/* Panel Header con Branding */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <StudioTekLogo className="w-full h-full text-[#2563EB]" />
                    {/* Status indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2563EB] rounded-full border-2 border-[#0A0A0A]/60" />
                  </div>
                  <div>
                    <span className="text-white/90 font-semibold text-sm">StudioTek IA</span>
                    <p className="text-[10px] text-[#2563EB] font-medium">En línea</p>
                  </div>
                </div>
                <button
                  onClick={closePanel}
                  className="text-white/40 hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/[0.06]"
                  aria-label="Cerrar panel de chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages area con glassmorphism */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    {/* Empty state con logo */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl mb-4",
                      "bg-white/[0.03] backdrop-blur-sm",
                      "border border-white/[0.05]",
                      "flex items-center justify-center"
                    )}>
                      <StudioTekLogo className="w-10 h-10 text-[#2563EB]" />
                    </div>
                    <p className="text-white/50 text-sm max-w-[280px] leading-relaxed">
                      Pregunta lo que quieras sobre automatización con IA para tu negocio
                    </p>
                    {/* Quick replies */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      {quickReplies.map((reply) => (
                        <button
                          key={reply.id}
                          onClick={() => handleSend(reply.label)}
                          className={cn(
                            "rounded-full border border-[#2563EB]/20",
                            "bg-[#2563EB]/[0.06] px-3.5 py-1.5",
                            "text-xs font-medium text-[#2563EB]/80",
                            "hover:bg-[#2563EB]/[0.12] hover:border-[#2563EB]/30",
                            "hover:text-[#2563EB] transition-all duration-200"
                          )}
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : '')}
                  >
                    {msg.role === 'assistant' && (
                      <div className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
                        "bg-[#2563EB]/20 border border-[#2563EB]/30"
                      )}>
                        <div className="w-2 h-2 bg-[#2563EB] rounded-full" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] text-sm leading-relaxed",
                        msg.role === 'user'
                          ? "bg-[#2563EB] text-white rounded-2xl rounded-br-md px-4 py-2.5"
                          : cn(
                              "rounded-2xl rounded-bl-md px-4 py-2.5",
                              "bg-white/[0.03] backdrop-blur-sm",
                              "border border-white/[0.05]",
                              "text-white/80"
                            )
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isProcessing && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area con glassmorphism */}
              <div className={cn(
                "border-t border-white/[0.06] p-4 flex-shrink-0",
                "bg-white/[0.02] backdrop-blur-xl"
              )}>
                <AIChatInput
                  onSend={(text) => {
                    unlockAudioContext();
                    handleSend(text);
                  }}
                  onVoiceStart={handleVoiceStart}
                  onVoiceEnd={handleVoiceEnd}
                  isProcessing={isProcessing}
                  placeholders={["Hacer una pregunta..."]}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
