# Plan de Ejecucion: Cleanup Portfolio y Reutilizar Cards

> **Generado:** 2026-01-13T23:30:00Z
> **Issue:** N/A (cleanup task)
> **Phase:** N/A

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "N/A"
BRANCH: "main"
DOMAIN: "frontend"
```

## Purpose

1. Eliminar completamente la pagina /portfolio (app/portfolio/* y components/portfolio/*)
2. Reutilizar el diseno de las cards glassmorphism de Projects.tsx para la seccion "Como Trabajamos"
3. Limpiar assets no usados (public/secuencia/, secuencia/)
4. Limpiar CSS especifico del portfolio en globals.css

## Code Structure

```yaml
DELETE:
  # Portfolio pages and components
  - "app/portfolio/page.tsx"
  - "components/portfolio/ScrollyCanvas.tsx"
  - "components/portfolio/Projects.tsx"
  - "components/portfolio/ScrollyHero.tsx"
  - "components/portfolio/Overlay.tsx"

  # Asset directories (100+ files each)
  - "public/secuencia/"
  - "secuencia/"

MODIFY:
  - "components/sections/HowItWorks.tsx"  # Adaptar diseno de cards
  - "app/globals.css"  # Remover estilos .portfolio-page y .scrolly-container

TESTS:
  - "npm run build"
  - "npm run lint"
