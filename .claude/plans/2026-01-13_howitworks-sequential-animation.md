# Plan de Ejecucion: HowItWorks Sequential Animation

> **Generado:** 2026-01-13
> **Issue:** N/A (Feature request)
> **Dominio:** frontend

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

Modificar la seccion "Como Trabajamos" (HowItWorks.tsx) para agregar:
1. Animacion secuencial en bucle infinito
2. Cards que se iluminan progresivamente (una por una)
3. Lineas conectoras que brillan entre cards
4. Estados dim (inactivo) y active (iluminado)
5. Usar Framer Motion (ya instalado)

## Code Structure

```yaml
MODIFY:
  - "components/sections/HowItWorks.tsx"

TESTS:
  - "npm run build" (validacion de compilacion)
  - Visual inspection en browser
```

## Decisiones Previas Relevantes

| ID | Decision | Aplicacion |
|----|----------|------------|
| SL017 | HowItWorks glassmorphism cards con motion.div | Mantener estilo, agregar estados |
| SL012 | ShineBorder para efectos sutiles | Referencia para glow effects |

## WORKFLOW

### FASE 1: Estado de Animacion Secuencial

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Implementar estado y ciclo de animacion",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL017 sobre HowItWorks
     - blockers: Problemas conocidos
     - file_patterns_discovered: Estructura de componentes

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx
  - Framer Motion ya instalado (v12.26.2)

  # TAREA

  Agregar estado y logica de ciclo a HowItWorks.tsx:

  1. Agregar imports necesarios:
     ```tsx
     import { useState, useEffect, useCallback } from 'react';
     import { useReducedMotion } from 'framer-motion';
     ```

  2. Agregar estado para tracking:
     ```tsx
     const [activeStep, setActiveStep] = useState(0);
     const [isPaused, setIsPaused] = useState(false);
     const shouldReduceMotion = useReducedMotion();
     const STEP_DURATION = 3000; // 3 segundos por paso
     ```

  3. Agregar useEffect para ciclo automatico:
     ```tsx
     useEffect(() => {
       if (isPaused || shouldReduceMotion) return;

       const interval = setInterval(() => {
         setActiveStep((prev) => (prev + 1) % steps.length);
       }, STEP_DURATION);

       return () => clearInterval(interval);
     }, [isPaused, shouldReduceMotion]);
     ```

  4. Agregar handlers para pause on hover:
     ```tsx
     const handleCardHover = useCallback((index: number) => {
       setIsPaused(true);
       setActiveStep(index);
     }, []);

     const handleCardLeave = useCallback(() => {
       setIsPaused(false);
     }, []);
     ```

  ## Archivos

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     En `decisions:` agregar:
     - id: "SL018"
       context: "Sequential animation state for HowItWorks"
       decision: "useState + useEffect interval con isPaused y useReducedMotion"
       rationale: "Ciclo automatico con pause on hover, accesible"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-13"
       tags: ["animation", "framer-motion", "state-management"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Build pasa sin errores

---

### FASE 2: Estados Visuales Dim/Active

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Implementar estados visuales dim y active",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL017, SL018 sobre HowItWorks
     - file_patterns_discovered: Estructura de componentes

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx
  - Estado activeStep ya implementado en FASE 1

  # TAREA

  Modificar el renderizado de cards para aplicar estados visuales:

  1. En el map de steps, agregar variable isActive:
     ```tsx
     const isActive = index === activeStep;
     ```

  2. Modificar motion.div del card con animate dinamico:
     ```tsx
     <motion.div
       key={step.number}
       variants={itemVariants}
       className="group relative"
       onMouseEnter={() => handleCardHover(index)}
       onMouseLeave={handleCardLeave}
       animate={{
         scale: isActive ? 1.02 : 0.98,
         opacity: isActive ? 1 : 0.6,
       }}
       transition={{
         duration: 0.5,
         ease: [0.4, 0, 0.2, 1],
       }}
     >
     ```

  3. Agregar glow effect al card activo (boxShadow animado):
     ```tsx
     style={{
       boxShadow: isActive
         ? `0 0 40px rgba(${getGlowColor(step.gradient)}, 0.3), 0 0 80px rgba(${getGlowColor(step.gradient)}, 0.15)`
         : 'none',
     }}
     ```

  4. Crear helper function para obtener color de glow:
     ```tsx
     const getGlowColor = (gradient: string) => {
       const colors: Record<string, string> = {
         'from-blue-500 to-cyan-500': '59, 130, 246',
         'from-violet-500 to-purple-500': '139, 92, 246',
         'from-amber-500 to-orange-500': '245, 158, 11',
         'from-emerald-500 to-green-500': '16, 185, 129',
       };
       return colors[gradient] || '59, 130, 246';
     };
     ```

  5. Modificar estilos del inner div para transiciones:
     - Border mas brillante cuando activo
     - Background ligeramente mas claro

  ## Archivos

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     En `decisions:` agregar:
     - id: "SL019"
       context: "Dim/active visual states for animated cards"
       decision: "scale 1.02/0.98, opacity 1/0.6, dynamic boxShadow glow"
       rationale: "Estados claros con transiciones GPU-friendly (transform, opacity)"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-13"
       tags: ["animation", "visual-states", "glow", "performance"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual inspection)
- Criterio: Cards ciclan automaticamente, card activa tiene glow visible, inactivas estan dimmed

---

### FASE 3: Lineas Conectoras Animadas

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Implementar lineas conectoras con animacion",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL017-SL019 sobre HowItWorks
     - file_patterns_discovered: Estructura de componentes

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx
  - Estados dim/active ya implementados en FASE 2
  - Layout: 4 cols en desktop (lg), 2 en tablet, 1 en mobile

  # TAREA

  Agregar lineas conectoras horizontales entre cards (solo desktop):

  1. Crear componente Connector dentro del archivo:
     ```tsx
     const Connector = ({ isActive, gradient }: { isActive: boolean; gradient: string }) => (
       <div className="hidden lg:flex items-center justify-center w-16 relative">
         {/* Base line */}
         <div className="absolute w-full h-0.5 bg-white/10" />

         {/* Animated glow line */}
         <motion.div
           className={`absolute w-full h-0.5 bg-gradient-to-r ${gradient}`}
           animate={{
             opacity: isActive ? 1 : 0,
             scaleX: isActive ? 1 : 0,
           }}
           transition={{
             duration: 0.4,
             ease: 'easeOut',
           }}
           style={{ originX: 0 }}
         />

         {/* Traveling dot */}
         <motion.div
           className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${gradient} shadow-lg`}
           animate={{
             x: isActive ? ['0%', '600%'] : '0%',
             opacity: isActive ? [0, 1, 1, 0] : 0,
           }}
           transition={{
             duration: 0.6,
             ease: 'easeInOut',
             times: [0, 0.1, 0.9, 1],
           }}
         />
       </div>
     );
     ```

  2. Modificar el grid para intercalar cards y connectors:
     ```tsx
     <div className="flex flex-wrap justify-center items-stretch gap-y-6 mt-20">
       {steps.map((step, index) => {
         const isActive = index === activeStep;
         const showConnector = index < steps.length - 1;
         const isConnectorActive = index === activeStep && activeStep < steps.length - 1;

         return (
           <Fragment key={step.number}>
             {/* Card */}
             <motion.div className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(25%-3rem)]">
               {/* ...card content... */}
             </motion.div>

             {/* Connector */}
             {showConnector && (
               <Connector
                 isActive={isConnectorActive}
                 gradient={steps[index + 1].gradient}
               />
             )}
           </Fragment>
         );
       })}
     </div>
     ```

  3. Ajustar responsive:
     - Mobile (< md): Cards full width, sin connectors
     - Tablet (md - lg): Cards 50%, sin connectors horizontales
     - Desktop (lg+): Cards 25%, connectors visibles

  ## Archivos

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Problemas encontrados (si hay)
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     En `decisions:` agregar:
     - id: "SL020"
       context: "Animated connecting lines for step process"
       decision: "Connector component con base line + glow line + traveling dot"
       rationale: "Muestra progreso visualmente; solo en desktop para simplicidad responsive"
       confidence: 0.90
       validated_count: 1
       last_used: "2026-01-13"
       tags: ["animation", "connectors", "responsive", "framer-motion"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` con viewport 1280px+
