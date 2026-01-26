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

---

## Session: 2026-01-15 Modal Navigation

### D021: Estado Centralizado en Padre
- **Contexto:** Modal navigation requiere control desde Services.tsx
- **Decision:** openIndex state en Services, modal unico via Portal
- **Confianza:** 0.99
- **Validado en:** FASE 3

### D022: Keyboard Navigation
- **Contexto:** Accesibilidad en modal
- **Decision:** ArrowLeft/ArrowRight para navegar, Escape para cerrar
- **Confianza:** 0.99
- **Validado en:** FASE 1

### D023: AnimatePresence Mode
- **Contexto:** Transiciones entre servicios en modal
- **Decision:** mode="wait" para transiciones suaves sin overlap
- **Confianza:** 0.95
- **Validado en:** FASE 1

### D024: Botones Dentro de containerRef
- **Contexto:** useOutsideClick cerraba modal al clickear botones
- **Decision:** Mover botones de navegacion dentro de containerRef
- **Confianza:** 0.99
- **Validado en:** Hotfix FASE 5

---

## Session: 2026-01-15 Supabase Integration

### D025: Service Role Key para Server
- **Contexto:** RLS bloquea INSERT desde anon key
- **Decision:** Usar SUPABASE_SERVICE_ROLE_KEY en server-side para bypass RLS
- **Confianza:** 0.99
- **Validado en:** FASE 3

### D026: Variables de Entorno Flexibles
- **Contexto:** Vercel usa SUPABASE_URL, local usa NEXT_PUBLIC_SUPABASE_URL
- **Decision:** Soportar ambos nombres: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
- **Confianza:** 0.95
- **Validado en:** Deploy

### D027: RLS Policies para Produccion
- **Contexto:** Seguridad de tabla leads
- **Decision:** public INSERT (formulario), authenticated SELECT/UPDATE/DELETE (admin)
- **Confianza:** 0.99
- **Validado en:** FASE 2

### D028: Historial Git Limpio
- **Contexto:** GitHub Push Protection detecta secretos en historial
- **Decision:** Crear branch orphan, excluir .claude/mcp/, force push
- **Confianza:** 0.99
- **Validado en:** FASE 4

---

---

## Session: 2026-01-19 Images and UX Improvements

### D029: Imagenes con Opacidad Configurable
- **Contexto:** Imagenes de fondo en cards necesitan balance con contenido
- **Decision:** Opacidad configurable por seccion: Benefits 45%, HowItWorks 90%
- **Confianza:** 0.95
- **Validado en:** User feedback

### D030: Progress Dots Neutros
- **Contexto:** Dots de colores en HowItWorks distraian del contenido
- **Decision:** Usar bg-slate-500 siempre, solo cambiar scale/opacity
- **Confianza:** 0.95
- **Validado en:** User request

### D031: Logo como Boton con Scroll
- **Contexto:** Click en logo debe navegar al inicio
- **Decision:** Cambiar Link por button con window.scrollTo({ top: 0, behavior: 'smooth' })
- **Confianza:** 0.99
- **Validado en:** User request

### D032: Gemini API para Imagenes
- **Contexto:** Necesidad de imagenes profesionales para cards
- **Decision:** Usar gemini-2.5-flash-image-preview via gemini_client.py
- **Confianza:** 0.95
- **Validado en:** 9 imagenes generadas exitosamente

### D033: Cache Busting de Imagenes
- **Contexto:** Next.js Image cachea agresivamente imagenes optimizadas
- **Decision:** Eliminar .next completo (no solo cache) al regenerar imagenes
- **Confianza:** 0.99
- **Validado en:** Resolucion de issue de cache

---

## Session: 2026-01-19 PainPointsSection Images

### D034: Imagenes Empaticas para Pain Points
- **Contexto:** Cards de pain points necesitan imagenes con tonos empaticos
- **Decision:** Usar tonos slate/grises oscuros (no brillantes) para transmitir empatia
- **Confianza:** 0.95
- **Validado en:** User feedback (55% opacidad final)

### D035: Card3D Image Support Reutilizable
- **Contexto:** Card3D usado en PainPointsSection necesita imagenes
- **Decision:** Agregar props `image?: string` e `imageOpacity?: number` a Card3D
- **Confianza:** 0.99
- **Validado en:** Build passed, visual verification

### D036: Imagen 4.0 API Migration
- **Contexto:** gemini-2.5-flash-image-preview deprecado
- **Decision:** Migrar a imagen-4.0-generate-001 via SDK v2 (google.genai)
- **Confianza:** 0.99
- **Validado en:** 4 imagenes generadas exitosamente

---

## Session: 2026-01-19 Voice Agent Implementation

