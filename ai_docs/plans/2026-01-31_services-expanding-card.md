# PLAN: Expanding Card Section - Services.tsx (v3.0)

## Purpose

Implementar un efecto visual "Expanding Card" en la seccion Services de StudioTek. Un overlay oscuro con `clip-path: inset()` comienza recortado (mostrando una hero card de fondo grande) y se expande hasta cubrir la pantalla completa, revelando un grid de 3 cards de servicio. Las cards laterales hacen slide-in simultaneo. El efecto se controla con GSAP ScrollTrigger + scrub vinculado al scroll.

> **Dominio:** Frontend
> **Prioridad:** P1 - Visual Enhancement
> **Complejidad:** 8/10 (animacion multicapa sincronizada con scroll)
> **Skill:** studiotek-landing-enhancer

---

## Contexto

### Tecnica Hibrida: clip-path + transforms

**Approach v3.0 (validado por @gentleman + @frontend):**

El efecto combina DOS capas animadas independientes:

1. **Capa 0 - Hero card de fondo**: Una `HeroServiceCard` (componente nuevo, sin Framer Motion) renderizada a tamano grande centrada. Visible a traves de la abertura del clip-path.
2. **Capa 1 - Overlay con clip-path**: Un `div bg-slate-950` con `clip-path: inset(15% 20% 10% 20% round 24px)` que se anima a `inset(0%)`. DENTRO del overlay esta el grid final de 3 cards (CarouselCard normales) + titulo de seccion.

**Por que clip-path y NO scale/Flip:**

| Tecnica | Problema | Referencia |
|---------|----------|------------|
| `transform: scale()` | Rasteriza contenido a escala 1 y estira -- texto borroso, imagenes pixeladas | frontend.yaml SL-learning clip-path |
| GSAP Flip | `getBoundingClientRect()` calcula una vez -- fragil con scrub + pin + resize | frontend.yaml SL-learning Flip fragil |
| `clip-path: inset()` | Renderiza a tamano completo, solo recorta. border-radius incluido en `round` | **ELEGIDO** |

**Decisiones de revision:**

| Fuente | Decision | Motivo |
|--------|----------|--------|
| @gentleman | NO usar GSAP Flip | Fragil con scroll continuo + invalidateOnRefresh no refresca snapshot |
| @gentleman | NO modificar CarouselCard.tsx | Composicion sobre modificacion -- evitar conflicto GSAP/Framer Motion |
| @frontend | Transform manual con GSAP timeline | Mas robusto que Flip para scroll-driven animations |
| @frontend | Cards siempre en grid flow | NUNCA cambiar position -- solo transform y opacity |
| @frontend | Separar wrapper GSAP del inner Framer Motion | Dos libraries en el mismo DOM element = conflicto en `transform` |
| @frontend | invalidateOnRefresh con funciones como valores | Funciona nativamente sin hooks adicionales |

### Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| `clip-path: inset()` | 55+ | 10+ | 54+ | 79+ |
| `clip-path` con `round` | 99+ | 16.4+ | 97+ | 99+ |
| GSAP ScrollTrigger + pin | Todos | Todos | Todos | Todos |

**Fallback para Safari < 16.4**: Sin `round`, el clip-path funciona pero sin border-radius animado. Aceptable.

### Patron GSAP Existente (useHorizontalScroll.ts)

```typescript
// Patron CONFIRMADO que funciona en produccion:
gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  const tween = gsap.to(ref.current, {
    scrollTrigger: {
      trigger: containerRef.current,
      pin: true,
      scrub: 1,
      end: () => `+=${distance}`,  // Funcion para invalidateOnRefresh
      invalidateOnRefresh: true,
    },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}, { scope: containerRef, dependencies: [numPanels] });
```

### Estructura de Cards (3 en total)

| Index | Posicion | Titulo | Categoria | Imagen | Animacion |
|-------|----------|--------|-----------|--------|-----------|
| 0 | Izquierda | Consultoria Estrategica | ESTRATEGIA | service-consultoria.webp | slideInLeft + fadeIn |
| 1 | Centro (HERO) | Implementacion de IA | DESARROLLO | service-implementacion-ia.webp | Visible como fondo, luego como CarouselCard normal |
| 2 | Derecha | Formacion y Capacitacion | EDUCACION | service-formacion.webp | slideInRight + fadeIn |

**Eliminadas:** IA Personalizada (la 4a card del grid actual). El expanding card funciona con 3 cards para simetria visual.

---

## Variables

### Archivos

| Tipo | Archivo | Descripcion |
|------|---------|-------------|
| **Nuevo** | `components/ui/HeroServiceCard.tsx` | Card hero sin Framer Motion, tamano grande, decorativa |
| **Nuevo** | `hooks/useExpandingCard.ts` | Hook GSAP con timeline + ScrollTrigger |
| **Modificar** | `components/sections/Services.tsx` | Refactor con estructura de capas |
| **NO modificar** | `components/ui/CarouselCard.tsx` | Se reutiliza tal cual en el grid del overlay |
| **NO modificar** | `components/ui/ServiceModal.tsx` | Portal sin cambios |

### Imagenes Existentes

Las imagenes ya existen en `public/images/generated/`:

| Servicio | Archivo | Formato | Uso |
|----------|---------|---------|-----|
| Implementacion (Hero) | `service-implementacion-ia.webp` | WebP | HeroServiceCard + CarouselCard |
| Consultoria | `service-consultoria.webp` | WebP | CarouselCard lateral izquierda |
| Formacion | `service-formacion.webp` | WebP | CarouselCard lateral derecha |

**Nota:** Si se necesitan imagenes nuevas con estilo mas premium, usar `/landing-image-generator` con los siguientes prompts:

1. **service-implementacion-ia-hero.webp** (Hero grande):
   - Prompt: "Isometric 3D visualization of AI implementation, holographic neural networks connecting business processes, dark navy blue background (#0f172a), glowing cyan and blue accents, floating glass panels with code and data charts, futuristic corporate tech aesthetic, cinematic lighting, 8K quality, no text labels"
   - Resolucion: 1600x1200 (4:3 para fondo grande)
   - Quality: 85

2. **service-consultoria.webp** (lateral):
   - Prompt: "Isometric 3D visualization of strategic consulting, executive team analyzing holographic business charts, dark navy blue background (#0f172a), golden and amber accent lighting, floating strategy roadmaps, premium corporate aesthetic, cinematic lighting, 8K quality, no text labels"
   - Resolucion: 1200x1600 (3:4)

3. **service-formacion.webp** (lateral):
   - Prompt: "Isometric 3D visualization of AI training and education, professionals interacting with holographic learning interfaces, dark navy blue background (#0f172a), green and teal accent lighting, floating books and knowledge transfer diagrams, modern educational tech aesthetic, cinematic lighting, 8K quality, no text labels"
   - Resolucion: 1200x1600 (3:4)

### Breakpoints

| Nombre | Width | Comportamiento |
|--------|-------|----------------|
| Mobile | < 768px | Sin expanding card -- grid vertical con 3 cards (fallback estatico) |
| Tablet | 768px - 1023px | clip-path con inset mas cerrado, scroll distance menor |
| Desktop | >= 1024px | Efecto completo: clip-path + side cards + titulo |

### Constantes de Animacion

