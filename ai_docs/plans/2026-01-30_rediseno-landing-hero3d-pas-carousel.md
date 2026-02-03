# Plan de Ejecucion: Rediseno Completo Landing - Hero 3D, Pain Points PAS, Beneficios Carousel Revolut/Blaze

> **Generado:** 2026-01-30
> **Issue:** N/A
> **Mode:** FULL
> **Complejidad:** 7/10

## Variables

```yaml
workflow_id: "2026-01-30_rediseno-landing-hero3d-pas-carousel"
branch: "feat/landing-redesign-3d-pas-carousel"
domain: frontend
agents: ["@frontend", "@testing", "@gentleman"]
estimated_files_created: 8
estimated_files_modified: 3
```

## Purpose

Rediseno visual completo de las 3 secciones principales de la landing page de StudioTek:

1. **Hero 3D**: Transformar el Hero actual (flat con grid pattern) en una experiencia inmersiva con parallax 3D basado en movimiento del raton, tilt cards con perspectiva, y aurora/mesh gradient de fondo.

2. **Pain Points PAS**: Reestructurar los Pain Points actuales (parallax scroll basico) al framework de copywriting PAS (Problem-Agitate-Solution) con animaciones scroll-driven, transiciones de color dramaticas, y reveal progresivo.

3. **Benefits Carousel Revolut/Blaze**: Reemplazar el grid 3-columnas de Beneficios con un carrusel horizontal premium estilo Revolut/Blaze con sticky header, cards grandes con scroll horizontal, momentum scrolling, y swipe en mobile.

**Restriccion clave**: No se agregan nuevas dependencias npm. Todo se implementa con Framer Motion (ya instalado) + CSS transforms.

## TDD Test Plan

### Build Tests
- `npm run build` debe pasar despues de cada fase
- `npm run lint` debe pasar en fase de integracion
- TypeScript strict mode compliance en todos los archivos nuevos

### Visual Regression (Playwright)
```typescript
// tests/landing-redesign.spec.ts
test('Hero 3D renders without errors', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
  // AI Chat input still functional
  await expect(page.locator('[data-testid="ai-chat-input"]')).toBeVisible();
});

test('PAS sections render in correct order', async ({ page }) => {
  await page.goto('/');
  const pas = page.locator('[data-section="pain-points-pas"]');
  await expect(pas).toBeVisible();
});

test('Benefits carousel scrolls horizontally', async ({ page }) => {
  await page.goto('/');
  const carousel = page.locator('[data-section="benefits-carousel"]');
  await expect(carousel).toBeVisible();
});

test('Responsive: mobile layout works at 375px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('#hero')).toBeVisible();
});
```

### Performance
- Lighthouse performance score >= 80
- CLS < 0.1
- FCP < 2s
- useReducedMotion respetado en todas las animaciones

### Accessibility
- Todos los elementos interactivos accesibles por teclado
- Carousel navegable con flechas
- aria-labels en secciones y controles
- Contraste de colores mantenido

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| 1 | Injection (XSS) | NO | Solo componentes React (JSX escaped by default) |
| 2 | Broken Auth | NO | No hay autenticacion en componentes |
| 3 | Sensitive Data | NO | No hay datos sensibles en UI |
| 4 | XXE | NO | No hay XML processing |
| 5 | Broken Access | NO | No hay control de acceso |
| 6 | Security Misconfig | BAJO | Verificar CSP con inline styles |
| 7 | XSS | BAJO | No dangerouslySetInnerHTML, solo CSS vars |
| 8 | Insecure Deserialization | NO | No hay deserialization |
| 9 | Vulnerable Components | NO | No nuevas deps |
| 10 | Insufficient Logging | NO | Frontend only |

## Architectural Review

### Approach: CSS 3D + Framer Motion (No Three.js)

**Justificacion**: Se descarta React Three Fiber (Three.js) por:
- Bundle size: Three.js agrega ~500KB+ al bundle
- Performance mobile: WebGL en mobile puede ser problematico
- Complexity: R3F requiere conocimiento especializado para mantenimiento
- Overkill: Los efectos 3D deseados son alcanzables con CSS transforms + Framer Motion

