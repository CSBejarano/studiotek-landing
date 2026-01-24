# Plan de Ejecucion: Fix Microfono Movil Landing StudioTek

> **Generado:** 2026-01-24
> **Issue:** #0 (interno)
> **Mode:** FAST
> **Complejidad:** 4/10

## Variables

```yaml
workflow_id: "2026-01-24_fix-microfono-movil-studiotek"
branch: "fix/mobile-microphone"
domain: frontend
primary_agent: "@frontend"
```

## Purpose

Corregir problemas de funcionamiento del microfono en dispositivos moviles (iOS Safari, Android Chrome) para la landing page de StudioTek. Los problemas identificados incluyen:

1. **Web Speech API no funciona en iOS Safari** - Requiere fallback a Whisper API
2. **MIME type incompatible** - iOS Safari no soporta audio/webm, requiere audio/mp4
3. **Web Speech API bugs** - continuous=true causa problemas en iOS Safari
4. **Touch delays** - Falta touch-action: manipulation para respuesta inmediata
5. **Sin recovery de background** - No se maneja visibilitychange

## Solucion Principal

El hook `useSpeechRecognition.ts` actualmente solo usa Web Speech API, que tiene soporte muy limitado en moviles. La solucion es agregar un fallback automatico a Whisper API (via `/api/voice/stt`) usando MediaRecorder, similar a como ya funciona en `ai-chat-input.tsx`.

## TDD Test Plan

### Build Validation
```bash
npm run build 2>&1 | grep -c "error" | grep -q "0" && echo "BUILD_PASS" || echo "BUILD_FAIL"
npm run lint
```

### Manual Test Cases

| ID | Dispositivo | Pasos | Esperado |
|----|-------------|-------|----------|
| TC1 | iPhone + Safari | Tap VoiceButton, aceptar permiso, hablar | Transcript visible |
| TC2 | Android + Chrome | Tap VoiceButton, aceptar permiso, hablar | Web Speech o Whisper funciona |
| TC3 | Cualquier movil | Denegar permiso microfono | Mensaje de error claro |
| TC4 | Cualquier movil | Iniciar, minimizar app, volver | Recovery automatico |
| TC5 | Cualquier movil | Tap rapido en VoiceButton | Sin delay 300ms |

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | No | N/A - Solo UI |
| A02 | Cryptographic Failures | No | N/A - No secrets |
| A03 | Injection | No | React escapa texto |
| A04 | Insecure Design | No | Permisos via browser |
| A05-A10 | Otros | No | N/A |

## Architectural Review

**Verdict:** PENDING (to be reviewed in Phase 8)

La solucion sigue los patrones establecidos en el proyecto:
- Hooks para logica reutilizable (useSpeechRecognition)
- Context para estado global (VoiceAgentProvider)
- Componentes con 'use client' para interaccion

## Code Structure

### MODIFY:
- `hooks/useSpeechRecognition.ts` - Deteccion iOS, fix continuous mode
- `components/ui/ai-chat-input.tsx` - MIME type chain, getUserMedia constraints
- `components/voice/VoiceButton.tsx` - Touch optimization
- `components/voice/VoiceAgent.tsx` - Visibility change handler
- `app/globals.css` - touch-action utility class

### CREATE:
(Ninguno - todo inline en archivos existentes)

### TESTS:
- Build validation via npm run build
- Lint validation via npm run lint

## WORKFLOW

### Phase 1: Mobile Detection + Whisper Fallback Infrastructure
**Agent:** @frontend
**Objetivo:** Agregar deteccion de moviles y preparar infraestructura para Whisper fallback

**Archivos:**
- MODIFY: hooks/useSpeechRecognition.ts

**Tareas:**
1. Agregar funcion `isMobileDevice()` que detecta dispositivos moviles:
   ```typescript
   const isMobileDevice = (): boolean => {
     if (typeof window === 'undefined') return false;
     const ua = navigator.userAgent;
     return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
            (navigator.maxTouchPoints > 0 && /Macintosh/.test(ua)); // iPad iPadOS
   };
   ```
2. Agregar funcion `isIOSSafari()` para deteccion especifica de iOS Safari
3. Agregar state y refs para Whisper mode:
   - `isWhisperMode: boolean`
   - `mediaRecorderRef: MediaRecorder | null`
   - `streamRef: MediaStream | null`
   - `audioChunksRef: Blob[]`
4. Modificar configuracion de recognition para usar `continuous: !isIOSSafari()`

**Checkpoint:**
```bash
grep -E "isMobileDevice|isWhisperMode|iOS" hooks/useSpeechRecognition.ts | head -10
```

---

### Phase 2: Implement Whisper Recording Functions
**Agent:** @frontend
**Objetivo:** Implementar funciones de grabacion y transcripcion via Whisper API

**Archivos:**
- MODIFY: hooks/useSpeechRecognition.ts

**Tareas:**
1. Agregar funcion `getSupportedMimeType()` con cadena de fallback:
   ```typescript
   const getSupportedMimeType = (): string => {
     const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'];
     for (const type of types) {
       if (MediaRecorder.isTypeSupported(type)) return type;
     }
     return 'audio/webm';
   };
   ```
