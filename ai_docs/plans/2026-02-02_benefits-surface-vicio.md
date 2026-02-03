# Plan: Benefits Rewrite — Superficie Continua estilo Vicio.com

## Contexto

**Problema**: La seccion Benefits usa paneles discretos de 100vw con GSAP horizontal scroll. Cada panel es un bloque independiente con su layout variant (editorial-left/right/center). No hay continuidad visual entre secciones.

**Objetivo**: Rewrite completo como superficie continua horizontal (~500vw) donde todos los elementos (headlines, imagenes, copy, stats) se posicionan absolutamente y se mueven con parallax individual. Inspirado en vicio.com: layout magazine/collage, tipografia gigante como landmarks, elementos que se solapan entre zonas.

**Referencia visual**: vicio.com — scroll horizontal, collage editorial, stickers, tipografia brutalista, sin separacion entre secciones.

## Arquitectura de la Solucion

### Modelo Mental

```
Surface (500vw x 100vh) — un solo div con posicionamiento absoluto
│
├── GSAP ScrollTrigger: pin container + scrub horizontal
├── Framer Motion useTransform: parallax offset per-element
│
├── Zone AHORRO (~0-150vw) ─── elementos se solapan ──── Zone CLIENTES (~130-280vw)
│                                                              │
│                                              elementos cruzan ──── Zone SATISFACCION (~260-400vw)
│                                                                          │
│                                                               cruzan ──── Zone CTA (~380-500vw)
```

### Tipo SurfaceElement

```ts
type ElementType = 'headline' | 'image' | 'copy' | 'stat-watermark' | 'stat-ticker' | 'badge' | 'cta-headline' | 'cta-button' | 'cta-link';

interface SurfaceElement {
  id: string;
  type: ElementType;
  zone: 'ahorro' | 'clientes' | 'satisfaccion' | 'cta';
  x: number;         // posicion en vw
  y: number;         // posicion en vh
  width?: number;    // ancho en vw
  parallaxSpeed: number; // 1 = normal, <1 = lento (fondo), >1 = rapido (primer plano)
  zIndex: number;
  rotation?: string; // CSS rotate
  content: HeadlineContent | ImageContent | CopyContent | StatContent | CTAContent;
}
```

### Stack de Animacion (hibrido)

| Responsabilidad | Herramienta | Razon |
|----------------|-------------|-------|
| Pin container + scrub | GSAP ScrollTrigger | Robusto, ya implementado |
| Parallax per-element | Framer Motion useTransform | Declarativo, React-friendly |
| Entrada de elementos | Framer Motion (viewport) | Intersection-based |
| Reduced motion | CSS media query + JS check | Accesibilidad |

### Approach Parallax

```
scrollYProgress (0→1, de useScroll target=container)
    │
    ├── speed=0.6 → elemento se mueve 60% de la velocidad base (parece "atras")
    ├── speed=1.0 → elemento se mueve con el scroll (normal)
    └── speed=1.3 → elemento se mueve 130% (parece "adelante", sale antes)

translateX = useTransform(scrollYProgress, [0, 1], [0, -extraOffset])
donde extraOffset = (speed - 1) * totalScrollWidth * factor
```

## Fases

### Fase 1: Reestructurar Data Layer

- **Agente**: @frontend
- **Archivos**:
  - `Benefits/data/surface-layout.ts` (CREAR)
  - `Benefits/data/benefits-data.ts` (ELIMINAR al final)
