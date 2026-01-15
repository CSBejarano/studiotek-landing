# Plan de Ejecucion: PHASE 3 - Hero Section

> **Generado:** 2026-01-13
> **Issue:** N/A (PRD-based)
> **Phase:** 3

## Variables

```yaml
ISSUE_ID: "N/A"
PHASE: "3"
BRANCH: "main"
DOMAIN: "frontend"
PRD_FILE: "PRD.md"
```

## Purpose

Implementar PHASE 3 del PRD.md: crear el componente Hero.tsx con headline, subheadline, dos CTAs y smooth scroll al formulario de contacto. Incluye prerequisitos (Project Setup y Layout) ya que el proyecto esta vacio.

## Code Structure

```yaml
CREATE:
  - "app/layout.tsx"
  - "app/page.tsx"
  - "app/globals.css"
  - "components/sections/Header.tsx"
  - "components/sections/Hero.tsx"
  - "components/sections/Footer.tsx"
  - "components/ui/Button.tsx"
  - "tailwind.config.ts"
  - "public/logo.svg"

MODIFY:
  - "package.json" (via npm install)

TESTS:
  - No test files (landing page, visual-only)
  - Checkpoint: npm run build
```

## WORKFLOW

### FASE 1: Project Setup

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Project Setup - Next.js + Tailwind",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/frontend.yaml`:
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones
     - file_patterns_discovered: Patrones utiles

  2. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones D034, D037, D038 relevantes para landing

  # CONTEXTO

  - PRD: PRD.md (ver Section 4.1-4.3 para stack y estructura)
  - Branch: main
  - Estado: Proyecto vacio, solo existe PRD.md

  # TAREA

  Inicializar proyecto Next.js con todas las configuraciones del PRD:

  1. Crear proyecto Next.js:
     ```bash
     cd /Users/cristianbejaranomendez/Documents/GitHub/studiotek-landing
     npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
     ```
     Responder "Yes" a todas las preguntas o usar flags para automatizar.

  2. Instalar dependencias:
     ```bash
     npm install resend zod react-hook-form @hookform/resolvers lucide-react
     npm install -D @tailwindcss/forms
     ```

  3. Configurar tailwind.config.ts con colores del PRD:
     ```typescript
     // Agregar colores custom
     colors: {
       primary: {
         DEFAULT: '#0066FF',
         hover: '#0052CC',
         light: '#E6F0FF',
       },
     }
     ```

  4. Crear estructura de carpetas:
     ```bash
     mkdir -p components/sections components/ui lib public
     ```

  5. Verificar que `npm run dev` funciona

  ## Archivos

  CREATE:
    - tailwind.config.ts (modificar el generado)
    - components/ (carpetas)
    - lib/ (carpeta)

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Si frontend.yaml no existe, crear con estructura basica.
     Actualizar metadata:
     - Incrementar tasks_handled
     - Actualizar updated_at
  """
)
~~~~~

**Checkpoint:**
- Comando: `cd /Users/cristianbejaranomendez/Documents/GitHub/studiotek-landing && npm run dev`
- Criterio: Server inicia en localhost:3000 sin errores

---

### FASE 2: Layout and Header

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: Layout, Header y Footer",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - D037: Logo href debe ser '/' no '#'
     - D038: Header simplificado - solo CTAs, no nav links

  # CONTEXTO

  - PRD: PRD.md Sections 2.3 (Typography), 3.5 (Footer content)
  - Branch: main
  - Prerequisito: FASE 1 completada

  # TAREA

  Crear layout raiz y componentes de navegacion:

  1. app/layout.tsx:
     - Inter font via next/font/google
     - Metadata SEO (ver PRD Section 6.1)
     - Body con Header + children + Footer
     - Structured data JSON-LD (opcional)

  2. components/sections/Header.tsx:
     - Fixed position (sticky top-0)
     - Logo a la izquierda (href="/")
     - CTA button a la derecha: "Contactar"
     - Fondo transparente con blur backdrop

  3. components/sections/Footer.tsx:
     - Logo y tagline
     - Email: comunicacion@studiotek.es
     - Links: Politica de Privacidad, Aviso Legal
     - Copyright 2026

  4. app/globals.css:
     - Tailwind imports
     - scroll-behavior: smooth (CSS fallback)

  5. Crear placeholder logo.svg en public/:
     ```svg
     <svg viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
       <text x="0" y="24" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="#0066FF">StudioTek</text>
     </svg>
     ```

  ## Archivos

  CREATE:
    - app/layout.tsx
    - app/globals.css
    - components/sections/Header.tsx
    - components/sections/Footer.tsx
    - public/logo.svg

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Problemas encontrados y soluciones
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Actualizar frontend.yaml con nuevas decisiones si aplica.
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build completa sin errores

---

### FASE 3: Hero Section (MAIN DELIVERABLE)

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 3: Hero Section con CTAs y smooth scroll",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer PRD.md Section 3.1 para copy exacto
  2. Leer PRD.md Section 2.2-2.5 para estilos

  # CONTEXTO

  - PRD: PRD.md Section 3.1 (Hero), 2.3 (Typography)
  - Branch: main
  - Prerequisito: FASE 2 completada

  # TAREA

  Crear componente Hero.tsx segun especificaciones:

  1. components/ui/Button.tsx:
     ```tsx
     interface ButtonProps {
       variant?: 'primary' | 'secondary';
       children: React.ReactNode;
       onClick?: () => void;
       className?: string;
     }

     export function Button({ variant = 'primary', children, onClick, className }: ButtonProps) {
       const baseStyles = "px-6 py-3 rounded-lg font-medium transition-colors duration-200";
       const variants = {
         primary: "bg-primary hover:bg-primary-hover text-white",
         secondary: "border border-primary text-primary hover:bg-primary-light"
       };
       return (
         <button
           className={`${baseStyles} ${variants[variant]} ${className}`}
           onClick={onClick}
         >
           {children}
         </button>
       );
     }
     ```

  2. components/sections/Hero.tsx:
     - id="hero" para navegacion
     - min-h-screen con flex items-center
     - Contenedor max-w-7xl mx-auto px-4
     - H1: "Automatiza tu negocio con Inteligencia Artificial"
       - Desktop: text-5xl font-bold
       - Mobile: text-3xl font-bold
     - Subheadline: "Ayudamos a PYMEs a reducir costes..."
       - text-xl text-slate-600 max-w-2xl mx-auto
     - CTAs:
       - Primary: "Solicita una consulta gratuita" -> scroll to #contact
       - Secondary: "Ver servicios" -> scroll to #services
       - Desktop: flex-row gap-4
       - Mobile: flex-col gap-3
     - Background: gradient from-white to-slate-50

  3. Smooth scroll function:
     ```tsx
     const scrollToSection = (id: string) => {
       document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
     };
     ```

  4. app/page.tsx:
     - Import y render Hero
     - Agregar placeholder sections con IDs:
       - #services (div vacio)
       - #contact (div vacio)

  ## Archivos

  CREATE:
    - components/ui/Button.tsx
    - components/sections/Hero.tsx
    - app/page.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados/modificados
     - Screenshot mental del resultado
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Nueva decision para frontend.yaml:
     - context: "Hero smooth scroll implementation"
       decision: "Use scrollIntoView with behavior: 'smooth' + CSS fallback"
       confidence: 0.95
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build && npm run dev`
- Criterio:
  - Hero visible con todo el contenido
  - CTAs clickeables
  - Layout responsive (verificar en devtools)

---

### FASE 4: Validation

**Agente:** @testing

~~~~~
Task(
  subagent_type: "testing",
  description: "FASE 4: Validacion final y build",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `.claude/skills/workflow-task/memoria/long_term.yaml`:
     - Buscar decisiones de testing relevantes

  # CONTEXTO

  - Prerequisito: FASES 1-3 completadas
  - Objetivo: Verificar que todo funciona correctamente

  # TAREA

  Ejecutar validaciones finales:

  1. Run production build:
     ```bash
     npm run build
     ```
     - Debe completar sin errores
     - Verificar output en .next/

  2. Run lint:
     ```bash
     npm run lint
     ```
     - Corregir cualquier error de lint

  3. Start production server y verificar:
     ```bash
     npm run start
     ```
     - Acceder a localhost:3000
     - Verificar Hero visible
     - Verificar Header fixed
     - Verificar Footer presente

  4. Verificar responsive:
     - Abrir DevTools
     - Probar 375px (mobile)
     - Probar 768px (tablet)
     - Probar 1280px (desktop)

  5. Verificar smooth scroll:
     - Click en CTA primario
     - Debe hacer scroll suave hacia abajo (aunque section este vacia)

  ## Criterios de Exito

  - [ ] npm run build: SUCCESS
  - [ ] npm run lint: 0 errors
  - [ ] Hero H1 visible
  - [ ] Hero subheadline visible
  - [ ] 2 CTAs visibles
  - [ ] Header fijo en scroll
  - [ ] Footer en bottom
  - [ ] Responsive layout funciona

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe final:
     - Todos los criterios: PASS/FAIL
     - Si BLOCKED, documentar causa
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Si SUCCESS, output: "HERO COMPLETE"
  """
)
~~~~~

