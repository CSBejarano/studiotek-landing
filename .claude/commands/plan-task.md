---
description: "Planificacion multi-agente: genera plan detallado con TDD, seguridad y review. NO ejecuta."
argument-hint: "<descripcion-tarea> [--issue=N] [--mode=auto|fast|full]"
context: fork
model: opus
ultrathink: true
tools:
  - read
  - write
  - edit
  - glob
  - grep
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

# /plan-task v5.0 - Planificacion Multi-Agente (Solo Planifica)

## Purpose

Comando de **planificacion solamente**. Genera un plan detallado y estructurado para ejecutar tareas complejas con agentes especializados.

**IMPORTANTE:** Este comando NO ejecuta el plan. Solo genera los documentos necesarios.


## Arquitectura

```
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
```

## Variables

```yaml
# Argumentos
ISSUE_ID: "Numero del issue (--issue=N)"
MODE: "auto | fast | full (default: auto)"
DESCRIPTION: "Descripcion de la tarea"

# Paths de salida
PLAN_FILE: "ai_docs/plans/{workflow_id}.md"
WORKFLOW_STATUS: "ai_docs/state/WORKFLOW-STATUS.yaml"
USER_PROMPT: "user_prompt.md"

# Formato workflow_id
WORKFLOW_ID: "{YYYY-MM-DD}_{descripcion-kebab-case}"
```

## Deteccion Automatica de Complejidad

| Factor | Puntos | Descripcion |
|--------|--------|-------------|
| **Keywords criticos** | +2 | auth, migration, security, payment |
| **Multi-dominio** | +2 | frontend + backend, fullstack |
| **Archivos afectados** | +1 por cada 5 | Mas de 5 archivos = +1 |
| **Dependencias externas** | +1 | APIs externas, servicios |
| **Base de datos** | +1 | Cambios de schema, RLS |
| **Tests existentes** | -1 | Ya hay cobertura |

**Umbral:** Complejidad > 4 -> Modo FULL

## Workflow

### Fase -3: Context Acquisition

Leer en paralelo:

| Archivo | Proposito |
|---------|-----------|
| `ai_docs/memoria/long_term.yaml` | Decisiones previas (Dxxx) |
| `ai_docs/expertise/expert-registry.yaml` | Agentes disponibles |

### Fase -2: Complexity Detection + Domain Analysis

1. **Calcular complejidad** usando la tabla de factores
2. **Detectar dominio(s)** segun keywords:

| Dominio | Keywords | Agente Principal |
|---------|----------|------------------|
| backend | api, endpoint, fastapi, sqlalchemy | @backend |
| security | auth, token, jwt, oauth, password | @security-reviewer |
| testing | test, pytest, coverage, mock | @testing |
| database | migration, sql, schema, model, rls | @backend |
| infra | docker, k8s, ci, terraform, deploy | @infra |
| frontend | react, component, hook, tsx, tailwind | @frontend |

### Fase -1: Sequential Thinking (CRITICO)

Ejecutar `mcp__server-sequential-thinking__sequentialthinking` con **minimo 8 thoughts**:

1. Descomponer tarea en subtareas atomicas
2. Identificar archivos CREATE/MODIFY/DELETE
3. Detectar dependencias entre subtareas
4. **Pre-mortem:** Que puede fallar?
5. Consultar decisiones previas (Dxxx de long_term.yaml)
6. Asignar agentes a cada fase
7. Definir checkpoints con comandos ejecutables
8. Disenar TDD Test Plan

### Fase 0: Generar Outputs

#### 1. Crear WORKFLOW-STATUS.yaml

