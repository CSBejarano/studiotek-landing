# Plan de Ejecucion: Cumplimiento Legal RGPD/LOPDGDD y Ley 2/2023

> **Generado:** 2026-01-29
> **Issue:** N/A
> **Mode:** FULL
> **Complejidad:** 14/10 (Multi-dominio, multi-repo, alta regulacion)

## Variables

```yaml
workflow_id: "2026-01-29_cumplimiento-legal-rgpd-lopdgdd"
branch: feature/legal-compliance
domain: frontend, backend, security
frontend_repo: ~/Documents/GitHub/studiotek-landing
backend_repo: ~/Documents/GitHub/ideas
spec_file: ~/Documents/GitHub/prompt_legal_cookies.md

# Skill de apoyo legal
skill_aepd: ~/.claude/skills/aepd-privacidad/
skill_aepd_root: /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad
```

## Skill Requerida: `/aepd-privacidad`

**Ubicacion:** `/Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/`

Este plan requiere el uso de la skill `/aepd-privacidad` (Consultor Experto en Proteccion de Datos) para generar textos legales conformes a AEPD, RGPD, LOPDGDD, AI Act y Ley 2/2023.

### Estructura de la Skill

```text
aepd-privacidad/
├── SKILL.md                          # Punto de entrada
├── workflows/
│   ├── auditoria-rgpd.md           # Auditoria completa RGPD para SaaS
│   ├── protocolo-brechas.md        # Gestion de brechas (72h)
│   ├── evaluacion-impacto.md       # EIPD para proyectos con IA
│   ├── gestion-consentimiento.md   # Cookies, WhatsApp, formularios
│   └── implementacion-codigo-etico.md # Guia implementacion codigo etico
├── referencias/
│   ├── marco-legal.md              # RGPD, LOPDGDD, articulos clave
│   ├── herramientas-aepd.md        # 8 herramientas oficiales con URLs
│   ├── normativa-complementaria.md # ENS, AI Act, LSSI-CE, NIS2
│   ├── best-practices.md           # Mejores practicas cumplimiento
│   └── anti-patterns.md            # Errores comunes a evitar
└── plantillas/
    ├── clausulas-informativas.md   # Modelos Art. 13 RGPD
    ├── contrato-dpa.md             # Encargado tratamiento Art. 28
    ├── registro-actividades-tratamiento.md  # RAT Art. 30
    ├── checklist-cookies.md        # Guia cookies AEPD
    ├── formularios-derechos-arcopol.md     # Derechos Arts. 15-22
    ├── evaluacion-ens.md           # Esquema Nacional Seguridad
    ├── compliance-ai-act.md        # Reglamento UE 2024/1689
    └── codigo-etico.md             # Codigo conducta y practicas responsables
```

### Uso por Fase y Agente

| Fase | Agente | Archivos Skill a Leer | Proposito |
|------|--------|----------------------|-----------|
| 2 | @frontend | `referencias/marco-legal.md`, `plantillas/clausulas-informativas.md` | Textos Aviso Legal (LSSI-CE) y Condiciones Contratacion |
| 3 | @frontend | `referencias/marco-legal.md`, `referencias/normativa-complementaria.md` | Textos Canal Denuncias (Ley 2/2023) |
| 4 | @frontend | `plantillas/compliance-ai-act.md`, `referencias/normativa-complementaria.md` | Textos Politica IA (AI Act + RGPD) e Info Informante |
| 6 | @backend | `workflows/evaluacion-impacto.md`, `plantillas/codigo-etico.md`, `plantillas/compliance-ai-act.md`, `referencias/best-practices.md` | 5 documentos internos completos |
| 8 | @security | `plantillas/checklist-cookies.md`, `workflows/gestion-consentimiento.md` | Validacion cookies RGPD y consentimiento |

### Instrucciones para Subagentes

Cada subagente que necesite la skill debe:

