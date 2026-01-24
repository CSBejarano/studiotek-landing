# Plan de Ejecucion: Agente de Voz IA con Function Calling

> **Generado:** 2026-01-19
> **Issue:** N/A
> **Mode:** FULL
> **Complejidad:** 8/10

## Variables

```yaml
workflow_id: "2026-01-19_voice-agent-ia-function-calling"
branch: "feature/voice-agent"
domain: "multi-domain (frontend + backend)"
estimated_time: "3-4 horas"
agents_involved:
  - "@frontend"
  - "@backend"
  - "@security-reviewer"
  - "@gentleman"
```

## Purpose

Implementar un agente de voz con IA que permita a los usuarios interactuar con la landing page de StudioTek mediante comandos de voz. El agente podra:

1. **Activarse/desactivarse** con un boton flotante elegante
2. **Escuchar** comandos de voz del usuario (Web Speech API)
3. **Responder** con voz masculina (OpenAI TTS - voz "onyx")
4. **Navegar** por la pagina de forma autonoma
5. **Rellenar** el formulario de contacto
6. **Mostrar** transcripcion en tiempo real

El objetivo es crear una experiencia inmersiva que guie a los visitantes y los convierta en leads cualificados.

## TDD Test Plan

Dado que el proyecto no tiene framework de testing configurado (no Jest/Vitest), las pruebas seran manuales con checkpoints verificables:

### Unit Tests (Verificacion Manual)

1. **VoiceAgentContext**
   - [ ] Provider renderiza children
   - [ ] Estado inicial: isActive=false, voiceState='idle'
   - [ ] toggleActive cambia isActive

2. **useSpeechRecognition**
   - [ ] isSupported=false en navegadores sin soporte
   - [ ] startListening inicia reconocimiento
   - [ ] transcript se actualiza con speech

3. **Function Handlers**
   - [ ] navigate_to_section scrollea correctamente
   - [ ] fill_form_field actualiza input
   - [ ] highlight_element agrega clase

### Integration Tests (Manual en Browser)

1. **Flujo completo**
   - [ ] Click en boton -> ventana aparece
   - [ ] Hablar -> transcripcion visible
   - [ ] Respuesta -> audio se reproduce
   - [ ] Comando -> accion ejecutada

2. **Error handling**
   - [ ] Sin microfono -> mensaje de error
   - [ ] Sin API key -> degradacion graceful
   - [ ] Navegador no soportado -> warning

### E2E Checklist

```bash
# Verificar build
npm run build

# Verificar lint
npm run lint

# Test manual en browser
npm run dev
# 1. Abrir http://localhost:3000
# 2. Click en boton de voz
# 3. Permitir microfono
# 4. Decir "Llevame a servicios"
# 5. Verificar scroll
# 6. Decir "Rellena mi nombre con Juan"
# 7. Verificar formulario
```

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | No | Landing sin auth, function calls read-only |
| A02 | Cryptographic Failures | Si | API keys solo server-side via env vars |
| A03 | Injection | Si | React escapa texto, system prompt con limites |
| A04 | Insecure Design | Si | Rate limiting, no auto-submit |
| A05 | Security Misconfiguration | Si | Errores genericos al cliente |
| A06 | Vulnerable Components | Si | npm audit antes de deploy |
| A07 | Auth Failures | No | N/A - landing publica |
| A08 | Data Integrity | No | Function calls server-generated |
| A09 | Logging Failures | Si | Logging basico en API routes |
| A10 | SSRF | No | Sin URLs controladas por usuario |

## Architectural Review

### Decisiones de Arquitectura

1. **Context + Hook Pattern**
   - VoiceAgentProvider maneja estado global
   - useVoiceAgent expone API limpia a componentes
   - Separacion clara de responsabilidades

2. **Web Speech API + OpenAI TTS**
   - STT: Web Speech API (nativo, gratis, buena precision)
   - TTS: OpenAI API (voz "onyx" masculina, alta calidad)
   - Fallback: browser speechSynthesis si TTS falla

3. **Function Calling Architecture**
   - Definiciones en lib/voice/functions.ts
   - Handlers en lib/voice/functionHandlers.ts
   - Ejecutados client-side para interaccion con DOM

4. **State Machine**
   ```
   idle -> listening -> processing -> speaking -> listening
     ^                                              |
     +----------------------------------------------+
     ^
     +--- error (timeout 3s) ---> idle
   ```

### Verdict Inicial: APPROVED (pending implementation)

## Code Structure

### CREATE

```
lib/voice/
  types.ts              # Tipos TypeScript
  prompts.ts            # System prompt del agente
  functions.ts          # Definiciones de function calls
  functionHandlers.ts   # Implementacion de handlers

components/voice/
  VoiceAgentProvider.tsx  # Context provider
  VoiceButton.tsx         # Boton flotante
  TranscriptWindow.tsx    # Ventana de chat
  VoiceAgent.tsx          # Orquestador principal

hooks/
  useVoiceAgent.ts        # Hook publico
  useSpeechRecognition.ts # Wrapper Web Speech API

app/api/voice/
  chat/route.ts           # OpenAI chat endpoint
  tts/route.ts            # OpenAI TTS endpoint
```

### MODIFY

```
app/layout.tsx          # Agregar VoiceAgentProvider
app/page.tsx            # Agregar VoiceAgent component
app/globals.css         # Agregar .voice-highlight animation
components/sections/
  ContactForm.tsx       # Agregar name attributes a inputs
  Services.tsx          # Agregar listener para modal
```