**Stack utilizado**:
- `framer-motion` (ya instalado, v12.26.2) - Animaciones, gestures, scroll-linked animations
- CSS `transform: perspective() rotateX() rotateY()` - Efecto 3D real
- CSS `will-change: transform` - GPU acceleration
- `useReducedMotion` (framer-motion) - Accesibilidad

### Component Architecture

```
Hero.tsx (MODIFY - major rewrite)
  |-- useMousePosition.ts (CREATE - custom hook)
  |-- MouseParallax.tsx (CREATE - layered parallax)
  |-- TiltCard.tsx (CREATE - 3D tilt effect)
  |-- HeroAIChat.tsx (PRESERVE - no changes)

PainPointsPAS.tsx (CREATE - replaces PainPointsParallax)
  |-- useScrollProgress.ts (CREATE - scroll tracking)
  |-- PAS data structure (inline)

BenefitsCarousel.tsx (CREATE - replaces Benefits)
  |-- RevolutCarousel.tsx (CREATE - horizontal scroll)
  |-- Benefit cards (inline)
```

## Code Structure

### CREATE:
```
hooks/useMousePosition.ts          - Mouse position tracking (x, y normalized -1 to 1)
hooks/useScrollProgress.ts         - Section scroll progress (0 to 1)
components/ui/TiltCard.tsx         - 3D tilt card with perspective + glossy reflection
components/ui/MouseParallax.tsx    - Multi-layer mouse-tracking parallax container
components/ui/RevolutCarousel.tsx  - Horizontal scroll carousel (Revolut/Blaze style)
components/sections/PainPointsPAS.tsx   - PAS-structured pain points section
components/sections/BenefitsCarousel.tsx - Benefits with carousel layout
```

### MODIFY:
```
components/sections/Hero.tsx       - Major rewrite: 3D parallax layers, aurora bg, tilt chat
app/page.tsx                       - Update imports: PainPointsParallax -> PainPointsPAS, Benefits -> BenefitsCarousel
app/globals.css                    - Add perspective utilities, scroll-snap styles
```

### PRESERVE (no changes):
```
components/ui/HeroAIChat.tsx       - AI Chat component unchanged
components/ui/ai-chat-input.tsx    - Chat input unchanged
components/sections/Header.tsx     - Header unchanged
components/sections/Footer.tsx     - Footer unchanged
```

### DEPRECATED (kept for rollback):
```
components/sections/PainPointsParallax.tsx  - Replaced by PainPointsPAS
components/sections/Benefits.tsx            - Replaced by BenefitsCarousel
```

### TESTS:
```
tests/landing-redesign.spec.ts     - Playwright visual tests (if time permits)
```

## WORKFLOW

### Phase 1: Foundation - Custom Hooks + Utility Components
**Agent:** @frontend
**Archivos CREATE:** hooks/useMousePosition.ts, hooks/useScrollProgress.ts, components/ui/TiltCard.tsx, components/ui/MouseParallax.tsx, components/ui/RevolutCarousel.tsx

**Instrucciones detalladas:**

1. **useMousePosition.ts**: Hook que retorna `{ x, y }` normalizados de -1 a 1 relativos al viewport. Debe usar `requestAnimationFrame` para throttling. En mobile/touch, retornar `{ x: 0, y: 0 }` (static). Verificar `window.matchMedia('(pointer: fine)')` para detectar mouse vs touch.

2. **useScrollProgress.ts**: Hook que recibe un `ref` y retorna progress de 0 a 1 basado en cuanto del elemento es visible. Usar `IntersectionObserver` + scroll event para precision. Retornar `{ progress, isInView }`.

3. **TiltCard.tsx**: Componente wrapper que aplica `perspective(1000px)` y calcula `rotateX/rotateY` basado en posicion del mouse dentro del card (max 10deg). Props: `children, className, maxTilt?, perspective?, glareEffect?`. Incluir efecto glossy/glare que se mueve con el tilt. Respetar `useReducedMotion`.

