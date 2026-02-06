---
model: opus
description: Ejecuta planes generados por /plan-task con TodoList tracking y checkpoints automaticos
argument-hint: [--max-iterations=N] [--resume]
allowed-tools: read, write, edit, bash, task, todowrite, glob, grep, mcp__server-sequential-thinking__sequentialthinking
context: current
agent: general-purpose
disable-model-invocation: false
hooks:
  SubagentStop:
    - prompt: |
        Valida que el plan se ejecuto correctamente:
        1. WORKFLOW-STATUS.yaml con fases y checkpoints
        2. TodoList con fases y checkpoints
        3. Lectura de memoria de expertos
        4. Actualizacion de memoria de expertos
        5. Long Term Memory actualizada
        Responde: VALID si todo presente, o INVALID: <razon> si falta algo.
      model: haiku
      once: true
---

# Purpose

Ejecuta planes generados por /plan-task en la sesion principal. Esto asegura que los hooks funcionen correctamente, las memorias de expertos se actualicen automaticamente, el usuario vea el progreso en tiempo real via TodoList, y se puedan pausar/resumir workflows.

## Variables

Argumentos recibidos: $ARGUMENTS

Descompuestos:
- MAX_ITERATIONS: Extraer de --max-iterations=N (default: 50)
- RESUME: true si --resume presente en $ARGUMENTS (default: true)

Paths:
- WORKFLOW_STATUS: ai_docs/state/WORKFLOW-STATUS.yaml

