---
description: Crea un plan de implementación de ingeniería conciso basado en los requisitos del usuario y lo guarda en el directorio ai_docs.
argument-hint: [user_prompt] [orchestration_prompt]
model: opus
disallowed-tools: Task, EnterPlanMode
hooks:
  Stop:
    - hooks:
        - type: command
          command: >-
            uv run $CLAUDE_PROJECT_DIR/.claude/hooks/validators/validate_new_file.py
            --directory ai_docs 
            --extension .md
        - type: command
          command: >-
            uv run
            $CLAUDE_PROJECT_DIR/.claude/hooks/validators/validate_file_contains.py
            --directory ai_docs
            --extension .md
            --contains '## Task Description'
            --contains '## Objective'
            --contains '## Relevant Files'
            --contains '## Step by Step Tasks'
            --contains '## Acceptance Criteria'
            --contains '## Team Orchestration'
            --contains '### Team Members'
---

# Plan With Team (Planificar con Equipo)

Crea un plan de implementación detallado basado en los requisitos del usuario proporcionados a través de la variable `USER_PROMPT`. Analiza la solicitud, reflexiona sobre el enfoque de implementación y guarda un documento de especificaciones completo en `PLAN_OUTPUT_DIRECTORY/<nombre-del-plan>.md` que pueda usarse como guía para el trabajo de desarrollo real. Sigue las `Instrucciones` y trabaja a través del `Flujo de trabajo` para crear el plan.

## Variables

**USER_PROMPT:** $1
**ORCHESTRATION_PROMPT:** $2 - (Opcional) Guía para el ensamblaje del equipo, estructura de tareas y estrategia de ejecución.
**PLAN_OUTPUT_DIRECTORY:** `ai_docs/plans/`
**TEAM_MEMBERS:** `.claude/agents/team/*.md`
**GENERAL_PURPOSE_AGENT:** `general-purpose`

## Instrucciones

* **SOLO PLANIFICACIÓN**: NO construyas, escribas código ni despliegues agentes. Tu única salida es un documento de plan guardado en `PLAN_OUTPUT_DIRECTORY`.
* Si no se proporciona `USER_PROMPT`, detente y pide al usuario que lo proporcione.
* Si se proporciona `ORCHESTRATION_PROMPT`, úsalo para guiar la composición del equipo, la granularidad de las tareas, la estructura de dependencias y las decisiones de ejecución paralela/secuencial.
* Analiza cuidadosamente los requisitos del usuario proporcionados en la variable `USER_PROMPT`.
* Determina el tipo de tarea (tarea rutinaria|característica|refactorización|corrección|mejora) y la complejidad (simple|media|compleja).
* Piensa profundamente (ultrathink) sobre el mejor enfoque para implementar la funcionalidad solicitada o resolver el problema.
* Comprende el código base directamente sin subagentes para entender los patrones y la arquitectura existentes.
* Sigue el formato de plan a continuación para crear un plan de implementación exhaustivo.
* Incluye todas las secciones requeridas y las secciones condicionales basadas en el tipo de tarea y complejidad.
* Genera un nombre de archivo descriptivo en formato `kebab-case` basado en el tema principal del plan.
* Guarda el plan de implementación completo en `PLAN_OUTPUT_DIRECTORY/<nombre-descriptivo>.md`.
* Asegúrate de que el plan sea lo suficientemente detallado como para que otro desarrollador pueda seguirlo para implementar la solución.
* Incluye ejemplos de código o pseudocódigo donde sea apropiado para aclarar conceptos complejos.
* Considere casos extremos, manejo de errores y preocupaciones de escalabilidad
* Comprende tu rol como líder del equipo. Consulta la sección de `Orquestación del Equipo` para más detalles.

### Patrón Builder-Validator (OBLIGATORIO)

Todas las tareas DEBEN seguir el patrón alternante **Builder → Validator**. Nunca acumules múltiples tareas de builder sin validación intermedia.

