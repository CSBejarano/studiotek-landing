# Sync Frontend Command v3.0

Sincroniza documentación entre backend y frontend automáticamente.

## Uso

```bash
/sync-frontend [--check-only]
```

## Configuración

```yaml
BACKEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas
FRONTEND_REPO: /Users/cristianbejaranomendez/Documents/GitHub/ideas-frontend
```

---

## Ejecución Automática

### Paso 1: Recolectar Estado (Paralelo)

Ejecutar en paralelo:

```bash
# Backend PRs
gh pr list --repo CSBejarano/ideas --state merged --limit 10 --json number,title,mergedAt

# Frontend PRs
gh pr list --repo CSBejarano/ideas-frontend --state merged --limit 15 --json number,title,mergedAt
```

Leer en paralelo:
- `{FRONTEND_REPO}/ai_docs/state/PROGRESS.yaml`
- `{FRONTEND_REPO}/ai_docs/sync/LAST_SYNC.yaml`
- `{BACKEND_REPO}/ai_docs/sync/LAST_SYNC.yaml`
- `{FRONTEND_REPO}/ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md`
- `{BACKEND_REPO}/ai_docs/notifications/FE_FEATURE_COMPLETE_{DATE}.md`


### Paso 2: Analizar y Detectar

Detectar automáticamente:
1. **Sprint actual** - Último sprint con issues CLOSED
2. **Issues desbloqueados** - FE issues cuyo backend_dep está DONE
3. **Flujos completados** - Pares BE-FE donde ambos están MERGED
4. **Próximos pasos** - Issues READY ordenados por prioridad
5. **Progreso** - Conteo de issues completados vs total

### Paso 3: Actualizar Archivos (si no --check-only)

Actualizar estos archivos en el **backend**:

| Archivo | Contenido |
|---------|-----------|
| `ai_docs/sync/LAST_SYNC.yaml` | Estado de sincronización, issues desbloqueados |
| `ai_docs/continue_session/CONTINUE_SESSION.md` | Contexto compacto actualizado |
| `user_prompt.md` | Próximos pasos recomendados |
| `ai_docs/sync/SYNC_REPORT_{DATE}.md` | Reporte detallado |
| `ai_docs/state/PROGRESS.yaml` | Progreso actualizado |
| `ai_docs/state/PROGRESS.json` | Checkpoint de progreso |
| `ai_docs/state/DECISIONS.md` | Decisiones técnicas tomadas |
| `ai_docs/state/GOAL.md` | Objetivo del issue actual |
| `ai_docs/issue_analysis/MVP_ISSUES_EXECUTION_ORDER.md` | Orden de ejecución de issues |


### Paso 4: Commit y Push

```bash
# Backend
git add ai_docs/sync/ ai_docs/continue_session/ user_prompt.md
git commit -m "docs: sync frontend state - Sprint {N} complete"
git push origin main
```

---

## Templates

### LAST_SYNC.yaml

```yaml
schema_version: "1.0"
last_updated: "{TIMESTAMP}"
triggered_by: "sync-frontend"

sprint_status:
  # Detectar automáticamente del MVP_ISSUES_EXECUTION_ORDER.md
  sprint_{N-1}: "COMPLETE"
  sprint_{N}: "READY_TO_START"

issues_unblocked_by_sprint_{N-1}:
  # Extraer issues FE cuyo backend_dep ahora está DONE
  - number: {FE_ISSUE}
    title: "{TITLE}"
    unblocked_by: "BE #{BE_ISSUE}"
    priority: "{P1|P2|P3}"

progress:
  total_issues: {TOTAL}
  completed: {DONE}
  percentage: {PCT}
```

### CONTINUE_SESSION.md

```markdown
<compact_context project="WhatsApp Business Booking SaaS" generated="{DATE}">

## Estado Actual - {DATE}

### Sprints Completados: 1-{N} ({DONE}/{TOTAL} = {PCT}%)

| Sprint | Status | Highlight |
|--------|--------|-----------|
{SPRINT_TABLE}

### Sprint {N+1} Status: READY TO START

| Issue | Title | Priority | Backend Dep | Status |
|-------|-------|----------|-------------|--------|
{READY_ISSUES_TABLE}

## APIs Disponibles (Sprint {N})

{APIS_SECTION}

## Próximo Paso Recomendado

{NEXT_STEPS}

</compact_context>
```

### user_prompt.md

```markdown
## Sprint {N+1} Ready

**Date:** {DATE}
**Previous:** Sprint {N} COMPLETE
**Sync:** `/sync-frontend` executed

---

## Sprint {N} Summary

{SPRINT_SUMMARY_TABLE}

## Sprint {N+1} - Ready Issues

{READY_ISSUES_WITH_APIS}

## Quick Start

```bash
cd ~/Documents/GitHub/ideas-frontend
/primer
gh issue view {FIRST_READY_ISSUE}
/workflow-task
```

---

**Progress: {DONE}/{TOTAL} ({PCT}%)**
```

### Notificación Frontend

```markdown
# Sprint {N+1} Ready - {FEATURE_NAME}

**From:** Backend (ideas)
**To:** Frontend (ideas-frontend)
**Date:** {DATE}

## Backend Completed

{COMPLETED_ISSUES_TABLE}

## Issues Now Ready

{READY_ISSUES_TABLE}

## API Endpoints Available

{API_DOCUMENTATION}

## Quick Start

```bash
cd ~/Documents/GitHub/ideas-frontend
/primer
gh issue view {FIRST_ISSUE}
/workflow-task
```
```

---

## Lógica de Detección

### Detectar Sprint Actual

```python
# Pseudocódigo
current_sprint = max(sprint for sprint in MVP_ISSUES if all_issues_closed(sprint))
next_sprint = current_sprint + 1
```

### Detectar Issues Desbloqueados

```python
unblocked = []
for fe_issue in frontend_issues:
    if fe_issue.blocked_by:
        be_issues = parse_blocked_by(fe_issue.blocked_by)
        if all(is_closed(be) for be in be_issues):
            unblocked.append(fe_issue)
```

### Calcular Progreso

```python
total = count_all_mvp_issues()
completed = count_closed_issues()
percentage = (completed / total) * 100
```

---

## Output

### Modo Normal

```
## /sync-frontend Complete

| Repo | Commit | Status |
|------|--------|--------|
| Backend | {COMMIT} | Pushed |
| Frontend | {COMMIT} | Pushed |

### Archivos Actualizados

Backend: LAST_SYNC.yaml, CONTINUE_SESSION.md, user_prompt.md, SYNC_REPORT.md
Frontend: SPRINT_{N}_READY_{DATE}.md

### Estado

Sprint {N}: COMPLETE
Sprint {N+1}: READY ({COUNT} issues)
Progress: {DONE}/{TOTAL} ({PCT}%)

### Próximos Pasos

cd ~/Documents/GitHub/ideas-frontend && /primer
```

### Modo --check-only

```
## Sync Check

Sprint actual: {N} COMPLETE
Issues desbloqueados: {COUNT}
Progress: {DONE}/{TOTAL} ({PCT}%)

Ejecutar `/sync-frontend` para sincronizar.
```

---

## Notas

- Idempotente: múltiples ejecuciones no duplican datos
- Detecta automáticamente sprints, issues y progreso
- Actualiza todos los archivos que lee `/primer`
- Crea notificación en frontend con APIs disponibles
- Commit y push automático a ambos repos

---

**Versión:** 3.0
**Actualizado:** 2025-12-24
