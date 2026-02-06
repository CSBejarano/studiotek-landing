---
description: Genera prompts optimizados (user + orchestration) para /plan_w_team
argument-hint: [descripcion de la tarea]
model: sonnet
disallowed-tools: Task, Edit, Write, NotebookEdit
---

# Prompt Plan

Genera dos prompts optimizados para ejecutar `/plan_w_team` a partir de la descripcion de tarea del usuario.

## Variables

TASK_DESCRIPTION: $ARGUMENTS

## Instrucciones

- Si no se proporciona `TASK_DESCRIPTION`, DETENERSE y pedir al usuario que la proporcione (AskUserQuestion).
- Lee los archivos de estado del proyecto para obtener contexto: `ai_docs/continue_session/CONTINUE_SESSION.md`, `ai_docs/state/GOAL.md`.
- Explora el codebase (archivos relevantes a la tarea) para incluir contexto tecnico real: rutas, endpoints, entidades, patrones existentes.
- Lee `.claude/agents/team/*.md` para conocer los agentes disponibles (builder, validator).
- Lee `.claude/commands/plan_w_team.md` seccion "Variables" para recordar que $1 es USER_PROMPT y $2 es ORCHESTRATION_PROMPT.

## Workflow

1. **Entender** - Analiza `TASK_DESCRIPTION` e identifica: que se pide, que tipo de tarea es, que archivos del codebase estan involucrados.
2. **Explorar** - Lee los archivos relevantes del codebase para extraer rutas reales, nombres de funciones, endpoints y entidades.
3. **Descomponer** - Divide la tarea en pasos de construccion (build steps). Cada paso es una unidad de trabajo que un builder completa y un validator verifica.
4. **Generar USER_PROMPT** - Prompt completo con: contexto del proyecto, archivos clave con rutas reales, verificaciones/acciones concretas, resultado esperado.
5. **Generar ORCHESTRATION_PROMPT** - Prompt con: composicion del equipo, lista de tareas con patron Builder → Validator alternante, dependencias, criterio de exito.
6. **Presentar** - Muestra ambos prompts en el formato de Reporte.

## Reglas para USER_PROMPT

- Debe ser **autocontenido**: otro agente sin contexto previo debe entender la tarea completa.
- Incluir **rutas de archivos reales** del codebase, no genericas.
- Incluir **patrones existentes** como referencia (ej: "seguir patron de Settings.tsx", "heredar de IRepository[T]").
- Listar **criterios de aceptacion** especificos y medibles.
- Listar **comandos de validacion** concretos (lint, typecheck, build, tests).

## Reglas para ORCHESTRATION_PROMPT (Patron Builder → Validator)

El ORCHESTRATION_PROMPT SIEMPRE debe seguir el patron alternante **Builder → Validator** que exige `/plan_w_team`.

### Principios obligatorios

1. **Alternancia estricta**: Cada paso de builder es seguido INMEDIATAMENTE por un paso de validator. NUNCA acumular multiples builders sin validacion intermedia.
2. **Validator es read-only**: Solo lee archivos, ejecuta comandos de verificacion y reporta PASS/FAIL. NUNCA escribe codigo.
3. **Builder no continua** al siguiente paso hasta que el validator confirme que el paso anterior es correcto.
4. **La ultima tarea SIEMPRE es "Validacion Final Integral"** que verifica TODOS los criterios de aceptacion.

### Estructura de tareas

Cada tarea DEBE tener estos campos:
- **Task ID**: id-en-kebab-case (ej. "build-api", "validate-api")
- **Depends On**: ID de la tarea de la que depende (o "none")
- **Assigned To**: nombre del builder o validator
- **Agent Type**: tipo de subagente (builder, validator, frontend, backend, etc.)
- **Parallel**: true/false

### Patron secuencial (por defecto)

```
Tarea 1: Builder  → construye paso A         (Depends On: none)
Tarea 2: Validator → valida paso A            (Depends On: build-step-a)
Tarea 3: Builder  → construye paso B          (Depends On: validate-step-a)
Tarea 4: Validator → valida paso B            (Depends On: build-step-b)
Tarea N: Validator → validacion final integral (Depends On: validate-step-b)
```

### Patron paralelo (solo si los builders son independientes)

Si dos pasos de builder son completamente independientes (no comparten archivos ni dependencias), pueden ejecutarse en paralelo. Pero AMBOS deben validarse antes de continuar:

```
Tarea 1a: Builder-A → paso A (paralelo)    (Depends On: none, Parallel: true)
Tarea 1b: Builder-B → paso B (paralelo)    (Depends On: none, Parallel: true)
Tarea 2:  Validator → valida A + B          (Depends On: build-step-a Y build-step-b)
Tarea 3:  Builder  → paso C                 (Depends On: validate-step-ab)
Tarea 4:  Validator → valida paso C          (Depends On: build-step-c)
Tarea N:  Validator → validacion final       (Depends On: validate-step-c)
```

### Composicion del equipo

- **Minimo**: 1 Builder + 1 Validator.
- **Multiples builders**: Solo si la tarea requiere especialidades distintas (ej: builder-backend + builder-frontend). Cada uno con nombre unico prefijado "builder-".
- **Validator**: Normalmente 1 solo, compartido. Nombre prefijado "validator-".
- **Tipos de agente**: Usar los de `.claude/agents/team/` (builder, validator). Para agentes especializados usar subagent_type del registro de agentes (frontend, backend, etc.).

### Limites

- Maximo 8 tareas (4 pares builder-validator + validacion final). Si la tarea es simple, 3-5 bastan.
- Si un paso de builder es trivial (< 5 minutos), considerar fusionarlo con el siguiente.
- La validacion final integral NO se omite nunca, incluso si solo hay 1 paso de builder.

## Reporte

```
## Prompts para /plan_w_team

### USER_PROMPT ($1)

<prompt completo listo para copiar>

### ORCHESTRATION_PROMPT ($2)

<prompt completo listo para copiar, siguiendo patron Builder → Validator alternante>

Resumen de tareas:
| # | Tipo | Tarea | Depends On | Assigned To |
|---|------|-------|------------|-------------|
| 1 | Builder | ... | none | builder-xxx |
| 2 | Validator | ... | 1 | validator-qa |
| 3 | Builder | ... | 2 | builder-xxx |
| 4 | Validator | ... | 3 | validator-qa |
| N | Validator | Validacion Final | N-1 | validator-qa |

### Ejecucion

/plan_w_team "<resumen corto del user prompt>" "<resumen corto del orchestration prompt>"
```
