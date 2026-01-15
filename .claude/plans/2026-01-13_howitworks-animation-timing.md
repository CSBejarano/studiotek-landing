# Plan de Ejecucion: HowItWorks Animation Timing

> **Generado:** 2026-01-13
> **Issue:** N/A (mejora visual)
> **Workflow ID:** 2026-01-13_howitworks-animation-timing

## Variables

```yaml
DOMAIN: "frontend"
BRANCH: "main"
WORKFLOW_ID: "2026-01-13_howitworks-animation-timing"
```

## Purpose

Modificar el ciclo de animacion del componente HowItWorks para que cada card tenga una duracion diferente en orden decreciente:
- Card 1 (Analisis): 12 segundos
- Card 2 (Estrategia): 9 segundos
- Card 3 (Implementacion): 6 segundos
- Card 4 (Optimizacion): 3 segundos
- Reinicio del ciclo (total: 30 segundos)

## Code Structure

```yaml
MODIFY:
  - "components/sections/HowItWorks.tsx"

TESTS:
  - Verificacion visual con npm run dev
```

## WORKFLOW

### FASE 1: Implementar Duraciones Variables

**Agente:** @frontend

**Task:**

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Implementar duraciones variables por step",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar SL018 (Sequential animation state)
     - blockers: Verificar si hay problemas conocidos con animaciones

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones previas sobre animaciones

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/HowItWorks.tsx
  - Estado actual: STEP_DURATION = 3000 (igual para todos)

  # TAREA

  Modificar HowItWorks.tsx para implementar duraciones diferentes por step.

  ## Cambios Requeridos

  1. **Linea 111** - Cambiar constante por array:
     ```typescript
     // ANTES:
     const STEP_DURATION = 3000; // 3 seconds per step

     // DESPUES:
     // Duraciones por step en ms (ciclo completo: 30s)
     const STEP_DURATIONS = [12000, 9000, 6000, 3000];
     ```

  2. **Lineas 114-136** - Cambiar setInterval por setTimeout:
     ```typescript
     // ANTES:
     useEffect(() => {
       if (isPaused || shouldReduceMotion) return;

       const interval = setInterval(() => {
         setActiveStep((prev) => {
           const next = (prev + 1) % steps.length;
           if (next === 0) {
             setCompletedSteps([]);
           } else {
             setCompletedSteps((completed) => {
               if (!completed.includes(prev)) {
                 return [...completed, prev];
               }
               return completed;
             });
           }
           return next;
         });
       }, STEP_DURATION);

       return () => clearInterval(interval);
     }, [isPaused, shouldReduceMotion]);

     // DESPUES:
     useEffect(() => {
       if (isPaused || shouldReduceMotion) return;

       const timeout = setTimeout(() => {
         setActiveStep((prev) => {
           const next = (prev + 1) % steps.length;
           if (next === 0) {
             setCompletedSteps([]);
           } else {
             setCompletedSteps((completed) => {
               if (!completed.includes(prev)) {
                 return [...completed, prev];
               }
               return completed;
             });
           }
           return next;
         });
       }, STEP_DURATIONS[activeStep]);

       return () => clearTimeout(timeout);
     }, [activeStep, isPaused, shouldReduceMotion]);
     ```

  ## Archivos

  MODIFY: components/sections/HowItWorks.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: HowItWorks.tsx
     - Cambios: STEP_DURATION -> STEP_DURATIONS, setInterval -> setTimeout
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL022"
       context: "HowItWorks step timing customization"
       decision: "Usar setTimeout con array STEP_DURATIONS para duraciones diferentes por step (12s, 9s, 6s, 3s)"
       rationale: "setInterval no soporta tiempos variables; setTimeout se recrea con cada cambio de activeStep"
       confidence: 0.95
       validated_count: 1
       last_used: "2026-01-13"
       tags: ["animation", "timing", "howitworks"]

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso sin errores de TypeScript

---

### FASE 2: Validacion Visual

**Agente:** @testing

**Task:**

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 2: Validar animacion visual",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`:
     - Verificar patrones de testing visual

  # CONTEXTO

  - Archivo modificado: components/sections/HowItWorks.tsx
  - Cambio: Tiempos de animacion ahora son 12s, 9s, 6s, 3s

  # TAREA

  Validar que la animacion funciona correctamente.

  ## Verificaciones

  1. Ejecutar `npm run build` - debe pasar sin errores
  2. Ejecutar `npm run dev` - verificar en browser
  3. Verificar visualmente:
     - Card 1 (Analisis) permanece activa ~12 segundos
     - Card 2 (Estrategia) permanece activa ~9 segundos
     - Card 3 (Implementacion) permanece activa ~6 segundos
     - Card 4 (Optimizacion) permanece activa ~3 segundos
     - Ciclo se reinicia automaticamente
  4. Verificar que hover pause sigue funcionando

  ## Criterios de Exito

  - [ ] Build pasa sin errores
  - [ ] Animacion cicla correctamente
  - [ ] Hover pausa la animacion
  - [ ] Ciclo total ~30 segundos

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Tests ejecutados: build, visual
     - Resultado: PASS/FAIL
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run dev`
- Criterio: Animacion visual correcta con tiempos decrecientes

---

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | FASE 1 | Build exitoso | `npm run build` |
| CP2 | FASE 2 | Animacion correcta | `npm run dev` + visual |

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Loop infinito useEffect | Alto | Baja | activeStep en dependencias |
| Hover pause falla | Medio | Muy Baja | Logica no cambia |
| Tiempos incorrectos | Bajo | Baja | Array explicito |

## Notas Tecnicas

**Por que setTimeout en lugar de setInterval:**
- `setInterval` usa un tiempo fijo que no puede cambiar dinamicamente
- `setTimeout` se recrea cada vez que cambia `activeStep`
- Esto permite usar `STEP_DURATIONS[activeStep]` para obtener la duracion correcta

**Ciclo total:**
- 12 + 9 + 6 + 3 = 30 segundos por ciclo completo

---

**Generado por:** /plan-task
**Version:** 3.0