1. **Leer SKILL.md primero** para contexto general: `/Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md`
2. **Leer los archivos especificos** de la tabla anterior segun su fase
3. **Aplicar las plantillas** como base para textos legales, adaptandolas al contexto StudioTek
4. **Incluir disclaimer obligatorio** al final de cada documento/pagina legal generada:
   > _"Esta informacion es de caracter informativo basado en las directrices de la AEPD y no constituye asesoramiento legal vinculante. Se recomienda la revision por un abogado colegiado o DPO certificado."_
5. **Citar articulos especificos** del RGPD, LOPDGDD, AI Act o Ley 2/2023 segun corresponda

## Purpose

Implementar cumplimiento legal completo RGPD/LOPDGDD y Ley 2/2023 para studiotek-landing. El proyecto incluye:
- 5 paginas legales publicas nuevas (Aviso Legal, Condiciones Contratacion, Canal de Denuncias, Informacion al Informante, Politica de IA)
- 3 componentes legales reutilizables + 3 archivos de configuracion/validacion
- 5 documentos internos legales para revision por abogada
- Backend APIs para cookies consent y canal de denuncias
- Integracion con Footer y revision de paginas existentes

## TDD Test Plan

### Build Tests (cada fase)
- `npm run build` debe pasar despues de cada fase frontend
- `npx tsc --noEmit` para verificar TypeScript

### Component Tests (Fase 9)
- LegalSection: renderiza con id anchor correcto
- LegalHighlight: renderiza variantes info/warning
- LegalExternalLink: renderiza con icono externo y target="_blank"
- WhistleblowerForm: navegacion multi-step, validacion Zod por step
- WhistleblowerStatus: formulario de consulta con UUID

### Page Tests
- Cada pagina legal renderiza sin errores
- Metadata (title, description) correcta por pagina
- BlurFade animations no rompen SSR

### Integration Tests
- Footer contiene 7 links legales
- Links internos entre paginas legales funcionan
- Cookie consent flow sigue funcionando

### Accessibility Tests
- Heading hierarchy (h1 > h2 > h3) en cada pagina
- aria-labels en formularios
- Focus management en WhistleblowerForm
- Contraste colores WCAG AA (dark mode)

### Responsive Tests
- Paginas correctas en 320px y 1440px
- Tablas con overflow-x-auto
- Formulario multi-step mobile-friendly

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| 1 | Injection (SQL/XSS) | SI | Zod validation, React escaping, parameterized queries |
| 2 | Broken Authentication | SI (admin) | JWT/API key para admin endpoints |
| 3 | Sensitive Data Exposure | SI | Encryption at rest, TLS 1.3, hashed IPs |
| 4 | XXE | NO | JSON APIs only |
| 5 | Broken Access Control | SI | RLS Supabase, admin-only routes |
| 6 | Security Misconfiguration | SI | CSP headers, CORS, robots.txt exclusions |
| 7 | XSS | BAJO | React auto-escaping, no dangerouslySetInnerHTML |
| 8 | Insecure Deserialization | SI | Zod schemas, FastAPI Pydantic models |
| 9 | Known Vulnerabilities | SI | npm audit, pip audit |
| 10 | Insufficient Logging | SI | whistleblower_access_logs table |

## Architectural Review

**Verdict inicial:** PENDING (se revisara en Phase FINAL)

**Patrones a seguir:**
- Patron existente de politica-privacidad y politica-cookies para todas las paginas legales
- App Router conventions (layout.tsx + page.tsx por ruta)
- Dark mode only (bg-background, text-white/text-slate-300/text-slate-400)
- BlurFade para animaciones de entrada
- legal-config.ts como single source of truth para datos empresa
- Clean Architecture en backend (entities -> use cases -> presentation)

## Code Structure

