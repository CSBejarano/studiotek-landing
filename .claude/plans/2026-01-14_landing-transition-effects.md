# Plan de Ejecucion: Transiciones Fluidas entre Secciones de Landing

> **Generado:** 2026-01-14
> **Issue:** N/A (mejora visual)
> **Phase:** Polish

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "Polish"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Eliminar los contrastes de color visibles entre las secciones de la landing page (Hero, Benefits, Services, HowItWorks, Stats, ContactForm, Footer) creando transiciones fluidas mediante:

1. Unificacion de colores de fondo (todos a slate-950)
2. Gradientes de transicion en los bordes de cada seccion
3. Efectos de glow sutil en puntos de union
4. Reutilizacion del patron FiberOptics donde sea apropiado

## Code Structure

```yaml
CREATE: []

MODIFY:
  - "components/sections/Hero.tsx"
  - "components/sections/Benefits.tsx"
  - "components/sections/Services.tsx"
  - "components/sections/HowItWorks.tsx"
  - "components/sections/Stats.tsx"
  - "components/sections/Footer.tsx"

TESTS: []
```

## Analisis de Estado Actual

| Seccion     | Background Actual | Transicion Entrada | Transicion Salida | Problema          |
| ----------- | ----------------- | ------------------ | ----------------- | ----------------- |
| Hero        | slate-950         | N/A                | slate-950         | OK                |
| Benefits    | slate-950         | slate-950          | slate-950         | OK                |
| Services    | **slate-900**     | slate-950          | slate-900         | CONTRASTE VISIBLE |
| HowItWorks  | slate-950         | slate-900          | **slate-900**     | CONTRASTE VISIBLE |
| Stats       | slate-950         | slate-900          | slate-950         | CONTRASTE VISIBLE |
| ContactForm | slate-950         | slate-950          | slate-950         | OK (FiberOptics)  |
| Footer      | slate-950         | slate-950          | N/A               | Border duro       |

## WORKFLOW

