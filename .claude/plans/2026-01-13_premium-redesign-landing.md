# Plan de Ejecucion: Premium Redesign Landing StudioTek

> **Generado:** 2026-01-13
> **Dominio:** frontend
> **Inspiracion:** Lambda Automations

## Variables

```yaml
WORKFLOW_ID: "2026-01-13_premium-redesign-landing"
DOMAIN: "frontend"
COMPLETION_PROMISE: "REDESIGN COMPLETE"
LOOP_MODE: true
MAX_ITERATIONS: 50
```

## Purpose

Transformar la landing page de StudioTek de un diseno funcional a un nivel premium inspirado en Lambda Automations, agregando:
- Efectos visuales premium (animated grid background, glow cards, border beam, shine effects)
- Animaciones con Framer Motion (motion/react)
- Seccion de proceso con pasos
- Seccion de estadisticas con numeros animados
- Manteniendo todo el contenido actual

## Code Structure

**CREATE:**
```
lib/utils.ts
components/magicui/animated-grid-pattern.tsx
components/magicui/magic-card.tsx
components/magicui/border-beam.tsx
components/magicui/shimmer-button.tsx
components/magicui/blur-fade.tsx
components/magicui/text-animate.tsx
components/magicui/number-ticker.tsx
components/magicui/particles.tsx
components/sections/HowItWorks.tsx
components/sections/Stats.tsx
```

**MODIFY:**
```
app/globals.css
app/page.tsx
components/sections/Hero.tsx
components/sections/Benefits.tsx
components/sections/Services.tsx
components/sections/ContactForm.tsx
```

---

## WORKFLOW

### FASE 0: Dependencies & Utils Setup

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 0: Setup dependencias y utilidades",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar SL001-SL011
     - blockers: SLB001, SLB002

  # CONTEXTO

  - Proyecto: StudioTek Landing
  - Stack: Next.js 16 + React 19 + Tailwind 4

  # TAREA

  1. Instalar dependencias:
     ```bash
     npm install motion clsx tailwind-merge
     ```

  2. Crear lib/utils.ts:
     ```typescript
     import { clsx, type ClassValue } from "clsx"
     import { twMerge } from "tailwind-merge"

     export function cn(...inputs: ClassValue[]) {
       return twMerge(clsx(inputs))
     }
     ```

  3. Actualizar globals.css con animaciones Magic UI requeridas:
     - @keyframes shimmer-slide
     - @keyframes spin-around
     - @keyframes border-beam
     - @keyframes shine
     - @keyframes grid

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: npm run build pasa
  2. Reportar estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso sin errores

---

### FASE 1: Magic UI Components Creation

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Crear componentes Magic UI",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`

  # CONTEXTO

  - Todos los componentes usan 'use client'
  - Importar cn() de '@/lib/utils'
  - Usar motion/react para animaciones

  # TAREA

  Crear los siguientes componentes en components/magicui/:

  1. **animated-grid-pattern.tsx**
     - SVG grid con cuadrados animados
     - Props: width, height, numSquares, maxOpacity

  2. **magic-card.tsx**
     - Efecto spotlight que sigue el cursor
     - Props: children, className, gradientSize, gradientColor

  3. **border-beam.tsx**
     - Luz animada en el borde
     - Props: size, duration, colorFrom, colorTo

  4. **shimmer-button.tsx**
     - Boton con efecto shimmer
     - Props: children, shimmerColor, background

  5. **blur-fade.tsx**
     - Animacion de entrada con blur
     - Props: children, delay, duration, yOffset

  6. **text-animate.tsx**
     - Animacion de texto por palabras/caracteres
     - Props: children, animation, by, delay

  7. **number-ticker.tsx**
     - Contador animado
     - Props: value, delay, direction

  8. **particles.tsx** (opcional)
     - Particulas de fondo
     - Props: quantity, color

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: Todos los imports funcionan
  2. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: 8 componentes creados, build exitoso

---