```yaml
# ai_docs/state/WORKFLOW-STATUS.yaml
workflow_id: "{workflow_id}"
issue: {ISSUE_ID}
mode: {FAST|FULL}
started_at: null
iteration: 0
max_iterations: 50

phases:
  - id: 1
    name: "{nombre fase}"
    agent: "@{domain}"
    status: PENDING
    checkpoint:
      command: "{comando verificacion}"
      expected: "{resultado esperado}"
    retries: 0
    max_retries: 3
    prompt: |
      # PRE-TAREA
      Leer ai_docs/expertise/domain-experts/{domain}.yaml

      # CONTEXTO
      Issue: #{ISSUE_ID}

      # TAREA
      {descripcion detallada de la fase}

      ## Archivos
      CREATE: {lista}
      MODIFY: {lista}

      # POST-TAREA
      1. Generar informe de progreso
      2. Actualizar memoria del agente en ai_docs/expertise/domain-experts/{domain}.yaml:
         - Agregar decisiones tomadas (decisions[])
         - Agregar blockers resueltos (blockers[])
         - Incrementar tasks_handled
         - Actualizar updated_at

  # ... mas fases ...

  - id: N
    name: "TDD Tests"
    agent: "@testing"
    status: PENDING
    checkpoint:
      command: "uv run pytest --cov --cov-fail-under=80"
      expected: "PASSED"
    prompt: |
      Ejecutar tests definidos en TDD Test Plan.
      Verificar coverage >= 80%
      
      # PRE-TAREA
      Leer ai_docs/expertise/domain-experts/{domain}.yaml

      # CONTEXTO
      Issue: #{ISSUE_ID}

      # TAREA
      {descripcion detallada de la fase}

      ## Archivos
      CREATE: {lista}
      MODIFY: {lista}

      # POST-TAREA
      1. Generar informe de progreso
      2. Actualizar memoria del agente en ai_docs/expertise/domain-experts/{domain}.yaml:
         - Agregar decisiones tomadas (decisions[])
         - Agregar blockers resueltos (blockers[])
         - Incrementar tasks_handled
         - Actualizar updated_at

  - id: N+1
    name: "Security Validation"
    agent: "@security-reviewer"
    status: PENDING
    checkpoint:
      command: "bandit -r src/ -ll"
      expected: "No High severity"
    prompt: |
      Validar OWASP checklist implementado.
      
      # PRE-TAREA
      Leer ai_docs/expertise/domain-experts/{domain}.yaml

      # CONTEXTO
      Issue: #{ISSUE_ID}

      # TAREA
      {descripcion detallada de la fase}

      ## Archivos
      CREATE: {lista}
      MODIFY: {lista}

      # POST-TAREA
      1. Generar informe de progreso
      2. Actualizar memoria del agente en ai_docs/expertise/domain-experts/{domain}.yaml:
         - Agregar decisiones tomadas (decisions[])
         - Agregar blockers resueltos (blockers[])
         - Incrementar tasks_handled
         - Actualizar updated_at

  - id: FINAL
    name: "Code Review"
    agent: "@gentleman"
    status: PENDING
    checkpoint:
      command: "echo APPROVED"
      expected: "APPROVED"
    prompt: |
      Review arquitectonico final.
      Verdict: APPROVED | NEEDS_REVISION | REJECTED

      # PRE-TAREA
      Leer ai_docs/expertise/domain-experts/{domain}.yaml

      ## Purpose

      {Descripcion clara del objetivo}

      # CONTEXTO
      Issue: #{ISSUE_ID}

      # TAREA
      {descripcion detallada de la fase}

      ## WORKFLOW

      {Descripcion e instrucciones para ejecutar cada fase con agente asignado leyendo sus memorias y actualizando sus memorias /ai_docs/expertise/domain experts/{domain}.yaml (decisions[], blockers[], etc), ejecutando comandos de checkpoint y actualizando WORKFLOW-STATUS.yaml}

      ## Archivos
      CREATE: {lista}
      MODIFY: {lista}

      # POST-TAREA
      1. Generar informe de progreso
      2. Actualizar memoria del agente en ai_docs/expertise/domain-experts/{domain}.yaml:
         - Agregar decisiones tomadas (decisions[])
         - Agregar blockers resueltos (blockers[])
         - Incrementar tasks_handled
         - Actualizar updated_at

completion:
  all_completed: false
  completion_promise: "WORKFLOW COMPLETE"
  final_status: null
```

#### 2. Crear Plan .md

```markdown
# Plan de Ejecucion: {TITULO}

> **Generado:** {FECHA}
> **Issue:** #{ISSUE_ID}
> **Mode:** {FAST|FULL}
> **Complejidad:** {N}/10

## Variables

{yaml con workflow_id, branch, domain, etc}

## Purpose

{Descripcion clara del objetivo}

## TDD Test Plan

{Tests a crear ANTES del codigo}

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
{tabla con 10 items}

## Architectural Review

{Verdict inicial}

## Code Structure

CREATE:
- {archivos nuevos}

MODIFY:
- {archivos existentes}

TESTS:
- {archivos de tests}

## WORKFLOW

{Descripcion e instrucciones para ejecutar cada fase con agente asignado leyendo sus memorias y actualizando sus memorias /ai_docs/expertise/domain-experts/{domain}.yaml (decisions[], blockers[], etc), ejecutando comandos de checkpoint y actualizando WORKFLOW-STATUS.yaml}

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
{tabla de riesgos}

## Checkpoints

| CP | Fase | Criterio | Comando |
{tabla de checkpoints}
```