**Reglas:**
1. **Cada entrega de un Builder es seguida por una validación de un Validator** antes de continuar al siguiente paso.
2. **El Validator es read-only**: solo lee archivos, ejecuta comandos de verificación y reporta. NUNCA escribe código.
3. **El Builder no continúa** al siguiente paso hasta que el Validator confirme que el paso anterior es correcto.
4. **La última tarea SIEMPRE es una Validación Final Integral** que verifica TODOS los criterios de aceptación.

**Patrón de tareas:**
```
Tarea 1: Builder  → construye/implementa paso A
Tarea 2: Validator → valida paso A
Tarea 3: Builder  → construye/implementa paso B (depende de Tarea 2)
Tarea 4: Validator → valida paso B
...
Tarea N: Validator → validación final integral (depende de Tarea N-1)
```

**Excepción para tareas paralelas:** Si dos pasos de builder son independientes, pueden ejecutarse en paralelo, pero AMBOS deben validarse antes de continuar:
```
Tarea 1a: Builder → paso A (paralelo)
Tarea 1b: Builder → paso B (paralelo)
Tarea 2:  Validator → valida paso A + paso B (depende de 1a Y 1b)
```

### Orquestación del Equipo (Team Orchestration)

Como líder del equipo, tienes acceso a herramientas potentes para coordinar el trabajo entre múltiples agentes. NUNCA escribes código directamente; orquestas a los miembros del equipo usando estas herramientas.

#### Herramientas de Gestión de Tareas

**TaskCreate** - Crea tareas en la lista de tareas compartida:

```typescript
TaskCreate({
  subject: "Implementar autenticación de usuario",
  description: "Crear endpoints de login/logout con tokens JWT. Ver ai_docs/plans/auth-plan.md para detalles.",
  activeForm: "Implementando autenticación"  // Se muestra en el spinner de la interfaz cuando está in_progress
})
// Devuelve: taskId (ej. "1")

```

**TaskUpdate** - Actualiza el estado de la tarea, la asignación o las dependencias:

```typescript
TaskUpdate({
  taskId: "1",
  status: "in_progress",  // pending → in_progress → completed
  owner: "builder-auth"   // Asignar a un miembro específico del equipo
})

```

**TaskList** - Ver todas las tareas y su estado:

```typescript
TaskList({})
// Devuelve: Array de tareas con id, asunto, estado, propietario (owner), blockedBy

```

**TaskGet** - Obtener detalles completos de una tarea específica:

```typescript
TaskGet({ taskId: "1" })
// Devuelve: Tarea completa incluyendo la descripción

```

#### Dependencias de Tareas

Usa `addBlockedBy` para crear dependencias secuenciales; las tareas bloqueadas no pueden comenzar hasta que las dependencias se completen:

```typescript
// La Tarea 2 depende de la Tarea 1
TaskUpdate({
  taskId: "2",
  addBlockedBy: ["1"]  // Tarea 2 bloqueada hasta que la Tarea 1 finalice
})

// La Tarea 3 depende tanto de la Tarea 1 como de la Tarea 2
TaskUpdate({
  taskId: "3",
  addBlockedBy: ["1", "2"]
})

```

Ejemplo de cadena de dependencias (patrón Builder → Validator):

```
Tarea 1: Builder  - Implementar paso A    → sin dependencias
Tarea 2: Validator - Validar paso A        → blockedBy: ["1"]
Tarea 3: Builder  - Implementar paso B    → blockedBy: ["2"]
Tarea 4: Validator - Validar paso B        → blockedBy: ["3"]
Tarea 5: Validator - Validación final      → blockedBy: ["4"]

```

#### Asignación de Propietario (Owner)

Asigna tareas a miembros específicos del equipo para una responsabilidad clara:

```typescript
// Asignar tarea a un constructor específico
TaskUpdate({
  taskId: "1",
  owner: "builder-api"
})

// Los miembros del equipo revisan sus asignaciones
TaskList({})  // Filtrar por owner para encontrar el trabajo asignado

```

#### Despliegue de Agentes con la Herramienta Task

**Task** - Desplegar un agente para realizar el trabajo:

```typescript
Task({
  description: "Implementar endpoints de autenticación",
  prompt: "Implementa los endpoints de autenticación según se especifica en la Tarea 1...",
  subagent_type: "general-purpose",
  model: "opus",  // u "opus" para trabajo complejo, "haiku" para tareas MUY simples
  run_in_background: false  // true para ejecución paralela
})
// Devuelve: agentId (ej. "a1b2c3")

```

#### Patrón de Reanudación (Resume Pattern)

Almacena el `agentId` para continuar el trabajo de un agente conservando el contexto:

```typescript
// Primer despliegue - el agente trabaja en la tarea inicial
Task({
  description: "Construir servicio de usuarios",
  prompt: "Crea el servicio de usuarios con operaciones CRUD...",
  subagent_type: "general-purpose"
})
// Devuelve: agentId: "abc123"

// Más tarde - reanudar el MISMO agente con todo el contexto preservado
Task({
  description: "Continuar servicio de usuarios",
  prompt: "Ahora añade validación de entrada a los endpoints que creaste...",
  subagent_type: "general-purpose",
  resume: "abc123"  // Continúa con el contexto previo
})

```

Cuándo reanudar vs. empezar de cero:

* **Resume**: Continuar trabajo relacionado, el agente necesita contexto previo.
* **Fresh**: Tarea no relacionada, se prefiere un lienzo limpio.

#### Ejecución Paralela

Ejecuta múltiples agentes simultáneamente con `run_in_background: true`:

```typescript
// Lanzar múltiples agentes en paralelo
Task({
  description: "Construir endpoints de API",
  prompt: "...",
  subagent_type: "general-purpose",
  run_in_background: true
})
// Devuelve inmediatamente el agentId y la ruta de output_file

Task({
  description: "Construir componentes de frontend",
  prompt: "...",
  subagent_type: "general-purpose",
  run_in_background: true
})
// Ambos agentes trabajan ahora simultáneamente

// Comprobar progreso
TaskOutput({
  task_id: "agentId",
  block: false,  // comprobación no bloqueante
  timeout: 5000
})

// Esperar a la finalización
TaskOutput({
  task_id: "agentId",
  block: true,  // se bloquea hasta que termine
  timeout: 300000
})

```

#### Flujo de Orquestación (Builder-Validator)

1. **Crear TODAS las tareas** con `TaskCreate` siguiendo el patrón Builder → Validator alternante.
2. **Establecer dependencias** con `TaskUpdate` + `addBlockedBy`. Cada Validator depende de su Builder. Cada Builder depende del Validator anterior.
3. **Asignar propietarios** con `TaskUpdate` + `owner` (builders y validators).
4. **Desplegar Builder** con `Task` para ejecutar el paso de construcción.
5. **Desplegar Validator** con `Task` para verificar la entrega del Builder. El Validator NO escribe código.
6. **Si Validator reporta problemas**: Reanudar Builder con `Task` + `resume` para corregir.
7. **Si Validator aprueba**: Continuar al siguiente par Builder-Validator.
8. **Repetir** hasta completar todos los pasos.
9. **Validación Final Integral**: El Validator verifica TODOS los criterios de aceptación.

## Flujo de Trabajo

IMPORTANTE: **SOLO PLANIFICACIÓN** - No ejecutes, construyas ni despliegues. La salida es un documento de plan.

1. **Analizar Requisitos**: Procesa el `USER_PROMPT` para entender el problema central y el resultado deseado.
2. **Comprender el Código Base**: Sin subagentes, entiende directamente los patrones existentes, la arquitectura y los archivos relevantes.
3. **Diseñar la Solución**: Desarrolla el enfoque técnico incluyendo decisiones de arquitectura y estrategia de implementación.
4. **Definir Miembros del Equipo**: Usa `ORCHESTRATION_PROMPT` (si se proporciona) para guiar la composición del equipo. Identifícalos desde `.claude/agents/team/*.md` o usa `general-purpose`. Documéntalo en el plan.
5. **Definir Tareas Paso a Paso**: Estructura las tareas siguiendo el patrón Builder → Validator alternante obligatorio. Cada paso de construcción va seguido de un paso de validación. Usa `ORCHESTRATION_PROMPT` (si se proporciona) para guiar la granularidad. Documéntalo en el plan.
6. **Generar Nombre de Archivo**: Crea un nombre descriptivo en `kebab-case` basado en el tema principal del plan.
7. **Guardar Plan**: Escribe el plan en `PLAN_OUTPUT_DIRECTORY/<nombre-archivo>.md`.
8. **Guardar e Informar**: Sigue la sección `Reporte` para escribir el plan en `PLAN_OUTPUT_DIRECTORY/<nombre-archivo>.md` y proporciona un resumen de los componentes clave.

