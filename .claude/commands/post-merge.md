# Post-Merge Automation Command v5.1

Automatiza **TODAS** las tareas post-merge incluyendo documentación, archivado, sincronización cross-repo, y preparación del próximo sprint.

**Dirección de sincronización:** Frontend → Backend

## Uso

```bash
/post-merge-2 [PR_NUMBER] [--skip-sync] [--frontend-only]
```

| Flag | Descripción |
|------|-------------|
| `PR_NUMBER` | Número del PR (auto-detecta si no se proporciona) |
| `--skip-sync` | Omitir sincronización con backend |
| `--frontend-only` | Solo actualizar frontend, no crear notificación en BE |

## Variables

```yaml
FRONTEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas-frontend  # SOURCE
BACKEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas            # TARGET
DATE: $(date +%Y-%m-%d)
TIMESTAMP: $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

---

## Ejecución Automática (10 Fases)

### Fase 1: Contexto y Validación

```bash
cd ${FRONTEND_REPO}

# Auto-detectar PR si no se proporciona
PR_INFO=$(gh pr view $PR_NUMBER --json number,title,state,mergeCommit,headRefName,mergedAt)

# Extraer Issue Number del título (formato: "feat(scope): description (FE #XX)")
FE_ISSUE_NUMBER=$(echo $PR_INFO | jq -r '.title' | grep -oE '#[0-9]+' | tr -d '#')

# Verificar estado
STATE=$(echo $PR_INFO | jq -r '.state')
MERGED_AT=$(echo $PR_INFO | jq -r '.mergedAt')
BRANCH_NAME=$(echo $PR_INFO | jq -r '.headRefName')
```

**Output esperado:**
```
PR #48: feat(auth): implement forgot password flow (FE #31)
State: MERGED | Issue: FE #31 | Branch: feat/issue-31-forgot-password
Merged: 2025-12-24T15:30:00Z
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

### Fase 3: Cerrar Issue Frontend

```bash
cd ${FRONTEND_REPO}

gh issue close $FE_ISSUE_NUMBER --comment "✅ Completed via PR #$PR_NUMBER

**Summary:** [Extraer de GOAL.md o PR description]

**Integration:** Frontend implementation for BE endpoint(s)

🤖 Generated with [Claude Code](https://claude.ai/code)"
```

---

### Fase 4: Archivar Workflow Frontend

**Crear directorio y copiar archivos:**

```bash
cd ${FRONTEND_REPO}

SLUG=$(echo $BRANCH_NAME | sed 's/feat\/issue-[0-9]*-//')
ARCHIVE_DIR="ai_docs/state/complete/${DATE}_fe-issue-${FE_ISSUE_NUMBER}-${SLUG}"
mkdir -p $ARCHIVE_DIR

# Copiar estado actual
cp ai_docs/state/PROGRESS.yaml $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/state/PROGRESS.json $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/state/GOAL.md $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/state/DECISIONS.md $ARCHIVE_DIR/ 2>/dev/null || true
cp ai_docs/strategic/current/STRATEGIC-PLAN-FE${FE_ISSUE_NUMBER}.md $ARCHIVE_DIR/ 2>/dev/null || true
```

**Crear VALIDATION_REPORT:**

```markdown
# Validation Report: FE Issue #${FE_ISSUE_NUMBER} - ${TITLE}

**Date:** ${DATE}
**PR:** #${PR_NUMBER}
**Status:** ✅ MERGED
**Repo:** ideas-frontend

## Implementation Summary
[Extraer de PROGRESS.yaml: milestones completados]

## Components Created/Modified
[Lista de componentes React creados o modificados]

## API Integration
[Hooks utilizados, endpoints consumidos]

## Files Changed
[Extraer de PROGRESS.yaml: files_created, files_modified]

## Test Coverage
[Extraer de PROGRESS.yaml: tests_passed/tests_total]

---
*Generated with Claude Code*
```

---

### Fase 5: Actualizar MVP_ISSUES_EXECUTION_ORDER.md (Frontend)