### FASE 2: Hero Section Premium Upgrade

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Upgrade Hero a nivel premium",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer componente actual: components/sections/Hero.tsx

  # CONTEXTO

  - Mantener contenido actual (headline, subheadline, CTAs)
  - Mantener smooth scroll funcionando
  - Agregar efectos visuales premium

  # TAREA

  Modificar Hero.tsx:

  1. **Background:** Agregar AnimatedGridPattern
     - Posicion absoluta
     - Gradient mask (fade hacia abajo)
     - Opacidad sutil (0.3-0.4)

  2. **Headline:** Usar TextAnimate
     - Animation: 'blurInUp'
     - By: 'word'

  3. **Subheadline:** Usar BlurFade
     - Delay: 0.3s

  4. **Primary CTA:** Reemplazar con ShimmerButton
     - Background: primary color
     - Mantener onClick handler

  5. **Secondary CTA:** Agregar BlurFade
     - Delay: 0.4s
     - Estilo outline existente

  6. **Container:** Envolver en BlurFade general

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: Hero visible con animaciones
  2. Verificar: Smooth scroll funciona
  3. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual check)
- Criterio: Hero con grid background y text animation visible

---

### FASE 3: Benefits Section Premium Upgrade

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Upgrade Benefits a nivel premium",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer componente actual: components/sections/Benefits.tsx

  # CONTEXTO

  - 3 benefit cards con iconos Lucide
  - Mantener contenido actual

  # TAREA

  Modificar Benefits.tsx:

  1. **Seccion wrapper:** Agregar BlurFade

  2. **Titulo/Subtitulo:** Agregar BlurFade con delay

  3. **Cards:** Para cada card:
     - Envolver en BlurFade con delay escalonado (0.1 * index)
     - Reemplazar Card con MagicCard
     - Agregar BorderBeam dentro del MagicCard
     - Mantener icono y contenido

  4. **Iconos:** Mejorar estilo
     - Agregar circulo de fondo con gradient sutil
     - Mantener size={48}

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: Cards tienen efecto spotlight en hover
  2. Verificar: Border beam animado visible
  3. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual check)
- Criterio: Cards con glow effect y border beam

---

### FASE 4: Services Section Premium Upgrade

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: Upgrade Services a nivel premium",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer componente actual: components/sections/Services.tsx

  # CONTEXTO

  - Similar a Benefits
  - 3 service cards

  # TAREA

  Modificar Services.tsx (mismo patron que Benefits):

  1. BlurFade en seccion
  2. BlurFade escalonado en titulo/subtitulo
  3. MagicCard + BorderBeam en cada card
  4. Delay escalonado en cards

  **Diferenciacion visual:**
  - Usar colores diferentes para BorderBeam (ej: purple -> cyan)
  - O usar gradientFrom/gradientTo diferentes en MagicCard

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: Cards animadas
  2. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Services section con efectos premium

---

### FASE 5: HowItWorks Section (NUEVO)

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 5: Crear seccion Como Trabajamos",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`

  # CONTEXTO

  Nueva seccion mostrando el proceso de trabajo en 4 pasos

  # TAREA

  Crear components/sections/HowItWorks.tsx:

  **Contenido:**
  ```typescript
  const steps = [
    {
      number: 1,
      title: "Consulta Inicial",
      description: "Analizamos tus procesos actuales y detectamos oportunidades de mejora con IA."
    },
    {
      number: 2,
      title: "Diseno de Solucion",
      description: "Creamos un plan personalizado con las automatizaciones mas adecuadas para tu negocio."
    },
    {
      number: 3,
      title: "Implementacion",
      description: "Desplegamos las soluciones de forma gradual, minimizando interrupciones."
    },
    {
      number: 4,
      title: "Soporte Continuo",
      description: "Te acompanamos con formacion y mantenimiento para maximizar resultados."
    }
  ];
  ```

  **Diseno:**
  - Layout: Grid de 4 columnas (desktop), 2 columnas (tablet), 1 columna (mobile)
  - Cada paso: Numero grande con NumberTicker + titulo + descripcion
  - BlurFade escalonado
  - Fondo: sutil gradient o surface color

  **Agregar a page.tsx:**
  - Importar HowItWorks
  - Colocar despues de Services, antes de Contact

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: 4 pasos visibles
  2. Verificar: Numeros se animan al scroll
  3. Verificar: Responsive en mobile
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual check)
- Criterio: Seccion con 4 pasos y numeros animados

---

