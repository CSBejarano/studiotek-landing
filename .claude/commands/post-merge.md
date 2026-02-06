---
description: "Post-Merge Automation v6.0 - actualiza docs, contexto y sincroniza cross-repo después de merge"
argument-hint: "[pr_number] [--skip-frontend] [--backend-only]"
context: fork
model: opus
tools:
  - bash
  - read
  - write
  - edit
  - grep
  - glob
  - todowrite
  - mcp__server-sequential-thinking__sequentialthinking
  - mcp__serena__read_file
  - mcp__serena__list_dir
hooks:
  Stop:
    - prompt: |
        Valida que el post-merge incluye:
        1. PR mergeado correctamente (o ya estaba merged)
        2. Documentación backend actualizada (PROGRESS.yaml, GOAL.md, etc.)
        3. Workflow archivado en complete/
        4. Cross-repo sync realizado (frontend docs actualizados)
        5. Commits pusheados a ambos repos
        Responde: VALID si todo presente, o INVALID: <razon> si falta algo.
      model: haiku
      once: true
---

# /post-merge - Post-Merge Automation v6.0

Automatiza **TODAS** las tareas post-merge incluyendo documentación, archivado, sincronización cross-repo con frontend, y preparación del próximo sprint.

## Uso

```bash
/post-merge 123              # Procesar PR #123
/post-merge                  # Auto-detectar último PR mergeado
/post-merge 123 --skip-frontend  # Omitir sync con frontend
/post-merge 123 --backend-only   # Solo actualizar backend
```

## Variables

```yaml
BACKEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas
FRONTEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas-frontend
DATE: $(date +%Y-%m-%d)
TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

## Al invocar este comando

1. **Lee el contexto completo:** `.claude/skills-context/post-merge-full.md`
2. Ejecuta las 10 fases de automatización
3. **CRÍTICO:** Sincroniza documentación con el repo frontend

## Fases de Ejecución (10 Fases)

### FASE 1-3: Contexto + Merge + Close Issue

```bash
# Auto-detectar PR si no se proporciona
PR_INFO=$(gh pr view $PR_NUMBER --json number,title,state,mergeCommit,mergedAt)

# Merge si está OPEN
if [ "$STATE" = "OPEN" ]; then
  gh pr merge $PR_NUMBER --squash --delete-branch
  git checkout main && git pull origin main
fi

# Cerrar Issue relacionado (si existe)
gh issue close $ISSUE_NUMBER --comment "✅ Completed via PR #$PR_NUMBER"
```

### FASE 4-6: Documentación Backend

| Archivo | Acción |
|---------|--------|
| `ai_docs/state/complete/{DATE}_*` | Archivar workflow |
| `ai_docs/state/PROGRESS.yaml` | Actualizar estado |
| `ai_docs/state/PROGRESS.json` | Append workflow history |
| `ai_docs/state/GOAL.md` | Actualizar objetivo |
| `user_prompt.md` | Actualizar próximos pasos |

### FASE 7: Preparar Próximo Sprint

Reset PROGRESS.yaml para próximo workflow:
```yaml
state:
  current_phase: 0
  status: "IDLE"
summary:
  objective: "Sprint {N+1} READY"
```

### FASE 8: Cross-Repo Sync (BACKEND)

Actualizar archivos de sincronización en backend:

| Archivo | Contenido |
|---------|-----------|
| `ai_docs/sync/LAST_SYNC.yaml` | Estado de sincronización |
| `ai_docs/continue_session/CONTINUE_SESSION.md` | Contexto regenerado |

### FASE 9: Cross-Repo Sync (FRONTEND) ⭐ CRÍTICO

**Esta fase es OBLIGATORIA** (salvo `--skip-frontend` o `--backend-only`).

Actualizar documentación en el repo frontend para mantener contexto compartido:

```bash
cd $FRONTEND_REPO

# Archivos a actualizar/crear:
# 1. Notificación del backend
ai_docs/notifications/BE_{TYPE}_{DATE}.md

# 2. Estado de sincronización
ai_docs/sync/LAST_SYNC.yaml

# 3. Contexto de sesión
ai_docs/continue_session/CONTINUE_SESSION.md

# 4. Estado actual
ai_docs/state/GOAL.md

# 5. Próximos pasos
user_prompt.md
```

**Contenido de la notificación frontend:**

```markdown
# Backend {TYPE}: {TITLE} - {DATE}

**From:** Backend repo (ideas)
**PR:** #{PR_NUMBER}
**Status:** MERGED

## Cambios del Backend

{Descripción de cambios relevantes para frontend}

## API Changes (si aplica)

| Endpoint | Method | Change |
|----------|--------|--------|
| {endpoint} | {method} | {descripción} |

