---
description: "Ejecuta planes generados por /plan-task con TodoList tracking y checkpoints automaticos"
argument-hint: "[--max-iterations=N] [--resume]"
context: current
model: opus
tools:
  - read
  - write
  - edit
  - bash
  - task
  - todowrite
  - glob
  - grep
  - mcp__server-sequential-thinking__sequentialthinking
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

# /ralph-execute v1.0 - Ejecutor de Planes (Ralph Mode)

## Purpose

Ejecuta planes generados por `/plan-task` en la **sesion principal**. Esto asegura que:

- Los hooks (SubagentStop, PostToolUse) funcionan correctamente
- Las memorias de expertos se actualizan automaticamente
- El usuario ve el progreso en tiempo real via TodoList
- Se pueden pausar/resumir workflows

## Arquitectura

```
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
```

## Variables

```yaml
# Argumentos
MAX_ITERATIONS: "Limite maximo de iteraciones (default: 50)"
RESUME: "Continuar workflow existente (default: true)"

# Paths
WORKFLOW_STATUS: "ai_docs/state/WORKFLOW-STATUS.yaml"
```

## Workflow

### Paso 1: Cargar Estado

```bash
# Verificar que existe un plan
test -f ai_docs/state/WORKFLOW-STATUS.yaml
```

Leer `ai_docs/state/WORKFLOW-STATUS.yaml` y extraer:
- workflow_id
- phases (lista de fases)
- iteration actual
- max_iterations

### Paso 2: Crear TodoList

Usar `TodoWrite` para crear la lista de tareas:

```python
todos = []
for phase in phases:
    todos.append({
        "content": f"FASE {phase.id}: {phase.name}",
        "status": "pending" if phase.status == "PENDING" else phase.status.lower(),
        "activeForm": f"Ejecutando {phase.name}"
    })
TodoWrite(todos)
```

### Paso 3: Loop Principal

```
WHILE iteration < max_iterations:
    iteration += 1

    # Encontrar siguiente fase
    phase = FIND_FIRST(phases WHERE status IN ["PENDING", "FAILED"])

    IF phase IS NULL:
        # Todas completadas!
        BREAK con "WORKFLOW COMPLETE"

    # Marcar en progreso
    phase.status = "IN_PROGRESS"
    phase.started_at = NOW()
    TodoWrite: marcar fase como in_progress
    SAVE(WORKFLOW-STATUS.yaml)

    # Ejecutar agente
    result = Task(
        subagent_type: phase.agent.replace("@", ""),
        description: f"FASE {phase.id}: {phase.name}",
        prompt: phase.prompt,
        update_memory: True
    )

    # Ejecutar checkpoint
    checkpoint_result = Bash(phase.checkpoint.command)

    IF checkpoint_passes(checkpoint_result, phase.checkpoint.expected):
        phase.status = "COMPLETED"
        phase.completed_at = NOW()
        TodoWrite: marcar fase como completed
    ELSE:
        phase.retries += 1
        IF phase.retries >= phase.max_retries:
            phase.status = "BLOCKED"
            TodoWrite: marcar fase como blocked
        ELSE:
            phase.status = "FAILED"  # Will retry next iteration

    SAVE(WORKFLOW-STATUS.yaml)
```

### Paso 4: Verificar Completitud

```python
all_completed = all(p.status == "COMPLETED" for p in phases)
any_blocked = any(p.status == "BLOCKED" for p in phases)

if all_completed:
    completion.final_status = "SUCCESS"
    print("WORKFLOW COMPLETE")
elif any_blocked:
    completion.final_status = "PARTIAL"
    print(f"WORKFLOW BLOCKED at {blocked_phase.name}")
elif iteration >= max_iterations:
    completion.final_status = "TIMEOUT"
    print(f"WORKFLOW TIMEOUT after {iteration} iterations")
```

### Paso 5: Guardar Estado Final

```python
# Actualizar el plan
SAVE (ai_docs/state/WORKFLOW-STATUS.yaml)
```

Actualizar `ai_docs/state/WORKFLOW-STATUS.yaml`:
- workflow_id
- phases (lista de fases)
- iteration actual
- max_iterations
- final_status

### Paso 6: Actualizar memoria de expertos

```python
# Actualizar la memoria de expertos
SAVE(ai_docs/memoria/long_term.yaml)
```

Actualizar `ai_docs/memoria/long_term.yaml`:
- workflows_completed
- decisions
- blockers
- velocity
- tools
- history

## Checkpoints por Tipo de Fase