2. Agregar funcion `transcribeWithWhisper(audioBlob: Blob)`:
   - Enviar a /api/voice/stt
   - Retornar transcripcion o null
3. Agregar funcion `startWhisperListening()`:
   - getUserMedia con constraints movil-friendly
   - Iniciar MediaRecorder
   - Manejar ondataavailable, onstop, onerror
4. Agregar funcion `stopWhisperListening()`:
   - Detener MediaRecorder
   - Transcribir audio acumulado

**Checkpoint:**
```bash
grep -E "startWhisperListening|transcribeWithWhisper|getSupportedMimeType" hooks/useSpeechRecognition.ts
```

---

### Phase 3: Integrate Whisper Fallback in useSpeechRecognition
**Agent:** @frontend
**Objetivo:** Modificar funciones principales para usar Whisper cuando corresponda

**Archivos:**
- MODIFY: hooks/useSpeechRecognition.ts

**Tareas:**
1. Modificar `startListening()`:
   - Si `isWhisperMode` es true, llamar `startWhisperListening()`
   - Sino, usar Web Speech API (comportamiento actual)
2. Modificar `stopListening()`:
   - Si `isWhisperMode` es true, llamar `stopWhisperListening()`
   - Sino, usar Web Speech API (comportamiento actual)
3. En el handler `onerror` de recognition:
   - Si error es 'network', cambiar a modo Whisper y reiniciar
4. En useEffect inicial:
   - Si es iOS Safari, activar Whisper mode por defecto
5. Agregar `isWhisperMode` al return del hook
6. Agregar cleanup de MediaStream y MediaRecorder en useEffect return

**Checkpoint:**
```bash
grep -E "isWhisperMode|startWhisperListening" hooks/useSpeechRecognition.ts | head -10
```

---

### Phase 4: Touch Optimization
**Agent:** @frontend
**Objetivo:** Eliminar delay de 300ms en taps de VoiceButton

**Archivos:**
- MODIFY: components/voice/VoiceButton.tsx
- MODIFY: app/globals.css

**Tareas:**
1. Agregar `touch-action: manipulation` al button
2. Agregar clase CSS `.touch-optimize` con touch-action
3. Asegurar que el area de tap es suficiente (48x48 minimo segun a11y)

**Checkpoint:**
```bash
grep "touch-action" components/voice/VoiceButton.tsx app/globals.css
```

---

### Phase 5: Visibility Change Handler
**Agent:** @frontend
**Objetivo:** Manejar transiciones background/foreground en movil

**Archivos:**
- MODIFY: components/voice/VoiceAgent.tsx

**Tareas:**
1. Agregar useEffect con listener para `visibilitychange`
2. Cuando document.hidden = true, pausar listening
3. Cuando document.hidden = false y isActive, reiniciar listening
4. Cleanup del listener en unmount

**Checkpoint:**
```bash
grep "visibilitychange" components/voice/VoiceAgent.tsx
```

---

### Phase 6: Build Validation
**Agent:** @testing
**Objetivo:** Verificar que todos los cambios compilan sin errores

**Checkpoint:**
```bash
npm run build && npm run lint
```
**Expected:** No errors or warnings

---

### Phase 7: Update Expert Memory
**Agent:** @frontend
**Objetivo:** Documentar decisiones tomadas

**Archivos:**
- MODIFY: ai_docs/expertise/domain-experts/frontend.yaml

**Tareas:**
Agregar decisiones:
- SL051: Mobile audio MIME type detection
- SL052: Mobile speech recognition configuration
- SL053: Touch optimization for voice button

---

### Phase 8: Code Review
**Agent:** @gentleman
**Objetivo:** Review arquitectonico final

**Checkpoint:**
```bash
echo "APPROVED"
```

**Criterios:**
- [ ] TypeScript sin errores
- [ ] Patrones consistentes con codebase
- [ ] Accesibilidad mantenida
- [ ] Sin regresiones de funcionalidad desktop

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| iOS MIME incompatibility | High | Medium | Cadena de fallback robusta |
| Continuous mode bugs iOS | Medium | High | Deshabilitar en iOS Safari |
| Permission denied UX | Low | Medium | Mensajes de error claros |
| Battery drain | Low | Low | Solo activo cuando usuario lo activa |
| Background stop | Medium | Medium | Visibility change handler |

## Checkpoints Summary

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| 1 | Mobile Detection | iOS detection en hook | `grep "iOS" hooks/useSpeechRecognition.ts` |
| 2 | MIME Type | mp4 fallback presente | `grep "audio/mp4" components/ui/ai-chat-input.tsx` |
| 3 | getUserMedia | Constraints optimizados | `grep "sampleRate" components/ui/ai-chat-input.tsx` |
| 4 | Touch | touch-action presente | `grep "touch-action" components/voice/VoiceButton.tsx` |
| 5 | Visibility | Handler presente | `grep "visibilitychange" components/voice/VoiceAgent.tsx` |
| 6 | Build | Compilacion exitosa | `npm run build` |
| 7 | Memory | Decisiones documentadas | `grep "SL051" ai_docs/expertise/domain-experts/frontend.yaml` |
| 8 | Review | Aprobacion | Manual |

---

**Generado por:** /plan-task v5.0
**Fecha:** 2026-01-24
