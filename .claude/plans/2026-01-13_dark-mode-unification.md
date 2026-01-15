# Plan de Ejecucion: Dark Mode Unification

> **Generado:** 2026-01-13
> **Issue:** N/A (mejora UX)
> **Phase:** Unificacion visual

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "dark-mode-unification"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Unificar la landing page de StudioTek a modo oscuro exclusivo:
1. Eliminar el toggle de tema (AnimatedThemeToggler) del Header
2. Simplificar CSS eliminando modo claro, dejando solo modo oscuro
3. Actualizar el Footer al estilo de la seccion "Por que automatizar"
4. Asegurar consistencia visual en todas las secciones

## Code Structure

```yaml
DELETE:
  - "components/magicui/animated-theme-toggler.tsx"

MODIFY:
  - "components/sections/Header.tsx"
  - "components/sections/Footer.tsx"
  - "app/globals.css"

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 1: Eliminar Theme Toggle del Header

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Eliminar AnimatedThemeToggler",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL001 (Tailwind 4 @theme inline), SL005 (Header fixed)
     - blockers: Conocidos
     - file_patterns_discovered: components/sections/*.tsx

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones D037, D038 sobre Header

  # CONTEXTO

  - Branch: main
  - Archivos: Header.tsx, animated-theme-toggler.tsx

  # TAREA

  1. Modificar `components/sections/Header.tsx`:
     - Eliminar linea: `import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';`
     - Eliminar `<AnimatedThemeToggler />` del JSX
     - Mantener el resto del Header intacto

  2. Eliminar archivo `components/magicui/animated-theme-toggler.tsx`

  ## Archivos

  MODIFY: components/sections/Header.tsx
  DELETE: components/magicui/animated-theme-toggler.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: Header.tsx
     - Archivos eliminados: animated-theme-toggler.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - En decisions: Agregar decision sobre eliminacion de toggle
     - Actualizar metadata: tasks_handled, updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -r "AnimatedThemeToggler" components/`
- Criterio: No debe encontrar resultados

---

### FASE 2: Simplificar CSS a Dark Mode Only

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Simplificar globals.css",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL001 sobre @theme inline
     - file_patterns_discovered: app/globals.css

  # CONTEXTO

  - Branch: main
  - Archivo: app/globals.css

  # TAREA

  Modificar `app/globals.css`:

  1. ELIMINAR bloque :root completo (variables modo claro):
     ```css
     :root {
       /* Primary */
       --primary: #0066FF;
       ...
     }
     ```

  2. RENOMBRAR .dark a :root (hacer dark el default):
     ```css
     /* ANTES */
     .dark {
       --primary: #3B82F6;
       ...
     }

     /* DESPUES */
     :root {
       --primary: #3B82F6;
       --primary-hover: #60A5FA;
       --primary-light: #1E3A5F;
       --background: #0F172A;
       --surface: #1E293B;
       --text-primary: #F1F5F9;
       --text-secondary: #94A3B8;
       --border: #334155;
       --success: #10B981;
       --error: #EF4444;
       --foreground: var(--text-primary);
     }
     ```

  3. ELIMINAR View Transition CSS (ya no hay toggle):
     ```css
     /* View Transition for Theme Toggle */
     ::view-transition-old(root),
     ::view-transition-new(root) {
       animation: none;
       mix-blend-mode: normal;
     }
     ```

  4. MANTENER:
     - @theme inline (con valores referenciando variables)
     - Keyframes de Magic UI
     - Estilos de html, body, canvas
     - Portfolio styles

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios realizados en globals.css
     - Lineas eliminadas vs mantenidas
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - En decisions: Agregar decision sobre CSS dark-only
     - Actualizar metadata
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "\.dark" app/globals.css`
- Criterio: Resultado debe ser 0

---

### FASE 3: Actualizar Footer al Estilo Oscuro

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Footer estilo Benefits",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer Benefits.tsx como referencia de estilo

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Footer.tsx
  - Referencia: Benefits.tsx (bg-slate-950, text-white, text-slate-400)

  # TAREA

  Modificar `components/sections/Footer.tsx`:

  1. Cambiar clases del footer principal:
     - `bg-surface` -> `bg-slate-950`
     - `border-t border-border` -> `border-t border-slate-800`

  2. Cambiar clases de texto:
     - `text-text-primary` -> `text-white`
     - `text-text-secondary` -> `text-slate-400`
     - `hover:text-primary` -> `hover:text-blue-400`

  3. Cambiar clase del border interno:
     - `border-t border-border` -> `border-t border-slate-800`

  ## Mapeo de cambios:
  | Original              | Nuevo                  |
  |-----------------------|------------------------|
  | bg-surface            | bg-slate-950           |
  | border-border         | border-slate-800       |
  | text-text-primary     | text-white             |
  | text-text-secondary   | text-slate-400         |
  | hover:text-primary    | hover:text-blue-400    |

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Todas las clases actualizadas
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - En decisions: Agregar decision sobre Footer dark style
     - Actualizar metadata
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep "bg-surface\|border-border\|text-text-" components/sections/Footer.tsx`
- Criterio: No debe encontrar resultados (todas las variables CSS reemplazadas)

---

### FASE 4: Validacion

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 4: Build + Lint validation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # CONTEXTO

  - Branch: main
  - Cambios: Header, Footer, globals.css

  # TAREA

  1. Ejecutar build:
     ```bash
     npm run build
     ```
     Criterio: Exit code 0, sin errores

  2. Ejecutar lint:
     ```bash
     npm run lint
     ```
     Criterio: Sin errores (warnings OK)

  3. Verificar que no quedan referencias al toggle:
     ```bash
     grep -r "AnimatedThemeToggler" . --include="*.tsx" --include="*.ts"
     grep -r "\.dark" app/globals.css
     ```
     Criterio: Sin resultados

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Build: PASS/FAIL
     - Lint: PASS/FAIL
     - Referencias huerfanas: SI/NO
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
     - Actualizar metadata
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0 en ambos

---

## Checkpoints

| CP  | Fase   | Criterio                                | Comando                                    |
|-----|--------|----------------------------------------|-------------------------------------------|
| CP1 | FASE 1 | No refs a AnimatedThemeToggler         | `grep -r "AnimatedThemeToggler" components/` |
| CP2 | FASE 2 | No .dark class en CSS                  | `grep -c "\.dark" app/globals.css`        |
| CP3 | FASE 3 | No variables CSS en Footer             | `grep "bg-surface" components/sections/Footer.tsx` |
| CP4 | FASE 4 | Build + Lint pasan                     | `npm run build && npm run lint`           |

## Risk Matrix

| Riesgo                              | Impacto | Mitigacion                                        |
|-------------------------------------|---------|--------------------------------------------------|
| Componentes UI usan variables CSS   | Medio   | Mantener variables en :root con valores dark     |
| Import huerfano en algun archivo    | Bajo    | grep exhaustivo + build catch                    |
| Estilos inconsistentes en Footer    | Bajo    | Usar clases directas de Tailwind como Benefits   |

## Decisiones Aplicadas

- **SL001:** Tailwind 4 usa @theme inline (mantener)
- **SL005:** Header fixed con backdrop-blur (mantener estilo)
- **D037/D038:** Logo href y header simplificado (no afectados)

---

**Generado por:** /plan-task
**Version:** 3.2
