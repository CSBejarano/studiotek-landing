# CLAUDE.md

StudioTek Landing - Next.js 16 landing page para StudioTek (agencia de automatización con IA).

## Ecosystem Context

Este proyecto es parte del ecosistema **StudioTek**:

| Proyecto | Rol | Ruta Local |
|----------|-----|------------|
| **StudioTek Landing** | Marca principal (este proyecto) | `~/Documents/GitHub/studiotek-landing` |
| **KairosAI Backend** | API & Lógica | `~/Documents/GitHub/ideas` |
| **KairosAI Frontend** | Dashboard SaaS | `~/Documents/GitHub/ideas-frontend` |
| **Vitaeon Landing** | Cliente KairosAI | `~/Documents/GitHub/vitaeon-landing` |
| **Mr. Champagne** | Cliente potencial | `~/Documents/GitHub/mr_champagne` |

### Relación con otros proyectos:
- **StudioTek → KairosAI**: La agencia vende el producto SaaS como servicio principal
- **StudioTek → Vitaeon/Mr.Champagne**: Proyectos de clientes implementados por la agencia

### Identidad Empresarial:
- **Visión**: Ser el referente en automatización empresarial con IA en el mercado hispanohablante
- **Misión**: Transformar la operativa de negocios mediante soluciones de IA que reduzcan costes y eliminen tareas manuales

---

## Node.js Version

**IMPORTANTE: Este proyecto requiere Node.js 22 (LTS).** El archivo `.nvmrc` especifica `22`.

Node 25+ **NO es compatible** y produce errores de `ERR_INVALID_PACKAGE_CONFIG` en node_modules.

```bash
# Si tienes Homebrew con node@22 instalado:
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# Si tienes nvm:
nvm use 22

# Verificar versión antes de trabajar:
node --version  # Debe mostrar v22.x.x
```

Si cambias de versión de Node, **debes reinstalar node_modules**:
```bash
rm -rf node_modules .next package-lock.json
npm install
```

---

## Commands

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev              # Servidor desarrollo (puerto 3000)

# Build y producción
npm run build            # Build producción
npm run start            # Servidor producción
npm run lint             # Linting
```

---

## Stack Tecnológico

- **Next.js 16.1.1** + **React 19.2.3** + TypeScript
- **Tailwind CSS v4** (última versión)
- **Framer Motion / Motion** (animaciones avanzadas)
- **OpenAI SDK** (asistente IA con GPT-4o mini)
- **Supabase** (base de datos para leads)
- **Resend** (envío de emails)
- **React Hook Form + Zod** (formularios con validación)
- **lucide-react** (iconos)

---

## Structure

```text
studiotek-landing/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing principal
│   ├── layout.tsx                # Layout raíz con metadata
│   ├── api/
│   │   ├── leads/route.ts        # API para captura de leads
│   │   ├── send-email/           # API envío de emails
│   │   └── voice/                # APIs del asistente IA
│   │       ├── chat/route.ts     # Chat con OpenAI + Function Calling
│   │       ├── tts/route.ts      # Text-to-Speech (voz onyx)
│   │       └── stt/route.ts      # Speech-to-Text (Whisper)
│   └── politica-*/               # Páginas legales (cookies, privacidad, etc.)
├── components/
│   ├── sections/                 # Secciones de la landing
│   │   ├── Hero.tsx              # Hero con AI Chat centrado
│   │   ├── Stats.tsx             # Métricas de éxito
│   │   ├── Benefits.tsx          # Beneficios de automatización
│   │   ├── HowItWorks.tsx        # Proceso de trabajo
│   │   ├── Services.tsx          # Carrusel de servicios
│   │   ├── ContactForm.tsx       # Formulario de contacto
│   │   ├── Header.tsx            # Navegación sticky
│   │   └── Footer.tsx            # Footer con links
│   ├── storytelling/             # Secciones narrativas
│   │   ├── PainPointsSection.tsx # "¿Te identificas?"
│   │   └── SolutionSection.tsx   # "¿Por qué automatizar?"
│   ├── voice/                    # Asistente IA (botón flotante + chat)
│   │   ├── VoiceAgent.tsx
│   │   ├── VoiceAgentProvider.tsx
│   │   ├── VoiceButton.tsx
│   │   └── TranscriptWindow.tsx
│   ├── ui/                       # Componentes UI base
│   │   ├── ai-chat-input.tsx     # Chat IA en Hero (reconocimiento híbrido)
│   │   └── HeroAIChat.tsx        # Wrapper con historial
│   ├── magicui/                  # Efectos visuales (particles, blur, etc.)
│   └── cookies/                  # Sistema de cookies RGPD
├── hooks/                        # Custom hooks
├── lib/                          # Utilidades (cn, etc.)
└── ai_docs/                      # Documentación del proyecto
    ├── state/                    # Estado y progreso
    ├── continue_session/         # Contexto para LLM
    └── plans/                    # Planes de implementación
