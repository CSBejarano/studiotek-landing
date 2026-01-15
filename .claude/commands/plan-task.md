---
description: "Genera planificacion multi-agente con soporte de loop automatico Ralph Wiggum."
argument-hint: "<descripcion-de-tarea> [--issue=N] [--phase=N] [--loop] [--max-iterations=N] [--completion-promise='TEXT'] [--overnight]"
context: fork
model: opus
ultrathink: true
tools:
  - read
  - write
  - edit
  - bash
  - task
  - askuserquestion
  - todowrite
  - mcp__server-sequential-thinking__sequentialthinking
  - mcp__serena__read_file
  - mcp__serena__search_for_pattern
  - mcp__serena__find_symbol
  - mcp__serena__get_symbols_overview
  - mcp__serena__list_dir
hooks:
  Stop:
    - prompt: |
        Valida que el plan generado incluye:
        1. Fases con agentes expertos asignados (@frontend, @backend, etc.)
        2. Checkpoints de validacion con comandos ejecutables
        3. Code Structure (CREATE/MODIFY/TESTS)
        4. WORKFLOW con instrucciones para Task tool
        5. user_prompt.md actualizado
        6. CADA fase tiene PRE-TAREA con lectura de domain-experts/{domain}.yaml y long_term.yaml
        7. CADA fase tiene POST-TAREA con actualización de domain-experts/{domain}.yaml
        Responde: VALID si todo presente, o INVALID: <razon> si falta algo.
      model: haiku
      once: true
---

# /plan-task

Generador de Planificaciones Multi-Agente v3.0

## Purpose

Genera un plan de ejecución estructurado para orquestación multi-agente donde:

1. **Este comando** analiza la tarea y genera el plan en `.claude/plans/{workflow_id}.md`
2. **Cada fase del plan** será ejecutada por un subagente experto en contexto aislado
3. **La sesión principal** permanece limpia y solo recibe informes

## Variables

```yaml
# Argumentos del comando
ISSUE_ID: "Número del issue (--issue=N)"
PHASE: "Número de fase (--phase=N)"
DESCRIPTION: "Descripción de la tarea"

# Paths de salida
PLAN_FILE: ".claude/plans/{workflow_id}.md"
USER_PROMPT: "user_prompt.md"

# Formato workflow_id
WORKFLOW_ID: "{YYYY-MM-DD}_{descripcion-kebab-case}"
```

**Ejemplo:** `2026-01-10_phase7-drag-drop-calendar`

## Code Structure

**Archivos de Entrada (Leer):**

```
ai_docs/
├── continue_session/CONTINUE_SESSION.md
├── state/PROGRESS.yaml
├── state/DECISIONS.md
├── state/GOAL.md
├── state/PROGRESS.json
└── expertise/
    ├── expert-registry.yaml
    ├── WORKFLOW_EXPERTISE.yaml
    └── domain-experts/
        └── {domain}.yaml


.claude/skills/workflow-task/
├── memoria/long_term.yaml
├── memoria/short_term.json
└── agents/registry.yaml
```

**Archivos de Salida (Escribir):**

```
.claude/plans/{workflow_id}.md
user_prompt.md
```

## Instructions

**Step 1:** Cargar contexto del proyecto (CONTINUE_SESSION.md, PROGRESS.yaml, GOAL.md, DECISIONS.md, PROGRESS.json)

**Step 2:** Cargar memoria del skill (long_term.yaml, registry.yaml)

**Step 3:** Detectar dominio según keywords, cargar expertise correspondiente Y carga memoria de experto (domain-experts/{domain}.yaml)

**Step 4:** Ejecutar Sequential Thinking con mínimo 8 thoughts

**Step 5:** Generar plan en `.claude/plans/{workflow_id}.md`

> **CRÍTICO - PRE/POST-TAREA:**
>
> - TODAS las fases DEBEN incluir PRE-TAREA y POST-TAREA completas
> - El {domain} debe coincidir con el agente de la fase (ver tabla Mapeo Agente → Domain Expert)
> - Nunca omitir la actualización de domain-experts/{domain}.yaml en POST-TAREA
> - Si una fase no tiene PRE/POST-TAREA, el plan es INVÁLIDO

