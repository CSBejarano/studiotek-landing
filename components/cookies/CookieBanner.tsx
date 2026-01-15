'use client';

import { useCookieConsentSafe } from './CookieContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CookieSettingsModal } from './CookieSettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieBanner() {
  const context = useCookieConsentSafe();

  // During static generation or when provider is not available, render nothing
  if (!context) return null;

  const { showBanner, showSettings, acceptAll, rejectAll, openSettings } = context;

  if (!showBanner && !showSettings) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
            role="dialog"
            aria-label="Configuracion de cookies"
            aria-modal="false"
          >
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-4">
              <div className="flex-1 text-sm text-slate-300">
                <p className="mb-2">
                  <strong className="text-white">Utilizamos cookies</strong> propias y de terceros para mejorar
                  tu experiencia, analizar el trafico y personalizar contenidos.
                </p>
                <p>
                  Puedes aceptar todas, rechazarlas o configurar tus preferencias.{' '}
                  <Link
                    href="/politica-cookies"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Mas informacion
                  </Link>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {/* IMPORTANTE: Botones al MISMO nivel visual - AEPD compliance */}
                <Button
                  variant="secondary"
                  onClick={rejectAll}
                  className="min-w-[140px]"
                >
                  Rechazar todo
                </Button>
                <Button
                  variant="secondary"
                  onClick={openSettings}
                  className="min-w-[140px]"
                >
                  Configurar
                </Button>
                <Button
                  variant="secondary"
                  onClick={acceptAll}
                  className="min-w-[140px]"
                >
                  Aceptar todo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieSettingsModal />
    </>
  );
}