```typescript
const ANIMATION_CONFIG = {
  // clip-path: inset(top right bottom left round radius)
  clipPath: {
    mobile: 'inset(0%)',  // Sin efecto en mobile
    tablet: {
      closed: 'inset(12% 15% 8% 15% round 20px)',
      open: 'inset(0% 0% 0% 0% round 0px)',
    },
    desktop: {
      closed: 'inset(15% 20% 10% 20% round 24px)',
      open: 'inset(0% 0% 0% 0% round 0px)',
    },
  },

  // Scroll distance por viewport
  scrollEnd: {
    tablet: '+=120vh',
    desktop: '+=150vh',
  },

  // Side cards transform
  sideCards: {
    left: { xFrom: -120, xTo: 0 },
    right: { xFrom: 120, xTo: 0 },
    opacityFrom: 0,
    opacityTo: 1,
  },

  // Hero bg fade
  heroBg: {
    opacityFrom: 1,
    opacityTo: 0,
  },

  // Title fade
  title: {
    opacityFrom: 0,
    opacityTo: 1,
    yFrom: 30,
    yTo: 0,
  },

  // Easing
  ease: 'power2.inOut',
} as const;
```

### Z-index Layers

| Capa | z-index | Contenido |
|------|---------|-----------|
| Capa 0 | `z-0` | HeroServiceCard (fondo grande, decorativa) |
| Capa 1 | `z-10` | Overlay con clip-path (bg-slate-950 + grid de cards + titulo) |
| Capa 2 | `z-50` | ServiceModal portal (sin cambios) |

---

## Code Structure

### Arquitectura de Capas

```
Services.tsx (refactored v3)
├── <section ref={sectionRef} id="services" className="relative h-screen">
│
│   ├── CAPA 0: Hero card de fondo (z-0)
│   │   └── <div ref={bgHeroRef} className="absolute inset-0 z-0 flex items-center justify-center">
│   │       └── <HeroServiceCard card={heroCardData} />
│   │
│   ├── CAPA 1: Overlay con clip-path (z-10)
│   │   └── <div ref={overlayRef} className="absolute inset-0 z-10 bg-slate-950">
│   │       ├── Background gradient (decorativo)
│   │       ├── Titulo seccion (ref={titleRef})
│   │       └── Grid 3 cards:
│   │           ├── Card 0: Consultoria (ref={sideCardLeftRef}) ← CarouselCard
│   │           ├── Card 1: Implementacion ← CarouselCard (normal, sin ref extra)
│   │           └── Card 2: Formacion (ref={sideCardRightRef}) ← CarouselCard
│   │
│   └── ServiceModal portal (sin cambios, z-50)
│
├── Hook: useExpandingCard.ts
│   ├── Refs: sectionRef, overlayRef, bgHeroRef, sideCardLeftRef, sideCardRightRef, titleRef
│   ├── getBreakpointConfig() → responsive clip-path + scroll distance
│   ├── GSAP timeline con ScrollTrigger (pin, scrub: 1)
│   │   ├── 0%-80%: overlay clipPath closed → open
│   │   ├── 40%-70%: bgHero opacity 1 → 0
│   │   ├── 30%-80%: side cards x/opacity transforms
│   │   └── 60%-100%: titulo opacity/y fade in
│   └── Cleanup granular (timeline.scrollTrigger?.kill() + timeline.kill())
│
└── HeroServiceCard.tsx (NUEVO)
    ├── Sin Framer Motion (sin motion.div, sin whileHover/whileTap)
    ├── Comparte CardData interface de CarouselCard
    ├── Renderiza: categoria, titulo, imagen (Next.js Image fill)
    ├── aria-hidden="true" (decorativo)
    └── Tamaño grande: w-[60vw] max-w-[600px] aspect-[3/4]
```

### Estados Visuales

**ESTADO INICIAL (scroll: 0%) -- Se ve la hero card a traves del clip-path "ventana"**

```
┌──────────────────────────────────────────────┐
│                                              │  ← section (h-screen, pinned)
│         ░░░░░░░░░░░░░░░░░░░░░░░░░          │  ← overlay bg-slate-950
│         ░░┌──────────────────┐░░░░          │     clip-path: inset(15% 20% 10% 20%)
│         ░░│                  │░░░░          │
│         ░░│  IMPLEMENTACION  │░░░░          │  ← HeroServiceCard (z-0)
│         ░░│      DE IA       │░░░░          │     visible a traves de la ventana
│         ░░│                  │░░░░          │
│         ░░│  [imagen grande] │░░░░          │
│         ░░│                  │░░░░          │
│         ░░└──────────────────┘░░░░          │
│         ░░░░░░░░░░░░░░░░░░░░░░░░░          │
│                                              │
│   (overlay OCULTA las cards del grid)        │
│   (side cards: opacity 0, x offset)          │
│   (titulo: opacity 0)                        │
└──────────────────────────────────────────────┘
```

**TRANSICION (scroll: 50%)**

```
┌──────────────────────────────────────────────┐
│                                              │
│       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░         │  ← overlay expandiendose
│       ░░┌─────────────────────────┐░        │     clip-path: inset(7% 10% 5% 10%)
│       ░░│                         │░        │
│       ░░│    ┌────┐ ┌────┐ ┌────┐ │░        │  ← grid empezando a verse
│       ░░│    │CON │ │IMP │ │FOR │ │░        │     side cards: opacity 0.5, x parcial
│       ░░│    │SUL │ │LEM │ │MAC │ │░        │
│       ░░│    │(50)│ │ENT │ │(50)│ │░        │
│       ░░│    └────┘ │    │ └────┘ │░        │
│       ░░│           └────┘        │░        │
│       ░░└─────────────────────────┘░        │
│       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░         │
│                                              │
│   (hero bg fading out: opacity 0.3)          │
└──────────────────────────────────────────────┘
```

**ESTADO FINAL (scroll: 100%)**

```
┌──────────────────────────────────────────────┐
│                                              │  ← overlay: clip-path inset(0%)
│         Nuestros Servicios                   │     (cubre toda la pantalla)
│   Automatizacion real para negocios          │
│                                              │  ← titulo: opacity 1
│    ┌──────┐  ┌──────┐  ┌──────┐             │
│    │ CON  │  │ IMP  │  │ FOR  │             │  ← grid 3 cards
│    │ SUL  │  │ LEM  │  │ MAC  │             │     (CarouselCard normales)
│    │ TO   │  │ ENT  │  │ ION  │             │
│    │ RIA  │  │ACION │  │      │             │
│    └──────┘  └──────┘  └──────┘             │
│                                              │
│   (hero bg: opacity 0, invisible)            │
└──────────────────────────────────────────────┘
```

### Timeline de Animacion

```
SCROLL PROGRESS:
0%────────30%────────60%────────80%────────100%
[═══ clip-path expand ════════════════════]  overlay: inset(closed) → inset(0%)
         [══ side cards fade in ═══════]    left/right: x(±120) op(0) → x(0) op(1)
              [══ hero bg fade out ═══]     bgHero: opacity 1 → 0
                   [═══ title fade in ══]   titulo: opacity 0 y(30) → opacity 1 y(0)
```

**En GSAP timeline (position parameter):**

```typescript
tl.to(overlayRef, { clipPath: open }, 0)           // 0-80% del timeline
  .to(bgHeroRef, { opacity: 0 }, 0.4)              // 40-70%
  .to(sideCardLeftRef, { x: 0, opacity: 1 }, 0.3)  // 30-80%
  .to(sideCardRightRef, { x: 0, opacity: 1 }, 0.3) // 30-80%
  .to(titleRef, { opacity: 1, y: 0 }, 0.6);        // 60-100%
```

---

## Instructions

### Fase 1: HeroServiceCard Component

