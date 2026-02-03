# PLAN: Benefits Section Redesign - Revolut 3D Coins Style

## Purpose

Transformar la seccion Benefits ("El ROI de automatizar con IA") de 3 cards estaticas con imagenes de fondo a una experiencia inmersiva tipo Revolut con objetos 3D animados (monedas/esferas metálicas que rotan) y navegacion por tabs. Misma arquitectura que PainPointsPAS pero con elemento visual 3D central en vez de imagen de fondo.

> **Dominio:** Frontend
> **Prioridad:** P1 - Section Upgrade
> **Complejidad:** 8/10
> **Skills:** studiotek-landing-enhancer, tailwind, react-19, nextjs
> **Agents:** @frontend, @gentleman

---

## Contexto

### Estado Actual de Benefits

```yaml
Arquitectura_Actual:
  componente: components/sections/Benefits.tsx
  posicion_en_page: 3ra seccion (despues de PainPointsPAS)

  dependencias:
    - VitaEonCard (ui)
    - BlurFade (magicui)
    - TextAnimate (magicui)
    - ShimmerButton (magicui)
    - Image (next/image)

  layout_actual:
    - Titulo "El ROI de automatizar con IA"
    - Subtitulo "Numeros reales de clientes como tu"
    - Grid 3 columnas con VitaEonCards
    - Cada card: imagen de fondo + titulo + descripcion + ShimmerButton CTA
    - Background: bg-slate-950

  cards_actuales:
    - title: "Ahorra 2.500 euros/mes"
      desc: "Reduce un 40% los costes automatizando tareas repetitivas..."
      cta: "Calcular mi ahorro"
      gradient: blue-cyan
    - title: "Atiende 3x mas clientes"
      desc: "Procesos 5x mas rapidos = mas clientes atendidos al dia..."
      cta: "Ver como funciona"
      gradient: purple-pink
    - title: "Nunca pierdas un cliente"
      desc: "Respuesta instantanea 24/7..."
      cta: "Empezar ahora"
      gradient: orange-red

Problemas_Detectados:
  - DISENO: 3 cards estaticas con imagenes pixeladas de fondo, sin impacto visual
  - MARCA: Usa colores variados (blue-cyan, purple-pink, orange-red) en vez de marca unica
  - MARCA: Background slate-950 en vez de brand #0A0A0A
  - ENGAGEMENT: No hay interaccion, solo scroll pasivo
  - CONVERSION: 3 CTAs diferentes compiten entre si (confusion)
  - COHERENCIA: No sigue el patron Revolut-style establecido en PainPointsPAS
```

### Diseno Objetivo (Revolut Investment Section)

```yaml
Inspiracion_Revolut:
  layout:
    - Full viewport height o near-full (min-h-[85vh])
    - Fondo oscuro solido (bg-[#0A0A0A])
    - Titulo grande centrado arriba
    - Descripcion/subheadline debajo
    - Boton CTA blanco (como PainPointsPAS)
    - Elemento visual 3D central (ocupa ~50% del viewport)
    - Tabs en la parte inferior para navegar entre beneficios

  elemento_visual_3D:
    revolut_usa: "3 monedas metalicas 3D con logos de empresas que rotan"
    nuestro_equivalente: "3 esferas/discos metalicos 3D que representan cada beneficio"
    opciones_implementacion:
      opcion_1_css_3d:
        descripcion: "CSS 3D transforms + Framer Motion para rotacion"
        pros: "Cero dependencias, rendimiento excelente, control total"
        contras: "No es 3D real, limitado a transforms"
        complejidad: 6/10
      opcion_2_three_js:
        descripcion: "React Three Fiber (@react-three/fiber + @react-three/drei)"
        pros: "3D real, iluminacion, reflexiones metalicas, profesional"
        contras: "Bundle size (+200KB), nueva dependencia, mas complejo"
        complejidad: 9/10
      opcion_3_spline:
        descripcion: "Embed de Spline (spline.design) - escena 3D en la nube"
        pros: "3D real sin codigo, editor visual, interactivo"
        contras: "Dependencia externa, latencia de carga, menos control"
        complejidad: 4/10
      opcion_4_lottie:
        descripcion: "Lottie animation exportada de After Effects"
        pros: "Animacion fluida, tamaño pequeño, probado"
        contras: "Necesita crear la animacion externamente, no interactivo"
        complejidad: 5/10

    recomendacion: "opcion_1_css_3d"
    razon: |
      CSS 3D + Framer Motion da el mejor balance:
      - Zero nuevas dependencias (ya tenemos motion/react)
      - Aspecto metalico con CSS gradients + shadows
      - Rotacion con motion.div animate={{ rotateY }}
      - Reflexion simulada con pseudo-elements
      - Responsive nativo
      - Rendimiento optimo (GPU accelerated)
      Si no satisface visualmente, escalar a opcion_2 (Three.js)

  interacciones:
    - Tabs cambian el beneficio visible (como PainPointsPAS)
    - Los 3 objetos 3D rotan continuamente (auto-rotate)
    - Al cambiar tab, el objeto central cambia con transicion
    - Hover en objeto: pausa rotacion, ligero scale up
    - Auto-rotate tabs: cada 6s (pausa en hover)
```

