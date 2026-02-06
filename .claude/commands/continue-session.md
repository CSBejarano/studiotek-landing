---
model: opus
description: Sincronizar el estado del proyecto al inicio de cada sesion de trabajo
argument-hint: [none]
allowed-tools: read, write, glob, bash
context: current
agent: general-purpose
disable-model-invocation: false
hooks: {}
---

# Purpose

Sincronizar el estado del proyecto al inicio de cada sesion de trabajo. Este skill lee los archivos de estado y actualiza el contexto para mantener continuidad entre sesiones de Claude. Garantiza que el asistente tenga contexto actualizado del progreso, decisiones y proximos pasos.

## Variables

Argumentos recibidos: $ARGUMENTS (tipicamente ninguno para este comando)

Configuracion:
- PROJECT_ROOT: /Users/cristianbejaranomendez/Documents/GitHub/claude-code-template
- MAX_CONTEXT_TOKENS: 2500

Paths de estado:
- CONTINUE_SESSION_PATH: ai_docs/continue_session/CONTINUE_SESSION.md
- PROGRESS_YAML_PATH: ai_docs/state/PROGRESS.yaml
- GOAL_PATH: ai_docs/state/GOAL.md
- PROGRESS_JSON_PATH: ai_docs/state/PROGRESS.json
- DECISIONS_PATH: ai_docs/state/DECISIONS.md
- SKILLS_ROADMAP_PATH: .claude/SKILLS_ROADMAP.md

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (skills especializadas)
- AGENTS_DIR: .claude/agents/ (agentes especializados)
- DOMAIN_EXPERTS: ai_docs/expertise/domain-experts/*.yaml

## Codebase Structure

ai_docs/
├── state/
│   ├── PROGRESS.yaml        # Estado estructurado del workflow
│   ├── GOAL.md              # Objetivo actual con detalles
│   ├── PROGRESS.json        # Historico y estadisticas
│   └── DECISIONS.md         # Registro de decisiones (append-only)
├── continue_session/
│   └── CONTINUE_SESSION.md  # Contexto compacto para LLM
├── plan/                    # Planes de implementacion
├── analysis/                # Reportes de analisis
└── review/                  # Reportes de review

.claude/
├── SKILLS_ROADMAP.md        # Roadmap de skills a crear
│
├── agents/                  # Agentes especializados por dominio
│   ├── backend.md          # @backend - FastAPI, SQLAlchemy, Clean Arch
│   ├── frontend.md         # @frontend - React, TypeScript, Tailwind
│   ├── testing.md          # @testing - Pytest, TDD, Coverage
│   ├── security-reviewer.md # @security-reviewer - OWASP, RLS, Security
│   ├── quality-reviewer.md  # @quality-reviewer - Clean Code, Patterns
│   ├── infra.md            # @infra - Docker, CI/CD, DevOps
│   ├── gentleman.md        # @gentleman - Architecture, Mentoring
│   ├── seo-expert.md       # @seo-expert - SEO técnico, Schema.org
│   ├── marketing-expert.md # @marketing-expert - Content, LinkedIn
│   ├── claude-skills-architect.md # @claude-skills-architect
│   ├── codebase-analyst.md # @codebase-analyst - Pattern analysis
│   └── aepd-consultant.md  # @aepd-consultant - RGPD, Privacidad
│
├── skills/                 # Skills especializadas disponibles
│   ├── fastapi/           # /fastapi - FastAPI patterns
│   ├── clean-arch/        # /clean-arch - Hexagonal Architecture
│   ├── pytest/            # /pytest - Testing framework
│   ├── owasp/             # /owasp - Security audit A01-A10
│   ├── rls/               # /rls - Row Level Security
│   ├── pydantic-ai/       # /pydantic-ai - AI agents framework
│   ├── agent-builder/     # /agent-builder - Agent patterns
│   ├── subagent-swarm/    # /subagent-swarm - Multi-agent coordination
│   ├── marketing-content/ # /marketing-content - Copywriting
│   ├── linkedin-publisher/ # /linkedin-publisher - Social media
│   ├── landing-images/    # /landing-images - Gemini image generation
│   ├── commercial-proposal/ # /commercial-proposal - PDF/PPT proposals
│   ├── remotion-videos/   # /remotion-videos - Programmatic video
│   ├── seo-toolkit/       # /seo-toolkit - SEO 10 modules
│   ├── mcp-tools/         # /mcp-tools - MCP patterns
│   ├── aepd-privacidad/   # /aepd-privacidad - RGPD compliance
│   ├── code-analysis/     # /code-analysis - Static analysis
│   ├── github/            # /github - GitHub CLI/API
│   ├── session-memory/    # /session-memory - Context persistence
│   └── hooks/             # /hooks - Hook system
│
└── commands/              # Comandos slash disponibles
    ├── plan-task.md       # /plan-task - Multi-agent planning
    ├── ralph-execute.md   # /ralph-execute - Execute plans
    ├── continue-session.md # /continue-session - This command
    ├── prime.md           # /prime - Quick context load
    ├── landing-images.md  # /landing-images
    ├── mcp-sync.md        # /mcp-sync
    └── owasp.md           # /owasp - Security audit

## Instructions

1. Leer estado actual del proyecto:
   - Leer ai_docs/state/PROGRESS.yaml para estado del workflow
   - Leer ai_docs/state/GOAL.md para objetivo actual
   - Leer .claude/SKILLS_ROADMAP.md para proximos skills a crear
   - Leer .claude/agents/*.md para detectar agentes disponibles
   - Leer .claude/skills/*/SKILL.md para detectar skills disponibles

