# Plan de Ejecucion: Optimizacion Landing Page con Ideas Design System

> **Generado:** 2026-01-14
> **Issue:** N/A (optimizacion visual)
> **Branch:** main

## Variables

```yaml
ISSUE_ID: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
WORKFLOW_ID: "2026-01-14_landing-optimization-ideas-design"
```

## Purpose

Optimizar la landing page de StudioTek aplicando patrones del Ideas Design System:
- Mejorar animaciones existentes
- Agregar efectos visuales premium
- Crear transiciones fluidas entre secciones
- Aplicar componentes MagicUI donde sea apropiado

**Secciones actuales:**
- Hero: AnimatedGridPattern + TextAnimate + ShimmerButton
- Benefits: 3 VitaEonCards con iconos
- Services: 3 VitaEonCards con feature lists
- HowItWorks: 4 cards con animacion secuencial
- Stats: NumberTicker + Particles
- ContactForm: VitaEonCard + FiberOptics

## Code Structure

```yaml
CREATE:
  - "components/ui/SectionDivider.tsx"
  - "components/ui/FloatingOrbs.tsx"

MODIFY:
  - "app/globals.css"
  - "components/sections/Hero.tsx"
  - "components/sections/Benefits.tsx"
  - "components/sections/Services.tsx"
  - "components/sections/Stats.tsx"
  - "components/animations/SpeedGaugeAnimation.tsx"
  - "components/animations/FloatingTagsAnimation.tsx"
  - "app/page.tsx"

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 0: Critical Fixes

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 0: Fix critical bugs",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar SL017-SL024 sobre animaciones y cards
     - blockers: SLB001, SLB002 conocidos

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones relevantes sobre animaciones

  # CONTEXTO

  - Branch: main
  - Archivos: Stats.tsx, SpeedGaugeAnimation.tsx, FloatingTagsAnimation.tsx

  # TAREA

  ## 1. Fix Stats.tsx delay bug

  El delay actual es 10 segundos (demasiado largo). Cambiar a valores razonables:

  ```tsx
  // ANTES (lineas 49, 60, 64-66):
  <BlurFade delay={10} inView>
  <BlurFade key={stat.label} delay={10 + index * 0.1} inView>
  <NumberTicker delay={10 + index * 0.1} ...

  // DESPUES:
  <BlurFade delay={0.1} inView>
  <BlurFade key={stat.label} delay={0.2 + index * 0.1} inView>
  <NumberTicker delay={0.3 + index * 0.15} ...
  ```

  ## 2. Fix SpeedGaugeAnimation.tsx

  El transformOrigin con px no funciona en SVG. Usar patron translate wrapper:

  ```tsx
  // Envolver la animacion de la aguja con:
  <g transform={`translate(${cx} ${cy})`}>
    <motion.g animate={{ rotate: [...] }} transition={...}>
      <g transform={`translate(${-cx} ${-cy})`}>
        {/* Contenido de la aguja */}
      </g>
    </motion.g>
  </g>
  ```

  ## 3. Fix FloatingTagsAnimation.tsx

  Mejorar posicionamiento usando top con porcentajes:

  ```tsx
  // Cambiar de y con pixeles a top con porcentajes
  style={{ left: `${position.x}%`, transform: 'translateX(-50%)' }}
  animate={{
    opacity: [0, 1, 1, 0],
    top: ['85%', '60%', '35%', '10%'],
  }}
  ```

  # Archivos

  MODIFY:
  - components/sections/Stats.tsx
  - components/animations/SpeedGaugeAnimation.tsx
  - components/animations/FloatingTagsAnimation.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados con cambios especificos
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `blockers:` agregar:
     - id: "SLB003"
       symptom: "transformOrigin con px no funciona en SVG con Framer Motion"
       solution: "Usar patron translate wrapper: g[translate(cx cy)] > motion.g > g[translate(-cx -cy)]"
       domain_context: "Animaciones SVG"

     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso, Stats visible rapidamente

---

### FASE 1: CSS Utilities y Componentes Base

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Add CSS utilities and base components",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Revisar patrones de animacion establecidos
     - file_patterns_discovered: Verificar estructura de componentes

  # CONTEXTO

  - Branch: main
  - Objetivo: Crear utilidades CSS y componentes reutilizables para efectos visuales

  # TAREA

  ## 1. Agregar keyframes a globals.css

  Agregar al final del archivo:

  ```css
  /* Floating animation for decorative elements */
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }

  @keyframes float-delayed {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(-2deg); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite;
    animation-delay: 2s;
  }

  /* Glow pulse for active elements */
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }
  ```

  ## 2. Crear SectionDivider.tsx

  ```tsx
  'use client';

  import { cn } from '@/lib/utils';

  interface SectionDividerProps {
    className?: string;
    variant?: 'gradient' | 'line' | 'wave';
    color?: 'blue' | 'indigo' | 'emerald';
  }

  const colorMap = {
    blue: { from: 'from-blue-500/0', via: 'via-blue-500/30', to: 'to-blue-500/0' },
    indigo: { from: 'from-indigo-500/0', via: 'via-indigo-500/30', to: 'to-indigo-500/0' },
    emerald: { from: 'from-emerald-500/0', via: 'via-emerald-500/30', to: 'to-emerald-500/0' },
  };

  export function SectionDivider({
    className,
    variant = 'gradient',
    color = 'blue',
  }: SectionDividerProps) {
    const colors = colorMap[color];

    if (variant === 'line') {
      return (
        <div className={cn('relative h-px w-full', className)}>
          <div className={cn(
            'absolute inset-0 bg-gradient-to-r',
            colors.from, colors.via, colors.to
          )} />
        </div>
      );
    }

    return (
      <div className={cn('relative h-24 w-full overflow-hidden', className)}>
        <div className={cn(
          'absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent'
        )} />
        <div className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'h-px w-2/3 bg-gradient-to-r',
          colors.from, colors.via, colors.to
        )} />
      </div>
    );
  }
  ```

  ## 3. Crear FloatingOrbs.tsx

  ```tsx
  'use client';

  import { cn } from '@/lib/utils';

  interface FloatingOrbsProps {
    className?: string;
    color?: string;
    count?: number;
  }

  export function FloatingOrbs({
    className,
    color = 'blue',
    count = 2,
  }: FloatingOrbsProps) {
    const colorClasses = {
      blue: 'bg-blue-500/10',
      indigo: 'bg-indigo-500/10',
      cyan: 'bg-cyan-500/10',
    };

    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        {count >= 1 && (
          <div
            className={cn(
              'absolute top-20 right-20 h-96 w-96 rounded-full blur-3xl animate-float',
              colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
            )}
            aria-hidden="true"
          />
        )}
        {count >= 2 && (
          <div
            className={cn(
              'absolute bottom-20 left-20 h-80 w-80 rounded-full blur-3xl animate-float-delayed',
              colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
            )}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
  ```

  # Archivos

  CREATE:
  - components/ui/SectionDivider.tsx
  - components/ui/FloatingOrbs.tsx

  MODIFY:
  - app/globals.css

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe de archivos creados/modificados
  2. Estado: SUCCESS | PARTIAL | BLOCKED

  3. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL025"
       context: "Decorative floating elements for sections"
       decision: "Usar animate-float con translateY(-20px) y rotate(3deg) para movimiento organico"
       confidence: 0.90
       validated_in: "Landing optimization"

     En `file_patterns_discovered:` agregar:
     - pattern: "components/ui/SectionDivider.tsx"
       purpose: "Animated divider between page sections"
     - pattern: "components/ui/FloatingOrbs.tsx"
       purpose: "Decorative floating blur orbs for backgrounds"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso, nuevos componentes importables

---

### FASE 2: Hero Section Enhancement

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Enhance Hero section with MagicUI",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL003 (smooth scroll), SL025 (floating elements)
     - file_patterns_discovered: Hero.tsx location

  # CONTEXTO

  - Branch: main
  - Archivo: components/sections/Hero.tsx
  - Componentes disponibles: OrbitingCircles, FloatingOrbs

  # TAREA

  Agregar efectos visuales al Hero section:

  ## 1. Importar componentes necesarios

  ```tsx
  import { OrbitingCircles } from '../magicui/orbiting-circles';
  import { FloatingOrbs } from '../ui/FloatingOrbs';
  ```

  ## 2. Agregar FloatingOrbs como background

  Dentro del section, despues del AnimatedGridPattern:

  ```tsx
  {/* Floating decorative orbs */}
  <FloatingOrbs color="blue" count={2} className="opacity-50" />
  ```

  ## 3. Agregar OrbitingCircles sutiles (opcional - solo si mejora visualmente)

  Considerar agregar orbitas decorativas cerca del titulo. Si se agrega:

  ```tsx
  <div className="absolute top-1/4 right-10 lg:right-1/4 opacity-30 pointer-events-none">
    <OrbitingCircles
      className="h-3 w-3 bg-blue-500/40"
      radius={60}
      duration={20}
      delay={0}
    />
    <OrbitingCircles
      className="h-2 w-2 bg-cyan-400/40"
      radius={80}
      duration={25}
      delay={10}
      reverse
    />
  </div>
  ```

  ## 4. Mejorar timing de animaciones de texto

  Ajustar delays para mejor secuencia:
  - Titulo: delay={0.1}
  - Subtitulo: delay={0.3}
  - CTAs: delay={0.5}

  # Archivos

  MODIFY:
  - components/sections/Hero.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Elementos visuales agregados
     - Performance impact (si hay)
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL026"
       context: "OrbitingCircles in Hero background"
       decision: "Usar opacity-30, radius 60-80, duration 20-25s para efecto sutil sin distraer"
       confidence: 0.85
       validated_in: "Hero enhancement"

     Actualizar metadata
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Hero muestra efectos visuales mejorados

---

### FASE 3: Cards Polish - Benefits y Services

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Polish card animations and interactions",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL007 (icons), SL014 (hover effects), SL023 (card alignment)

  # CONTEXTO

  - Branch: main
  - Archivos: Benefits.tsx, Services.tsx

  # TAREA

  ## 1. Benefits.tsx - Agregar animacion a iconos en hover

  El icono ya tiene un contenedor con gradient. Agregar transicion:

  ```tsx
  // Cambiar el div del icono de:
  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-6 shadow-lg shadow-blue-500/20`}>

  // A:
  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.gradient} mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
  ```

  Asegurarse de que VitaEonCard o su wrapper tenga `group` class.

  ## 2. Services.tsx - Ya tiene group-hover:scale-110

  Agregar rotacion sutil:

  ```tsx
  // Cambiar de:
  className={`... group-hover:scale-110 transition-transform duration-300`}

  // A:
  className={`... group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
  ```

  ## 3. Verificar consistencia visual

  - Ambas secciones deben tener el mismo estilo de hover
  - Shadow glow debe coincidir con el gradient del icono
  - Transiciones deben ser suaves (duration-300)

  # Archivos

  MODIFY:
  - components/sections/Benefits.tsx
  - components/sections/Services.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios de CSS/clases
     - Verificar que animaciones de SpeedGauge y FloatingTags funcionan
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL027"
       context: "Card icon hover animations"
       decision: "group-hover:scale-110 + group-hover:rotate-3 con transition-all duration-300"
       confidence: 0.95
       validated_in: "Cards polish"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Iconos de cards animan en hover

---

### FASE 4: Section Transitions

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 4: Add section transitions",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL025, SL026, SL027
     - file_patterns_discovered: page.tsx structure

  # CONTEXTO

  - Branch: main
  - Archivo: app/page.tsx
  - Componente: SectionDivider (creado en FASE 1)

  # TAREA

  Agregar transiciones visuales entre secciones:

  ## 1. Importar SectionDivider

  ```tsx
  import { SectionDivider } from '@/components/ui/SectionDivider';
  ```

  ## 2. Agregar dividers entre secciones

  ```tsx
  export default function Home() {
    return (
      <main>
        <Hero />
        <SectionDivider color="blue" variant="gradient" />
        <Benefits />
        <SectionDivider color="indigo" variant="line" />
        <Services />
        <SectionDivider color="emerald" variant="gradient" />
        <HowItWorks />
        <SectionDivider color="blue" variant="line" />
        <Stats />
        <ContactForm />
      </main>
    );
  }
  ```

  ## 3. Verificar espaciado

  Los dividers agregan altura (h-24 o h-px). Verificar que el espaciado entre secciones sigue siendo armonioso.

  Si es necesario, ajustar py de secciones adyacentes.

  # Archivos

  MODIFY:
  - app/page.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Dividers agregados y ubicaciones
     - Ajustes de espaciado realizados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` agregar:
     - id: "SL028"
       context: "Section transitions pattern"
       decision: "Alternar variant='gradient' (h-24) y variant='line' (h-px) entre secciones; color match al tema de seccion"
       confidence: 0.90
       validated_in: "Section transitions"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Transiciones visibles entre secciones

---

### FASE 5: Validacion Final

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 5: Final validation",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`

  # CONTEXTO

  Validar todas las mejoras implementadas en la landing page.

  # TAREAS

  ## 1. Build y Lint

  ```bash
  npm run build
  npm run lint
  ```

  ## 2. Verificacion Visual (checklist)

  ### Hero Section
  - [ ] AnimatedGridPattern visible
  - [ ] FloatingOrbs animando suavemente
  - [ ] Texto aparece con animacion blur
  - [ ] CTAs funcionan (smooth scroll)

  ### Benefits Section
  - [ ] 3 cards alineadas correctamente
  - [ ] Iconos animan en hover (scale + rotate)
  - [ ] SpeedGaugeAnimation: aguja rota correctamente
  - [ ] FloatingTagsAnimation: tags visibles y animando
  - [ ] ChatInputAnimation: texto typing visible

  ### Services Section
  - [ ] 3 cards con hover effects
  - [ ] Iconos animan en hover

  ### HowItWorks Section
  - [ ] Animacion secuencial funciona
  - [ ] Cards se iluminan progresivamente

  ### Stats Section
  - [ ] Numeros aparecen rapidamente (no delay de 10s)
  - [ ] NumberTicker anima correctamente
  - [ ] Particles visible

  ### Section Transitions
  - [ ] Dividers visibles entre secciones
  - [ ] Gradientes fluyen suavemente

  ### Performance
  - [ ] No hay layout shift visible
  - [ ] Animaciones son fluidas (60fps)
  - [ ] Sin errores en console

  ### Responsive
  - [ ] Mobile (375px): Todo visible y funcional
  - [ ] Tablet (768px): Layout correcto
  - [ ] Desktop (1440px): Efectos completos

  # CRITERIOS DE EXITO

  - Build: Exit code 0
  - Lint: Sin errores criticos
  - Visual: Todos los checkboxes marcados
  - Performance: Sin jank visible

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final con:
     - Resultados de build/lint
     - Estado de cada checkbox
     - Issues encontrados (si hay)
     - Estado global: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml`:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0, visual checklist 100%

---

## Checkpoints

| CP  | Fase   | Criterio                              | Comando                          |
| --- | ------ | ------------------------------------- | -------------------------------- |
| CP0 | FASE 0 | Critical fixes aplicados, Stats OK    | `npm run build`                  |
| CP1 | FASE 1 | CSS keyframes y componentes creados   | `npm run build`                  |
| CP2 | FASE 2 | Hero con efectos visuales mejorados   | `npm run build`                  |
| CP3 | FASE 3 | Card icons animan en hover            | `npm run build`                  |
| CP4 | FASE 4 | Section dividers visibles             | `npm run build`                  |
| CP5 | FASE 5 | Build + lint + visual checklist       | `npm run build && npm run lint`  |

## Risk Matrix

| Riesgo                                    | Impacto | Mitigacion                              |
| ----------------------------------------- | ------- | --------------------------------------- |
| OrbitingCircles afecta performance        | Medio   | Usar opacity baja, limitar cantidad     |
| Floating orbs distraen del contenido      | Bajo    | opacity-50, blur-3xl, colores sutiles   |
| SVG transform fix no funciona             | Alto    | Probar patron translate wrapper         |
| Section dividers rompen layout            | Bajo    | Ajustar spacing si necesario            |
| Too many animations cause jank            | Medio   | will-change, reduce concurrent anims    |

---

## Notes

- Este plan INCORPORA el plan existente `2026-01-14_fix-benefits-animations.md` en FASE 0
- Cada fase es independiente y puede ejecutarse en secuencia
- Si una fase falla, se puede continuar con la siguiente (excepto FASE 0 que es critica)
- Ideas Design System patterns aplicados: floating orbs, section dividers, animate-float

---

**Workflow ID:** 2026-01-14_landing-optimization-ideas-design
**Fases:** 6
**Agentes:** @frontend, @testing
