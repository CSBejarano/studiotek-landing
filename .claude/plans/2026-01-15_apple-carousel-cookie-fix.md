# Plan de Ejecucion: Apple Cards Carousel + Cookie Banner Fix

> **Generado:** 2026-01-15
> **Issue:** N/A (Feature request)
> **Workflow ID:** 2026-01-15_apple-carousel-cookie-fix

## Variables

```yaml
PROJECT: "StudioTek Landing"
BRANCH: "main"
DOMAIN: "frontend"
COMPLETION_PROMISE: "Landing completa con carousel completo y cookie banner fix"
MAX_ITERATIONS: 6
RALPH_MODE: true
```

## Purpose

Implementar dos mejoras en la landing de StudioTek:
1. **Cookie Banner Fix:** Asegurar visibilidad inmediata con animacion suave fade-in desde abajo
2. **Apple Cards Carousel:** Carousel horizontal estilo Apple para la seccion Services con modal expandible

## Code Structure

```yaml
CREATE:
  - "hooks/useOutsideClick.ts"              # Hook para detectar click fuera de modal
  - "components/ui/BlurImage.tsx"           # Image con blur loading effect
  - "components/ui/AppleCarousel.tsx"       # Container principal del carousel
  - "components/ui/CarouselCard.tsx"        # Card individual con modal expandible

MODIFY:
  - "components/cookies/CookieBanner.tsx"   # Agregar AnimatePresence + animation
  - "components/sections/Services.tsx"      # Reemplazar grid por carousel

TESTS:
  - "Manual: Clear localStorage, reload, verify banner animation"
  - "Manual: Click cards, verify modal expand/close"
  - "npm run build"
```

---

## WORKFLOW

### FASE 0: Setup Verification

**Agente:** @infra

