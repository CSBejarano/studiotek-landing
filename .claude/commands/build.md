---
description: Implementar el plan
argument-hint: [path-to-plan]
---

# Build

Sigue el `Workflow` para implementar el `PATH_TO_PLAN` y luego `Reporte` el trabajo completado.

## Variables

PATH_TO_PLAN: $ARGUMENTS

## Workflow

- Si no se proporciona una `PATH_TO_PLAN`, DETENERSE inmediatamente y pedir al usuario que la proporcione (AskUserQuestion).
- Leer y ejecutar el plan en `PATH_TO_PLAN`. Pensar detenidamente sobre el plan e implementarlo en el codebase.

## Reporte

- Presentar la sección `## Reporte` del plan.