### Seccion Stats (tambien existe, separada)

```yaml
Stats_Existente:
  componente: components/sections/Stats.tsx
  posicion: 6ta seccion (antes de ContactForm)
  contenido:
    - 40% menos costes
    - 300+ negocios
    - 98% satisfaccion
    - 24/7 disponibilidad
  nota: |
    Stats es una seccion separada con numeros animados + particulas.
    Benefits/ROI es la que rediseñamos. No tocar Stats.
```

---

## Variables

```yaml
# Archivos
SECTION_FILE: "components/sections/Benefits.tsx"

# MARCA - colores oficiales
BG_PRIMARY: "#0A0A0A"
PRIMARY: "#2563EB"
PRIMARY_LIGHT: "#3B82F6"
PRIMARY_DARK: "#1D4ED8"
TEXT_PRIMARY: "#FFFFFF"
TEXT_SECONDARY: "#9CA3AF"

# Contenido - 3 escenas de beneficio
ESCENAS:
  - id: 'ahorro'
    tab_label: 'Ahorro'
    headline: 'Ahorra 2.500 euros al mes'
    subheadline: 'Reduce un 40% los costes operativos automatizando tareas repetitivas. Cero errores, cero horas extra.'
    stat: { value: 2500, prefix: '', suffix: ' EUR', label: 'ahorro mensual' }
    icon: TrendingDown  # o Wallet, PiggyBank
    disc_visual:
      emoji_o_icono: '💰'  # Usado dentro de la esfera 3D
      gradient_metallic: 'from-blue-400 via-slate-300 to-blue-600'
    cta: 'Calcular mi ahorro'

  - id: 'clientes'
    tab_label: 'Clientes'
    headline: 'Atiende 3x mas clientes'
    subheadline: 'Procesos 5x mas rapidos significan mas clientes atendidos al dia. Crece sin necesidad de contratar.'
    stat: { value: 3, suffix: 'x', label: 'mas capacidad' }
    icon: Users
    disc_visual:
      emoji_o_icono: '📈'
      gradient_metallic: 'from-emerald-400 via-slate-300 to-emerald-600'
    cta: 'Ver como funciona'

  - id: 'satisfaccion'
    tab_label: 'Satisfaccion'
    headline: 'Nunca pierdas un cliente'
    subheadline: 'Respuesta instantanea 24/7. El 98% de clientes reporta mayor satisfaccion con atencion automatizada.'
    stat: { value: 98, suffix: '%', label: 'satisfaccion' }
    icon: Heart
    disc_visual:
      emoji_o_icono: '⭐'
      gradient_metallic: 'from-amber-400 via-slate-300 to-amber-600'
    cta: 'Empezar ahora'

# Package manager
PKG_MANAGER: "npm"
```

---

## Code Structure

### Archivos a Modificar

```yaml
Modificar:
  - components/sections/Benefits.tsx     # Rediseno completo a Revolut-style

Crear_Nuevo:
  - components/ui/MetallicDisc.tsx       # Componente de disco/esfera 3D CSS
                                          # (solo si la logica 3D es compleja,
                                          #  sino inline en Benefits.tsx)

Instalar_Nuevo:
  - Ninguno (CSS 3D + motion/react existente)
  - SI se elige opcion Three.js: @react-three/fiber @react-three/drei three

Ya_Existen_Y_Se_Reutilizan:
  - components/magicui/number-ticker.tsx  # Stats animados en la card
  - components/magicui/border-beam.tsx    # Efecto en card (si se usa)
  - motion/react                          # AnimatePresence, rotacion

Eliminar_Del_Componente:
  - VitaEonCard (card component)
  - ShimmerButton por cada card (3 CTAs -> 1 CTA)
  - TextAnimate (no necesario)
  - Imagenes de fondo en cards
  - Gradientes multicolor (blue-cyan, purple-pink, orange-red)
```

