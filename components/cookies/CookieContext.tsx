'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CookieConsent } from '@/lib/cookie-config';
import { getCookieConsent, setCookieConsent, hasValidConsent, getOrCreateSessionId } from '@/lib/cookies';

interface CookieContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  saveSettings: (consent: Partial<CookieConsent>) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getCookieConsent();
    if (stored && hasValidConsent()) {
      setConsent(stored);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const createConsent = (analytics: boolean, marketing: boolean): CookieConsent => ({
    technical: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
    version: '1.0'
  });

  const persistConsentToServer = (consent: CookieConsent, action: string) => {
    fetch('/api/cookies/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consent: { technical: consent.technical, analytics: consent.analytics, marketing: consent.marketing },
        action,
        sessionId: getOrCreateSessionId(),
        consentVersion: consent.version,
      }),
    }).catch(() => {});
  };

  const acceptAll = () => {
    const newConsent = createConsent(true, true);
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
    persistConsentToServer(newConsent, 'accept_all');
  };

  const rejectAll = () => {
    const newConsent = createConsent(false, false);
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
    persistConsentToServer(newConsent, 'reject_all');
  };

  const saveSettings = (partialConsent: Partial<CookieConsent>) => {
    const newConsent = createConsent(
      partialConsent.analytics ?? false,
      partialConsent.marketing ?? false
    );
    setCookieConsent(newConsent);
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
    persistConsentToServer(newConsent, 'custom');
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  // Evitar hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CookieContext.Provider value={{
      consent,
      showBanner,
      showSettings,
      acceptAll,
      rejectAll,
      saveSettings,
      openSettings,
      closeSettings
    }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieProvider');
  }
  return context;
}

// Safe version that returns null when provider is not available
// Useful for components that might render outside the provider (e.g., during static generation)
export function useCookieConsentSafe(): CookieContextType | null {
  return useContext(CookieContext) ?? null;
}