**Campos a actualizar:**

| Sección | Cambio |
|---------|--------|
| Executive Summary | `FE Completed: N → N+1` |
| Sprint X Status | `READY → COMPLETED` para FE issue |
| Frontend Issues | Mover de Open/Ready a Completed |
| Integration Status | Marcar flow como `FE+BE COMPLETE` |
| Progress Tracker | Actualizar % completado |
| Footer | Actualizar fecha y changelog |

---

### Fase 6: Actualizar CLAUDE.md (Frontend)

**Agregar a API Integration Status:**

```markdown
| ✅ {Feature Name} | `use{Feature}()`, `useCreate{Feature}()` | FE #{FE_ISSUE_NUMBER}, PR #{PR_NUMBER} |
```

**Actualizar Recent Changes section:**

```markdown
### {Feature Name} Integration ({DATE})
- ✅ `{ComponentName}.tsx` - {description}
- ✅ `use{Feature}.ts` - API hook for {endpoint}
- ✅ Connected to BE endpoint: `{METHOD} {ENDPOINT}`
```

**Actualizar footer:**

```markdown
**Last updated:** {DATE} | **Version:** X.Y ({SPRINT_NAME}: {FEATURES})
```

---

### Fase 7: Preparar Próximo Sprint (Frontend)

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
# Ready for next FE workflow
```

**Limpiar archivos estratégicos:**

```bash
# Mover strategic plan completado al archive
mv ai_docs/strategic/current/STRATEGIC-PLAN-FE${FE_ISSUE_NUMBER}.md \
   ai_docs/strategic/archive/ 2>/dev/null || true
```

**Actualizar GOAL.md y user_prompt.md para próximo sprint FE.**

---

### Fase 8: Sincronización Cross-Repo ⭐ v5.1 (Frontend → Backend)

> **Notifica al backend sobre feature FE completado**

#### 8a. Actualizar LAST_SYNC.yaml (Frontend)

```yaml
schema_version: "1.0"
last_updated: "{TIMESTAMP}"
triggered_by: "post-merge-2"

sync_direction: "frontend -> backend"

frontend:
  repo: "ideas-frontend"
  last_pr_merged: {PR_NUMBER}
  last_issue_closed: {FE_ISSUE_NUMBER}
  status: "SYNCED"
  last_feature_completed: "{FEATURE_NAME}"

backend:
  repo: "ideas"
  endpoints_consumed:
    - endpoint: "{ENDPOINT}"
      method: "{METHOD}"
      consumed_by: "FE #{FE_ISSUE_NUMBER}"
  integration_status: "COMPLETE"

flows_completed:
  - name: "{FEATURE_NAME}"
    frontend_issue: {FE_ISSUE_NUMBER}
    frontend_pr: {PR_NUMBER}
    backend_issue: {BE_ISSUE_NUMBER}  # Issue BE que desbloqueó este FE
    completed_at: "{MERGED_AT}"
    components_created:
      - name: "{ComponentName}"
        path: "{PATH}"
        hooks_used: ["{HOOKS}"]

progress:
  total_fe_issues: 15
  completed: {N}
  percentage: {PCT}
```

#### 8b. Regenerar CONTINUE_SESSION.md (Frontend)

Actualizar con:
- Feature FE completado
- Flujos BE-FE integrados
- Próximo FE issue ready
- Estado de integración

#### 8c. Crear SYNC_REPORT (Frontend)

```bash
SYNC_REPORT="${FRONTEND_REPO}/ai_docs/sync/SYNC_REPORT_${DATE}.md"
```

Contenido:
- Executive Summary del feature FE
- Componentes creados con paths
- Hooks utilizados
- Endpoints BE consumidos
- Screenshots si aplica

#### 8d. Crear Notificación en Backend (si no --frontend-only)

```bash
NOTIFICATION="${BACKEND_REPO}/ai_docs/notifications/FE_FEATURE_COMPLETE_${DATE}.md"
```

Contenido:
```markdown
# Frontend Feature Complete: {FEATURE_NAME}

