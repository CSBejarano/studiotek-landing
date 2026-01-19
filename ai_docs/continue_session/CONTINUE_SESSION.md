# CONTINUE SESSION - StudioTek Landing

## Quick Context

**Proyecto:** StudioTek Landing Page
**Stack:** Next.js 16 + React 19 + Tailwind 4 + TypeScript
**Estado:** IDLE - LANDING COMPLETE + AI CHAT ENHANCED
**Production URL:** https://studiotek-landing-fsw63i0gi-csbejaranos-projects.vercel.app
**GitHub:** https://github.com/CSBejarano/studiotek-landing

## Ultimo Workflow

| Campo | Valor |
|-------|-------|
| ID | `2026-01-19_ai-chat-enhancement` |
| Estado | COMPLETE |
| Duracion | ~90 minutos |
| Resultado | AI Chat con reconocimiento hibrido de voz |

## AI Chat Enhancement - Nueva Feature

### Arquitectura de Reconocimiento Hibrido
```
User Click Mic -> Web Speech API (GREEN LED)
       |
       v
  Network Error?
       |
  YES  v  NO
       |   |
       v   v
    Whisper    Real-time
    Fallback   Transcription
   (RED LED)
       |
       v
Periodic Transcription (2.5s intervals)
       |
       v
Expandable Textarea (max 150px)
```

### Cambios Principales

| Archivo | Cambio |
|---------|--------|
| `app/api/voice/stt/route.ts` | **NUEVO** - Endpoint Whisper STT |
| `components/ui/ai-chat-input.tsx` | **REESCRITO** - Hibrido + Expandable |

### Features Nuevas
- **Whisper Fallback:** Auto-activacion cuando Web Speech falla (network error)
- **Visual Indicators:** Verde = Web Speech, Rojo = Whisper
- **Real-time Whisper:** `transcribePartial()` cada 2.5 segundos
- **Expandable Input:** Textarea con max-height 150px
- **UI Centering:** Input y placeholder centrados en contenedor

### Refs Clave en ai-chat-input.tsx
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null);
const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);
const isTranscribingRef = useRef(false);
const mimeTypeRef = useRef<string>('audio/webm');
```

## APIs de Voz

| Endpoint | Modelo | Uso |
|----------|--------|-----|
| POST /api/voice/chat | gpt-4o-mini | Chat + Function Calling |
| POST /api/voice/tts | tts-1 (onyx) | Text-to-Speech |
| POST /api/voice/stt | whisper-1 | Speech-to-Text (Whisper) |

## Git - Ultimo Commit

```
f728e1e feat: enhance AI chat with hybrid voice recognition and expandable input
```

## Stack de Integraciones

| Servicio | Estado | Modelos |
|----------|--------|---------|
| OpenAI | ACTIVO | gpt-4o-mini, tts-1, whisper-1 |
| Supabase | ACTIVO | Leads database |
| Gemini | ACTIVO | imagen-4.0 (15 imgs) |
| Vercel | ACTIVO | Hosting |
| GitHub | ACTIVO | Repo |
| Resend | PENDIENTE | Emails |

## PRD Progress

- [x] PHASE 1-10: Landing completa
- [x] Apple Cards Carousel + Modal Navigation
- [x] Cookie Banner + RGPD Compliance
- [x] Supabase Leads Integration
- [x] Images: Benefits (3) + HowItWorks (6) + PainPoints (4)
- [x] Voice Agent con Function Calling
- [x] **AI Chat Enhanced** - NUEVO

## Domain Experts

| Agente | Version | Tasks |
|--------|---------|-------|
| @frontend | 1.28 | 52 |
| @backend | 1.3 | 6 |
| @infra | 1.4 | 7 |
| @testing | 1.0 | 4 |

## Nuevas Decisiones

- D043: Whisper fallback automatico cuando Web Speech falla con network error
- D044: Transcripcion periodica cada 2.5s en modo Whisper
- D045: Textarea auto-resize con max-height 150px
- D046: Indicadores visuales: verde (Web Speech) / rojo (Whisper)

## Pendientes

Ninguno critico. Proyecto funcionalmente completo con AI chat mejorado.

### Opcional (Futuro)
- Configurar Resend para emails
- Google Analytics
- Dashboard de leads

## Comandos Utiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Deploy
vercel deploy --prod
```

## Referencias

- Production: https://studiotek-landing-fsw63i0gi-csbejaranos-projects.vercel.app
- GitHub: https://github.com/CSBejarano/studiotek-landing

---

**AI Chat Enhanced - Hybrid Voice Recognition + Whisper Fallback + Expandable Input**

**Ultima actualizacion:** 2026-01-19T15:30:00Z
