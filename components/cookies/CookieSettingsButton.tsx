'use client';

import { useCookieConsentSafe } from './CookieContext';

interface CookieSettingsButtonProps {
  className?: string;
}

export function CookieSettingsButton({ className }: CookieSettingsButtonProps) {
  const context = useCookieConsentSafe();

  // If no provider available (e.g., during SSR/static generation), don't render
  if (!context) {
    return null;
  }

  return (
    <button
      onClick={context.openSettings}
      className={className ?? "text-slate-500 hover:text-white transition-colors duration-200 text-xs"}
    >
      Configurar cookies
    </button>
  );
}
