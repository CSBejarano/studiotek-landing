# Fase 5: Validación Final

## Objetivo

Confirmar que la tarea está completa y consolidar aprendizajes.

## Checklist de Validación

### Código

- [ ] Todos los tests pasan
- [ ] Linting sin errores
- [ ] Type checking OK
- [ ] No hay warnings críticos

### Documentación

- [ ] Docstrings actualizados
- [ ] README actualizado (si aplica)
- [ ] CHANGELOG actualizado (si aplica)
- [ ] API docs regenerados (si aplica)

### Git

- [ ] Commits atómicos y descriptivos
- [ ] Branch naming correcto
- [ ] No hay archivos innecesarios

## Verificación Final

```bash
# Verificación completa
make lint && make typecheck && make test

# Si todo pasa
echo "Validación exitosa"
```

## Registro de Resultado

```python
engine.record_workflow_completion(
    workflow_id="2025-12-28_auth-endpoint",
    result="SUCCESS",      # SUCCESS, PARTIAL, FAILED
    duration_min=45.0,     # Duración en minutos
    domain="backend",      # Dominio principal
    complexity=5           # 1-10
)
```

### Valores de Result

| Valor | Significado |
|-------|-------------|
| `SUCCESS` | Tarea completada sin blockers pendientes |
| `PARTIAL` | Tarea parcialmente completada, blockers no resueltos |
| `FAILED` | Tarea no completada, errores críticos |

### Valores de Complexity

| Rango | Descripción |
|-------|-------------|
| 1-3 | Simple: bug fix, cambio menor |
| 4-6 | Medio: feature pequeña, refactor |
| 7-10 | Complejo: feature grande, cambio arquitectónico |

## Promoción de Aprendizajes

```python
result = engine.promote_learnings()

print(f"Decisiones promovidas: {result.decisions_promoted}")
print(f"Decisiones omitidas: {result.decisions_skipped}")
print(f"Blockers promovidos: {result.blockers_promoted}")
print(f"Blockers omitidos: {result.blockers_skipped}")
print(f"Patrones de herramientas actualizados: {result.tool_patterns_updated}")
```

### Criterios de Promoción

**Decisiones:**
- `confidence >= 0.8`
- `validated_count >= 2` (en memoria existente)

**Blockers:**
- `occurrences >= 2` (en memoria existente)
- Tiene `solution` documentada

## Limpieza de Sesión

```python
# Purgar short-term memory
manager.purge_short_term()

# Desactivar agentes
registry.deactivate_all()
```

## Estadísticas del Workflow

```python
stats = engine.get_stats()

print(f"Total eventos: {stats['tool_events_total']}")
print(f"Archivos modificados: {stats['files_modified']}")
print(f"Decisiones registradas: {stats['decisions_recorded']}")
print(f"Blockers encontrados: {stats['blockers_encountered']}")
print(f"Blockers resueltos: {stats['blockers_resolved']}")
```

## Commit Final

```bash
# Mensaje de commit con contexto
git commit -m "feat(auth): implement login endpoint

- Add POST /api/v1/auth/login endpoint
- Add JWT token generation
- Add password validation with bcrypt

Workflow: 2025-12-28_auth-endpoint
Decisions: 3 promoted
Blockers: 1 resolved
"
```

## Reporte de Cierre

Al finalizar, generar resumen:

```
=== WORKFLOW COMPLETADO ===

ID: 2025-12-28_auth-endpoint
Resultado: SUCCESS
Duración: 45 minutos
Dominio: backend
Complejidad: 5/10

Archivos modificados: 4
- app/api/v1/auth.py (nuevo)
- app/domain/services/auth_service.py (modificado)
- tests/unit/test_auth.py (nuevo)
- tests/conftest.py (modificado)

Decisiones promovidas: 2
- Hash con bcrypt cost=12
- JWT expiration 1 hora

Blockers resueltos: 1
- Import circular con TYPE_CHECKING

Tests: 15 nuevos, 0 fallidos
Coverage: 87% (+2%)
```

## Checklist Final

- [ ] Verificación make lint/typecheck/test exitosa
- [ ] Resultado registrado con record_workflow_completion
- [ ] Aprendizajes promovidos con promote_learnings
- [ ] Sesión limpiada con purge_short_term
- [ ] Agentes desactivados
- [ ] Commit realizado con mensaje descriptivo
- [ ] Reporte de cierre generado

## Workflow Completado

La tarea ha sido completada exitosamente. Los aprendizajes han sido consolidados en la memoria de largo plazo para uso futuro.

Volver a [SKILL.md](../SKILL.md) para iniciar un nuevo workflow.
