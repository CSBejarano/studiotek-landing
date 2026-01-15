# Fase 1: Planificación

## Objetivo

Diseñar un plan de implementación basado en memoria histórica y patrones del proyecto.

## Consultas Obligatorias

Antes de planificar, SIEMPRE consultar:

### 1. Decisiones Previas

```python
decisions = engine.get_relevant_decisions("descripción de la tarea")
for d in decisions:
    print(f"Contexto: {d.context}")
    print(f"Decisión: {d.decision}")
    print(f"Confianza: {d.confidence}")
    print("---")
```

### 2. Blockers Conocidos

```python
blockers = engine.get_relevant_blockers("síntomas potenciales")
for b in blockers:
    print(f"Síntoma: {b.symptom}")
    print(f"Solución: {b.solution}")
    print(f"Prevención: {b.prevention}")
    print("---")
```

### 3. Velocidad Histórica

```python
velocity = engine.get_velocity_stats()
print(f"Promedio por fase: {velocity['by_phase']}")
print(f"Promedio por complejidad: {velocity['by_complexity']}")
```

## Estructura del Plan

Crear archivo `.claude/plans/{workflow_id}.md`:

```markdown
# Plan: {descripción corta}

## Resumen
{Una línea describiendo el objetivo}

## Contexto Previo
- Decisiones relevantes: {lista}
- Blockers a evitar: {lista}

## Archivos a Modificar
1. {ruta/archivo.py} - {cambio a realizar}
2. ...

## Orden de Ejecución
1. {paso 1}
2. {paso 2}
...

## Riesgos Identificados
- {riesgo 1} → {mitigación basada en memoria}
- {riesgo 2} → {mitigación}

## Estimación
- Complejidad: {1-10}
- Tiempo estimado: {basado en velocidad histórica}
```

## Patrones del Proyecto

Antes de proponer cambios, verificar patrones existentes:

### Backend (FastAPI)

```python
# Patrón de endpoint
@router.post("/resource")
async def create_resource(
    data: ResourceCreate,
    service: ResourceService = Depends(get_resource_service),
) -> ResourceResponse:
    result = await service.create(data)
    return ResourceResponse.from_entity(result)
```

### Repository

```python
# Patrón de repository
class ResourceRepository(IResourceRepository):
    async def create(self, entity: Resource) -> Resource:
        model = ResourceModel.from_entity(entity)
        self.session.add(model)
        await self.session.flush()
        return model.to_entity()
```

### Testing

```python
# Patrón de test
@pytest.mark.unit
async def test_create_resource(mock_repo):
    # Arrange
    uc = CreateResourceUseCase(repo=mock_repo)

    # Act
    result = await uc.execute(dto)

    # Assert
    assert result.id is not None
```

## Validación del Plan

El usuario DEBE aprobar el plan antes de continuar:

```
¿Aprobar este plan? (s/n)
```

Si no se aprueba, iterar sobre el plan con feedback.

## Captura de Decisión de Arquitectura

```python
engine.capture_decision(
    context="Estructura del endpoint de autenticación",
    decision="Usar patrón UseCase con DI",
    reasoning="Consistente con arquitectura existente",
    confidence=0.9,
    tags=["architecture", "backend"]
)
```

## Checklist Planificación

- [ ] Decisiones previas consultadas
- [ ] Blockers conocidos revisados
- [ ] Velocidad histórica consultada
- [ ] Plan escrito en .claude/plans/
- [ ] Archivos a modificar identificados
- [ ] Riesgos mapeados con mitigaciones
- [ ] Plan aprobado por usuario

## Siguiente Fase

Continuar con [Fase 2: Ejecución](./fase-2-ejecucion.md)