2. Verificar archivos de estado:
   - Si no existen, inicializarlos con valores por defecto
   - Mantener consistencia entre PROGRESS.yaml y GOAL.md

3. Actualizar CONTINUE_SESSION.md:
   - Generar contexto compacto (max 2500 tokens)
   - Incluir: estado del proyecto, ultimo progreso, proximo objetivo
   - Incluir: skills pendientes del roadmap, quick start commands
   - Formato: <compact_context> tag con metadata

4. Actualizar PROGRESS.yaml:
   - Schema version: "1.0"
   - Campos: current_phase, status (IDLE/IN_PROGRESS/BLOCKED), mode
   - Incluir summary con objective y result
   - Agregar comentarios con contexto

5. Actualizar GOAL.md:
   - Status actual (IDLE, IN_PROGRESS, BLOCKED)
   - Proximo skill a crear del roadmap
   - Quick start commands
   - Mapeo de agentes disponibles: @backend, @frontend, @testing, etc.
   - Mapeo de skills disponibles: /fastapi, /clean-arch, /owasp, etc.

6. Actualizar DECISIONS.md (append-only):
   - NO modificar decisiones existentes
   - Agregar nuevas decisiones al final con formato estandar:
     - ID: DXXX (incremental)
     - Date, Context, Decision, Rationale, Tags
   - Solo agregar si hay decisiones nuevas

## Workflow

1. Leer archivos de estado existentes
2. Actualizar .claude/SKILLS_ROADMAP.md para proximos skills
3. Actualizar ai_docs/continue_session/CONTINUE_SESSION.md
4. Actualizar ai_docs/state/PROGRESS.yaml
5. Actualizar ai_docs/state/GOAL.md
6. Actualizar ai_docs/state/DECISIONS.md (si hay nuevas)

## Report

Al finalizar, mostrar resumen:

## Session Sync Complete

### Project Status
- Repo: claude-code-template
- Status: IDLE/IN_PROGRESS/BLOCKED
- Current Focus: [skill name or "Ready for new task"]

### Files Updated
- CONTINUE_SESSION.md: (XXX tokens)
- PROGRESS.yaml: (status: IDLE/IN_PROGRESS)
- GOAL.md: 
- DECISIONS.md: (N decisions total)

### Skills Roadmap Status
| Sprint | Skills | Status |
|--------|--------|--------|
| Sprint 0 | /pydantic-ai, /agent-builder, /mcp-tools | Pending |
| Sprint 1 | /fastapi, /pytest, /clean-arch | Pending |

### Recommended Next
Skill: [nombre del skill recomendado]
Priority: [CRITICO/ALTO/MEDIO/BAJO]
Context7 ID: [ID de Context7]

### Quick Start
# Ver roadmap completo
cat .claude/SKILLS_ROADMAP.md

# Crear proximo skill
/plan-task crear skill [nombre] con Context7

# Ver agentes disponibles
ls .claude/agents/