**Archivo:** `components/ui/HeroServiceCard.tsx`

**Proposito:** Renderizar la card hero a tamano grande detras del overlay. Es puramente decorativa (visible a traves del recorte clip-path). NO usa Framer Motion para evitar conflicto con GSAP.

```tsx
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { CardData } from '@/components/ui/CarouselCard';

interface HeroServiceCardProps {
  card: CardData;
  className?: string;
}

/**
 * HeroServiceCard - Decorative large card for expanding card background.
 *
 * Renders a large version of a service card WITHOUT Framer Motion.
 * Visible through the clip-path "window" of the overlay.
 * Uses CardData interface from CarouselCard for data consistency.
 *
 * IMPORTANT: No motion.div, no whileHover, no whileTap.
 * GSAP controls this element's opacity via ref from parent.
 */
export function HeroServiceCard({ card, className }: HeroServiceCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative flex flex-col',
        'w-[55vw] max-w-[550px] aspect-[3/4]',
        'md:w-[50vw] md:max-w-[500px]',
        'lg:w-[40vw] lg:max-w-[600px]',
        'rounded-3xl bg-black overflow-hidden',
        'shadow-2xl shadow-black/60',
        'pointer-events-none select-none',
        className
      )}
    >
      {/* Category + Title */}
      <div className="relative z-10 p-6 pt-8 md:p-8 md:pt-10">
        <p className="text-[11px] md:text-xs text-slate-400 uppercase tracking-widest font-medium mb-2">
          {card.category}
        </p>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
          {card.title}
        </h3>
      </div>

      {/* Image */}
      <div className="relative flex-1 overflow-hidden">
        {card.image ? (
          <>
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(max-width: 768px) 55vw, (max-width: 1024px) 50vw, 40vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />
          </>
        ) : (
          <div className={cn('absolute inset-0 bg-gradient-to-br', card.gradient)} />
        )}
      </div>
    </div>
  );
}
```

**Notas clave:**
- `aria-hidden="true"` porque es decorativo (el contenido real esta en las CarouselCards del grid)
- `pointer-events-none select-none` para no interferir con interacciones del overlay
- `priority` en la imagen porque es visible al entrar a la seccion
- Sin `motion.div` -- GSAP anima la opacidad via el ref del wrapper padre
- Responsive: mas pequena en mobile/tablet, mas grande en desktop

---

### Fase 2: Hook useExpandingCard

**Archivo:** `hooks/useExpandingCard.ts`

**Proposito:** Encapsular toda la logica GSAP (timeline + ScrollTrigger) para el efecto expanding card. Sigue el MISMO patron que `useHorizontalScroll.ts`.

```typescript
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseExpandingCardReturn {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  bgHeroRef: React.RefObject<HTMLDivElement | null>;
  sideCardLeftRef: React.RefObject<HTMLDivElement | null>;
  sideCardRightRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLDivElement | null>;
}

interface BreakpointConfig {
  clipPathClosed: string;
  clipPathOpen: string;
  scrollEnd: string;
  sideCardXOffset: number;
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// Register Plugin (idempotent)
// ---------------------------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Breakpoint Config
// ---------------------------------------------------------------------------

function getBreakpointConfig(): BreakpointConfig {
  if (typeof window === 'undefined') {
    return {
      clipPathClosed: 'inset(0%)',
      clipPathOpen: 'inset(0%)',
      scrollEnd: '+=0',
      sideCardXOffset: 0,
      enabled: false,
    };
  }

  const width = window.innerWidth;

  if (width < 768) {
    // Mobile: no expanding card effect
    return {
      clipPathClosed: 'inset(0%)',
      clipPathOpen: 'inset(0%)',
      scrollEnd: '+=0',
      sideCardXOffset: 0,
      enabled: false,
    };
  }

  if (width < 1024) {
    // Tablet
    return {
      clipPathClosed: 'inset(12% 15% 8% 15% round 20px)',
      clipPathOpen: 'inset(0% 0% 0% 0% round 0px)',
      scrollEnd: `+=${window.innerHeight * 1.2}`,
      sideCardXOffset: 80,
      enabled: true,
    };
  }

  // Desktop
  return {
    clipPathClosed: 'inset(15% 20% 10% 20% round 24px)',
    clipPathOpen: 'inset(0% 0% 0% 0% round 0px)',
    scrollEnd: `+=${window.innerHeight * 1.5}`,
    sideCardXOffset: 120,
    enabled: true,
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useExpandingCard(): UseExpandingCardReturn {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgHeroRef = useRef<HTMLDivElement>(null);
  const sideCardLeftRef = useRef<HTMLDivElement>(null);
  const sideCardRightRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !sectionRef.current ||
      !overlayRef.current ||
      !bgHeroRef.current ||
      !sideCardLeftRef.current ||
      !sideCardRightRef.current ||
      !titleRef.current
    ) {
      return;
    }

    const config = getBreakpointConfig();

    // Mobile: no animation
    if (!config.enabled) return;

    // Set initial states
    gsap.set(overlayRef.current, { clipPath: config.clipPathClosed });
    gsap.set(bgHeroRef.current, { opacity: 1 });
    gsap.set(sideCardLeftRef.current, { x: -config.sideCardXOffset, opacity: 0 });
    gsap.set(sideCardRightRef.current, { x: config.sideCardXOffset, opacity: 0 });
    gsap.set(titleRef.current, { opacity: 0, y: 30 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => config.scrollEnd,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1: Overlay clip-path expands (0% - 80% of timeline)
    tl.to(
      overlayRef.current,
      {
        clipPath: config.clipPathOpen,
        duration: 0.8,
        ease: 'power2.inOut',
      },
      0
    );

    // Phase 2: Side cards fade in (30% - 80% of timeline)
    tl.to(
      sideCardLeftRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.3
    );

    tl.to(
      sideCardRightRef.current,
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      0.3
    );

    // Phase 3: Hero background fades out (40% - 70% of timeline)
    tl.to(
      bgHeroRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
      },
      0.4
    );

    // Phase 4: Title fades in (60% - 100% of timeline)
    tl.to(
      titleRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      },
      0.6
    );

    // Cleanup - only kill THIS ScrollTrigger and timeline
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: sectionRef, dependencies: [] });

  return {
    sectionRef,
    overlayRef,
    bgHeroRef,
    sideCardLeftRef,
    sideCardRightRef,
    titleRef,
  };
}
```

**Notas clave:**
- Mismo patron que `useHorizontalScroll.ts`: `useGSAP` con scope, cleanup granular
- `getBreakpointConfig()` es una funcion (no constante) para que `invalidateOnRefresh` la re-evalua
- `enabled: false` en mobile para no crear ScrollTrigger innecesario
- Los valores de `clipPath` usan `round` para animar el border-radius como parte del inset
- El `end` usa funcion para soportar `invalidateOnRefresh` en resize
- Cleanup mata SOLO este ScrollTrigger, no `ScrollTrigger.killAll()`

---

### Fase 3: Services.tsx Refactor (Estructura de Capas)

**Archivo:** `components/sections/Services.tsx`

**Proposito:** Refactorizar el componente para implementar la estructura de 3 capas. Reduce de 4 a 3 cards de servicio.

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rocket, Lightbulb, GraduationCap } from 'lucide-react';
import { CarouselCard, CardData } from '@/components/ui/CarouselCard';
import { HeroServiceCard } from '@/components/ui/HeroServiceCard';
import { ServiceModal } from '@/components/ui/ServiceModal';
import { useExpandingCard } from '@/hooks/useExpandingCard';