~~~~~
Task(
  subagent_type: "infra",
  description: "FASE 0: Verificar dependencias",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/infra.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relacionadas con setup

  # CONTEXTO

  - Branch: main
  - Proyecto: StudioTek Landing

  # TAREA

  Verificar que todas las dependencias necesarias estan instaladas:

  1. Verificar en package.json:
     - framer-motion (REQUERIDO para animaciones)
     - react-intersection-observer (ya instalado)

  2. Si falta framer-motion:
     ```bash
     npm install framer-motion
     ```

  3. NO deberia ser necesario - framer-motion v12.26.2 ya esta instalado

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Dependencias verificadas
     - Estado: SUCCESS | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/infra.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -q "framer-motion" package.json && echo "OK"`
- Criterio: Output "OK"

---

### FASE 1: Cookie Banner Fix

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Cookie Banner Animation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL025 (floating animations), SL017 (framer-motion patterns)
     - blockers: Problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones sobre animaciones

  # CONTEXTO

  - Branch: main
  - Archivo: components/cookies/CookieBanner.tsx

  # TAREA

  Agregar animacion suave al cookie banner para que aparezca con fade-in desde abajo.

  ## Implementacion

  1. Importar AnimatePresence y motion de framer-motion
  2. Envolver el banner div en AnimatePresence
  3. Usar motion.div con:
     ```tsx
     initial={{ opacity: 0, y: 50 }}
     animate={{ opacity: 1, y: 0 }}
     exit={{ opacity: 0, y: 50 }}
     transition={{ duration: 0.3, ease: "easeOut" }}
     ```
  4. Mantener toda la logica existente intacta
  5. NO modificar CookieContext.tsx - funciona correctamente

  ## Archivos

  MODIFY: components/cookies/CookieBanner.tsx

  ## Criterio de Exito

  - Banner aparece con animacion suave en primera visita
  - Banner no tiene hydration mismatch
  - Animacion de salida cuando se acepta/rechaza

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios realizados en CookieBanner.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL037"
       context: "Cookie banner animation pattern"
       decision: "AnimatePresence + motion.div con initial/animate/exit para fade-in-from-bottom"
       confidence: 0.95
       validated_in: "Cookie banner fix"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -q "AnimatePresence" components/cookies/CookieBanner.tsx && echo "OK"`
- Criterio: Output "OK"

---

### FASE 2: Hooks y Utilidades

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: useOutsideClick + BlurImage",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL034 (hook patterns), SL035 (scroll animation hook)
     - file_patterns_discovered: hooks/*.ts pattern

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Archivos: hooks/, components/ui/

  # TAREA

  Crear dos utilidades necesarias para el carousel.

  ## 1. hooks/useOutsideClick.ts

  ```typescript
  import { useEffect, RefObject } from "react";

  export function useOutsideClick(
    ref: RefObject<HTMLDivElement | null>,
    callback: (event: MouseEvent | TouchEvent) => void
  ) {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        callback(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, callback]);
  }
  ```

  ## 2. components/ui/BlurImage.tsx

  ```tsx
  'use client';

  import { useState } from 'react';
  import Image from 'next/image';
  import { cn } from '@/lib/utils';

  interface BlurImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
  }

  export function BlurImage({ src, alt, fill, width, height, className }: BlurImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={cn(
          "object-cover transition-all duration-500",
          isLoaded ? "blur-0 scale-100" : "blur-md scale-105",
          className
        )}
        onLoad={() => setIsLoaded(true)}
      />
    );
  }
  ```

  ## Archivos

  CREATE:
  - hooks/useOutsideClick.ts
  - components/ui/BlurImage.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados
     - Estado: SUCCESS | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL038"
       context: "useOutsideClick hook for modals"
       decision: "Hook con mousedown+touchstart listeners, cleanup en unmount"
       confidence: 0.95
       validated_in: "Apple carousel"

     En `file_patterns_discovered:` verificar que existe:
     - pattern: "hooks/*.ts"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls hooks/useOutsideClick.ts components/ui/BlurImage.tsx 2>/dev/null | wc -l | xargs`
- Criterio: Output "2"

---

### FASE 3: Carousel Components

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: AppleCarousel + CarouselCard",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL017 (framer-motion), SL029 (prevent horizontal scroll)
     - SL036 (Card3D component pattern)

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Referencia: https://ui.aceternity.com/components/apple-cards-carousel
  - Dependencia: framer-motion v12.26.2

  # TAREA

  Crear los componentes principales del carousel estilo Apple.

  ## 1. components/ui/CarouselCard.tsx

  Componente de card individual que:
  - Muestra imagen/gradiente con titulo y categoria
  - Al hacer click expande a modal fullscreen
  - Modal con AnimatePresence para enter/exit
  - Cierra con click fuera o Escape key
  - Layout animation con layoutId

  Estructura:
  ```tsx
  'use client';

  import { useState, useRef, useEffect } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { X } from 'lucide-react';
  import { useOutsideClick } from '@/hooks/useOutsideClick';
  import { cn } from '@/lib/utils';

  export interface CardData {
    title: string;
    category: string;
    gradient: string;
    icon: React.ElementType;
    content: React.ReactNode;
  }

  interface CarouselCardProps {
    card: CardData;
    index: number;
  }

  export function CarouselCard({ card, index }: CarouselCardProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const Icon = card.icon;

    useOutsideClick(containerRef, () => setOpen(false));

    // Handle Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      if (open) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [open]);

    return (
      <>
        {/* Card in Carousel */}
        <motion.div
          layoutId={`card-${card.title}-${index}`}
          onClick={() => setOpen(true)}
          className="rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 h-80 w-56 md:h-[26rem] md:w-72 overflow-hidden flex flex-col cursor-pointer hover:border-slate-600/50 transition-colors"
        >
          {/* Gradient Background */}
          <div className={cn("relative flex-1 bg-gradient-to-br", card.gradient)}>
            <Icon className="absolute bottom-4 right-4 text-white/20" size={80} />
          </div>

          {/* Card Info */}
          <div className="p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
              {card.category}
            </p>
            <p className="text-lg font-semibold text-white">
              {card.title}
            </p>
          </div>
        </motion.div>

        {/* Expanded Modal */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50"
              />

              {/* Modal Content */}
              <div className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto">
                <motion.div
                  ref={containerRef}
                  layoutId={`card-${card.title}-${index}`}
                  className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden"
                >
                  {/* Header with gradient */}
                  <div className={cn("relative h-64 bg-gradient-to-br", card.gradient)}>
                    <Icon className="absolute bottom-4 right-4 text-white/20" size={120} />
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                      {card.category}
                    </p>
                    <h3 className="text-3xl font-bold text-white mb-6">
                      {card.title}
                    </h3>
                    <div className="text-slate-300">
                      {card.content}
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }
  ```

  ## 2. components/ui/AppleCarousel.tsx

  Container del carousel:
  ```tsx
  'use client';

  import { useRef, useState, useEffect } from 'react';
  import { motion } from 'framer-motion';
  import { ChevronLeft, ChevronRight } from 'lucide-react';
  import { cn } from '@/lib/utils';

  interface AppleCarouselProps {
    children: React.ReactNode;
    className?: string;
  }

  export function AppleCarousel({ children, className }: AppleCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    useEffect(() => {
      checkScrollability();
      window.addEventListener('resize', checkScrollability);
      return () => window.removeEventListener('resize', checkScrollability);
    }, []);

    const scrollBy = (direction: 'left' | 'right') => {
      if (carouselRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className={cn("relative group", className)}>
        {/* Navigation Buttons */}
        <button
          onClick={() => scrollBy('left')}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-800/80 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0",
            !canScrollLeft && "hidden"
          )}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => scrollBy('right')}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-800/80 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0",
            !canScrollRight && "hidden"
          )}
          disabled={!canScrollRight}
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          onScroll={checkScrollability}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-8 px-4 md:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    );
  }
  ```

  ## Archivos

  CREATE:
  - components/ui/CarouselCard.tsx
  - components/ui/AppleCarousel.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Componentes creados
     - Estado: SUCCESS | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL039"
       context: "Apple-style carousel implementation"
       decision: "AppleCarousel container con overflow-x-auto + CarouselCard con layoutId modal"
       confidence: 0.95
       validated_in: "Services carousel"

     En `file_patterns_discovered:` agregar:
     - pattern: "components/ui/AppleCarousel.tsx"
       purpose: "Horizontal scroll carousel container"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls components/ui/AppleCarousel.tsx components/ui/CarouselCard.tsx 2>/dev/null | wc -l | xargs`