### CREATE (studiotek-landing):
```text
lib/legal-config.ts                          # Datos empresa StudioTek
lib/whistleblower-categories.ts              # Categorias denuncia Ley 2/2023
lib/whistleblower-validations.ts             # Zod schemas canal denuncias
components/legal/LegalSection.tsx            # Seccion reutilizable con anchor
components/legal/LegalHighlight.tsx          # Recuadro info/warning
components/legal/LegalExternalLink.tsx       # Link externo BOE/AEPD
app/aviso-legal/layout.tsx                   # SEO metadata
app/aviso-legal/page.tsx                     # LSSI-CE Art. 10
app/condiciones-contratacion/layout.tsx      # SEO metadata
app/condiciones-contratacion/page.tsx        # Lectura facil SaaS terms
app/canal-denuncias/layout.tsx               # SEO metadata
app/canal-denuncias/page.tsx                 # Ley 2/2023 + formulario
components/legal/WhistleblowerForm.tsx       # Multi-step form
components/legal/WhistleblowerStatus.tsx     # Consulta estado UUID
app/informacion-informante/layout.tsx        # SEO metadata
app/informacion-informante/page.tsx          # Derechos Ley 2/2023
app/politica-ia/layout.tsx                   # SEO metadata
app/politica-ia/page.tsx                     # AI Act + RGPD + AEPD
ai_docs/legal/ficha-tecnica-sistema.md       # DOC-INT-1
ai_docs/legal/politica-uso-ia.md             # DOC-INT-2
ai_docs/legal/eipd-inicial.md               # DOC-INT-3
ai_docs/legal/guia-periodicidad-eipd.md      # DOC-INT-4
ai_docs/legal/codigo-etico.md               # DOC-INT-5
```

### CREATE (ideas backend):
```text
app/domain/entities/cookies.py               # CookieConsent entity
app/domain/entities/whistleblower.py         # WhistleblowerReport entity
app/application/use_cases/cookies/           # Cookie use cases
app/application/use_cases/whistleblower/     # Whistleblower use cases
app/presentation/api/v1/cookies.py           # Cookie API endpoints
app/presentation/api/v1/whistleblower.py     # Whistleblower API endpoints
```

### MODIFY:
```text
components/sections/Footer.tsx               # Anadir 5 links legales nuevos
app/politica-privacidad/page.tsx             # Revisar DPO, plazos, link IA
app/politica-cookies/page.tsx                # Actualizar fecha
```

### TESTS:
```text
npm run build                                # Build validation
npm run lint                                 # Lint validation
```

## WORKFLOW

### Fase 1: Configuracion Base Legal (@frontend)
Crear lib/legal-config.ts, lib/whistleblower-categories.ts, lib/whistleblower-validations.ts y 3 componentes en components/legal/ (LegalSection, LegalHighlight, LegalExternalLink).
- Pre-tarea: Leer frontend.yaml + prompt_legal_cookies.md completo
- Checkpoint: `npx tsc --noEmit`
- Post-tarea: Actualizar frontend.yaml

**Prompt del subagente:**
```text
Eres @frontend. Crea 6 archivos base para el sistema legal de studiotek-landing.

SKILL AEPD-PRIVACIDAD: NO necesaria en esta fase (solo componentes UI y config).

[resto del prompt de fase 1...]
```

### Fase 2: Aviso Legal + Condiciones Contratacion (@frontend)
Crear 2 paginas legales siguiendo patron existente. Aviso Legal (LSSI-CE Art. 10) y Condiciones de Contratacion (lectura facil con recuadros).
- Checkpoint: `npm run build`

**Prompt del subagente:**
```text
Eres @frontend. Crea las paginas de Aviso Legal y Condiciones de Contratacion.

SKILL AEPD-PRIVACIDAD: REQUERIDA. Antes de generar textos legales:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md
2. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/referencias/marco-legal.md
3. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/plantillas/clausulas-informativas.md
4. Aplica las clausulas y referencias legales de la skill para generar textos conformes a LSSI-CE y RGPD.
5. Incluye disclaimer obligatorio al final de cada pagina.

[resto del prompt de fase 2...]
```

### Fase 3: Canal de Denuncias (@frontend)
Fase mas compleja. Crear WhistleblowerForm (multi-step 5 pasos), WhistleblowerStatus, y pagina canal-denuncias.
- Checkpoint: `npm run build`