// ---------------------------------------------------------------------------
// Services Data (3 cards)
// ---------------------------------------------------------------------------

const services = [
  {
    title: 'Consultoria Estrategica',
    description:
      'Analizamos tu negocio y disenamos un plan de automatizacion con ROI claro. Sabras cuanto ahorraras antes de empezar.',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-600',
    category: 'Estrategia',
    features: [
      'Auditoria completa de procesos',
      'Identificacion de cuellos de botella',
      'Roadmap de implementacion',
      'Calculo de ROI proyectado',
      'Priorizacion de iniciativas',
      'Benchmarking con tu sector',
    ],
    benefits: ['Claridad sobre donde invertir', 'Decisiones basadas en datos'],
    shimmerGradient: { from: '#f59e0b', to: '#ea580c' },
    image: '/images/generated/service-consultoria.webp',
  },
  {
    title: 'Implementacion de IA',
    description:
      'Chatbots WhatsApp con IA, reservas automaticas y flujos sin intervencion. Para clinicas, barberias, estudios de tatuaje e inmobiliarias.',
    icon: Rocket,
    gradient: 'from-blue-600 to-indigo-600',
    category: 'Desarrollo',
    features: [
      'Chatbots con IA conversacional',
      'Automatizacion de procesos repetitivos',
      'Integraciones con tu stack existente',
      'Dashboards en tiempo real',
      'APIs personalizadas',
      'Soporte tecnico 24/7',
    ],
    benefits: ['Reduce 70% el tiempo en tareas manuales', 'Disponibilidad 24/7'],
    shimmerGradient: { from: '#2563eb', to: '#4f46e5' },
    image: '/images/generated/service-implementacion-ia.webp',
  },
  {
    title: 'Formacion y Capacitacion',
    description:
      'Tu equipo domina la IA en dias, no meses. Formacion practica con casos reales de salud, belleza e inmobiliaria.',
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-600',
    category: 'Educacion',
    features: [
      'Workshops practicos hands-on',
      'Certificaciones oficiales',
      'Material actualizado',
      'Sesiones de seguimiento',
      'Casos de uso reales del sector',
      'Soporte post-formacion',
    ],
    benefits: ['Equipo autonomo y capacitado', 'Adopcion rapida'],
    shimmerGradient: { from: '#10b981', to: '#0d9488' },
    image: '/images/generated/service-formacion.webp',
  },
];

// ---------------------------------------------------------------------------
// Transform to CardData format
// ---------------------------------------------------------------------------