- **Checkpoint**: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npx tsc --noEmit 2>&1 | tail -5`
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md (seccion "Arquitectura")
LEE los datos actuales: components/sections/Benefits/data/benefits-data.ts

CREA components/sections/Benefits/data/surface-layout.ts con:

1. Type system: SurfaceElement con variantes por type (headline, image, copy, stat-watermark, stat-ticker, badge, cta-headline, cta-button, cta-link)
2. Constantes: SURFACE_WIDTH = 500 (en vw), SURFACE_HEIGHT = 100 (en vh)
3. Array surfaceElements: ~20-25 elementos distribuidos en 4 zonas

Distribucion de elementos (coordenadas x en vw, y en vh):

**Zone AHORRO (0-150vw)**:
- Headline "AHORRA\n2.500 EUR.\nCADA MES." — x:5, y:8, fontSize: ~12vw, speed:1.0, z:20
- Image dashboard — x:52, y:12, width:38, speed:0.8, z:10, rotation:-2deg
- Image equipo — x:18, y:52, width:28, speed:1.15, z:5, rotation:3deg
- Copy 1 (procesos manuales) — x:6, y:42, maxW:22vw, speed:1.0, z:15
- Copy 2 (automatizamos) — x:68, y:72, maxW:20vw, speed:0.9, z:15
- Stat ticker 2500 EUR — x:72, y:85, speed:1.0, z:15
- Watermark "2500" — x:85, y:60, speed:0.6, z:0, opacity:0.03

**Zone CLIENTES (130-280vw)**:
- Headline "ATIENDE\n3X MAS.\nSIN CONTRATAR." — x:165, y:5, fontSize: ~11vw, speed:1.0, z:20
- Image chatbot — x:135, y:28, width:35, speed:0.75, z:10, rotation:2deg
- Image canales — x:225, y:40, width:30, speed:1.1, z:8, rotation:-3deg
- Copy 1 — x:140, y:68, speed:1.0, z:15
- Copy 2 — x:240, y:25, speed:0.95, z:15
- Stat ticker 3x — x:250, y:82, speed:1.0, z:15
- Watermark "3x" — x:200, y:55, speed:0.55, z:0

**Zone SATISFACCION (260-400vw)**:
- Headline "NUNCA\nPIERDAS UN\nCLIENTE." — x:290, y:6, fontSize: ~12vw, speed:1.0, z:20
- Image reviews — x:270, y:35, width:32, speed:0.8, z:10, rotation:-1deg
- Image retencion — x:355, y:42, width:26, speed:1.2, z:8, rotation:2deg
- Copy 1 — x:275, y:72, speed:1.0, z:15
- Copy 2 — x:360, y:18, speed:0.9, z:15
- Stat ticker 98% — x:370, y:80, speed:1.0, z:15
- Watermark "98%" — x:330, y:50, speed:0.5, z:0

**Zone CTA (380-500vw)**:
- CTA Headline "SI HAS LLEGADO..." — x:410, y:20, speed:1.0, z:20
- CTA Button "Empieza ahora" — x:430, y:55, speed:1.0, z:25
- CTA Link email — x:432, y:68, speed:1.0, z:20

**Elementos puente** (cruzan entre zonas):
- Badge/decorativo entre ahorro-clientes — x:120, y:18, speed:1.3, z:12
- Badge/decorativo entre clientes-satisfaccion — x:255, y:75, speed:1.25, z:12

4. Export NUM_ELEMENTS = surfaceElements.length
5. Mantener las mismas URLs de imagenes y textos que benefits-data.ts
6. NO eliminar benefits-data.ts todavia (se usa en MobileBenefits hasta Fase 4)

Usa /react-19 y /tailwind como referencia de patrones TypeScript.
```

### Fase 2: Hook de Parallax por Elemento

- **Agente**: @frontend
- **Archivos**:
  - `Benefits/hooks/useParallaxElement.ts` (CREAR)
  - `Benefits/hooks/useHorizontalScroll.ts` (MODIFICAR — exponer scrollYProgress)
