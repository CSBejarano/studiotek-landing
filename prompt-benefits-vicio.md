# PLAN: Benefits Visual Refinement - VICIO Editorial Collage

## Purpose

Refinar visualmente los paneles de Benefits para transformar la composición actual (grid rígido 2-col) en un layout editorial/collage inspirado en VICIO.com: tipografía que domina la composición, imágenes con overlap agresivo, stickers/badges decorativos dispersos, y números gigantes como watermark de fondo. Cada panel con composición ÚNICA (no repetitiva).

> **Dominio:** Frontend
> **Prioridad:** P1 - Benefits Visual Refinement
> **Complejidad:** 7/10
> **Skill:** studiotek-landing-enhancer

---

## Contexto

### Referencia Visual: VICIO Landing (Análisis de Imagen)

```yaml
VICIO_Design_Principles:
  typography:
    - Titulares MASIVOS que SON la composición (no solo texto, son elementos de layout)
    - "VICIO CITIES" y "COLLECTION" ocupan ~50% del viewport
    - Mix tipográfico: display condensed + sans-serif body
    - Uppercase bold como identidad visual
    - Labels ("W23", "Cheeseburger Trufada") como micro-tipografía dispersa

  layout:
    - Collage editorial: elementos se solapan LIBREMENTE
    - NO hay grid visible - composición orgánica y asimétrica
    - Cada sección tiene layout DISTINTO (no repetitivo)
    - Espacio negativo CONTROLADO entre el caos aparente
    - Profundidad mediante capas (z-ordering visible)

  elementos_decorativos:
    - Stickers/badges: "Burger Club", "ACCEDER", emoji 🔥, logo [v]
    - Rotación agresiva en stickers (5-15deg)
    - Logo de marca como patrón repetido (en ropa, en fondo)
    - Elementos dispersos que añaden "vida" y personalidad
    - Shadow/drop-shadow para efecto "pegado" de sticker

  imagenes:
    - ESCALAS MUY VARIADAS: una imagen hero enorme + varias pequeñas
    - Overlap AGRESIVO entre imágenes y entre imagen y texto
    - Rotaciones visibles (no solo 2deg, hasta 10-15deg en stickers)
    - Mix de tipos: producto + lifestyle + patrón + editorial
    - Bordes redondeados en algunas, sin borde en otras

  composicion:
    - Controlled chaos: parece desordenado pero cada pieza está DELIBERADA
    - Jerarquía clara: headline > imagen hero > imágenes secondary > stickers
    - El ojo sigue un recorrido natural pese al caos
    - Más "diseñado por un director de arte" que "generado por un template"

  energia:
    - Rebelde, joven, disruptora, premium
    - No corporate, no genérico, no template
    - La marca tiene VOZ PROPIA
```

### Estado Actual de Benefits (ya implementado)

```yaml
Arquitectura_Actual:
  componente: components/sections/Benefits/
  estructura:
    - index.tsx                    # Orquestador GSAP horizontal scroll ✅
    - BenefitPanel.tsx             # Panel de beneficio (grid 2-col rígido) ← CAMBIAR
    - CTAPanel.tsx                 # Panel CTA final ✅ NO TOCAR
    - MobileBenefits.tsx           # Fallback mobile ← ACTUALIZAR
    - ProgressIndicator.tsx        # Dots de progreso ✅ NO TOCAR
    - hooks/useHorizontalScroll.ts # GSAP ScrollTrigger ✅ NO TOCAR
    - data/benefits-data.ts        # Datos de paneles ← EXTENDER

  lo_que_funciona_bien:
    - GSAP horizontal scroll con pin + scrub
    - 4 paneles (3 benefits + 1 CTA) × 100vw
    - ProgressIndicator con dots animados
    - CTAPanel con CTA provocativo
    - Alternancia dark/light entre paneles
    - Mobile fallback vertical
    - NumberTicker para stats

  layout_actual_por_panel:
    - Grid 2-col × 3-row (headline / content / stat)
    - Even panels: copy-left, images-right
    - Odd panels: images-left, copy-right
    - 2 imágenes con rotación leve (2-3deg)
    - NumberTicker en Row 3 (bottom)

Problemas_vs_VICIO:
  - LAYOUT: Grid rígido 2-col repetitivo → VICIO usa composición libre/única por panel
  - TIPOGRAFÍA: Headlines grandes pero NO dominan composición como VICIO
  - OVERLAP: Imágenes tienen rotación pero NO se solapan entre sí ni con texto
  - DECORACIÓN: CERO elementos decorativos (stickers, badges, brand marks)
  - STAT_DISPLAY: NumberTicker es pequeño → en VICIO los números/labels son elementos compositivos enormes
  - MONOTONÍA: 3 paneles siguen EXACTAMENTE el mismo template alternando left/right
  - BRAND_MARKS: No hay elementos de marca dispersos ("IA", "AUTO", etc.)
  - ENERGÍA: "Corporate SaaS clean" → debería ser "tech disruptor premium"
  - PROFUNDIDAD: Falta layering visible (todo está en el mismo plano z)
  - MICRO_TIPOGRAFÍA: No hay labels/tags dispersos como en VICIO
```

