# Workflow Task v2.0

Sistema de orquestación multi-agente con memoria persistente y aprendizaje continuo para desarrollo de software.

## Invocación

```
/workflow-task <descripción de la tarea>
```

Ejemplos:
- `/workflow-task Implementar endpoint de autenticación`
- `/workflow-task Fix bug en validación de email (Issue #123)`
- `/workflow-task Agregar tests para el servicio de pagos`

---

## Arquitectura

### Sistema de Memoria 3-Tier

```
TIER 1: memoria/short_term.json   → Sesión actual (24h TTL)
TIER 2: memoria/long_term.yaml    → Proyecto (max 100 entries)
TIER 3: agents/memory/*.yaml      → Por agente (7 dominios)
```

### Flujo de Datos

```
START ──→ Cargar long_term + agent_memory
          ↓
DURANTE ──→ Escribir a short_term
          ↓
FASE N ──→ Sync short → evaluar promoción
          ↓
COMPLETE ──→ Promover short → long_term
             Purgar short_term
```

---

## Fases del Workflow

### Fase 0: Pre-Fase (Automática)

**Objetivo:** Inicializar contexto y memoria.

**Acciones:**
1. Generar `workflow_id` (formato: `YYYY-MM-DD_descripcion`)
2. Cargar memoria de proyecto (`long_term.yaml`)
3. Detectar dominio principal de la tarea
4. Activar agente experto correspondiente
5. Cargar decisiones y blockers relevantes

**Output:** Contexto inicializado en `short_term.json`

---

### Fase 1: Planificación

**Objetivo:** Diseñar plan de implementación usando memoria histórica.

**Consultas Obligatorias:**
```python
# Decisiones previas relevantes
engine.get_relevant_decisions("authentication endpoint")

# Blockers conocidos del dominio
engine.get_relevant_blockers("JWT validation")

# Velocidad histórica para estimación
engine.get_velocity_stats()
```

**Entregables:**
- [ ] Plan en `.claude/plans/{workflow_id}.md`
- [ ] Estructura de cambios identificada
- [ ] Riesgos mapeados con soluciones previas

**Validación:** Usuario debe aprobar plan antes de continuar.

---

### Fase 2: Ejecución

**Objetivo:** Implementar cambios según el plan.

**Reglas de Ejecución:**
1. **Un archivo a la vez** - No cambios paralelos en múltiples archivos
2. **Commit atómico** - Cada cambio debe ser revertible
3. **Capturar eventos** - Registrar cada herramienta usada:
   ```python
   engine.capture_tool_event(
       tool="Edit",
       success=True,
       file_path="/app/api/auth.py"
   )
   ```
4. **Registrar decisiones** - Para referencia futura:
   ```python
   engine.capture_decision(
       context="Elegir algoritmo de hash",
       decision="Usar bcrypt con cost=12",
       reasoning="Recomendación OWASP 2024",
       confidence=0.9,
       tags=["security", "auth"]
   )
   ```
5. **Reportar blockers** - Al encontrar problemas:
   ```python
   engine.capture_blocker(
       symptom="Test falla con timeout",
       severity="medium",
       tags=["testing", "async"]
   )
   ```

---

### Fase 3: Revisión

**Objetivo:** Verificar calidad del código implementado.

**Checklist Obligatorio:**
- [ ] Código sigue patrones del proyecto
- [ ] No hay imports circulares
- [ ] Docstrings en funciones públicas
- [ ] Type hints completos
- [ ] No hay secrets hardcodeados

**Herramientas:**
```bash
# Linting
make lint

# Type checking
make typecheck
```

---

### Fase 4: QA

**Objetivo:** Validar funcionalidad con tests.

**Proceso:**
1. Ejecutar tests existentes:
   ```bash
   make test-fast
   ```
2. Agregar tests para código nuevo
3. Verificar coverage mínimo (80%)

**Al encontrar errores:**
```python
# Marcar blocker con contexto
engine.capture_blocker(
    symptom="Test test_create_user falla con IntegrityError",
    severity="high",
    solution="Agregar unique constraint en migración",
    tags=["database", "testing"]
)
```

---

### Fase 5: Validación Final

**Objetivo:** Confirmar que la tarea está completa.

**Validaciones:**
1. Todos los tests pasan
2. Linting sin errores
3. Type checking OK
4. Documentación actualizada (si aplica)

**Consolidación:**
```python
# Registrar resultado del workflow
engine.record_workflow_completion(
    workflow_id="2025-12-28_auth-endpoint",
    result="SUCCESS",
    duration_min=45.0,
    domain="backend",
    complexity=5  # 1-10
)

# Promover aprendizajes a memoria de largo plazo
result = engine.promote_learnings()
print(f"Decisiones promovidas: {result.decisions_promoted}")
print(f"Blockers resueltos: {result.blockers_promoted}")
```

---

## Dominios de Agentes

El sistema cuenta con 7 agentes expertos:

| Dominio | Keywords | Archivo Pattern |
|---------|----------|-----------------|
| `backend` | fastapi, endpoint, api, service, repository | `app/**/*.py` |
| `frontend` | react, component, tsx, ui, tailwind | `src/**/*.tsx` |
| `database` | migration, sql, model, table, index | `migrations/**/*.py` |
| `testing` | pytest, test, mock, fixture, coverage | `tests/**/*.py` |
| `api` | rest, graphql, websocket, schema, openapi | `**/api/**/*.py` |
| `security` | auth, jwt, rbac, encrypt, owasp | `**/auth/**/*.py` |
| `infra` | docker, k8s, ci, terraform, deploy | `**/infra/**/*` |