4. **MouseParallax.tsx**: Container con multiples capas a diferentes profundidades. Props: `children, layers: { children, depth: number }[]`. Cada layer se desplaza `depth * mousePosition * maxOffset`. Depth 0 = static, depth 1 = maximo movimiento.

5. **RevolutCarousel.tsx**: Carousel horizontal con:
   - Contenedor con `overflow-x: auto` + `scroll-snap-type: x mandatory`
   - Cards con `scroll-snap-align: center`
   - Drag gesture de framer-motion para momentum
   - Progress indicator (dots o barra)
   - Props: `items: ReactNode[], className?`
   - Mobile: swipeable con framer-motion drag
   - Desktop: scroll horizontal + botones prev/next opcionales
   - Card activa (centro viewport) se escala slightly (1.02)

**Checkpoint:** `npm run build` -> Build successful, no TypeScript errors

---

### Phase 2: Hero 3D Redesign
**Agent:** @frontend
**Archivos MODIFY:** components/sections/Hero.tsx

**Instrucciones detalladas:**

1. **Background**: Reemplazar `AnimatedGridPattern` con aurora/mesh gradient:
   - 3-4 gradient blobs animados (framer-motion `animate` con loop)
   - Colores: blue-600/30, cyan-500/20, indigo-500/25, violet-500/15
   - Blur alto (blur-3xl), mix-blend-screen
   - Movimiento lento y organico (duration: 8-12s, ease: "easeInOut")

2. **Parallax layers**: Envolver contenido en `MouseParallax`:
   - Layer 0 (bg): Aurora blobs (depth: 0.3)
   - Layer 1 (decoration): OrbitingCircles existentes (depth: 0.5)
   - Layer 2 (content): Texto h1 + bullets (depth: 0.1 - muy sutil)
   - Layer 3 (foreground): Trust indicators (depth: 0.15)

3. **AI Chat con TiltCard**: Envolver `HeroAIChat` en `TiltCard`:
   - maxTilt: 8 (sutil, no mareo)
   - Agregar borde glossy que refleja con el tilt
   - Sombra que se ajusta con la inclinacion
   - En mobile: sin tilt, solo hover glow

4. **Floating 3D elements**: Agregar 2-3 decorative panels flotantes:
   - Pequenos cards translucidos con glass-morphism
   - Rotacion lenta en Y (3D rotate)
   - Posiciones: top-left, bottom-right, mid-right
   - Contenido: icono + texto breve (ej: "24/7", "IA", "40%")
   - Opacity: 0.3-0.5, no deben distraer del contenido principal

5. **Mantener intacto**: HeroAIChat component, contenido textual, trust indicators, links/CTAs

**Checkpoint:** `npm run build` -> Build successful

---

### Phase 3: Pain Points PAS (Problem-Agitate-Solution)
**Agent:** @frontend
**Archivos CREATE:** components/sections/PainPointsPAS.tsx

**Instrucciones detalladas:**

**Data structure** - 3 PAS blocks (reducido de 4 a 3 para impacto):

```
PAS Block 1: "Tiempo perdido"
- PROBLEM: "Pierdes 15+ horas/semana en tareas repetitivas"
- AGITATE: "Son 780 horas al ano. El equivalente a 3.5 meses de trabajo. Mientras, tu competencia automatiza y crece."
- SOLUTION: "Automatiza y recupera ese tiempo para lo que importa: hacer crecer tu negocio."

PAS Block 2: "Clientes perdidos"
- PROBLEM: "Pierdes clientes fuera de horario"
- AGITATE: "El 60% de consultas llegan fuera del horario laboral. Cada una sin responder es dinero perdido y un cliente que se va a la competencia."
- SOLUTION: "Un asistente IA atiende 24/7, cualifica leads y cierra citas mientras duermes."

PAS Block 3: "Equipo quemado"
- PROBLEM: "Tu equipo esta saturado con tareas repetitivas"
- AGITATE: "Empleados quemados cometen mas errores, rinden menos y terminan yendose. El coste de reemplazar un empleado es 6-9 meses de su salario."
- SOLUTION: "Elimina las tareas que drenan a tu equipo. La IA se encarga de lo repetitivo, tu equipo de lo estrategico."
```

