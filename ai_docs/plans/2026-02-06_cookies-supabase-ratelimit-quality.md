# Plan: Cookies Supabase + Rate Limiting + Quality Issues

## Task Description
Implementar 3 mejoras tecnicas en la landing de StudioTek antes de la semana de facturacion (9 Feb 2026):
1. **Persistir Cookie Consent en Supabase** - Audit trail RGPD (Art. 7.1)
2. **Rate Limiting para Voice APIs** - Proteccion contra abuso en 3 rutas de voz (chat, tts, stt)
3. **Quality Issues** - AudioContext cleanup, refactorizar ai-chat-input.tsx, structured logger

Stack: Next.js 16 + React 19 + Tailwind 4 + TypeScript + Supabase + Vercel.
Produccion: https://studiotek.es con auto-deploy desde GitHub.

## Objective
Al completar este plan:
- El consentimiento de cookies tendra audit trail en Supabase (RGPD Art. 7.1 compliance)
- Las 3 rutas de voz tendran rate limiting protegiendo contra abuso de OpenAI API
- AudioContext no tendra memory leaks
- ai-chat-input.tsx estara refactorizado de 625 lineas a <250 lineas con hooks extraidos
- Un structured logger reemplazara console.log/warn/error directos en las voice APIs

## Problem Statement
1. **Cookie Consent sin audit trail**: localStorage es la unica fuente de consentimiento. AEPD puede solicitar evidencia de consentimiento y no existe registro del lado servidor. Art. 7.1 RGPD exige poder DEMOSTRAR el consentimiento.
2. **Voice APIs sin proteccion**: Las 3 rutas `/api/voice/*` estan abiertas sin rate limiting. Un bot puede generar costes excesivos en OpenAI (GPT-4o-mini tokens, TTS audio, Whisper transcripcion).
3. **Deuda tecnica**: AudioContext crea memory leaks al montar/desmontar AIChatPanel. ai-chat-input.tsx tiene 625 lineas con logica de voz duplicada (ya existe `hooks/useSpeechRecognition.ts` con 742 lineas que NO se usa en este componente). Console.log directos dificultan debug en produccion.

## Solution Approach
- **Offline-First pattern** para cookies: localStorage sigue siendo source of truth para UX, Supabase es audit trail. Si la API falla, UX no se bloquea.
- **In-memory sliding window** para rate limiting: Simple, sin dependencias externas, adecuado para el trafico de una landing page.
- **Refactor incremental** para quality: Fix AudioContext primero, luego logger, finalmente refactor del componente grande.

## Relevant Files

### Tarea 1: Cookie Consent Supabase
- `lib/cookie-config.ts` - Config de cookies (CookieConsent interface, COOKIES_CONFIG) - **leer para types**
- `lib/cookies.ts` - CRUD localStorage (getCookieConsent, setCookieConsent) - **modificar: anadir getOrCreateSessionId()**
- `components/cookies/CookieContext.tsx` - React Context con acceptAll/rejectAll/saveSettings - **modificar: anadir fetch fire-and-forget**
- `lib/supabase.ts` - Cliente Supabase con createSupabaseServerClient() - **leer para reusar patron**
- `components/cookies/CookieBanner.tsx` - Banner UI - **no modificar** (solo consume context)

### Tarea 2: Rate Limiting
- `app/api/voice/chat/route.ts` - Chat con GPT-4o-mini (216 lineas) - **modificar: anadir rate limit al inicio**
- `app/api/voice/tts/route.ts` - Text-to-Speech (91 lineas) - **modificar: anadir rate limit al inicio**
- `app/api/voice/stt/route.ts` - Speech-to-Text Whisper (83 lineas) - **modificar: anadir rate limit al inicio**

### Tarea 3: Quality Issues
- `components/ui/AIChatPanel.tsx` - Panel de chat con audioContextRef sin cleanup (405 lineas) - **modificar: anadir useEffect cleanup**
- `components/ui/ai-chat-input.tsx` - Componente monolitico (625 lineas) - **refactorizar: extraer hooks**
- `hooks/useSpeechRecognition.ts` - Hook EXISTENTE (742 lineas, completo con Whisper fallback) - **NOTA: ai-chat-input.tsx NO usa este hook, tiene su propia implementacion inline. El refactor debe decidir si reusar este hook o extraer el codigo inline a hooks nuevos.**

