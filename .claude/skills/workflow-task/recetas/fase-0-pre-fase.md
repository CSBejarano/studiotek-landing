# Fase 0: Pre-Fase

## Objetivo

Inicializar el contexto del workflow cargando memoria histórica y detectando el dominio apropiado.

## Flujo

```
1. Generar workflow_id
2. Cargar long_term.yaml
3. Detectar dominio de la tarea
4. Activar agente experto
5. Consultar decisiones/blockers relevantes
6. Inicializar short_term.json
```

## Generación de Workflow ID

El ID del workflow sigue el formato: `YYYY-MM-DD_descripcion-corta`

Ejemplos:
- `2025-12-28_issue-123` (si menciona issue)
- `2025-12-28_auth-endpoint` (palabras clave)
- `2025-12-28_workflow` (fallback)

## Detección de Dominio

El sistema analiza la descripción para detectar el dominio:

| Dominio | Palabras Clave |
|---------|----------------|
| backend | fastapi, endpoint, api, service, repository |
| frontend | react, component, tsx, ui, tailwind |
| database | migration, sql, model, table, index |
| testing | pytest, test, mock, fixture, coverage |
| api | rest, graphql, websocket, schema |
| security | auth, jwt, rbac, encrypt, owasp |
| infra | docker, k8s, ci, terraform, deploy |

## Carga de Memoria

```python
from core import MemoryManager, LearningEngine

# Inicializar
manager = MemoryManager(skill_root)
manager.start_session(workflow_id, task_description)

# Cargar memoria de largo plazo
long_term = manager.load_long_term()

# Crear engine de aprendizaje
engine = LearningEngine(manager)

# Consultar decisiones relevantes
decisions = engine.get_relevant_decisions(task_description)
for d in decisions:
    print(f"- {d.context}: {d.decision}")

# Consultar blockers conocidos
blockers = engine.get_relevant_blockers(task_description)
for b in blockers:
    print(f"- {b.symptom} → {b.solution}")
```

## Activación de Agente

```python
from core import AgentRegistry

registry = AgentRegistry(skill_root)

# Detectar dominio
match = registry.match_domain(task_description)
print(f"Dominio detectado: {match.domain_id} (confianza: {match.confidence})")

# Activar experto
expert = registry.activate_expert(match.domain_id)
print(f"Agente activado: {expert.profile.display_name}")
```

## Checklist Pre-Fase

- [ ] Workflow ID generado
- [ ] Memoria de proyecto cargada
- [ ] Dominio detectado correctamente
- [ ] Agente experto activado
- [ ] Decisiones relevantes consultadas
- [ ] Blockers conocidos revisados
- [ ] Short-term inicializado

## Siguiente Fase

Continuar con [Fase 1: Planificación](./fase-1-planificacion.md)