| Tipo de Fase | Comando Checkpoint | Criterio de Exito |
|--------------|-------------------|-------------------|
| Backend/Frontend | `uv run pytest tests/unit/ -v` | "passed", no "FAILED" |
| Tests | `uv run pytest --cov --cov-fail-under=80` | Exit code 0 |
| Security | `bandit -r src/ -ll` | No "High" severity |
| Review | `grep 'APPROVED' FINAL-REVIEW.md` | Exit code 0 |
| Build | `make build` o `npm run build` | Exit code 0 |
| Files exist | `test -f path/to/file` | Exit code 0 |

## Mapeo Agente -> Domain Expert

| Agente en YAML | subagent_type | Domain YAML |
|----------------|---------------|-------------|
| @backend | backend | backend.yaml |
| @frontend | frontend | frontend.yaml |
| @testing | testing | testing.yaml |
| @infra | infra | infra.yaml |
| @security-reviewer | security-reviewer | security.yaml |
| @gentleman | gentleman | backend.yaml |
| @quality-reviewer | quality-reviewer | quality-reviewer.yaml |



## Ejemplo de TodoList Durante Ejecucion

```
# Iteracion 1
[ ] FASE 1: Backend Implementation
[ ] FASE 2: TDD Tests Execution
[ ] FASE 3: Security Validation
[ ] FASE 4: Code Review

# Iteracion 5 (FASE 1 completada, FASE 2 en progreso)
[x] FASE 1: Backend Implementation
[>] FASE 2: TDD Tests Execution
[ ] FASE 3: Security Validation
[ ] FASE 4: Code Review

# Final (exito)
[x] FASE 1: Backend Implementation
[x] FASE 2: TDD Tests Execution
[x] FASE 3: Security Validation
[x] FASE 4: Code Review

WORKFLOW COMPLETE
```

## Self-Correction con Retries

| Fallo Detectado | Accion | Max Retries |
|-----------------|--------|-------------|
| Tests fallan | Analiza error, corrige | 3 |
| Security falla | Implementa mitigacion | 3 |
| @gentleman REJECTED | Revisa feedback, corrige | 2 |
| Build falla | Corrige errores de build | 3 |
| Checkpoint timeout | Retry con mas tiempo | 2 |

## Mensajes de Estado

### Al Iniciar

```
============================================================
RALPH MODE - Ejecutando Plan
============================================================

Workflow: {workflow_id}
Fases: {total_phases}
Modo: {mode}

Iniciando ejecucion...
============================================================
```

### Al Completar Fase

```
------------------------------------------------------------
FASE {id} COMPLETADA: {name}
Memoria de experto actualizada: {domain_expert}
Checkpoint: PASSED
Tiempo: {duration}
------------------------------------------------------------
```

### Al Finalizar

```
============================================================
WORKFLOW {STATUS}
============================================================

Fases completadas: {N}/{total}
Iteraciones: {iteration}
Tiempo total: {duration}
Memorias de expertos actualizadas: {domain_experts}

{Si SUCCESS: "Todos los checkpoints pasaron"}
{Si PARTIAL: "Fase bloqueada: {blocked_phase}"}
{Si TIMEOUT: "Limite de iteraciones alcanzado"}
============================================================
```

## Examples

### Ejemplo 1: Ejecutar Plan Existente

```bash
/ralph-execute
```

Lee WORKFLOW-STATUS.yaml y ejecuta todas las fases pendientes.

### Ejemplo 2: Resumir Despues de Interrupcion

```bash
/ralph-execute --resume
```

Continua desde la ultima fase completada.

### Ejemplo 3: Con Limite de Iteraciones

```bash
/ralph-execute --max-iterations=30
```

Se detiene despues de 30 iteraciones aunque no haya terminado.

## Notes

- **context: current** - Ejecuta en sesion principal (hooks funcionan)
- **Persistencia** - El estado se guarda en cada iteracion
- **Pausable** - Ctrl+C detiene limpiamente, se puede resumir
- **Hooks activos** - SubagentStop actualiza memorias automaticamente

## Diferencias con Ralph Mode en plan-task v4.x

| Aspecto | v4.x (integrado) | v1.0 (separado) |
|---------|------------------|-----------------|
| Contexto | fork (aislado) | current (principal) |
| Hooks | No funcionan | Funcionan |
| Memorias | No actualizan | Actualizan |
| Visibilidad | Oculto en fork | TodoList visible |
| Resumible | No | Si |

---

**Version:** 1.0.0 | **Actualizado:** 2026-01-16

### Changelog

#### v1.0.0 (2026-01-16)
- Initial release
- Separado de /plan-task
- Ejecuta en sesion principal
- TodoList tracking
- Checkpoints automaticos
- Self-correction con retries
