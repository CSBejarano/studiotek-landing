# Plan de Ejecucion: VitaEon Style Redesign

> **Generado:** 2026-01-13
> **Completion Promise:** VITAEON STYLE COMPLETE
> **Mode:** Ralph Wiggum Loop

## Variables

```yaml
WORKFLOW_ID: "2026-01-13_vitaeon-style-redesign"
DOMAIN: "frontend"
COMPLETION_PROMISE: "VITAEON STYLE COMPLETE"
```

## Purpose

Redisenar todas las cards de StudioTek Landing copiando el estilo visual premium de VitaEon:
- Eliminar fondos blancos - usar bg-slate-900/60 semitransparente
- Bordes sutiles con hover states
- Sombras profundas con efecto 3D en hover
- Glow decorativo con blur
- Linea de acento gradiente inferior
- Quitar MagicCard y ShineBorder - usar CSS puro

## Code Structure

```yaml
CREATE:
  - "components/ui/VitaEonCard.tsx"

MODIFY:
  - "components/sections/Benefits.tsx"
  - "components/sections/Services.tsx"
  - "components/sections/HowItWorks.tsx"
  - "components/sections/ContactForm.tsx"
  - "ai_docs/expertise/domain-experts/frontend.yaml"
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
     - decisions: Decisiones SL012-SL014 sobre cards y dark theme
     - blockers: Problemas conocidos

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign
  - Completion Promise: VITAEON STYLE COMPLETE

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

### FASE 1: Crear VitaEonCard

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Crear VitaEonCard component",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL012-SL014 sobre cards
     - file_patterns_discovered: Patrones de componentes

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign

  # TAREA

  Crear componente VitaEonCard en `components/ui/VitaEonCard.tsx` con:

  ## Especificaciones VitaEon Style:

  1. **Background:** bg-slate-900/60 backdrop-blur-sm
  2. **Border:** border-blue-500/20 hover:border-blue-500/50
  3. **Shadow:** shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)]
  4. **Transform 3D (solo desktop):** md:hover:[transform:perspective(1000px)_rotateY(-3deg)_rotateX(2deg)_translateY(-8px)_translateZ(10px)]
  5. **Glow:** div blur-3xl opacity-0 group-hover:opacity-70
  6. **Accent line:** gradient line at bottom

  ## Props Interface:

  ```typescript
  interface VitaEonCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'blue' | 'purple' | 'indigo' | 'cyan' | 'emerald' | 'amber' | 'violet';
    showAccentLine?: boolean;
    variant?: 'default' | 'form'; // form = sin transform 3D
  }
  ```

  ## Estructura:

  ```tsx
  <div className={cardClasses}>
    {/* Glow decorativo */}
    <div className="glow..." />

    {/* Contenido */}
    <div className="relative z-10">
      {children}
    </div>

    {/* Linea de acento */}
    {showAccentLine && <div className="accent-line..." />}
  </div>
  ```

  CREATE: components/ui/VitaEonCard.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivo creado: components/ui/VitaEonCard.tsx
     - Props implementados: [lista]
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:`:
     - id: "SL015"
       context: "Card design VitaEon style"
       decision: "Usar CSS puro (transform 3D, blur glow, gradient line) en lugar de MagicCard/ShineBorder"
       confidence: 0.95
       validated_count: 1
       tags: ["cards", "css", "effects", "dark-theme", "vitaeon"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls -la components/ui/VitaEonCard.tsx`
- Criterio: Archivo existe

---

### FASE 2: Migrar Benefits.tsx

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Migrar Benefits a VitaEonCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/ui/VitaEonCard.tsx` para entender los props

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign

  # TAREA

  Refactorizar Benefits.tsx:

  1. **QUITAR imports:**
     - MagicCard
     - ShineBorder

  2. **AGREGAR import:**
     - VitaEonCard from '@/components/ui/VitaEonCard'

  3. **REEMPLAZAR** MagicCard + ShineBorder por VitaEonCard:

  ANTES:
  ```tsx
  <MagicCard className="..." gradientColor="..." background="bg-slate-950">
    <ShineBorder ... />
    <div className="...">
      {content}
    </div>
  </MagicCard>
  ```

  DESPUES:
  ```tsx
  <VitaEonCard glowColor="blue" showAccentLine className="p-8">
    <div className="...">
      {content}
    </div>
  </VitaEonCard>
  ```

  4. **Mantener:** BlurFade, TextAnimate, iconos, contenido

  MODIFY: components/sections/Benefits.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - MagicCard removido: SI/NO
     - ShineBorder removido: SI/NO
     - VitaEonCard integrado: SI/NO
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Verificar con: `grep -c "MagicCard" components/sections/Benefits.tsx`
     - Esperado: 0
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "MagicCard" components/sections/Benefits.tsx || echo "0"`
- Criterio: Retorna 0

---

### FASE 3: Migrar Services.tsx

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Migrar Services a VitaEonCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/ui/VitaEonCard.tsx`

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign

  # TAREA

  Refactorizar Services.tsx:

  1. **QUITAR imports:** MagicCard, ShineBorder
  2. **AGREGAR import:** VitaEonCard
  3. **REEMPLAZAR** MagicCard + ShineBorder por VitaEonCard con glowColor="indigo"
  4. **Mantener:** BlurFade, TextAnimate, features list, ArrowRight CTA

  MODIFY: components/sections/Services.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: Services.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Verificar: `grep -c "MagicCard" components/sections/Services.tsx`
     - Esperado: 0
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "MagicCard" components/sections/Services.tsx || echo "0"`
- Criterio: Retorna 0

---

### FASE 4: Migrar HowItWorks.tsx

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: Migrar HowItWorks a VitaEonCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/ui/VitaEonCard.tsx`

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign

  # TAREA

  Refactorizar HowItWorks.tsx:

  1. **QUITAR imports:** MagicCard, ShineBorder
  2. **AGREGAR import:** VitaEonCard
  3. **REEMPLAZAR** MagicCard + ShineBorder por VitaEonCard con glowColor="violet"
  4. **Mantener:** Step number badges (absolute positioned), connecting line, BlurFade

  NOTA: Los step badges estan fuera del card, mantener estructura:
  ```tsx
  <div className="relative">
    {/* Badge con -top-4 */}
    <div className="absolute -top-4 ...">01</div>

    <VitaEonCard glowColor="violet" showAccentLine className="pt-8">
      {content}
    </VitaEonCard>
  </div>
  ```

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: HowItWorks.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Verificar: `grep -c "MagicCard" components/sections/HowItWorks.tsx`
     - Esperado: 0
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "MagicCard" components/sections/HowItWorks.tsx || echo "0"`
- Criterio: Retorna 0

---

### FASE 5: Migrar ContactForm.tsx

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 5: Migrar ContactForm a VitaEonCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `components/ui/VitaEonCard.tsx`

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign

  # TAREA

  Refactorizar ContactForm.tsx:

  1. **QUITAR imports:** MagicCard, BorderBeam
  2. **AGREGAR import:** VitaEonCard
  3. **USAR variante "form"** (sin transform 3D):
     ```tsx
     <VitaEonCard variant="form" glowColor="blue" showAccentLine>
       {form content}
     </VitaEonCard>
     ```
  4. **Mantener:** ShimmerButton, react-hook-form, inputs con estilos dark

  IMPORTANTE: variant="form" desactiva el efecto 3D que interfiere con inputs

  MODIFY: components/sections/ContactForm.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: ContactForm.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Verificar:
     - `grep -c "MagicCard" components/sections/ContactForm.tsx` = 0
     - `grep -c "BorderBeam" components/sections/ContactForm.tsx` = 0

  3. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:`:
     - id: "SL016"
       context: "Form containers with hover effects"
       decision: "Variante 'form' de VitaEonCard sin transform 3D para no interferir con inputs"
       confidence: 0.95
       tags: ["forms", "vitaeon", "ux"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -c "BorderBeam" components/sections/ContactForm.tsx || echo "0"`
- Criterio: Retorna 0

---

### FASE 6: Validation

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 6: Build + Lint Validation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml` si existe

  # CONTEXTO

  - Workflow: 2026-01-13_vitaeon-style-redesign
  - Completion Promise: VITAEON STYLE COMPLETE

  # TAREA

  Ejecutar validaciones finales:

  ## 1. Verificar migraciones

  ```bash
  echo "Checking MagicCard removal..."
  grep -r "MagicCard" components/sections/ && echo "FAIL: MagicCard found" || echo "PASS: No MagicCard"

  echo "Checking BorderBeam removal..."
  grep -r "BorderBeam" components/sections/ && echo "FAIL: BorderBeam found" || echo "PASS: No BorderBeam"

  echo "Checking ShineBorder removal..."
  grep -r "ShineBorder" components/sections/ && echo "FAIL: ShineBorder found" || echo "PASS: No ShineBorder"
  ```

  ## 2. Build

  ```bash
  npm run build
  ```

  Si falla: identificar error, reportar para fix

  ## 3. Lint

  ```bash
  npm run lint
  ```

  Si falla: identificar error, reportar para fix

  ## 4. Si todo pasa

  Output: "VITAEON STYLE COMPLETE"

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - MagicCard removed: PASS/FAIL
     - BorderBeam removed: PASS/FAIL
     - ShineBorder removed: PASS/FAIL
     - Build: PASS/FAIL
     - Lint: PASS/FAIL
     - Estado: SUCCESS | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     Actualizar metadata:
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

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | FASE 0 | Build inicial pasa | `npm run build` |
| CP1 | FASE 1 | VitaEonCard existe | `ls components/ui/VitaEonCard.tsx` |
| CP2 | FASE 2 | Benefits sin MagicCard | `grep -c "MagicCard" components/sections/Benefits.tsx` = 0 |
| CP3 | FASE 3 | Services sin MagicCard | `grep -c "MagicCard" components/sections/Services.tsx` = 0 |
| CP4 | FASE 4 | HowItWorks sin MagicCard | `grep -c "MagicCard" components/sections/HowItWorks.tsx` = 0 |
| CP5 | FASE 5 | ContactForm sin BorderBeam | `grep -c "BorderBeam" components/sections/ContactForm.tsx` = 0 |
| CP6 | FASE 6 | Build + Lint pasan | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Transform 3D rompe mobile | Alto | Solo aplicar en md: breakpoint |
| Inputs no funcionan con transform | Alto | Variante "form" sin 3D |
| Performance con blur | Medio | Single glow per card |
| Inconsistencia colores | Bajo | Props glowColor con defaults |

## Ralph Mode Self-Correction

| Fallo Detectado | Accion | Fase Destino |
|-----------------|--------|--------------|
| Build falla | Fix import/syntax | Fase del error |
| Lint falla | Fix lint errors | FASE 6 |
| grep MagicCard != 0 | Retry migration | Fase del componente |

---

**Completion Promise:** VITAEON STYLE COMPLETE