### D037: useRef para Callbacks en useSpeechRecognition
- **Contexto:** El recognition se recreaba constantemente porque las callbacks estaban en las dependencias del useEffect
- **Decision:** Usar useRef para almacenar callbacks, actualizar refs en useEffects separados
- **Confianza:** 0.99
- **Validado en:** Bug fix - microfono funcionando en Chrome

### D038: Text Input Fallback
- **Contexto:** Web Speech API no funciona en Brave (bloqueada por privacidad)
- **Decision:** Agregar input de texto en TranscriptWindow como fallback universal
- **Confianza:** 0.99
- **Validado en:** User testing - funciona en todos los navegadores

### D039: Fallbacks Contextuales por Funcion
- **Contexto:** OpenAI a veces retorna function calls sin contenido de texto
- **Decision:** Agregar descripciones especificas por funcion (service_index -> descripcion)
- **Confianza:** 0.95
- **Validado en:** User testing - explicaciones detalladas de servicios

### D040: System Prompt con Indices de Servicios
- **Contexto:** El bot necesita saber que indice usar para cada servicio
- **Decision:** Documentar indices 0-3 en system prompt con descripciones completas
- **Confianza:** 0.99
- **Validado en:** Function calling correcto para open_service_modal

### D041: Mic Pause/Resume Toggle
- **Contexto:** Usuario necesita poder pausar el microfono sin cerrar el chat
- **Decision:** Agregar boton toggle en footer de TranscriptWindow + estado isListeningPaused
- **Confianza:** 0.95
- **Validado en:** User request implementado

### D042: Auto Tip para Mic Issues
- **Contexto:** Usuarios en navegadores sin soporte no saben que usar texto
- **Decision:** Mostrar tip despues de 8 segundos en estado listening sin captura
- **Confianza:** 0.95
- **Validado en:** Visual verification

---

## Session: 2026-01-19 AI Chat Enhancement

### D043: Whisper Fallback Automatico
- **Contexto:** Web Speech API falla con "network error" en algunos navegadores/redes
- **Decision:** Implementar fallback automatico a OpenAI Whisper cuando Web Speech falla
- **Confianza:** 0.99
- **Validado en:** User testing - funciona cuando Web Speech no disponible

### D044: Transcripcion Periodica en Whisper
- **Contexto:** Whisper no ofrece transcripcion en tiempo real como Web Speech API
- **Decision:** Implementar `transcribePartial()` cada 2.5 segundos durante grabacion
- **Confianza:** 0.95
- **Validado en:** User feedback - transcripcion visible mientras habla

### D045: Textarea Auto-resize
- **Contexto:** Mensajes largos se cortaban en el input fijo
- **Decision:** Cambiar de `input` a `textarea` con auto-resize y max-height 150px
- **Confianza:** 0.99
- **Validado en:** User request - mensajes largos visibles completos

### D046: Indicadores Visuales de Modo
- **Contexto:** Usuario necesita saber que modo de reconocimiento esta activo
- **Decision:** LED verde para Web Speech API, LED rojo para Whisper fallback
- **Confianza:** 0.95
- **Validado en:** Visual verification

### D047: useRef para Transcription State
- **Contexto:** Multiples refs necesarios para manejar estado de transcripcion
- **Decision:** Usar textareaRef, transcriptionIntervalRef, isTranscribingRef, mimeTypeRef
- **Confianza:** 0.99
- **Validado en:** Build passed, funcionalidad correcta

---

---

## Session: 2026-01-24 Mobile Chat IA Fixes

### D048: TTS para Todos los Inputs
- **Contexto:** TTS solo funcionaba para input de texto, no para voz
- **Decision:** Habilitar TTS en HeroAIChat para todos los inputs (voz y texto)
- **Confianza:** 0.99
- **Validado en:** User testing en iOS Safari y Android Chrome

### D049: Placeholder Oculto Durante Procesamiento
- **Contexto:** Placeholder visible detras del indicador "Procesando..."
- **Decision:** Agregar condicion `!isProcessing` al renderizado del placeholder
- **Confianza:** 0.99
- **Validado en:** Visual verification

### D050: Mobile Microphone MediaRecorder
- **Contexto:** Microfono no funcionaba en iOS Safari y algunos Android
- **Decision:** Usar MediaRecorder con mimeType correcto para cada plataforma
- **Confianza:** 0.95
- **Validado en:** Testing en iPhone (Safari) y Android (Chrome)

### D051: Placeholder Sin Padding Derecho
- **Contexto:** Placeholder se truncaba innecesariamente en movil
- **Decision:** Remover pr-28 del placeholder, usar solo left padding
- **Confianza:** 0.99
- **Validado en:** Visual verification en viewport movil

---

## Decisiones Pendientes

Ninguna decision pendiente de validacion.

---

**Ultima actualizacion:** 2026-01-24T18:15:00Z