### New Files
- `app/api/cookies/consent/route.ts` - API endpoint para persistir cookie consent en Supabase
- `lib/rate-limit.ts` - Rate limiter in-memory con sliding window
- `lib/logger.ts` - Structured logger factory
- `hooks/useWhisperRecording.ts` - Custom hook: MediaRecorder + Whisper API (extraido de ai-chat-input.tsx)
- `hooks/useRotatingPlaceholder.ts` - Custom hook: Placeholder animation (extraido de ai-chat-input.tsx)

**NOTA IMPORTANTE sobre useSpeechRecognition**: Ya existe `hooks/useSpeechRecognition.ts` con una implementacion completa (Web Speech API + Whisper fallback + device detection). El componente `ai-chat-input.tsx` tiene su PROPIA implementacion inline de Web Speech API (lineas 116-199) que NO usa el hook existente. Para el refactor, se debe:
- **Reusar el hook existente** `hooks/useSpeechRecognition.ts` en lugar de extraer la implementacion inline a un nuevo hook
- **Extraer solo lo que NO existe**: useWhisperRecording (la parte de MediaRecorder con transcripcion periodica cada 2.5s) y useRotatingPlaceholder
- Adaptar ai-chat-input.tsx para usar `useSpeechRecognition` del hook existente + `useWhisperRecording` nuevo + `useRotatingPlaceholder` nuevo

## Implementation Phases

### Phase 1: Foundation (Paralela)
- **Builder-API**: Rate Limiting (lib/rate-limit.ts + aplicar a 3 voice routes) + Cookie Consent backend (API route + CookieContext sync + getOrCreateSessionId)
- **Builder-Frontend**: AudioContext cleanup + Structured Logger (lib/logger.ts aplicado en 3 voice APIs)
- Estos dos builders trabajan en archivos completamente independientes.

### Phase 2: Validation
- Validator verifica Phase 1: type-check, lint, archivos creados, criterios de aceptacion parciales.

### Phase 3: Refactor
- Builder-Frontend refactoriza ai-chat-input.tsx extrayendo hooks (uno reutilizando el existente useSpeechRecognition, dos nuevos).

### Phase 4: Validation Final
- Validator verifica refactor + validacion integral de todo.

## Team Orchestration

- Operas como el lider del equipo y orquestas al equipo para ejecutar el plan.
- Eres responsable de desplegar a los miembros del equipo adecuados con el contexto correcto para ejecutar el plan.
- IMPORTANTE: NUNCA operas directamente sobre el codigo base. Usas las herramientas `Task` y `Task*` para desplegar a los miembros del equipo para construir, validar, probar, desplegar y otras tareas.
  - Esto es critico. Tu trabajo es actuar como un director de alto nivel del equipo, no como un constructor.
  - Tu rol es validar que todo el trabajo vaya bien y asegurarte de que el equipo este en camino para completar el plan.
  - Orquestaras esto usando las Herramientas `Task*` para gestionar la coordinacion entre los miembros del equipo.
  - La comunicacion es primordial. Usaras las Herramientas `Task*` para comunicarte con los miembros del equipo y asegurar que esten en camino para completar el plan.
- Toma nota del ID de sesion de cada miembro del equipo. Asi es como los referenciaras.

### Team Members

- Builder
  - Name: builder-api
  - Role: Implementa Rate Limiting (lib/rate-limit.ts + 3 voice routes) y Cookie Consent backend (API route /api/cookies/consent + CookieContext sync + getOrCreateSessionId en lib/cookies.ts). Archivos: lib/rate-limit.ts, lib/cookies.ts, app/api/voice/chat/route.ts, app/api/voice/tts/route.ts, app/api/voice/stt/route.ts, app/api/cookies/consent/route.ts, components/cookies/CookieContext.tsx.
  - Agent Type: builder
  - Resume: true