**Date:** {DATE}
**FE Issue:** #{FE_ISSUE_NUMBER}
**FE PR:** #{PR_NUMBER}

## Integration Summary

Frontend has completed implementation for:
- **Feature:** {FEATURE_NAME}
- **Components:** {COMPONENTS_LIST}
- **Hooks:** {HOOKS_LIST}

## Backend Endpoints Consumed

| Endpoint | Method | Status |
|----------|--------|--------|
| {ENDPOINT} | {METHOD} | ✅ Integrated |

## Notes for Backend

{Any notes about edge cases, error handling, or API feedback}

## Next Steps

- [ ] Verify E2E flow works
- [ ] Check analytics/metrics if applicable
- [ ] Update API documentation if needed

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

### Fase 9: Append a PROGRESS.json (Persistent Memory) ⭐ v5.1

```python
# Append workflow to history (never overwrite)
progress_json = read("ai_docs/state/PROGRESS.json")

new_workflow = {
    "workflow_id": f"fe-{DATE}_{SLUG}",
    "repo": "ideas-frontend",
    "issue": f"FE #{FE_ISSUE_NUMBER}",
    "pr": PR_NUMBER,
    "started_at": "{STARTED_AT}",
    "completed_at": "{MERGED_AT}",
    "result": "SUCCESS",
    "files_modified": len(files),
    "components_created": ["{COMPONENTS}"],
    "hooks_used": ["{HOOKS}"],
    "domain": "{DOMAIN}",
    "complexity": {COMPLEXITY}
}

progress_json["workflows_history"].append(new_workflow)
progress_json["cumulative_stats"]["total_workflows"] += 1
progress_json["cumulative_stats"]["successful_workflows"] += 1
progress_json["cumulative_stats"]["frontend_integrations"] += 1
progress_json["last_updated"] = "{TIMESTAMP}"

write("ai_docs/state/PROGRESS.json", progress_json)
```

---

### Fase 10: Commit y Push (Ambos Repos)

**Frontend (primero):**

```bash
cd ${FRONTEND_REPO}

git add \
  CLAUDE.md \
  ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md \
  ai_docs/state/PROGRESS.yaml \
  ai_docs/state/PROGRESS.json \
  ai_docs/state/GOAL.md \
  ai_docs/state/DECISIONS.md \
  ai_docs/state/complete/${DATE}_fe-issue-${FE_ISSUE_NUMBER}-*/ \
  ai_docs/sync/LAST_SYNC.yaml \
  ai_docs/sync/SYNC_REPORT_${DATE}.md \
  ai_docs/continue_session/CONTINUE_SESSION.md \
  user_prompt.md

git commit -m "docs: post-merge FE #${FE_ISSUE_NUMBER} - ${FEATURE} complete

Feature Summary:
- FE #${FE_ISSUE_NUMBER}: ${TITLE} (PR #${PR_NUMBER})

Documentation updates:
- MVP_ISSUES_EXECUTION_ORDER.md: FE issue COMPLETE
- CLAUDE.md: Add to API Integration Status
- Archive workflow to complete/
- Sync notification sent to backend

Components: ${COMPONENTS_LIST}
Hooks: ${HOOKS_LIST}

Progress: ${COMPLETED}/${TOTAL} FE issues (${PCT}%)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin main
```

**Backend (si no --frontend-only):**

```bash
cd ${BACKEND_REPO}

git add ai_docs/notifications/FE_FEATURE_COMPLETE_${DATE}.md

git commit -m "docs: FE feature complete notification - ${FEATURE}

Frontend integration completed:
- FE #${FE_ISSUE_NUMBER}: ${TITLE} (PR #${PR_NUMBER})

Endpoints consumed:
${ENDPOINTS_LIST}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin main
```

---

## Output Final