### FASE 1: Unificacion de Backgrounds

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Unificar backgrounds a slate-950",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL001-SL024 (especialmente SL012-SL017 sobre cards y efectos)
     - blockers: SLB001-SLB002
     - file_patterns_discovered: components/sections/*.tsx

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones sobre estilos visuales

  # CONTEXTO

  - Branch: main
  - Archivos: Services.tsx, HowItWorks.tsx, Stats.tsx

  # TAREA

  Unificar todos los backgrounds de secciones a slate-950 para eliminar contrastes.

  ## Cambios Especificos

  ### Services.tsx (Linea 41)
  ```diff
  - <section id="services" className="relative bg-slate-900 py-24 overflow-hidden">
  + <section id="services" className="relative bg-slate-950 py-24 overflow-hidden">
  ```

  Ajustar gradiente interno (Linea 43):
  ```diff
  - <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-slate-900 pointer-events-none" />
  + <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/30 via-slate-900/50 to-slate-950 pointer-events-none" />
  ```

  ### HowItWorks.tsx (Linea 144)
  ```diff
  - <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 pointer-events-none" />
  + <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950 pointer-events-none" />
  ```

  ### Stats.tsx (Linea 48)
  ```diff
  - <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-transparent pointer-events-none" />
  + <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-transparent pointer-events-none" />
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: Services.tsx, HowItWorks.tsx, Stats.tsx
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL025"
       context: "Section background unification"
       decision: "Todas las secciones usan bg-slate-950 como base, con gradientes internos para variacion visual"
       rationale: "Elimina saltos de color entre secciones, crea flujo visual continuo"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-14"
       tags: ["background", "transitions", "visual-continuity"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, no hay saltos de color visibles entre secciones

---

### FASE 2: Efectos de Transicion - Mitad Superior

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Agregar efectos de transicion Hero->Benefits->Services",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Especialmente SL025 (recien agregada)
     - file_patterns_discovered: components/sections/*.tsx

  2. Leer el componente FiberOptics para referencia de patrones de glow:
     - components/ui/FiberOptics.tsx

  # CONTEXTO

  - Branch: main
  - Archivos: Hero.tsx, Benefits.tsx, Services.tsx

  # TAREA

  Agregar efectos de transicion suaves en la mitad superior de la pagina.

  ## Hero.tsx - Agregar glow de transicion al fondo

  Despues del Gradient Overlay existente (aproximadamente linea 28), agregar:

  ```tsx
  {/* Bottom transition glow */}
  <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[50%] h-32 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
  ```

  ## Benefits.tsx - Agregar glow de conexion inferior

  Antes del cierre de </section> (linea 92), agregar:

  ```tsx
  {/* Bottom transition glow */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[40%] h-24 bg-purple-500/8 rounded-full blur-[80px] pointer-events-none" />
  ```

  ## Services.tsx - Agregar transiciones superior e inferior

  Despues del background gradient existente (linea 43), agregar:

  ```tsx
  {/* Top transition gradient */}
  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />

  {/* Bottom transition glow */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[40%] h-24 bg-indigo-500/8 rounded-full blur-[80px] pointer-events-none" />
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: Hero.tsx, Benefits.tsx, Services.tsx
     - Efectos agregados y posiciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL026"
       context: "Section transition glow effects"
       decision: "Usar blur-[80px] a blur-[100px] con opacity 8-10% para glows de transicion, colores que matcheen la seccion (blue, purple, indigo)"
       rationale: "Efectos sutiles que crean continuidad sin distraer del contenido"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-14"
       tags: ["transitions", "glow", "blur", "visual-effects"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run dev` + visual inspection
- Criterio: Transiciones Hero->Benefits->Services suaves y sin saltos

---

### FASE 3: Efectos de Transicion - Mitad Inferior

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Agregar efectos de transicion HowItWorks->Stats->Contact->Footer",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL025, SL026 (recien agregadas)
     - Patron establecido: blur-[80px] a blur-[100px], opacity 8-10%

  # CONTEXTO

  - Branch: main
  - Archivos: HowItWorks.tsx, Stats.tsx, Footer.tsx

  # TAREA

  Completar los efectos de transicion en la mitad inferior de la pagina.

  ## HowItWorks.tsx - Agregar transiciones

  Despues del dot pattern background (linea 153), agregar:

  ```tsx
  {/* Top transition gradient */}
  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />

  {/* Bottom transition glow */}
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[35%] h-20 bg-emerald-500/8 rounded-full blur-[80px] pointer-events-none" />
  ```

  ## Stats.tsx - Agregar transicion inferior

  Despues de los gradient overlays existentes (linea 49), agregar:

  ```tsx
  {/* Bottom transition for ContactForm */}
  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
  ```

  Nota: ContactForm ya tiene FiberOptics que se extiende hacia arriba (-top-40), asi que Stats solo necesita un fade limpio hacia abajo.

  ## Footer.tsx - Suavizar border superior

  Cambiar la clase del footer (linea 6):

  ```diff
  - <footer className="bg-slate-950 border-t border-slate-800">
  + <footer className="relative bg-slate-950">
  ```

  Agregar despues de la apertura de <footer>:

  ```tsx
  {/* Soft top gradient instead of hard border */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-8 -translate-y-1/2 bg-blue-500/5 rounded-full blur-[40px]" />
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: HowItWorks.tsx, Stats.tsx, Footer.tsx
     - Efectos agregados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL027"
       context: "Footer border softening"
       decision: "Reemplazar border-t solido con gradient via-slate-700/50 + glow sutil"
       rationale: "Mantiene separacion visual sin crear linea dura, consistente con transiciones fluidas"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-14"
       tags: ["footer", "border", "gradient", "transitions"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run dev` + full page scroll
- Criterio: Toda la pagina tiene transiciones suaves, sin saltos de color

---

### FASE 4: Validacion Final

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: Validacion y verificacion final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - Verificar que SL025, SL026, SL027 estan documentadas

  # CONTEXTO

  - Branch: main
  - Todos los archivos de secciones modificados

  # TAREA

  Validar que todas las transiciones funcionan correctamente.

  ## Verificaciones

  1. **Build Test:**
     ```bash
     npm run build
     ```
     Debe pasar sin errores.

  2. **Lint Test:**
     ```bash
     npm run lint
     ```
     Debe pasar sin errores en archivos de produccion.

  3. **Visual Inspection Checklist:**
     - [ ] Hero -> Benefits: Sin salto de color
     - [ ] Benefits -> Services: Sin salto de color
     - [ ] Services -> HowItWorks: Sin salto de color
     - [ ] HowItWorks -> Stats: Sin salto de color
     - [ ] Stats -> ContactForm: Transicion suave con FiberOptics
     - [ ] ContactForm -> Footer: Sin linea dura visible
     - [ ] Efectos de glow visibles pero sutiles
     - [ ] No hay flickering ni artefactos visuales

  4. **Mobile Test:**
     - Verificar en viewport 375px
     - Glows no deben ser demasiado prominentes en mobile

  ## Si hay problemas

  - Ajustar opacity de glows (reducir si muy prominentes)
  - Ajustar blur radius si efectos son muy difusos
  - Verificar z-index si efectos cubren contenido

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final:
     - Todos los checkpoints pasados
     - Cualquier ajuste realizado
     - Estado: SUCCESS

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `file_patterns_discovered:` actualizar:
     - pattern: "components/sections/*.tsx"
       purpose: "Secciones de pagina con transiciones fluidas integradas"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at a timestamp actual
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build && npm run lint`
- Criterio: Build y lint pasan, checklist visual completo

---

## Checkpoints Summary

| CP  | Fase   | Criterio                                         | Comando                              |
| --- | ------ | ------------------------------------------------ | ------------------------------------ |
| CP1 | FASE 1 | Backgrounds unificados a slate-950               | `npm run build`                      |
| CP2 | FASE 2 | Transiciones Hero->Benefits->Services suaves     | `npm run dev` + visual               |
| CP3 | FASE 3 | Transiciones HowItWorks->Stats->Footer suaves    | `npm run dev` + scroll               |
| CP4 | FASE 4 | Build + lint + checklist visual completo         | `npm run build && npm run lint`      |

## Risk Matrix

| Riesgo                          | Impacto | Probabilidad | Mitigacion                                    |
| ------------------------------- | ------- | ------------ | --------------------------------------------- |
| Glows demasiado prominentes     | Medio   | Media        | Usar opacity baja (5-10%), ajustar si necesario |
| Performance con muchos blurs    | Bajo    | Baja         | blur CSS es GPU-accelerated, similar a FiberOptics |
| Inconsistencia en mobile        | Medio   | Media        | Verificar en viewport pequeno, ajustar tamaños |
| Z-index conflicts               | Bajo    | Baja         | Todos los efectos usan pointer-events-none     |

## Decisiones Esperadas

| ID    | Decision                                      | Contexto                           |
| ----- | --------------------------------------------- | ---------------------------------- |
| SL025 | Todos los sections usan bg-slate-950 base     | Unificacion de backgrounds         |
| SL026 | Glow transitions blur-[80-100px] opacity 8-10%| Patron de transicion establecido   |
| SL027 | Footer con gradient en lugar de border solido | Consistencia con transiciones      |

---

**Plan generado:** 2026-01-14T21:00:00Z
**Agente principal:** @frontend
**Estimacion:** 30-45 minutos