- Builder
  - Name: builder-frontend
  - Role: Implementa AudioContext cleanup (AIChatPanel.tsx), Structured Logger (lib/logger.ts aplicado en 3 voice APIs), y refactoriza ai-chat-input.tsx extrayendo hooks. Archivos: components/ui/AIChatPanel.tsx, components/ui/ai-chat-input.tsx, lib/logger.ts, hooks/useWhisperRecording.ts, hooks/useRotatingPlaceholder.ts.
  - Agent Type: builder
  - Resume: true

- Validator
  - Name: validator-qa
  - Role: QA read-only que valida cada entrega del builder. Verifica criterios de aceptacion, busca regresiones, ejecuta comandos de verificacion. NUNCA escribe codigo.
  - Agent Type: validator
  - Resume: true

## Step by Step Tasks

### 1a. Implementar Rate Limiting + Cookie Consent Supabase
- **Task ID**: build-ratelimit-cookies
- **Depends On**: none
- **Assigned To**: builder-api
- **Agent Type**: builder
- **Parallel**: true (con 1b)

**Rate Limiting:**
1. Crear `lib/rate-limit.ts`:
   - Implementar rate limiter in-memory con sliding window usando `Map<string, { count: number, resetAt: number }>`
   - Exportar funcion `rateLimit(ip: string, limit: number, windowMs: number): { success: boolean, remaining: number, resetAt: number }`
   - Exportar funcion `getClientIP(request: NextRequest): string` que extraiga IP de `x-forwarded-for` o `x-real-ip`
   - Implementar limpieza periodica de entradas expiradas (cada 60s)
2. Aplicar rate limiting en `app/api/voice/chat/route.ts`:
   - Al inicio del handler POST, antes de cualquier logica
   - Limite: 20 req/min
   - Si excede: retornar 429 con headers `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`
   - Mensaje: `"Demasiadas solicitudes. Intenta en unos segundos."`
3. Aplicar rate limiting en `app/api/voice/tts/route.ts`:
   - Mismo patron, limite: 30 req/min
4. Aplicar rate limiting en `app/api/voice/stt/route.ts`:
   - Mismo patron, limite: 30 req/min

**Cookie Consent Supabase:**
5. Crear `app/api/cookies/consent/route.ts`:
   - POST handler que recibe: `{ consent: { technical, analytics, marketing }, action: string, sessionId: string, consentVersion: string }`
   - Hashear IP con `crypto.subtle.digest('SHA-256', ...)` (Web Crypto API, Edge Runtime compatible)
   - IP de `request.headers.get('x-forwarded-for')` (Vercel) o fallback `x-real-ip`
   - User-Agent de `request.headers.get('user-agent')`
   - Usar `createSupabaseServerClient()` de `lib/supabase.ts` para bypass RLS
   - Page URL de `request.headers.get('referer')` o body
   - Insertar en tabla `cookie_consents` (campos: session_id, ip_hash, consent JSONB, action, user_agent, page_url, consent_version, created_at)
   - No requiere autenticacion
   - Responder 201 Created con `{ success: true }`
   - Si Supabase no configurado: log y retornar 200 silenciosamente (graceful degradation)
6. Anadir `getOrCreateSessionId()` en `lib/cookies.ts`:
   - Genera UUID unico por sesion usando `sessionStorage`
   - Si ya existe en sessionStorage, retornarlo
   - Si no, crear uno nuevo con `crypto.randomUUID()`, guardarlo en sessionStorage y retornarlo
7. Modificar `components/cookies/CookieContext.tsx`:
   - Importar `getOrCreateSessionId` de `lib/cookies.ts`
   - Crear funcion interna `persistConsentToServer(consent, action)` que haga fetch fire-and-forget a `/api/cookies/consent`
   - En `acceptAll()`: despues de `setCookieConsent(newConsent)`, llamar `persistConsentToServer(newConsent, 'accept_all').catch(() => {})`
   - En `rejectAll()`: despues de `setCookieConsent(newConsent)`, llamar `persistConsentToServer(newConsent, 'reject_all').catch(() => {})`
   - En `saveSettings()`: despues de `setCookieConsent(newConsent)`, llamar `persistConsentToServer(newConsent, 'custom').catch(() => {})`
   - El `.catch(() => {})` silencia errores - localStorage es source of truth

