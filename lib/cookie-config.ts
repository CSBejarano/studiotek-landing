// Configuracion de cookies del sitio
export const COOKIE_CONSENT_KEY = 'studiotek_cookie_consent';
export const COOKIE_MAX_AGE_DAYS = 395; // ~13 meses (AEPD recommendation)

export type CookieCategory = 'technical' | 'analytics' | 'marketing';

export interface CookieConsent {
  technical: boolean;  // Siempre true, no se puede desactivar
  analytics: boolean;
  marketing: boolean;
  timestamp: string;   // ISO date
  version: string;     // Version de la politica
}

export interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}

export interface CategoryConfig {
  name: string;
  description: string;
  required: boolean;
  cookies: CookieInfo[];
}

export const COOKIES_CONFIG: Record<CookieCategory, CategoryConfig> = {
  technical: {
    name: 'Tecnicas',
    description: 'Necesarias para el funcionamiento basico del sitio web',
    required: true,
    cookies: [
      { name: 'studiotek_cookie_consent', provider: 'StudioTek', purpose: 'Recordar preferencias de cookies', duration: '13 meses' }
    ]
  },
  analytics: {
    name: 'Analiticas',
    description: 'Nos ayudan a entender como los usuarios interactuan con el sitio',
    required: false,
    cookies: []  // Agregar cuando se implemente Analytics
  },
  marketing: {
    name: 'Marketing',
    description: 'Utilizadas para mostrarte publicidad relevante',
    required: false,
    cookies: []  // Agregar cuando se implementen
  }
};
