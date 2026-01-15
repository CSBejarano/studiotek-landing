## Purpose
Sincronizar el estado del proyecto al inicio de cada sesión de trabajo. Este skill lee las entradas (user_prompt, notificaciones) y actualiza los archivos de estado para mantener continuidad entre sesiones de Claude. Garantiza que el asistente tenga contexto actualizado del sprint, issues, decisiones y progreso.

## Variables
```yaml
PROJECT_ROOT: '~/Documents/GitHub/studiotek-landing'
USER_PROMPT_PATH: 'user_prompt.md'
CONTINUE_SESSION_PATH: 'ai_docs/continue_session/CONTINUE_SESSION.md'
PROGRESS_YAML_PATH: 'ai_docs/state/PROGRESS.yaml'
GOAL_PATH: 'ai_docs/state/GOAL.md'
PROGRESS_JSON_PATH: 'ai_docs/state/PROGRESS.json'
DECISIONS_PATH: 'ai_docs/state/DECISIONS.md'
MAX_CONTEXT_TOKENS: 2500
```

## Code Structure
ai_docs/
├── continue_session/
│   └── CONTINUE_SESSION.md # Salida: contexto compacto para LLM
└── state/
    ├── PROGRESS.yaml       # Salida: estado estructurado del workflow
    ├── GOAL.md             # Salida: objetivo actual con detalles
    ├── PROGRESS.json       # Salida: histórico y estadísticas
    └── DECISIONS.md        # Salida: registro de decisiones (append-only)

## Instructions
1. **Leer entradas primarias**
   - Parsear `user_prompt.md` para extraer: sprint actual, issues pendientes, issue recomendado, blockers

2. **Procesar notificaciones**
   - Extraer cambios de API que impactan el frontend
   - Identificar issues desbloqueados por cambios del backend
   - Actualizar estado de dependencias BE→FE

3. **Actualizar CONTINUE_SESSION.md**
   - Generar contexto compacto (máx 2500 tokens)
   - Incluir: estado del sprint, último issue completado, próximo recomendado
   - Incluir: cambios de backend relevantes, quick start commands
   - Formato: `<compact_context>` tag con metadata

4. **Actualizar PROGRESS.yaml**
   - Schema version: "1.0"
   - Campos: current_phase, status (IDLE/IN_PROGRESS/BLOCKED), mode, complexity_score
   - Incluir summary con objective y result
   - Registrar PRs e issues relacionados
   - Agregar comentarios con contexto del último workflow completado

5. **Actualizar GOAL.md**
   - Status actual (IDLE, IN_PROGRESS, BLOCKED)
   - Tabla del sprint con issues y estados
   - Detalles del issue recomendado (si hay)
   - Backend updates recientes
   - Quick start commands

6. **Actualizar PROGRESS.json**
   - Mantener `current_workflow` con estado actual
   - Actualizar `quick_restore` con objetivo y next_tasks
   - Actualizar `next_recommended` con issues prioritarios
   - Agregar entrada a `workflows_history` si se completó un workflow
   - Mantener `cumulative_stats` actualizadas

7. **Actualizar DECISIONS.md (append-only)**
   - NO modificar decisiones existentes
   - Agregar nuevas decisiones al final con formato estándar:
     - ID: DXXX (incremental)
     - Date, Context, Decision, Rationale, Tags
   - Solo agregar si hay decisiones nuevas del workflow actual

## Workflow
1. Leer `user_prompt.md`
2. Actualizar `ai_docs/continue_session/CONTINUE_SESSION.md`
3. Actualizar `ai_docs/state/PROGRESS.yaml`
4. Actualizar `ai_docs/state/GOAL.md`
5. Actualizar `ai_docs/state/PROGRESS.json`
6. Actualizar `ai_docs/state/DECISIONS.md`

## Examples
- **user_prompt.md** indica Issue #74 UNBLOCKED, backend PR #131 merged:
  - CONTINUE_SESSION: Incluir API change de opening_hours, marcar #74 como READY
  - GOAL: Actualizar status a "IDLE - Issue #74 NOW UNBLOCKED!"
  - PROGRESS.yaml: status=IDLE, agregar nota sobre último completado

- **Notificación BE_FEATURE indica nuevo endpoint**:
  - Extraer endpoint, método, campos nuevos
  - Identificar qué issue FE desbloquea
  - Actualizar GOAL con implementation steps sugeridos

- **Workflow completado (PR merged)**:
  - PROGRESS.json: Agregar entrada a workflows_history
  - PROGRESS.yaml: Reset a IDLE, actualizar completed_at
  - DECISIONS.md: Agregar decisiones tomadas durante implementación

## Report
Al finalizar, mostrar resumen:
```
## Session Sync Complete

### Inputs Processed
- user_prompt.md: ✅ (Sprint X, Y issues)

### Files Updated
- CONTINUE_SESSION.md: ✅ (XXX tokens)
- PROGRESS.yaml: ✅ (status: IDLE/IN_PROGRESS)
- GOAL.md: ✅ (Issue #N recommended)
- PROGRESS.json: ✅ (X workflows history)
- DECISIONS.md: ✅ (N new decisions added)

### Sprint Status
| Issue | Title | Status |
|-------|-------|--------|
| #XXX | ... | DONE/READY/BLOCKED |

### Recommended Next
Issue #N - [Title] (Complexity: X/10)

### Quick Start
```bash
/primer
gh issue view N
/workflow-task
```
```
