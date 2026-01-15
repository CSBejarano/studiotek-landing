# Plan de Ejecucion: Agregar ShimmerButton a todas las Cards

> **Generado:** 2026-01-13T20:00:00Z
> **Issue:** N/A (Mejora visual)
> **Dominio:** Frontend

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Agregar el componente ShimmerButton de Magic UI a todas las cards del sitio para mejorar la conversion con CTAs visuales atractivos que dirijan al formulario de contacto.

## Code Structure

```yaml
MODIFY:
  - "components/sections/Benefits.tsx"
  - "components/sections/Services.tsx"
  - "components/sections/HowItWorks.tsx"

TESTS:
  - N/A (validacion visual)
```

## WORKFLOW

### FASE 1: Benefits.tsx - Agregar ShimmerButton

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Agregar ShimmerButton a Benefits cards",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL012-SL015 sobre cards y efectos
     - blockers: SLB001-SLB002

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - D037, D038: Patrones de navegacion

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Benefits.tsx

  # TAREA

  Modificar Benefits.tsx para agregar ShimmerButton a cada card:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. En cada VitaEonCard, despues del parrafo de descripcion, agregar:
     ```tsx
     <ShimmerButton
       onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
       background={`linear-gradient(to right, ${GRADIENT_COLORS})`}
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="mt-6 w-full"
     >
       Descubrir como
     </ShimmerButton>
     ```

  3. Gradientes por card:
     - Ahorro de Costes: #3b82f6, #06b6d4
     - Eficiencia Operativa: #a855f7, #ec4899
     - Escalabilidad: #f97316, #ef4444

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: 1
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     En `decisions:` agregar nueva decision sobre ShimmerButton pattern
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build pasa sin errores

---

### FASE 2: Services.tsx - Reemplazar CTA por ShimmerButton

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Reemplazar CTA en Services con ShimmerButton",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Revisar FASE 1 completada

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Services.tsx

  # TAREA

  Modificar Services.tsx para reemplazar el CTA existente:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. ELIMINAR el div CTA existente (lineas 94-97):
     ```tsx
     <div className="flex items-center text-indigo-400...">
       <span>Saber mas</span>
       <ArrowRight .../>
     </div>
     ```

  3. REEMPLAZAR con ShimmerButton:
     ```tsx
     <ShimmerButton
       onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
       background={`linear-gradient(to right, ${GRADIENT_COLORS})`}
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="w-full"
     >
       Saber mas
     </ShimmerButton>
     ```

  4. Gradientes por card:
     - Implementacion de IA: #2563eb, #4f46e5
     - Consultoria Estrategica: #f59e0b, #ea580c
     - Formacion: #10b981, #0d9488

  5. Limpiar import ArrowRight si ya no se usa

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar frontend.yaml
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build pasa sin errores

---

### FASE 3: HowItWorks.tsx - Agregar ShimmerButton

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Agregar ShimmerButton a HowItWorks cards",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Revisar FASE 1 y FASE 2 completadas

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx

  # TAREA

  Modificar HowItWorks.tsx para agregar ShimmerButton:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. En cada VitaEonCard, despues del parrafo de descripcion, agregar:
     ```tsx
     <ShimmerButton
       onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
       background={`linear-gradient(to right, ${GRADIENT_COLORS})`}
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="mt-4 w-full text-sm"
     >
       Consultar
     </ShimmerButton>
     ```

  3. Gradientes por card:
     - Analisis: #3b82f6, #06b6d4
     - Estrategia: #8b5cf6, #a855f7
     - Implementacion: #f59e0b, #f97316
     - Optimizacion: #10b981, #22c55e

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar frontend.yaml con decision final
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build pasa sin errores

---

### FASE 4: Validation

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 4: Validacion final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # TAREA

  1. Ejecutar npm run build
  2. Ejecutar npm run lint (si existe)
  3. Verificar visual en npm run dev:
     - Benefits: 3 cards con ShimmerButton azul/morado/naranja
     - Services: 3 cards con ShimmerButton azul/naranja/verde
     - HowItWorks: 4 cards con ShimmerButton colores variados
  4. Verificar que click en cualquier boton hace scroll a #contact

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final
  2. Actualizar testing.yaml si aplica
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build && npm run lint`
- Criterio: Sin errores, 10 ShimmerButtons visibles

---

## Checkpoints

| CP  | Fase   | Criterio                        | Comando              |
| --- | ------ | ------------------------------- | -------------------- |
| CP1 | FASE 1 | Build pasa                      | `npm run build`      |
| CP2 | FASE 2 | Build pasa                      | `npm run build`      |
| CP3 | FASE 3 | Build pasa                      | `npm run build`      |
| CP4 | FASE 4 | Build + Lint + 10 botones       | `npm run build`      |

## Risk Matrix

| Riesgo                    | Impacto | Mitigacion                              |
| ------------------------- | ------- | --------------------------------------- |
| Build falla               | Alto    | Verificar imports y sintaxis            |
| Estilos inconsistentes    | Medio   | Usar borderRadius=12px consistente      |
| Scroll no funciona        | Bajo    | Verificar id="contact" existe           |
| Gradientes no coinciden   | Bajo    | Copiar valores exactos del diseño       |

---

**Complejidad:** 3/10
**Tiempo estimado:** 20-30 min
**Agentes:** @frontend, @testing