## Formato del Plan

* IMPORTANTE: Reemplaza `<contenido solicitado>` con el contenido real. Se ha diseñado como plantilla para que lo sustituyas. Considéralo un micro-prompt.
* IMPORTANTE: Cualquier cosa que NO esté en `<contenido solicitado>` debe escribirse EXACTAMENTE como aparece en el formato de abajo.
* IMPORTANTE: Sigue este formato EXACTO al crear planes de implementación:

```md
# Plan: <nombre de la tarea>

## Task Description
<describe la tarea en detalle basada en el prompt>

## Objective
<establece claramente qué se habrá logrado cuando este plan esté completo>

<si el task_type es feature o la complejidad es medium/complex, incluye estas secciones:>
## Problem Statement
<define claramente el problema u oportunidad específica que aborda esta tarea>

## Solution Approach
<describe el enfoque de solución propuesto y cómo aborda el objetivo>
</if>

## Relevant Files
Usa estos archivos para completar la tarea:

<lista los archivos relevantes con viñetas explicando por qué. Incluye archivos nuevos a ser creados bajo una sección h3 'New Files' si es necesario>

<si la complejidad es medium/complex, incluye esta sección:>
## Implementation Phases
### Phase 1: Foundation
<describe cualquier trabajo fundamental necesario>

### Phase 2: Core Implementation
<describe el trabajo principal de implementación>

### Phase 3: Integration & Polish
<describe la integración, pruebas y toques finales>
</if>

## Team Orchestration

- Operas como el líder del equipo y orquestas al equipo para ejecutar el plan.
- Eres responsable de desplegar a los miembros del equipo adecuados con el contexto correcto para ejecutar el plan.
- IMPORTANTE: NUNCA operas directamente sobre el código base. Usas las herramientas `Task` y `Task*` para desplegar a los miembros del equipo para construir, validar, probar, desplegar y otras tareas.
  - Esto es crítico. Tu trabajo es actuar como un director de alto nivel del equipo, no como un constructor.
  - Tu rol es validar que todo el trabajo vaya bien y asegurarte de que el equipo esté en camino para completar el plan.
  - Orquestarás esto usando las Herramientas Task* para gestionar la coordinación entre los miembros del equipo.
  - La comunicación es primordial. Usarás las Herramientas Task* para comunicarte con los miembros del equipo y asegurar que estén en camino para completar el plan.
- Toma nota del ID de sesión de cada miembro del equipo. Así es como los referenciarás.

### Team Members

OBLIGATORIO: El equipo SIEMPRE tiene al menos 1 Builder y 1 Validator. Pueden haber múltiples Builders si la tarea requiere diferentes especialidades (ej: builder-api + builder-ui), pero siempre con al menos 1 Validator compartido.

- Builder
  - Name: <nombre único con prefijo "builder-", ej. "builder-api", "builder-calendar". Permite referenciar a ESTE constructor por nombre.>
  - Role: <el rol único y enfoque que desempeñará este constructor. Escribe código, implementa, corrige.>
  - Agent Type: <el tipo de subagente. Usar TEAM_MEMBERS si existen o GENERAL_PURPOSE_AGENT>
  - Resume: true
- <continúa con builders adicionales si la tarea lo requiere>

- Validator
  - Name: <nombre único con prefijo "validator-", ej. "validator-qa", "validator-e2e">
  - Role: QA read-only que valida cada entrega del builder. Verifica criterios de aceptación, busca regresiones, ejecuta comandos de verificación. NUNCA escribe código.
  - Agent Type: <tipo de subagente validador. Normalmente GENERAL_PURPOSE_AGENT>
  - Resume: true

## Step by Step Tasks

- IMPORTANTE: Las tareas SIEMPRE siguen el patrón alternante **Builder → Validator**. Cada paso de construcción es seguido por un paso de validación.
- Ejecuta cada paso en orden, de arriba a abajo. Cada tarea se mapea directamente a una llamada `TaskCreate`.
- Antes de comenzar, ejecuta `TaskCreate` para crear la lista de tareas inicial.

<estructura las tareas siguiendo ESTRICTAMENTE el patrón Builder → Validator alternante:>

### 1. <Nombre del Primer Paso de Construcción>
- **Task ID**: <id-en-kebab-case, ej. "build-step-a">
- **Depends On**: none
- **Assigned To**: <nombre del builder>
- **Agent Type**: <tipo de subagente builder>
- **Parallel**: false
- <acción específica para completar>
- <acción específica para completar>

### 2. Validar <Nombre del Paso 1>
- **Task ID**: <id-en-kebab-case, ej. "validate-step-a">
- **Depends On**: <ID de la tarea builder anterior, ej. "build-step-a">
- **Assigned To**: <nombre del validator>
- **Agent Type**: <tipo de subagente validator>
- **Parallel**: false
- Leer archivos modificados y verificar que los cambios son correctos
- Verificar que no hay regresiones
- Ejecutar comandos de verificación relevantes (type-check, lint, tests)
- Reportar PASS o FAIL con detalle

### 3. <Nombre del Segundo Paso de Construcción>
- **Task ID**: <id-en-kebab-case, ej. "build-step-b">
- **Depends On**: <ID del validator anterior, ej. "validate-step-a">
- **Assigned To**: <nombre del builder>
- **Agent Type**: <tipo de subagente builder>
- **Parallel**: false
- <acción específica>
- <acción específica>

### 4. Validar <Nombre del Paso 3>
- **Task ID**: <id-en-kebab-case, ej. "validate-step-b">
- **Depends On**: <ID de la tarea builder anterior, ej. "build-step-b">
- **Assigned To**: <nombre del validator>
- **Agent Type**: <tipo de subagente validator>
- **Parallel**: false
- Leer archivos modificados y verificar que los cambios son correctos
- Verificar que no hay regresiones
- Ejecutar comandos de verificación relevantes

<continúa el patrón Builder → Validator para cada paso necesario>

### N. Validación Final Integral
- **Task ID**: validate-all
- **Depends On**: <ID del último validator>
- **Assigned To**: <nombre del validator>
- **Agent Type**: <tipo de subagente validator>
- **Parallel**: false
- Ejecutar TODOS los comandos de validación de la sección "Validation Commands"
- Verificar CADA criterio de aceptación individualmente
- Verificar que no hay regresiones en funcionalidad existente
- Reporte final: PASS o FAIL con detalle por criterio

## Acceptance Criteria
<lista criterios específicos y medibles que deben cumplirse para que la tarea se considere completada>

## Validation Commands
Ejecuta estos comandos para validar que la tarea está completa:

<lista comandos específicos para validar el trabajo. Sé preciso sobre qué ejecutar>
- Ejemplo: `uv run python -m py_compile apps/*.py` - Prueba para asegurar que el código compila

## Notes
<contexto adicional opcional, consideraciones o dependencias. Si se necesitan nuevas librerías, especifícalas usando `uv add`>

```

## Reporte

Después de crear y guardar el plan de implementación, proporciona un reporte conciso con el siguiente formato:

```md
✅ Plan de Implementación Creado

Archivo: PLAN_OUTPUT_DIRECTORY/<nombre-archivo>.md
Tema: <breve descripción de lo que cubre el plan>
Componentes Clave:
- <componente principal 1>
- <componente principal 2>
- <componente principal 3>

Lista de Tareas del Equipo:
- <lista de tareas y propietario (conciso)>

Miembros del Equipo:
- <lista de miembros del equipo y sus roles (conciso)>

Cuando estés listo, puedes ejecutar el plan en un nuevo agente ejecutando:
/build <reemplazar con la ruta al plan>

```