**NOTA**: La tabla `cookie_consents` en Supabase debe crearse manualmente por el usuario via SQL Editor. El builder debe generar el SQL DDL y documentarlo en un comentario al inicio de `app/api/cookies/consent/route.ts`, pero NO ejecutarlo. El SQL a generar:
```sql
CREATE TABLE IF NOT EXISTS public.cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  consent JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('accept_all', 'reject_all', 'custom')),
  user_agent TEXT,
  page_url TEXT,
  consent_version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cookie_consents_session_id ON public.cookie_consents(session_id);
CREATE INDEX idx_cookie_consents_created_at ON public.cookie_consents(created_at DESC);

ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;
-- No SELECT policy for anon - only service role can read
```

### 1b. Implementar AudioContext Cleanup + Structured Logger
- **Task ID**: build-audiocontext-logger
- **Depends On**: none
- **Assigned To**: builder-frontend
- **Agent Type**: builder
- **Parallel**: true (con 1a)

**AudioContext Cleanup:**
1. Modificar `components/ui/AIChatPanel.tsx`:
   - Anadir un `useEffect` con cleanup que cierre `audioContextRef.current` al desmontar el componente
   - El cleanup debe llamar `audioContextRef.current.close()` y setear la ref a null
   - Proteger con try/catch por si ya esta cerrado
   - Colocar este useEffect despues de la declaracion de audioContextRef (linea 73)

**Structured Logger:**
2. Crear `lib/logger.ts`:
   - Factory function `createLogger(module: string)` que retorne objeto con metodos `{ info, warn, error, debug }`
   - Formato: `[MODULE] msg` para info, `[MODULE] WARN: msg` para warn, `[MODULE] ERROR: msg` para error
   - `debug` solo activo en `process.env.NODE_ENV === 'development'`
   - Los metodos deben aceptar `(msg: string, ...args: unknown[])` para mantener compatibilidad con console.log
3. Aplicar logger en `app/api/voice/chat/route.ts`:
   - `const logger = createLogger('VOICE-CHAT')`
   - Reemplazar `console.warn(...)` y `console.error(...)` por `logger.warn(...)` y `logger.error(...)`
4. Aplicar logger en `app/api/voice/tts/route.ts`:
   - `const logger = createLogger('VOICE-TTS')`
   - Reemplazar console.warn/error
5. Aplicar logger en `app/api/voice/stt/route.ts`:
   - `const logger = createLogger('VOICE-STT')`
   - Reemplazar console.warn/error

**CONFLICTO DE ARCHIVOS**: builder-frontend modifica las 3 voice APIs (logger) y builder-api tambien las modifica (rate limiting). Para evitar conflictos:
- **builder-api ejecuta PRIMERO** la parte de rate limiting en las voice APIs
- **builder-frontend aplica DESPUES** el logger en las mismas voice APIs (sobre el codigo ya modificado por builder-api)
- **ALTERNATIVA RECOMENDADA**: builder-api hace TODO el trabajo en las voice APIs (rate limiting + logger), y builder-frontend solo hace AudioContext cleanup. Esto elimina el conflicto.

**DECISION**: builder-frontend SOLO hace AudioContext cleanup y crea lib/logger.ts. El logger se aplica en las voice APIs como parte del trabajo de builder-api (que ya las esta modificando para rate limiting). Esto evita conflictos de merge entre los dos builders que trabajan en paralelo.

**REVISION del scope de builder-frontend en esta tarea:**
1. AudioContext cleanup en AIChatPanel.tsx
2. Crear lib/logger.ts (solo el archivo, sin aplicarlo)

**REVISION del scope de builder-api en esta tarea:**
1. Crear lib/rate-limit.ts
2. Crear lib/logger.ts... NO, eso tambien genera conflicto.

