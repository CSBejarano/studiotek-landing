// Utilities para manejo de cookies
import { COOKIE_CONSENT_KEY, COOKIE_MAX_AGE_DAYS, CookieConsent } from './cookie-config';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CookieConsent;
  } catch {
    return null;
  }
}

export function setCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}

export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

export function hasValidConsent(): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;
  // Verificar que no haya expirado (13 meses)
  const consentDate = new Date(consent.timestamp);
  const now = new Date();
  const daysDiff = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff < COOKIE_MAX_AGE_DAYS;
}

// ============================================================================
// Session ID Management
// ============================================================================

const SESSION_ID_KEY = 'studiotek_session_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;
  const newId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, newId);
  return newId;
}
