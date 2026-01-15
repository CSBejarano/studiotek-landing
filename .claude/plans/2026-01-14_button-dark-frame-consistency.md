# Plan de Ejecucion: Button Dark Frame Consistency

> **Generado:** 2026-01-14
> **Issue:** N/A (mejora visual)
> **Phase:** UI Polish

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "UI-POLISH"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Implementar el mismo marco oscuro grueso (`border-[3px] border-[#0f172a]`) para TODOS los botones de la aplicacion. Actualmente:

- `Button.tsx` primary: OK (tiene marco)
- `Button.tsx` secondary: FALLA (border-primary/50 sobrescribe)
- `ShimmerButton.tsx`: FALLA (no tiene marco)
- `Header.tsx` CTA: FALLA (es un `<a>` sin marco)
- `Hero.tsx` Button secondary: FALLA (border-slate-600 sobrescribe)

## Code Structure

```yaml
MODIFY:
  - "components/ui/Button.tsx"
  - "components/magicui/shimmer-button.tsx"
  - "components/sections/Header.tsx"
  - "components/sections/Hero.tsx"
  - "ai_docs/expertise/domain-experts/frontend.yaml"

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 1: Fix Button Secondary Variant

**Agente:** @frontend

**Task:**

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Fix Button secondary variant border",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL022 sobre Button 3D effect
     - blockers: Verificar problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relacionadas con UI

  # CONTEXTO

  - Branch: main
  - Archivo: components/ui/Button.tsx

  # TAREA

  Modificar la variante `secondary` del Button para que use el mismo marco oscuro que `primary`.

  ## Cambios especificos

  En `components/ui/Button.tsx` linea 33-34:

  ANTES:
  ```tsx
  : "bg-transparent text-primary border-primary/50 hover:bg-primary/10",
  ```

  DESPUES:
  ```tsx
  : "bg-transparent text-slate-200 hover:bg-slate-800/50",
  ```

  Razon: Remover `border-primary/50` que sobrescribe el `border-[#0f172a]` del base styles. Cambiar text-primary a text-slate-200 para mejor contraste.

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: `npm run build`
  2. Informe de cambios realizados
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso sin errores

---

### FASE 2: Add Dark Frame to ShimmerButton

**Agente:** @frontend

**Task:**

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Add dark frame to ShimmerButton",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL022 sobre efecto 3D
     - file_patterns_discovered: magicui components

  # CONTEXTO

  - Branch: main
  - Archivo: components/magicui/shimmer-button.tsx

  # TAREA

  Agregar el marco oscuro grueso al ShimmerButton para consistencia visual.

  ## Cambios especificos

  En `components/magicui/shimmer-button.tsx` linea 46-50, modificar el className:

  ANTES:
  ```tsx
  className={cn(
    "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-medium",
    "[background:var(--bg)] [border-radius:var(--radius)]",
    "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
    className
  )}
  ```

  DESPUES:
  ```tsx
  className={cn(
    "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white font-medium",
    "[background:var(--bg)] [border-radius:var(--radius)]",
    // Marco exterior oscuro y grueso (efecto 3D relieve)
    "border-[3px] border-[#0f172a]",
    // Shadow exterior para profundidad
    "shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
    // Transiciones y hover 3D
    "transform-gpu transition-all duration-200",
    "hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]",
    "active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
    className
  )}
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: `npm run build`
  2. Verificar visualmente que ShimmerButton en Hero y ContactForm tienen marco oscuro
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, ShimmerButton visible con marco

---

### FASE 3: Convert Header CTA to Button Component

**Agente:** @frontend

**Task:**

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Convert Header CTA to Button",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL002 sobre header navigation
     - decisions: SL005 sobre header fixed positioning

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Header.tsx

  # TAREA

  Reemplazar el `<a>` del Header por el componente `Button` para consistencia.

  ## Cambios especificos

  1. Agregar import:
  ```tsx
  import { Button } from '../ui/Button';
  ```

  2. Cambiar handler de MouseEvent<HTMLAnchorElement> a MouseEvent<HTMLButtonElement>:
  ```tsx
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  ```

  3. Reemplazar el <a> (lineas 30-36):

  ANTES:
  ```tsx
  <a
    href="#contact"
    onClick={handleContactClick}
    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
  >
    Contactar
  </a>
  ```

  DESPUES:
  ```tsx
  <Button
    variant="primary"
    onClick={handleContactClick}
    className="py-2.5"
  >
    Contactar
  </Button>
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: `npm run build`
  2. Verificar scroll funciona al hacer click
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Header CTA tiene marco oscuro, scroll funciona

---

### FASE 4: Clean Hero Button Overrides

**Agente:** @frontend

**Task:**

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 4: Clean Hero Button border overrides",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL004 sobre Button variants
     - decisions: SL022 sobre 3D effect

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Hero.tsx

  # TAREA

  Remover las clases de border del Button secondary que sobrescriben el marco oscuro.

  ## Cambios especificos

  En Hero.tsx linea 64-69:

  ANTES:
  ```tsx
  <Button
    variant="secondary"
    onClick={() => scrollToSection('services')}
    className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-500"
  >
    Ver servicios
  </Button>
  ```

  DESPUES:
  ```tsx
  <Button
    variant="secondary"
    onClick={() => scrollToSection('services')}
  >
    Ver servicios
  </Button>
  ```

  Razon: Las clases border-slate-600 y hover:border-slate-500 sobrescriben el marco oscuro. Los estilos de texto y hover ahora vienen del Button.tsx actualizado.

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: `npm run build`
  2. Verificar: `npm run lint`
  3. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL023"
       context: "Button consistency across all variants"
       decision: "Todos los botones (Button, ShimmerButton) usan marco oscuro border-[3px] border-[#0f172a]"
       rationale: "Consistencia visual, efecto 3D, mejora percepcion de calidad UI"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-14"
       tags: ["button", "consistency", "ui", "3d-effect"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build && npm run lint`
- Criterio: Build + lint exitoso, todos los botones con marco oscuro

---

## Checkpoints

| CP  | Fase   | Criterio                        | Comando                        |
| --- | ------ | ------------------------------- | ------------------------------ |
| CP1 | FASE 1 | Button secondary sin border override | `npm run build`           |
| CP2 | FASE 2 | ShimmerButton con marco oscuro  | `npm run build`                |
| CP3 | FASE 3 | Header CTA es Button component  | `npm run build`                |
| CP4 | FASE 4 | Hero Button limpio, lint pasa   | `npm run build && npm run lint`|

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
| ------ | ------- | ---------- |
| Border radius conflicto en ShimmerButton | Medio | ShimmerButton usa CSS custom prop [border-radius:var(--radius)] que se respeta |
| Button secondary poco visible con marco oscuro | Bajo | text-slate-200 y hover:bg-slate-800/50 proveen contraste suficiente |
| Header scroll deja de funcionar | Alto | onClick handler se mantiene identico, solo cambia el elemento |

## Resultado Esperado

Despues de ejecutar todas las fases:

1. **ShimmerButton** (Hero CTA, ContactForm submit): Marco oscuro + shimmer effect
2. **Button primary** (Header CTA): Marco oscuro + ShineBorder
3. **Button secondary** (Hero "Ver servicios"): Marco oscuro + ShineBorder
4. **Todos**: Shadow 3D, hover lift effect, active press effect

---

**Generado por:** /plan-task v3.2
**Workflow ID:** 2026-01-14_button-dark-frame-consistency
