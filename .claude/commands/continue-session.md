## Purpose
Sincronizar el estado del proyecto al inicio de cada sesión de trabajo. Este skill lee los archivos de estado y actualiza el contexto para mantener continuidad entre sesiones de Claude. Garantiza que el asistente tenga contexto actualizado del progreso, decisiones y próximos pasos.

## Variables
```yaml
PROJECT_ROOT: '/Users/cristianbejaranomendez/Documents/GitHub/claude-code-template'
CONTINUE_SESSION_PATH: 'ai_docs/continue_session/CONTINUE_SESSION.md'
PROGRESS_YAML_PATH: 'ai_docs/state/PROGRESS.yaml'
GOAL_PATH: 'ai_docs/state/GOAL.md'
PROGRESS_JSON_PATH: 'ai_docs/state/PROGRESS.json'
DECISIONS_PATH: 'ai_docs/state/DECISIONS.md'
SKILLS_ROADMAP_PATH: '.claude/SKILLS_ROADMAP.md'
MAX_CONTEXT_TOKENS: 2500
```

## Code Structure
```
ai_docs/
├── state/
│   ├── PROGRESS.yaml        # Estado estructurado del workflow
│   ├── GOAL.md              # Objetivo actual con detalles
│   ├── PROGRESS.json        # Histórico y estadísticas
│   └── DECISIONS.md         # Registro de decisiones (append-only)
├── continue_session/
│   └── CONTINUE_SESSION.md  # Contexto compacto para LLM
├── plan/                    # Planes de implementación
├── analysis/                # Reportes de análisis
└── review/                  # Reportes de review

.claude/
├── SKILLS_ROADMAP.md        # Roadmap de skills a crear
├── agents/                  # Agentes especializados
├── commands/                # Comandos slash
└── skills/                  # Skills disponibles
```

## Instructions
1. **Leer estado actual del proyecto**
   - Leer `ai_docs/state/PROGRESS.yaml` para estado del workflow
   - Leer `ai_docs/state/GOAL.md` para objetivo actual
   - Leer `.claude/SKILLS_ROADMAP.md` para próximos skills a crear

2. **Verificar archivos de estado**
   - Si no existen, inicializarlos con valores por defecto
   - Mantener consistencia entre PROGRESS.yaml y GOAL.md

3. **Actualizar CONTINUE_SESSION.md**
   - Generar contexto compacto (máx 2500 tokens)
   - Incluir: estado del proyecto, último progreso, próximo objetivo
   - Incluir: skills pendientes del roadmap, quick start commands
   - Formato: `<compact_context>` tag con metadata

4. **Actualizar PROGRESS.yaml**
   - Schema version: "1.0"
   - Campos: current_phase, status (IDLE/IN_PROGRESS/BLOCKED), mode
   - Incluir summary con objective y result
   - Agregar comentarios con contexto

5. **Actualizar GOAL.md**
   - Status actual (IDLE, IN_PROGRESS, BLOCKED)
   - Próximo skill a crear del roadmap
   - Quick start commands

6. **Actualizar DECISIONS.md (append-only)**
   - NO modificar decisiones existentes
   - Agregar nuevas decisiones al final con formato estándar:
     - ID: DXXX (incremental)
     - Date, Context, Decision, Rationale, Tags
   - Solo agregar si hay decisiones nuevas

## Workflow
1. Leer archivos de estado existentes
2. Actualizar `.claude/SKILLS_ROADMAP.md` para próximos skills
3. Actualizar `ai_docs/continue_session/CONTINUE_SESSION.md`
4. Actualizar `ai_docs/state/PROGRESS.yaml`
5. Actualizar `ai_docs/state/GOAL.md`
6. Actualizar `ai_docs/state/DECISIONS.md` (si hay nuevas)

## Examples
- **Inicio de nueva sesión sin estado previo:**
  - Inicializar PROGRESS.yaml con status=IDLE
  - GOAL: Leer SKILLS_ROADMAP y recomendar primer skill
  - CONTINUE_SESSION: Incluir resumen del roadmap

- **Continuar trabajo en skill:**
  - PROGRESS.yaml: status=IN_PROGRESS, current skill
  - GOAL: Próximos pasos del skill actual
  - CONTINUE_SESSION: Contexto del skill en progreso

- **Skill completado:**
  - PROGRESS.yaml: Reset a IDLE, actualizar completed_at
  - DECISIONS.md: Agregar decisiones del skill implementado
  - GOAL: Recomendar siguiente skill del roadmap

## Report
Al finalizar, mostrar resumen:
```
## Session Sync Complete

### Project Status
- Repo: claude-code-template
- Status: IDLE/IN_PROGRESS/BLOCKED
- Current Focus: [skill name or "Ready for new task"]

### Files Updated
- CONTINUE_SESSION.md: ✅ (XXX tokens)
- PROGRESS.yaml: ✅ (status: IDLE/IN_PROGRESS)
- GOAL.md: ✅
- DECISIONS.md: ✅ (N decisions total)

### Skills Roadmap Status
| Sprint | Skills | Status |
|--------|--------|--------|
| Sprint 0 | /pydantic-ai, /agent-builder, /mcp-tools | Pending |
| Sprint 1 | /fastapi, /pytest, /clean-arch | Pending |
| ... | ... | ... |

### Recommended Next
Skill: /pydantic-ai
Priority: ⭐ CRÍTICO
Context7 ID: /pydantic/pydantic-ai

### Quick Start
```bash
# Ver roadmap completo
cat .claude/SKILLS_ROADMAP.md

# Crear próximo skill
/plan-task crear skill /pydantic-ai con Context7

# Ver agentes disponibles
ls .claude/agents/
```
```