## Frontend Action Required

{Acciones que el frontend debe tomar, o "None required"}

## Sprint Status

- Sprint {N}: COMPLETE
- Sprint {N+1}: READY

## Quick Start

```bash
cd ~/Documents/GitHub/ideas-frontend
/primer
gh issue view {NEXT_ISSUE}
/workflow-task
```
```

### FASE 10: Commit y Push (AMBOS REPOS)

**Backend:**
```bash
cd $BACKEND_REPO
git add ai_docs/ user_prompt.md
git commit -m "docs: post-merge Sprint {N} - {FEATURE} complete"
git push origin main
```

**Frontend:**
```bash
cd $FRONTEND_REPO
git add ai_docs/ user_prompt.md
git commit -m "docs: sync from backend - {FEATURE} complete"
git push origin main
```

## Output Final

```markdown
## ✅ Post-Merge Automation Complete (v6.0)

### Sprint Summary

| Metric | Value |
|--------|-------|
| Sprint | {N} - {NAME} |
| PR | #{PR_NUMBER} |
| Merged | {TIMESTAMP} |

### Acciones Realizadas

| Fase | Acción | Status |
|------|--------|--------|
| 1-3 | Contexto + Merge | ✅ |
| 4-6 | Docs Backend | ✅ |
| 7 | Reset Estado | ✅ |
| 8 | Sync Backend | ✅ |
| 9 | Sync Frontend | ✅ |
| 10 | Commit + Push | ✅ BE: {commit} | FE: {commit} |

### Cross-Repo Sync

| Repo | Last PR | Status |
|------|---------|--------|
| ideas (Backend) | #{BE_PR} | SYNCED ✅ |
| ideas-frontend | #{FE_PR} | SYNCED ✅ |

### Archivos Actualizados

**Backend:**
- ai_docs/state/PROGRESS.yaml
- ai_docs/state/PROGRESS.json
- ai_docs/state/GOAL.md
- ai_docs/sync/LAST_SYNC.yaml
- ai_docs/continue_session/CONTINUE_SESSION.md
- ai_docs/state/complete/{DATE}_*/
- user_prompt.md

**Frontend:**
- ai_docs/notifications/BE_{TYPE}_{DATE}.md
- ai_docs/sync/LAST_SYNC.yaml
- ai_docs/continue_session/CONTINUE_SESSION.md
- ai_docs/state/GOAL.md
- user_prompt.md

### Próximo Paso

```bash
# En cualquier repo
/primer

# Contexto sincronizado - ambos repos saben el estado actual
```
```

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    /post-merge [PR_NUMBER]                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1-3: Contexto + Merge + Close Issue                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4-6: Documentación Backend                                  │
│ • Archivar workflow a complete/                                  │
│ • Actualizar PROGRESS.yaml, PROGRESS.json, GOAL.md              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 7: Preparar Próximo Sprint                                  │
│ • Reset PROGRESS.yaml                                            │
│ • Actualizar user_prompt.md                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 8: Cross-Repo Sync (Backend)                                │
│ • LAST_SYNC.yaml                                                 │
│ • CONTINUE_SESSION.md                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 9: Cross-Repo Sync (Frontend) ⭐ NUEVO v6.0                 │
│ • Crear notificación en ai_docs/notifications/                   │
│ • Actualizar LAST_SYNC.yaml                                      │
│ • Actualizar CONTINUE_SESSION.md                                 │
│ • Actualizar GOAL.md                                             │
│ • Actualizar user_prompt.md                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 10: Commit + Push (Backend + Frontend)                      │
│ • git add + commit + push (backend)                              │
│ • git add + commit + push (frontend)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ✅ POST-MERGE COMPLETE
                    (Ambos repos sincronizados)
```

## Flags

| Flag | Descripción |
|------|-------------|
| `--skip-frontend` | Omitir FASE 9 (sync frontend) |
| `--backend-only` | Solo ejecutar fases 1-8, 10 (backend only) |

## Notes

- **context: fork** - Este comando corre en contexto aislado para no contaminar la sesión principal
- **Cross-repo sync es CRÍTICO** - Ambos repos deben estar sincronizados para que `/primer` funcione correctamente
- **Notificación frontend** - Siempre crear notificación para que el frontend sepa qué cambió en el backend
- **Commits separados** - Un commit en backend, otro en frontend, ambos referenciando el cambio

## Changelog

- **v6.0** (2026-01-10): Agregada FASE 9 obligatoria para sync frontend + context: fork
- **v5.0**: Cross-repo sync integrado (sync backend only)
- **v4.0**: Automatización completa de documentación
- **v3.0**: Primer-compatible
- **v1.0**: Versión inicial

---

**Versión:** 6.0 | **Actualizado:** 2026-01-10