```

## WORKFLOW

### FASE 1: Adaptar HowItWorks con diseno Glassmorphism

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 1: Adaptar HowItWorks.tsx con estilo glassmorphism de Projects.tsx",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: SL012-SL016 sobre cards y efectos
     - blockers: Problemas conocidos con componentes UI

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones D053 (BookingCard CSS hover effects)

  # CONTEXTO

  - Branch: main
  - Archivo a modificar: components/sections/HowItWorks.tsx
  - Referencia de diseno: components/portfolio/Projects.tsx (leer antes de eliminar)

  # TAREA

  Modificar HowItWorks.tsx para usar el estilo glassmorphism de Projects.tsx:

  1. **Imports:**
     - Agregar: `import { motion } from 'framer-motion';`
     - Remover: `import { VitaEonCard }` y `import { ShimmerButton }`
     - Mantener: BlurFade, TextAnimate, iconos Lucide

  2. **Variables de animacion:**
     ```typescript
     const containerVariants = {
       hidden: { opacity: 0 },
       visible: {
         opacity: 1,
         transition: { staggerChildren: 0.1 }
       }
     };

     const itemVariants = {
       hidden: { opacity: 0, y: 40 },
       visible: {
         opacity: 1,
         y: 0,
         transition: { duration: 0.6, ease: 'easeOut' as const }
       }
     };
     ```

  3. **Agregar cardGradient a cada step:**
     - Analisis: `cardGradient: 'from-blue-500/20 to-cyan-500/20'`
     - Estrategia: `cardGradient: 'from-violet-500/20 to-purple-500/20'`
     - Implementacion: `cardGradient: 'from-amber-500/20 to-orange-500/20'`
     - Optimizacion: `cardGradient: 'from-emerald-500/20 to-green-500/20'`

  4. **Estructura de card glassmorphism:**
     ```jsx
     <motion.div variants={itemVariants} className="group relative">
       <div className={`
         relative overflow-hidden rounded-2xl
         bg-gradient-to-br ${step.cardGradient}
         backdrop-blur-xl
         border border-white/10
         p-8
         min-h-[280px]
         transition-all duration-500 ease-out
         hover:border-white/20
         hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
         hover:translate-y-[-4px]
       `}>
         {/* Glow effect */}
         <div className={`
           absolute -top-20 -right-20 w-40 h-40
           bg-gradient-to-br ${step.cardGradient}
           rounded-full blur-3xl
           opacity-0 group-hover:opacity-50
           transition-opacity duration-500
         `} />

         {/* Content */}
         <div className="relative z-10 h-full flex flex-col items-center text-center">
           {/* Step number badge */}
           <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg mb-4`}>
             {step.number}
           </div>

           {/* Icon */}
           <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg mb-5`}>
             <Icon size={28} strokeWidth={1.5} className="text-white" />
           </div>

           {/* Title */}
           <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>

           {/* Description */}
           <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
         </div>

         {/* Shine effect on hover */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
       </div>
     </motion.div>
     ```

  5. **Cambiar grid container:**
     ```jsx
     <motion.div
       variants={containerVariants}
       initial="hidden"
       whileInView="visible"
       viewport={{ once: true, margin: '-50px' }}
       className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-20"
     >
     ```

  6. **Remover:**
     - ShimmerButton de cada card
     - VitaEonCard wrapper
     - Connecting line div (opcional mantener o eliminar)
     - shimmerGradient de steps[] (ya no se usa)

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos modificados
     - Imports removidos vs agregados
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `decisions:` (nueva decision):
     - id: "SL019"
       context: "HowItWorks glassmorphism cards"
       decision: "Usar motion.div con stagger + glassmorphism bg-gradient backdrop-blur"
       confidence: 0.95
       validated_in: "cleanup-portfolio-cards"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run lint -- --no-warn-ignored components/sections/HowItWorks.tsx`
- Criterio: Sin errores de lint

### FASE 2: Eliminar Portfolio

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 2: Eliminar pagina y componentes de portfolio",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - file_patterns_discovered: Confirmar que portfolio no esta en patrones

  # CONTEXTO

  - Branch: main
  - Directorios a eliminar:
    - app/portfolio/
    - components/portfolio/

  # TAREA

  1. Eliminar directorio app/portfolio/ completo:
     ```bash
     rm -rf app/portfolio/
     ```

  2. Eliminar directorio components/portfolio/ completo:
     ```bash
     rm -rf components/portfolio/
     ```

  3. Verificar que no quedan imports rotos:
     ```bash
     grep -r "from.*portfolio" . --include="*.tsx" --include="*.ts"
     ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos eliminados: 5
     - Directorios eliminados: 2
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. No requiere actualizar frontend.yaml (solo eliminacion)
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls app/portfolio components/portfolio 2>&1 | grep -c "No such file"`
- Criterio: Debe retornar 2 (ambos directorios no existen)

### FASE 3: Limpiar Assets y CSS

**Agente:** @frontend

~~~~~markdown
Task(
  subagent_type: "frontend",
  description: "FASE 3: Eliminar assets secuencia y CSS de portfolio",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Verificar que ningun archivo activo referencia secuencia:
     ```bash
     grep -r "secuencia" . --include="*.tsx" --include="*.ts" --include="*.css" --exclude-dir=.claude --exclude-dir=ai_docs
     ```

  # CONTEXTO

  - Branch: main
  - Assets a eliminar: public/secuencia/, secuencia/
  - CSS a limpiar: app/globals.css

  # TAREA

  1. Eliminar directorio public/secuencia/:
     ```bash
     rm -rf public/secuencia/
     ```

  2. Eliminar directorio secuencia/:
     ```bash
     rm -rf secuencia/
     ```

  3. Modificar app/globals.css - eliminar seccion de portfolio:
     Remover estas lineas:
     ```css
     /* Portfolio Scrollytelling Styles */
     .portfolio-page {
       background: #121212;
     }

     /* Smooth scrolling for portfolio */
     .scrolly-container {
       will-change: scroll-position;
     }
     ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos eliminados: ~200+ (frames webp)
     - Lineas CSS removidas: ~10
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/frontend.yaml`:

     En `file_patterns_discovered:` - remover cualquier patron de portfolio
  """
)
~~~~~

**Checkpoint:**
- Comando: `ls public/secuencia secuencia 2>&1 | grep -c "No such file"`
- Criterio: Debe retornar 2

### FASE 4: Validacion

**Agente:** @testing

~~~~~markdown
Task(
  subagent_type: "testing",
  description: "FASE 4: Validar build y lint del proyecto",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/testing.yaml`:
     - Verificar checkpoints de validacion

  # CONTEXTO

  - Branch: main
  - Cambios: HowItWorks.tsx modificado, portfolio eliminado, assets limpiados

  # TAREA

  1. Ejecutar build:
     ```bash
     npm run build
     ```
     Criterio: Exit code 0

  2. Ejecutar lint:
     ```bash
     npm run lint
     ```
     Criterio: Sin errores (warnings OK)

  3. Verificar estructura de archivos:
     ```bash
     # Confirmar que portfolio no existe
     ls app/portfolio 2>&1 || echo "OK: portfolio eliminado"
     ls components/portfolio 2>&1 || echo "OK: portfolio components eliminado"
     ls public/secuencia 2>&1 || echo "OK: secuencia assets eliminado"
     ls secuencia 2>&1 || echo "OK: secuencia backup eliminado"
     ```

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final:
     - Build: PASS | FAIL
     - Lint: PASS | FAIL
     - Cleanup verificado: YES | NO
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar `ai_docs/expertise/domain-experts/testing.yaml` si hay nuevos patrones
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run lint`
- Criterio: Exit code 0 para ambos

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | FASE 1 | HowItWorks.tsx sin errores lint | `npm run lint -- --no-warn-ignored` |
| CP2 | FASE 2 | Directorios portfolio eliminados | `ls app/portfolio components/portfolio 2>&1` |
| CP3 | FASE 3 | Assets y CSS limpiados | `ls public/secuencia secuencia 2>&1` |
| CP4 | FASE 4 | Build y lint pasan | `npm run build && npm run lint` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| Imports rotos despues de eliminar portfolio | Alto | Grep por "portfolio" antes y despues |
| Build falla por dependencias ocultas | Alto | npm run build como checkpoint |
| CSS roto por clases eliminadas | Medio | Verificar que solo .portfolio-page y .scrolly-container se usan en portfolio |
| framer-motion no instalado | Bajo | Ya verificado en package.json (v12.26.2) |

## Resumen de Cambios

### Diseño de Cards (Projects.tsx -> HowItWorks.tsx)

**Caracteristicas glassmorphism reutilizadas:**
- `bg-gradient-to-br ${cardGradient}` - Fondo con gradiente semi-transparente
- `backdrop-blur-xl` - Efecto de blur de fondo
- `border border-white/10` - Borde sutil
- `hover:border-white/20 hover:translate-y-[-4px]` - Efecto hover elevacion
- Glow effect con `blur-3xl opacity-0 group-hover:opacity-50`
- Shine effect con gradiente animado en hover
- Framer Motion stagger animation

### Archivos Eliminados (Total: ~207)
- 5 archivos TSX (portfolio page + components)
- ~100+ frames en public/secuencia/
- ~100+ frames en secuencia/
- ~10 lineas CSS en globals.css
