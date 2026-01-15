# Post-Merge Automation Command v5.0

Automatiza **TODAS** las tareas post-merge incluyendo documentación, archivado, sincronización cross-repo, y preparación del próximo sprint.

## Uso

```bash
/post-merge [PR_NUMBER] [--skip-sync] [--backend-only]
```

| Flag | Descripción |
|------|-------------|
| `PR_NUMBER` | Número del PR (auto-detecta si no se proporciona) |
| `--skip-sync` | Omitir sincronización con frontend |
| `--backend-only` | Solo actualizar backend, no crear notificación en FE |

## Variables

```yaml
BACKEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas
FRONTEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas-frontend
DATE: $(date +%Y-%m-%d)
TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

---

## Ejecución Automática (10 Fases)

### Fase 1: Contexto y Validación

```bash
# Auto-detectar PR si no se proporciona
PR_INFO=$(gh pr view $PR_NUMBER --json number,title,state,mergeCommit,headRefName,mergedAt)

# Extraer Issue Number del título (formato: "feat(scope): description (Issue #XX)")
ISSUE_NUMBER=$(echo $PR_INFO | jq -r '.title' | grep -oE '#[0-9]+' | tr -d '#')

# Verificar estado
STATE=$(echo $PR_INFO | jq -r '.state')
MERGED_AT=$(echo $PR_INFO | jq -r '.mergedAt')
```

**Output esperado:**
```
PR #93: feat(auth): Google OAuth login (Issue #60)
State: MERGED | Issue: #60 | Branch: feat/issue-60-google-oauth-login
Merged: 2025-12-24T01:48:03Z
```

---

### Fase 2: Merge (si OPEN)

```bash
# Solo si PR está OPEN
if [ "$STATE" = "OPEN" ]; then
  gh pr merge $PR_NUMBER --squash --delete-branch
  git checkout main && git pull origin main
fi
```

---

### Fase 3: Cerrar Issue

```bash
gh issue close $ISSUE_NUMBER --comment "✅ Completed via PR #$PR_NUMBER

**Summary:** [Extraer de GOAL.md o PR description]

