---
name: informe_reunion
description: Generar un informe de la reunión con contexto completo del proyecto
argument-hint: "[archivo_transcripcion.md | user_prompt.md]"
model: opus
---

# Informe de Reunión v2.0

Comando para analizar transcripciones de reuniones y generar informes estructurados con tareas ejecutables, decisiones documentadas y diagramas de workflow.

---

## Workflow

### FASE 1: CONTEXTO (Context Loading)

Lee los archivos de estado del proyecto para tener contexto completo:

```yaml
archivos_contexto:
  - ai_docs/state/PROGRESS.yaml      # Estado actual del workflow
  - ai_docs/state/PROGRESS.json      # Checkpoint de progreso
  - ai_docs/state/GOAL.md            # Objetivo del sprint actual
  - ai_docs/state/DECISIONS.md       # Decisiones técnicas tomadas
  - ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md  # Issues pendientes
  - .claude/skills/workflow-task/memoria/long_term.yaml   # Memoria del sistema
```

> **Acción:** Lee todos estos archivos para entender el estado actual del proyecto.

---

### FASE 2: ANÁLISIS (Meeting Analysis)

#### Input
- **Archivo de transcripción:** `$ARGUMENTS` o `user_prompt.md` si no se especifica

#### Proceso
Usa `mcp__server-sequential-thinking` con 5-7 pensamientos para:

1. **Identificar temas discutidos** - Agrupa por dominio (backend, frontend, infra, negocio)
2. **Extraer decisiones tomadas** - Formato: contexto → decisión → confidence
3. **Identificar tareas nuevas** - Separar: Cristian (owner) vs Claude (implementación)
4. **Detectar cambios de prioridad** - Comparar con MVP_ISSUES_EXECUTION_ORDER.md
5. **Mapear a issues existentes** - Vincular tareas con issues abiertos
6. **Identificar blockers** - Problemas que impiden avanzar
7. **Definir próximos pasos** - Acciones concretas post-reunión

---

### FASE 3: GENERACIÓN (Output Generation)

#### Variables de Output

```yaml
fecha: $(date +%Y%m%d)  # Ejemplo: 20260103
output_report: ai_docs/meetings/${fecha}_meeting_report.md
output_diagram: ai_docs/meetings/${fecha}_workflow_diagram.md
```

#### Estructura del Informe

```markdown
# Informe de Reunión: [FECHA]

## Resumen Ejecutivo
- [Punto principal 1]
- [Punto principal 2]
- [Punto principal 3]

---

## Decisiones Tomadas

| ID | Decisión | Contexto | Confidence | Dominio |
|----|----------|----------|------------|---------|
| D-YYYYMMDD-1 | ... | ... | 0.95 | backend |

> **Acción:** Añadir estas decisiones a `ai_docs/state/DECISIONS.md`

---

## Tareas Identificadas

### Para Cristian (Owner)
- [ ] **[Prioridad]** Tarea 1 - (dominio)
- [ ] **[Prioridad]** Tarea 2 - (dominio)

### Para Claude (Implementación)

| # | Tarea | Dominio | Issue Relacionado | Prioridad | Agent |
|---|-------|---------|-------------------|-----------|-------|
| 1 | ... | backend | #XXX | P1 | @backend |
| 2 | ... | frontend | #YYY | P2 | @frontend |

---

## Cambios de Scope/Prioridad

| Issue | Cambio | Razón |
|-------|--------|-------|
| #XXX | Prioridad P2 → P1 | [razón] |

> **Acción:** Actualizar `MVP_ISSUES_EXECUTION_ORDER.md` si aplica

---

## Blockers Identificados

| Blocker | Impacto | Solución Propuesta |
|---------|---------|-------------------|
| ... | ... | ... |

---

## Próximos Pasos

1. Ejecutar `/workflow-task` con issue #XXX
2. Actualizar DECISIONS.md con decisiones nuevas
3. [Otras acciones]

---

## Diagrama de Workflow

Ver: `${output_diagram}`

---

**Generado por:** `/informe_reunion` v2.0
**Fecha:** [timestamp]
**Sprint:** [número] - [nombre]
```

---

### FASE 4: DIAGRAMA (Mermaid Generation)

Invoca el skill `/experto-diagramas-mermaid` con el contenido del informe para generar:

```yaml
tipo_diagrama: flowchart o sequenceDiagram
contenido:
  - Flujo de tareas identificadas
  - Dependencias entre tareas
  - Responsables (Cristian vs Claude)
  - Timeline sugerido
output: ${output_diagram}
```

---

### FASE 5: INTEGRACIÓN (Optional Updates)

Si el usuario confirma, actualizar:

1. **DECISIONS.md** - Añadir nuevas decisiones
2. **GOAL.md** - Si hay cambio de objetivo
3. **long_term.yaml** - Si hay nuevos patterns/learnings
4. **user_prompt.md** - Próximos pasos recomendados

---

## Uso

```bash
# Con archivo específico
/informe_reunion ai_docs/transcripciones/reunion_20260103.md

# Usando user_prompt.md como input
/informe_reunion

# El comando:
# 1. Carga contexto del proyecto
# 2. Analiza la transcripción con Sequential Thinking
# 3. Genera informe en ai_docs/meetings/
# 4. Genera diagrama Mermaid
# 5. Sugiere actualizaciones a archivos de estado
```

---

## Integración con Skills

| Skill | Uso |
|-------|-----|
| **task-strategist** | Clasificar tareas por dominio y prioridad |
| **workflow-task** | Generar tasks ejecutables para agents |
| **experto-diagramas-mermaid** | Crear diagrama visual del workflow |

---

## Reporte Final

```markdown
## Resultado de /informe_reunion

- Informe generado: `ai_docs/meetings/${fecha}_meeting_report.md`
- Diagrama generado: `ai_docs/meetings/${fecha}_workflow_diagram.md`
- Decisiones identificadas: [N]
- Tareas para Cristian: [N]
- Tareas para Claude: [N]
- Issues relacionados: #XXX, #YYY

### Acciones Sugeridas:
1. Revisar informe y confirmar tareas
2. Ejecutar `/workflow-task` para primera tarea prioritaria
3. Actualizar DECISIONS.md con: `/informe_reunion --update-decisions`
```

---

**Versión:** 2.0
**Actualizado:** 2026-01-03
