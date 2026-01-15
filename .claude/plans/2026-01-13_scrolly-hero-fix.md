# Plan de Ejecucion: Fix ScrollyHero - Canvas Persistence y Fluidez

> **Generado:** 2026-01-13T21:00:00Z
> **Issue:** N/A (Bug fix solicitado por usuario)
> **Dominio:** frontend

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
WORKFLOW_ID: "2026-01-13_scrolly-hero-fix"
```

## Purpose

Corregir dos problemas criticos en el componente ScrollyHero.tsx:

1. **Bug de persistencia:** Cuando el usuario para de hacer scroll, el canvas vuelve a mostrar el fondo negro (#121212) en lugar de mantener el frame actual visible.

2. **Fluidez del scroll:** La animacion no se ve como un video fluido - se percibe "lenta" o con saltos.

## Root Cause Analysis

### Bug Principal Identificado

En el `useEffect` de lineas 232-248, hay un bug critico:

```tsx
useEffect(() => {
  // ...
  drawFrame(0);  // SIEMPRE dibuja frame 0, no currentFrame
  // ...
}, [imagesLoaded, images, currentFrame, drawFrame]);
//                        ^^^^^^^^^^^^
// currentFrame en dependencias causa re-ejecucion en cada cambio!
```

**Flujo del bug:**
1. Usuario hace scroll
2. `useMotionValueEvent` dibuja el frame correcto
3. `setCurrentFrame(frame)` actualiza el estado
4. useEffect se re-ejecuta por cambio en currentFrame
5. `drawFrame(0)` sobreescribe el frame actual con frame 0

## Code Structure

```yaml
MODIFY:
  - "components/portfolio/ScrollyHero.tsx"
