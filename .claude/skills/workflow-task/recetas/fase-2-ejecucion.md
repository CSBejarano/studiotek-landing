# Fase 2: Ejecución

## Objetivo

Implementar los cambios siguiendo el plan aprobado, registrando eventos y decisiones.

## Reglas de Ejecución

### 1. Un Archivo a la Vez

```
MAL:  Editar auth.py, users.py y tests.py simultáneamente
BIEN: Editar auth.py → commit → Editar users.py → commit → ...
```

### 2. Capturar Eventos de Herramientas

Después de cada uso de herramienta:

```python
engine.capture_tool_event(
    tool="Edit",           # Nombre de la herramienta
    success=True,          # Si fue exitoso
    file_path="/app/api/auth.py",  # Archivo afectado
    params={"line": 42}    # Parámetros relevantes
)
```

### 3. Registrar Decisiones Importantes

```python
engine.capture_decision(
    context="Elegir estrategia de caché",
    decision="Usar Redis con TTL de 5 minutos",
    reasoning="Balance entre frescura y performance",
    confidence=0.85,
    tags=["cache", "redis", "performance"]
)
```

### 4. Documentar Blockers Encontrados

```python
engine.capture_blocker(
    symptom="Import circular entre auth y users",
    severity="high",       # low, medium, high
    solution="Usar TYPE_CHECKING para type hints",
    tags=["python", "imports"]
)
```

## Flujo de Implementación

```
┌─────────────────┐
│ Leer plan       │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Seleccionar     │
│ siguiente paso  │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Implementar     │
│ cambio          │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Capturar evento │
└────────┬────────┘
         ↓
┌─────────────────┐
│ ¿Decisión       │──Sí──→ Capturar decisión
│ importante?     │
└────────┬────────┘
         ↓ No
┌─────────────────┐
│ ¿Blocker        │──Sí──→ Capturar blocker
│ encontrado?     │
└────────┬────────┘
         ↓ No
┌─────────────────┐
│ ¿Más pasos?     │──Sí──→ Volver al inicio
└────────┬────────┘
         ↓ No
     Fase 3
```

## Herramientas Comunes

### Edición de Código

```python
# Después de Edit
engine.capture_tool_event(
    tool="Edit",
    success=True,
    file_path="/app/domain/entities/user.py"
)
```

### Creación de Archivos

```python
# Después de Write
engine.capture_tool_event(
    tool="Write",
    success=True,
    file_path="/app/api/v1/auth.py"
)
```

### Comandos Bash

```python
# Después de Bash (make, git, etc)
engine.capture_tool_event(
    tool="Bash",
    success=False,
    error="Command 'make lint' failed with exit code 1",
    correction="Fix linting errors in auth.py"
)
```

## Manejo de Errores

Cuando una herramienta falla:

1. **Capturar el error**:
   ```python
   engine.capture_tool_event(
       tool="Bash",
       success=False,
       error="pytest failed: 3 tests failing"
   )
   ```

2. **Registrar como blocker si es significativo**:
   ```python
   engine.capture_blocker(
       symptom="Tests de autenticación fallan con timeout",
       severity="high",
       tags=["testing", "async", "timeout"]
   )
   ```

3. **Resolver antes de continuar**

4. **Marcar blocker como resuelto**:
   ```python
   # El blocker se marca resuelto al agregar solution
   engine.capture_blocker(
       symptom="Tests de autenticación fallan con timeout",
       severity="high",
       solution="Aumentar timeout a 10s en pytest.ini",
       tags=["testing", "async", "timeout"]
   )
   ```

## Patrones de Captura

### Cambio de Modelo

```python
engine.capture_decision(
    context="Agregar campo 'phone' a User",
    decision="Campo opcional con validación E.164",
    reasoning="Consistente con WhatsApp integration",
    confidence=0.9,
    tags=["database", "user", "schema"]
)
```

### Elección de Algoritmo

```python
engine.capture_decision(
    context="Hash de contraseñas",
    decision="bcrypt con cost=12",
    reasoning="Balance seguridad/performance según OWASP",
    confidence=0.95,
    tags=["security", "auth", "hash"]
)
```

### Refactor Significativo

```python
engine.capture_decision(
    context="Refactor de BookingService",
    decision="Separar en BookingService y AvailabilityService",
    reasoning="Single Responsibility Principle",
    confidence=0.8,
    tags=["refactor", "architecture", "srp"]
)
```

## Checklist Ejecución

- [ ] Plan revisado antes de empezar
- [ ] Cambios implementados uno a la vez
- [ ] Eventos de herramientas capturados
- [ ] Decisiones importantes registradas
- [ ] Blockers documentados con soluciones
- [ ] Código compila sin errores

## Siguiente Fase

Continuar con [Fase 3: Revisión](./fase-3-revision.md)
