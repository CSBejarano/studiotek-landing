---
model: opus
description: Planificacion multi-agente - genera plan detallado con TDD, seguridad y review. NO ejecuta.
argument-hint: <descripcion-tarea> [--issue=N] [--mode=auto|fast|full]
allowed-tools: read, write, edit, glob, grep, mcp__server-sequential-thinking__sequentialthinking, mcp__serena__read_file, mcp__serena__search_for_pattern, mcp__serena__find_symbol, mcp__serena__get_symbols_overview, mcp__serena__list_dir
context: fork
agent: general-purpose
disable-model-invocation: false
hooks:
  Stop:
    - prompt: |
        Valida que el plan generado incluye:
        1. WORKFLOW-STATUS.yaml con fases y checkpoints
        2. Plan .md con Code Structure (CREATE/MODIFY/TESTS)
        3. TDD Test Plan
        4. Security Checklist (OWASP Top 10)
        5. user_prompt.md actualizado con estado READY
        6. Instrucciones para ejecutar con /ralph-execute [--max-iterations=N] [--resume]
        Responde: VALID si todo presente, o INVALID: <razon> si falta algo.
      model: haiku
      once: true
---

# Purpose

Comando de planificacion solamente. Genera un plan detallado y estructurado para ejecutar tareas complejas con agentes especializados.

IMPORTANTE: Este comando NO ejecuta el plan. Solo genera los documentos necesarios.

## Variables

Argumentos recibidos: $ARGUMENTS

Descompuestos:
- DESCRIPTION: $ARGUMENTS[0] (descripcion de la tarea)
- ISSUE_ID: Extraer de --issue=N si presente
- MODE: Extraer de --mode=auto|fast|full (default: auto)

Paths de salida:
- PLAN_FILE: ai_docs/plans/{YYYY-MM-DD}_${ARGUMENTS[0]}.md
- WORKFLOW_STATUS: ai_docs/state/WORKFLOW-STATUS.yaml
- USER_PROMPT: user_prompt.md

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (skills especializadas disponibles)
- AGENTS_DIR: .claude/agents/ (agentes especializados disponibles)

## Codebase Structure

Estructura de .claude/:
.claude/
├── agents/                    # Agentes especializados por dominio
│   ├── backend.md            # @backend - FastAPI, SQLAlchemy, Clean Arch
│   ├── frontend.md           # @frontend - React, TypeScript, Tailwind
│   ├── testing.md            # @testing - Pytest, TDD, Coverage
│   ├── security-reviewer.md  # @security-reviewer - OWASP, RLS
│   ├── quality-reviewer.md   # @quality-reviewer - Clean Code, Patterns
│   ├── infra.md              # @infra - Docker, CI/CD
│   ├── gentleman.md          # @gentleman - Architecture, Mentoring
│   ├── seo-expert.md         # @seo-expert - SEO técnico
│   ├── marketing-expert.md   # @marketing-expert - Content, LinkedIn
│   └── aepd-consultant.md    # @aepd-consultant - RGPD, Privacidad
│
├── skills/                   # Skills especializadas
│   ├── fastapi/             # /fastapi - Framework patterns
│   ├── clean-arch/          # /clean-arch - Hexagonal Architecture
│   ├── pytest/              # /pytest - Testing framework
│   ├── owasp/               # /owasp - Security audit
│   ├── rls/                 # /rls - Row Level Security
│   ├── pydantic-ai/         # /pydantic-ai - AI agents framework
│   ├── agent-builder/       # /agent-builder - Agent patterns
│   ├── subagent-swarm/      # /subagent-swarm - Multi-agent coordination
│   ├── marketing-content/   # /marketing-content - Copywriting
│   ├── linkedin-publisher/  # /linkedin-publisher - Social content
│   ├── landing-images/      # /landing-images - Gemini image gen
│   ├── commercial-proposal/ # /commercial-proposal - PDF/PPT proposals
│   ├── remotion-videos/     # /remotion-videos - Programmatic video
│   ├── seo-toolkit/         # /seo-toolkit - SEO 10 modules
│   └── mcp-tools/           # /mcp-tools - MCP patterns
│
└── commands/                # Comandos slash (este archivo)

Arquitectura del comando:

Arquitectura del comando:
/plan-task "descripcion" [--mode=auto|fast|full]
        |
        +--- Fase -3: Context Acquisition
        +--- Fase -2: Complexity Detection + Domain Analysis
        +--- Fase -1: Sequential Thinking (minimo 8 thoughts)
        |
        +--- OUTPUT:
        |     +--- ai_docs/plans/{workflow_id}.md
        |     +--- ai_docs/state/WORKFLOW-STATUS.yaml
        |     +--- user_prompt.md
        |
        +--- FIN: Instrucciones para ejecutar con /ralph-execute [--max-iterations=N] [--resume]


## Instructions

### Fase -3: Context Acquisition