```

## WORKFLOW

### FASE 1: Fix Bug de Persistencia

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Fix canvas persistence bug",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones
     - file_patterns_discovered: Patrones utiles

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones Dxxx relevantes (especialmente D086 sobre RAF)

  # CONTEXTO

  - Branch: main
  - Archivo: components/portfolio/ScrollyHero.tsx
  - Problema: Canvas vuelve a frame 0 cuando currentFrame cambia

  # TAREA

  Corregir el bug de persistencia del canvas agregando:

  1. **Agregar currentFrameRef:**
     ```tsx
     const currentFrameRef = useRef(0);
     ```

  2. **Sincronizar ref con state:**
     ```tsx
     useEffect(() => {
       currentFrameRef.current = currentFrame;
     }, [currentFrame]);
     ```

  3. **Modificar useEffect de resize:**
     - Remover `currentFrame` de dependencias
     - Usar `currentFrameRef.current` en handleResize
     - Cambiar `drawFrame(0)` a solo ejecutar en mount inicial

  4. **Codigo corregido:**
     ```tsx
     useEffect(() => {
       if (!imagesLoaded || images.length === 0) return;

       const handleResize = () => {
         const canvas = canvasRef.current;
         if (canvas) {
           canvas.width = 0;
           canvas.height = 0;
         }
         drawFrame(currentFrameRef.current);
       };

       // Solo dibujar frame inicial una vez al montar
       if (currentFrameRef.current === 0) {
         drawFrame(0);
       }

       window.addEventListener('resize', handleResize);
       return () => window.removeEventListener('resize', handleResize);
     }, [imagesLoaded, images.length, drawFrame]);
     ```

  ## Archivos

  MODIFY: components/portfolio/ScrollyHero.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Cambios realizados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL017"
       context: "Canvas ref persistence in scroll animations"
       decision: "Usar useRef para currentFrame en listeners de resize/scroll para evitar re-renders"
       confidence: 0.95
       validated_in: "ScrollyHero fix 2026-01-13"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build pasa sin errores

---

### FASE 2: Mejorar Fluidez del Scroll

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Mejorar fluidez del scroll como video",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Verificar que FASE 1 se completo correctamente

  # CONTEXTO

  - Archivo: components/portfolio/ScrollyHero.tsx
  - Problema: El scroll no se ve fluido como un video

  # TAREA

  Optimizar la fluidez del scroll:

  1. **Agregar requestAnimationFrame para smooth updates:**
     ```tsx
     const rafRef = useRef<number>();

     useMotionValueEvent(frameIndex, 'change', (latest) => {
       // Cancel previous RAF
       if (rafRef.current) {
         cancelAnimationFrame(rafRef.current);
       }

       rafRef.current = requestAnimationFrame(() => {
         const frame = Math.round(latest);
         if (images[frame]) {
           setCurrentFrame(frame);
           drawFrame(frame);
         }
       });
     });
     ```

  2. **Agregar cleanup para RAF:**
     ```tsx
     useEffect(() => {
       return () => {
         if (rafRef.current) {
           cancelAnimationFrame(rafRef.current);
         }
       };
     }, []);
     ```

  3. **Agregar will-change al canvas para GPU acceleration:**
     ```tsx
     <canvas
       ref={canvasRef}
       className="absolute inset-0 w-full h-full"
       style={{
         backgroundColor: '#121212',
         opacity: imagesLoaded ? 1 : 0,
         transition: 'opacity 0.8s ease-out',
         willChange: 'contents'
       }}
     />
     ```

  4. **Opcional - Reducir scrollHeight para mas frames por scroll:**
     Cambiar de `500vh` a `400vh` si el usuario quiere mas velocidad

  ## Archivos

  MODIFY: components/portfolio/ScrollyHero.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL018"
       context: "Canvas scroll animation performance"
       decision: "Usar RAF + willChange para animaciones de canvas suaves"
       confidence: 0.90
       validated_in: "ScrollyHero fix 2026-01-13"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual check)
- Criterio: Scroll se ve fluido, canvas mantiene frame al parar

---

### FASE 3: Validacion

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 3: Validacion del fix",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`
  2. Verificar que FASE 1 y 2 se completaron

  # CONTEXTO

  - Archivo modificado: components/portfolio/ScrollyHero.tsx
  - Bugs corregidos: Persistencia de canvas y fluidez

  # TAREA

  Validar que el fix funciona correctamente:

  1. **Build check:**
     ```bash
     npm run build
     ```

  2. **Lint check:**
     ```bash
     npm run lint
     ```

  3. **Manual testing criteria:**
     - [ ] Canvas muestra frame actual al hacer scroll
     - [ ] Canvas MANTIENE frame cuando se para el scroll
     - [ ] Scroll se ve fluido como video
     - [ ] Funciona en resize de ventana
     - [ ] No hay errores en consola

  4. **TypeScript check:**
     - Verificar que no hay errores de tipos

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe con:
     - Resultado de build
     - Resultado de lint
     - Checklist de criterios manuales
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:

     En `decisions:` (si aplica)
     En `blockers:` (si encontraste problemas)
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Sin errores

---

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | FASE 1 | Build pasa | `npm run build` |
| CP2 | FASE 2 | Scroll fluido | Visual check |
| CP3 | FASE 3 | Build + Lint | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Performance en mobile | Medium | Test en dispositivos reales |
| RAF cleanup incorrecto | Low | Verificar en DevTools Memory |
| willChange causing issues | Low | Probar sin willChange si hay problemas |

## Technical Details

### Codigo Actual (Buggy)

```tsx
// PROBLEMA: drawFrame(0) se ejecuta en cada cambio de currentFrame
useEffect(() => {
  if (!imagesLoaded || images.length === 0) return;

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    drawFrame(currentFrame);
  };

  drawFrame(0);  // <-- BUG: Siempre frame 0

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [imagesLoaded, images, currentFrame, drawFrame]);  // <-- currentFrame causa re-runs
```

### Codigo Corregido

```tsx
const currentFrameRef = useRef(0);

// Sincronizar ref con state
useEffect(() => {
  currentFrameRef.current = currentFrame;
}, [currentFrame]);

// Resize handler sin re-runs innecesarios
useEffect(() => {
  if (!imagesLoaded || images.length === 0) return;

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 0;
      canvas.height = 0;
    }
    drawFrame(currentFrameRef.current);  // Usar ref
  };

  // Solo dibujar frame inicial una vez
  drawFrame(currentFrameRef.current);

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [imagesLoaded, images.length, drawFrame]);  // Sin currentFrame
```

---

## Notes

- **Dominio:** frontend
- **Complejidad:** 4/10
- **Tiempo estimado:** 30-45 min
- **Agentes:** @frontend, @testing
