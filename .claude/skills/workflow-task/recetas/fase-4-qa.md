# Fase 4: QA

## Objetivo

Validar la funcionalidad implementada mediante tests automatizados.

## Proceso de QA

```
1. Ejecutar tests existentes
2. Identificar tests que fallan
3. Agregar tests para código nuevo
4. Verificar coverage
5. Documentar resultados
```

## Ejecutar Tests Existentes

### Suite Rápida

```bash
make test-fast
```

### Suite Completa

```bash
make test
```

### Tests Específicos

```bash
# Por archivo
pytest tests/unit/domain/test_user.py -v

# Por patrón
pytest -k "test_create" -v

# Con coverage
pytest --cov=app --cov-report=term-missing
```

## Manejo de Fallos

### Capturar Fallo Inicial

```python
engine.capture_tool_event(
    tool="Bash",
    success=False,
    error="FAILED tests/unit/test_auth.py::test_login - AssertionError"
)
```

### Registrar como Blocker

```python
engine.capture_blocker(
    symptom="test_login falla con AssertionError",
    severity="high",
    tags=["testing", "auth"]
)
```

### Resolver y Documentar

```python
engine.capture_blocker(
    symptom="test_login falla con AssertionError",
    severity="high",
    solution="Fix: mock de PasswordService retornaba False",
    prevention="Verificar mocks en fixture antes de commit",
    tags=["testing", "auth", "mock"]
)
```

## Escribir Tests para Código Nuevo

### Patrón AAA (Arrange-Act-Assert)

```python
@pytest.mark.unit
async def test_create_user_success(mock_user_repo):
    # Arrange
    mock_user_repo.create.return_value = User(
        id=uuid4(),
        email="test@example.com",
        name="Test User"
    )
    uc = CreateUserUseCase(user_repo=mock_user_repo)
    dto = CreateUserDTO(email="test@example.com", password="password123")

    # Act
    result = await uc.execute(dto)

    # Assert
    assert result.email == "test@example.com"
    mock_user_repo.create.assert_called_once()
```

### Fixtures Reutilizables

```python
@pytest.fixture
def mock_user_repo():
    repo = Mock(spec=IUserRepository)
    repo.create = AsyncMock()
    repo.get_by_id = AsyncMock()
    repo.get_by_email = AsyncMock()
    return repo

@pytest.fixture
def sample_user():
    return User(
        id=uuid4(),
        email="test@example.com",
        name="Test User",
        created_at=datetime.utcnow()
    )
```

### Casos Edge

```python
@pytest.mark.unit
async def test_create_user_duplicate_email(mock_user_repo):
    # Arrange
    mock_user_repo.get_by_email.return_value = User(...)  # Ya existe
    uc = CreateUserUseCase(user_repo=mock_user_repo)

    # Act & Assert
    with pytest.raises(DuplicateEmailError):
        await uc.execute(CreateUserDTO(email="exists@example.com", ...))

@pytest.mark.unit
async def test_create_user_invalid_email():
    # Arrange
    dto = CreateUserDTO(email="not-an-email", password="password123")

    # Act & Assert
    with pytest.raises(ValidationError):
        dto.validate()
```

## Coverage Mínimo

### Objetivo: 80%

```bash
pytest --cov=app --cov-fail-under=80
```

### Verificar Coverage por Módulo

```bash
pytest --cov=app/domain --cov-report=term-missing
```

### Ignorar Archivos de Config

```python
# pyproject.toml
[tool.coverage.run]
omit = [
    "app/core/config.py",
    "app/infrastructure/database/migrations/*",
]
```

## Captura de Resultados

### Tests Exitosos

```python
engine.capture_tool_event(
    tool="Bash",
    success=True,
    params={"command": "pytest --cov=app", "coverage": "87%"}
)
```

### Decisión de Testing

```python
engine.capture_decision(
    context="Estrategia de mock para external APIs",
    decision="Usar respx para HTTP mocks, AsyncMock para repos",
    reasoning="Consistente con tests existentes",
    confidence=0.9,
    tags=["testing", "mocking", "strategy"]
)
```

## Tipos de Tests

### Unit Tests

```python
@pytest.mark.unit
async def test_domain_logic():
    """Test domain logic sin dependencias externas."""
    user = User.create(email="test@example.com", password="123")
    assert user.is_active is True
```

### Integration Tests

```python
@pytest.mark.integration
async def test_repository_create(db_session):
    """Test repository con database real."""
    repo = UserRepository(db_session)
    user = await repo.create(User(...))
    assert user.id is not None
```

### E2E Tests (Opcional)

```python
@pytest.mark.e2e
async def test_login_flow(client):
    """Test flujo completo de login."""
    response = await client.post("/api/v1/auth/login", json={...})
    assert response.status_code == 200
    assert "access_token" in response.json()
```

## Checklist QA

- [ ] Tests existentes pasan
- [ ] Tests agregados para código nuevo
- [ ] Coverage >= 80%
- [ ] Casos edge cubiertos
- [ ] Mocks configurados correctamente
- [ ] No hay tests flaky
- [ ] Resultados capturados

## Siguiente Fase

Continuar con [Fase 5: Validación](./fase-5-validacion.md)