const servicesCardData: CardData[] = services.map((service) => ({
  title: service.title,
  category: service.category,
  gradient: service.gradient,
  icon: service.icon,
  image: service.image,
  content: (
    <div className="space-y-6">
      <p className="text-slate-200 text-lg leading-relaxed">{service.description}</p>

      {service.benefits && (
        <div className="flex flex-wrap gap-3">
          {service.benefits.map((benefit: string) => (
            <span
              key={benefit}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20"
            >
              {benefit}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold text-white text-lg">Que incluye?</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`,
                }}
              />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 min-h-[44px] rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          style={{
            background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})`,
          }}
        >
          Solicitar informacion
        </button>
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 min-h-[44px] rounded-xl font-semibold text-white transition-all duration-300 hover:bg-white/10 border border-white/20"
        >
          Agendar llamada
        </button>
      </div>
    </div>
  ),
}));

// Hero card data (index 1 = Implementacion de IA)
const heroCardData = servicesCardData[1];

// Indices: 0=Consultoria(left), 1=Implementacion(hero/center), 2=Formacion(right)
const HERO_INDEX = 1;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const {
    sectionRef,
    overlayRef,
    bgHeroRef,
    sideCardLeftRef,
    sideCardRightRef,
    titleRef,
  } = useExpandingCard();

  useEffect(() => {
    setMounted(true);
    // Check if desktop (expanding card only on md+)
    const mql = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Voice agent custom event listener
  useEffect(() => {
    const handleVoiceOpenModal = (event: CustomEvent<{ index: number }>) => {
      const { index } = event.detail;
      if (index >= 0 && index < servicesCardData.length) {
        setOpenIndex(index);
      }
    };

    document.addEventListener(
      'voice-open-service-modal',
      handleVoiceOpenModal as EventListener
    );

    return () => {
      document.removeEventListener(
        'voice-open-service-modal',
        handleVoiceOpenModal as EventListener
      );
    };
  }, []);

  // Body scroll lock for modal
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  const handleOpen = (index: number) => setOpenIndex(index);
  const handleClose = () => setOpenIndex(null);
  const handleNext = () => {
    if (openIndex !== null && openIndex < servicesCardData.length - 1) {
      setOpenIndex(openIndex + 1);
    }
  };
  const handlePrev = () => {
    if (openIndex !== null && openIndex > 0) {
      setOpenIndex(openIndex - 1);
    }
  };

  // ─── MOBILE LAYOUT (< 768px) ─────────────────────────────────
  if (!isDesktop) {
    return (
      <section id="services" className="relative bg-slate-950 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/30 to-slate-950 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-slate-400 text-center mt-3 max-w-2xl mx-auto">
            Automatizacion real para negocios de servicios
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {servicesCardData.map((card, index) => (
              <CarouselCard
                key={card.title}
                card={card}
                index={index}
                onClick={() => handleOpen(index)}
              />
            ))}
          </div>
        </div>

        {mounted &&
          createPortal(
            <ServiceModal
              card={openIndex !== null ? servicesCardData[openIndex] : null}
              onClose={handleClose}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={openIndex !== null && openIndex < servicesCardData.length - 1}
              hasPrev={openIndex !== null && openIndex > 0}
            />,
            document.body
          )}
      </section>
    );
  }

  // ─── DESKTOP LAYOUT (>= 768px) -- Expanding Card ──────────────
  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative h-screen overflow-hidden"
    >
      {/* ── CAPA 0: Hero Card de Fondo (z-0) ── */}
      <div
        ref={bgHeroRef}
        className="absolute inset-0 z-0 flex items-center justify-center bg-slate-950"
      >
        <HeroServiceCard card={heroCardData} />
      </div>

      {/* ── CAPA 1: Overlay con clip-path (z-10) ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-slate-950"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/30 to-slate-950 pointer-events-none" />

        {/* Content container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div ref={titleRef} className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-slate-400 mt-4 max-w-2xl mx-auto">
              Automatizacion real para negocios de servicios
            </p>
          </div>

          {/* Grid of 3 Cards */}
          <div className="grid grid-cols-3 gap-5 w-full max-w-5xl">
            {/* Card 0: Consultoria (Left) */}
            <div ref={sideCardLeftRef}>
              <CarouselCard
                card={servicesCardData[0]}
                index={0}
                onClick={() => handleOpen(0)}
              />
            </div>

            {/* Card 1: Implementacion (Center - Hero) */}
            <div>
              <CarouselCard
                card={servicesCardData[HERO_INDEX]}
                index={HERO_INDEX}
                onClick={() => handleOpen(HERO_INDEX)}
              />
            </div>

            {/* Card 2: Formacion (Right) */}
            <div ref={sideCardRightRef}>
              <CarouselCard
                card={servicesCardData[2]}
                index={2}
                onClick={() => handleOpen(2)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ServiceModal Portal ── */}
      {mounted &&
        createPortal(
          <ServiceModal
            card={openIndex !== null ? servicesCardData[openIndex] : null}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={openIndex !== null && openIndex < servicesCardData.length - 1}
            hasPrev={openIndex !== null && openIndex > 0}
          />,
          document.body
        )}
    </section>
  );
}
```

**Notas clave:**
- Mobile/desktop split con `isDesktop` state + `matchMedia`
- Mobile usa layout simple (grid vertical, sin GSAP)
- Desktop usa estructura de 3 capas con refs del hook
- `CarouselCard` se reutiliza tal cual -- no se modifica
- Los wrappers `<div ref={sideCardLeftRef}>` separan GSAP (en el wrapper) de Framer Motion (en CarouselCard)
- `heroCardData` se usa TANTO en HeroServiceCard (fondo) como en la CarouselCard del grid (centro)
- La hero card central en el grid NO tiene ref extra porque no necesita animacion especial

---

### Fase 4: Contenido Expandido (Grid 3 Cards)

Esta fase ya esta incluida en la Fase 3. El grid de 3 cards dentro del overlay es la vista final del expanding card.

**Detalles del grid:**

```
grid-cols-3 gap-5 w-full max-w-5xl

Columna 1: Consultoria   (sideCardLeftRef)  → slideIn from left
Columna 2: Implementacion (sin ref extra)   → siempre visible en el overlay
Columna 3: Formacion      (sideCardRightRef) → slideIn from right
```

El `max-w-5xl` (1024px) limita el ancho total para que las cards tengan proporciones elegantes en pantallas grandes.

---

### Fase 5: Mobile Adaptation

**Estrategia:** En mobile (< 768px), NO se usa el efecto expanding card. Se muestra un grid vertical simple con las 3 cards.

**Justificacion:**
- El efecto clip-path requiere `pin: true` que hijacks el scroll -- mala UX en mobile con scroll tactil
- Las cards laterales slide-in no tienen sentido en 1 columna
- El hero card de fondo no es visible cuando el viewport es estrecho

**Implementacion (ya incluida en Fase 3):**

```tsx
// Deteccion de viewport
const [isDesktop, setIsDesktop] = useState(false);

useEffect(() => {
  const mql = window.matchMedia('(min-width: 768px)');
  setIsDesktop(mql.matches);
  const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}, []);

// Render condicional
if (!isDesktop) {
  return (/* grid vertical simple */);
}
return (/* expanding card layout */);
```

**Mobile layout:**
- `grid-cols-1 sm:grid-cols-2` para 1 columna en mobile, 2 en sm+
- `py-16` padding vertical (mas compacto que desktop)
- Sin BlurFade/TextAnimate para reducir JS bundle en mobile
- CarouselCard con `aspect-[3/4]` (compact) en mobile

---

### Fase 6: Imagenes de Servicios

Las imagenes ya existen en `public/images/generated/`:

```
service-consultoria.webp     → Card lateral izquierda
service-implementacion-ia.webp → HeroServiceCard + Card central
service-formacion.webp        → Card lateral derecha
```

**Si se necesita una imagen hero de mayor resolucion:**

Usar el skill `/landing-image-generator` para generar una version mas grande (1600x1200) de `service-implementacion-ia-hero.webp` con el prompt de la seccion Variables.

**Conversion a WebP si se genera desde PNG:**

```bash
# Desde el directorio del proyecto:
npx sharp-cli --input public/images/generated/service-implementacion-ia-hero.png \
  --output public/images/generated/service-implementacion-ia-hero.webp \
  --format webp --quality 85
```

O con `cwebp`:

```bash
cwebp -q 85 public/images/generated/service-implementacion-ia-hero.png \
  -o public/images/generated/service-implementacion-ia-hero.webp
```

---

### Fase 7: Performance Optimization

**1. Conditional GSAP Loading:**

El hook `useExpandingCard` no crea ScrollTrigger en mobile (`enabled: false`), pero GSAP se importa igual. Para optimizar:

```tsx
// En Services.tsx - importar el componente desktop con dynamic
import dynamic from 'next/dynamic';

// Solo cargar el layout desktop (con GSAP) cuando es necesario
const ServicesDesktop = dynamic(
  () => import('@/components/sections/ServicesDesktop').then(mod => ({ default: mod.ServicesDesktop })),
  { ssr: false }
);
```

**NOTA:** Esta optimizacion es OPCIONAL y se implementa si el bundle analysis muestra que GSAP es un problema significativo en mobile. En la primera iteracion, el split mobile/desktop dentro del mismo componente es suficiente.

**2. Image Optimization:**

```tsx
// HeroServiceCard - imagen hero priorizada
<Image
  src={card.image}
  alt=""
  fill
  sizes="(max-width: 768px) 55vw, (max-width: 1024px) 50vw, 40vw"
  priority  // Visible on load (above fold)
/>

// CarouselCard - imagenes del grid (NO priority, cargadas durante scroll)
<Image
  src={card.image}
  alt={card.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // Sin priority -- lazy loading por defecto
/>
```

**3. Will-change Hint:**

```typescript
// En useExpandingCard, antes de iniciar la animacion:
gsap.set(overlayRef.current, {
  willChange: 'clip-path',
});

// Limpiar will-change al final de la animacion (ScrollTrigger onComplete):
// No es estrictamente necesario para scroll-driven pero buena practica
```

**4. Reduced Motion:**

```tsx
// En Services.tsx, si el usuario prefiere reduced motion:
import { useReducedMotion } from 'motion/react';

const prefersReducedMotion = useReducedMotion();

// Si reduced motion, mostrar el layout mobile (grid simple) incluso en desktop
if (!isDesktop || prefersReducedMotion) {
  return (/* grid vertical simple */);
}
```

---

### Fase 8: Testing con Playwright

**Archivo sugerido:** `e2e/services-expanding-card.spec.ts`

**Test cases:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Services Expanding Card', () => {
  // Desktop tests
  test.describe('Desktop (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should show hero card through clip-path window on initial load', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Hero card background should be visible
      const bgHero = section.locator('[aria-hidden="true"]');
      await expect(bgHero).toBeVisible();
    });

    test('should expand overlay on scroll', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Scroll down to trigger animation
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);

      // Side cards should start becoming visible
      // (exact assertion depends on scroll progress)
    });

    test('should show 3 cards in grid at end of scroll', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Scroll enough to complete animation
      await page.mouse.wheel(0, 2000);
      await page.waitForTimeout(1000);

      // All 3 cards should be visible
      const cards = section.locator('[class*="rounded-3xl"]');
      await expect(cards).toHaveCount({ minimum: 3 });
    });

    test('should open modal on card click', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Scroll to reveal cards
      await page.mouse.wheel(0, 2000);
      await page.waitForTimeout(1000);

      // Click a card's + button
      const plusButton = section.locator('button[aria-label*="Ver detalles"]').first();
      await plusButton.click();

      // Modal should appear
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
    });
  });

  // Mobile tests
  test.describe('Mobile (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should show simple grid layout without expanding card', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Should NOT have hero card background
      const bgHero = section.locator('[aria-hidden="true"]');
      await expect(bgHero).not.toBeVisible();

      // Should show cards in vertical grid
      const cards = section.locator('[class*="rounded-3xl"]');
      await expect(cards).toHaveCount({ minimum: 3 });
    });

    test('cards should have correct touch targets', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // + buttons should be at least 44px
      const plusButton = section.locator('button[aria-label*="Ver detalles"]').first();
      const box = await plusButton.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });
  });

  // iPad tests
  test.describe('iPad Mini (768x1024)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should show expanding card effect', async ({ page }) => {
      await page.goto('/');
      const section = page.locator('#services');
      await section.scrollIntoViewIfNeeded();

      // Hero card background should be visible (tablet uses the effect)
      const bgHero = section.locator('[aria-hidden="true"]');
      await expect(bgHero).toBeVisible();
    });
  });
});
```

---

## Workflow

> **Modo de ejecucion:** `/ralph-execute` (ralph loop con TodoList tracking, checkpoints automaticos, lectura/actualizacion de memorias de expertos)

### Agentes, Skills y Memorias por Fase

```yaml
Agentes_Asignados:

  "@frontend":
    fases: [1, 2, 3, 4, 5, 7]
    skills:
      - /studiotek-landing-enhancer  # Patrones del proyecto, mobile-first, GSAP
      - /react-19                    # Hooks, refs, Server Components
      - /tailwind                    # Responsive, dark theme, Tailwind v4
      - /nextjs                      # Image optimization, metadata
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/frontend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/frontend.yaml"
      decisiones_relevantes: "SL063 (clip-path), SL061 (GSAP pin), SL065 (mobile fallback)"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Insight sobre clip-path + GSAP ScrollTrigger pattern]
        2. [Patron de expanding card hibrido reutilizable]
        3. [Separacion GSAP/Framer Motion en DOM elements distintos]

  "@frontend" (fase 6 - imagenes):
    fases: [6]
    skills:
      - /landing-image-generator     # Generacion de imagenes con Gemini Imagen 4.0
      - /nextjs                      # Image optimization, sizes, priority
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/frontend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/frontend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Prompts efectivos para imagenes de servicios tech]
        2. [Configuracion optima de Next.js Image para hero backgrounds]

  "@gentleman":
    fases: [review post-fase 5]
    skills:
      - /code-analysis               # Arquitectura, anti-patterns, metricas
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/backend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/backend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Trade-offs del approach hibrido clip-path + transforms]
        2. [Observaciones sobre mantenibilidad del hook useExpandingCard]
        3. [Validacion o rechazo de decisiones arquitectonicas]

  "@quality-reviewer":
    fases: [review post-fase 5]
    skills:
      - /code-analysis               # Clean code, performance, maintainability
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/frontend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/frontend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Patrones de calidad en animaciones scroll-driven]
        2. [Performance patterns clip-path en mobile]
        3. [Mejoras de mantenibilidad aplicadas]

  "@testing":
    fases: [8]
    skills:
      - /playwright-mcp              # E2E testing, viewport testing, accessibility
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/testing.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/testing.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Viewports criticos para GSAP pin + clip-path]
        2. [Estrategias de testing para scroll-based animations]
        3. [Regresiones detectadas y como prevenirlas]