```markdown
## ✅ Post-Merge Automation Complete (v5.1 - Frontend → Backend)

### Feature Summary

| Metric | Value |
|--------|-------|
| Repo | ideas-frontend |
| FE Issue | #${FE_ISSUE_NUMBER} |
| PR | #${PR_NUMBER} |
| Feature | ${FEATURE_NAME} |
| Merged | ${MERGED_AT} |

### Acciones Realizadas

| Fase | Acción | Status |
|------|--------|--------|
| 1 | Contexto extraído | ✅ |
| 2 | PR merged | ✅ |
| 3 | FE Issue cerrada | ✅ |
| 4 | Workflow archivado | ✅ `complete/${DATE}_fe-issue-${FE_ISSUE_NUMBER}/` |
| 5 | MVP_ISSUES actualizado | ✅ FE #${FE_ISSUE_NUMBER} COMPLETE |
| 6 | CLAUDE.md actualizado | ✅ v${X.Y} |
| 7 | Estado reseteado | ✅ Ready for next FE issue |
| 8 | Cross-repo sync | ✅ Notification sent to backend |
| 9 | PROGRESS.json updated | ✅ FE workflow added |
| 10 | Commit y push | ✅ FE: ${FE_COMMIT} | BE: ${BE_COMMIT} |

### Archivos Frontend Actualizados

| Archivo | Cambio |
|---------|--------|
| `CLAUDE.md` | v${X.Y} - Added ${FEATURE} integration |
| `ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md` | FE #${FE_ISSUE_NUMBER} COMPLETE |
| `ai_docs/state/PROGRESS.yaml` | Reset for next workflow |
| `ai_docs/state/PROGRESS.json` | FE workflow added to history |
| `ai_docs/state/GOAL.md` | Updated for next FE issue |
| `ai_docs/sync/LAST_SYNC.yaml` | Synced with backend |
| `ai_docs/sync/SYNC_REPORT_${DATE}.md` | Created |
| `ai_docs/continue_session/CONTINUE_SESSION.md` | Regenerated |
| `user_prompt.md` | Next steps updated |

### Archivos Backend Actualizados

| Archivo | Cambio |
|---------|--------|
| `ai_docs/notifications/FE_FEATURE_COMPLETE_${DATE}.md` | Created |

### Archivos Archivados

```
ai_docs/state/complete/${DATE}_fe-issue-${FE_ISSUE_NUMBER}-${SLUG}/
├── PROGRESS.yaml
├── PROGRESS.json
├── GOAL.md
├── DECISIONS.md
└── STRATEGIC-PLAN-FE${FE_ISSUE_NUMBER}.md
```

### Components Created

| Component | Path | Hooks Used |
|-----------|------|------------|
| ${ComponentName} | ${PATH} | ${HOOKS} |

### Endpoints Consumed

| Endpoint | Method | Status |
|----------|--------|--------|
| ${ENDPOINT_1} | ${METHOD} | ✅ Integrated |
| ${ENDPOINT_2} | ${METHOD} | ✅ Integrated |

### Progress

```
FE Issues 1-${N-1} [========] COMPLETE
FE Issue ${N}      [========] COMPLETE ← NEW
FE Issue ${N+1}    [........] READY

Overall FE: ████████████████░░░░ ${PCT}% (${COMPLETED}/${TOTAL})
```

### Próximo Paso

```bash
# Continuar en frontend con siguiente issue
cd ~/Documents/GitHub/ideas-frontend
/primer
gh issue view ${NEXT_FE_ISSUE}
/workflow-task

# O cambiar a backend para verificar E2E
cd ~/Documents/GitHub/ideas
cat ai_docs/notifications/FE_FEATURE_COMPLETE_${DATE}.md
```
```

---

## Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                   /post-merge-2 [PR_NUMBER]                      │
│                  (Frontend → Backend Sync)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1-3: Contexto + Merge + Close FE Issue                      │
│ ─────────────────────────────────────────────                    │
│ • Auto-detectar PR y FE Issue                                    │
│ • Merge si OPEN                                                  │
│ • Cerrar FE Issue con comentario                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4-6: Documentación Frontend                                 │
│ ───────────────────────────────                                  │
│ • Archivar workflow a complete/                                  │
│ • Actualizar MVP_ISSUES_EXECUTION_ORDER.md                       │
│ • Actualizar CLAUDE.md API Integration Status                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 7: Preparar Próximo FE Issue                                │
│ ─────────────────────────────────                                │
│ • Reset PROGRESS.yaml                                            │
│ • Mover strategic plan a archive                                 │
│ • Actualizar GOAL.md y user_prompt.md                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 8: Cross-Repo Sync (Frontend → Backend)                     │
│ ─────────────────────────────────────────────                    │
│ • Actualizar LAST_SYNC.yaml (FE)                                 │
│ • Regenerar CONTINUE_SESSION.md                                  │
│ • Crear SYNC_REPORT                                              │
│ • Crear notificación en backend                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 9: Persistent Memory                                        │
│ ─────────────────────────────                                    │
│ • Append FE workflow a PROGRESS.json                             │
│ • Actualizar cumulative_stats + frontend_integrations            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ FASE 10: Commit + Push (Frontend + Backend)                      │
│ ───────────────────────────────────────────                      │
│ • git add + commit + push (frontend) ← PRIMERO                   │
│ • git add + commit + push (backend)  ← SEGUNDO                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ✅ POST-MERGE COMPLETE
                    (FE → BE Sync Done)
```

---

## Comparación de Versiones

| Fase | v5.0 (BE→FE) | v5.1 (FE→BE) |
|------|--------------|--------------|
| Dirección | Backend → Frontend | **Frontend → Backend** |
| 1-3 | Contexto BE | Contexto FE |
| 4-6 | Docs Backend | **Docs Frontend** |
| 7 | Preparar BE | **Preparar FE** |
| 8 | Notifica a FE | **Notifica a BE** |
| 9 | PROGRESS.json BE | **PROGRESS.json FE** |
| 10 | Commit BE+FE | **Commit FE+BE** |

**Mejoras v5.1:**
- ✅ Dirección invertida: Frontend → Backend
- ✅ Crea notificación en backend cuando FE completa feature
- ✅ Actualiza LAST_SYNC.yaml con endpoints consumidos
- ✅ Registra componentes creados y hooks utilizados
- ✅ Append a PROGRESS.json con metadata de frontend
- ✅ Commit y push frontend primero, luego backend
- ✅ Flags opcionales: `--skip-sync`, `--frontend-only`

---

## Ejemplo de Ejecución

```bash
# Después de aprobar PR #48 en frontend
/post-merge-2 48

# Output:
## ✅ Post-Merge Automation Complete (v5.1 - Frontend → Backend)

Feature Complete:
- FE #31: Forgot Password Flow (PR #48)

Components Created:
- ForgotPasswordForm.tsx
- ResetPasswordPage.tsx

Hooks Used:
- useForgotPassword()
- useResetPassword()

Endpoints Consumed:
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

Backend Notification: ai_docs/notifications/FE_FEATURE_COMPLETE_2025-12-24.md

Progress: 3/15 FE issues (20%)

Next: gh issue view ${NEXT_FE_ISSUE} && /workflow-task
```

---

**Versión:** 5.1
**Actualizado:** 2025-12-24
**Autor:** workflow-task
**Repo:** ideas-frontend

**Changelog:**
- v5.1: Frontend → Backend sync
  - Dirección invertida: FE notifica a BE
  - Fase 8: Sincronización automática hacia backend
  - Fase 9: PROGRESS.json con metadata de frontend (componentes, hooks)
  - Fase 10: Commit FE primero, luego BE
  - Flags: `--skip-sync`, `--frontend-only`
  - Crea notificación en backend cuando FE completa feature
- v5.0: Backend → Frontend sync (original)
- v4.0: Automatización completa de documentación
- v3.0: Cross-Repo Sync (separado)
- v2.0: Primer-compatible
- v1.0: Versión inicial