- **Checkpoint**: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npx tsc --noEmit 2>&1 | tail -5`
- **Dependencias**: [Fase 1]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md (seccion "Approach Parallax")
LEE el hook actual: components/sections/Benefits/hooks/useHorizontalScroll.ts

1. MODIFICA useHorizontalScroll.ts:
   - El hook ya funciona bien con GSAP ScrollTrigger (pin + scrub)
   - Solo necesita CAMBIAR el calculo: el surface width ahora es SURFACE_WIDTH * vw, no numPanels * 100vw
   - Importar SURFACE_WIDTH de surface-layout.ts
   - El containerRef height debe ser proporcional al SURFACE_WIDTH para dar suficiente scroll distance
   - Mantener cleanup granular (tween.scrollTrigger?.kill() + tween.kill())

2. CREA useParallaxElement.ts:
   - Input: scrollYProgress (MotionValue<number>), parallaxSpeed (number)
   - Usa useTransform de Framer Motion
   - Calcula offset extra basado en speed:
     * speed=1 → offset 0 (se mueve con el track)
     * speed<1 → offset positivo (se retrasa, parece lejano)
     * speed>1 → offset negativo (se adelanta, parece cercano)
   - Formula: extraOffset = (1 - speed) * SURFACE_WIDTH * (window.innerWidth / 100) * 0.15
   - translateX = useTransform(scrollYProgress, [0, 1], [0, extraOffset])
   - Retorna { style: { x: translateX } } para pasar a motion.div

No usar useSpring (introduce lag). Solo useTransform para respuesta directa al scroll.

Usa /react-19 como referencia de hooks patterns.
```

### Fase 3: Componentes de Superficie (Core)

- **Agente**: @frontend
- **Archivos**:
  - `Benefits/SurfaceElement.tsx` (CREAR)
  - `Benefits/index.tsx` (REESCRIBIR)
  - `Benefits/CTAPanel.tsx` (REESCRIBIR como zona integrada)
  - `Benefits/WatermarkStat.tsx` (ADAPTAR)
  - `Benefits/ProgressIndicator.tsx` (ADAPTAR)
  - `Benefits/BenefitPanel.tsx` (ELIMINAR)
- **Checkpoint**: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run build 2>&1 | tail -10`
- **Dependencias**: [Fase 1, Fase 2]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md
LEE todos los archivos actuales de Benefits/:
- components/sections/Benefits/index.tsx
- components/sections/Benefits/BenefitPanel.tsx
- components/sections/Benefits/CTAPanel.tsx
- components/sections/Benefits/WatermarkStat.tsx
- components/sections/Benefits/ProgressIndicator.tsx
LEE los nuevos archivos:
- components/sections/Benefits/data/surface-layout.ts
- components/sections/Benefits/hooks/useParallaxElement.ts
- components/sections/Benefits/hooks/useHorizontalScroll.ts

IMPLEMENTA:

1. **SurfaceElement.tsx** — Renderer generico:
   - Props: element (SurfaceElement), scrollYProgress (MotionValue)
   - Usa useParallaxElement(scrollYProgress, element.parallaxSpeed)
   - Wrapper: motion.div con position absolute, left/top en vw/vh, zIndex
   - Switch por element.type:
     * 'headline': h2 con font-size responsive (clamp), uppercase, font-black, tracking-tight, text-white, leading-[0.85]
     * 'image': Next.js Image con rounded-xl, shadow-2xl, rotation, border white/10
     * 'copy': p con text-white/70, max-width, leading-relaxed
     * 'stat-watermark': WatermarkStat existente (adaptar para recibir position)
     * 'stat-ticker': NumberTicker con suffix y label
     * 'badge': div decorativo (borde, icono o texto pequeno)
     * 'cta-headline': h2 centrado con "AUTOMATIZAR" en azul
     * 'cta-button': motion.button con whileHover/whileTap, gradient blue
     * 'cta-link': a tag con mailto

2. **index.tsx** — Superficie continua:
   ```tsx
   export function Benefits() {
     const { containerRef, trackRef } = useHorizontalScroll();
     const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

     return (
       <section id="benefits">
         {/* Desktop: superficie horizontal */}
         <div ref={containerRef} className="hidden md:block relative">
           <div ref={trackRef} className="relative h-screen will-change-transform"
                style={{ width: `${SURFACE_WIDTH}vw` }}>
             {surfaceElements.map(el => (
               <SurfaceElement key={el.id} element={el} scrollYProgress={scrollYProgress} />
             ))}
           </div>
           <ProgressIndicator scrollYProgress={scrollYProgress} />
         </div>

         {/* Mobile: fallback vertical */}
         <MobileBenefits />
       </section>
     );
   }
   ```

3. **WatermarkStat.tsx** — Adaptar:
   - Ahora recibe x/y como props en vez de align
   - Posicion absoluta dentro de la superficie
   - Mantener font-size, opacity, pointer-events-none

4. **ProgressIndicator.tsx** — Adaptar:
   - Cambiar de dots por panel a barra continua
   - O mantener dots pero basados en zonas (4 zonas)
   - Fijar al bottom center con position sticky/fixed dentro del container

5. **ELIMINAR BenefitPanel.tsx** — Ya no se usa

6. **CTAPanel.tsx** — ELIMINAR como archivo separado (integrado en surface-layout.ts como elementos CTA)

IMPORTANTE:
- Background uniforme bg-[#0A0A0A] en todo el surface
- Todos los elementos text-white / text-white/70
- Accent color: text-[#2563EB] (azul)
- Font: font-black uppercase para headlines
- Imágenes: rounded-xl shadow-2xl border border-white/10
- will-change-transform en el track
- NO usar position:fixed para nada dentro del track (GSAP pin ya maneja eso)

Usa /studiotek-landing-enhancer, /react-19 y /tailwind como referencia.
```