**DECISION FINAL**: Dado el conflicto en las voice APIs, reorganizar asi:
- **builder-api**: Rate Limiting (lib/rate-limit.ts) + Cookie Consent (API route + CookieContext + getOrCreateSessionId) + Structured Logger (lib/logger.ts + aplicar en las 3 voice APIs). Builder-api toca TODOS los archivos server-side.
- **builder-frontend**: AudioContext cleanup (AIChatPanel.tsx). Solo 1 archivo client-side. Tarea rapida.
- Ambos trabajan en paralelo SIN conflictos de archivos.

### 2. Validar Phase 1 (Rate Limiting + Cookies + AudioContext + Logger)
- **Task ID**: validate-phase1
- **Depends On**: build-ratelimit-cookies, build-audiocontext-logger
- **Assigned To**: validator-qa
- **Agent Type**: validator
- **Parallel**: false

Verificaciones:
- Leer `lib/rate-limit.ts` y verificar: sliding window, cleanup periodico, getClientIP con x-forwarded-for
- Leer las 3 voice routes y verificar: rate limiting aplicado al inicio del POST handler, limites correctos (20/30/30), respuesta 429 con headers, logger aplicado
- Leer `app/api/cookies/consent/route.ts` y verificar: IP hasheada con SHA-256, usa createSupabaseServerClient, no requiere auth, responde 201
- Leer `lib/cookies.ts` y verificar: getOrCreateSessionId usa sessionStorage + crypto.randomUUID
- Leer `components/cookies/CookieContext.tsx` y verificar: fire-and-forget en acceptAll/rejectAll/saveSettings con .catch(() => {})
- Leer `components/ui/AIChatPanel.tsx` y verificar: useEffect cleanup cierra audioContextRef
- Leer `lib/logger.ts` y verificar: factory createLogger con info/warn/error/debug, debug solo en development
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npx tsc --noEmit` - Type check
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run lint` - Lint
- Verificar archivos creados: `ls lib/rate-limit.ts lib/logger.ts app/api/cookies/consent/route.ts`
- Reportar PASS o FAIL con detalle por criterio

### 3. Refactorizar ai-chat-input.tsx (Custom Hooks)
- **Task ID**: build-refactor-chat
- **Depends On**: validate-phase1
- **Assigned To**: builder-frontend
- **Agent Type**: builder
- **Parallel**: false

**CONTEXTO CRITICO**: El componente `ai-chat-input.tsx` (625 lineas) tiene su PROPIA implementacion inline de:
- Web Speech API (lineas 116-199, 399-425) - duplicada del hook existente `hooks/useSpeechRecognition.ts`
- MediaRecorder + Whisper fallback (lineas 229-397) - parcialmente duplicada
- Rotating placeholder (lineas 106-114)

**Estrategia de refactor:**

1. **Crear `hooks/useRotatingPlaceholder.ts`** (NUEVO):
   - Extraer logica de lineas 106-114 de ai-chat-input.tsx
   - Hook recibe: `placeholders: string[]`, condiciones de pausa (isFocused, hasValue, isActive)
   - Retorna: `currentPlaceholder: number`

2. **Crear `hooks/useWhisperRecording.ts`** (NUEVO):
   - Extraer la logica de MediaRecorder con transcripcion periodica (lineas 229-397 de ai-chat-input.tsx)
   - Esta logica es DIFERENTE al Whisper mode del hook existente useSpeechRecognition.ts:
     - ai-chat-input.tsx hace transcripcion periodica cada 2.5s (linea 361) con `transcribePartial()`
     - hooks/useSpeechRecognition.ts solo transcribe al final (onstop handler)
   - Hook recibe: callbacks `onTranscript`, `onFinalTranscript`, `onError`, `onStart`
   - Retorna: `{ isRecording, startRecording, stopRecording, isTranscribing }`
   - Incluir cleanup de MediaRecorder y streams en useEffect

