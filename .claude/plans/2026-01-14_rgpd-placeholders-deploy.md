# Plan de Ejecucion: RGPD Placeholders + Deploy

> **Generado:** 2026-01-14T19:00:00Z
> **Issue:** N/A (tarea ad-hoc)
> **Mode:** Ralph Wiggum (Loop Automatico)

## Variables

```yaml
WORKFLOW_ID: "2026-01-14_rgpd-placeholders-deploy"
BRANCH: "main"
DOMAIN: "frontend, infra"
MAX_ITERATIONS: 15
COMPLETION_PROMISE: "DEPLOY COMPLETE"
```

## Purpose

Completar los placeholders pendientes en la pagina de Politica de Privacidad con datos ficticios, hacer commit de todos los cambios del sistema RGPD, y desplegar a produccion en Vercel.

## Code Structure

```yaml
MODIFY:
  - "app/politica-privacidad/page.tsx"  # Completar placeholders

GIT_STAGED:
  # Archivos del workflow RGPD anterior pendientes de commit
  - "components/cookies/*.tsx"           # 6 archivos
  - "components/ui/Checkbox.tsx"
  - "app/politica-cookies/*.tsx"         # 2 archivos
  - "app/politica-privacidad/*.tsx"      # 2 archivos
  - "lib/cookie-config.ts"
  - "lib/cookies.ts"
  - "app/layout.tsx"
  - "components/sections/ContactForm.tsx"
  - "components/sections/Footer.tsx"
  - "lib/validations.ts"
```

## WORKFLOW

### FASE 0: Completar Placeholders

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 0: Completar placeholders RGPD",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar SL001-SL033
     - blockers: Verificar si hay blockers relevantes

  # CONTEXTO

  - Archivo: app/politica-privacidad/page.tsx
  - Tarea: Completar 3 placeholders con datos ficticios

  # TAREA

  Editar `app/politica-privacidad/page.tsx` con estos cambios:

  1. Linea 58 - Razon Social:
     ANTES: `StudioTek [NOMBRE COMPLETO O RAZON SOCIAL]`
     DESPUES: `StudioTek Soluciones Digitales S.L.`

  2. Linea 62 - CIF:
     ANTES: `[PLACEHOLDER - Completar con dato real]`
     DESPUES: `B12345678`

  3. Linea 66 - Domicilio:
     ANTES: `[PLACEHOLDER - Completar con direccion real]`
     DESPUES: `Calle Innovacion 42, 28001 Madrid, Espana`

  ## Archivos

  MODIFY: app/politica-privacidad/page.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Ejecutar `npm run build` para verificar que compila
  2. Generar informe:
     - Archivos modificados: 1
     - Estado: SUCCESS | PARTIAL | BLOCKED

  NOTA: No actualizar frontend.yaml (cambio trivial sin decisiones nuevas)
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Exit code 0, sin errores de compilacion

---

### FASE 1: Commit RGPD

**Agente:** @infra

~~~~~markdown
Task(
  subagent_type: "infra",
  description: "FASE 1: Commit cambios RGPD",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Ejecutar `git status` para ver todos los cambios pendientes
  2. Ejecutar `git pull origin main` para asegurar sincronizacion

  # CONTEXTO

  - Branch: main
  - Cambios: Sistema RGPD completo (cookies, legal pages, form checkboxes)

  # TAREA

  Ejecutar comandos git en secuencia:

  ```bash
  # 1. Agregar todos los cambios
  git add -A

  # 2. Crear commit con mensaje descriptivo
  git commit -m "feat: Add RGPD/LOPDGDD compliance system

  - Cookie banner with 3-layer consent (AEPD Guidelines 2023)
  - Legal pages: /politica-cookies, /politica-privacidad
  - Contact form RGPD checkboxes (privacy + commercial opt-in)
  - Footer legal links + cookie settings button
  - CookieContext for consent state management

  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

  # 3. Push a remote
  git push origin main
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Ejecutar `git status` para verificar limpieza
  2. Generar informe:
     - Commit SHA: (capturar)
     - Files committed: ~15
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `git status`
- Criterio: "nothing to commit, working tree clean"

---

### FASE 2: Deploy a Produccion

**Agente:** @infra

~~~~~markdown
Task(
  subagent_type: "infra",
  description: "FASE 2: Deploy Vercel production",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Verificar Vercel CLI: `which vercel`
  2. Verificar autenticacion: `vercel whoami`
  3. Si no autenticado, ejecutar `vercel login`

  # CONTEXTO

  - Plataforma: Vercel
  - Ambiente: Production
  - Framework: Next.js 16

  # TAREA

  Ejecutar deploy a produccion:

  ```bash
  vercel deploy --prod
  ```

  Esperar confirmacion de URL de produccion.

  # POST-TAREA (OBLIGATORIO)

  1. Verificar deployment exitoso con URL
  2. Actualizar archivos de estado:
     - ai_docs/state/PROGRESS.json: phase 9_deploy = "COMPLETE"
     - ai_docs/state/GOAL.md: Deploy = COMPLETE
     - ai_docs/continue_session/CONTINUE_SESSION.md: Estado actualizado

  3. Generar informe final:
     - Production URL: (capturar)
     - Estado: DEPLOY COMPLETE
  """
)
~~~~~

**Checkpoint:**

- Comando: `vercel inspect` o verificar URL de produccion
- Criterio: Deployment "ready" con URL de produccion visible

---

## Ralph Wiggum Self-Correction

| Fallo Detectado | Accion | Fase Destino |
|-----------------|--------|--------------|
| npm build falla | Fix syntax | FASE 0 |
| git push conflict | Pull + merge | FASE 1 |
| vercel auth fail | vercel login | FASE 2 |

**Limites:**
- Max 3 reintentos por fase
- Max 15 iteraciones globales
- Exit en "DEPLOY COMPLETE"

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | FASE 0 | Build exitoso | `npm run build` |
| CP1 | FASE 1 | Working tree clean | `git status` |
| CP2 | FASE 2 | Production URL | `vercel inspect` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Build fail | Medio | Validar cambios simples |
| Git conflict | Medio | Pull antes de push |
| Vercel auth expired | Alto | Verificar whoami antes |
| DNS issues | Alto | Usar preview URL primero |

---

**Version:** 1.0 | **Generado por:** /plan-task v3.2