### Traducción VICIO → StudioTek

```yaml
Equivalencias_Visuales:
  VICIO_burger_stickers:     "→ Tech badges: '24/7', 'IA', '−40%', 'AUTO', '🤖'"
  VICIO_logo_pattern:        "→ No aplicar (excesivo para B2B tech)"
  VICIO_fashion_photos:      "→ Dashboard screenshots + UI mockups con ángulo"
  VICIO_COLLECTION_title:    "→ Headlines aún MÁS grandes como elemento compositivo"
  VICIO_W23_label:           "→ WatermarkStat: número gigante semi-transparente de fondo"
  VICIO_mixed_typography:    "→ font-mono (code feel) + font-bold sans mix"
  VICIO_emoji_stickers:      "→ Tech emojis: 🤖 ⚡ 📊 💰 ⭐"
  VICIO_overlap_aggressive:  "→ Imágenes solapan headline y entre sí"
  VICIO_unique_per_section:  "→ 3 layoutVariants diferentes (editorial-left/right/center)"

Tono_Visual_Objetivo:
  de: "Corporate SaaS template"
  a: "Premium tech editorial"
  nota: "VICIO = streetwear food. StudioTek = tech luxury editorial. Misma energía, diferente sector."
```

### Componentes Disponibles vs Necesarios

```yaml
Ya_Existen_Y_Se_Mantienen:
  - useHorizontalScroll hook     # NO TOCAR
  - ProgressIndicator            # NO TOCAR
  - CTAPanel                     # NO TOCAR
  - NumberTicker (magicui)       # Se mantiene en stat row
  - motion/react                 # Animaciones
  - next/image                   # Imágenes optimizadas

Nuevos_A_Crear (componentes custom simples):
  - FloatingBadge.tsx            # Sticker/badge tech flotante
  - WatermarkStat.tsx            # Número gigante semi-transparente de fondo

Modificar:
  - BenefitPanel.tsx             # Rediseño de grid → editorial
  - benefits-data.ts             # Extender con badges + layoutVariant
  - MobileBenefits.tsx           # Añadir badges + watermark
```

---

## Variables

```yaml
# Archivos a modificar
BENEFIT_PANEL: "components/sections/Benefits/BenefitPanel.tsx"
BENEFITS_DATA: "components/sections/Benefits/data/benefits-data.ts"
MOBILE_BENEFITS: "components/sections/Benefits/MobileBenefits.tsx"

# Archivos nuevos
FLOATING_BADGE: "components/sections/Benefits/FloatingBadge.tsx"
WATERMARK_STAT: "components/sections/Benefits/WatermarkStat.tsx"

# NO TOCAR (funcionan perfecto)
INDEX: "components/sections/Benefits/index.tsx"
HOOK: "components/sections/Benefits/hooks/useHorizontalScroll.ts"
PROGRESS: "components/sections/Benefits/ProgressIndicator.tsx"
CTA_PANEL: "components/sections/Benefits/CTAPanel.tsx"

# MARCA
BG_PRIMARY: "#0A0A0A"
BG_LIGHT: "#F5F5F5"
PRIMARY: "#2563EB"
PRIMARY_LIGHT: "#3B82F6"
PRIMARY_DARK: "#1D4ED8"
TEXT_PRIMARY: "#FFFFFF"
TEXT_SECONDARY: "#9CA3AF"
GRADIENT: "from-[#2563EB] via-[#3B82F6] to-[#2563EB]"

# Badges por panel (3 badges por panel en desktop, 1-2 en mobile)
BADGES_PANEL_0:  # ahorro - dark
  - { text: '−40%', position: 'top-[12%] right-[18%]', variant: 'blue', rotate: '-5deg' }
  - { text: 'AUTO', position: 'left-[42%] top-[52%]', variant: 'white', rotate: '4deg' }
  - { text: '💰', position: 'bottom-[28%] left-[5%]', variant: 'blue', rotate: '8deg' }

BADGES_PANEL_1:  # clientes - light
  - { text: '24/7', position: 'top-[10%] right-[22%]', variant: 'dark', rotate: '-4deg' }
  - { text: '🤖', position: 'right-[8%] top-[48%]', variant: 'dark', rotate: '6deg' }
  - { text: '3X', position: 'bottom-[22%] left-[38%]', variant: 'dark', rotate: '-7deg' }

BADGES_PANEL_2:  # satisfaccion - dark
  - { text: '⭐', position: 'top-[10%] right-[28%]', variant: 'blue', rotate: '5deg' }
  - { text: 'NPS', position: 'left-[48%] top-[58%]', variant: 'white', rotate: '-5deg' }
  - { text: '98%', position: 'bottom-[32%] left-[6%]', variant: 'blue', rotate: '4deg' }

# Watermark values
WATERMARK_0: "2500"     # Panel ahorro
WATERMARK_1: "3x"       # Panel clientes
WATERMARK_2: "98%"      # Panel satisfacción

# Package manager
PKG_MANAGER: "npm"
```

