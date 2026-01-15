# Plan de Ejecucion: Agregar Animated Theme Toggler

> **Generado:** 2026-01-13
> **Descripcion:** Agregar componente animated-theme-toggler de Magic UI a la landing page

## Variables

```yaml
DOMAIN: "frontend"
BRANCH: "main"
WORKFLOW_ID: "2026-01-13_add-theme-toggler"
```

## Purpose

Agregar el componente AnimatedThemeToggler de Magic UI al Header de la landing page para permitir cambiar entre tema claro y oscuro con una animacion circular suave usando View Transitions API.

## Code Structure

```yaml
CREATE:
  - "components/magicui/animated-theme-toggler.tsx"

MODIFY:
  - "app/globals.css"
  - "components/sections/Header.tsx"

TESTS:
  - Manual validation (npm run build, npm run lint)
```

## WORKFLOW

### FASE 1: Crear Componente AnimatedThemeToggler

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Crear AnimatedThemeToggler component",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar SL001 (Tailwind 4 config), SL005 (Header patterns)
     - file_patterns_discovered: components/magicui/*.tsx

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relacionadas con Magic UI components

  # CONTEXTO

  - Branch: main
  - Archivos: components/magicui/animated-theme-toggler.tsx

  # TAREA

  Crear el componente AnimatedThemeToggler en components/magicui/animated-theme-toggler.tsx

  ## Especificaciones

  1. Seguir patron de componentes Magic UI existentes (shimmer-button.tsx):
     - "use client" directive
     - Import cn from "@/lib/utils"
     - ComponentPropsWithoutRef pattern
     - React.forwardRef
     - displayName

  2. Funcionalidad del componente:
     - Boton toggle que alterna Sun/Moon icons de lucide-react
     - Usa View Transitions API para animacion circular
     - Fallback para browsers sin soporte (toggle sin animacion)
     - Persiste tema en localStorage
     - Observa cambios en document.documentElement.classList

  3. Props:
     - className: string opcional
     - duration: number (default 400ms)

  ## Codigo Base (adaptar)

  ```tsx
  "use client"

  import { useCallback, useEffect, useRef, useState } from "react"
  import { Moon, Sun } from "lucide-react"
  import { flushSync } from "react-dom"
  import { cn } from "@/lib/utils"

  interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number
  }

  export const AnimatedThemeToggler = React.forwardRef<
    HTMLButtonElement,
    AnimatedThemeTogglerProps
  >(({ className, duration = 400, ...props }, ref) => {
    // ... implementacion con try/catch para View Transitions API
  })

  AnimatedThemeToggler.displayName = "AnimatedThemeToggler"
  ```

  ## Archivos

  CREATE: components/magicui/animated-theme-toggler.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` (si tomaste decisiones importantes):
     - context: "View Transitions API fallback"
       decision: "Try/catch wrapper para graceful degradation en Safari/Firefox"
       confidence: 0.95
       validated_in: "Theme Toggler"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `ls -la components/magicui/animated-theme-toggler.tsx`
- Criterio: Archivo existe

---

### FASE 2: Configurar CSS para View Transitions y Dark Mode

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: CSS View Transitions + Dark Mode",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL001 (Tailwind 4 @theme inline)
     - blockers: SLB002 (Tailwind colors)

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones de CSS/temas

  # CONTEXTO

  - Branch: main
  - Archivos: app/globals.css

  # TAREA

  Modificar globals.css para agregar:

  ## 1. View Transition CSS (requerido por AnimatedThemeToggler)

  ```css
  /* View Transition for Theme Toggle */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  ```

  ## 2. Dark Mode Variables

  Agregar selector .dark con variables invertidas:

  ```css
  .dark {
    --primary: #3B82F6;
    --primary-hover: #60A5FA;
    --primary-light: #1E3A5F;

    --background: #0F172A;
    --surface: #1E293B;
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --border: #334155;

    --foreground: var(--text-primary);
  }
  ```

  ## Ubicacion

  - View Transition CSS: despues de los keyframes existentes
  - .dark selector: despues de :root

  ## Archivos

  MODIFY: app/globals.css

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Lineas agregadas
     - Posicion en archivo
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:`:
     - context: "Dark mode color scheme"
       decision: "Usar slate palette para dark mode (0F172A bg, F1F5F9 text)"
       confidence: 0.90
       validated_in: "Theme Toggler"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `grep -c "view-transition" app/globals.css`
