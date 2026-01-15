# Plan de Ejecucion: Scrollytelling Portfolio de Alto Nivel

> **Generado:** 2026-01-13
> **Dominio:** frontend
> **Complejidad:** 8/10

## Variables

```yaml
WORKFLOW_ID: "2026-01-13_scrollytelling-portfolio"
DOMAIN: "frontend"
BRANCH: "feat/scrollytelling-portfolio"
TOTAL_FRAMES: 105
FRAME_PATH: "/secuencia/"
BACKGROUND_COLOR: "#121212"
SCROLL_HEIGHT: "500vh"
```

## Purpose

Crear un sitio web de portfolio personal "Scrollytelling" de alto nivel (estilo Awwwards) con:
1. Animacion scroll-linked que reproduce secuencia de 105 imagenes WebP
2. Canvas HTML5 (NO video) para renderizado de alto rendimiento
3. Secciones de texto parallax sobre el canvas
4. Grid de proyectos con glassmorphism despues de la animacion

## Code Structure

**CREATE:**
```
components/portfolio/
  ScrollyCanvas.tsx      # Componente principal con canvas + preload
  Overlay.tsx            # Secciones de texto parallax
  Projects.tsx           # Grid de proyectos glassmorphism
lib/
  frameUtils.ts          # Utilidades para manejo de frames
```

**MODIFY:**
```
app/globals.css          # Background #121212, fuente Inter
app/page.tsx             # Nueva estructura con ScrollyCanvas + Projects
```

**ASSETS:**
```
secuencia/               # 105 frames WebP (ya existentes)
  frame_000_delay-0.067s.webp
  ...
  frame_104_delay-0.06Xs.webp
```

---

## WORKFLOW

