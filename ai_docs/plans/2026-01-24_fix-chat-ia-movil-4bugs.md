# Plan de Ejecucion: Fix Chat IA Movil StudioTek v2 - 4 Bugs

> **Generado:** 2026-01-24
> **Issue:** N/A
> **Mode:** FAST
> **Complejidad:** 3/10

## Variables

```yaml
workflow_id: "2026-01-24_fix-chat-ia-movil-4bugs"
branch: feature/fix-chat-mobile-4bugs
domain: frontend
files_affected:
  - components/ui/ai-chat-input.tsx
  - components/ui/HeroAIChat.tsx
```

## Purpose

Corregir 4 bugs identificados en el chat IA movil de StudioTek v2:

1. **TTS iOS** - Text-to-Speech no funciona en iOS Safari
2. **Indicadores superpuestos** - Los indicadores de estado (Escuchando, Transcribiendo, Procesando) se superponen durante transiciones
3. **Procesando visible** - El indicador "Procesando..." permanece visible cuando no deberia
4. **Input no resetea** - El campo de input no se limpia despues de enviar un mensaje por voz

## TDD Test Plan

Dado que este es un fix de UI/UX para movil, los tests son principalmente manuales:

### Tests Automatizables (Build Validation)
```bash
# 1. Build debe pasar sin errores
npm run build

# 2. Lint debe pasar
npm run lint
```

### Tests Manuales Requeridos

| Test | Steps | Expected |
|------|-------|----------|
| Indicadores no overlap | 1. Iniciar grabacion 2. Detener 3. Observar transicion | Solo 1 indicador visible a la vez |
| Processing desaparece | 1. Enviar mensaje 2. Esperar respuesta | "Procesando..." desaparece al recibir respuesta |
| Input reset | 1. Grabar mensaje 2. Ver transcript en input 3. Mensaje enviado | Input queda vacio |
| TTS iOS | 1. Abrir en Safari iOS 2. Enviar mensaje 3. Esperar respuesta | Audio TTS se reproduce |

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | No | Sin cambios de autorizacion |
| A02 | Cryptographic Failures | No | Sin manejo de datos sensibles |
| A03 | Injection | No | Sin nuevos inputs de usuario |
| A04 | Insecure Design | No | Solo UI/UX fixes |
| A05 | Security Misconfiguration | No | Sin cambios de config |
| A06 | Vulnerable Components | No | Sin nuevas dependencias |
| A07 | Auth Failures | No | Sin cambios de auth |
| A08 | Software/Data Integrity | No | Sin cambios de integridad |
| A09 | Logging Failures | No | Sin cambios de logging |
| A10 | SSRF | No | Sin requests server-side nuevos |

## Architectural Review

**Verdict Inicial:** APPROVED - Cambios minimos y localizados

### Analisis de Impacto

1. **ai-chat-input.tsx**: Refactorizacion interna de AnimatePresence - no afecta API publica
2. **HeroAIChat.tsx**: Nuevo metodo de playback TTS - compatible hacia atras

### Patrones Aplicados

- **SL055**: Single AnimatePresence con computed status key (nuevo)
- **SL054**: Web Audio API para TTS iOS (nuevo)
- **SL048**: Voice agent hook pattern (existente)

## Code Structure

### CREATE:
- Ninguno

### MODIFY:
- `components/ui/ai-chat-input.tsx`
  - Lineas 549-612: Refactorizar 5 AnimatePresence en 1
  - Lineas 149-155: Agregar setValue('') en onend
  - Lineas 280-284: Agregar setValue('') en transcribeWithWhisper

- `components/ui/HeroAIChat.tsx`
  - Agregar funcion playAudioViaWebAudio (~30 lineas)
  - Lineas 127-157: Reemplazar Audio() con playAudioViaWebAudio()

### TESTS:
- Verificacion manual en iOS Safari

## WORKFLOW

