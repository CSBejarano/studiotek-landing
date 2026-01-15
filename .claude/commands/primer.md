---
description: "Inicializar contexto del proyecto para el asistente AI. Usa esto al comenzar una nueva conversación para que Claude entienda rápidamente tu proyecto."
---

# Primer: Contexto Inicial del Proyecto

Proporciona un resumen ejecutivo del proyecto actual al asistente AI para que entienda rápidamente el contexto y pueda ser productivo desde el primer mensaje.

## Proceso de Contextualización

### 1. Leer Documentación Principal

Lee en este orden de prioridad:

| # | Archivo | Propósito |
|---|---------|-----------|
| 1 | `ai_docs/continue_session/CONTINUE_SESSION.md` | Resumen ejecutivo de la sesión |
| 2 | `ai_docs/state/PROGRESS.yaml` | Estado actual del workflow |
| 3 | `ai_docs/state/GOAL.md` | Objetivo del issue actual |
| 4 | `user_prompt.md` | Próximos pasos recomendados |
| 5 | `ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md` | Orden de ejecución de issues |
| 6 | `ai_docs/notifications/*.md` | Última notificación |

### 2. Cargar Memoria del Workflow-Task (NUEVO)

Para tareas de desarrollo, carga la memoria del skill workflow-task:

| Archivo | Propósito |
|---------|-----------|
| `.claude/skills/workflow-task/memoria/long_term.yaml` | Decisiones validadas, blockers, velocity |
| `.claude/skills/workflow-task/agents/prompts/frontend.md` | Contexto del agente frontend |

## Uso

```bash
# Al inicio de una conversación nueva
/primer

# El asistente leerá todo y te dará el resumen
# Luego puedes proceder con tu tarea usando workflow-task:
/workflow-task <descripción de la tarea>
```

## Flujo Recomendado

```
/primer → Contexto inicial
    ↓
/workflow-task <tarea> → Ejecutar con memoria y agentes expertos
    ↓
Skill gestiona: planificación → ejecución → review → QA → validación
```

## Objetivo

Reducir de **5-10 minutos** de explicación manual a **30 segundos** de contexto automático, permitiendo que Claude sea productivo inmediatamente.

## Integración con Otros Comandos

| Comando | Descripción |
|---------|-------------|
| `/workflow-task` | Ejecutar tarea con memoria persistente y agentes expertos |
| `/post-merge` | Actualizar contexto después de merge |
| `/sync-backend` | Sincronizar con cambios del backend |

## Workflow-Task v2.0

La skill `/workflow-task` proporciona:

- **Memoria 3-Tier**: short_term (sesión) → long_term (proyecto) → agent_memory (por dominio)
- **Agentes Expertos**: frontend, backend, security, testing, api, database, infra
- **Aprendizaje Continuo**: Decisiones y blockers promovidos automáticamente
- **Fases Estructuradas**: Pre-fase → Planificación → Ejecución → Review → QA → Validación

### Ejemplo de Uso

```bash
# Después de /primer, ejecutar tarea con memoria
/workflow-task Implementar botón de conexión WhatsApp en Conversations.tsx

# El skill automáticamente:
# 1. Detecta dominio: frontend
# 2. Carga prompt del agente frontend
# 3. Consulta decisiones relevantes de long_term.yaml
# 4. Ejecuta las 5 fases del workflow
# 5. Captura nuevas decisiones para memoria
```

---

**Versión:** 2.0
**Actualizado:** 2025-12-29
**Cambios:** Integración con workflow-task v2.0, memoria persistente
