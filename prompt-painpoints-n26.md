# PLAN: PainPointsPAS Section Redesign - StudioTek Landing

## Purpose

Transformar la sección PainPointsPAS en una experiencia inmersiva tipo N26 con imágenes de fondo a pantalla completa, overlay oscuro para legibilidad, navegación entre escenas y cards flotantes con información. Mantener el framework PAS (Problem-Agitate-Solution) pero presentarlo de forma visualmente impactante.

> **Dominio:** Frontend  
> **Prioridad:** P1 - Section Upgrade  
> **Complejidad:** 7/10  
> **Skills:** studiotek-landing-enhancer, tailwind, react-19, nextjs  
> **Agents:** @frontend, @gentleman  

---

## Contexto

### Estado Actual de PainPointsPAS

```yaml
Arquitectura_Actual:
  componente: components/sections/PainPointsPAS.tsx
  dependencias:
    - BlurFade (magicui)            # Animación de entrada
    - NumberTicker (magicui)        # Animación de números
    - Lucide icons (Clock, Moon, Users)
    - motion/react (useReducedMotion)

  layout_actual:
    - 3 bloques PAS verticales separados por GradientLine
    - Cada bloque: Icon + Problem (h3) → Agitate (card con stat) → Solution (card)
    - Background: bg-slate-950
    - Animación: BlurFade staggered 0.35s por bloque

  estructura_datos:
    blocks:
      - id: 'tiempo'
        icon: Clock
        problem: 'Pierdes 15+ horas/semana en tareas repetitivas'
        agitate: 'Son 780 horas al año...'
        solution: 'Automatiza y recupera ese tiempo...'
        stat: { value: 780, suffix: 'h' }
      - id: 'clientes'
        icon: Moon
        problem: 'Pierdes clientes fuera de horario'
        agitate: 'El 60% de consultas llegan fuera...'
        solution: 'Un asistente IA atiende 24/7...'
        stat: { value: 60, suffix: '%' }
      - id: 'equipo'
        icon: Users
        problem: 'Tu equipo está saturado con tareas repetitivas'
        agitate: 'Empleados quemados cometen más errores...'
        solution: 'Elimina las tareas que drenan...'
        stat: { value: null, text: '6-9 meses' }

Problemas_Detectados:
  - DISEÑO: Layout vertical tradicional, sin impacto visual
  - DISEÑO: Sin imágenes ni elementos visuales de contexto
  - MARCA: Usa slate-950 en vez de brand #0A0A0A
  - MARCA: Usa colores de acento variados (amber, red, orange, emerald, cyan, blue)
  - NAVEGACIÓN: Los 3 bloques se muestran todos, sin foco en uno a la vez
  - ENGAGEMENT: Sin interacción del usuario, solo scroll pasivo
  - CONVERSIÓN: No hay CTA claro dentro de la sección
```

### Diseño Objetivo (Tipo N26)

```yaml
Inspiracion_N26:
  layout:
    - Full viewport height (100vh) por escena
    - Imagen de fondo a pantalla completa con object-cover
    - Overlay oscuro gradiente para legibilidad del texto
    - Contenido centrado verticalmente
    - Navegación por tabs en la parte inferior

  elementos:
    header:
      - Título grande (Problem) - blanco, shadow para legibilidad
      - Subtítulo (Agitate) - gris claro, con stat destacado
      - Botón CTA primario - ShimmerButton
    
    card_flotante:
      - Glassmorphism card centrado
      - Icon + Solution text
      - Stat badge
      - Border sutil con color de marca
    
    navegacion:
      - 3 tabs circulares/botones en parte inferior
      - Labels: "Tiempo", "Clientes", "Equipo"
      - Tab activo: filled #2563EB
      - Tab inactivo: outlined white/30
      - Indicador de progreso o transición suave

  interacciones:
    - Click en tab → Cambia escena con transición suave
    - Transición de imagen: fade crossfade (0.5s)
    - Contenido: BlurFade staggered por elemento
    - Card flotante: Subtle float animation (opcional)
    - Auto-play opcional: Rotar cada 6s (pausa en hover)
```