**Layout**:
- Section con fondo dark (slate-950)
- Titulo de seccion: "Tu negocio esta perdiendo dinero... ahora mismo" (o similar impactante)
- Cada PAS block es un full-width container con 3 fases reveladas por scroll:
  - **P**: Visible inmediatamente. Tipografia grande, bold, color blanco. Icono lucide a la izquierda.
  - **A**: Se revela al hacer scroll. Color de acento cambia a amber/red. Texto con estadisticas en bold. Efecto de "shake" sutil en el numero clave.
  - **S**: Se revela ultimo. Transicion visual: color cambia a emerald/cyan. Fondo se aclara ligeramente. CTA button sutil "Ver como" que scrollea a #contact.

**Animaciones** (framer-motion):
- useScrollProgress para detectar progreso dentro de cada PAS block
- BlurFade para entrada de cada fase (P -> A -> S)
- Cambio de color de acento animado (P:white -> A:amber -> S:emerald)
- Numbers que hacen "count up" al ser visibles (ej: "780 horas")
- Separadores visuales entre blocks (gradient line)

**Responsive**:
- Desktop: Contenido centrado, max-w-4xl
- Tablet: Igual pero texto mas pequeno
- Mobile: Texto full-width con padding

**Accesibilidad**:
- Todas las animaciones respetan useReducedMotion
- Texto completo en HTML (no solo animacion)
- aria-label en la seccion

**Checkpoint:** `npm run build` -> Build successful

---

### Phase 4: Benefits Carousel Revolut/Blaze
**Agent:** @frontend
**Archivos CREATE:** components/sections/BenefitsCarousel.tsx

**Instrucciones detalladas:**

**Data** - Mismos 3 beneficios pero con visual enriquecido:
```
1. "Ahorra 2.500 euros/mes" - gradient blue-cyan, icono TrendingDown
2. "Atiende 3x mas clientes" - gradient purple-pink, icono Users
3. "Nunca pierdas un cliente" - gradient orange-red, icono Clock
```

**Layout - Sticky Header + Horizontal Scroll (Revolut style)**:
- Section con titulo sticky en el top mientras se scrollea
- Titulo: "El ROI de automatizar con IA" (mantener)
- Subtitulo: "Numeros reales de clientes como tu"
- Debajo: RevolutCarousel con 3 cards grandes

**Card design (cada card)**:
- Dimensiones: ~380px ancho x ~480px alto (desktop)
- Fondo: gradient sutil del color del beneficio
- Top area: Icono grande (48px) con glow del color del gradient
- Headline: Texto bold 2xl con el titulo del beneficio
- Body: Descripcion del beneficio
- Stat highlight: Numero grande (ej "40%", "3x", "24/7") con NumberTicker animado
- Bottom: CTA button con shimmer (reutilizar ShimmerButton existente)
- Hover: lift (translateY -8px) + glow shadow
- Border: 1px white/10 con hover white/20
- Glass-morphism: backdrop-blur

**Interaccion**:
- Desktop: Scroll horizontal con mouse wheel (transform scroll vertical en horizontal)
- Mobile: Swipe horizontal nativo + framer-motion drag
- Cards se escalan al entrar en el centro del viewport
- Progress dots debajo sincronizados con scroll

**Checkpoint:** `npm run build` -> Build successful

---

### Phase 5: Integration + Styling
**Agent:** @frontend
**Archivos MODIFY:** app/page.tsx, app/globals.css

**Instrucciones:**

