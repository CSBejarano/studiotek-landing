---
description: "Inicializar contexto del proyecto para el asistente AI. Usa esto al comenzar una nueva conversación para que Claude entienda rápidamente tu proyecto."
---

# Prime

Carga contexto del proyecto en 30 segundos.

## Instrucciones

1. **Leer archivos de estado** (en este orden):
   - `ai_docs/continue_session/CONTINUE_SESSION.md` - Contexto compacto
   - `ai_docs/state/GOAL.md` - Objetivo actual
   - `ai_docs/state/PROGRESS.yaml` - Estado del workflow
   - `ai_docs/state/PROGRESS.json` - Estado del workflow
   - `ai_docs/state/DECISIONS.md` - Decisiones tomadas

2. **Mostrar resumen**:
   ```
   ## Contexto Cargado
   - Proyecto: [nombre]
   - Status: [IDLE/IN_PROGRESS/BLOCKED]
   - Objetivo: [descripción corta]
   - Next: [próxima tarea]
   ```

## Output esperado

Después de leer los archivos, responde con:
- Estado actual del proyecto
- Qué se está trabajando o qué sigue
- Comando sugerido para continuar