### Componentes MagicUI Disponibles

```yaml
Ya_Existen_En_Proyecto:
  - blur-fade              # Entrada de elementos
  - number-ticker          # Animación de stats
  - border-beam            # Efecto de borde luminoso
  - shimmer-button         # Botón CTA
  - magic-card             # Cards con glassmorphism
  - text-animate           # Animación de texto

Nuevos_A_Crear:
  - Ninguno - usar composición de existentes
```

---

## Variables

```yaml
# Archivos
SECTION_FILE: "components/sections/PainPointsPAS.tsx"

# Imágenes de fondo (generar o ubicar en public/images/painpoints/)
IMAGENES:
  tiempo: 
    descripcion: "Profesional agotado trabajando hasta tarde, pantallas con código/automatización"
    prompt: "Dark cinematic photo of exhausted business owner working late at night, multiple monitors showing spreadsheets and emails, coffee cups, dramatic lighting, moody atmosphere, high contrast, professional photography"
  clientes:
    descripcion: "Teléfono vibrando con notificaciones perdidas en la noche"
    prompt: "Dark cinematic photo of smartphone on bedside table at night, screen glowing with multiple missed notifications, clock showing 3 AM, moody atmosphere, dramatic shadows, professional photography"
  equipo:
    descripcion: "Equipo de trabajo estresado, ambiente caótico de oficina"
    prompt: "Dark cinematic photo of stressed office workers, messy desks, tired expressions, chaotic environment, dramatic lighting, high contrast, moody atmosphere, professional photography"

# MARCA - colores oficiales (brand.json)
BG_PRIMARY: "#0A0A0A"         # background_dark
BG_SECTION: "#111111"          # background_section
PRIMARY: "#2563EB"             # primary
PRIMARY_LIGHT: "#3B82F6"       # primary_light
PRIMARY_DARK: "#1D4ED8"        # primary_dark
TEXT_PRIMARY: "#FFFFFF"         # text_primary
TEXT_SECONDARY: "#9CA3AF"      # text_secondary
OVERLAY: "from-black/70 via-black/50 to-black/70"  # Gradient overlay

# Contenido mantenido del PAS original
ESCENAS:
  - id: 'tiempo'
    tab_label: 'Tiempo'
    headline: '780 horas perdidas cada año'
    subheadline: 'Son 3.5 meses de trabajo que podrías dedicar a hacer crecer tu negocio'
    stat: { value: 780, suffix: 'h', label: 'horas/año' }
    solution: 'Automatiza las tareas repetitivas y recupera ese tiempo para lo estratégico'
    icon: Clock
    
  - id: 'clientes'
    tab_label: 'Clientes'
    headline: '60% de oportunidades perdidas'
    subheadline: 'Las consultas llegan fuera de horario, y cada una sin respuesta es dinero que se va'
    stat: { value: 60, suffix: '%', label: 'consultas nocturnas' }
    solution: 'Un asistente IA que atiende 24/7, cualifica leads y cierra citas automáticamente'
    icon: Moon
    
  - id: 'equipo'
    tab_label: 'Equipo'
    headline: 'Coste de 6-9 meses de salario'
    subheadline: 'Por cada empleado que se va por burnout. La saturación drena a tu equipo.'
    stat: { value: null, text: '6-9 meses', label: 'coste de reemplazo' }
    solution: 'Elimina las tareas que drenan a tu equipo. IA para lo repetitivo, humanos para lo estratégico.'
    icon: Users

# Package manager
PKG_MANAGER: "npm"
```

---

## Code Structure

### Archivos a Modificar