**Step 6:** Actualizar `user_prompt.md` con resumen ejecutivo

**Step 7:** Mostrar output con próximos pasos

## Workflow

### Step 1: Cargar Contexto

Leer estos archivos en paralelo:

| Archivo                                               | Propósito           |
| ----------------------------------------------------- | ------------------- |
| `ai_docs/continue_session/CONTINUE_SESSION.md`        | Estado del proyecto |
| `ai_docs/state/PROGRESS.yaml`                         | Progreso actual     |
| `ai_docs/state/GOAL.md`                               | Objetivo actual     |
| `ai_docs/state/DECISIONS.md`                          | Decisiones previas  |
| `ai_docs/state/PROGRESS.json`                         | Progreso actual     |
| `.claude/skills/workflow-task/memoria/long_term.yaml` | Decisiones previas  |
| `.claude/skills/workflow-task/agents/registry.yaml`   | Agentes disponibles |

### Step 2: Detectar Dominio

Identificar el dominio según keywords en la descripción:

| Dominio  | Keywords                              | Agente               | Expertise       |
| -------- | ------------------------------------- | -------------------- | --------------- |
| backend  | api, endpoint, fastapi, sqlalchemy    | `@backend`           | `backend.yaml`  |
| security | auth, token, jwt, oauth, password     | `@security-reviewer` | `security.yaml` |
| testing  | test, pytest, coverage, mock          | `@testing`           | `testing.yaml`  |
| database | migration, sql, schema, model, rls    | `@backend`           | `database.yaml` |
| infra    | docker, k8s, ci, terraform, deploy    | `@infra`             | `infra.yaml`    |
| frontend | react, component, hook, tsx, tailwind | `@frontend`          | `frontend.yaml` |

### Step 3: Analizar con Sequential Thinking

Usar `mcp__server-sequential-thinking__sequentialthinking` con mínimo 8 thoughts para:

1. Descomponer la tarea en subtareas atómicas
2. Identificar archivos a crear/modificar/eliminar
3. Detectar dependencias entre subtareas
4. Consultar decisiones previas relevantes (Dxxx de long_term.yaml)
5. Identificar riesgos potenciales
6. Asignar agente experto a cada fase

**Si la tarea es ambigua:** Usar `AskUserQuestion` para clarificar antes de continuar.

### Step 4: Generar Plan

Crear archivo `.claude/plans/{workflow_id}.md` con esta estructura:

`````markdown
# Plan de Ejecución: {TITULO}

> **Generado:** {FECHA}
> **Issue:** #{ISSUE_ID}
> **Phase:** {PHASE}

## Variables

ISSUE_ID: "{N}"
PHASE: "{N}"
BRANCH: "{branch-name}"
DOMAIN: "{frontend|backend|testing|...}"

## Purpose

{Descripción clara del objetivo}

## Code Structure

CREATE:

- "path/to/new_file.py"

MODIFY:

- "path/to/existing_file.py"

TESTS:

- "tests/test_feature.py"

## WORKFLOW

### FASE 1: {Nombre}

**Agente:** @{domain}

**Task:**

```
Task(
  subagent_type: "{domain}",
  description: "FASE 1: {nombre corto}",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/{domain}.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones
     - file_patterns_discovered: Patrones útiles

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes

  # CONTEXTO

  - Issue: #{ISSUE_ID}
  - Branch: {BRANCH}
  - Archivos: {lista de archivos}

  # TAREA

  {descripción detallada de la tarea}

  ## Archivos

  CREATE: {archivos nuevos}
  MODIFY: {archivos existentes}

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/{domain}.yaml`:

     En `decisions:` (si tomaste decisiones importantes):
     - context: "{contexto}"
       decision: "{qué y por qué}"
       confidence: 0.XX
       validated_in: "Issue #{ISSUE_ID}"

     En `blockers:` (si encontraste problemas):
     - type: "{tipo}"
       description: "{problema}"
       solution: "{solución}"
       learned_in: "Issue #{ISSUE_ID}"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
```

**Checkpoint:**

- Comando: {comando}
- Criterio: {criterio}

## Checkpoints

| CP  | Fase   | Criterio   | Comando   |
| --- | ------ | ---------- | --------- |
| CP1 | FASE 1 | {criterio} | {comando} |

## Risk Matrix

| Riesgo   | Impacto | Mitigación   |
| -------- | ------- | ------------ |
| {riesgo} | {nivel} | {mitigación} |
`````

### Step 5: Actualizar user_prompt.md

Generar resumen ejecutivo:

```markdown
# Próximas Tareas - Issue #{ISSUE_ID}

> **Fecha:** {FECHA}
> **Branch:** {BRANCH}
> **Plan:** .claude/plans/{workflow_id}.md

## Estado: Phase {N} READY

| Phase | Status  | Agent    | Description |
| ----- | ------- | -------- | ----------- |
| 1     | PENDING | @{agent} | {desc}      |
| N     | PENDING | @testing | Tests       |

## Quick Commands

# Ejecutar el plan

Ejecutar el plan lanzando los subagentes expertos en cada fase (y leyendo y actualizando sus memorias) y actualizando el estado de cada fase.

# Development

make run

# Testing

uv run pytest

**Last Updated:** {ISO_TIMESTAMP}
```

### Step 6: Mostrar Output

Mostrar resumen al usuario:

```
Plan generado exitosamente

Archivos:
- .claude/plans/{workflow_id}.md (NUEVO)
- user_prompt.md (ACTUALIZADO)

Fases: {N}
Agentes: @{agent1}, @{agent2}, @testing

Ejecutar: /workflow-task
```

## Examples

### Ejemplo 1: Feature Backend

```bash
/plan-task "Implementar endpoint de disponibilidad" --issue=70 --phase=5
```

**Output:**

```
Plan generado exitosamente

Archivos:
- .claude/plans/2026-01-10_phase5-availability-endpoint.md (NUEVO)
- user_prompt.md (ACTUALIZADO)

Fases: 3
Agentes: @backend, @testing

Ejecutar: Ejecutar el plan lanzando los subagentes expertos en cada fase, leyendo y actualizando sus memorias y actualizando el estado de cada fase.
```

### Ejemplo 2: Feature Frontend

```bash
/plan-task "Agregar drag and drop al calendario" --issue=70 --phase=7
```

**Output:**

```
Plan generado exitosamente

Archivos:
- .claude/plans/2026-01-10_phase7-drag-drop-calendar.md (NUEVO)
- user_prompt.md (ACTUALIZADO)

Fases: 4
Agentes: @frontend, @testing

Ejecutar: Ejecutar el plan lanzando los subagentes expertos en cada fase, leyendo y actualizando sus memorias y actualizando el estado de cada fase.
```

## Ralph Mode (Loop Automático)

Activa ejecución autónoma con self-correction basada en el plugin [Ralph Wiggum](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum).

### Uso

```bash
# Loop básico
/plan-task "Implementar feature X" --issue=70 --loop

# Con límite de iteraciones
/plan-task "Feature X" --loop --max-iterations=30

# Con completion promise personalizado
/plan-task "Feature X" --loop --completion-promise="FEATURE DONE"

# Modo overnight (sin interacción)
/plan-task "Feature X" --loop --overnight
```

### Parámetros

| Flag | Default | Descripción |
|------|---------|-------------|
| `--loop` | false | Activa modo Ralph Wiggum |
| `--max-iterations` | 50 | Límite máximo de iteraciones |
| `--completion-promise` | "WORKFLOW COMPLETE" | Frase que indica éxito |
| `--overnight` | false | Modo desatendido sin prompts |

### Self-Correction

El sistema detecta automáticamente fallos y retoma desde la fase apropiada:

| Fallo Detectado | Acción | Fase Destino |
|-----------------|--------|--------------|
| Tests fallan | Retry | FASE 3 (Review) |
| Lint falla | Retry | FASE 3 (Review) |
| Build falla | Retry | FASE 2 (Execution) |

### Límites de Seguridad

- **Max 3 reintentos por fase** - Evita loops infinitos en una fase
- **Max 50 iteraciones por defecto** - Límite global de seguridad
- **Logging en modo overnight** - `.claude/skills/workflow-task/logs/`

### Ejemplo con Ralph Mode

```bash
/plan-task "Implementar autenticación JWT con tests" --issue=85 --loop --max-iterations=20 --completion-promise="AUTH COMPLETE"
```

**Flujo:**
1. Genera plan multi-agente
2. Ejecuta fases 0-5
3. Si tests fallan → retry desde fase 3
4. Si lint falla → retry desde fase 3
5. Si build falla → retry desde fase 2
6. Cuando output incluye "AUTH COMPLETE" → EXIT SUCCESS
7. Si alcanza 20 iteraciones → EXIT TIMEOUT

## Report

### Plan Generado

El archivo `.claude/plans/{workflow_id}.md` incluye:

- **Variables:** ISSUE_ID, PHASE, BRANCH, DOMAIN
- **Purpose:** Objetivo claro de la tarea
- **Code Structure:** Archivos CREATE/MODIFY/TESTS
- **WORKFLOW:** Fases con Task() para cada agente (y leyendo y actualizando sus memorias)
- **Checkpoints:** Validaciones con comandos ejecutables
- **Risk Matrix:** Riesgos identificados y mitigaciones

### user_prompt.md

El archivo `user_prompt.md` contiene:

- Estado actual de las fases
- Tabla de phases con agentes asignados
- Quick Commands para desarrollo y testing
- Link al plan generado

## Agentes Disponibles

| Agente               | Dominio  | Especialidad                            |
| -------------------- | -------- | --------------------------------------- |
| `@frontend`          | frontend | React, TypeScript, Tailwind             |
| `@backend`           | backend  | FastAPI, SQLAlchemy, Clean Architecture |
| `@testing`           | testing  | Pytest, mocking, coverage               |
| `@infra`             | infra    | Docker, K8s, CI/CD                      |
| `@security-reviewer` | security | OWASP, auth, validation                 |
| `@gentleman`         | review   | Code review, arquitectura               |

## Mapeo Agente → Domain Expert

| Agente               | domain.yaml     | Notas                        |
| -------------------- | --------------- | ---------------------------- |
| `@backend`           | `backend.yaml`  | APIs, servicios, modelos     |
| `@frontend`          | `frontend.yaml` | Componentes, hooks, UI       |
| `@testing`           | `testing.yaml`  | Tests unitarios, integración |
| `@infra`             | `infra.yaml`    | Docker, CI/CD, deploy        |
| `@security-reviewer` | `security.yaml` | Auth, validación, OWASP      |
| `@gentleman`         | `backend.yaml`  | Default para code review     |

**IMPORTANTE:** El `{domain}` en PRE/POST-TAREA DEBE coincidir con el agente asignado a la fase:

- Si la fase usa `@backend` → PRE/POST-TAREA usa `backend.yaml`
- Si la fase usa `@testing` → PRE/POST-TAREA usa `testing.yaml`
- Y así sucesivamente según la tabla anterior

## Notes

- **context: fork** - Este comando corre en contexto aislado
- **Sequential Thinking** - Mínimo 8 thoughts para análisis profundo
- **Memoria** - Carga y actualiza archivos de expertise por dominio (y las memorias de los subagentes) - ver `ai_docs/expertise/domain-experts/{domain}.yaml` - OBLIGATORIO

## Convención de Formato (Anti-Conflicto Backticks)

Para evitar errores de sintaxis markdown en los planes generados:

1. **Bloque exterior con código anidado:** Usar 5 tildes `~~~~~`
2. **Bloque Task() interno:** Usar 4 backticks
3. **Bloques simples sin anidación:** Usar 3 backticks normales

**Regla:** Si un bloque contiene otros bloques de código, usar tildes para el exterior.

---

**Versión:** 3.2 | **Actualizado:** 2026-01-12