- Criterio: Output "2"

---

### FASE 4: Integracion Services

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: Integrar carousel en Services",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL039 (carousel), SL023 (card alignment)
     - project_info: Services.tsx structure

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  3. Leer components/sections/Services.tsx actual

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Services.tsx
  - Componentes disponibles: AppleCarousel, CarouselCard

  # TAREA

  Reemplazar el grid de Services por el Apple Cards Carousel.

  ## Cambios en Services.tsx

  1. Importar AppleCarousel y CarouselCard
  2. Transformar services data al formato CardData
  3. Reemplazar el grid por AppleCarousel
  4. Crear contenido expandido para cada servicio

  ## Estructura del contenido expandido

  Para cada servicio, el contenido expandido incluye:
  - Descripcion completa
  - Lista de features con iconos
  - CTA para contactar

  ## Codigo de ejemplo

  ```tsx
  import { AppleCarousel } from '@/components/ui/AppleCarousel';
  import { CarouselCard, CardData } from '@/components/ui/CarouselCard';

  // Transform services to CardData
  const servicesCarouselData: CardData[] = services.map((service) => ({
    title: service.title,
    category: getCategoryFromGradient(service.gradient),
    gradient: service.gradient,
    icon: service.icon,
    content: (
      <div className="space-y-6">
        <p className="text-lg">{service.description}</p>
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Incluye:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r font-semibold text-white"
          style={{ background: `linear-gradient(to right, ${service.shimmerGradient.from}, ${service.shimmerGradient.to})` }}
        >
          Solicitar informacion
        </button>
      </div>
    ),
  }));

  // Helper function
  function getCategoryFromGradient(gradient: string): string {
    if (gradient.includes('blue') || gradient.includes('indigo')) return 'Desarrollo';
    if (gradient.includes('amber') || gradient.includes('orange')) return 'Estrategia';
    if (gradient.includes('emerald') || gradient.includes('teal')) return 'Educacion';
    if (gradient.includes('rose') || gradient.includes('pink')) return 'Innovacion';
    return 'Servicio';
  }

  // En el render, reemplazar el grid por:
  <AppleCarousel>
    {servicesCarouselData.map((card, index) => (
      <CarouselCard key={card.title} card={card} index={index} />
    ))}
  </AppleCarousel>
  ```

  ## Archivos

  MODIFY: components/sections/Services.tsx

  ## Consideraciones

  - Mantener la estructura de seccion (id="services", titulo, subtitulo)
  - El carousel debe estar centrado
  - Remover imports no usados (VitaEonCard, ShimmerButton si ya no se usan)

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios realizados en Services.tsx
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL040"
       context: "Services section with Apple carousel"
       decision: "Transform services array to CardData with expanded content React nodes"
       confidence: 0.95
       validated_in: "Services carousel integration"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `grep -q "AppleCarousel" components/sections/Services.tsx && echo "OK"`