#### 3. Actualizar user_prompt.md

```markdown
# Proximas Tareas - {TITULO}

> **Fecha:** {FECHA}
> **Plan:** ai_docs/plans/{workflow_id}.md
> **Mode:** {FAST|FULL}
> **Estado:** READY FOR EXECUTION

## Fases

| Phase | Status | Agent | Description |
|-------|--------|-------|-------------|
{tabla con todas las fases}

## Para Ejecutar

Usa el comando `/ralph-execute [--max-iterations=N] [--resume]` para ejecutar este plan.

El comando leera el WORKFLOW-STATUS.yaml y ejecutara cada fase
secuencialmente con checkpoints automaticos.

## Quick Commands

# Ver plan completo
cat ai_docs/plans/{workflow_id}.md

# Ver estado del workflow
cat ai_docs/state/WORKFLOW-STATUS.yaml

# Ejecutar el plan
/ralph-execute [--max-iterations=N] [--resume]
```

## Mensaje Final

Al terminar la planificacion, mostrar:

```
============================================================
PLAN GENERADO EXITOSAMENTE
============================================================

Archivos creados:
- ai_docs/plans/{workflow_id}.md
- ai_docs/state/WORKFLOW-STATUS.yaml
- user_prompt.md (actualizado)

Fases planificadas: {N}
Agentes involucrados: {lista de @agentes}
Modo: {FAST|FULL}

------------------------------------------------------------
SIGUIENTE PASO
------------------------------------------------------------

Para ejecutar este plan, usa:

  /ralph-execute [--max-iterations=N] [--resume]

El comando ejecutara cada fase secuencialmente con:
- TodoList tracking en tiempo real
- Checkpoints automaticos por fase
- Self-correction con retries (max 3)
- Actualizacion de memorias de expertos

============================================================
```

## Diferencias con v4.x

| Aspecto | v4.x | v5.0 |
|---------|------|------|
| Ejecuta fases | Si (en fork) | No |
| Ralph Loop | Integrado | Separado en /ralph-execute |
| Hooks funcionan | No (fork aislado) | Si (en /ralph-execute) |
| Memorias actualizan | No | Si (en /ralph-execute) |
| Tiempo | 20-30 min | 1-5 min (solo plan) |

## Examples

### Ejemplo 1: Tarea Simple

```bash
/plan-task "Agregar boton de logout" --issue=80
```

**Output:**
- ai_docs/plans/2026-01-16_boton-logout.md
- ai_docs/state/WORKFLOW-STATUS.yaml (4 fases)
- user_prompt.md actualizado

### Ejemplo 2: Feature Compleja

```bash
/plan-task "Implementar autenticacion OAuth2 con Google" --issue=85
```

**Output:**
- Plan con 8 fases
- TDD Test Plan detallado
- Security Checklist OWASP completo
- Mensaje: "Para ejecutar: /ralph-execute"

## Notes

- **context: fork** - Planificacion aislada, no contamina sesion
- **ultrathink: true** - Sequential thinking con minimo 8 thoughts
- **NO ejecuta** - Solo genera documentos
- **Separacion de responsabilidades** - Planificar != Ejecutar

---

**Version:** 5.0.0 | **Actualizado:** 2026-01-16

### Changelog

#### v5.0.0 (2026-01-16)
- **BREAKING:** Separacion completa de planificacion y ejecucion
- Removed: Ejecucion de fases (movido a /ralph-execute)
- Removed: Flags --loop, --overnight, --max-iterations
- Added: Mensaje final con instrucciones para /ralph-execute
- Added: Campo `prompt` en cada fase de WORKFLOW-STATUS.yaml
- Optimized: Solo genera documentos, no ejecuta Task()
- Fixed: Hooks ahora funcionan (en /ralph-execute)

#### v4.1.0 (2026-01-15)
- Previous version with integrated execution