```

### Fases para ralph-execute (WORKFLOW-STATUS.yaml)

```yaml
# Cada fase tiene: id, name, agent, status, files, checkpoint, dependencies, prompt

phases:

  - id: 1
    name: "Crear HeroServiceCard Component"
    agent: "frontend"
    status: pending
    files:
      - components/ui/HeroServiceCard.tsx
    checkpoint:
      command: "grep -c 'HeroServiceCard' components/ui/HeroServiceCard.tsx"
      expected: "HeroServiceCard"
    dependencies: []
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 1)
      LEE el componente de referencia: components/ui/CarouselCard.tsx

      CREA el archivo components/ui/HeroServiceCard.tsx siguiendo EXACTAMENTE
      el codigo de la Fase 1 del plan. El componente:
      - Comparte la interface CardData de CarouselCard
      - NO usa Framer Motion (sin motion.div, sin whileHover/whileTap)
      - Renderiza imagen con Next.js Image (fill, sizes, object-cover)
      - Es decorativo (aria-hidden="true")
      - Centrado vertical/horizontal en su contenedor
      - Responsive sizing (max-w-sm sm:max-w-md lg:max-w-lg)

  - id: 2
    name: "Crear Hook useExpandingCard"
    agent: "frontend"
    status: pending
    files:
      - hooks/useExpandingCard.ts
    checkpoint:
      command: "grep -c 'ScrollTrigger' hooks/useExpandingCard.ts"
      expected: "ScrollTrigger"
    dependencies: [1]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 2)
      LEE el patron existente: components/sections/Benefits/hooks/useHorizontalScroll.ts

      CREA hooks/useExpandingCard.ts siguiendo EXACTAMENTE el codigo de la Fase 2.
      El hook debe:
      - Usar useGSAP de @gsap/react con scope
      - Registrar ScrollTrigger
      - Crear GSAP timeline con: clip-path overlay, fade bgHero, slide side cards, fade titulo
      - ScrollTrigger config: pin, scrub: 1, invalidateOnRefresh
      - getBreakpointConfig() responsive (mobile/tablet/desktop)
      - isDesktop state con matchMedia (768px threshold)
      - Cleanup granular (tl.scrollTrigger?.kill() + tl.kill())
      - Soporte prefers-reduced-motion

  - id: 3
    name: "Refactorizar Services.tsx"
    agent: "frontend"
    status: pending
    files:
      - components/sections/Services.tsx
    checkpoint:
      command: "grep -c 'useExpandingCard\\|HeroServiceCard\\|overlayRef' components/sections/Services.tsx"
      expected: "3"
    dependencies: [1, 2]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 3)
      LEE el archivo actual: components/sections/Services.tsx
      LEE los componentes: components/ui/CarouselCard.tsx, components/ui/HeroServiceCard.tsx

      REFACTORIZA Services.tsx siguiendo EXACTAMENTE el codigo de la Fase 3:
      - Reducir de 4 a 3 servicios (eliminar IA Personalizada)
      - Estructura de 3 capas: bgHero (z-0), overlay clip-path (z-10), grid (z-20)
      - Split desktop (expanding card) / mobile (grid simple)
      - isDesktop del hook controla render condicional
      - Wrapper divs para GSAP refs en side cards (separa de FM)
      - Mantener ServiceModal portal sin cambios
      - Mantener voice agent event listener

  - id: 4
    name: "Mobile Adaptation y Grid 3 Cards"
    agent: "frontend"
    status: pending
    files:
      - components/sections/Services.tsx
    checkpoint:
      command: "grep -c 'grid-cols-1\\|sm:grid-cols-2\\|lg:grid-cols-3\\|md:hidden' components/sections/Services.tsx"
      expected: "grid-cols"
    dependencies: [3]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 4 y 5)

      Ajusta Services.tsx para:
      - Grid responsive: grid-cols-1 (mobile), sm:grid-cols-2, lg:grid-cols-3
      - Mobile (< 768px): grid simple sin expanding card, sin GSAP
      - Desktop (>= 768px): expanding card con hook
      - Verificar que CarouselCard tiene touch targets >= 44px
      - Verificar que las cards no overflow en iPhone SE (375px)

  - id: 5
    name: "TypeScript Check y Build"
    agent: "frontend"
    status: pending
    files: []
    checkpoint:
      command: "export PATH=\"/opt/homebrew/opt/node@22/bin:$PATH\" && npx tsc --noEmit && npm run build 2>&1 | tail -5"
      expected: "Compiled successfully\\|Build completed"
    dependencies: [4]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml

      Ejecuta verificaciones:
      1. export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
      2. npx tsc --noEmit (verificar tipos)
      3. npm run build (verificar build de produccion)

      Si hay errores, CORRÍGELOS en los archivos correspondientes.
      Los archivos que pueden tener errores:
      - components/ui/HeroServiceCard.tsx
      - hooks/useExpandingCard.ts
      - components/sections/Services.tsx

  # --- REVIEW GATE ---

  - id: 6
    name: "Review Arquitectonico"
    agent: "gentleman"
    status: pending
    files: []
    checkpoint:
      command: "echo 'review-complete'"
      expected: "review-complete"
    dependencies: [5]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/backend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md

      REVISA los archivos implementados:
      - components/ui/HeroServiceCard.tsx (nuevo)
      - hooks/useExpandingCard.ts (nuevo)
      - components/sections/Services.tsx (refactorizado)

      Evalua:
      1. Patron de hook consistente con useHorizontalScroll.ts
      2. Cleanup correcto de ScrollTrigger (no killAll)
      3. Separacion GSAP/Framer Motion correcta (wrapper divs)
      4. No anti-patterns ni acoplamientos innecesarios
      5. CarouselCard.tsx NO fue modificado (composicion > modificacion)
      6. Mobile fallback sin GSAP
      7. Accesibilidad (aria-hidden, prefers-reduced-motion)

      Si encuentras problemas, lista los cambios necesarios.
      Si esta correcto, confirma APPROVED con justificacion.

  - id: 7
    name: "Performance Optimization"
    agent: "frontend"
    status: pending
    files:
      - hooks/useExpandingCard.ts
      - components/sections/Services.tsx
    checkpoint:
      command: "grep -c 'will-change\\|prefers-reduced-motion\\|priority' hooks/useExpandingCard.ts components/sections/Services.tsx components/ui/HeroServiceCard.tsx"
      expected: "will-change"
    dependencies: [6]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/frontend.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 7)

      Optimiza performance:
      1. will-change: clip-path en overlay (ya en hook via gsap.set)
      2. Next.js Image: priority en HeroServiceCard, sizes correcto
      3. prefers-reduced-motion: si activo, no ejecutar GSAP, mostrar grid estatico
      4. Verificar que no hay composite layer explosion
      5. Verificar que cleanup no mata otros ScrollTriggers de Benefits
      6. Verificar que GSAP no se carga en mobile si ya hay tree-shaking

  - id: 8
    name: "Testing E2E con Playwright"
    agent: "testing"
    status: pending
    files: []
    checkpoint:
      command: "echo 'testing-complete'"
      expected: "testing-complete"
    dependencies: [7]
    prompt: |
      LEE tu memoria: ai_docs/expertise/domain-experts/testing.yaml
      LEE el plan: ai_docs/plans/2026-01-31_services-expanding-card.md (Fase 8)

      Usa Playwright MCP para testear en estos viewports:
      1. iPhone SE (375x667) - grid simple, sin expanding card
      2. iPhone 15 (390x844) - grid simple, sin expanding card
      3. iPad Mini (768x1024) - expanding card con clip-path
      4. Desktop (1920x1080) - expanding card completo

      Verifica por viewport:
      - No horizontal overflow (scrollWidth <= innerWidth)
      - Cards visibles y clickeables
      - ServiceModal se abre correctamente al click
      - No errores de consola
      - Scroll behavior: seccion se pinea, clip-path se expande
      - Titulo aparece al final del scroll

      Inicia el servidor dev con:
      export PATH="/opt/homebrew/opt/node@22/bin:$PATH" && npm run dev