**Checkpoint:**
- Comando: `npm run build`
- Criterio: Build exitoso, todos los criterios de aceptacion pasados

---

## Checkpoints

| CP  | Fase   | Criterio | Comando |
|-----|--------|----------|---------|
| CP1 | FASE 1 | Dev server starts | `npm run dev` |
| CP2 | FASE 2 | Build passes | `npm run build` |
| CP3 | FASE 3 | Hero renders with content | `npm run dev` + visual check |
| CP4 | FASE 4 | Production build + all criteria | `npm run build` |

## Risk Matrix

| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| npx create-next-app falla | HIGH | Usar pnpm o setup manual |
| Tailwind colors no aplican | MEDIUM | Verificar tailwind.config.ts paths |
| Smooth scroll Safari issue | LOW | CSS scroll-behavior como fallback |
| Font loading FOUT | LOW | next/font con display: swap |
| create-next-app sobrescribe archivos | LOW | Hacer backup de PRD.md y .claude/ |

## Decisiones Aplicadas

| ID | Decision | Aplicacion |
|----|----------|------------|
| D037 | Logo href = '/' | Header.tsx logo link |
| D038 | Header solo CTAs | No nav links en Header |

## Estimacion

| Fase | Tiempo | Agente |
|------|--------|--------|
| FASE 1 | 30 min | @frontend |
| FASE 2 | 20 min | @frontend |
| FASE 3 | 30 min | @frontend |
| FASE 4 | 10 min | @testing |
| **Total** | **90 min** | |

---

**Plan Version:** 1.0
**Estado:** READY FOR EXECUTION