3. **Refactorizar `components/ui/ai-chat-input.tsx`**:
   - Importar y usar `hooks/useRotatingPlaceholder.ts`
   - Importar y usar `hooks/useWhisperRecording.ts`
   - Para Web Speech API: importar y usar el hook EXISTENTE `hooks/useSpeechRecognition.ts` (adaptar las props/callbacks al formato del hook existente)
   - Eliminar TODA la logica inline duplicada: tipos SpeechRecognition* (lineas 9-46), inicializacion Web Speech API (117-199), MediaRecorder (229-397), start/stop functions (399-425)
   - Mantener solo: props interface, composicion de hooks, toggleVoice, handleSubmit, JSX
   - Objetivo: < 250 lineas

4. **Verificar que no hay regresiones**:
   - El comportamiento debe ser identico: Web Speech API como primario, Whisper como fallback
   - toggleVoice debe decidir cual usar (igual que antes)
   - Rotating placeholders deben funcionar
   - El componente debe compilar sin errores de tipos

### 4. Validar Refactor ai-chat-input.tsx
- **Task ID**: validate-refactor
- **Depends On**: build-refactor-chat
- **Assigned To**: validator-qa
- **Agent Type**: validator
- **Parallel**: false

Verificaciones:
- Contar lineas de `components/ui/ai-chat-input.tsx`: debe ser < 250
- Verificar que existen: `hooks/useWhisperRecording.ts`, `hooks/useRotatingPlaceholder.ts`
- Leer ai-chat-input.tsx y verificar: usa useSpeechRecognition (existente), useWhisperRecording (nuevo), useRotatingPlaceholder (nuevo)
- Verificar que NO hay tipos SpeechRecognition* duplicados en ai-chat-input.tsx
- Verificar que NO hay logica de MediaRecorder inline en ai-chat-input.tsx
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npx tsc --noEmit` - Type check
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run lint` - Lint
- Reportar PASS o FAIL con detalle

### 5. Validacion Final Integral
- **Task ID**: validate-all
- **Depends On**: validate-refactor
- **Assigned To**: validator-qa
- **Agent Type**: validator
- **Parallel**: false

Verificar CADA criterio de aceptacion individualmente:

**Rate Limiting:**
- [ ] `lib/rate-limit.ts` existe con sliding window y cleanup periodico
- [ ] `app/api/voice/chat/route.ts` tiene rate limiting (20 req/min) al inicio del POST
- [ ] `app/api/voice/tts/route.ts` tiene rate limiting (30 req/min) al inicio del POST
- [ ] `app/api/voice/stt/route.ts` tiene rate limiting (30 req/min) al inicio del POST
- [ ] Respuesta 429 incluye headers: Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining
- [ ] Mensaje de error en espanol: "Demasiadas solicitudes..."

**Cookie Consent Supabase:**
- [ ] `app/api/cookies/consent/route.ts` existe con POST handler
- [ ] IP hasheada con SHA-256 (crypto.subtle.digest), nunca IP raw
- [ ] Usa createSupabaseServerClient() para service role
- [ ] `lib/cookies.ts` tiene getOrCreateSessionId() con sessionStorage
- [ ] `CookieContext.tsx` tiene fire-and-forget en acceptAll/rejectAll/saveSettings
- [ ] .catch(() => {}) silencia errores en cada llamada
- [ ] SQL DDL documentado para tabla cookie_consents

**AudioContext Cleanup:**
- [ ] `AIChatPanel.tsx` tiene useEffect que cierra audioContextRef al desmontar

**Structured Logger:**
- [ ] `lib/logger.ts` existe con createLogger factory
- [ ] Las 3 voice APIs usan logger en vez de console.log/warn/error directos

**Refactor ai-chat-input.tsx:**
- [ ] ai-chat-input.tsx tiene < 250 lineas
- [ ] `hooks/useWhisperRecording.ts` existe y contiene logica de MediaRecorder
- [ ] `hooks/useRotatingPlaceholder.ts` existe y contiene logica de placeholder
- [ ] ai-chat-input.tsx usa useSpeechRecognition del hook existente
- [ ] No hay tipos SpeechRecognition* duplicados en ai-chat-input.tsx
- [ ] No hay logica de MediaRecorder inline en ai-chat-input.tsx