**Prompt del subagente:**
```text
Eres @frontend. Crea el sistema de Canal de Denuncias (Ley 2/2023).

SKILL AEPD-PRIVACIDAD: REQUERIDA. Antes de generar textos legales:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md
2. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/referencias/marco-legal.md
3. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/referencias/normativa-complementaria.md
4. Usa las referencias de Ley 2/2023 y RGPD para textos informativos del canal.
5. Incluye disclaimer obligatorio.

[resto del prompt de fase 3...]
```

### Fase 4: Informacion Informante + Politica IA (@frontend)
Crear 2 paginas de contenido extenso. Informacion al Informante (13 secciones, Ley 2/2023) y Politica IA (12 secciones, AI Act).
- Checkpoint: `npm run build`

**Prompt del subagente:**
```text
Eres @frontend. Crea Info Informante (13 secciones) y Politica IA (12 secciones).

SKILL AEPD-PRIVACIDAD: REQUERIDA (USO INTENSIVO). Antes de generar textos:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md
2. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/plantillas/compliance-ai-act.md
3. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/referencias/normativa-complementaria.md (AI Act, Ley 2/2023)
4. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/referencias/marco-legal.md (RGPD Arts. 5/13/22)
5. Aplica plantilla AI Act para clasificacion de riesgo, obligaciones de transparencia y derechos.
6. Aplica Ley 2/2023 completa para derechos del informante (13 secciones detalladas en spec).
7. Incluye disclaimer obligatorio en ambas paginas.

[resto del prompt de fase 4...]
```

### Fase 5: Integracion Footer + Revision (@frontend)
Actualizar Footer.tsx con 7 links legales. Revisar politica-privacidad y politica-cookies.
- Checkpoint: `npm run build && npm run lint`

**Prompt del subagente:**
```text
Eres @frontend. Actualiza Footer y revisa paginas legales existentes.

SKILL AEPD-PRIVACIDAD: NO necesaria en esta fase (solo integracion UI).

[resto del prompt de fase 5...]
```

### Fase 6: Documentos Internos (@backend)
Crear 5 documentos internos en ai_docs/legal/ para revision por Isabel Perez.
- Checkpoint: Archivos existen con contenido sustancial

**Prompt del subagente:**
```text
Eres @backend. Genera 5 documentos internos legales en ai_docs/legal/.

SKILL AEPD-PRIVACIDAD: REQUERIDA (USO CRITICO). Esta fase depende COMPLETAMENTE de la skill.
Antes de generar CUALQUIER documento:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md
2. Para DOC-INT-1 (Ficha Tecnica):
   - Lee referencias/marco-legal.md (Ley 2/2023 Arts. 5-9)
   - Lee referencias/normativa-complementaria.md
3. Para DOC-INT-2 (Politica Uso IA):
   - Lee plantillas/compliance-ai-act.md (AI Act completo)
   - Lee referencias/best-practices.md (seccion IA)
4. Para DOC-INT-3 (EIPD):
   - Lee workflows/evaluacion-impacto.md (workflow EIPD completo)
   - Lee referencias/herramientas-aepd.md (EVALUA-RIESGO, GESTIONA-EIPD)
5. Para DOC-INT-4 (Guia Periodicidad):
   - Lee workflows/evaluacion-impacto.md (secciones de periodicidad)
   - Lee referencias/marco-legal.md (Art. 35.11 RGPD)
6. Para DOC-INT-5 (Codigo Etico):
   - Lee plantillas/codigo-etico.md (plantilla completa)
   - Lee referencias/best-practices.md (seccion 12 Codigo Etico con capitulo IA)
7. Incluye disclaimer obligatorio en cada documento.
8. Cada documento debe ser exportable a PDF/Word para revision por Isabel Perez.

[resto del prompt de fase 6...]
```

### Fase 7: Backend APIs (@backend)
Explorar repo ideas, crear tablas Supabase y endpoints FastAPI para cookies y whistleblower.
- Checkpoint: Entidades Python existen