### TESTS

```
# Manual testing checklist en browser
# Ver seccion TDD Test Plan
```

## WORKFLOW

### Fase 1: Foundation - Types, Context and Hook
**Agent:** @frontend
**Duration:** ~30 min

Crear la base del sistema:
1. Tipos TypeScript en `lib/voice/types.ts`
2. System prompt en `lib/voice/prompts.ts`
3. Context provider en `components/voice/VoiceAgentProvider.tsx`
4. Hook publico en `hooks/useVoiceAgent.ts`

**Checkpoint:** `npm run build` sin errores

### Fase 2: VoiceButton Component
**Agent:** @frontend
**Duration:** ~20 min

Crear boton flotante con:
- Posicion fixed bottom-right
- Estados visuales (idle, listening, processing, speaking, error)
- Animaciones Framer Motion

**Checkpoint:** Boton visible en pagina

### Fase 3: TranscriptWindow Component
**Agent:** @frontend
**Duration:** ~25 min

Crear ventana de chat con:
- Estilo glassmorphism
- Mensajes con scroll
- Animaciones entrada/salida

**Checkpoint:** Ventana muestra mensajes correctamente

### Fase 4: Speech Recognition Hook
**Agent:** @frontend
**Duration:** ~25 min

Wrapper para Web Speech API:
- Deteccion de soporte
- Manejo de permisos
- Transcripcion en tiempo real

**Checkpoint:** Hook funciona en Chrome

### Fase 5: API Routes - Chat and TTS
**Agent:** @backend
**Duration:** ~40 min

Crear endpoints:
- `/api/voice/chat` - Procesar mensajes con OpenAI
- `/api/voice/tts` - Generar audio con OpenAI TTS
- Definiciones de functions para function calling

**Checkpoint:** curl test pasa

### Fase 6: Function Handlers Implementation
**Agent:** @frontend
**Duration:** ~30 min

Implementar handlers:
- navigate_to_section
- highlight_element
- fill_form_field
- open_service_modal
- submit_contact_form

**Checkpoint:** Funciones ejecutan correctamente

### Fase 7: VoiceAgent Orchestrator
**Agent:** @frontend
**Duration:** ~35 min

Crear orquestador que coordina:
- Speech recognition
- API calls
- TTS playback
- Function execution

**Checkpoint:** Flujo completo funciona

### Fase 8: Integration
**Agent:** @frontend
**Duration:** ~20 min

Integrar en app:
- VoiceAgentProvider en layout.tsx
- VoiceAgent en page.tsx
- Ajustes a ContactForm y Services

**Checkpoint:** `npm run build` exitoso

### Fase 9: Security Review
**Agent:** @security-reviewer
**Duration:** ~20 min

Verificar OWASP checklist completo

**Checkpoint:** Sin vulnerabilidades criticas

### Fase 10: Final Code Review
**Agent:** @gentleman
**Duration:** ~15 min

Review arquitectonico y calidad de codigo

**Checkpoint:** APPROVED

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Browser no soporta Web Speech | Alto | Medio | Feature detection + warning UI |
| Usuario deniega microfono | Alto | Medio | UI clara para permisos |
| OpenAI API rate limit | Medio | Bajo | Retry con backoff |
| Costo excesivo de TTS | Medio | Bajo | Rate limiting, max length |
| Mobile UX pobre | Medio | Medio | Responsive design, touch-friendly |
| Memory leaks audio | Medio | Medio | Cleanup en useEffect |
| Prompt injection | Bajo | Bajo | System prompt boundaries |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| 1 | Foundation | Build pasa | `npm run build` |
| 2 | VoiceButton | Archivo existe | `ls components/voice/VoiceButton.tsx` |
| 3 | TranscriptWindow | Archivo existe | `ls components/voice/TranscriptWindow.tsx` |
| 4 | Speech Hook | Archivo existe | `ls hooks/useSpeechRecognition.ts` |
| 5 | API Routes | Directorios existen | `ls app/api/voice/` |
| 6 | Function Handlers | Funciones definidas | `grep navigate_to_section lib/voice/` |
| 7 | Orchestrator | Archivo existe | `ls components/voice/VoiceAgent.tsx` |
| 8 | Integration | Build completo | `npm run build` |
| 9 | Security | Review manual | OWASP checklist |
| 10 | Final | Build + Lint | `npm run build && npm run lint` |

## Environment Variables Required

```bash
# .env.local
OPENAI_API_KEY=sk-...  # Required for chat and TTS
```

## Dependencies Check

El proyecto ya tiene las dependencias necesarias:
- `framer-motion` - Animaciones
- `lucide-react` - Iconos (Mic, Volume2, etc.)
- `next` - App Router y API Routes
- `react` - UI framework

No se requieren nuevas dependencias para esta implementacion.

## Notes

- El agente usa Web Speech API que solo funciona en Chrome/Edge (Safari parcial, Firefox no soportado)
- TTS usa OpenAI API con costo por caracter (~$0.015/1000 chars)
- Function calls se ejecutan client-side para interaccion directa con DOM
- El formulario NO se envia automaticamente por seguridad (solo se prepara)

---

**Generado por:** /plan-task v5.0
**Siguiente paso:** Ejecutar con `/ralph-execute`