**Build completo:**
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npx tsc --noEmit`
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run lint`
- Ejecutar: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run build`
- Verificar archivos: `ls lib/rate-limit.ts lib/logger.ts app/api/cookies/consent/route.ts hooks/useWhisperRecording.ts hooks/useRotatingPlaceholder.ts`

Reporte final: PASS o FAIL con detalle por criterio.

## Acceptance Criteria

### Rate Limiting
1. Rate limiter creado en `lib/rate-limit.ts` con sliding window in-memory
2. Las 3 rutas de voz tienen rate limiting: chat (20/min), tts (30/min), stt (30/min)
3. Respuesta 429 incluye headers estandar (Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining)
4. Mensaje de error en espanol
5. IP extraida de x-forwarded-for (Vercel compatible)

### Cookie Consent Supabase
6. API endpoint `POST /api/cookies/consent` persiste en Supabase
7. IP hasheada con SHA-256 (nunca IP raw en DB)
8. localStorage sigue funcionando como fallback offline (fire-and-forget)
9. No se bloquea la UX si la API falla (.catch silencioso)
10. Session ID unico por sesion de navegador (sessionStorage)
11. SQL DDL documentado para crear tabla manualmente

### AudioContext Cleanup
12. AudioContext se cierra en cleanup de useEffect al desmontar AIChatPanel

### Structured Logger
13. Logger factory creado en `lib/logger.ts`
14. Aplicado en las 3 voice APIs reemplazando console.log/warn/error directos

### Refactor ai-chat-input.tsx
15. ai-chat-input.tsx reducido a < 250 lineas
16. Hooks extraidos (useRotatingPlaceholder, useWhisperRecording) + reutilizacion de useSpeechRecognition existente
17. Sin regresiones: voz (Web Speech + Whisper), chat, input funcionan igual

### Build
18. `npx tsc --noEmit` pasa sin errores
19. `npm run lint` pasa sin errores
20. `npm run build` pasa sin errores

## Validation Commands
Ejecuta estos comandos para validar que la tarea esta completa:

```bash
# IMPORTANTE: Node 22 requerido
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# Verificar version de Node
node --version  # Debe ser v22.x.x

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build produccion
npm run build

# Verificar que los archivos nuevos existen
ls -la lib/rate-limit.ts
ls -la lib/logger.ts
ls -la app/api/cookies/consent/route.ts
ls -la hooks/useWhisperRecording.ts
ls -la hooks/useRotatingPlaceholder.ts

# Verificar lineas de ai-chat-input.tsx (debe ser < 250)
wc -l components/ui/ai-chat-input.tsx
```

## Notes
- **Node 22 obligatorio**: El proyecto NO compila con Node 25+. Usar `export PATH="/opt/homebrew/opt/node@22/bin:$PATH"` antes de cualquier comando.
- **Tabla Supabase manual**: La tabla `cookie_consents` debe crearse manualmente por el usuario via SQL Editor de Supabase. El builder genera el SQL DDL documentado en un comentario del route handler, pero NO lo ejecuta.
- **Deploy automatico**: Push a main -> Vercel production. NO hacer push al terminar, solo verificar que build pasa.
- **Hook existente**: `hooks/useSpeechRecognition.ts` (742 lineas) ya existe con implementacion completa. ai-chat-input.tsx tiene duplicacion que se debe resolver reusando este hook.
- **No se requieren nuevas dependencias npm**: Todo se implementa con APIs nativas (Web Crypto, Map, sessionStorage).
- **SUPABASE_SERVICE_ROLE_KEY**: Necesaria para el endpoint de cookies. Si no existe en env, el endpoint hace graceful degradation (log + 200).
- **Conflicto de archivos resuelto**: builder-api toca TODOS los archivos server-side (voice APIs + rate limit + logger + cookies). builder-frontend solo toca AIChatPanel.tsx (Phase 1) y ai-chat-input.tsx + hooks (Phase 3). No hay solapamiento.