### Nuevo Layout (Wireframe)

```
┌──────────────────────────────────────────────────────────────┐
│  min-h-[85vh], bg-[#0A0A0A]                                  │
│                                                               │
│     "Ahorra 2.500 euros al mes"                              │
│      ↑ Headline blanco, text-shadow, 4xl-6xl                │
│                                                               │
│     "Reduce un 40% los costes operativos..."                 │
│      ↑ Subheadline white/70-80, max-w-xl                    │
│                                                               │
│     [Descubre como]  ← Boton blanco rounded-full            │
│                                                               │
│              ┌─────┐  ┌─────┐  ┌─────┐                      │
│             /   💰  \/   📈  \/   ⭐  \                     │
│            │  ████  ││  ████  ││  ████  │   ← 3 discos      │
│            │  ████  ││  ████  ││  ████  │     metalicos      │
│             \      / \      / \      /       rotando          │
│              └─────┘  └─────┘  └─────┘       CSS 3D          │
│              (small)  (LARGE)  (small)                        │
│               dim      bright   dim                           │
│                                                               │
│     Disco central = beneficio activo (escala mayor)          │
│     Discos laterales = beneficios inactivos (escala menor)   │
│     Todos rotan en Y-axis continuamente                      │
│                                                               │
│     [Ahorro]  [Clientes]  [Satisfaccion]  ← Tabs bottom     │
│      ACTIVE    inactive    inactive                           │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### CSS 3D Disc Component

```tsx
// Disco metalico con CSS 3D transforms
// - perspective en el container padre
// - transform: rotateY() animado con Framer Motion
// - background: gradiente metalico (simula reflexion)
// - box-shadow para profundidad
// - border-radius: 50% para forma circular
// - aspect-ratio: 1 (cuadrado -> circulo)
// - Pseudo-element ::after para "grosor" del disco (edge)

interface MetallicDiscProps {
  icon: React.ReactNode;          // Icono o emoji dentro del disco
  gradient: string;                // Tailwind gradient classes
  size: 'sm' | 'md' | 'lg';       // sm=120px, md=180px, lg=220px
  isActive: boolean;               // true = escala grande, brillo
  rotationSpeed?: number;          // velocidad de rotacion (default 8s)
}

// Implementacion CSS:
// .disc {
//   width: 220px; height: 220px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, metallic colors);
//   box-shadow:
//     0 0 30px rgba(37,99,235,0.15),  /* glow */
//     inset 0 0 40px rgba(255,255,255,0.1);  /* inner light */
//   transform-style: preserve-3d;
//   animation: rotate3d 8s linear infinite;
// }
// .disc::after {
//   /* Edge/thickness of the disc */
//   content: '';
//   position: absolute;
//   inset: 0;
//   border-radius: 50%;
//   background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.4));
//   transform: translateZ(-10px);
// }
// @keyframes rotate3d {
//   from { transform: rotateY(0deg); }
//   to { transform: rotateY(360deg); }
// }
```

### Estructura del Componente Benefits

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingDown, Users, Heart, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { NumberTicker } from '@/components/magicui/number-ticker';

interface BenefitScene {
  id: string;
  tabLabel: string;
  headline: string;
  subheadline: string;
  stat: {
    value: number;
    prefix?: string;
    suffix: string;
    label: string;
  };
  icon: LucideIcon;
  discGradient: string;
  discIcon: string;  // emoji
}

const scenes: BenefitScene[] = [/* ... 3 escenas ... */];

export function Benefits() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Auto-rotate (6s)
  // ...mismo patron que PainPointsPAS...

  const currentScene = scenes[activeIndex];

  return (
    <section className="relative min-h-[85vh] bg-[#0A0A0A] overflow-hidden flex flex-col">
      {/* Top: headline + subheadline + CTA */}
      <div className="flex-1 flex flex-col items-center justify-start pt-20 px-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentScene.id} /* fade in/out */>
            <h2>...</h2>
            <p>...</p>
            <button /* blanco como PainPointsPAS */>Descubre como</button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Center: 3D Discs */}
      <div className="flex items-center justify-center gap-6 py-8"
           style={{ perspective: '1000px' }}>
        {scenes.map((scene, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.div
              key={scene.id}
              className={`
                rounded-full flex items-center justify-center
                ${isActive ? 'w-48 h-48 md:w-56 md:h-56' : 'w-32 h-32 md:w-40 md:h-40 opacity-50'}
              `}
              style={{
                background: `linear-gradient(135deg, ${scene.discGradient})`,
                boxShadow: isActive
                  ? '0 0 40px rgba(37,99,235,0.2), inset 0 0 30px rgba(255,255,255,0.1)'
                  : '0 0 10px rgba(0,0,0,0.3)',
              }}
              animate={{
                rotateY: shouldReduceMotion ? 0 : [0, 360],
                scale: isActive ? 1 : 0.7,
              }}
              transition={{
                rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.4 },
              }}
              onClick={() => setActiveIndex(i)}
            >
              <span className="text-5xl md:text-6xl">{scene.discIcon}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Glassmorphism card con stat (opcional, como PainPointsPAS) */}
      {/* ... */}

      {/* Tabs bottom */}
      <nav className="flex justify-center gap-3 pb-10 pt-2">
        {/* mismo estilo que PainPointsPAS */}
      </nav>
    </section>
  );
}
```

