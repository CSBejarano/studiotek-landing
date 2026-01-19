# CONTINUE SESSION - StudioTek Landing

## Quick Context

**Proyecto:** StudioTek Landing Page
**Stack:** Next.js 16 + React 19 + Tailwind 4 + TypeScript
**Estado:** IDLE - LANDING COMPLETE + VOICE AGENT
**Production URL:** https://studiotek-landing-fsw63i0gi-csbejaranos-projects.vercel.app
**GitHub:** https://github.com/CSBejarano/studiotek-landing

## Ultimo Workflow

| Campo | Valor |
|-------|-------|
| ID | `2026-01-19_voice-agent` |
| Estado | COMPLETE |
| Duracion | ~30 minutos |
| Resultado | Voice Agent con function calling |

## Voice Agent - Nueva Feature

### Arquitectura
```
Speech -> Web Speech API -> OpenAI Chat -> Function Calling -> TTS -> Audio
```

### Componentes Principales
- **VoiceAgent.tsx** - Orquestador (listen -> process -> speak -> execute)
- **VoiceButton.tsx** - Boton flotante con estados visuales
- **TranscriptWindow.tsx** - Chat + input de texto fallback
- **useSpeechRecognition.ts** - Hook Web Speech API

### APIs
- **POST /api/voice/chat** - Chat con gpt-4o-mini + function calling
- **POST /api/voice/tts** - Text-to-speech con voz "onyx"

### Function Calling (5 funciones)
1. `navigate_to_section` - Scroll a secciones
2. `open_service_modal` - Abre modales (indices 0-3)
3. `highlight_element` - Resalta elementos
4. `fill_form_field` - Rellena formulario
5. `submit_contact_form` - Prepara envio

### Bugs Arreglados
- **Speech Recreation Bug:** useRef para callbacks evita recreacion constante
- **Generic Responses:** Fallbacks contextuales por funcion + prompt mejorado

### Features Extra
- Text input fallback (Brave/Firefox)
- Boton pausar/reanudar microfono
- Tip automatico si mic no funciona (8s)

## Archivos Creados (12)

```
components/voice/
├── VoiceAgent.tsx
├── VoiceButton.tsx
├── TranscriptWindow.tsx
└── VoiceAgentProvider.tsx

hooks/
├── useSpeechRecognition.ts
└── useVoiceAgent.ts

app/api/voice/
├── chat/route.ts
└── tts/route.ts

lib/voice/
├── types.ts
├── prompts.ts
├── functions.ts
└── functionHandlers.ts
```

## Stack de Integraciones

| Servicio | Estado | Uso |
|----------|--------|-----|
| OpenAI | ACTIVO | Chat + TTS + Function Calling |
| Supabase | ACTIVO | Base de datos leads |
| Gemini | ACTIVO | Generacion imagenes (15) |
| Vercel | ACTIVO | Hosting + Deploy |
| GitHub | ACTIVO | Repositorio |
| Resend | PENDIENTE | Emails |

## PRD Progress

- [x] PHASE 1-10: Landing completa
- [x] Apple Cards Carousel + Modal Navigation
- [x] Cookie Banner + RGPD Compliance
- [x] Supabase Leads Integration
- [x] Images: Benefits (3) + HowItWorks (6) + PainPoints (4)
- [x] Voice Agent con Function Calling - NUEVO

## Domain Experts

| Agente | Version | Tasks |
|--------|---------|-------|
| @frontend | 1.27 | 48 |
| @backend | 1.2 | 5 |
| @infra | 1.3 | 6 |
| @testing | 1.0 | 4 |

## Nuevas Decisiones

- D037: useRef para callbacks en useSpeechRecognition
- D038: Text input fallback para navegadores sin Web Speech API
- D039: Fallbacks contextuales por funcion en route.ts
- D040: System prompt detallado con indices de servicios

## Pendientes

Ninguno critico. Proyecto funcionalmente completo con voice agent.

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
- Supabase: [Tu proyecto en supabase.com]

---

**Voice Agent complete - Web Speech API + OpenAI Chat/TTS + Function Calling**

**Ultima actualizacion:** 2026-01-19T02:30:00Z