🤖 Generated with [Claude Code](https://claude.ai/code)"
```

---

### Fase 4: Archivar Workflow

**Crear directorio y copiar archivos:**

```bash
ARCHIVE_DIR="ai_docs/state/complete/${DATE}_issue-${ISSUE_NUMBER}-${SLUG}"
mkdir -p $ARCHIVE_DIR

# Copiar estado actual
cp ai_docs/state/PROGRESS.yaml $ARCHIVE_DIR/
cp ai_docs/state/GOAL.md $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/state/DECISIONS.md $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/strategic/current/STRATEGIC-PLAN.md $ARCHIVE_DIR/ 2>/dev/null || true
```

**Crear VALIDATION_REPORT:**

```markdown
# Validation Report: Issue #${ISSUE_NUMBER} - ${TITLE}

**Date:** ${DATE}
**PR:** #${PR_NUMBER}
**Status:** ✅ MERGED

## Implementation Summary
[Extraer de PROGRESS.yaml: milestones completados]

## Security Measures
[Extraer de DECISIONS.md si aplica]

## Files Changed
[Extraer de PROGRESS.yaml: files_created, files_modified]

## Test Coverage
[Extraer de PROGRESS.yaml: tests_passed/tests_total]

---
*Generated with Claude Code*
```

---

### Fase 5: Actualizar MVP_ISSUES_EXECUTION_ORDER.md

**Campos a actualizar:**

| Sección | Cambio |
|---------|--------|
| Executive Summary | `Already Completed: N → N+1` |
| Sprint X Status | `READY → COMPLETED` |
| Backend Issues | Mover de Open a Completed |
| Frontend Issues | Cambiar `Blocked → **READY**` si aplica |
| Progress Tracker | Actualizar status del sprint |
| Footer | Actualizar fecha y changelog |

---

### Fase 6: Actualizar CLAUDE.md

**Agregar a Implementation Status (al inicio de la tabla):**

```markdown
| **{Feature Name} (Issue #{ISSUE_NUMBER})** | ✅ Production Ready ({DATE}) | [PR #{PR_NUMBER}](...) - {SHORT_DESCRIPTION} |
```

**Actualizar footer:**

```markdown
**Last updated:** {DATE} | **Version:** X.Y ({SPRINT_NAME}: {FEATURES})
```

---

### Fase 7: Preparar Próximo Sprint

**Reset PROGRESS.yaml:**

```yaml
schema_version: "1.0"
updated_at: "{TIMESTAMP}"
state:
  current_phase: 0
  status: "IDLE"
  mode: null
  complexity_score: null
  started_at: null
  completed_at: null
summary:
  objective: null
  result: null
related:
  prs: []
  issues: []
files: []
# Ready for next workflow
```

**Actualizar GOAL.md y user_prompt.md para próximo sprint.**

---

### Fase 8: Sincronización Cross-Repo ⭐ NUEVO v5.0

> **Integra funcionalidad de /sync-frontend automáticamente**

#### 8a. Actualizar LAST_SYNC.yaml

```yaml
schema_version: "1.0"
last_updated: "{TIMESTAMP}"
triggered_by: "post-merge"

sync_direction: "backend -> frontend"

backend:
  repo: "ideas"
  last_pr_merged: {PR_NUMBER}
  last_issue_closed: {ISSUE_NUMBER}
  status: "SYNCED"
  last_sprint_completed: "Sprint {N} - {SPRINT_NAME}"

frontend:
  repo: "ideas-frontend"
  issues_unblocked:
    - number: {FE_ISSUE_1}
      title: "{TITLE}"
      unblocked_by: "BE #{ISSUE_NUMBER}"
    # ... más issues desbloqueados

sprint_status:
  sprint_{N}: "COMPLETE"
  sprint_{N+1}: "READY_TO_START"

flows_completed:
  - name: "{FEATURE_NAME}"
    backend_issue: {ISSUE_NUMBER}
    backend_pr: {PR_NUMBER}
    completed_at: "{MERGED_AT}"
    apis_available:
      - endpoint: "{ENDPOINT}"
        method: "{METHOD}"
        description: "{DESC}"

progress:
  total_issues: 27
  completed: {N}
  percentage: {PCT}
```

#### 8b. Regenerar CONTINUE_SESSION.md

Actualizar con:
- Sprint completado
- Flujos BE-FE completados
- APIs disponibles para frontend
- Issues desbloqueados
- Próximo sprint ready

#### 8c. Crear SYNC_REPORT

```bash
SYNC_REPORT="ai_docs/sync/SYNC_REPORT_${DATE}.md"
```

Contenido:
- Executive Summary del sprint
- Endpoints disponibles con ejemplos de código
- Issues desbloqueados
- Orden de ejecución recomendado

#### 8d. Crear Notificación en Frontend (si no --backend-only)

```bash
NOTIFICATION="${FRONTEND_REPO}/ai_docs/notifications/SPRINT_${N+1}_READY_${DATE}.md"
```

Contenido detallado:
- APIs disponibles con ejemplos TypeScript
- Flujo de integración paso a paso
- Notas de seguridad
- Quick start commands

---

### Fase 9: Append a PROGRESS.json (Persistent Memory) ⭐ v5.10

```python
# Append workflow to history (never overwrite)
progress_json = read("ai_docs/state/PROGRESS.json")

new_workflow = {
    "workflow_id": f"{DATE}_{SLUG}",
    "started_at": "{STARTED_AT}",
    "completed_at": "{MERGED_AT}",
    "result": "SUCCESS",
    "files_modified": len(files),
    "domain": "{DOMAIN}",
    "complexity": {COMPLEXITY}
}

progress_json["workflows_history"].append(new_workflow)
progress_json["cumulative_stats"]["total_workflows"] += 1
progress_json["cumulative_stats"]["successful_workflows"] += 1
progress_json["last_updated"] = "{TIMESTAMP}"

write("ai_docs/state/PROGRESS.json", progress_json)
```

---

### Fase 10: Commit y Push (Ambos Repos)

**Backend:**

```bash
git add \
  CLAUDE.md \
  ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md \
  ai_docs/state/PROGRESS.yaml \
  ai_docs/state/PROGRESS.json \
  ai_docs/state/GOAL.md \
  ai_docs/state/DECISIONS.md \
  ai_docs/state/complete/${DATE}_issue-${ISSUE_NUMBER}-*/ \
  ai_docs/sync/LAST_SYNC.yaml \
  ai_docs/sync/SYNC_REPORT_${DATE}.md \
  ai_docs/continue_session/CONTINUE_SESSION.md \
  user_prompt.md

git commit -m "docs: post-merge Sprint ${N} - ${FEATURE} complete

Sprint ${N} Summary:
- BE #${ISSUE_NUMBER}: ${TITLE} (PR #${PR_NUMBER})

Documentation updates:
- MVP_ISSUES_EXECUTION_ORDER.md: Sprint ${N} COMPLETE
- CLAUDE.md: Add to Implementation Status
- Archive workflow to complete/
- Sync with frontend: ${FE_ISSUES_UNBLOCKED} issues unblocked

Progress: ${COMPLETED}/${TOTAL} issues (${PCT}%)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin main
```

**Frontend (si no --backend-only):**

```bash
cd ${FRONTEND_REPO}

git add ai_docs/notifications/SPRINT_${N+1}_READY_${DATE}.md

git commit -m "docs: Sprint ${N+1} ready notification from backend

Backend Sprint ${N} completed:
- BE #${ISSUE_NUMBER}: ${TITLE} (PR #${PR_NUMBER})

Issues now READY:
${FE_ISSUES_LIST}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin main
```

---

## Output Final

```markdown
## ✅ Post-Merge Automation Complete (v5.0)

### Sprint Summary

| Metric | Value |
|--------|-------|
| Sprint | ${N} - ${SPRINT_NAME} |
| Issue | #${ISSUE_NUMBER} |
| PR | #${PR_NUMBER} |
| Merged | ${MERGED_AT} |

### Acciones Realizadas

| Fase | Acción | Status |
|------|--------|--------|
| 1 | Contexto extraído | ✅ |
| 2 | PR merged | ✅ |
| 3 | Issue cerrada | ✅ |
| 4 | Workflow archivado | ✅ `complete/${DATE}_issue-${N}/` |
| 5 | MVP_ISSUES actualizado | ✅ Sprint ${N} COMPLETE |
| 6 | CLAUDE.md actualizado | ✅ v${X.Y} |
| 7 | Estado reseteado | ✅ Ready for Sprint ${N+1} |
| 8 | Cross-repo sync | ✅ ${FE_ISSUES_COUNT} issues unblocked |
| 9 | PROGRESS.json updated | ✅ Workflow ${WORKFLOW_COUNT} added |
| 10 | Commit y push | ✅ BE: ${BE_COMMIT} | FE: ${FE_COMMIT} |

### Archivos Backend Actualizados

| Archivo | Cambio |
|---------|--------|
| `CLAUDE.md` | v${X.Y} - Added ${FEATURE} |
| `ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md` | Sprint ${N} COMPLETE |
| `ai_docs/state/PROGRESS.yaml` | Reset for next workflow |
| `ai_docs/state/PROGRESS.json` | Workflow ${N} added to history |
| `ai_docs/state/GOAL.md` | Updated for Sprint ${N+1} |
| `ai_docs/sync/LAST_SYNC.yaml` | Synced with frontend |
| `ai_docs/sync/SYNC_REPORT_${DATE}.md` | Created |
| `ai_docs/continue_session/CONTINUE_SESSION.md` | Regenerated |
| `user_prompt.md` | Next steps updated |

### Archivos Frontend Actualizados

| Archivo | Cambio |
|---------|--------|
| `ai_docs/notifications/SPRINT_${N+1}_READY_${DATE}.md` | Created |

### Archivos Archivados

```
ai_docs/state/complete/${DATE}_issue-${ISSUE_NUMBER}-${SLUG}/
├── PROGRESS.yaml
├── GOAL.md
├── DECISIONS.md
└── STRATEGIC-PLAN.md
```

### Issues Desbloqueados en Frontend

| Issue | Título | Priority |
|-------|--------|----------|
| FE #${X} | ${Title} | ${Priority} |
| FE #${Y} | ${Title} | ${Priority} |

### APIs Disponibles

| Endpoint | Method | Description |
|----------|--------|-------------|
| ${ENDPOINT_1} | ${METHOD} | ${DESC} |
| ${ENDPOINT_2} | ${METHOD} | ${DESC} |

### Progress

```
Sprint 1-${N-1} [========] COMPLETE
Sprint ${N}    [========] COMPLETE ← NEW
Sprint ${N+1}  [........] READY

Overall: ████████████████░░░░ ${PCT}% (${COMPLETED}/${TOTAL})
```

### Próximo Paso

```bash
cd ~/Documents/GitHub/ideas-frontend
cat ai_docs/notifications/SPRINT_${N+1}_READY_${DATE}.md
/primer
gh issue view ${NEXT_FE_ISSUE}
/workflow-task
```
```

---

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    /post-merge [PR_NUMBER]                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1-3: Contexto + Merge + Close Issue                        │
│ ─────────────────────────────────────────                        │
│ • Auto-detectar PR y Issue                                       │
│ • Merge si OPEN                                                  │
│ • Cerrar Issue con comentario                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4-6: Documentación Backend                                  │
│ ─────────────────────────────                                    │
│ • Archivar workflow a complete/                                  │
│ • Actualizar MVP_ISSUES_EXECUTION_ORDER.md                       │
│ • Actualizar CLAUDE.md Implementation Status                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 7: Preparar Próximo Sprint                                  │
│ ──────────────────────────────                                   │
│ • Reset PROGRESS.yaml                                            │
│ • Actualizar GOAL.md                                             │
│ • Actualizar user_prompt.md                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 8: Cross-Repo Sync (integra /sync-frontend)                 │
│ ────────────────────────────────────────────────                 │
│ • Actualizar LAST_SYNC.yaml                                      │
│ • Regenerar CONTINUE_SESSION.md                                  │
│ • Crear SYNC_REPORT                                              │
│ • Crear notificación en frontend                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 9: Persistent Memory                                        │
│ ─────────────────────────────                                    │
│ • Append workflow a PROGRESS.json                                │
│ • Actualizar cumulative_stats                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 10: Commit + Push (Backend + Frontend)                      │
│ ───────────────────────────────────────────                      │
│ • git add + commit + push (backend)                              │
│ • git add + commit + push (frontend)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ✅ POST-MERGE COMPLETE
```

---

## Comparación de Versiones

| Fase | v4.0 | v5.0 |
|------|------|------|
| 1-7 | ✅ Same | ✅ Same |
| 8 | Commit backend | **Cross-repo sync** (integra /sync-frontend) |
| 9 | - | **PROGRESS.json persistent memory** |
| 10 | - | **Commit + Push ambos repos** |

**Mejoras v5.0:**
- ✅ Integra `/sync-frontend` automáticamente (ya no es necesario ejecutar por separado)
- ✅ Crea notificación detallada en frontend con ejemplos de código
- ✅ Actualiza LAST_SYNC.yaml con estado completo
- ✅ Regenera CONTINUE_SESSION.md
- ✅ Crea SYNC_REPORT con documentación de APIs
- ✅ Append a PROGRESS.json (memoria persistente)
- ✅ Commit y push a ambos repos automáticamente
- ✅ Flags opcionales: `--skip-sync`, `--backend-only`

---

## Ejemplo de Ejecución

```bash
# Después de aprobar PR #93
/post-merge 93

# Output:
## ✅ Post-Merge Automation Complete (v5.0)

Sprint 5 - Authentication COMPLETE
- BE #60: Google OAuth Login (PR #93)

Issues Unblocked:
- FE #16: Google Login Button
- FE #17: Login Page Update
- FE #31: Password Reset UI

Progress: 20/27 (74%)

Next: cd ~/GitHub/ideas-frontend && /primer
```

---

**Versión:** 5.0
**Actualizado:** 2025-12-24
**Autor:** workflow-task

**Changelog:**
- v5.0: Cross-repo sync integrado
  - Fase 8: Sincronización automática con frontend
  - Fase 9: PROGRESS.json persistent memory
  - Fase 10: Commit y push a ambos repos
  - Flags: `--skip-sync`, `--backend-only`
  - Ya no es necesario ejecutar `/sync-frontend` por separado
- v4.0: Automatización completa de documentación
- v3.0: Cross-Repo Sync (separado)
- v2.0: Primer-compatible
- v1.0: Versión inicial