### Fase 4: Mobile Responsive

- **Agente**: @frontend
- **Archivos**:
  - `Benefits/MobileBenefits.tsx` (REESCRIBIR)
  - `Benefits/data/benefits-data.ts` (ELIMINAR — ya no se necesita)
- **Checkpoint**: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run build 2>&1 | tail -10`
- **Dependencias**: [Fase 3]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md
LEE: components/sections/Benefits/MobileBenefits.tsx
LEE: components/sections/Benefits/data/surface-layout.ts

REESCRIBE MobileBenefits.tsx:

1. Extraer datos de surfaceElements agrupados por zone
2. Layout vertical con estetica editorial:
   - Cada zona es un article con headline grande, imagen, copy, stat
   - Alternar alignment (izq/der) entre zonas para dinamismo
   - Imagenes en grid 2-col o full-width alternado
   - Headline font-size: text-[2.5rem] font-black uppercase
   - Spacing generoso entre zonas (py-16)
3. CTA al final con el mismo estilo
4. ELIMINAR Benefits/data/benefits-data.ts
5. Verificar que MobileBenefits importa de surface-layout.ts

Tambien: si prefers-reduced-motion esta activo en desktop, renderizar MobileBenefits en lugar del surface scroll. Esto se puede hacer en index.tsx con:
```tsx
const reducedMotion = useReducedMotion(); // from motion/react
// Si reduced motion, mostrar MobileBenefits incluso en desktop
{(reducedMotion) ? <MobileBenefits /> : <div className="hidden md:block">...surface...</div>}
{!reducedMotion && <div className="md:hidden"><MobileBenefits /></div>}
```

Usa /tailwind y /studiotek-landing-enhancer como referencia.
```

### Fase 5: TypeScript Check y Build

- **Agente**: @frontend
- **Archivos**: todos los modificados
- **Checkpoint**: `export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run build 2>&1 | tail -5`
- **Dependencias**: [Fase 4]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml

Ejecuta verificaciones:
1. export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
2. npx tsc --noEmit (verificar tipos)
3. npm run build (verificar build de produccion)
4. npm run lint (verificar linting)

Si hay errores, CORRIGELOS en los archivos correspondientes.

Archivos del rewrite:
- components/sections/Benefits/data/surface-layout.ts
- components/sections/Benefits/hooks/useParallaxElement.ts
- components/sections/Benefits/hooks/useHorizontalScroll.ts
- components/sections/Benefits/SurfaceElement.tsx
- components/sections/Benefits/index.tsx
- components/sections/Benefits/MobileBenefits.tsx
- components/sections/Benefits/WatermarkStat.tsx
- components/sections/Benefits/ProgressIndicator.tsx