```

---

## Key Components

| Componente | Descripción |
|------------|-------------|
| `Hero.tsx` | Hero principal con AI Chat en el centro debajo del logo |
| `ai-chat-input.tsx` | Chat IA con reconocimiento de voz híbrido (Web Speech API + Whisper fallback) |
| `PainPointsSection` | Sección "¿Te identificas?" - 2 puntos de dolor principales |
| `SolutionSection` | Sección "¿Por qué automatizar?" - Beneficios |
| `Services.tsx` | Carrusel de servicios de la agencia |
| `Stats.tsx` | Métricas de resultados de clientes |
| `ContactForm.tsx` | Formulario de leads con validación Zod |
| `CookieBanner` | Banner de cookies RGPD compliant |

---

## AI Chat Features

**Componente central**: Input de chat IA en el Hero (debajo del logo)

**Funcionalidades**:
- ✅ **Reconocimiento de voz híbrido**:
  - Web Speech API (primario) - indicador verde
  - OpenAI Whisper (fallback) - indicador rojo
- ✅ Input expandible (textarea auto-resize, max 150px)
- ✅ Placeholders rotativos animados
- ✅ Transcripción en tiempo real (cada 2.5s en modo Whisper)
- ✅ Botones: Micrófono, Enviar
- ✅ Estilo moderno con motion animations

**APIs de Voz**:
| Endpoint | Modelo | Uso |
|----------|--------|-----|
| `POST /api/voice/chat` | gpt-4o-mini | Chat + Function Calling |
| `POST /api/voice/tts` | tts-1 (onyx) | Text-to-Speech |
| `POST /api/voice/stt` | whisper-1 | Speech-to-Text |

---

## Secciones de la Landing

| Orden | Sección | Descripción |
|-------|---------|-------------|
| 1 | **Hero** | Logo + AI Chat centrado |
| 2 | **¿Te identificas?** | "Procesos manuales consumen horas...", "Datos sin explotar..." |
| 3 | **¿Por qué automatizar?** | Beneficios concretos de la automatización |
| 4 | **Servicios** | Carrusel de servicios de StudioTek |
| 5 | **Resultados** | Stats/métricas de éxito |
| 6 | **Cómo trabajamos** | Proceso de trabajo paso a paso |
| 7 | **Contacto** | Formulario de leads |
| 8 | **Otros proyectos** | Social proof con clientes |

---

## Company Context

**StudioTek** es una agencia de automatización de negocios con Inteligencia Artificial.

**Modelo de negocio:**
```text
StudioTek (Marca paraguas + Servicios)
├── KairosAI (Producto SaaS principal)
├── Servicios Custom (desarrollo a medida)
└── Consultoría IA (transformación digital)
```

**Servicios principales:**
1. Automatización de reservas (KairosAI)
2. Chatbots inteligentes (WhatsApp con IA)
3. Automatización de marketing
4. Integración de sistemas
5. Desarrollo de landing pages

---

## Related Projects

| Proyecto | Ruta | Relación |
|----------|------|----------|
| [KairosAI Backend](../ideas) | `~/Documents/GitHub/ideas` | Producto SaaS que vendemos |
| [KairosAI Frontend](../ideas-frontend) | `~/Documents/GitHub/ideas-frontend` | Dashboard del producto |
| [Vitaeon Landing](../vitaeon-landing) | `~/Documents/GitHub/vitaeon-landing` | Cliente activo (clínica) |
| [Mr. Champagne](../mr_champagne) | `~/Documents/GitHub/mr_champagne` | Cliente potencial (barbería) |

---

## URLs

- **Production**: https://studiotek.es (configurar)
- **GitHub**: https://github.com/CSBejarano/studiotek-landing

---

## Deploy

**Plataforma**: Vercel

**Variables de entorno requeridas**:
```env
# OpenAI (para asistente IA)
OPENAI_API_KEY=sk-...

# Supabase (para leads)
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...

# Resend (para emails)
RESEND_API_KEY=re_...
```

---

## Notas Importantes

1. **Asistente IA**: El chat en el Hero es el componente principal. Usa reconocimiento híbrido de voz.

2. **Cookies RGPD**: El banner de cookies guarda consentimiento en localStorage y DB.

3. **SEO**: Metadata configurada en `app/layout.tsx` con OpenGraph y Twitter cards.

4. **Responsive**: Diseño mobile-first, el AI chat se adapta a móviles con modo Whisper fallback.

5. **Performance**: Imágenes optimizadas con Next.js Image, lazy loading en secciones.

---

## Agentes y Skills de este Proyecto

>NOTA IMPORTANTE: SIEMPRE usarás a los agentes y skills de este proyecto para resolver TODAS las tareas.

**Agentes principales:** @frontend, @seo-expert, @marketing-expert, @aepd-consultant
**Skills principales:** `/nextjs`, `/react-19`, `/tailwind`, `/seo-toolkit`, `/studiotek-landing-enhancer`, `/marketing-content`, `/landing-image-generator`, `/aepd-privacidad`
**Referencia completa:** Ver `~/.claude/CLAUDE.md` para routing table y lista completa de agentes y skills.

### Ejemplos de uso en este proyecto

**Mejorar sección de la landing:**
```text
"Mejora la sección hero para móvil"
→ Task(subagent_type="frontend") con /studiotek-landing-enhancer + /tailwind
```

**Optimización SEO:**
```text
"Auditoría SEO completa de la landing"
→ Task(subagent_type="seo-expert") con /seo-toolkit (módulos: audit, meta tags, schema, Core Web Vitals)
```

**Contenido marketing:**
```text
"Crea un post de LinkedIn sobre los servicios de StudioTek"
→ Task(subagent_type="marketing-expert") con /marketing-content + /linkedin-publisher
```

**Generar imágenes:**
```text
"Genera imágenes profesionales para la sección de servicios"
→ Skill(skill="landing-images") directo
```

**Compliance RGPD:**
```text
"Revisa las cookies y política de privacidad"
→ Task(subagent_type="aepd-consultant") con /aepd-privacidad
```

**Flujo completo (secuencial):**
```text
"Crea nueva sección de casos de éxito con SEO optimizado"
→ 1. @frontend (implementa sección con /studiotek-landing-enhancer)
  2. @seo-expert (optimiza meta tags y schema con /seo-toolkit)
  3. @marketing-expert (genera copy y CTA con /marketing-content)
```

---

*Last updated: 2026-02-02 | Agents & Skills Registry*
