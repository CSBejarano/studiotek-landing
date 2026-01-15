# Plan de Ejecucion: Portfolio Hero Improvement

> **Generado:** 2026-01-13
> **Issue:** N/A (mejora solicitada por usuario)
> **Branch:** main

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
WORKFLOW_ID: "2026-01-13_portfolio-hero-improvement"
```

## Purpose

Mejorar la pagina /portfolio de StudioTek Landing reemplazando el ScrollyHero actual (que usa 105 imagenes con marca de agua "Veo") por un PortfolioHero estatico con efectos Magic UI que unifique la estetica con la landing principal.

**Problemas identificados:**
1. Las imagenes de la secuencia tienen marca de agua "Veo" visible - no apropiado para produccion
2. Carga de 105 imagenes webp afecta performance
3. Estetica inconsistente con landing principal (bg-[#121212] vs slate-950)

**Solucion:**
Nuevo PortfolioHero con AnimatedGridPattern + TextAnimate + BlurFade + Particles

## Code Structure

```yaml
CREATE:
  - "components/portfolio/PortfolioHero.tsx"

MODIFY:
  - "app/portfolio/page.tsx"

DELETE (opcional con confirmacion):
  - "components/portfolio/ScrollyHero.tsx"
  - "components/portfolio/ScrollyCanvas.tsx"
  - "components/portfolio/Overlay.tsx"
  - "public/secuencia/*" (105 archivos webp)
  - "secuencia/*" (duplicado)

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 1: Crear PortfolioHero.tsx

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Crear PortfolioHero component",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Decisiones validadas previas (SL001-SL018)
     - blockers: Problemas conocidos y soluciones
     - file_patterns_discovered: Patrones utiles

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes

  # CONTEXTO

  - Branch: main
  - Archivos referencia:
    - components/sections/Hero.tsx (patron a seguir)
    - components/magicui/*.tsx (componentes disponibles)

  # TAREA

  Crear componente PortfolioHero.tsx con:

  1. **Layout:**
     - min-h-[70vh] (no full screen, mostrar contenido rapido)
     - bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
     - flex items-center justify-center

  2. **Background effects:**
     - AnimatedGridPattern con mask radial gradient
     - Particles opcional para efecto tech adicional

  3. **Contenido:**
     - Titulo: "Nuestro Portafolio" con TextAnimate (blurInUp)
     - Subtitulo: "Proyectos que transforman negocios con IA"
     - BlurFade para reveal progresivo

  4. **Scroll indicator:**
     - Flecha animada hacia abajo
     - Desaparece al hacer scroll

  ## Archivos

  CREATE:
  - components/portfolio/PortfolioHero.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` (si tomaste decisiones importantes):
     - id: "SL019"
       context: "Hero de subpaginas pattern"
       decision: "{que y por que}"
       confidence: 0.XX
       validated_in: "Portfolio improvement"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build sin errores, PortfolioHero exportado correctamente

---

### FASE 2: Actualizar app/portfolio/page.tsx

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Actualizar portfolio page",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Verificar que FASE 1 este completa (PortfolioHero existe)

  # CONTEXTO

  - Branch: main
  - Archivos: app/portfolio/page.tsx

  # TAREA

  Actualizar page.tsx para:

  1. **Imports:**
     - Cambiar ScrollyHero por PortfolioHero
     - Mantener Projects, ContactForm, Footer

  2. **Layout:**
     - Cambiar bg-[#121212] por bg-slate-950 (consistencia)
     - Remover scrollHeight="500vh" props

  3. **Estructura:**
     ```tsx
     <main className="bg-slate-950 min-h-screen">
       <PortfolioHero />
       <Projects />
       <ContactForm />
       <Footer />
     </main>
     ```

  ## Archivos

  MODIFY:
  - app/portfolio/page.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` y visitar /portfolio
- Criterio: PortfolioHero visible, Projects section renderiza

---

### FASE 3: Cleanup componentes obsoletos

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Cleanup archivos obsoletos",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Verificar que FASE 2 este completa

  # CONTEXTO

  - Branch: main
  - Archivos obsoletos identificados

  # TAREA

  Eliminar componentes que ya no se usan:

  1. **Eliminar archivos:**
     - components/portfolio/ScrollyHero.tsx
     - components/portfolio/ScrollyCanvas.tsx
     - components/portfolio/Overlay.tsx

  2. **NO eliminar automaticamente:**
     - public/secuencia/* (105 imagenes)
     - secuencia/* (duplicado)

     NOTA: Estos archivos pueden eliminarse manualmente si el usuario confirma.
     Son ~5-10MB que no se usan pero el usuario podria querer conservarlos.

  ## Archivos

  DELETE:
  - components/portfolio/ScrollyHero.tsx
  - components/portfolio/ScrollyCanvas.tsx
  - components/portfolio/Overlay.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos eliminados
     - Estado: SUCCESS

  2. Informar al usuario:
     - Las carpetas public/secuencia/ y secuencia/ pueden eliminarse manualmente
     - Comando sugerido: `rm -rf public/secuencia secuencia`
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls components/portfolio/`
- Criterio: Solo existen PortfolioHero.tsx y Projects.tsx

---

### FASE 4: Validacion

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 4: Validacion final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # CONTEXTO

  - Branch: main
  - Fases previas completadas

  # TAREA

  Validar implementacion:

  1. **Build:**
     ```bash
     npm run build
     ```
     - Criterio: Sin errores

  2. **Lint:**
     ```bash
     npm run lint
     ```
     - Criterio: Sin errores en archivos de produccion

  3. **Verificacion visual (manual):**
     ```bash
     npm run dev
     ```
     - Visitar http://localhost:3000/portfolio
     - Verificar:
       - [ ] PortfolioHero renderiza con AnimatedGridPattern
       - [ ] Titulo animado visible
       - [ ] Projects section carga correctamente
       - [ ] ContactForm funciona
       - [ ] Footer visible

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Resultado de build y lint
     - Checklist de verificacion visual
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0

---

## Checkpoints

| CP  | Fase   | Criterio                              | Comando                |
| --- | ------ | ------------------------------------- | ---------------------- |
| CP1 | FASE 1 | PortfolioHero.tsx creado y exporta    | `npm run build`        |
| CP2 | FASE 2 | Portfolio page usa nuevo hero         | `npm run dev`          |
| CP3 | FASE 3 | Archivos obsoletos eliminados         | `ls components/portfolio/` |
| CP4 | FASE 4 | Build y lint sin errores              | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo                                  | Impacto | Mitigacion                                      |
| --------------------------------------- | ------- | ----------------------------------------------- |
| Componentes Magic UI no disponibles     | Bajo    | Ya verificados: todos existen                   |
| Perdida de contenido visual interesante | Medio   | Nuevo hero con effects es visualmente atractivo |
| Usuario quiere conservar imagenes       | Bajo    | No eliminar automaticamente, paso opcional      |
| Inconsistencia visual                   | Bajo    | Mismos componentes y colores de landing         |

## Decisiones Nuevas

| ID    | Decision                                           | Rationale                                        |
| ----- | -------------------------------------------------- | ------------------------------------------------ |
| SL019 | Hero de subpaginas usa patron consistente con landing | Unifica estetica, reutiliza componentes Magic UI |
| SL020 | Eliminar assets con marca de agua/copyright        | No apropiado para produccion profesional         |

## Notas

- **Performance mejorada:** Elimina carga de 105 imagenes webp (~5-10MB)
- **Estetica unificada:** Mismo patron visual que landing principal
- **Cleanup opcional:** Las imagenes de secuencia pueden eliminarse manualmente

---

**Generado por:** /plan-task v3.2
**Workflow ID:** 2026-01-13_portfolio-hero-improvement
