# Plan de Ejecucion: Efecto 3D en Botones

> **Generado:** 2026-01-14T10:00:00Z
> **Issue:** N/A (mejora visual)
> **Phase:** UI Enhancement

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "UI Enhancement"
BRANCH: "main"
DOMAIN: "frontend"
COMPLETION_PROMISE: "BUTTON 3D COMPLETE"
```

## Purpose

Implementar efecto 3D en todos los botones de la aplicacion:
- Marco exterior oscuro y grueso que rodea el boton (sensacion de relieve)
- Mantener el bucle de luz animado (ShineBorder) dentro del marco oscuro
- Aplicar consistentemente a variantes primary y secondary

## Code Structure

```yaml
MODIFY:
  - "components/ui/Button.tsx"

EXISTING (no modificar):
  - "components/magicui/shine-border.tsx"
  - "lib/utils.ts"

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 0: Pre-Check

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 0: Verificar dependencias",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Buscar SL012-SL016 sobre ShineBorder
     - blockers: Verificar problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relevantes sobre botones

  # CONTEXTO

  - Branch: main
  - Archivos existentes:
    - components/magicui/shine-border.tsx
    - lib/utils.ts (cn helper)
    - components/ui/Button.tsx

  # TAREA

  Verificar que todas las dependencias existen:

  1. Confirmar que ShineBorder exporta correctamente
  2. Confirmar que cn() existe en lib/utils.ts
  3. Leer Button.tsx actual para entender estructura

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Dependencias verificadas
     - Estado: SUCCESS | BLOCKED

  2. NO actualizar frontend.yaml en esta fase (solo verificacion)
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls -la components/magicui/shine-border.tsx lib/utils.ts`
- Criterio: Ambos archivos existen

---

### FASE 1: Implementar Button 3D

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Implementar efecto 3D en Button.tsx",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL004 (Button variants), SL012-SL016 (ShineBorder patterns)
     - file_patterns_discovered: components/ui/*.tsx

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Archivo: components/ui/Button.tsx

  # TAREA

  Modificar Button.tsx para agregar efecto 3D:

  ## Estructura Visual Requerida

  ```
  [Marco oscuro grueso: border-[3px] border-[#0f172a]]
    [ShineBorder animado recorriendo el borde interior]
    [Contenido del boton con shadows de profundidad]
  ```

  ## Implementacion

  1. Agregar "use client" al inicio
  2. Importar ShineBorder y cn
  3. Modificar el componente:

  ```tsx
  "use client"

  import { cn } from "@/lib/utils"
  import { ShineBorder } from "@/components/magicui/shine-border"

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
  }

  export function Button({
    variant = 'primary',
    children,
    className,
    ...props
  }: ButtonProps) {
    return (
      <button
        className={cn(
          // Base container
          "relative overflow-hidden rounded-xl",
          // Marco exterior oscuro y grueso (efecto 3D relieve)
          "border-[3px] border-[#0f172a]",
          // Shadow exterior para profundidad
          "shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]",
          // Padding y tipografia
          "px-6 py-3 font-medium",
          // Transiciones
          "transition-all duration-200",
          // Variantes de color
          variant === 'primary'
            ? "bg-primary text-white hover:bg-primary-hover"
            : "bg-transparent text-primary border-primary/50 hover:bg-primary/10",
          // Hover: efecto "presionable" 3D
          "hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]",
          // Active: presionado
          "active:translate-y-[1px] active:shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
          className
        )}
        {...props}
      >
        {/* ShineBorder - bucle de luz dentro del marco oscuro */}
        <ShineBorder
          borderWidth={2}
          duration={12}
          shineColor={variant === 'primary'
            ? ["#60a5fa", "#3b82f6", "#60a5fa"]
            : ["#3b82f6", "#60a5fa", "#3b82f6"]
          }
        />

        {/* Contenido con z-index para estar sobre ShineBorder */}
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
  ```

  ## Detalles del Efecto

  - border-[3px] border-[#0f172a]: Marco oscuro grueso (casi negro slate-900)
  - ShineBorder interno: Luz animada recorriendo el borde
  - shadow con inset: Da sensacion de profundidad/relieve
  - hover:translate-y-[-2px]: Boton "sube" al hover
  - active:translate-y-[1px]: Boton "baja" al click

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: components/ui/Button.tsx
     - Cambios: Agregado efecto 3D con marco oscuro + ShineBorder
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL022"
       context: "Button 3D effect with dark frame"
       decision: "Usar border-[3px] border-[#0f172a] + ShineBorder interno + box-shadow inset para efecto relieve 3D"
       rationale: "Marco oscuro crea contraste, ShineBorder agrega luz animada, shadows dan profundidad"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-14"
       tags: ["button", "3d-effect", "shine-border", "ui"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at a "2026-01-14"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso sin errores de TypeScript

---

### FASE 2: Validacion

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 2: Validar build y lint",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml` (si existe)

  # CONTEXTO

  - Branch: main
  - Cambios: Button.tsx modificado con efecto 3D

  # TAREA

  Ejecutar validaciones:

  1. `npm run build` - debe pasar sin errores
  2. `npm run lint` - debe pasar sin errores criticos

  ## Criterios de Exito

  - Build compila exitosamente
  - No hay errores de TypeScript
  - Lint pasa (warnings aceptables)

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Resultado build: PASS | FAIL
     - Resultado lint: PASS | FAIL
     - Estado: SUCCESS | BLOCKED

  2. Si falla, documentar error especifico para correccion
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
| CP0 | FASE 0 | Dependencias existen | `ls components/magicui/shine-border.tsx lib/utils.ts` |
| CP1 | FASE 1 | Button.tsx compilando | `npx tsc --noEmit` |
| CP2 | FASE 2 | Build + Lint exitoso | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| ShineBorder no funciona dentro de button | Alto | Usar wrapper div si es necesario |
| Conflicto con estilos existentes | Medio | Test visual en dev server |
| Performance de animacion | Bajo | ShineBorder usa CSS animations (GPU accelerated) |

## Decisiones Propuestas

| ID | Decision | Rationale |
|----|----------|-----------|
| SL022 | Button 3D: border-[3px] border-[#0f172a] + ShineBorder + inset shadow | Marco oscuro crea contraste visual, ShineBorder agrega luz animada elegante |

---

**Generado por:** /plan-task v3.0
**Completion Promise:** BUTTON 3D COMPLETE