Leer en paralelo:
- ai_docs/memoria/long_term.yaml (Decisiones previas Dxxx)
- ai_docs/expertise/expert-registry.yaml (Agentes disponibles)
- .claude/skills/*/SKILL.md (detectar skills relevantes)
- .claude/agents/*.md (detectar agentes disponibles)

Identificar skills relevantes para la tarea:
- Backend: /fastapi, /clean-arch, /pydantic-ai, /supabase, /pytest
- Frontend: /react-19, /nextjs, /tailwind, /ideas-design
- Security: /owasp, /rls, /aepd-privacidad
- Testing: /pytest, /playwright-mcp
- Marketing: /marketing-content, /linkedin-publisher, /landing-images, /seo-toolkit
- Multi-agent: /subagent-swarm, /agent-builder, /mcp-tools

Cargar skills relevantes al contexto del plan para que los agentes las usen.

### Fase -2: Complexity Detection + Domain Analysis

1. Calcular complejidad usando tabla de factores
2. Detectar dominio(s) segun keywords y asignar agente + skills:

| Dominio | Keywords | Agente Principal | Skills Relevantes |
|---------|----------|------------------|-------------------|
| backend | api, endpoint, fastapi, sqlalchemy | @backend | /fastapi, /clean-arch, /supabase, /pytest |
| security | auth, token, jwt, oauth, password | @security-reviewer | /owasp, /rls, /aepd-privacidad |
| testing | test, pytest, coverage, mock | @testing | /pytest, /playwright-mcp |
| database | migration, sql, schema, model, rls | @backend | /clean-arch, /supabase, /rls |
| infra | docker, k8s, ci, terraform, deploy | @infra | /github, /mcp-tools |
| frontend | react, component, hook, tsx, tailwind | @frontend | /react-19, /nextjs, /tailwind |
| marketing | blog, linkedin, seo, content, landing | @marketing-expert | /marketing-content, /linkedin-publisher, /seo-toolkit, /landing-images |
| multi-agent | workflow, swarm, orchestration | @claude-skills-architect | /subagent-swarm, /agent-builder, /mcp-tools |

Para cada fase del plan, incluir en el prompt las skills que el agente debe usar:
```
PRE-TAREA: Cargar skills relevantes
- Skill: /fastapi (para patterns de endpoints)
- Skill: /clean-arch (para estructura de capas)
```

### Fase -1: Sequential Thinking

Ejecutar sequentialthinking con minimo 8 thoughts:
1. Descomponer tarea en subtareas atomicas
2. Identificar archivos CREATE/MODIFY/DELETE
3. Detectar dependencias entre subtareas
4. Pre-mortem: Que puede fallar?
5. Consultar decisiones previas (Dxxx de long_term.yaml)
6. Asignar agentes a cada fase
7. Definir checkpoints con comandos ejecutables
8. Disenar TDD Test Plan

### Fase 0: Generar Outputs

1. Crear WORKFLOW-STATUS.yaml con:
   - Fases con agente asignado
   - Skills a cargar para cada fase
   - Checkpoints y comandos de verificacion
   - Prompts completos con skills pre-cargadas

2. Crear Plan .md con:
   - Code Structure (CREATE/MODIFY/TESTS)
   - TDD Test Plan
   - Security Checklist (OWASP)
   - Skills asignadas por fase
   - Agent mapping

3. Actualizar user_prompt.md con estado READY FOR EXECUTION

Formato de prompt por fase:
```yaml
- id: 1
  name: "Backend Implementation"
  agent: "@backend"
  skills:
    - /fastapi
    - /clean-arch
    - /supabase
  status: PENDING
  prompt: |
    # PRE-TAREA
    Cargar skills: /fastapi, /clean-arch, /supabase
    Leer memoria: ai_docs/expertise/domain-experts/backend.yaml
    
    # CONTEXTO
    Issue: #{ISSUE_ID}
    
    # TAREA
    Implementar endpoint siguiendo patterns de /fastapi y /clean-arch
    
    # POST-TAREA
    1. Actualizar memoria del agente
    2. Generar informe de progreso
```

## Workflow

Deteccion de Complejidad:
- Keywords criticos (auth, migration, security, payment): +2 puntos
- Multi-dominio (frontend + backend): +2 puntos
- Archivos afectados: +1 por cada 5 archivos
- Dependencias externas: +1 punto
- Base de datos: +1 punto
- Tests existentes: -1 punto

Umbral: Complejidad > 4 -> Modo FULL

## Report

Al terminar mostrar:

PLAN GENERADO EXITOSAMENTE

Archivos creados:
- ai_docs/plans/{workflow_id}.md
- ai_docs/state/WORKFLOW-STATUS.yaml
- user_prompt.md (actualizado)

Fases planificadas: {N}
Agentes involucrados: {lista de @agentes}
Modo: {FAST|FULL}

SIGUIENTE PASO

Para ejecutar este plan, usa: /ralph-execute [--max-iterations=N] [--resume]

Version: 5.0.0 | Actualizado: 2026-01-16