---

## Code Structure

### Archivos a Modificar

```yaml
Modificar:
  - components/sections/Benefits/BenefitPanel.tsx       # Grid → Editorial layout
  - components/sections/Benefits/data/benefits-data.ts   # +badges, +layoutVariant, +watermarkValue
  - components/sections/Benefits/MobileBenefits.tsx      # +badges, +watermark sutil

Crear_Nuevo:
  - components/sections/Benefits/FloatingBadge.tsx   # Sticker/badge flotante
  - components/sections/Benefits/WatermarkStat.tsx   # Número gigante de fondo

NO_Tocar:
  - components/sections/Benefits/index.tsx
  - components/sections/Benefits/hooks/useHorizontalScroll.ts
  - components/sections/Benefits/ProgressIndicator.tsx
  - components/sections/Benefits/CTAPanel.tsx
```

---

## Layout Wire por Panel

### Principio: "Cada panel es ÚNICO"

No repetir la misma composición. 3 variantes:

### Panel 0: AHORRO (dark, editorial-left)

```
┌─────────────────────────────────────────────────────────────────┐
│  bg-[#0A0A0A]                          [−40%] ← FloatingBadge  │
│                                         rotated -5deg, blue     │
│  AHORRA                                                         │
│  2.500 EUR.    ← text-5xl/6xl/7xl/8xl/9xl                     │
│  CADA MES.       font-black uppercase                           │
│                  text-white                  ┌──────────────┐   │
│                                              │              │   │
│  "Si tu equipo pierde         [AUTO]         │  Dashboard   │   │
│   780 horas al año..."        badge          │  image       │   │
│   ↑ text-white/70                            │  LARGE       │   │
│     max-w-sm                                 │  -2deg rot   │   │
│                                              │  shadow-2xl  │   │
│   ┌──────────┐                               │  z-10        │   │
│   │ Equipo   │ ← medium                     └──────┬───────┘   │
│   │ image    │   3deg rot                          │ OVERLAP    │
│   │ z-5      │   bottom-left              ┌────────┴────────┐  │
│   └──────────┘                            │  (parte debajo) │  │
│                                           └─────────────────┘  │
│  [💰] badge         "Automatizamos lo repetitivo..."           │
│                       ↑ text-right, text-white/70               │
│                                                                 │
│  ░░░░░░░░░░░░░░░ 2500 ░░░░░░░░░░░░░░░  ← WatermarkStat       │
│  ░░░░░░░░░░░░░░░      ░░░░░░░░░░░░░░░     opacity-[0.03]      │
│                                             font-mono            │
│  ┌───────────────────────────┐              text-[20vw]         │
│  │ 2.500 EUR ahorro medio   │  ← NumberTicker (z-10)          │
│  └───────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Panel 1: CLIENTES (light, editorial-right)

```
┌─────────────────────────────────────────────────────────────────┐
│  bg-[#F5F5F5]                                                   │
│                              [24/7] ← FloatingBadge, dark       │
│                                                                  │
│    ┌────────────┐                  ATIENDE                      │
│    │ Chatbot    │                  3X MÁS.  ← text-right       │
│    │ mockup     │ ──OVERLAP──→     SIN        font-black        │
│    │ LARGE      │                  CONTRATAR.  text-[#0A0A0A]   │
│    │ 2deg rot   │                                                │
│    │ z-10       │                                                │
│    └────────────┘                                                │
│                                                                  │
│  "Cada consulta sin                     [🤖] badge              │
│   responder es un cliente..."                                    │
│   ↑ text-[#0A0A0A]/70                                           │
│                                                                  │
│                               ┌──────────┐                      │
│                               │ Canales  │ ← medium, -3deg     │
│              [3X] badge       │ image    │                      │
│                               │ z-5      │                      │
│                               └──────────┘                      │
│                                                                  │
│  "Un asistente IA que responde..."                              │
│   ↑ text-right, text-[#0A0A0A]/70                               │
│                                                                  │
│  ░░░░░░░░░░░░ 3x ░░░░░░░░░░░░  ← WatermarkStat               │
│                                    opacity-[0.05], text-[25vw]  │
│                                                                  │
│  ┌──────────────────────────────┐                               │
│  │ 3x más capacidad             │  ← NumberTicker (z-10)       │
│  └──────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Panel 2: SATISFACCIÓN (dark, editorial-center)

```
┌─────────────────────────────────────────────────────────────────┐
│  bg-[#0A0A0A]                 [⭐] badge                        │
│                                                                  │
│              ┌──────────────────────────────────┐               │
│              │          NUNCA                    │               │
│              │       PIERDAS UN    ← CENTERED   │               │
│              │        CLIENTE.      text-center  │               │
│              └──────────────────────────────────┘               │
│                                                                  │
│  ┌────────────┐  "El 98% de clientes     ┌────────────┐        │
│  │ Reviews    │   reporta mayor           │  24/7      │        │
│  │ cards      │   satisfacción..."        │  image     │        │
│  │ LARGE      │                           │  MEDIUM    │        │
│  │ from LEFT  │ ←── text center ──→       │ from RIGHT │        │
│  │ overlap    │                           │  overlap   │        │
│  │ z-10       │     [NPS] badge           │  z-5       │        │
│  └────────────┘                           └────────────┘        │
│                                                                  │
│         "Respuesta instantánea.                                 │
│          Sin esperas. Sin horarios."                             │
│          ↑ text-center, text-white/70                            │
│                                                                  │
│    [98%] badge                                                  │
│                                                                  │
│  ░░░░░░░░░ 98% ░░░░░░░░░  ← WatermarkStat, centered           │
│                               opacity-[0.03], text-[25vw]       │
│                                                                  │
│  ┌─────────────────────────────┐                                │
│  │ 98% satisfacción             │  ← NumberTicker (z-10)       │
│  └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Instructions

### Fase 1: Crear Componentes Nuevos (@frontend)

**1a. FloatingBadge.tsx** - Sticker/badge tech flotante

```tsx
'use client';

import { motion } from 'motion/react';

interface FloatingBadgeProps {
  text: string;
  position: string;         // Tailwind absolute positioning classes
  variant?: 'blue' | 'white' | 'dark';
  rotate?: string;          // CSS rotation (e.g., "-5deg")
  delay?: number;           // Entrance delay for stagger
}

export function FloatingBadge({
  text,
  position,
  variant = 'blue',
  rotate = '0deg',
  delay = 0,
}: FloatingBadgeProps) {
  const styles = {
    blue: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
    white: 'bg-white/10 text-white border-white/20',
    dark: 'bg-[#0A0A0A]/10 text-[#0A0A0A] border-black/10',
  };

  return (
    <motion.span
      className={`absolute ${position} z-30 inline-flex items-center rounded-full
        px-3 py-1.5 font-mono text-xs uppercase tracking-wider
        backdrop-blur-sm border shadow-lg
        select-none pointer-events-none
        ${styles[variant]}`}
      style={{ transform: `rotate(${rotate})` }}
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {text}
    </motion.span>
  );
}
```

**1b. WatermarkStat.tsx** - Número gigante de fondo

```tsx
interface WatermarkStatProps {
  value: string;        // "2500", "3x", "98%"
  isDark?: boolean;
  align?: 'left' | 'right' | 'center';
}

export function WatermarkStat({ value, isDark = true, align = 'right' }: WatermarkStatProps) {
  const alignClass = {
    left: 'justify-start pl-4',
    right: 'justify-end pr-4',
    center: 'justify-center',
  }[align];

  return (
    <div
      className={`absolute inset-0 flex items-end ${alignClass} overflow-hidden z-0 select-none pointer-events-none`}
      aria-hidden="true"
    >
      <span
        className={`font-mono font-black text-[18vw] sm:text-[20vw] leading-none pb-4
          ${isDark ? 'text-white/[0.03]' : 'text-black/[0.05]'}`}
      >
        {value}
      </span>
    </div>
  );
}
```

### Fase 2: Extender Data Structure (@frontend)

**Añadir a `benefits-data.ts`:**

```typescript
// Nuevo type
export interface Badge {
  text: string;
  position: string;
  variant: 'blue' | 'white' | 'dark';
  rotate: string;
}

// Extender PanelData
export interface PanelData {
  // ... campos existentes ...
  badges: Badge[];
  layoutVariant: 'editorial-left' | 'editorial-right' | 'editorial-center';
  watermarkValue: string;
}
```

**Añadir a cada panel:**

- Panel 0 (ahorro): `layoutVariant: 'editorial-left'`, `watermarkValue: '2500'`, 3 badges
- Panel 1 (clientes): `layoutVariant: 'editorial-right'`, `watermarkValue: '3x'`, 3 badges
- Panel 2 (satisfaccion): `layoutVariant: 'editorial-center'`, `watermarkValue: '98%'`, 3 badges

### Fase 3: Rediseñar BenefitPanel.tsx (@frontend)

**El cambio principal del proyecto.** Reemplazar el grid 2-col repetitivo por 3 composiciones editoriales.

**Reglas de diseño:**

1. **Headlines MÁS GRANDES**: `text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl`
2. **Composición ÚNICA por panel**: switch/if basado en `layoutVariant`
3. **Imágenes con OVERLAP**: posición absoluta, z-index variado, solapan headline y entre sí
4. **Badges dispersos**: 3 FloatingBadge por panel, posiciones fijas
5. **WatermarkStat**: fondo detrás de todo
6. **Copy blocks**: posición libre, no en grid
7. **NumberTicker**: bottom del panel, z-10

**Jerarquía z-index:**
```
z-0:  WatermarkStat (fondo)
z-5:  Imagen secundaria
z-10: Imagen principal + NumberTicker + Copy blocks
z-20: Headline
z-30: FloatingBadge (siempre encima)
```

**Layout `editorial-left`:**
- Headline: top-left, text-left
- Imagen principal: right area, overlapping headline bottom-right
- Imagen secundaria: bottom-left, partially behind
- Copy 1: below headline
- Copy 2: bottom-right, text-right

**Layout `editorial-right`:**
- Headline: top-right, text-right
- Imagen principal: left area, overlapping headline
- Imagen secundaria: bottom-right
- Copy 1: left side
- Copy 2: bottom-right, text-right

**Layout `editorial-center`:**
- Headline: top-center, text-center
- Imagen principal: left side, overlapping center
- Imagen secundaria: right side, overlapping center
- Copy 1: below headline, centered
- Copy 2: bottom, centered

### Fase 4: Actualizar MobileBenefits (@frontend)

1. Añadir WatermarkStat como fondo sutil (opacity reducida en mobile)
2. Renderizar 1-2 badges por panel (no 3, para evitar saturación)
3. Mantener layout vertical actual (funciona bien)
4. Ajustar z-index para que badges no interfieran con content

### Fase 5: Responsive & Performance (@frontend)

**Responsive:**

| Breakpoint | Headline | Images | Badges | Watermark |
|------------|----------|--------|--------|-----------|
| <768px (mobile) | text-4xl | 1 imagen, aspect-video | 1-2 | text-[30vw] |
| 768-1024px (tablet) | text-6xl | 2 images, overlap moderado | 3 | text-[22vw] |
| >1024px (desktop) | text-8xl/9xl | 2 images, overlap agresivo | 3 | text-[20vw] |

**Performance:**
- [ ] FloatingBadge: solo CSS transform + opacity (GPU)
- [ ] WatermarkStat: puro CSS, cero JS
- [ ] No añadir motion animations nuevas pesadas
- [ ] Badges: `pointer-events-none` (no bloquean scroll GSAP)
- [ ] Total stagger badges < 0.8s
- [ ] Imágenes: mantener priority/lazy actual

**Accesibilidad:**
- [ ] WatermarkStat: `aria-hidden="true"` (decorativo)
- [ ] Badges: `select-none pointer-events-none` (decorativos)
- [ ] Mantener aria-label existente en section
- [ ] Contraste: badges NO bloquean texto legible (z-ordering correcto)
- [ ] Headlines visibles por encima de imágenes (z-20)

### Fase 6: Build & Verificación (@frontend)

```bash
npm run build
npm run dev
```

**Checklist visual:**
- [ ] Panel 0 tiene composición editorial-left (headline top-left)
- [ ] Panel 1 tiene composición editorial-right (headline top-right)
- [ ] Panel 2 tiene composición editorial-center (headline centered)
- [ ] Los 3 paneles se ven DIFERENTES entre sí
- [ ] Headlines son significativamente más grandes que antes
- [ ] Imágenes se solapan entre sí y/o con headline area
- [ ] 3 FloatingBadge visibles por panel en desktop
- [ ] WatermarkStat visible como fondo sutil (no distrae)
- [ ] NumberTicker sigue funcionando
- [ ] GSAP horizontal scroll funciona IGUAL que antes
- [ ] Progress dots funcionan
- [ ] CTAPanel sin cambios
- [ ] Mobile fallback funciona con badges sutiles

**Checklist de marca:**
- [ ] Backgrounds: `#0A0A0A` (dark) / `#F5F5F5` (light)
- [ ] Badges blue variant: `#2563EB`
- [ ] font-mono en WatermarkStat y FloatingBadge
- [ ] Cero colores fuera de paleta

### Fase 7: Review (@gentleman)

1. Verificar "controlled chaos":
   - Cada panel es ÚNICO pero coherente
   - Headlines DOMINAN la composición
   - Overlap de imágenes es deliberado, no desordenado
   - Badges añaden vida sin saturar

2. Verificar energía:
   - Se siente "premium tech editorial" no "corporate template"
   - Hay personalidad visual propia
   - La tipografía gigante crea impacto

3. Verificar que NO se rompió:
   - GSAP scroll horizontal
   - ProgressIndicator
   - CTAPanel
   - Mobile fallback

4. VERDICT: APPROVED / NEEDS_REVISION

---

## Workflow

```bash
# 1. PLANIFICACIÓN (ESTE DOCUMENTO)

# 2. CONFIRMAR PLAN
# "Procede con el benefits visual refinement"

# 3. EJECUCIÓN
# Fase 1: @frontend crea FloatingBadge + WatermarkStat
# Fase 2: @frontend extiende benefits-data.ts
# Fase 3: @frontend rediseña BenefitPanel.tsx (EL CORE)
# Fase 4: @frontend actualiza MobileBenefits
# Fase 5: @frontend responsive + performance
# Fase 6: @frontend build + verificación
# Fase 7: @gentleman review

# 4. COMMIT
# git add components/sections/Benefits/
# git commit -m "feat(benefits): VICIO-inspired editorial collage with badges and watermarks
#
# - Redesign BenefitPanel from grid to 3 unique editorial layouts
# - Add FloatingBadge: tech stickers (−40%, 24/7, 🤖, NPS, etc.)
# - Add WatermarkStat: giant semi-transparent background numbers
# - Each panel has unique layoutVariant (left/right/center)
# - Increase headline scale to text-8xl/9xl for visual dominance
# - Add image overlap between images and with headline area
# - Extend benefits-data.ts with badges, layoutVariant, watermarkValue
# - Update MobileBenefits with subtle badges and watermark
# - Maintain GSAP scroll, ProgressIndicator, CTAPanel unchanged
#
# Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Report

```yaml
Expected_Output:
  archivos_modificados:
    - components/sections/Benefits/BenefitPanel.tsx      # Rediseño editorial completo
    - components/sections/Benefits/data/benefits-data.ts  # +badges, +layoutVariant, +watermarkValue
    - components/sections/Benefits/MobileBenefits.tsx     # +badges, +watermark sutil

  archivos_nuevos:
    - components/sections/Benefits/FloatingBadge.tsx      # Sticker/badge component
    - components/sections/Benefits/WatermarkStat.tsx      # Background stat watermark

  archivos_no_tocados:
    - components/sections/Benefits/index.tsx
    - components/sections/Benefits/hooks/useHorizontalScroll.ts
    - components/sections/Benefits/ProgressIndicator.tsx
    - components/sections/Benefits/CTAPanel.tsx

  principios_vicio_adaptados:
    - "Typography IS the layout: headlines text-8xl/9xl son la composición"
    - "Controlled chaos: overlap + badges + watermark = capas visuales"
    - "Cada panel es ÚNICO: 3 layoutVariants diferentes"
    - "Brand marks dispersos: badges tech como stickers VICIO"
    - "Mixed scale: imágenes a escalas variadas con overlap"
    - "Energía disruptora: premium tech editorial, no corporate clean"

  validation:
    - "3 composiciones editoriales diferentes (no repetitivas)"
    - "Headlines text-8xl+ dominan composición"
    - "Imágenes se solapan entre sí y con headline"
    - "3 FloatingBadge por panel en desktop"
    - "WatermarkStat visible como fondo sutil"
    - "GSAP scroll sin cambios"
    - "Mobile fallback funciona"
    - "Colores de marca correctos"

  workflow_status: PENDING_APPROVAL
  phases_completed: 0/7
```

---

## Diferencias vs Versión Actual

| Aspecto | Actual | Nuevo (VICIO-inspired) |
|---------|--------|------------------------|
| **Layout por panel** | Grid 2-col idéntico (solo alterna L/R) | 3 layouts editoriales únicos |
| **Headlines** | text-4xl → text-8xl | text-5xl → text-9xl (más grande) |
| **Imágenes** | En grid, sin overlap, z-index plano | Posición libre, overlap agresivo, layered |
| **Elementos decorativos** | Ninguno | 3 FloatingBadge por panel (stickers tech) |
| **Background stat** | No existe | WatermarkStat gigante semi-transparente |
| **Composición** | Simétrica, predecible | Asimétrica, editorial, cada panel único |
| **Energía visual** | Corporate SaaS clean | Premium tech editorial |
| **Typography role** | Texto informativo | Elemento compositivo dominante |
| **Brand personality** | Genérica | "Tech disruptor" con badges y micro-type |
| **z-ordering** | Plano | 5 capas visibles (watermark → img2 → img1 → headline → badges) |

---

## Riesgos y Mitigaciones

| Riesgo | Prob. | Impacto | Mitigación |
|--------|-------|---------|------------|
| Overlap de imágenes tapa headline | Media | Alto | Headline z-20, imágenes z-10, garantizar legibilidad |
| Badges distraen del contenido | Media | Medio | opacity sutil, pointer-events-none, max 3, font-mono xs |
| WatermarkStat confunde con content | Baja | Medio | opacity-[0.03], font-mono, aria-hidden |
| Mobile saturado con badges | Baja | Medio | Solo 1-2 badges en mobile |
| GSAP scroll se rompe | Muy Baja | Alto | NO tocar hook, index.tsx ni ProgressIndicator |
| Editorial layout difícil de responsive | Media | Alto | Composición simplificada en <1024px |
| CLS por imágenes absolute | Baja | Medio | Explicit width/height en Image + will-change |

---

## Notes

### Por qué NO copiar VICIO 1:1

- **VICIO** es una marca de comida rápida para millennials/GenZ → estética streetwear, stickers de emoji 🔥, collages densos
- **StudioTek** es una agencia B2B de automatización con IA → estética premium tech, stickers técnicos, composición más aireada
- Tomamos la **ENERGÍA** y los **PATRONES COMPOSITIVOS** de VICIO, no la estética literal
- Los badges son `font-mono` (tech) no stickers emoji (fun)
- El WatermarkStat es el equivalente a los labels "W23" de VICIO pero con datos reales
- El overlap es deliberado y medido, no caótico como en VICIO

### Principio: "Controlled Chaos"

- Los badges SIEMPRE están en esquinas/bordes, NUNCA sobre texto principal
- El WatermarkStat SIEMPRE tiene opacity < 5%, NUNCA compite con headline
- Las imágenes solapan por bordes, NUNCA cubren copy blocks completamente
- El headline SIEMPRE tiene el z-index más alto de contenido (z-20)
- Resultado: "diseñado por un director de arte" no "generado por un template"

---

*Última actualización: 31 Enero 2026*
*Version: 2.0 - Benefits Visual Refinement (VICIO-Inspired, Brand-Aligned)*
*Estado: PENDING_APPROVAL*