```

### Flujo de Ejecucion ralph-execute

```bash
# ============================================================
# PRE-EJECUCION
# ============================================================
# 1. Actualizar WORKFLOW-STATUS.yaml con fases del plan
# 2. Cada agente LEE su memoria antes de empezar:
#    @frontend  → lee ai_docs/expertise/domain-experts/frontend.yaml
#    @gentleman → lee ai_docs/expertise/domain-experts/backend.yaml
#    @testing   → lee ai_docs/expertise/domain-experts/testing.yaml

# ============================================================
# EJECUCION (ralph loop)
# ============================================================
# Fase 1: @frontend (/studiotek-landing-enhancer, /react-19)
#          → Crear HeroServiceCard.tsx
#          → Checkpoint: grep HeroServiceCard en el archivo
#
# Fase 2: @frontend (/studiotek-landing-enhancer, /react-19)
#          → Crear useExpandingCard.ts
#          → Checkpoint: grep ScrollTrigger en el archivo
#
# Fase 3: @frontend (/studiotek-landing-enhancer, /tailwind)
#          → Refactorizar Services.tsx (3 capas, 3 cards)
#          → Checkpoint: grep useExpandingCard + HeroServiceCard + overlayRef
#
# Fase 4: @frontend (/tailwind, /studiotek-landing-enhancer)
#          → Mobile adaptation + grid 3 cards responsive
#          → Checkpoint: grep grid-cols + md:hidden
#
# Fase 5: @frontend (/nextjs)
#          → TypeScript check + Build verificacion
#          → Checkpoint: tsc --noEmit && npm run build (exit 0)
#
# --- REVIEW GATE ---
#
# Fase 6: @gentleman (/code-analysis)
#          → Review arquitectonico de los 3 archivos
#          → Checkpoint: echo review-complete
#
# Fase 7: @frontend (/nextjs, /studiotek-landing-enhancer)
#          → Performance optimization (will-change, priority, reduced-motion)
#          → Checkpoint: grep will-change + prefers-reduced-motion + priority
#
# Fase 8: @testing (/playwright-mcp)
#          → E2E testing en 4 viewports
#          → Checkpoint: echo testing-complete

# ============================================================
# POST-EJECUCION
# ============================================================
# Cada agente ACTUALIZA su memoria al finalizar:
#   @frontend   → actualiza ai_docs/expertise/domain-experts/frontend.yaml
#   @gentleman  → actualiza ai_docs/expertise/domain-experts/backend.yaml
#   @testing    → actualiza ai_docs/expertise/domain-experts/testing.yaml
#
# Cada agente incluye "## Aprendizajes Clave:" en su respuesta final
#
# Actualizar ai_docs/memoria/long_term.yaml con:
#   - workflows_completed += 1
#   - decision: "Expanding card hibrido clip-path + transforms"
#   - tools: GSAP ScrollTrigger, clip-path: inset()

# ============================================================
# COMMIT (manual, despues de ralph-execute)
# ============================================================
git add components/ui/HeroServiceCard.tsx hooks/useExpandingCard.ts components/sections/Services.tsx
git commit -m "$(cat <<'EOF'
feat: implement expanding card effect in Services section

- Add HeroServiceCard component (decorative, no Framer Motion)
- Add useExpandingCard hook (GSAP timeline + ScrollTrigger + clip-path)
- Refactor Services.tsx with 3-layer architecture (hero bg + clip-path overlay + grid)
- Hybrid approach: clip-path inset() on overlay + transforms on side cards
- Reduce to 3 service cards for symmetry (Consultoría, IA, Formación)
- Mobile fallback: simple grid without GSAP (< 768px)
- Wrapper divs separate GSAP transforms from Framer Motion hover/tap
- Accessible: aria-hidden decorative, prefers-reduced-motion support
- GPU-accelerated clip-path animation with will-change

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Report

### Expected Output

**Archivos creados/modificados:**

| Archivo | Accion | LOC estimado |
|---------|--------|-------------|
| `components/ui/HeroServiceCard.tsx` | Nuevo | ~55 |
| `hooks/useExpandingCard.ts` | Nuevo | ~130 |
| `components/sections/Services.tsx` | Modificado | ~240 (vs 273 actual) |
| Total | | ~425 LOC |

**Viewports verificados:**