### FASE 6: Stats Section (NUEVO)

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 6: Crear seccion de Estadisticas",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`

  # CONTEXTO

  Seccion visual con estadisticas impresionantes

  # TAREA

  Crear components/sections/Stats.tsx:

  **Contenido:**
  ```typescript
  const stats = [
    { value: 40, suffix: "%", label: "Reduccion de costes promedio" },
    { value: 100, suffix: "+", label: "Procesos automatizados" },
    { value: 24, suffix: "/7", label: "Soporte disponible" },
    { value: 98, suffix: "%", label: "Satisfaccion del cliente" }
  ];
  ```

  **Diseno:**
  - Fondo oscuro (slate-900 o similar) para contraste
  - Particles o DotPattern como background sutil
  - Grid de 4 columnas (2 en mobile)
  - NumberTicker para cada valor
  - Sufijo estatico despues del numero
  - Label debajo

  **Agregar a page.tsx:**
  - Colocar despues de Benefits, antes de Services

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: 4 stats visibles con fondo oscuro
  2. Verificar: Numeros se animan
  3. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run dev` (visual check)
- Criterio: Stats con numeros animados, fondo oscuro

---

### FASE 7: Contact Form Enhancement

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 7: Mejorar formulario de contacto",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`
  2. Leer componente actual: components/sections/ContactForm.tsx

  # CONTEXTO

  - Formulario existente con react-hook-form + zod
  - Agregar efectos visuales premium

  # TAREA

  Modificar ContactForm.tsx:

  1. **Seccion wrapper:** BlurFade

  2. **Form container:**
     - Agregar borde sutil con shine effect
     - O usar MagicCard como wrapper del form
     - Background: white con shadow suave

  3. **Titulo/Subtitulo:** BlurFade con delay

  4. **Submit button:**
     - Considerar ShimmerButton
     - O mantener actual con hover mejorado

  5. **Background de seccion:**
     - Gradient sutil o DotPattern muy sutil

  # POST-TAREA (OBLIGATORIO)

  1. Verificar: Form funciona correctamente
  2. Verificar: Validacion sigue funcionando
  3. Verificar: npm run build pasa
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Form con efectos premium, validacion funciona

---

### FASE 8: Global Polish & Validation

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 8: Validacion final y polish",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # CONTEXTO

  Validacion completa del redesign

  # TAREA

  1. **Build verification:**
     ```bash
     npm run build
     ```

  2. **Lint verification:**
     ```bash
     npm run lint
     ```

  3. **Visual checklist:**
     - [ ] Hero: Grid background visible, text animado
     - [ ] Benefits: Cards con glow effect
     - [ ] Stats: Numeros animados, fondo oscuro
     - [ ] Services: Cards con border beam
     - [ ] HowItWorks: 4 pasos con numeros
     - [ ] Contact: Form con efectos
     - [ ] Footer: Sin cambios necesarios

  4. **Responsive check:**
     - [ ] Mobile (375px)
     - [ ] Tablet (768px)
     - [ ] Desktop (1280px)

  5. **Performance:**
     - Verificar que no hay lag visible en scroll
     - Animaciones fluidas

  6. **Funcionalidad:**
     - Smooth scroll funciona
     - Form validation funciona

  # POST-TAREA (OBLIGATORIO)

  Si TODO pasa:
  1. Output: "REDESIGN COMPLETE"

  Si hay issues:
  1. Listar issues encontrados
  2. Estado: PARTIAL
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Sin errores, checklist completo

---

## Checkpoints Summary

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | FASE 0 | Dependencies installed, utils created | `npm run build` |
| CP1 | FASE 1 | 8 Magic UI components created | `npm run build` |
| CP2 | FASE 2 | Hero with grid + animations | `npm run dev` |
| CP3 | FASE 3 | Benefits with MagicCard | `npm run dev` |
| CP4 | FASE 4 | Services with effects | `npm run build` |
| CP5 | FASE 5 | HowItWorks section visible | `npm run dev` |
| CP6 | FASE 6 | Stats section with dark bg | `npm run dev` |
| CP7 | FASE 7 | Contact form enhanced | `npm run build` |
| CP8 | FASE 8 | Full validation pass | `npm run build && npm run lint` |

---

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| SSR issues con motion | HIGH | LOW | 'use client' en todos los componentes animados |
| Performance con muchas animaciones | MEDIUM | MEDIUM | IntersectionObserver (ya incluido en Magic UI) |
| Tailwind 4 keyframes | MEDIUM | LOW | Definir en globals.css |
| Import conflicts | LOW | LOW | Usar @/ alias consistentemente |

---

## Ralph Mode Configuration

```yaml
loop: true
max_iterations: 50
completion_promise: "REDESIGN COMPLETE"
overnight: false

self_correction:
  tests_fail: retry_from_fase_8
  lint_fail: retry_from_fase_8
  build_fail: retry_from_current_fase
```

---

**Plan Version:** 1.0
**Created:** 2026-01-13
**Author:** Claude Code
**Status:** READY FOR EXECUTION