---

## Instructions

### Fase 1: Implementar CSS 3D Discs (@frontend)

**Reglas de marca obligatorias (mismas que PainPointsPAS):**
- Background: `bg-[#0A0A0A]`
- Primary accent: `#2563EB`
- Texto: blanco con text-shadow, secondary `#9CA3AF`
- Tabs: blanco = activo, glass = inactivo
- CTA: boton blanco rounded-full (identico a PainPointsPAS)

**Implementacion paso a paso:**

1. **Container con perspective:**
   ```tsx
   <div style={{ perspective: '1200px' }}>
   ```

2. **3 discos metalicos:**
   - Circulares (border-radius: 50%)
   - Gradientes metalicos CSS (simular cromado/plata)
   - El disco activo es mas grande (w-56 h-56) y tiene glow
   - Los discos inactivos son mas pequeños (w-36 h-36) y dim
   - Rotacion continua en Y-axis con motion.div animate
   - Click en un disco = cambiar tab activo

3. **Efecto metalico CSS:**
   ```css
   background: conic-gradient(
     from 0deg,
     #374151 0%,
     #9CA3AF 25%,
     #E5E7EB 40%,
     #9CA3AF 55%,
     #374151 70%,
     #6B7280 85%,
     #374151 100%
   );
   ```
   Esto simula la reflexion metalica de Revolut.

4. **Icono/emoji centrado dentro del disco:**
   - fontSize grande (text-5xl en activo, text-3xl en inactivo)
   - transform: rotateY inverso para que no gire con el disco
   - O alternativamente, que gire con el disco (como Revolut)

5. **Transicion entre escenas:**
   - AnimatePresence mode="wait" para headline/subheadline
   - Scale transition para discos (activo/inactivo)
   - Glow transition en disco activo

### Fase 2: Contenido y copy (@marketing-expert)

1. Revisar headlines y subheadlines
2. Asegurar framework PAS: Beneficio → Evidencia → CTA
3. Un unico CTA por escena (no 3 diferentes)

### Fase 3: Responsive y Performance (@frontend)

**Breakpoints:**
| Breakpoint | Discos | Headline | Card |
|------------|--------|----------|------|
| Mobile (<640px) | 3 inline, activo=w-40 h-40 | text-3xl | max-w-xs |
| Tablet (640-1024px) | 3 inline, activo=w-48 h-48 | text-4xl | max-w-sm |
| Desktop (>1024px) | 3 inline, activo=w-56 h-56 | text-5xl | max-w-sm |

**Performance:**
- [ ] CSS transforms son GPU-accelerated (no reflow)
- [ ] will-change: transform en discos
- [ ] useReducedMotion: mostrar discos estaticos
- [ ] No usar Three.js ni WebGL (CSS puro + Framer Motion)

### Fase 4: Glassmorphism Card con Stat (como PainPointsPAS) (@frontend)

