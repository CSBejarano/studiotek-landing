---
description: "Planificacion estrategica profunda para issues complejas (complexity > 4)"
argument-hint: "[#issue-number] [--mode=fast|full] [--skip-exploration]"
context: fork
model: opus
ultrathink: true
skills:
  - task-strategist
  - workflow-task
tools:
  - bash
  - read
  - write
  - task
  - askuserquestion
  - todowrite
  - mcp__server-sequential-thinking__sequentialthinking
  - mcp__serena__find_symbol
  - mcp__serena__search_for_pattern
  - mcp__serena__get_symbols_overview
  - mcp__serena__read_file
  - mcp__serena__list_dir
hooks:
  Stop:
    - prompt: |
        Validar que el output incluye:
        1. STRATEGIC-PLAN.md con Pre-Mortem Analysis y Risk Matrix
        2. TDD Test Plan (unit + integration tests definidos)
        3. Security Checklist (OWASP Top 10)
        4. @gentleman Verdict (APPROVED/NEEDS_REVISION/REJECTED)
        5. user_prompt.md actualizado con SOURCE_TYPE: strategic
        Responde: VALID o INVALID: <razon especifica>
      model: haiku
      once: true
---

# /plan-execute v2.0 - Planificacion Estrategica Multi-Agente

## Proposito

Ejecutar analisis estrategico profundo de issues de GitHub usando el skill `task-strategist` en modo full, generando un plan completo listo para `/workflow-task`.

**Usar cuando:** Complejidad > 4, features criticas, fullstack, seguridad, migraciones.

---

## Arquitectura (Claude Code v2.1.0)

```
/plan-execute (context: fork)
        |
        +---> Fase -3: Context Acquisition
        +---> Fase -2: Issue Analysis + Domain Detection
        |      +---> CHECKPOINT 1: Confirm Scope
        +---> Fase -1.5: 5 Explorers PARALELOS
        |      +---> EXPLORATION-REPORT.md
        +---> Fase -1: Domain Specialist (@backend/@frontend/@infra)
        |      +---> DOMAIN-RECOMMENDATIONS.md
        +---> Fase -0.5: @gentleman + @codebase-analyst PARALELOS
        |      +---> ARCHITECTURAL-REVIEW.md
        +---> Fase 0: Sequential Thinking Synthesis
        |      +---> STRATEGIC-PLAN.md
        |      +---> CHECKPOINT 2: Approve Plan
        +---> Fase 1: Handoff Preparation
               +---> user_prompt.md (SOURCE_TYPE: strategic)
```

---

## Uso

```bash
# Issue unico
/plan-execute #110

# Multiples issues relacionados
/plan-execute #110 #117

# Skip exploration (ya existe EXPLORATION-REPORT.md)
/plan-execute #110 --skip-exploration

# Forzar modo
/plan-execute #110 --mode=full
```

---

## Al Invocar Este Comando

1. **Lee el contexto completo:** `.claude/skills-context/plan-execute-full.md`
2. Ejecuta las 7 fases (-3 a 1) con memoria PRE/POST
3. Lanza 5 exploradores en paralelo (Fase -1.5)
4. Ejecuta @gentleman + @codebase-analyst en paralelo (Fase -0.5)
5. Genera STRATEGIC-PLAN.md con Sequential Thinking (min 8 thoughts)
6. Actualiza user_prompt.md con SOURCE_TYPE: strategic

---

## Outputs

| Archivo | Fase | Contenido |
|---------|------|-----------|
| `ai_docs/strategic/current/EXPLORATION-REPORT.md` | -1.5 | Findings de 5 explorers |
| `ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md` | -1 | Recomendaciones del especialista |
| `ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md` | -0.5 | Review de @gentleman |
| `ai_docs/strategic/current/STRATEGIC-PLAN.md` | 0 | **Plan estrategico completo** |
| `user_prompt.md` | 1 | Prompt con SOURCE_TYPE: strategic |

---

## Sistema de Memoria de Agentes (CRITICO)

Cada agente DEBE seguir el patron PRE/POST:

