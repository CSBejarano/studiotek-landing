# Plan de Ejecucion: ShineBorder Cards + ShimmerButton CTAs

> **Generado:** 2026-01-13
> **Completion Promise:** SHIMMER SHINE COMPLETE
> **Mode:** Ralph Wiggum Loop

## Variables

```yaml
WORKFLOW_ID: "2026-01-13_shimmer-shine-upgrade"
DOMAIN: "frontend"
COMPLETION_PROMISE: "SHIMMER SHINE COMPLETE"
```

## Purpose

Mejorar visualmente todas las cards y botones del sitio:
- **ShineBorder:** Agregar borde animado brillante a VitaEonCard
- **ShimmerButton:** Agregar CTAs con efecto shimmer a cada card

## Code Structure

```yaml
MODIFY:
  - "components/ui/VitaEonCard.tsx" (agregar ShineBorder)
  - "components/sections/Benefits.tsx" (agregar ShimmerButton CTA)
  - "components/sections/Services.tsx" (ShimmerButton reemplaza texto CTA)
  - "components/sections/HowItWorks.tsx" (agregar ShimmerButton CTA)
```

## WORKFLOW

### FASE 0: Pre-Validation

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 0: Pre-Validation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL012-SL015 sobre cards y efectos
     - blockers: Problemas conocidos

  # TAREA

  Validar que el proyecto compila antes de hacer cambios:

  ```bash
  npm run build
  ```

  Si falla, reportar error y abortar.
  Si pasa, continuar a FASE 1.

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Build status: SUCCESS | FAILED
     - Estado: SUCCESS | BLOCKED
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Exit code 0

---