Resources disponibles:
- SKILLS_DIR: .claude/skills/ (skills para cargar en cada fase)
- AGENTS_DIR: .claude/agents/ (definiciones de agentes especializados)
- DOMAIN_EXPERTS: ai_docs/expertise/domain-experts/*.yaml

## Codebase Structure

Estructura de .claude/:
.claude/
├── agents/                    # Agentes especializados
│   ├── backend.md            # @backend - FastAPI, SQLAlchemy
│   ├── frontend.md           # @frontend - React, Next.js
│   ├── testing.md            # @testing - Pytest, TDD
│   ├── security-reviewer.md  # @security-reviewer - OWASP
│   ├── infra.md              # @infra - Docker, CI/CD
│   ├── quality-reviewer.md   # @quality-reviewer - Clean Code
│   ├── gentleman.md          # @gentleman - Architecture
│   ├── marketing-expert.md   # @marketing-expert - Content
│   ├── seo-expert.md         # @seo-expert - SEO
│   ├── claude-skills-architect.md # @claude-skills-architect
│   └── aepd-consultant.md    # @aepd-consultant - Privacy
│
├── skills/                   # Skills disponibles
│   ├── fastapi/SKILL.md
│   ├── clean-arch/SKILL.md
│   ├── pytest/SKILL.md
│   ├── owasp/SKILL.md
│   ├── rls/SKILL.md
│   ├── marketing-content/SKILL.md
│   ├── subagent-swarm/SKILL.md
│   └── [otros skills...]
│
└── commands/                # Este comando

Arquitectura del comando:

Arquitectura del comando:
/ralph-execute
        |
        +--- 1. Cargar WORKFLOW-STATUS.yaml
        +--- 2. Crear TodoList con todas las fases
        |
        +--- LOOP (hasta completar o max_iterations):
        |     |
        |     +--- 3. Encontrar siguiente fase PENDING
        |     +--- 4. Marcar fase IN_PROGRESS
        |     +--- 5. Ejecutar Task(subagent_type, prompt, update_memory=True)
        |     +--- 6. Ejecutar Checkpoint
        |     +---    SI pasa: marcar COMPLETED
        |     +---    SI falla: retry (max 3) o BLOCKED
        |
        +--- 7. Verificar completitud
        |     +--- ALL COMPLETED -> "WORKFLOW COMPLETE"
        |     +--- ANY BLOCKED -> "WORKFLOW BLOCKED"
        |     +--- TIMEOUT -> "WORKFLOW TIMEOUT"
        |
        +--- 8. Guardar estado final

## Instructions

### Paso 1: Cargar Estado

Verificar que existe ai_docs/state/WORKFLOW-STATUS.yaml
Leer y extraer: workflow_id, phases, iteration actual, max_iterations

### Paso 2: Crear TodoList

Usar TodoWrite para crear lista de tareas con todas las fases del workflow.

### Paso 3: Loop Principal

Mientras iteration < max_iterations:
1. Encontrar siguiente fase PENDING o FAILED
2. Si no hay mas fases, terminar con WORKFLOW COMPLETE
3. Marcar fase como IN_PROGRESS
4. Ejecutar Task con subagent_type y skills cargadas:
   ```python
   result = Task(
       subagent_type: phase.agent.replace("@", ""),
       description: f"FASE {phase.id}: {phase.name}",
       prompt: phase.prompt,
       skills: phase.skills if phase.skills else None,  # Cargar skills de .claude/skills/
       update_memory: True
   )
   ```
5. Ejecutar checkpoint
6. Si pasa: marcar COMPLETED, si falla: retry o BLOCKED
7. Guardar estado en WORKFLOW-STATUS.yaml

Pasos detallados por fase:
- Extraer del WORKFLOW-STATUS.yaml: agent, skills[], prompt
- Cargar skills de .claude/skills/{skill-name}/SKILL.md
- Invocar Task() con subagent_type y skills pre-cargadas
- El agente lee su memoria de ai_docs/expertise/domain-experts/{agent}.yaml
- Al terminar, SubagentStop hook actualiza memoria automáticamente

### Paso 4: Verificar Completitud

- ALL COMPLETED -> final_status = SUCCESS
- ANY BLOCKED -> final_status = PARTIAL
- TIMEOUT -> final_status = TIMEOUT

### Paso 5: Guardar Estado Final

Actualizar ai_docs/state/WORKFLOW-STATUS.yaml con estado final.

### Paso 6: Actualizar Memoria de Expertos

Actualizar ai_docs/memoria/long_term.yaml con:
- workflows_completed
- decisions
- blockers
- velocity
- tools
- history

## Workflow

Checkpoints por Tipo de Fase:
- Backend/Frontend: uv run pytest tests/unit/ -v
- Tests: uv run pytest --cov --cov-fail-under=80
- Security: bandit -r src/ -ll
- Review: grep 'APPROVED' FINAL-REVIEW.md
- Build: make build o npm run build
- Files exist: test -f path/to/file

Mapeo Agente -> Domain Expert -> Skills Tipicas:
- @backend -> backend.yaml -> /fastapi, /clean-arch, /supabase, /pytest
- @frontend -> frontend.yaml -> /react-19, /nextjs, /tailwind, /ideas-design
- @testing -> testing.yaml -> /pytest, /playwright-mcp, /owasp
- @infra -> infra.yaml -> /github, /mcp-tools
- @security-reviewer -> security.yaml -> /owasp, /rls, /aepd-privacidad
- @gentleman -> backend.yaml -> /clean-arch, /agent-builder
- @quality-reviewer -> quality-reviewer.yaml -> /code-analysis, /clean-arch
- @marketing-expert -> marketing-expert.yaml -> /marketing-content, /linkedin-publisher, /seo-toolkit
- @seo-expert -> seo-expert.yaml -> /seo-toolkit, /marketing-content
- @claude-skills-architect -> claude-skills-architect.yaml -> /skill-creator, /agent-builder, /subagent-swarm
- @aepd-consultant -> aepd-consultant.yaml -> /aepd-privacidad

Skills por Categoria de Tarea:
- API Backend: /fastapi, /clean-arch, /supabase, /pydantic-ai, /pytest
- Frontend UI: /react-19, /nextjs, /tailwind, /ideas-design, /playwright-mcp
- Seguridad: /owasp, /rls, /aepd-privacidad
- Testing: /pytest, /playwright-mcp
- Marketing: /marketing-content, /linkedin-publisher, /landing-images, /seo-toolkit
- Infra: /github, /mcp-tools
- Multi-Agent: /subagent-swarm, /agent-builder, /mcp-tools

Self-Correction con Retries:
- Tests fallan: Analiza error, corrige (max 3)
- Security falla: Implementa mitigacion (max 3)
- @gentleman REJECTED: Revisa feedback, corrige (max 2)
- Build falla: Corrige errores de build (max 3)
- Checkpoint timeout: Retry con mas tiempo (max 2)

## Report

Al iniciar:
RALPH MODE - Ejecutando Plan
Workflow: {workflow_id}
Fases: {total_phases}
Modo: {mode}
Iniciando ejecucion...

Al completar fase:
FASE {id} COMPLETADA: {name}
Memoria de experto actualizada: {domain_expert}
Checkpoint: PASSED
Tiempo: {duration}

Al finalizar:
WORKFLOW {STATUS}
Fases completadas: {N}/{total}
Iteraciones: {iteration}
Tiempo total: {duration}
Memorias de expertos actualizadas: {domain_experts}
Skills utilizadas: {lista de skills cargadas}

Estadísticas:
- Agentes involucrados: {lista de @agentes}
- Skills cargadas: {total skills}
- Archivos modificados: {N}
- Tests ejecutados: {N}
- Checkpoints pasados: {N}/{total}

Version: 1.0.0 | Actualizado: 2026-01-16