| Viewport | Comportamiento esperado |
|----------|------------------------|
| 375px (iPhone SE) | Grid vertical 1 col, sin expanding card |
| 640px (sm) | Grid 2 col, sin expanding card |
| 768px (iPad Mini) | Expanding card con clip-path tablet config |
| 1024px (iPad Pro) | Expanding card con clip-path desktop config |
| 1440px (Desktop) | Expanding card completo |
| 1920px (Wide) | Expanding card, max-w-5xl centra el grid |

**Metricas de Performance:**

| Metrica | Target | Nota |
|---------|--------|------|
| LCP | < 2.5s | HeroServiceCard imagen con `priority` |
| CLS | < 0.1 | `h-screen` fijo durante pin, sin layout shift |
| FID | < 100ms | Cards clickeables durante toda la animacion |
| Bundle JS (mobile) | No incremento GSAP | GSAP ya esta en el bundle (Benefits desktop) |
| Animacion FPS | 60fps | clip-path es GPU-accelerated |

**Validacion:**

- [ ] TypeScript compila sin errores (`tsc --noEmit`)
- [ ] Next.js build pasa (`npm run build`)
- [ ] No horizontal overflow en ningun viewport (375px - 1920px)
- [ ] Cards del grid son clickeables y abren ServiceModal
- [ ] Voice agent custom event funciona (`voice-open-service-modal`)
- [ ] prefers-reduced-motion muestra grid estatico
- [ ] iPad Mini (768px) muestra el efecto correctamente
- [ ] Hero card de fondo es visible a traves del clip-path en estado inicial
- [ ] Hero card de fondo desaparece cuando overlay se expande completamente
- [ ] Side cards hacen slide-in suave durante el scroll
- [ ] Titulo aparece con fade-in al final del scroll
- [ ] ScrollTrigger cleanup no mata otros triggers de la pagina

---

## Riesgos y Mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigacion |
|---|--------|-------------|---------|------------|
| 1 | `clip-path round` no soportado en Safari < 16.4 | Baja | Medio | Fallback: clip-path funciona sin round (sin border-radius animado). Aceptable visualmente |
| 2 | GSAP ScrollTrigger conflicto con Benefits horizontal scroll | Media | Alto | Cleanup granular (solo este trigger). Ambos usan `scope` diferente. Verificar en dev |
| 3 | Hydration mismatch por `isDesktop` state | Media | Bajo | `useState(false)` + `useEffect` para setear isDesktop. SSR siempre renderiza mobile layout. Match con matchMedia en cliente |
| 4 | Hero card de fondo visible debajo del overlay en bordes | Baja | Bajo | `bg-slate-950` en overlay + bgHero wrapper. Ambos oscuros, no hay "leak" visual |
| 5 | Pin de ScrollTrigger causa salto de contenido | Baja | Medio | `h-screen` en el section reserva espacio. Verificar que el pin no desplaza secciones siguientes |
| 6 | Framer Motion en CarouselCard interfiere con GSAP transforms | Media | Alto | Wrapper `<div ref={sideCardRef}>` separa las dos libraries. GSAP anima el wrapper, FM anima el inner |
| 7 | Resize durante scroll rompe el efecto | Baja | Medio | `invalidateOnRefresh: true` + `end` como funcion que re-evalua. getBreakpointConfig() se re-ejecuta |
| 8 | 4a card (IA Personalizada) eliminada puede perder SEO/contenido | Baja | Bajo | El servicio puede mencionarse en la pagina de forma distinta (FAQ, texto). No es un servicio activo principal |
| 9 | Performance en tablets de gama baja (iPad Mini 6) | Media | Medio | clip-path es GPU-accelerated. Si hay jank, reducir scroll distance o eliminar efecto en tablet |
| 10 | ServiceModal con openIndex > 2 crash por array out of bounds | Baja | Alto | Voice agent event ya valida `index < servicesCardData.length`. Modal handlers tambien validan bounds |

---

## Notes

### Decisiones de Diseno

| Decision | Justificacion |
|----------|---------------|
| **clip-path sobre scale** | scale() rasteriza contenido y lo estira. clip-path renderiza a tamano real y recorta. Texto e imagenes se ven nitidos |
| **HeroServiceCard nuevo vs modificar CarouselCard** | CarouselCard usa Framer Motion (whileHover, whileTap). Mezclar FM + GSAP en el mismo elemento causa conflicto en `transform`. Composicion > modificacion |
| **3 cards vs 4** | El expanding card necesita simetria visual (izq-centro-der). 4 cards en grid-cols-3 deja 1 huerfana. 3 es el numero optimo |
| **Mobile: grid simple vs expanding card** | ScrollTrigger pin en mobile hijacks el scroll tactil. Malo para UX. Grid simple es rapido, accesible y funcional |
| **Overlay bg-slate-950 vs transparent** | El overlay debe ocultar la hero card de fondo cuando esta expandido. Fondo opaco garantiza que solo se ven las 3 CarouselCards del grid |
| **matchMedia vs CSS media queries** | Se necesita render condicional (mobile vs desktop layout). CSS no puede condicionar que hooks se ejecutan. matchMedia es el approach React standard |
| **Separar GSAP wrapper del FM inner** | GSAP anima `x` y `opacity` en el wrapper div. FM anima `scale` y `y` en whileHover/whileTap del CarouselCard inner. Propiedades no colisionan |
| **useGSAP con scope** | Patron consistente con useHorizontalScroll. scope limita a este section, evita conflictos con otros ScrollTriggers |

### Alternativas Descartadas

| Alternativa | Razon de descarte |
|-------------|-------------------|
| **GSAP Flip** | getBoundingClientRect() calcula posiciones una sola vez. Fragil con scroll continuo + pin + resize. invalidateOnRefresh no refresca el snapshot de Flip |
| **CSS-only clip-path (scroll-driven animations)** | `animation-timeline: scroll()` no es soportado en Safari. GSAP ScrollTrigger es cross-browser |
| **Framer Motion scroll-linked animations** | No soporta `pin`. useScroll + useTransform no puede hijack el scroll como ScrollTrigger |
| **Scale + transform-origin** | Distorsiona texto e imagenes (rasterizado a escala 1, luego estirado). clip-path es superior para contenido rico |
| **Una sola CarouselCard con mode="hero"** | Acopla logica especifica en componente generico. Conflicto FM + GSAP. Composicion es mejor |
| **Intersection Observer para triggering** | No soporta `scrub` ni `pin`. Solo detecta visibilidad, no progreso de scroll |
| **4 cards con grid-cols-4** | Pierde efecto "expanding hero central". 3 cards permiten simetria izq-centro-der que es la base del efecto |
| **Dynamic import de GSAP solo en desktop** | Sobre-optimizacion en v1. GSAP ya se carga por Benefits desktop. No hay ganancia real |

### Referencias

| Recurso | URL/Path |
|---------|----------|
| GSAP ScrollTrigger docs | https://gsap.com/docs/v3/Plugins/ScrollTrigger |
| clip-path inset() MDN | https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path |
| useGSAP hook docs | https://gsap.com/docs/v3/GSAP/gsap.utils/useGSAP() |
| Patron GSAP existente | `components/sections/Benefits/hooks/useHorizontalScroll.ts` |
| CarouselCard (reutilizar) | `components/ui/CarouselCard.tsx` |
| Frontend memory | `ai_docs/expertise/domain-experts/frontend.yaml` |
| Revolut expanding card ref | https://www.revolut.com/ (seccion de servicios) |