```yaml
Modificar:
  - components/sections/PainPointsPAS.tsx     # Rediseño completo a formato N26

Instalar_Nuevo:
  - Ninguno - usar componentes existentes

Ya_Existen_Y_Se_Reutilizan:
  - components/magicui/blur-fade.tsx          # Animación de entrada
  - components/magicui/number-ticker.tsx      # Stats animados
  - components/magicui/shimmer-button.tsx     # CTA buttons
  - components/magicui/border-beam.tsx        # Efecto en card flotante
  - components/magicui/magic-card.tsx         # Card flotante glassmorphism

Eliminar_Del_Componente:
  - GradientLine (separador visual)
  - Layout vertical de cards
  - Colores de acento múltiples (amber, red, orange)
```

### Nuevo Layout de PainPointsPAS (Wire)

```
┌──────────────────────────────────────────────────────────────┐
│  FULL VIEWPORT HEIGHT (100vh)                                │
│  BACKGROUND: Imagen actual según escena activa               │
│  + Overlay: gradiente oscuro (black/70 → black/50 → black/70)│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │     "780 horas perdidas cada año"                      │ │
│  │      ↑ Headline blanco, text-shadow                    │ │
│  │      BlurFade delay=0.1s                               │ │
│  │                                                         │ │
│  │     "Son 3.5 meses de trabajo que podrías..."          │ │
│  │      ↑ Subheadline text-[#9CA3AF] max-w-xl            │ │
│  │      BlurFade delay=0.2s                               │ │
│  │                                                         │ │
│  │     [ShimmerButton: Descubre cómo]                     │ │
│  │      BlurFade delay=0.3s                               │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│           ┌──────────────────────────────┐                   │
│           │   🕐                         │                   │
│           │   "Automatiza las tareas..." │  ← Card flotante  │
│           │                              │     Glassmorphism │
│           │   ┌────────────────────┐     │     MagicCard     │
│           │   │ 780h  horas/año    │     │     + BorderBeam  │
│           │   └────────────────────┘     │                   │
│           │                              │                   │
│           └──────────────────────────────┘                   │
│                          BlurFade delay=0.4s                 │
│                                                               │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│     │  Tiempo │  │ Clientes│  │  Equipo │  ← Tabs           │
│     │   ●     │  │   ○     │  │   ○     │     (navegación)  │
│     └─────────┘  └─────────┘  └─────────┘                    │
│        ACTIVE    INACTIVE    INACTIVE                        │
│        filled    outlined    outlined                        │
│        #2563EB   white/30    white/30                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Transición entre escenas:
- Imagen: Crossfade 0.5s ease-in-out
- Contenido: Fade out → Cambio de datos → Fade in
- Active tab: Animate pulse/scale
```

### Estructura del Componente

```tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { Clock, Moon, Users, type LucideIcon } from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { MagicCard } from '@/components/magicui/magic-card';
import { BorderBeam } from '@/components/magicui/border-beam';

interface Scene {
  id: string;
  tabLabel: string;
  headline: string;
  subheadline: string;
  solution: string;
  stat: {
    value: number | null;
    suffix?: string;
    text?: string;
    label: string;
  };
  icon: LucideIcon;
  image: string;
}

const scenes: Scene[] = [
  {
    id: 'tiempo',
    tabLabel: 'Tiempo',
    headline: '780 horas perdidas cada año',
    subheadline: 'Son 3.5 meses de trabajo que podrías dedicar a hacer crecer tu negocio',
    solution: 'Automatiza las tareas repetitivas y recupera ese tiempo para lo estratégico',
    stat: { value: 780, suffix: 'h', label: 'horas/año' },
    icon: Clock,
    image: '/images/painpoints/tiempo.jpg',
  },
  // ... más escenas
];

export function PainPointsPAS() {
  const [activeScene, setActiveScene] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  
  const currentScene = scenes[activeScene];
  const Icon = currentScene.icon;

  // Auto-rotate (opcional, pausa en hover)
  // useEffect con interval 6000ms

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
      aria-label="Problemas que resolvemos"
    >
      {/* Background Images con Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={currentScene.image}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        
        {/* Header Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`header-${currentScene.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mb-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4">
              {currentScene.headline}
            </h2>
            <p className="text-lg md:text-xl text-[#9CA3AF] max-w-xl mx-auto mb-6">
              {currentScene.subheadline}
            </p>
            <ShimmerButton
              shimmerColor="#2563EB"
              background="#1D4ED8"
              className="px-6 py-3 text-base font-semibold"
            >
              Descubre cómo
            </ShimmerButton>
          </motion.div>
        </AnimatePresence>

        {/* Floating Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${currentScene.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative w-full max-w-md mx-auto"
          >
            <MagicCard
              className="p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10"
              gradientColor="#2563EB"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#2563EB]/20">
                  <Icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <p className="text-white text-lg font-medium">
                  {currentScene.solution}
                </p>
              </div>
              
              {/* Stat Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20">
                {currentScene.stat.value !== null ? (
                  <>
                    <NumberTicker 
                      value={currentScene.stat.value} 
                      className="text-2xl font-bold text-[#2563EB]"
                    />
                    <span className="text-xl font-bold text-[#2563EB]">
                      {currentScene.stat.suffix}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-[#2563EB]">
                    {currentScene.stat.text}
                  </span>
                )}
                <span className="text-sm text-[#9CA3AF] ml-1">
                  {currentScene.stat.label}
                </span>
              </div>

              <BorderBeam
                size={150}
                duration={6}
                colorFrom="#2563EB"
                colorTo="#3B82F6"
              />
            </MagicCard>
          </motion.div>
        </AnimatePresence>

        {/* Tabs Navigation */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 md:gap-4">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(index)}
              className={`
                px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium
                transition-all duration-300 ease-out
                ${index === activeScene 
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/25 scale-105' 
                  : 'bg-transparent text-white/70 border border-white/30 hover:border-white/50 hover:text-white'
                }
              `}
              aria-label={`Ver escena: ${scene.tabLabel}`}
              aria-pressed={index === activeScene}
            >
              {scene.tabLabel}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Instructions

### Fase 1: Generar Imágenes (@marketing-expert + @landing-image-generator)

**Nota:** Si ya existen imágenes apropiadas en `public/images/painpoints/`, saltar esta fase.

1. Usar el skill `/landing-image-generator` para crear 3 imágenes:
   - Escena 1 (Tiempo): Profesional agotado trabajando tarde
   - Escena 2 (Clientes): Teléfono con notificaciones nocturnas  
   - Escena 3 (Equipo): Equipo estresado en oficina caótica

2. Especificaciones:
   - Formato: JPG o WebP
   - Resolución: 1920x1080 mínimo
   - Estilo: Dark, cinematic, moody atmosphere
   - Color grading: Tonalidades frías/oscuras que contrasten con el overlay

3. Guardar en: `public/images/painpoints/`
   - `tiempo.jpg`
   - `clientes.jpg`
   - `equipo.jpg`

### Fase 2: Rediseñar PainPointsPAS.tsx (@frontend)

**Reglas de marca obligatorias:**
- Background: `bg-[#0A0A0A]`
- Overlay: `from-black/70 via-black/50 to-black/70`
- Primary accent: `#2563EB` (tabs activos, stats, icons)
- Text primary: `#FFFFFF` con `drop-shadow-lg` para legibilidad
- Text secondary: `#9CA3AF]`
- Tabs inactivos: `border-white/30 text-white/70`
- Card: `bg-white/5 backdrop-blur-md border-white/10`

**Implementación paso a paso:**

1. **Estructura base:**
   ```tsx
   'use client';
   import { useState } from 'react';
   import { motion, AnimatePresence } from 'framer-motion';
   import Image from 'next/image';
   ```

2. **Background con AnimatePresence:**
   - Usar `mode="wait"` para crossfade
   - `duration: 0.5` para transición suave
   - Image de Next.js con `fill` y `object-cover`
   - Overlay como div absoluto con gradiente

3. **Contenido animado:**
   - Cada escena envuelta en `AnimatePresence mode="wait"`
   - `key` único por escena para trigger re-render
   - `initial={{ opacity: 0, y: 20 }}`
   - `animate={{ opacity: 1, y: 0 }}`
   - `exit={{ opacity: 0, y: -20 }}`
   - `transition={{ duration: 0.4 }}`

4. **Card flotante:**
   - Usar `MagicCard` con `gradientColor="#2563EB"`
   - Añadir `BorderBeam` para efecto de borde luminoso
   - Glassmorphism: `bg-white/5 backdrop-blur-md`
   - Stat badge con `NumberTicker` si es numérico

5. **Tabs:**
   - Posición absoluta `bottom-8`
   - Flexbox con `gap-3 md:gap-4`
   - Estado activo: `bg-[#2563EB]` + shadow
   - Estado inactivo: outlined + hover effects
   - `onClick={() => setActiveScene(index)}`

### Fase 3: Responsive & Performance (@frontend)

**Breakpoints:**
| Breakpoint | Headline | Card Width | Tabs |
|------------|----------|------------|------|
| Mobile (<640px) | text-4xl | max-w-sm | px-4 py-2, text-sm |
| Tablet (640-1024px) | text-5xl | max-w-md | px-5 py-2.5 |
| Desktop (>1024px) | text-6xl | max-w-md | px-6 py-3 |

**Performance:**
- [ ] `priority` en Image de escena activa
- [ ] Preload imágenes: `rel="preload"` en head (opcional)
- [ ] `will-change: transform` en elementos animados
- [ ] Limitar a 3 elementos animados concurrentes
- [ ] `useReducedMotion` para respetar preferencias del usuario

**Accesibilidad:**
- [ ] `aria-label="Problemas que resolvemos"` en section
- [ ] `aria-pressed` en tabs para indicar estado
- [ ] `aria-label` descriptivo en cada tab
- [ ] Contraste WCAG AA: Texto blanco sobre overlay negro = AAA
- [ ] `prefers-reduced-motion`: Desactivar transiciones, mostrar escena estática

### Fase 4: Auto-rotate (Opcional) (@frontend)

```tsx
useEffect(() => {
  if (shouldReduceMotion) return;
  
  const interval = setInterval(() => {
    setActiveScene((prev) => (prev + 1) % scenes.length);
  }, 6000);

  return () => clearInterval(interval);
}, [shouldReduceMotion]);

// Pausar en hover
const [isPaused, setIsPaused] = useState(false);
// ...
onMouseEnter={() => setIsPaused(true)}
onMouseLeave={() => setIsPaused(false)}
```

### Fase 5: Build & Verificación (@frontend)

```bash
npm run build
npm run dev
```

**Checklist visual:**
- [ ] Imagen de fondo cubre 100vh
- [ ] Overlay oscuro permite leer texto claramente
- [ ] Headline blanco con shadow/drop-shadow
- [ ] Transición suave entre escenas (0.5s crossfade)
- [ ] Tab activo: filled #2563EB
- [ ] Tabs inactivos: outlined white/30
- [ ] Card flotante: glassmorphism con border-beam
- [ ] NumberTicker anima al cambiar escena
- [ ] ShimmerButton visible y clickeable
- [ ] Responsive: mobile/tablet/desktop
- [ ] prefers-reduced-motion: transiciones desactivadas

**Checklist marca:**
- [ ] Background #0A0A0A
- [ ] Todos los acentos son #2563EB
- [ ] No hay colores amber, red, orange, cyan, emerald
- [ ] Texto primary #FFFFFF, secondary #9CA3AF

**Checklist performance:**
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s (Image con priority)
- [ ] CLS = 0 (layout estable)
- [ ] No console errors

### Fase 6: Review (@gentleman)

1. Verificar arquitectura:
   - ¿El uso de AnimatePresence es correcto?
   - ¿Las imágenes se cargan eficientemente?
   - ¿El estado se maneja apropiadamente?

2. Verificar marca:
   - Zero colores fuera de paleta
   - Estética dark + premium + tech consistente

3. Verificar UX:
   - ¿Es claro que se puede hacer click en los tabs?
   - ¿Las transiciones son suaves pero no lentas?
   - ¿El texto es legible sobre todas las imágenes?

4. VERDICT: APPROVED / NEEDS_REVISION

---

## Workflow

```bash
# 1. PLANIFICACIÓN (ESTE DOCUMENTO)
# Revisar y aprobar plan

# 2. CONFIRMAR PLAN
# Usuario aprueba: "Procede con el redesign de PainPointsPAS"

# 3. EJECUCIÓN
# Fase 1: @marketing-expert + @landing-image-generator generan imágenes
# Fase 2: @frontend rediseña PainPointsPAS.tsx completo
# Fase 3: @frontend responsive + performance + a11y
# Fase 4: @frontend auto-rotate (opcional)
# Fase 5: @frontend build + verificación completa
# Fase 6: @gentleman review final

# 4. COMMIT
# git add components/sections/PainPointsPAS.tsx public/images/painpoints/
# git commit -m "feat(painpoints): redesign to N26-style immersive storytelling
#
# - Full viewport height sections with background images
# - Crossfade transitions between 3 PAS scenes
# - Glassmorphism floating cards with BorderBeam effect
# - Tab navigation at bottom (Tiempo/Clientes/Equipo)
# - ShimmerButton CTA per scene
# - Dark overlay for text legibility
# - Responsive design (mobile/tablet/desktop)
# - prefers-reduced-motion support
# - Brand colors: #2563EB primary, #0A0A0A background
#
# Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Report

```yaml
Expected_Output:
  archivos_modificados:
    - components/sections/PainPointsPAS.tsx     # Rediseño completo a N26-style

  archivos_nuevos:
    - public/images/painpoints/tiempo.jpg       # Imagen escena 1 (si no existe)
    - public/images/painpoints/clientes.jpg     # Imagen escena 2 (si no existe)
    - public/images/painpoints/equipo.jpg       # Imagen escena 3 (si no existe)

  elementos_eliminados:
    - Layout vertical de 3 bloques
    - GradientLine separadores
    - Colores de acento múltiples (amber, red, orange)
    - Iconos grandes en cada bloque

  nuevo_stack:
    background: "Imagen full-cover con crossfade entre escenas"
    overlay: "Gradiente oscuro black/70 → black/50 → black/70"
    headline: "Texto blanco con drop-shadow-lg, 4xl-6xl responsive"
    subheadline: "text-[#9CA3AF] max-w-xl"
    cta: "ShimmerButton 'Descubre cómo' (#1D4ED8)"
    card_flotante: "MagicCard glassmorphism + BorderBeam (#2563EB)"
    stat: "NumberTicker + label en badge #2563EB/10"
    navegacion: "3 tabs bottom, active=#2563EB filled, inactive=outlined"
    transiciones: "AnimatePresence crossfade 0.5s"

  correciones_marca:
    - "bg-[#0A0A0A] base"
    - "Overlay oscuro consistente"
    - "#2563EB único color de acento"
    - "Texto blanco con shadow para legibilidad"
    - "No más colores variados por bloque"

  metricas_performance:
    lcp_target: "< 2.5s (Image priority)"
    cls_target: "0 (layout estable)"
    animaciones: "3 max concurrentes"
    lighthouse_perf: "> 90"
    lighthouse_a11y: "100"

  metricas_ux:
    engagement: "Tabs clickeables, auto-rotate opcional"
    legibilidad: "Overlay garantiza contraste AAA"
    navegacion: "Clara indicación de tab activo"

  validation:
    - "Imagen cubre 100vh"
    - "Overlay permite leer texto"
    - "Crossfade 0.5s entre escenas"
    - "Tab active=#2563EB, inactive=outlined"
    - "Card con glassmorphism + border-beam"
    - "NumberTicker funciona al cambiar escena"
    - "Responsive 3 breakpoints"
    - "prefers-reduced-motion respeta"
    - "Lighthouse Performance > 90"
    - "Zero colores fuera de marca"

  workflow_status: PENDING_APPROVAL
  phases_completed: 0/6
```

---

## Diferencias Clave vs Diseño Anterior

| Aspecto | Anterior | Nuevo (N26-style) |
|---------|----------|-------------------|
| **Layout** | Vertical scroll | Full viewport per scene |
| **Background** | Solid slate-950 | Full-cover images + overlay |
| **Navegación** | Scroll pasivo | Tabs interactivos |
| **Transiciones** | BlurFade on scroll | Crossfade between scenes |
| **Colores** | Múltiples (amber, red, orange) | Único #2563EB |
| **Card** | Static blocks | Floating glassmorphism |
| **CTA** | Ninguno | ShimmerButton per scene |
| **Imágenes** | Ninguna | 3 background images |
| **Interacción** | Pasiva | Activa (tab clicks) |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Imágenes no disponibles | Media | Alto | Generar con /landing-image-generator o usar gradientes de fallback |
| Texto no legible sobre imagen | Baja | Alto | Overlay oscuro + text-shadow garantiza contraste |
| Transiciones lentas | Baja | Medio | 0.5s es óptimo, useReducedMotion para accesibilidad |
| Layout shift en cambio | Baja | Medio | AnimatePresence con modo wait evita CLS |
| Mobile: tabs tap targets | Baja | Medio | px-4 py-2 mínimo, espaciado adecuado |

---

## Notes

### Decisiones de Diseño Fundamentadas
- **Full viewport height**: Crea inmersión, cada problema es una "escena"
- **Crossfade en vez de slide**: Menos motion sickness, más elegante
- **Tabs en bottom**: Accesible para el pulgar en mobile
- **Glassmorphism card**: Moderno, permite ver fondo difuminado, premium feel
- **Un solo color de acento**: Consistencia de marca, no competir con imágenes
- **ShimmerButton CTA**: Cada escena tiene su propio llamado a acción
- **Auto-rotate opcional**: Mantiene engagement sin requerir interacción

### Inspiración Visual (N26)
- Dark cinematic photography
- High contrast overlays
- Minimal UI elements over images
- Clear typographic hierarchy
- Subtle animations (not flashy)
- Premium financial/banking aesthetic

---

## Skills y Agents Adjuntos

### Skills Requeridos
| Skill | Comando | Cuándo Usar |
|-------|---------|-------------|
| **StudioTek Enhancer** | `/studiotek-landing-enhancer` | Entender estructura del proyecto, brand colors, componentes disponibles |
| **Tailwind CSS** | `/tailwind` | Estilos responsive, glassmorphism, dark mode |
| **React 19** | `/react-19` | Componentes React, hooks (useState, useEffect), AnimatePresence |
| **Next.js** | `/nextjs` | Image component optimization, dynamic imports |

### Agents Requeridos
| Agente | Invocación | Especialidad |
|--------|------------|--------------|
| **@frontend** | `@frontend` | Implementación completa del componente, animaciones, responsive |
| **@gentleman** | `@gentleman` | Review de arquitectura, decisiones técnicas, trade-offs |
| **@marketing-expert** | `@marketing-expert` | Briefing para generación de imágenes (si es necesario) |

---

*Última actualización: 31 Enero 2026*  
*Version: 1.0 - PainPointsPAS N26-style Redesign*  
*Estado: PENDING_APPROVAL*
