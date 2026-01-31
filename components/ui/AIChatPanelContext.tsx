'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type ChatState = 'COLLAPSED' | 'FOCUSED' | 'PANEL_OPEN';

interface AIChatPanelContextType {
  chatState: ChatState;
  setChatState: (state: ChatState) => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  focusInput: () => void;
  collapse: () => void;
}

const AIChatPanelContext = createContext<AIChatPanelContextType | null>(null);

export function AIChatPanelProvider({ children }: { children: React.ReactNode }) {
  const [chatState, setChatState] = useState<ChatState>('COLLAPSED');

  const isPanelOpen = chatState === 'PANEL_OPEN';

  const openPanel = useCallback(() => setChatState('PANEL_OPEN'), []);
  const closePanel = useCallback(() => setChatState('COLLAPSED'), []);
  const focusInput = useCallback(() => setChatState('FOCUSED'), []);
  const collapse = useCallback(() => setChatState('COLLAPSED'), []);

  const value = useMemo(
    () => ({
      chatState,
      setChatState,
      isPanelOpen,
      openPanel,
      closePanel,
      focusInput,
      collapse,
    }),
    [chatState, isPanelOpen, openPanel, closePanel, focusInput, collapse]
  );

  return (
    <AIChatPanelContext.Provider value={value}>
      {children}
    </AIChatPanelContext.Provider>
  );
}

export function useAIChatPanel() {
  const context = useContext(AIChatPanelContext);
  if (!context) {
    throw new Error('useAIChatPanel must be used within AIChatPanelProvider');
  }
  return context;
}