### FASE 0: Preparacion de Assets

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 0: Preparacion de assets",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones
     - file_patterns_discovered: Patrones utiles

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relevantes sobre assets y performance

  # CONTEXTO

  - Workflow: scrollytelling-portfolio
  - Frames: 105 imagenes WebP en /secuencia/
  - Problema: Nombres inconsistentes (0.066s vs 0.067s)

  # TAREA

  Crear utilidad para generar array de URLs de frames:

  ## Archivos

  CREATE: lib/frameUtils.ts

  ```typescript
  // lib/frameUtils.ts
  export const TOTAL_FRAMES = 105;

  // Generate frame URLs dynamically
  // Handles both .066s and .067s delay suffixes
  export const getFrameUrl = (index: number): string => {
    const paddedIndex = index.toString().padStart(3, '0');
    // Primary pattern (most common)
    return `/secuencia/frame_${paddedIndex}_delay-0.067s.webp`;
  };

  export const generateFrameUrls = (): string[] => {
    return Array.from({ length: TOTAL_FRAMES }, (_, i) => getFrameUrl(i));
  };

  // Preload all images and return array of HTMLImageElements
  export const preloadImages = async (
    onProgress?: (loaded: number, total: number) => void
  ): Promise<HTMLImageElement[]> => {
    const frameUrls = generateFrameUrls();
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const loadPromises = frameUrls.map((url, index) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          onProgress?.(loadedCount, TOTAL_FRAMES);
          resolve(img);
        };
        img.onerror = () => {
          // Try alternate pattern (.066s)
          const altUrl = url.replace('0.067s', '0.066s');
          img.src = altUrl;
          img.onload = () => {
            loadedCount++;
            onProgress?.(loadedCount, TOTAL_FRAMES);
            resolve(img);
          };
          img.onerror = () => reject(new Error(`Failed to load frame ${index}`));
        };
        img.src = url;
        images[index] = img;
      });
    });

    await Promise.all(loadPromises);
    return images;
  };
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados: lib/frameUtils.ts
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` (si tomaste decisiones importantes):
     - context: "Frame loading strategy"
       decision: "Fallback pattern .067s -> .066s para manejo de nombres inconsistentes"
       confidence: 0.90
       validated_in: "scrollytelling-portfolio"

     En `blockers:` (si encontraste problemas):
     - type: "asset-naming"
       description: "Frames con delay suffix inconsistente"
       solution: "Fallback en preloadImages con pattern alternativo"
       learned_in: "scrollytelling-portfolio"
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls lib/frameUtils.ts`
- Criterio: Archivo existe

---

### FASE 1: Global Styles y Setup

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Global styles setup",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Stack: Next.js 16 + Tailwind 4
  - Fuente: Inter (ya configurada)
  - Background target: #121212 (dark theme)

  # TAREA

  Configurar estilos globales para el portfolio scrollytelling.

  ## Archivos

  MODIFY: app/globals.css

  Agregar/modificar:
  ```css
  /* Dark theme para scrollytelling */
  body {
    background-color: #121212;
    color: #ffffff;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Smooth scrolling reset para mejor control con Framer Motion */
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: auto;
    }
  }
  ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados: app/globals.css
     - Cambios: background #121212, color white
     - Estado: SUCCESS

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Dark theme background para scrollytelling portfolio
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev`
- Criterio: Pagina carga con fondo oscuro

---

### FASE 2: ScrollyCanvas Component

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: ScrollyCanvas component",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`
  3. Leer `lib/frameUtils.ts` para entender la API de preload

  # CONTEXTO

  - Motion (Framer Motion) ya instalado: version 12.26.2
  - 105 frames WebP en /secuencia/
  - Container: 500vh para scroll cinematico
  - Canvas: sticky, h-screen, object-fit: cover

  # TAREA

  Crear el componente principal ScrollyCanvas.

  ## Archivos

  CREATE: components/portfolio/ScrollyCanvas.tsx

  ## Especificaciones Tecnicas

  1. **Container Structure:**
     - Wrapper div con height: 500vh
     - Inner sticky container (top-0, h-screen)
     - Canvas element que llena el viewport

  2. **Image Preloading:**
     - Usar preloadImages de lib/frameUtils.ts
     - Mostrar loading state mientras carga
     - Estado: { loading, progress, error }

  3. **Scroll-linked Animation:**
     - useScroll de framer-motion con target=containerRef
     - offset: ["start start", "end end"]
     - frameIndex = useTransform(scrollYProgress, [0, 1], [0, 104])

  4. **Canvas Rendering:**
     - drawImageCover helper para aspect ratio correcto
     - useMotionValueEvent para re-render en scroll
     - Responsive: resize listener para canvas dimensions

  5. **Cover Behavior Algorithm:**
     ```typescript
     const drawImageCover = (
       ctx: CanvasRenderingContext2D,
       img: HTMLImageElement,
       canvas: HTMLCanvasElement
     ) => {
       const canvasRatio = canvas.width / canvas.height;
       const imgRatio = img.naturalWidth / img.naturalHeight;

       let drawWidth, drawHeight, offsetX, offsetY;

       if (imgRatio > canvasRatio) {
         drawHeight = canvas.height;
         drawWidth = img.naturalWidth * (canvas.height / img.naturalHeight);
         offsetX = (canvas.width - drawWidth) / 2;
         offsetY = 0;
       } else {
         drawWidth = canvas.width;
         drawHeight = img.naturalHeight * (canvas.width / img.naturalWidth);
         offsetX = 0;
         offsetY = (canvas.height - drawHeight) / 2;
       }

       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
     };
     ```

  6. **Loading State UI:**
     - Centered loader con porcentaje
     - Fondo #121212 para blend perfecto
     - Transicion smooth al completar carga

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decision: "Canvas scroll animation pattern"
     - decision: "useMotionValueEvent para frame updates"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev`
- Criterio: Canvas renderiza primer frame, scroll cambia frames

---

### FASE 3: Overlay Component (Parallax Text)

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Overlay parallax text",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - ScrollyCanvas ya implementado con useScroll
  - Overlay debe estar ENCIMA del canvas (z-10)
  - 3 secciones de texto que aparecen/desaparecen con scroll

  # TAREA

  Crear componente Overlay con texto parallax.

  ## Archivos

  CREATE: components/portfolio/Overlay.tsx

  ## Secciones de Texto

  1. **Section 1 (0% - 20% scroll):**
     - Texto: "Mi nombre" (H1) + "Desarrollador creativo" (subtitle)
     - Posicion: Centro
     - Parallax: y moves faster than scroll

  2. **Section 2 (25% - 45% scroll):**
     - Texto: "Construyo experiencias digitales"
     - Posicion: Izquierda
     - Parallax: slight y offset

  3. **Section 3 (55% - 75% scroll):**
     - Texto: "Diseno e ingenieria de puentes"
     - Posicion: Derecha
     - Parallax: slight y offset

  ## Implementacion

  ```typescript
  // Overlay needs scrollYProgress from parent
  interface OverlayProps {
    scrollYProgress: MotionValue<number>;
  }

  // Transform ranges for each section
  const section1Opacity = useTransform(scrollYProgress,
    [0, 0.05, 0.15, 0.2], [0, 1, 1, 0]);
  const section1Y = useTransform(scrollYProgress,
    [0, 0.2], ["0%", "-30%"]);
  ```

  ## Styling
  - text-white para contraste sobre video
  - text-shadow para legibilidad
  - pointer-events-none para no bloquear scroll

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`
  """
)
~~~~~

**Checkpoint:**
- Comando: Visual check
- Criterio: Texto aparece/desaparece con scroll, parallax visible

---

### FASE 4: Projects Component (Glassmorphism Grid)

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 4: Projects glassmorphism grid",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Seccion DESPUES del scrollytelling (fuera del 500vh)
  - Estilo: Glassmorphism (blur, bordes finos, glow hover)
  - Grid: 2 columnas desktop, 1 mobile

  # TAREA

  Crear grid de proyectos con tarjetas glassmorphism.

  ## Archivos

  CREATE: components/portfolio/Projects.tsx

  ## Project Data (Placeholder)
  ```typescript
  const projects = [
    {
      title: "Proyecto Alpha",
      description: "Experiencia inmersiva de realidad aumentada",
      image: "/placeholder-project.jpg", // o gradiente placeholder
      tags: ["React", "Three.js", "WebGL"],
    },
    {
      title: "Proyecto Beta",
      description: "Dashboard analitico con visualizaciones 3D",
      image: "/placeholder-project.jpg",
      tags: ["Next.js", "D3", "Tailwind"],
    },
    {
      title: "Proyecto Gamma",
      description: "App movil con animaciones fluidas",
      image: "/placeholder-project.jpg",
      tags: ["React Native", "Reanimated"],
    },
    {
      title: "Proyecto Delta",
      description: "Sitio e-commerce con UX premium",
      image: "/placeholder-project.jpg",
      tags: ["Next.js", "Stripe", "Framer Motion"],
    },
  ];
  ```

  ## Glassmorphism Styles
  ```typescript
  // Card base
  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"

  // Hover state
  className="hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"

  // Transition
  className="transition-all duration-300"
  ```

  ## Layout
  - Section: min-h-screen, py-20
  - Container: max-w-7xl mx-auto px-4
  - Grid: grid-cols-1 md:grid-cols-2 gap-8
  - Titulo: "Proyectos" con text-4xl font-bold

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`
  """
)
~~~~~

