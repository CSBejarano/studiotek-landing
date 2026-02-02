'use client';

import { useCallback } from 'react';
import { AIChatInput } from './ai-chat-input';
import { useAIChatPanel } from './AIChatPanelContext';

export function HeroAIChat() {
  const { sendMessageAndOpen } = useAIChatPanel();

  const handleSend = useCallback((userText: string) => {
    if (!userText.trim()) return;
    sendMessageAndOpen(userText.trim());
  }, [sendMessageAndOpen]);

  const handleVoiceEnd = useCallback((transcript: string) => {
    if (transcript.trim()) {
      sendMessageAndOpen(transcript.trim());
    }
  }, [sendMessageAndOpen]);

  return (
    <div className="w-full">
      <AIChatInput
        onSend={handleSend}
        onVoiceStart={() => {}}
        onVoiceEnd={handleVoiceEnd}
        isProcessing={false}
        placeholders={[
          "¿Qué quieres automatizar?",
          "Cuéntame sobre tu negocio...",
          "¿Cómo puedo ayudarte hoy?",
          "Describe el proceso que te quita más tiempo...",
          "¿Qué tareas repetitivas tienes?",
        ]}
      />
    </div>
  );
}