### FASE 1: Agregar ShineBorder a VitaEonCard

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Agregar ShineBorder a VitaEonCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/ui/VitaEonCard.tsx` actual
  3. Leer `components/magicui/shine-border.tsx` para entender props

  # TAREA

  Modificar VitaEonCard.tsx para incluir ShineBorder:

  1. Agregar import:
     ```tsx
     import { ShineBorder } from '@/components/magicui/shine-border';
     ```

  2. Agregar prop shineColors al interface:
     ```tsx
     shineColors?: string[];
     ```

  3. Mapear glowColor a shineColors defaults:
     - blue: ['#3b82f6', '#06b6d4']
     - purple: ['#a855f7', '#ec4899']
     - indigo: ['#6366f1', '#8b5cf6']
     - cyan: ['#06b6d4', '#22d3ee']
     - emerald: ['#10b981', '#059669']
     - amber: ['#f59e0b', '#f97316']
     - violet: ['#8b5cf6', '#a855f7']

  4. Agregar ShineBorder dentro del wrapper div (antes del contenido):
     ```tsx
     <ShineBorder
       borderWidth={1}
       duration={12}
       shineColor={shineColors || defaultShineColors[glowColor]}
     />
     ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivo modificado: VitaEonCard.tsx
     - ShineBorder integrado: SI/NO
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     En `decisions:` agregar:
     - id: "SL016"
       context: "VitaEonCard animated border"
       decision: "Integrar ShineBorder dentro de VitaEonCard con shineColors derivados de glowColor"
       confidence: 0.95
       tags: ["cards", "shine-border", "animation"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "ShineBorder" components/ui/VitaEonCard.tsx`
- Criterio: Retorna >= 1

---

### FASE 2: Agregar ShimmerButton a Benefits

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Agregar ShimmerButton a Benefits",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/sections/Benefits.tsx`

  # TAREA

  Modificar Benefits.tsx para agregar ShimmerButton CTA:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. En cada VitaEonCard, despues del parrafo de descripcion, agregar:
     ```tsx
     <ShimmerButton
       onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
       background="linear-gradient(to right, #GRADIENT_FROM, #GRADIENT_TO)"
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="mt-6 w-full"
     >
       Descubrir como
     </ShimmerButton>
     ```

  3. Gradientes por card (usar del benefit.gradient):
     - Ahorro de Costes (from-blue-500 to-cyan-500): #3b82f6, #06b6d4
     - Eficiencia Operativa (from-purple-500 to-pink-500): #a855f7, #ec4899
     - Escalabilidad (from-orange-500 to-red-500): #f97316, #ef4444

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - ShimmerButtons agregados: 3
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "ShimmerButton" components/sections/Benefits.tsx`
- Criterio: Retorna >= 3

---

### FASE 3: Reemplazar CTA en Services con ShimmerButton

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: ShimmerButton en Services",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/sections/Services.tsx`

  # TAREA

  Modificar Services.tsx:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. ELIMINAR el div CTA existente con ArrowRight:
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
       background="linear-gradient(to right, #GRADIENT_FROM, #GRADIENT_TO)"
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="w-full"
     >
       Saber mas
     </ShimmerButton>
     ```

  4. Gradientes por card:
     - Implementacion IA (from-blue-600 to-indigo-600): #2563eb, #4f46e5
     - Consultoria (from-amber-500 to-orange-600): #f59e0b, #ea580c
     - Formacion (from-emerald-500 to-teal-600): #10b981, #0d9488

  5. Eliminar import ArrowRight si ya no se usa

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - ShimmerButtons: 3
     - ArrowRight removido: SI/NO
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "ShimmerButton" components/sections/Services.tsx`
- Criterio: Retorna >= 3

---

### FASE 4: Agregar ShimmerButton a HowItWorks

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: ShimmerButton en HowItWorks",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/sections/HowItWorks.tsx`

  # TAREA

  Modificar HowItWorks.tsx:

  1. Agregar import:
     ```tsx
     import { ShimmerButton } from '@/components/magicui/shimmer-button';
     ```

  2. En cada VitaEonCard, despues del parrafo de descripcion, agregar:
     ```tsx
     <ShimmerButton
       onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
       background="linear-gradient(to right, #GRADIENT_FROM, #GRADIENT_TO)"
       shimmerColor="#ffffff"
       borderRadius="12px"
       className="mt-4 w-full text-sm"
     >
       Consultar
     </ShimmerButton>
     ```

  3. Gradientes por step (usar del step.gradient):
     - Analisis (from-blue-500 to-cyan-500): #3b82f6, #06b6d4
     - Estrategia (from-violet-500 to-purple-500): #8b5cf6, #a855f7
     - Implementacion (from-amber-500 to-orange-500): #f59e0b, #f97316
     - Optimizacion (from-emerald-500 to-green-500): #10b981, #22c55e

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - ShimmerButtons: 4
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "ShimmerButton" components/sections/HowItWorks.tsx`
- Criterio: Retorna >= 4

---

### FASE 5: Validation

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 5: Build + Lint Validation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # TAREA

  Ejecutar validaciones finales:

  ## 1. Verificar integraciones

  ```bash
  echo "Checking ShineBorder in VitaEonCard..."
  grep -c "ShineBorder" components/ui/VitaEonCard.tsx

  echo "Checking ShimmerButton in sections..."
  grep -c "ShimmerButton" components/sections/Benefits.tsx
  grep -c "ShimmerButton" components/sections/Services.tsx
  grep -c "ShimmerButton" components/sections/HowItWorks.tsx
  ```

  ## 2. Build

  ```bash
  npm run build
  ```

  ## 3. Lint

  ```bash
  npm run lint
  ```

  ## 4. Conteo total

  - ShineBorder en VitaEonCard: 1 uso
  - ShimmerButton en Benefits: 3 botones
  - ShimmerButton en Services: 3 botones
  - ShimmerButton en HowItWorks: 4 botones
  - Total: 10 ShimmerButtons + 1 ShineBorder integration

  Si todo pasa: Output "SHIMMER SHINE COMPLETE"

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final
  2. Actualizar testing.yaml con resultado
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0

---

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | FASE 0 | Build inicial pasa | `npm run build` |
| CP1 | FASE 1 | ShineBorder en VitaEonCard | `grep ShineBorder VitaEonCard.tsx` |
| CP2 | FASE 2 | 3 ShimmerButtons en Benefits | `grep ShimmerButton Benefits.tsx` |
| CP3 | FASE 3 | 3 ShimmerButtons en Services | `grep ShimmerButton Services.tsx` |
| CP4 | FASE 4 | 4 ShimmerButtons en HowItWorks | `grep ShimmerButton HowItWorks.tsx` |
| CP5 | FASE 5 | Build + Lint pasan | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| ShineBorder conflicto con glow | Medio | Ajustar opacity/z-index |
| ShimmerButton overflow | Bajo | Agregar w-full class |
| Scroll no funciona | Bajo | Verificar id="contact" existe |

---

**Completion Promise:** SHIMMER SHINE COMPLETE