### Activación Automática

El sistema detecta el dominio basándose en:
1. Palabras clave en la descripción de la tarea
2. Patrones de archivos mencionados
3. Historial de tareas similares

---

## Sistema de Aprendizaje

### Criterios de Promoción

**Decisiones:**
- `confidence >= 0.8`
- `validated_count >= 2`
- No hay `failed_count` recientes

**Blockers:**
- `occurrences >= 2`
- Tiene `solution` verificada
- Tiene `prevention` documentada

### Consulta de Memoria

```python
# Obtener decisiones relevantes para contexto actual
decisions = engine.get_relevant_decisions("rate limiting")

# Obtener blockers conocidos
blockers = engine.get_relevant_blockers("circular import")

# Estadísticas de velocidad
velocity = engine.get_velocity_stats()
```

---

## Hooks del Sistema

### Pre-Workflow (Start)

Ejecutado al invocar `/workflow-task`:
- Inicializa sesión
- Carga memoria de proyecto
- Detecta dominio

### Post-Phase (PostToolUse)

Ejecutado después de cada herramienta:
- Registra evento de herramienta
- Detecta errores
- Actualiza short_term

### Post-Workflow (Stop)

Ejecutado al completar/abortar:
- Consolida short_term → long_term
- Actualiza métricas de velocidad
- Limpia sesión temporal

---

## Recetas por Fase

Guías detalladas disponibles en:
- `recetas/fase-0-pre-fase.md`
- `recetas/fase-1-planificacion.md`
- `recetas/fase-2-ejecucion.md`
- `recetas/fase-3-revision.md`
- `recetas/fase-4-qa.md`
- `recetas/fase-5-validacion.md`

---

## Estructura de Directorios

```
workflow-task-v2/
├── SKILL.md                    # Este archivo
├── config.yaml                 # Configuración del skill
│
├── core/                       # Motor principal (inglés)
│   ├── learning_engine.py      # Captura y promoción
│   ├── memory_manager.py       # Sistema 3-tier
│   ├── workflow_engine.py      # Orquestación de fases
│   └── agent_registry.py       # Gestión de agentes
│
├── models/                     # Dataclasses (inglés)
│   ├── memory_state.py         # Estados de memoria
│   ├── workflow_state.py       # Estados de workflow
│   └── agent_state.py          # Estados de agentes
│
├── hooks/                      # Sistema de hooks
│   ├── hooks.json              # Configuración
│   ├── pre_workflow.sh         # → python
│   ├── post_phase.sh           # → python
│   ├── post_workflow.sh        # → python
│   └── python/                 # Handlers
│
├── agents/                     # Agentes expertos
│   ├── registry.yaml           # Registro de agentes
│   ├── memory/                 # TIER 3 por agente
│   └── prompts/                # Prompts (español)
│
├── memoria/                    # TIER 1 y 2
│   ├── short_term.json         # Sesión actual
│   └── long_term.yaml          # Proyecto
│
├── recetas/                    # Cookbooks (español)
│
├── templates/                  # Plantillas
│
└── tests/                      # Test suite (180+ tests)
```

---

## Comandos Útiles

```bash
# Ejecutar workflow completo
/workflow-task <descripción>

# Ver estado de memoria
python -c "from core import MemoryManager; m = MemoryManager('.'); print(m.get_status())"

# Limpiar sesión actual
python -c "from core import MemoryManager; m = MemoryManager('.'); m.purge_short_term()"

# Ver estadísticas de aprendizaje
python -c "from core import LearningEngine, MemoryManager; e = LearningEngine(MemoryManager('.')); print(e.get_stats())"
```

---

## Reglas Críticas

### SIEMPRE

1. Consultar memoria antes de tomar decisiones arquitectónicas
2. Registrar eventos de herramientas para análisis posterior
3. Capturar decisiones importantes con contexto completo
4. Documentar blockers con síntomas Y soluciones
5. Validar tests antes de marcar fase como completa

### NUNCA

1. Saltear la fase de planificación
2. Modificar múltiples archivos sin commits intermedios
3. Ignorar blockers conocidos de memoria
4. Promover decisiones con confidence < 0.8
5. Dejar la sesión sin consolidar al terminar

---

## Troubleshooting

### Sesión Corrupta

```bash
# Backup y reset
cp memoria/short_term.json memoria/short_term.backup.json
rm memoria/short_term.json
```

### Memoria Llena

```bash
# Purgar entries antiguas (mantiene últimas 50)
python -c "from core import MemoryManager; m = MemoryManager('.'); m.prune_long_term(keep=50)"
```

### Agente Incorrecto

```python
# Forzar dominio específico
engine.set_domain("testing")  # Override automático
```

---

## Versionado

- **v2.0.0** - Arquitectura 3-tier, aprendizaje continuo, hooks Python
- Documentación: Español
- Código: Inglés
- Tests: 180+ (59 memoria + 34 hooks + 33 workflow + 29 agentes + 29 learning)

---

## Contribuir

1. Agregar tests para nuevas funcionalidades
2. Documentar decisiones arquitectónicas
3. Mantener separación español/inglés
4. Seguir patrones de dataclass existentes