### Phase 1: Fix Status Indicators Overlap

**Agent:** @frontend
**Duracion estimada:** 15 min

1. Abrir `components/ui/ai-chat-input.tsx`
2. Agregar tipo StatusType y useMemo para currentStatus
3. Crear objeto statusConfig con configuracion de cada estado
4. Reemplazar 5 AnimatePresence por 1 con mode="wait"
5. Verificar build: `npm run build`

### Phase 2: Fix Input Reset After Voice

**Agent:** @frontend
**Duracion estimada:** 5 min

1. En mismo archivo `ai-chat-input.tsx`
2. Localizar recognition.onend (~linea 149)
3. Agregar `setValue('')` y `transcriptRef.current = ''` despues de onVoiceEnd
4. Localizar transcribeWithWhisper (~linea 280)
5. Agregar mismos resets despues de onVoiceEnd
6. Verificar build: `npm run build`

### Phase 3: Fix TTS iOS Playback

**Agent:** @frontend
**Duracion estimada:** 20 min

1. Abrir `components/ui/HeroAIChat.tsx`
2. Agregar funcion playAudioViaWebAudio con useCallback
3. Reemplazar bloque Audio() (lineas ~127-157) con llamada a playAudioViaWebAudio
4. Eliminar codigo de Audio element no usado
5. Verificar build: `npm run build`

### Phase 4: Visual Verification

**Agent:** @testing
**Duracion estimada:** 10 min

1. Ejecutar `npm run dev`
2. Probar flujo de voz en browser
3. Verificar transiciones de indicadores
4. Verificar input reset
5. (Opcional) Probar en dispositivo iOS

### Phase FINAL: Code Review

**Agent:** @gentleman
**Duracion estimada:** 5 min

1. Revisar cambios en ambos archivos
2. Verificar adherencia a patrones del proyecto
3. Emitir verdict

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Web Audio API no soportado en algun browser | Medio | Bajo | Fallback a Audio element si decodeAudioData falla |
| AnimatePresence refactor rompe animaciones | Bajo | Medio | mode="wait" asegura secuencia correcta |
| setValue timing incorrecto | Bajo | Bajo | Reset inmediato despues de callback |
| MP3 no decodifica en Web Audio iOS | Medio | Bajo | TTS API devuelve MP3 estandar, bien soportado |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | 1 | Build exitoso | `npm run build` |
| CP2 | 2 | Build exitoso | `npm run build` |
| CP3 | 3 | Build exitoso | `npm run build` |
| CP4 | 4 | Dev server funciona | `npm run dev` |
| CP5 | FINAL | Code review aprobado | Manual |

## Decisiones a Registrar

```yaml
- id: "SL054"
  context: "TTS iOS playback"
  decision: "Usar Web Audio API (decodeAudioData + BufferSource) en lugar de Audio element"
  rationale: "iOS Safari bloquea Audio.play() fuera del call stack del user gesture; Web Audio API con AudioContext desbloqueado funciona"
  confidence: 0.95
  tags: ["ios", "safari", "tts", "web-audio-api", "mobile"]

- id: "SL055"
  context: "Multiple status indicators with transitions"
  decision: "Usar single AnimatePresence mode='wait' con computed status key"
  rationale: "Multiples AnimatePresence causan overlap de animaciones; single container con key asegura solo 1 visible"
  confidence: 0.95
  tags: ["framer-motion", "animatepresence", "status", "ui", "transitions"]
```

## Notas Adicionales

- Bug 3 (Procesando visible) se resuelve automaticamente con el fix de Bug 2 - al usar single AnimatePresence, no hay posibilidad de overlap
- El fix de TTS iOS tambien mejora la experiencia en otros browsers al usar un approach mas consistente
- Se mantienen los logs de debug ([TTS], [Audio]) para facilitar troubleshooting futuro

---

**Version:** 1.0 | **Autor:** /plan-task v5.0
