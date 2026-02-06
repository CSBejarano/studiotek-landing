---
description: Demo interactiva del bot de Telegram con validación E2E
argument-hint: "[start|setup|verify|test|cleanup|troubleshoot]"
model: claude-sonnet-4-5-20250929
tools: bash, read, write, askuserquestion
---

# /demo - Demo Interactiva de Telegram Bot E2E

Demo profesional del sistema de booking via Telegram con validación completa.

**Demo diseñada para:** Presentaciones de producto (< 10 minutos)

## Uso

```bash
/demo start        # Demo completa
/demo setup        # Solo pre-requisitos
/demo verify       # Solo verificar estado
/demo test         # Solo tests de conversación
/demo cleanup      # Limpiar estado
/demo troubleshoot # Guía de soluciones
```

## Al invocar este comando

1. **Lee el contexto completo:** `.claude/skills-context/demo-full.md`
2. Ejecuta el flujo según el argumento proporcionado
3. Sigue las fases documentadas (Fase 0 → Fase 1 → Fase 2 → Fase 3)

## Flujo E2E

```
Telegram → Webhook → AI Processing → PostgreSQL → Google Calendar
```

## Troubleshooting Rápido

Si hay problemas, consulta la sección Troubleshooting en `demo-full.md`:
- Problema 6: Token Encryption Mismatch
- Problema 7: Timezone Mismatch
- Problema 8: Connection Pool Exhausted