1. **page.tsx**: Actualizar imports y secuencia:
   ```tsx
   // ANTES
   import { PainPointsParallax } from '@/components/sections/PainPointsParallax';
   import { Benefits } from '@/components/sections/Benefits';

   // DESPUES
   import { PainPointsPAS } from '@/components/sections/PainPointsPAS';
   import { BenefitsCarousel } from '@/components/sections/BenefitsCarousel';
   ```

   Orden de secciones (mantener):
   1. Hero (redesigned)
   2. PainPointsPAS (replaces PainPointsParallax)
   3. BenefitsCarousel (replaces Benefits)
   4. Services (unchanged)
   5. HowItWorks (unchanged)
   6. Stats (unchanged)
   7. ContactForm (unchanged)

2. **globals.css**: Agregar utilidades si son necesarias:
   - `perspective` utility classes
   - `scroll-snap` styles para carousel
   - `will-change: transform` para elementos 3D
   - Aurora gradient keyframes

**Checkpoint:** `npm run build && npm run lint` -> Both pass

---

### Phase 6: Build Validation + Visual QA
**Agent:** @testing
**Instrucciones:**

1. Ejecutar `npm run build` - verificar build exitoso
2. Ejecutar `npm run lint` - verificar sin errores
3. Verificar que las secciones antiguas (PainPointsParallax, Benefits) no se importan en ningun lado
4. Verificar responsive:
   - 375px (iPhone SE)
   - 768px (iPad)
   - 1024px (laptop)
   - 1440px (desktop)
5. Verificar que HeroAIChat sigue funcional
6. Verificar que useReducedMotion desactiva animaciones 3D

**Checkpoint:** `npm run build` -> PASSED

---

### Phase 7 (FINAL): Code Review
**Agent:** @gentleman

**Instrucciones:**

Review arquitectonico de todos los cambios:

1. **Consistencia**: Todos los nuevos componentes siguen el design system existente (colores, spacing, tipografia)
2. **Performance**: No hay re-renders innecesarios, requestAnimationFrame para mouse tracking, will-change aplicado
3. **Accesibilidad**: aria-labels, keyboard navigation, useReducedMotion
4. **Mantenibilidad**: Componentes reutilizables (TiltCard, MouseParallax, RevolutCarousel)
5. **SEO**: Contenido textual preservado/mejorado, no hidden behind JS-only animations
6. **Mobile**: Touch-friendly, no mouse-dependent interactions

Verdict: APPROVED | NEEDS_REVISION | REJECTED

**Checkpoint:** `echo APPROVED` -> APPROVED

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| 3D animations janky on mobile | HIGH | MEDIUM | useReducedMotion, disable parallax on touch, GPU transforms only |
| HeroAIChat breaks after redesign | HIGH | LOW | Component unchanged, only container modified |
| Bundle size bloat | MEDIUM | LOW | No new npm deps, all CSS/Framer Motion |
| SEO copy quality drops | MEDIUM | LOW | Same keywords preserved, PAS improves engagement |
| Carousel accessibility | MEDIUM | MEDIUM | aria-labels, keyboard nav, focus management |
| Scroll-snap conflicts | LOW | MEDIUM | Scoped to carousel container only |
| TypeScript build errors | LOW | LOW | Strict typing, incremental builds |
| Visual regression in other sections | MEDIUM | LOW | Sections 4-7 unchanged, isolated changes |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | 1 - Foundation | Build pasa, hooks + components creados | `npm run build` |
| CP2 | 2 - Hero 3D | Build pasa, Hero reescrito | `npm run build` |
| CP3 | 3 - PAS | Build pasa, PainPointsPAS creado | `npm run build` |
| CP4 | 4 - Carousel | Build pasa, BenefitsCarousel creado | `npm run build` |
| CP5 | 5 - Integration | Build + lint pasan | `npm run build && npm run lint` |
| CP6 | 6 - QA | Build pasa, visual check ok | `npm run build` |
| CP7 | FINAL - Review | Review aprobado | `echo APPROVED` |

---
*Generado por /plan-task v5.0 - 2026-01-30*
