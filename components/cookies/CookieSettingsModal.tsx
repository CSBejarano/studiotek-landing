'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCookieConsent, useCookieConsentSafe } from './CookieContext';
import { Button } from '@/components/ui/Button';
import { COOKIES_CONFIG, CookieCategory } from '@/lib/cookie-config';
import { CookieDetailsList } from './CookieDetailsList';

interface CategoryToggleProps {
  category: CookieCategory;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function CategoryToggle({
  category,
  label,
  description,
  checked,
  disabled = false,
  onChange
}: CategoryToggleProps) {
  const id = `cookie-toggle-${category}`;

  return (
    <div className="py-4 border-b border-slate-700/50 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label
            htmlFor={id}
            className={`font-medium ${disabled ? 'text-slate-400' : 'text-white'}`}
          >
            {label}
            {disabled && (
              <span className="ml-2 text-xs text-slate-500">(Requeridas)</span>
            )}
          </label>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>

        {/* Toggle Switch */}
        <button
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800
            ${checked ? 'bg-blue-500' : 'bg-slate-600'}
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        >
          <span className="sr-only">Toggle {label}</span>
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {/* Detalle de cookies de esta categoria */}
      {COOKIES_CONFIG[category].cookies.length > 0 && (
        <div className="mt-3">
          <CookieDetailsList category={category} compact />
        </div>
      )}
    </div>
  );
}

// Componente interno que maneja el estado del modal
function CookieSettingsModalContent() {
  const { closeSettings, saveSettings, rejectAll, consent } = useCookieConsent();

  // Inicializar estado desde consent - por defecto OFF (AEPD compliance)
  const initialAnalytics = consent?.analytics ?? false;
  const initialMarketing = consent?.marketing ?? false;

  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [marketing, setMarketing] = useState(initialMarketing);

  // Ref para focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSettings();
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [closeSettings]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Focus al primer elemento
    setTimeout(() => firstFocusableRef.current?.focus(), 100);
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleSave = () => {
    saveSettings({ analytics, marketing });
  };

  const handleOnlyNecessary = () => {
    rejectAll();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={closeSettings}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 max-w-lg w-full max-h-[90vh] overflow-hidden rounded-xl bg-slate-800/95 backdrop-blur-md border border-slate-700/50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h2 id="cookie-settings-title" className="text-lg font-semibold text-white">
            Configuracion de Cookies
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={closeSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Cerrar configuracion"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-slate-300 mb-4">
            Configura que tipos de cookies deseas permitir. Las cookies tecnicas son necesarias
            para el funcionamiento del sitio y no pueden desactivarse.
          </p>

          {/* Category Toggles */}
          <div className="space-y-0">
            {/* Tecnicas - siempre ON, disabled */}
            <CategoryToggle
              category="technical"
              label={COOKIES_CONFIG.technical.name}
              description={COOKIES_CONFIG.technical.description}
              checked={true}
              disabled={true}
              onChange={() => {}}
            />

            {/* Analiticas */}
            <CategoryToggle
              category="analytics"
              label={COOKIES_CONFIG.analytics.name}
              description={COOKIES_CONFIG.analytics.description}
              checked={analytics}
              onChange={setAnalytics}
            />

            {/* Marketing */}
            <CategoryToggle
              category="marketing"
              label={COOKIES_CONFIG.marketing.name}
              description={COOKIES_CONFIG.marketing.description}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-slate-700/50 bg-slate-800/50">
          <Button
            variant="secondary"
            onClick={handleOnlyNecessary}
            className="flex-1"
          >
            Solo necesarias
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            className="flex-1"
          >
            Guardar configuracion
          </Button>
        </div>
      </div>
    </>
  );
}

// Wrapper que controla la visibilidad - re-monta el contenido para reiniciar estado
export function CookieSettingsModal() {
  const context = useCookieConsentSafe();

  // During static generation or when provider is not available, render nothing
  if (!context) return null;

  const { showSettings } = context;

  if (!showSettings) return null;

  // Al renderizar CookieSettingsModalContent, se reinicia su estado local
  return <CookieSettingsModalContent />;
}
