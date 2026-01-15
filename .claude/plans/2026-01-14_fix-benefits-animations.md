# Plan de Ejecucion: Fix Benefits Card Animations

> **Generado:** 2026-01-14
> **Issue:** N/A (bug fix)
> **Branch:** main

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Corregir las animaciones de las tarjetas "Eficiencia Operativa" (SpeedGaugeAnimation) y "Escalabilidad" (FloatingTagsAnimation) en la seccion Benefits que no funcionan correctamente.

**Problemas identificados:**
1. **SpeedGaugeAnimation:** La aguja del velocimetro no rota correctamente porque `transformOrigin` en SVG con Framer Motion no funciona bien con unidades `px`
2. **FloatingTagsAnimation:** Los tags flotantes pueden no ser visibles debido a posicionamiento con valores de `y` en pixeles que no escalan con el contenedor

## Code Structure

```yaml
MODIFY:
  - "components/animations/SpeedGaugeAnimation.tsx"
  - "components/animations/FloatingTagsAnimation.tsx"

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 1: Corregir SpeedGaugeAnimation

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Fix SpeedGaugeAnimation rotation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Buscar SL025, SL026, SL027 sobre animaciones
     - blockers: Problemas conocidos con animaciones SVG

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes sobre SVG/animaciones

  # CONTEXTO

  - Branch: main
  - Archivo: components/animations/SpeedGaugeAnimation.tsx

  # PROBLEMA

  El `transformOrigin` con unidades `px` no funciona correctamente en SVG con Framer Motion.
  La aguja del velocimetro no rota alrededor del punto central (50, 50).

  # SOLUCION

  Usar el patron de SVG translate wrapper:
  1. Envolver `motion.g` en un `<g transform="translate(50 50)">`
  2. Remover `style={{ transformOrigin: ... }}` de motion.g
  3. Agregar un `<g transform="translate(-50 -50)">` dentro para reposicionar el contenido

  Codigo resultante:
  ```jsx
  <g transform={`translate(${cx} ${cy})`}>
    <motion.g
      animate={shouldReduceMotion ? { rotate: -60 } : { rotate: [-150, -30, -150] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <g transform={`translate(${-cx} ${-cy})`}>
        {/* Needle shape */}
        <polygon ... />
        {/* Center dots */}
        <circle ... />
      </g>
    </motion.g>
  </g>
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Cambios realizados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `blockers:` agregar:
     - type: "svg-transform-origin"
       description: "transformOrigin con px no funciona en SVG con Framer Motion"
       solution: "Usar patron translate wrapper: g[translate(cx cy)] > motion.g[rotate] > g[translate(-cx -cy)]"
       learned_in: "Bug fix Benefits animations"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso sin errores

---

### FASE 2: Corregir FloatingTagsAnimation

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Fix FloatingTagsAnimation positioning",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL025-SL027 sobre animaciones
     - blockers: Problemas con posicionamiento

  # CONTEXTO

  - Branch: main
  - Archivo: components/animations/FloatingTagsAnimation.tsx

  # PROBLEMA

  Los tags flotantes usan valores de `y` en pixeles ([110, 60, 30, -10]) que pueden no escalar correctamente con diferentes tamanos de contenedor.

  # SOLUCION

  Cambiar el sistema de animacion para usar `top` con porcentajes en lugar de `y` con pixeles:

  ```jsx
  <motion.span
    className="absolute text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
    style={{
      left: `${tagPositions[index].x}%`,
      transform: 'translateX(-50%)',  // Centrar horizontalmente
      background: ...,
      border: ...,
      color: ...,
    }}
    initial={
      shouldReduceMotion
        ? { opacity: 1, top: '50%' }  // Posicion estatica centrada
        : { opacity: 0, top: '90%' }  // Inicia abajo
    }
    animate={
      shouldReduceMotion
        ? {}
        : {
            opacity: [0, 1, 1, 0],
            top: ['90%', '55%', '25%', '5%'],  // Sube gradualmente
          }
    }
    transition={...}
  >
  ```

  Alternativa: Mantener `y` pero con valores proporcionales y agregar transform-translate para centrar.

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Cambios realizados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar si aplica:
     - context: "Animaciones con posicionamiento absoluto"
       decision: "Usar top/left con % y transform para centrar, en lugar de x/y con px"
       confidence: 0.90
       validated_in: "Bug fix Benefits animations"

     Actualizar metadata
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso, animacion visible

---

### FASE 3: Validacion

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 3: Validacion final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # CONTEXTO

  Validar que las animaciones corregidas funcionan correctamente.

  # TAREAS

  1. Ejecutar build:
     ```bash
     npm run build
     ```

  2. Ejecutar lint:
     ```bash
     npm run lint
     ```

  3. Verificacion manual:
     - SpeedGaugeAnimation: La aguja debe rotar suavemente de LOW a HIGH
     - FloatingTagsAnimation: Los tags deben flotar hacia arriba y ser visibles

  # CRITERIOS DE EXITO

  - [ ] Build pasa sin errores
  - [ ] Lint pasa sin errores/warnings criticos
  - [ ] SpeedGaugeAnimation muestra aguja rotando
  - [ ] FloatingTagsAnimation muestra tags flotando

  # POST-TAREA (OBLIGATORIO)

  1. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
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

| CP  | Fase   | Criterio                          | Comando                        |
| --- | ------ | --------------------------------- | ------------------------------ |
| CP1 | FASE 1 | SpeedGaugeAnimation build exitoso | `npm run build`                |
| CP2 | FASE 2 | FloatingTagsAnimation funciona    | `npm run build`                |
| CP3 | FASE 3 | Build + lint sin errores          | `npm run build && npm run lint`|

## Risk Matrix

| Riesgo                                    | Impacto | Mitigacion                         |
| ----------------------------------------- | ------- | ---------------------------------- |
| Cambio de patron SVG afecta visual        | Medio   | Mantener mismos valores de rotacion|
| Posicionamiento con % no se ve igual      | Bajo    | Ajustar valores hasta match visual |
| Framer Motion incompatibilidad            | Bajo    | Probar en dev antes de commit      |

---

**Workflow ID:** 2026-01-14_fix-benefits-animations
**Fases:** 3
**Agentes:** @frontend, @testing