**Prompt del subagente:**
```text
Eres @backend. Crea tablas Supabase y endpoints FastAPI.

SKILL AEPD-PRIVACIDAD: REFERENCIA. Consultar para plazos y requisitos:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/plantillas/checklist-cookies.md (requisitos cookies DB)
2. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/workflows/gestion-consentimiento.md (flujo consentimiento)
3. Aplica plazos legales: conservacion cookies, max 10 anos whistleblower (Art. 26 Ley 2/2023).

[resto del prompt de fase 7...]
```

### Fase 8: Validacion Seguridad (@security-reviewer)
Revisar OWASP Top 10 aplicado a toda la implementacion.
- Checkpoint: Informe de seguridad generado

**Prompt del subagente:**
```text
Eres @security-reviewer. Revisa OWASP Top 10 de toda la implementacion.

SKILL AEPD-PRIVACIDAD: REFERENCIA para validacion de cumplimiento:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/plantillas/checklist-cookies.md
2. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/workflows/gestion-consentimiento.md
3. Valida que el sistema de cookies cumple la checklist AEPD.
4. Valida que el canal de denuncias cumple requisitos de confidencialidad y anonimato.

[resto del prompt de fase 8...]
```

### Fase 9: Testing y Validacion (@testing)
Build, lint, verificacion paginas, footer, formulario, accesibilidad.
- Checkpoint: `npm run build && npm run lint`

**Prompt del subagente:**
```text
Eres @testing. Ejecuta build, lint y verificaciones.

SKILL AEPD-PRIVACIDAD: NO necesaria en esta fase (solo testing tecnico).

[resto del prompt de fase 9...]
```

### Fase FINAL: Code Review Arquitectonico (@gentleman)
Review final de coherencia, patrones, seguridad.
- Verdict: APPROVED | NEEDS_REVISION | REJECTED

**Prompt del subagente:**
```text
Eres @gentleman. Review arquitectonico final.

SKILL AEPD-PRIVACIDAD: REFERENCIA para validacion de completitud legal:
1. Lee /Users/cristianbejaranomendez/Documents/GitHub/.claude/skills/aepd-privacidad/SKILL.md
2. Verifica que las 12 capacidades de la skill estan reflejadas donde corresponde.
3. Valida coherencia entre documentos internos y paginas publicas.

[resto del prompt de fase FINAL...]
```

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Textos legales inexactos | ALTO | MEDIO | DRAFT marks, disclaimer, revision Isabel Perez |
| Build failures por 30+ archivos | MEDIO | BAJO | Build incremental por fase, patron existente |
| WhistleblowerForm UX complejo | MEDIO | MEDIO | Multi-step best practices, step indicators |
| Datos empresa incompletos (CIF) | BAJO | ALTO | legal-config.ts con TODOs claros |
| Security holes en APIs | ALTO | BAJO | OWASP review fase 8, Zod/Pydantic validation |
| Performance regression | BAJO | BAJO | Static pages, BlurFade lightweight |
| Scope creep legal | MEDIO | MEDIO | Adherencia estricta a prompt_legal_cookies.md |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | 1 - Base Config | Archivos existen, TS compila | `npx tsc --noEmit` |
| CP2 | 2 - Aviso + Condiciones | Build pasa | `npm run build` |
| CP3 | 3 - Canal Denuncias | Build pasa | `npm run build` |
| CP4 | 4 - Info + Politica IA | Build pasa | `npm run build` |
| CP5 | 5 - Footer + Review | Build + lint pasan | `npm run build && npm run lint` |
| CP6 | 6 - Docs Internos | 5 archivos existen | `ls ai_docs/legal/*.md` |
| CP7 | 7 - Backend | Entidades existen | `ls app/domain/entities/` |
| CP8 | 8 - Security | Review completado | Informe findings |
| CP9 | 9 - Testing | Build + lint pasan | `npm run build && npm run lint` |
| CPF | FINAL - Review | APPROVED | Verdict del reviewer |

---
*Generado por /plan-task v5.0 - 2026-01-29*