Verificar que NO quedan imports a:
- BenefitPanel (eliminado)
- CTAPanel (eliminado)
- benefits-data.ts (eliminado)
```

### Fase 6: Review Arquitectonico

- **Agente**: @gentleman
- **Archivos**: todos los del rewrite
- **Checkpoint**: `echo 'review-complete'`
- **Dependencias**: [Fase 5]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/backend.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md

REVISA todos los archivos del rewrite de Benefits:
- components/sections/Benefits/data/surface-layout.ts
- components/sections/Benefits/hooks/useParallaxElement.ts
- components/sections/Benefits/hooks/useHorizontalScroll.ts
- components/sections/Benefits/SurfaceElement.tsx
- components/sections/Benefits/index.tsx
- components/sections/Benefits/MobileBenefits.tsx
- components/sections/Benefits/WatermarkStat.tsx
- components/sections/Benefits/ProgressIndicator.tsx

Evalua:
1. Patron data-driven: surface-layout.ts define todo el layout, componentes son renderers puros
2. Separacion GSAP (pin/scrub) vs Framer Motion (parallax/entrada) — no mezclar en mismo elemento
3. Cleanup correcto de ScrollTrigger (no killAll, solo kill del tween propio)
4. Performance: N elementos con useTransform — verificar que no hay re-renders innecesarios
5. Accesibilidad: aria-labels, reduced-motion fallback, keyboard nav
6. Mantenibilidad: agregar/quitar elementos solo requiere editar surface-layout.ts
7. Mobile fallback: funcional sin JS animations
8. Type safety: discriminated unions para SurfaceElement types

Si encuentras problemas, lista cambios necesarios.
Si esta correcto, confirma APPROVED.
```

### Fase 7: Testing Visual con Playwright

- **Agente**: @testing
- **Archivos**: ninguno (solo testing)
- **Checkpoint**: `echo 'testing-complete'`
- **Dependencias**: [Fase 6]
- **Prompt**:

```
LEE tu memoria: ai_docs/expertise/domain-experts/testing.yaml
LEE el plan: ai_docs/plans/2026-02-02_benefits-surface-vicio.md

Usa Playwright MCP para testear la seccion Benefits en:
1. iPhone SE (375x667) — layout vertical, sin horizontal scroll
2. iPhone 15 (390x844) — layout vertical
3. iPad Mini (768x1024) — superficie horizontal
4. Desktop (1920x1080) — superficie horizontal completa

Verifica por viewport:
- Benefits section es visible y renderiza contenido
- No horizontal overflow inesperado en mobile
- Headlines son legibles
- Imagenes cargan correctamente
- No errores de consola (JS errors)
- Scroll en desktop: la seccion se pinea y scrollea horizontalmente
- Elementos con parallax se mueven a velocidades distintas

Inicia servidor dev:
export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run dev
```

## Security Considerations

No aplica — cambios puramente frontend/UI sin interaccion con APIs ni datos de usuario.

## Risk Matrix

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| Performance: 20+ elementos con parallax causan jank | Media | Alto | will-change:transform, GPU layers, medir FPS con DevTools |
| CLS: imagenes sin dimensiones fijas | Alta | Medio | Definir width/height o aspect-ratio en cada imagen |
| GSAP + FM conflicto en mismo elemento | Baja | Alto | GSAP solo en track (pin/scrub), FM solo en children (parallax) |
| Mobile touch: superficie no funciona | Alta | Alto | Fallback vertical completo en MobileBenefits |
| Responsive: posiciones absolutas en vw se rompen | Media | Medio | Usar clamp() y probar en multiples viewports |
| Accesibilidad: horizontal scroll confuso | Media | Medio | aria-roledescription, reduced-motion fallback |

## Archivos Finales

### Creados
- `Benefits/data/surface-layout.ts`
- `Benefits/hooks/useParallaxElement.ts`
- `Benefits/SurfaceElement.tsx`

### Modificados
- `Benefits/index.tsx`
- `Benefits/hooks/useHorizontalScroll.ts`
- `Benefits/WatermarkStat.tsx`
- `Benefits/ProgressIndicator.tsx`
- `Benefits/MobileBenefits.tsx`

### Eliminados
- `Benefits/BenefitPanel.tsx`
- `Benefits/CTAPanel.tsx`
- `Benefits/data/benefits-data.ts`