Debajo de los discos, mostrar una card glass con:
- Label corto (e.g. "ahorro mensual")
- Stat grande con NumberTicker (e.g. "2.500 EUR")
- Badge con tab activo
- BorderBeam sutil

### Fase 5: Build y Verificacion (@frontend)

```bash
npm run build
npm run dev
```

**Checklist visual:**
- [ ] Background #0A0A0A
- [ ] 3 discos metalicos con rotacion 3D
- [ ] Disco activo: grande + glow + brillo
- [ ] Discos inactivos: pequeños + dim + click cambia tab
- [ ] Headline/subheadline cambian con crossfade
- [ ] CTA blanco identico a PainPointsPAS
- [ ] Card glass con stat y NumberTicker
- [ ] Tabs en bottom (blanco activo, glass inactivo)
- [ ] Auto-rotate 6s con pausa en hover
- [ ] Responsive mobile/tablet/desktop
- [ ] prefers-reduced-motion: discos estaticos

**Checklist marca:**
- [ ] Zero colores fuera de paleta (#2563EB, #0A0A0A, #FFF, #9CA3AF)
- [ ] Gradientes metalicos son neutros (grises/plata), no coloreados
- [ ] Glow del disco activo es azul #2563EB
- [ ] No hay gradientes multicolor (blue-cyan, purple-pink, orange-red)

### Fase 6: Review (@gentleman)

1. Verificar coherencia con PainPointsPAS (mismo patron de seccion)
2. Verificar que los discos CSS se ven bien en todos los navegadores
3. Verificar rendimiento (FPS de animacion 3D CSS)
4. Si CSS 3D no satisface visualmente → escalar a Three.js
5. VERDICT: APPROVED / NEEDS_REVISION / ESCALATE_TO_THREEJS

---

## Workflow

```bash
# 1. PLANIFICACION (ESTE DOCUMENTO)
# Revisar y aprobar plan

# 2. CONFIRMAR PLAN
# Usuario aprueba: "Procede con el redesign de Benefits"

# 3. EJECUCION
# Fase 1: @frontend implementa CSS 3D + layout Revolut-style
# Fase 2: @marketing-expert mejora copy si es necesario
# Fase 3: @frontend responsive + performance + a11y
# Fase 4: @frontend card glass con stat
# Fase 5: @frontend build + verificacion
# Fase 6: @gentleman review final

# 4. COMMIT
# git add components/sections/Benefits.tsx
# git commit -m "feat(benefits): redesign to Revolut-style with 3D CSS discs
#
# - Full viewport section with dark background
# - 3 metallic 3D CSS discs with continuous Y-axis rotation
# - Active disc: larger + blue glow, inactive: smaller + dimmed
# - Tab navigation at bottom (same pattern as PainPointsPAS)
# - AnimatePresence crossfade for headlines
# - Glassmorphism stat card with NumberTicker
# - Single white CTA button per scene
# - Auto-rotate 6s with hover pause
# - Responsive (mobile/tablet/desktop)
# - prefers-reduced-motion support
# - Brand colors only: #2563EB, #0A0A0A
#
# Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Report

```yaml
Expected_Output:
  archivos_modificados:
    - components/sections/Benefits.tsx      # Rediseno completo

  archivos_nuevos:
    - Ninguno (CSS 3D inline en Benefits.tsx)

  elementos_eliminados:
    - VitaEonCard
    - ShimmerButton x3 (3 CTAs -> 1 CTA blanco)
    - TextAnimate
    - Imagenes de fondo en cards
    - Gradientes multicolor por card

  nuevo_stack:
    background: "bg-[#0A0A0A] solido"
    headline: "Texto blanco con text-shadow, crossfade entre escenas"
    cta: "Boton blanco rounded-full (identico a PainPointsPAS)"
    visual_3d: "3 discos metalicos CSS con rotateY continuo"
    card: "Glassmorphism card con stat + NumberTicker"
    navegacion: "Tabs bottom (mismo patron PainPointsPAS)"
    transiciones: "AnimatePresence crossfade + scale transitions"

  coherencia_con_painpoints:
    - Mismo patron de tabs bottom
    - Mismo boton CTA blanco
    - Mismo fondo #0A0A0A
    - Misma tipografia y shadows
    - Misma card glass con stat
    - Mismo auto-rotate 6s

  metricas_performance:
    fps_animacion: "> 55fps (CSS transforms son GPU-accelerated)"
    bundle_size_added: "0KB (CSS puro, no Three.js)"
    lighthouse_perf: "> 90"

  escalation_path: |
    Si CSS 3D no satisface visualmente:
    1. Evaluar Three.js con React Three Fiber
    2. npm install @react-three/fiber @react-three/drei three
    3. Crear escena 3D con materiales PBR metalicos
    4. Overhead: ~200KB bundle, pero calidad 3D real
```

---

## Diferencias Clave vs Diseno Anterior

| Aspecto | Anterior | Nuevo (Revolut-style) |
|---------|----------|----------------------|
| **Layout** | Grid 3 columnas | Full viewport, 1 escena a la vez |
| **Visual** | Imagenes de fondo pixeladas | Discos 3D metalicos CSS rotando |
| **CTAs** | 3 ShimmerButtons diferentes | 1 boton blanco por escena |
| **Colores** | Multiples gradientes | Metalico neutro + glow #2563EB |
| **Navegacion** | Scroll pasivo | Tabs interactivos + click en discos |
| **Stats** | Solo texto en cards | NumberTicker en card glass |
| **Background** | slate-950 | #0A0A0A (brand) |
| **Coherencia** | Distinto a PainPointsPAS | Mismo patron visual |

---

## Alternativas Consideradas

### Si CSS 3D no convence visualmente

**Three.js (React Three Fiber):**
```bash
npm install @react-three/fiber @react-three/drei three @types/three
```

```tsx
import { Canvas } from '@react-three/fiber';
import { Environment, MeshDistortMaterial } from '@react-three/drei';

function MetallicSphere({ position, isActive }) {
  return (
    <mesh position={position} scale={isActive ? 1.5 : 0.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#9CA3AF"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}

// En el componente:
<Canvas camera={{ position: [0, 0, 5] }}>
  <Environment preset="city" />
  <MetallicSphere position={[-2, 0, 0]} isActive={activeIndex === 0} />
  <MetallicSphere position={[0, 0, 0]} isActive={activeIndex === 1} />
  <MetallicSphere position={[2, 0, 0]} isActive={activeIndex === 2} />
</Canvas>
```

**Pros:** 3D real con reflexiones, identical a Revolut.
**Contras:** +200KB bundle, mas complejidad.

### Lottie Animation
Exportar animacion de After Effects con 3 discos metalicos rotando.
**Pros:** Ligero, fluido.
**Contras:** Necesita crear la animacion externamente.

---

## Notes

### Decisiones de Diseno Fundamentadas
- **CSS 3D primero**: Minimo overhead, si no satisface escalamos a Three.js
- **Mismo patron que PainPointsPAS**: Coherencia visual en toda la landing
- **Un CTA por escena**: No confundir al usuario con 3 CTAs
- **Discos metalicos**: Representan valor/moneda (como Revolut) pero en nuestro contexto = ROI
- **Auto-rotate + tabs**: Engagement sin requerir interaccion
- **Gradiente metalico neutro**: Los discos son plata/cromo, el glow azul solo en el activo

### Referencia Visual (Revolut)
- 3 monedas/discos metalicos 3D centrados
- El disco central es mas grande y brillante
- Los laterales son mas pequeños y dimmed
- Todos rotan continuamente en Y-axis
- Efecto metalico con reflexiones de luz
- Fondo completamente negro
- Tipografia grande encima, tabs debajo

---

## Skills y Agents Adjuntos

### Skills Requeridos
| Skill | Comando | Cuando Usar |
|-------|---------|-------------|
| **StudioTek Enhancer** | `/studiotek-landing-enhancer` | Entender estructura, brand |
| **Tailwind CSS** | `/tailwind` | Estilos responsive, 3D transforms |
| **React 19** | `/react-19` | Hooks, AnimatePresence |
| **Next.js** | `/nextjs` | Dynamic imports si Three.js |

### Agents Requeridos
| Agente | Invocacion | Especialidad |
|--------|------------|--------------|
| **@frontend** | `@frontend` | CSS 3D, animaciones, layout completo |
| **@gentleman** | `@gentleman` | Review arquitectura, decision CSS vs Three.js |
| **@marketing-expert** | `@marketing-expert` | Copy de beneficios si necesario |

---

*Ultima actualizacion: 31 Enero 2026*
*Version: 1.0 - Benefits Revolut-style Redesign*
*Estado: PENDING_APPROVAL*
