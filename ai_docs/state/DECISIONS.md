# DECISIONS - Decisiones del Workflow

## Session: 2026-01-13 Phase 3 Hero Section

### D001: Tailwind 4 Configuration
- **Contexto:** Next.js 16 + Tailwind 4 no genera tailwind.config.ts
- **Decisión:** Usar `@theme inline` en globals.css para colores custom
- **Confianza:** 0.99
- **Validado en:** FASE 1

### D002: Logo Navigation
- **Contexto:** Navegación en SPA
- **Decisión:** Logo href='/' no '#'
- **Confianza:** 0.99
- **Heredado de:** ideas-frontend D037

### D003: Header Simplification
- **Contexto:** Landing single-page
- **Decisión:** Solo CTA en header, sin nav links
- **Confianza:** 0.95
- **Heredado de:** ideas-frontend D038

### D004: Smooth Scroll Implementation
- **Contexto:** CTAs que navegan a secciones
- **Decisión:** `scrollIntoView({ behavior: 'smooth' })` + CSS fallback
- **Confianza:** 0.95
- **Validado en:** FASE 3

### D005: create-next-app Workaround
- **Contexto:** Directorio con archivos existentes (PRD.md, .claude/)
- **Decisión:** Mover archivos a /tmp, ejecutar create-next-app, restaurar
- **Confianza:** 0.99
- **Validado en:** FASE 1

### D006: Button Component Architecture
- **Contexto:** CTAs reutilizables
- **Decisión:** Button.tsx con variant prop ('primary' | 'secondary')
- **Confianza:** 0.95
- **Validado en:** FASE 3

---

## Session: 2026-01-15 Landing Optimization

### D007: Floating Animations CSS
- **Contexto:** Elementos decorativos animados
- **Decisión:** Keyframes float/glow-pulse en globals.css con clases animate-float
- **Confianza:** 0.95
- **Validado en:** FASE 1

### D008: SectionDivider Minimal Usage
- **Contexto:** Transiciones entre secciones
- **Decisión:** Usar SectionDivider solo antes de secciones clave (Stats), no entre todas
- **Confianza:** 0.95
- **Validado en:** FASE 4 (user preference)

### D009: Overflow-X Prevention
- **Contexto:** Scroll horizontal no deseado
- **Decisión:** overflow-x: hidden en html/body + overflow-hidden en componentes decorativos
- **Confianza:** 0.99
- **Validado en:** Cleanup

### D010: DotPattern for Forms
- **Contexto:** Background de formularios
- **Decisión:** DotPattern con glow=true y mask radial-gradient para efecto sutil
- **Confianza:** 0.95
- **Validado en:** ContactForm refactor

### D011: Select Dark Theme
- **Contexto:** Select con fondo blanco en dark mode
- **Decisión:** Usar cn() para merge de clases, defaults dark theme
- **Confianza:** 0.99
- **Validado en:** Form fixes

### D012: Form Card Opacity
- **Contexto:** Legibilidad de formularios
- **Decisión:** Opacidad 80-90% en lugar de 60% para mejor lectura
- **Confianza:** 0.95
- **Validado en:** Form fixes

---

## Session: 2026-01-14 RGPD/LOPDGDD Compliance

### D013: Cookie Consent Storage
- **Contexto:** Persistencia del consentimiento de cookies
- **Decisión:** localStorage con CookieContext para estado global
- **Confianza:** 0.95
- **Validado en:** FASE 0

### D014: Cookie Banner Button Parity (AEPD)
- **Contexto:** AEPD Guidelines 2023 - botones al mismo nivel
- **Decisión:** Todos los botones (Aceptar/Rechazar/Configurar) usan variant="secondary" con mismo min-w
- **Confianza:** 0.99
- **Validado en:** FASE 1, FASE 6 QA

### D015: Technical Cookies Non-Disableable
- **Contexto:** Cookies técnicas necesarias para funcionamiento
- **Decisión:** Toggle siempre ON con disabled={true} y cursor-not-allowed
- **Confianza:** 0.99
- **Validado en:** FASE 1

### D016: Privacy Checkbox Mandatory
- **Contexto:** RGPD requiere consentimiento explícito
- **Decisión:** z.literal(true) en validación Zod para campo obligatorio
- **Confianza:** 0.99
- **Validado en:** FASE 3

### D017: Commercial Checkbox Separate Opt-in
- **Contexto:** LSSI Art. 21 - comunicaciones comerciales
- **Decisión:** Checkbox separado, opcional (z.boolean().optional()), NO pre-marcado
- **Confianza:** 0.99
- **Validado en:** FASE 3

### D018: Cookie Duration 13 Months
- **Contexto:** AEPD recomienda máximo 13 meses
- **Decisión:** COOKIE_MAX_AGE_DAYS = 395
- **Confianza:** 0.99
- **Validado en:** cookie-config.ts

### D019: Hydration-Safe Cookie Context
- **Contexto:** Static generation + client hydration
- **Decisión:** useCookieConsentSafe hook que retorna null en lugar de throw
- **Confianza:** 0.95
- **Validado en:** FASE 4, FASE 5

### D020: CookieSettingsButton Client Island
- **Contexto:** Footer como Server Component con botón interactivo
- **Decisión:** Componente separado 'use client' para mantener optimización SSR
- **Confianza:** 0.95
- **Validado en:** FASE 4

---

## Decisiones Pendientes

Ninguna decisión pendiente de validación.

---

**Última actualización:** 2026-01-14T18:00:00Z