**Checkpoint:**
- Comando: Visual check
- Criterio: Grid renderiza, hover effects funcionan

---

### FASE 5: Page Integration

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 5: Page integration",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Componentes creados: ScrollyCanvas, Overlay, Projects
  - Pagina actual tiene: Hero, Benefits, Services, HowItWorks, Stats, ContactForm
  - Esta es una TRANSFORMACION COMPLETA de la pagina

  # TAREA

  Integrar los componentes de portfolio en app/page.tsx.

  ## Archivos

  MODIFY: app/page.tsx

  ## Nueva Estructura
  ```tsx
  import { ScrollyCanvas } from '@/components/portfolio/ScrollyCanvas';
  import { Projects } from '@/components/portfolio/Projects';

  export default function Home() {
    return (
      <main className="bg-[#121212]">
        <ScrollyCanvas />
        <Projects />
      </main>
    );
  }
  ```

  ## Consideraciones
  - Remover imports de Hero, Benefits, Services, etc.
  - Header y Footer pueden mantenerse si estan en layout.tsx
  - Si Header interfiere visualmente, considerar ocultarlo durante scroll

  ## IMPORTANTE
  - NO eliminar los archivos de components/sections/* (pueden usarse en el futuro)
  - Solo modificar page.tsx para usar los nuevos componentes

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe
  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build pasa sin errores

---

### FASE 6: Testing & Polish

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 6: Testing y validacion",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`
  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Portfolio scrollytelling implementado
  - Necesita validacion de build, responsive, performance

  # TAREA

  Validar la implementacion completa.

  ## Checklist de Validacion

  1. **Build Check:**
     ```bash
     npm run build
     ```
     - Sin errores TypeScript
     - Sin warnings criticos

  2. **Lint Check:**
     ```bash
     npm run lint
     ```
     - Sin errores en codigo nuevo

  3. **Responsive Testing (Manual):**
     - [ ] Desktop (1920x1080): Canvas llena viewport
     - [ ] Tablet (768px): Layout ajusta
     - [ ] Mobile (375px): Single column grid

  4. **Performance Indicators:**
     - Tiempo de carga de 105 frames
     - Smoothness del scroll (60fps target)
     - Memory usage estable

  5. **Functional Tests:**
     - [ ] Frames avanzan con scroll
     - [ ] Texto parallax aparece en momentos correctos
     - [ ] Glassmorphism cards tienen hover effect
     - [ ] No hay flicker/flash blanco durante scroll

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe con resultados de cada check
  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0 para ambos

---

## Checkpoints Summary

| CP  | Fase   | Criterio | Comando |
|-----|--------|----------|---------|
| CP0 | FASE 0 | frameUtils.ts existe | `ls lib/frameUtils.ts` |
| CP1 | FASE 1 | Fondo oscuro visible | `npm run dev` |
| CP2 | FASE 2 | Canvas renderiza frames | Visual check |
| CP3 | FASE 3 | Parallax text funciona | Visual check |
| CP4 | FASE 4 | Grid glassmorphism visible | Visual check |
| CP5 | FASE 5 | Build pasa | `npm run build` |
| CP6 | FASE 6 | Build + lint pasan | `npm run build && npm run lint` |

---

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| 105 imagenes = carga lenta | HIGH | Loading state con progreso, considerar lazy loading |
| Canvas flicker en scroll rapido | MEDIUM | Throttle rendering, requestAnimationFrame |
| Nombres de frames inconsistentes | LOW | Fallback pattern en preloadImages |
| Mobile performance | MEDIUM | Probar en dispositivos reales, reducir frames si necesario |
| Safari scroll issues | MEDIUM | Testar scroll-behavior, usar polyfill si necesario |

---

## Technical Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| TD1 | Canvas vs Video | Canvas permite control frame-by-frame, mejor performance |
| TD2 | Preload con fallback | Maneja inconsistencia en nombres de archivos |
| TD3 | useMotionValueEvent | Mas eficiente que useEffect con dependency |
| TD4 | object-fit: cover manual | Canvas no soporta CSS object-fit |
| TD5 | 500vh container | Scroll largo y cinematico como especificado |

---

**Plan Version:** 1.0
**Created:** 2026-01-13
**Estimated Duration:** 3-4 horas
**Agentes:** @frontend, @testing
