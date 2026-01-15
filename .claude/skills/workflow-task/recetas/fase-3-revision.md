# Fase 3: Revisión

## Objetivo

Verificar la calidad del código implementado antes de ejecutar tests.

## Checklist de Revisión

### Estilo de Código

- [ ] Código sigue patrones del proyecto
- [ ] Naming conventions consistentes
- [ ] Indentación correcta (4 espacios)
- [ ] Líneas < 120 caracteres
- [ ] Imports ordenados (stdlib, third-party, local)

### Seguridad

- [ ] No hay secrets hardcodeados
- [ ] Validación de inputs
- [ ] Sanitización de outputs
- [ ] No hay SQL injection posible
- [ ] No hay XSS posible

### Arquitectura

- [ ] Dependencias fluyen hacia adentro
- [ ] Domain layer sin dependencias externas
- [ ] Repository pattern respetado
- [ ] Use cases con single responsibility

### Python Específico

- [ ] Type hints completos
- [ ] Docstrings en funciones públicas
- [ ] No hay imports circulares
- [ ] Async/await usado correctamente
- [ ] Context managers para recursos

## Herramientas de Verificación

### Linting

```bash
make lint
```

Si hay errores:
```python
engine.capture_tool_event(
    tool="Bash",
    success=False,
    error="Linting errors: E501, F401",
    correction="Fix line length and unused imports"
)
```

### Type Checking

```bash
make typecheck
```

Si hay errores:
```python
engine.capture_blocker(
    symptom="Type error en UserService.create",
    severity="medium",
    solution="Agregar Optional[str] al parámetro email",
    tags=["typing", "mypy"]
)
```

### Verificación de Imports

```python
# Buscar imports circulares
import importlib
import sys

def check_imports(module_path):
    try:
        importlib.import_module(module_path)
        return True
    except ImportError as e:
        print(f"Import error: {e}")
        return False
```

## Patrones a Verificar

### Repository Pattern

```python
# CORRECTO
class UserRepository(IUserRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: UUID) -> Optional[User]:
        ...

# INCORRECTO - viola abstracción
class UserRepository(IUserRepository):
    def __init__(self):
        self.session = get_database_session()  # ¡Dependencia hardcodeada!
```

### Use Case Pattern

```python
# CORRECTO
@dataclass
class CreateUserUseCase:
    user_repo: IUserRepository

    async def execute(self, dto: CreateUserDTO) -> UserResponseDTO:
        user = await self.user_repo.create(dto.to_entity())
        return UserResponseDTO.from_entity(user)

# INCORRECTO - lógica de negocio en use case
@dataclass
class CreateUserUseCase:
    user_repo: IUserRepository

    async def execute(self, dto: CreateUserDTO) -> UserResponseDTO:
        if len(dto.password) < 8:  # ¡Esto va en domain service!
            raise ValueError("Password too short")
```

### Async Pattern

```python
# CORRECTO
async def get_users():
    async with get_session() as session:
        result = await session.execute(select(User))
        return result.scalars().all()

# INCORRECTO - bloquea event loop
async def get_users():
    session = get_session()  # ¡Falta async context manager!
    result = session.execute(select(User))  # ¡Falta await!
```

## Documentación Mínima

### Funciones Públicas

```python
async def create_user(
    self,
    email: str,
    password: str,
    name: Optional[str] = None,
) -> User:
    """
    Create a new user with the given credentials.

    Args:
        email: User email (must be unique)
        password: Plain text password (will be hashed)
        name: Optional display name

    Returns:
        Created user entity

    Raises:
        DuplicateEmailError: If email already exists
    """
```

### Clases

```python
class UserService:
    """
    Domain service for user-related business logic.

    Handles user creation, authentication, and profile management.
    Uses IUserRepository for persistence.
    """
```

## Captura de Resultados

```python
# Al completar revisión exitosa
engine.capture_tool_event(
    tool="Bash",
    success=True,
    params={"command": "make lint && make typecheck"}
)

# Si hubo correcciones
engine.capture_decision(
    context="Corrección de tipos en UserService",
    decision="Agregar Optional wrapper a campos nullable",
    reasoning="mypy strict mode requiere tipos explícitos",
    confidence=0.9,
    tags=["typing", "correction"]
)
```

## Checklist Final Revisión

- [ ] Linting pasó sin errores
- [ ] Type checking pasó sin errores
- [ ] No hay imports circulares
- [ ] Patrones de arquitectura respetados
- [ ] Documentación básica presente
- [ ] No hay secrets expuestos

## Siguiente Fase

Continuar con [Fase 4: QA](./fase-4-qa.md)