- Criterio: Output > 0

---

### FASE 3: Integrar en Header

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Integrar toggle en Header",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL002 (Header navigation), SL005 (Header fixed positioning)
     - file_patterns_discovered: components/sections/Header.tsx

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - D037, D038 (Header patterns)

  # CONTEXTO

  - Branch: main
  - Archivos: components/sections/Header.tsx

  # TAREA

  Modificar Header.tsx para agregar AnimatedThemeToggler:

  ## 1. Import

  ```tsx
  import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
  ```

  ## 2. Posicion

  Colocar entre el logo y el CTA button:

  ```tsx
  <div className="flex items-center gap-4">
    <AnimatedThemeToggler className="..." />
    <a href="#contact" ...>Contactar</a>
  </div>
  ```

  ## 3. Estilos

  - className para el toggle: hover styles sutiles
  - Mantener consistencia con header backdrop-blur aesthetic
  - Boton transparente/ghost style

  ## Archivos

  MODIFY: components/sections/Header.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios realizados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:`:
     - context: "Theme toggle position in header"
       decision: "Posicionar toggle antes del CTA principal para jerarquia visual"
       confidence: 0.90
       validated_in: "Theme Toggler"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `grep -c "AnimatedThemeToggler" components/sections/Header.tsx`
- Criterio: Output > 0

---

### FASE 4: Validacion

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 4: Validacion build y lint",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`:
     - Checklist de validacion para frontend components

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Patrones de validacion previos

  # CONTEXTO

  - Branch: main
  - Workflow: 2026-01-13_add-theme-toggler

  # TAREA

  Ejecutar validaciones:

  ## 1. Build Check

  ```bash
  npm run build
  ```

  - Criterio: Exit code 0, no errores TypeScript

  ## 2. Lint Check

  ```bash
  npm run lint
  ```

  - Criterio: Exit code 0 o solo warnings

  ## 3. Manual Checklist

  - [ ] Componente se renderiza en header
  - [ ] Click alterna entre Sun y Moon icons
  - [ ] Tema cambia (background/text colors)
  - [ ] Animacion circular funciona en Chrome
  - [ ] Sin animacion pero funcional en Safari/Firefox
  - [ ] Tema persiste tras refresh (localStorage)

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Build: PASS/FAIL
     - Lint: PASS/FAIL
     - Checklist: X/6 items
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:

     En `decisions:` (si encontraste algo):
     - context: "{contexto}"
       decision: "{decision}"
       confidence: 0.XX
       validated_in: "Theme Toggler Validation"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build && echo "BUILD OK"`
- Criterio: "BUILD OK" en output

---

## Checkpoints

| CP  | Fase   | Criterio                      | Comando                                                      |
| --- | ------ | ----------------------------- | ------------------------------------------------------------ |
| CP1 | FASE 1 | Componente creado             | `ls components/magicui/animated-theme-toggler.tsx`           |
| CP2 | FASE 2 | CSS view-transition agregado  | `grep -c "view-transition" app/globals.css`                  |
| CP3 | FASE 3 | Toggle integrado en Header    | `grep -c "AnimatedThemeToggler" components/sections/Header.tsx` |
| CP4 | FASE 4 | Build pasa                    | `npm run build`                                              |

## Risk Matrix

| Riesgo                              | Impacto | Mitigacion                                           |
| ----------------------------------- | ------- | ---------------------------------------------------- |
| View Transitions API no soportado   | Bajo    | Try/catch fallback - toggle funciona sin animacion   |
| Dark mode styles incompletos        | Medio   | Variables basicas definidas, refinamiento posterior  |
| Conflicto con estilos existentes    | Bajo    | CSS scoped a .dark selector                          |

## Notas Tecnicas

### View Transitions API

- Soportado: Chrome 111+, Edge 111+
- No soportado: Safari, Firefox (en desarrollo)
- Fallback: Toggle funciona, solo sin animacion circular

### Dark Mode Implementation

- Usa CSS custom properties (variables)
- Toggle agrega/quita clase "dark" en `<html>`
- Persiste en localStorage como "theme"

---

**Plan generado:** 2026-01-13T12:30:00Z