```yaml
PRE_EXECUTION:
  - Leer: ai_docs/expertise/domain-experts/{{domain}}.yaml
  - Extraer: decisions (confidence >= 0.8), blockers, anti_patterns

POST_EXECUTION:
  - Capturar nuevas decisions con ID: {{DOMAIN}}{{ISSUE}}-{{N}}
  - Capturar blockers con ID: BLK{{ISSUE}}-{{N}}
  - Escribir de vuelta a memoria

REGLA: Los agentes NUNCA ejecutan y olvidan.
```

---

## Checkpoints de Usuario

| CP | Fase | Pregunta |
|----|------|----------|
| CP1 | -2 | Confirmar scope, dominio detectado, complejidad |
| CP2 | 0 | Aprobar STRATEGIC-PLAN.md antes de handoff |

---

## Cuando Usar Este Comando vs /plan-task

| Criterio | /plan-task | /plan-execute |
|----------|------------|---------------|
| **Complejidad** | <= 4 | **> 4** |
| **Duracion** | 5-10 min | **20-30 min** |
| **Exploradores** | 0 | **5 paralelos** |
| **Review** | Sequential Thinking | **@gentleman + @codebase-analyst** |
| **Pre-mortem** | No | **Si (5-8 thoughts)** |
| **TDD Plan** | No | **Si (tests ANTES del codigo)** |
| **OWASP** | No | **Si (checklist completo)** |
| **Documentos** | 1 (plan.md) | **4 (reports + plan)** |
| **Memoria** | Lee long_term.yaml | **PRE/POST pattern completo** |

### Usar /plan-execute cuando:

- Tareas complejas (complejidad > 4)
- Features criticas de negocio
- Cambios fullstack (frontend + backend)
- Migraciones de base de datos
- Features de seguridad
- Integraciones con servicios externos

### Usar /plan-task cuando:

- Complejidad <= 4
- Time pressure (urgente)
- Single domain (solo frontend O backend)
- Fix bugs menores
- Features aisladas

---

## Workflow Completo

```
/plan-execute #110
       |
       +-- [context: fork] Analisis en subagente aislado
       +-- Carga skills: task-strategist, workflow-task
       +-- 7 fases (-3 a 1) con memoria PRE/POST
       +-- Stop hook valida output
       |
       v
   OUTPUTS:
   1. ai_docs/strategic/current/STRATEGIC-PLAN.md
   2. ai_docs/strategic/current/EXPLORATION-REPORT.md
   3. ai_docs/strategic/current/DOMAIN-RECOMMENDATIONS.md
   4. ai_docs/strategic/current/ARCHITECTURAL-REVIEW.md
   5. user_prompt.md (SOURCE_TYPE: strategic)
       |
       v
/workflow-task
       |
       +-- Lee SOURCE_TYPE: strategic
       +-- Carga: ai_docs/strategic/current/STRATEGIC-PLAN.md
       +-- Ejecuta fases con agentes expertos
       +-- Consolida aprendizajes -> long_term.yaml
```

---

## Metricas de Exito

| Metrica | Target |
|---------|--------|
| Bugs descubiertos pre-implementacion | +50% |
| Tiempo de implementacion | -20% |
| Rework post-implementacion | -40% |
| Test coverage en nuevas features | >80% |
| Plan approval rate (primer intento) | >90% |

---

## Referencias

- **Contexto completo:** `.claude/skills-context/plan-execute-full.md`
- **Skill task-strategist:** `.claude/skills/task-strategist/`
- **Skill workflow-task:** `.claude/skills/workflow-task/`
- **Domain detection:** `.claude/skills/task-strategist/domain-detection/`

---

**Version:** 2.0.0
**Actualizado:** 2026-01-08
**Basado en:** task-strategist v1.1.0 + workflow-task v2.0 + Claude Code v2.1.0

### Changelog

#### v2.0.0 (2026-01-08)
- Added `context: fork` para aislamiento de sesion
- Added `skills:` declaracion en frontmatter
- Added `hooks: Stop:` para validacion automatica
- Converted `tools:` a YAML list
- Added tabla de seleccion /plan-task vs /plan-execute
- Updated description con criterio de complejidad

#### v1.1.0 (2026-01-05)
- Added @codebase-analyst to Fase -0.5
- Implemented agent memory system (PRE/POST)