- Criterio: Lineas horizontales visibles entre cards, animacion de glow sync con card activa

---

### FASE 4: Accesibilidad y Polish

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 4: Accesibilidad y polish final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL017-SL020 sobre HowItWorks
     - blockers: Problemas conocidos

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx
  - Animacion secuencial completa de FASE 1-3

  # TAREA

  1. Verificar useReducedMotion:
     - Si shouldReduceMotion es true, mostrar primer card como activo estaticamente
     - Sin animaciones automaticas

  2. Agregar ARIA attributes:
     ```tsx
     <div
       role="list"
       aria-label="Pasos de nuestro proceso de trabajo"
     >
       {steps.map((step, index) => (
         <div
           role="listitem"
           aria-current={isActive ? 'step' : undefined}
         >
     ```

  3. Asegurar contraste en estados:
     - Estado dim: opacity 0.6 pero texto debe ser legible
     - Verificar text-white/60 tiene suficiente contraste

  4. Optimizar performance:
     - Verificar que solo se animen transform y opacity
     - Evitar layout shifts durante animacion

  5. Test visual completo:
     - Ciclo completo de animacion (12 segundos)
     - Hover pause funciona
     - Responsive en todos los breakpoints
     - Sin parpadeos ni jank

  ## Archivos

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe completo:
     - Todos los cambios realizados
     - Tests pasados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at

     En `decisions:` agregar si aplica:
     - id: "SL021"
       context: "Accessibility for animated process steps"
       decision: "useReducedMotion fallback, role='list', aria-current"
       rationale: "WCAG compliance, respeta preferencias del usuario"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-13"
       tags: ["accessibility", "a11y", "wcag", "reduced-motion"]
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Build exitoso, lint sin errores, animacion fluida visualmente

---

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | FASE 1 | Build pasa, estado funciona | `npm run build` |
| CP2 | FASE 2 | Cards tienen estados dim/active visibles | Visual inspection |
| CP3 | FASE 3 | Lineas conectoras animadas en desktop | Viewport >= 1280px |
| CP4 | FASE 4 | Build + lint pass, animacion fluida | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Animation jank en mobile | Medium | Solo usar transform/opacity (GPU) |
| Lineas no alinean en resize | Low | Ocultar en mobile/tablet, solo desktop |
| Conflicto hover vs active | Medium | Priorizar hover cuando isPaused=true |
| Reduced motion ignorado | Medium | Implementar fallback estatico |
| Performance con multiples animaciones | Low | Framer Motion optimiza batch |

## Output Esperado

Al completar las 4 fases:
- Cards ciclan automaticamente cada 3 segundos
- Card activa tiene glow, scale up, full opacity
- Cards inactivas estan dimmed (opacity 0.6, scale down)
- Lineas horizontales conectan cards en desktop
- Linea previa a card activa tiene animacion de glow
- Hover pausa animacion y activa card hovereada
- Respeta prefers-reduced-motion
- Build y lint pasan sin errores

---

**Plan Version:** 1.0
**Created:** 2026-01-13
**Workflow ID:** 2026-01-13_howitworks-sequential-animation