- Criterio: Output "OK"

---

### FASE 5: Polish y Testing

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 5: QA y Build Final",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`:
     - decisions: Decisiones de testing previas
     - blockers: Problemas conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`

  # CONTEXTO

  - Branch: main
  - Features implementadas:
    - Cookie banner con animacion
    - Apple Cards Carousel en Services

  # TAREA

  Validar que todas las features funcionan correctamente.

  ## Tests Manuales

  1. **Cookie Banner:**
     - Clear localStorage en DevTools
     - Recargar pagina
     - Verificar: Banner aparece con animacion fade-in desde abajo
     - Click "Aceptar todo"
     - Verificar: Banner desaparece con animacion
     - Recargar: Banner NO debe aparecer

  2. **Apple Carousel:**
     - Navegar a seccion Services
     - Verificar: Cards visibles en carousel horizontal
     - Scroll/drag horizontal funciona
     - Click en card: Modal se expande con animacion
     - Click fuera del modal: Se cierra
     - Tecla Escape: Se cierra
     - Contenido expandido visible con CTA

  3. **Responsive:**
     - Mobile: Cards mas pequenas, scroll horizontal funciona
     - Tablet: Transicion suave
     - Desktop: Botones de navegacion aparecen en hover

  ## Build Test

  ```bash
  npm run build
  ```

  Verificar: Build sin errores

  ## Lint Test (si disponible)

  ```bash
  npm run lint
  ```

  Verificar: Sin errores criticos

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Resultados de cada test
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:

     En `decisions:` (si aplica):
     - context: "Apple carousel testing"
       decision: "Manual testing checklist for modal interactions"
       confidence: 0.90
       validated_in: "Services carousel QA"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at

  3. Si BUILD SUCCESS:
     - Output: "Landing completa con carousel completo y cookie banner fix"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build 2>&1 | tail -5`
- Criterio: Sin errores, build exitoso

---

## Checkpoints Summary

| CP  | Fase   | Criterio                           | Comando                                                |
| --- | ------ | ---------------------------------- | ------------------------------------------------------ |
| CP0 | FASE 0 | framer-motion instalado            | `grep -q "framer-motion" package.json`                 |
| CP1 | FASE 1 | AnimatePresence en CookieBanner    | `grep -q "AnimatePresence" components/cookies/CookieBanner.tsx` |
| CP2 | FASE 2 | Hooks creados                      | `ls hooks/useOutsideClick.ts`                          |
| CP3 | FASE 3 | Carousel components creados        | `ls components/ui/AppleCarousel.tsx`                   |
| CP4 | FASE 4 | Services usa carousel              | `grep -q "AppleCarousel" components/sections/Services.tsx` |
| CP5 | FASE 5 | Build exitoso                      | `npm run build`                                        |

---

## Risk Matrix

| Riesgo                     | Impacto | Probabilidad | Mitigacion                                    |
| -------------------------- | ------- | ------------ | --------------------------------------------- |
| Layout animation lag       | Medium  | Low          | Usar layout="position" si necesario           |
| Modal scroll leak          | Low     | Medium       | overflow: hidden en body cuando modal abierto |
| Hydration mismatch         | High    | Low          | Todos los componentes son 'use client'        |
| Horizontal overflow        | Medium  | Medium       | overflow-hidden en carousel wrapper           |
| TypeScript errors          | Medium  | Low          | Tipado explicito en CardData interface        |

---

## Ralph Mode Configuration

```yaml
loop: true
max_iterations: 6
completion_promise: "Landing completa con carousel completo y cookie banner fix"
overnight: false

self_correction:
  tests_fail: "Retry FASE 5"
  lint_fail: "Retry FASE 5"
  build_fail: "Retry FASE 4"
  typescript_error: "Retry fase donde ocurrio"

safety_limits:
  max_retries_per_phase: 3
  logging: ".claude/skills/workflow-task/logs/"
```

---

**Generado por:** /plan-task v3.2
**Fecha:** 2026-01-15
**Total Fases:** 6 (0-5)
**Agentes:** @infra, @frontend, @testing
