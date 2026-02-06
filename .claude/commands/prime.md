---
model: opus
description: Inicializar contexto del proyecto para el asistente AI. Usa esto al comenzar una nueva conversacion.
argument-hint: [none]
allowed-tools: read, glob
context: current
agent: general-purpose
disable-model-invocation: false
hooks: {}
---

# Purpose

Carga contexto del proyecto en 30 segundos al inicio de cada sesion de trabajo.

## Variables

Argumentos recibidos: $ARGUMENTS (tipicamente ninguno para este comando)

Paths de estado:

- CONTINUE_SESSION_PATH: `ai_docs/continue_session/CONTINUE_SESSION.md`
- GOAL_PATH: `ai_docs/state/GOAL.md`
- PROGRESS_PATH: `ai_docs/state/PROGRESS.yaml`
- MVP_ORDER_EXECUTION_PATH: `ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md`
- GUIA_STUDIOTEK_KAIROSAI_PATH: `~/Documents/GitHub/ai_docs/GUIA_STUDIOTEK_KAIROSAI.md`

Resources disponibles:

- SKILLS_DIR: `.claude/skills/` (para listar skills disponibles)
- AGENTS_DIR: `.claude/agents/` (para listar agentes disponibles)

## Codebase Structure

Estructura de .claude/:
.claude/
├── agents/ # Agentes especializados disponibles
│ ├── backend.md # @backend
│ ├── frontend.md # @frontend
│ ├── testing.md # @testing
│ ├── security-reviewer.md # @security-reviewer
│ ├── quality-reviewer.md # @quality-reviewer
│ ├── infra.md # @infra
│ ├── gentleman.md # @gentleman
│ ├── seo-expert.md # @seo-expert
│ ├── marketing-expert.md # @marketing-expert
│ ├── claude-skills-architect.md # @claude-skills-architect
│ ├── codebase-analyst.md # @codebase-analyst
│ └── aepd-consultant.md # @aepd-consultant
│
├── skills/ # Skills disponibles
│ ├── fastapi/ # /fastapi
│ ├── clean-arch/ # /clean-arch
│ ├── pytest/ # /pytest
│ ├── owasp/ # /owasp
│ ├── rls/ # /rls
│ ├── marketing-content/ # /marketing-content
│ ├── linkedin-publisher/ # /linkedin-publisher
│ ├── landing-images/ # /landing-images
│ ├── seo-toolkit/ # /seo-toolkit
│ └── [otros skills...]
│
├── commands/ # Comandos slash
│ ├── plan-task.md
│ ├── ralph-execute.md
│ ├── continue-session.md
│ ├── prime.md # Este comando
│ ├── landing-images.md
│ ├── mcp-sync.md
│ └── owasp.md
│
└── SKILLS_ROADMAP.md # Roadmap de skills a crear

Archivos de estado a leer (en orden):

1. `CONTINUE_SESSION_PATH` - Contexto compacto
2. `GOAL_PATH` - Objetivo actual
3. `PROGRESS_PATH` - Estado del workflow
4. `MVP_ORDER_EXECUTION_PATH` - Orden de Ejecución de Issues
5. `GUIA_STUDIOTEK_KAIROSAI_PATH` - Guía de Studiotek KairosAI
6. `AGENTS_DIR` - Agente disponibles (para mostrar en resumen)
7. `SKILLS_DIR` - Skills disponibles (para mostrar en resumen)

## Instructions

1. Leer archivos de estado en orden de prioridad:
   - `CONTINUE_SESSION_PATH`
   - `GOAL_PATH`
   - `PROGRESS_PATH`
2. Leer orden de ejecución de issues si existe:
   - `MVP_ORDER_EXECUTION_PATH`
3. Leer guía de Studiotek KairosAI si existe:
   - `GUIA_STUDIOTEK_KAIROSAI_PATH`
4. Mostrar resumen del contexto cargado:
   - Proyecto: [nombre]
   - Status: [IDLE/IN_PROGRESS/BLOCKED]
   - Objetivo: [descripcion corta]
   - Next: [proxima tarea]
   - Agentes disponibles: [lista de @agentes]
   - Skills disponibles: [lista de /skills]

## Workflow

Proceso de carga:

1. Verificar existencia de archivos de estado
2. Leer contenido de cada archivo
3. Sintetizar informacion relevante
4. Presentar resumen estructurado
5. Sugerir comando para continuar

## Report

Output esperado:

## Contexto Cargado

- Proyecto: [nombre del repo]
- Status: [IDLE/IN_PROGRESS/BLOCKED]
- Objetivo: [descripcion del objetivo actual]
- Next: [proxima tarea recomendada]

Estado actual del proyecto:

- Que se esta trabajando o que sigue
- Comando sugerido para continuar
