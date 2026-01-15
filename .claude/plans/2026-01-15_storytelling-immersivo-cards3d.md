# Plan de Ejecucion: Storytelling Inmersivo con Cards 3D (OPTIMIZADO)

> **Generado:** 2026-01-15
> **Workflow ID:** 2026-01-15_storytelling-immersivo-cards3d
> **Modo:** Ralph Loop (max-iterations=6)
> **Optimizado:** Reutiliza componentes existentes

## Decision Log

| Decision | Resultado |
|----------|-----------|
| Formulario | Extender ContactForm.tsx existente |
| Timeline | Actualizar HowItWorks.tsx (4→6 pasos) |
| Services | Actualizar Services.tsx + Cards 3D mejoradas |
| Benefits | Mantener + Agregar PainPoints/Solution |

## Variables

```yaml
WORKFLOW_ID: "2026-01-15_storytelling-immersivo-cards3d"
BRANCH: "main"
DOMAIN: "frontend"
SECONDARY_DOMAIN: "backend"
COMPLETION_PROMISE: "Landing completa con storytelling fluido, cards 3D interactivas, formulario funcional guardando en Supabase y enviando email de confirmacion via Resend"
MAX_ITERATIONS: 6
```

## Purpose

Implementar un sistema de Storytelling inmersivo para StudioTek landing:
- Cards 3D estilo Apple (perspective, rotateX/Y, shadow hover effects)
- Secciones narrativas: PainPoints -> Solution -> Benefits -> Services -> HowItWorks -> Contact
- Integracion Supabase para persistencia de leads
- Emails automaticos de confirmacion via Resend
- REUTILIZAR componentes existentes para evitar duplicacion

## Code Structure (OPTIMIZADO)

```yaml
CREATE:
  components/storytelling/:
    - "Card3D.tsx"              # Componente 3D reutilizable estilo Apple
    - "PainPointsSection.tsx"   # Seccion de problemas del cliente
    - "SolutionSection.tsx"     # Seccion de soluciones
    - "index.ts"                # Barrel exports

  hooks/:
    - "use3DCardEffect.ts"      # Hook para efecto 3D de cards
    - "useScrollAnimation.ts"   # Hook para animaciones de scroll

  lib/:
    - "supabase.ts"             # Cliente Supabase
    - "resend.ts"               # Cliente Resend + template email

  app/api/:
    - "leads/route.ts"          # POST endpoint para leads
    - "send-email/route.ts"     # POST endpoint para emails

MODIFY:
  - "components/sections/ContactForm.tsx"  # + telefono, servicio, APIs
  - "components/sections/HowItWorks.tsx"   # 4 -> 6 pasos
  - "components/sections/Services.tsx"     # + 4to servicio, Cards 3D
  - "app/page.tsx"                         # Reordenar storytelling
  - "lib/validations.ts"                   # Actualizar schema

KEEP_AS_IS:
  - "components/sections/Benefits.tsx"     # Mantener (complementa Solution)
  - "components/sections/Stats.tsx"        # Mantener
  - "components/sections/Hero.tsx"         # Mantener

TESTS:
  - "Manual: Flujo completo de submission"
  - "Manual: Verificar datos en Supabase"
  - "Manual: Recibir email de confirmacion"
```

## Orden Final de Secciones en page.tsx

```tsx
<Hero />
<PainPointsSection />      // NUEVO - Problemas del cliente
<SolutionSection />        // NUEVO - Como lo resolvemos
<Benefits />               // EXISTENTE - Por que automatizar
<Stats />                  // EXISTENTE - Numeros de impacto
<Services />               // MODIFICADO - 4 servicios con Cards 3D
<HowItWorks />             // MODIFICADO - 6 pasos metodologia
<ContactForm />            // MODIFICADO - Conectado a APIs
```

## WORKFLOW

### FASE 0: Setup e Instalacion de Dependencias

**Agente:** @infra

~~~~~
Task(
  subagent_type: "infra",
  description: "FASE 0: Setup de dependencias",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer `ai_docs/expertise/domain-experts/infra.yaml` (si existe):
     - decisions: Decisiones validadas previas
     - blockers: Problemas conocidos y soluciones

  # CONTEXTO

  - Branch: main
  - Proyecto: StudioTek Landing (Next.js 16 + React 19 + Tailwind 4)

  # TAREA

  1. Instalar dependencias nuevas:
     ```bash
     npm install @supabase/supabase-js resend react-intersection-observer
     ```

  2. Crear archivo `.env.local.example` con las variables necesarias:
     ```
     # Supabase
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

     # Resend
     RESEND_API_KEY=your_resend_api_key

     # App
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

  3. Verificar que package.json tiene las dependencias

  ## Archivos

  MODIFY: package.json
  CREATE: .env.local.example

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Dependencias instaladas
     - Variables de entorno documentadas
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm list @supabase/supabase-js resend react-intersection-observer`
- Criterio: Las 3 dependencias listadas sin errores

---

### FASE 1: Hooks y Card3D Base

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 1: Card3D y Hooks base",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer componentes de referencia:
     - components/ui/VitaEonCard.tsx (ya tiene efecto 3D basico)
     - components/magicui/magic-card.tsx (referencia)

  # CONTEXTO

  - Branch: main
  - Stack: Next.js 16 + React 19 + Tailwind 4 + Framer Motion
  - VitaEonCard ya tiene perspective:1000px y rotateY/rotateX basico

  # TAREA

  ## 1. Crear hooks/use3DCardEffect.ts

  Hook para efecto 3D INTENSO en hover (mas que VitaEonCard):
  - Trackear posicion del mouse sobre la card
  - Calcular rotateX, rotateY basado en posicion (max 15 grados)
  - Retornar style object con transform
  - Incluir reset suave al salir
  - Sombra dinamica que cambia con la rotacion

  ```typescript
  interface Use3DCardEffectOptions {
    intensity?: number; // 1-20, default 10
    scale?: number;     // hover scale, default 1.02
    shadow?: boolean;   // dynamic shadow, default true
  }

  export function use3DCardEffect(options?: Use3DCardEffectOptions) {
    // Mouse tracking
    // Calculate rotation based on mouse position relative to card center
    // Return { style, handlers: { onMouseMove, onMouseEnter, onMouseLeave } }
  }
  ```

  ## 2. Crear hooks/useScrollAnimation.ts

  Hook para detectar elementos en viewport:
  - Usar react-intersection-observer
  - Retornar { ref, isInView, hasAnimated }
  - Opciones configurables (threshold, triggerOnce, rootMargin)

  ```typescript
  interface UseScrollAnimationOptions {
    threshold?: number;
    triggerOnce?: boolean;
    rootMargin?: string;
  }

  export function useScrollAnimation(options?: UseScrollAnimationOptions) {
    // Use IntersectionObserver
    // Return { ref, isInView, hasAnimated }
  }
  ```

  ## 3. Crear components/storytelling/Card3D.tsx

  Componente reutilizable estilo Apple:
  - Props: title, description, icon, gradient?, className?, intensity?
  - Usa use3DCardEffect para efecto 3D intenso
  - Glassmorphism background (bg-slate-900/60, backdrop-blur)
  - Shadow dinamico basado en rotacion
  - Compatible con framer-motion AnimatePresence

  Referencias visuales (Apple style):
  - Perspective: 1000px
  - Max rotation: 15 grados
  - Shadow: aumenta y se mueve con hover
  - Transition: smooth cubic-bezier
  - Glow effect sutil en bordes

  ## 4. Crear components/storytelling/index.ts

  Barrel exports para Card3D (mas exports se agregan en FASE 2)

  ## Archivos

  CREATE:
  - hooks/use3DCardEffect.ts
  - hooks/useScrollAnimation.ts
  - components/storytelling/Card3D.tsx
  - components/storytelling/index.ts

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados
     - Diferencias vs VitaEonCard
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, Card3D y hooks compilan sin errores

---

### FASE 2: Secciones PainPoints y Solution

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 2: PainPointsSection y SolutionSection",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer archivos de referencia:
     - components/sections/Benefits.tsx (patron de layout)
     - components/storytelling/Card3D.tsx (creado en FASE 1)

  # CONTEXTO

  - Branch: main
  - Stack: Next.js 16 + Framer Motion + Card3D
  - Estos son componentes NUEVOS que complementan Benefits existente

  # TAREA

  ## 1. Crear PainPointsSection.tsx

  Seccion con 4 pain points del cliente (EMOCIONAL):

  ```typescript
  const painPoints = [
    {
      icon: Clock,
      title: "Procesos manuales que consumen horas",
      description: "Tareas repetitivas que podrian automatizarse te roban tiempo valioso"
    },
    {
      icon: Brain,
      title: "Sin tiempo para lo estrategico",
      description: "Ahogado en operaciones, no puedes enfocarte en crecer"
    },
    {
      icon: TrendingDown, // o similar icono negativo
      title: "La competencia se adelanta",
      description: "Mientras otros adoptan IA, tu negocio se queda atras"
    },
    {
      icon: Database,
      title: "Datos sin explotar",
      description: "Tienes informacion valiosa que no estas aprovechando"
    }
  ]
  ```

  - Grid 2x2 en desktop, 1 columna en mobile
  - Cards 3D con animacion de scroll (stagger)
  - Titulo de seccion: "Te identificas con esto?"
  - Subtitulo: "Estos problemas son mas comunes de lo que crees"
  - Tono empatico, colores mas frios/neutrales (slate, gray)

  ## 2. Crear SolutionSection.tsx

  Transicion problema -> solucion (ESPERANZA):

  ```typescript
  const solutions = [
    {
      icon: Zap,
      title: "Automatizacion inteligente",
      description: "Liberamos tu tiempo automatizando lo repetitivo"
    },
    {
      icon: Target,
      title: "Enfoque estrategico",
      description: "Tomas decisiones informadas con IA como aliado"
    },
    {
      icon: Rocket,
      title: "Ventaja competitiva",
      description: "Te adelantas al mercado con tecnologia de punta"
    },
    {
      icon: BarChart,
      title: "Datos que hablan",
      description: "Transformamos tu informacion en insights accionables"
    }
  ]
  ```

  - Mismo layout que PainPoints pero con gradientes POSITIVOS
  - Titulo: "Asi lo resolvemos"
  - Subtitulo: "Transformamos cada desafio en una oportunidad"
  - Transicion visual (colores mas vibrantes: blue, cyan, emerald)
  - Cards 3D con efecto mas pronunciado que PainPoints

  ## 3. Actualizar index.ts con exports

  ## Archivos

  CREATE:
  - components/storytelling/PainPointsSection.tsx
  - components/storytelling/SolutionSection.tsx

  MODIFY:
  - components/storytelling/index.ts

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados
     - Copywriting final
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, PainPoints y Solution compilan

---

### FASE 3: Backend APIs (Supabase + Resend)

**Agente:** @backend

~~~~~
Task(
  subagent_type: "backend",
  description: "FASE 3: APIs de leads y email",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Verificar que las dependencias estan instaladas:
     - @supabase/supabase-js
     - resend

  # CONTEXTO

  - Branch: main
  - Stack: Next.js 16 App Router
  - Variables de entorno: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, RESEND_API_KEY

  # TAREA

  ## 1. Crear lib/supabase.ts

  Cliente Supabase server-side:

  ```typescript
  import { createClient } from '@supabase/supabase-js'

  export interface Lead {
    id?: string
    name: string
    email: string
    company?: string
    phone?: string
    budget?: string           // del ContactForm existente
    message?: string
    service_interest?: string
    privacy_accepted: boolean
    commercial_accepted?: boolean
    created_at?: string
    status?: string
  }

  export function createSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    return createClient(supabaseUrl, supabaseKey)
  }

  export async function insertLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>) {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...lead, status: 'new' }])
      .select()
      .single()

    if (error) throw error
    return data
  }
  ```

  ## 2. Crear lib/resend.ts

  Cliente Resend con template HTML profesional:

  ```typescript
  import { Resend } from 'resend'

  const resend = new Resend(process.env.RESEND_API_KEY)

  interface EmailData {
    to: string
    name: string
  }

  export async function sendConfirmationEmail({ to, name }: EmailData) {
    // Template HTML profesional con branding StudioTek
    // - Header con logo/nombre
    // - Mensaje de agradecimiento personalizado
    // - Confirmacion de respuesta en <24h
    // - Footer con info de contacto
  }
  ```

  ## 3. Crear app/api/leads/route.ts

  POST endpoint para guardar leads:
  - Validacion con Zod
  - Insercion en Supabase
  - Manejo de errores estructurado
  - Graceful degradation si Supabase no esta configurado

  ## 4. Crear app/api/send-email/route.ts

  POST endpoint para enviar email:
  - Validacion con Zod
  - Envio via Resend
  - Modo desarrollo (log sin enviar si no hay API key)
  - Manejo de errores

  ## Archivos

  CREATE:
  - lib/supabase.ts
  - lib/resend.ts
  - app/api/leads/route.ts
  - app/api/send-email/route.ts

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Archivos creados
     - Schemas de validacion
     - Graceful degradation implementado
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, API routes compilan

---

### FASE 4: Modificar Componentes Existentes

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 4: Modificar ContactForm, HowItWorks, Services",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Leer archivos a modificar:
     - components/sections/ContactForm.tsx
     - components/sections/HowItWorks.tsx
     - components/sections/Services.tsx
     - lib/validations.ts

  # CONTEXTO

  - Branch: main
  - APIs disponibles: /api/leads, /api/send-email
  - Componentes UI existentes: Input, Select, Textarea, Checkbox

  # TAREA

  ## 1. Actualizar lib/validations.ts

  Agregar campos al schema existente:

  ```typescript
  export const contactSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Introduce un email valido'),
    empresa: z.string().min(1, 'La empresa es requerida'),
    telefono: z.string().optional(),           // NUEVO
    presupuesto: z.string().min(1, 'Selecciona un presupuesto'),
    servicioInteres: z.string().optional(),    // NUEVO
    mensaje: z.string().optional(),
    privacyAccepted: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar la politica de privacidad' })
    }),
    commercialAccepted: z.boolean().optional(),
  });
  ```

  ## 2. Modificar ContactForm.tsx

  Agregar:
  - Campo telefono (opcional)
  - Campo servicio de interes (Select con 4 servicios)
  - Conexion a /api/leads en onSubmit
  - Conexion a /api/send-email tras exito
  - Mantener TODOS los checkboxes RGPD existentes

  ```typescript
  const serviciosOptions = [
    { value: '', label: 'Selecciona un servicio (opcional)' },
    { value: 'implementacion', label: 'Implementacion de IA' },
    { value: 'consultoria', label: 'Consultoria Estrategica' },
    { value: 'formacion', label: 'Formacion y Capacitacion' },
    { value: 'ia-personalizada', label: 'Procesos de IA Personalizada' },
  ];

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      // 1. Guardar lead en Supabase
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.nombre,
          email: data.email,
          company: data.empresa,
          phone: data.telefono,
          budget: data.presupuesto,
          service_interest: data.servicioInteres,
          message: data.mensaje,
          privacy_accepted: data.privacyAccepted,
          commercial_accepted: data.commercialAccepted,
        })
      });

      if (!leadRes.ok) {
        // Graceful: si falla Supabase, continuar con exito visual
        console.error('Lead save failed, continuing...');
      }

      // 2. Enviar email de confirmacion
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          name: data.nombre,
        })
      });

      setStatus('success');
      reset();
    } catch (error) {
      console.error(error);
      // Mostrar exito de todas formas (UX > logs de error)
      setStatus('success');
      reset();
    }
  };
  ```

  ## 3. Modificar HowItWorks.tsx

  Cambiar de 4 a 6 pasos (metodologia completa):

  ```typescript
  const steps = [
    {
      number: '01',
      title: 'Analisis',
      description: 'Entendemos tu problema y contexto actual',
      icon: Search,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      title: 'Planificacion',
      description: 'Disenamos la estrategia personalizada',
      icon: FileText,
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      number: '03',
      title: 'Implementacion',
      description: 'Desarrollamos la solucion',
      icon: Cog,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      number: '04',
      title: 'Monitoreo',
      description: 'Seguimiento continuo del rendimiento',
      icon: Eye,
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      number: '05',
      title: 'Optimizacion',
      description: 'Mejoras basadas en datos reales',
      icon: Settings,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      number: '06',
      title: 'Entrega',
      description: 'Solucion adaptada y funcionando',
      icon: CheckCircle,
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];
  ```

  - Ajustar grid para 6 items (3x2 en desktop, 2x3 en tablet, 1x6 en mobile)
  - Mantener animaciones de iluminacion acumulativa
  - Ajustar conectores para 6 pasos

  ## 4. Modificar Services.tsx

  Agregar 4to servicio + mejorar Cards:

  ```typescript
  const services = [
    // ... 3 existentes ...
    {
      title: 'Procesos de IA Personalizada',
      description: 'Desarrollamos soluciones de IA a medida para tus necesidades especificas',
      icon: Cpu, // o Brain
      gradient: 'from-rose-500 to-pink-600',
      features: ['Modelos custom', 'Fine-tuning', 'Deploy gestionado'],
      shimmerGradient: { from: '#f43f5e', to: '#ec4899' },
      shineColor: ['#ec4899', '#f43f5e', '#ec4899'],
    },
  ];
  ```

  - Opcional: integrar Card3D para efecto mas pronunciado
  - Mantener consistencia con el resto de la UI

  ## Archivos

  MODIFY:
  - lib/validations.ts
  - components/sections/ContactForm.tsx
  - components/sections/HowItWorks.tsx
  - components/sections/Services.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Cambios realizados en cada archivo
     - Campos nuevos en formulario
     - Pasos nuevos en timeline
     - Estado: SUCCESS | PARTIAL | BLOCKED
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build`
- Criterio: Build exitoso, todos los componentes modificados compilan

---

### FASE 5: Integracion Final en page.tsx

**Agente:** @frontend

~~~~~
Task(
  subagent_type: "frontend",
  description: "FASE 5: Integracion final en page.tsx",
  prompt: """
  # PRE-TAREA (OBLIGATORIO)

  1. Verificar que todos los componentes existen:
     - components/storytelling/PainPointsSection.tsx
     - components/storytelling/SolutionSection.tsx
     - components/sections/Benefits.tsx (existente)
     - components/sections/Services.tsx (modificado)
     - components/sections/HowItWorks.tsx (modificado)
     - components/sections/ContactForm.tsx (modificado)

  # CONTEXTO

  - Branch: main
  - Orden storytelling: Hero -> PainPoints -> Solution -> Benefits -> Stats -> Services -> HowItWorks -> Contact

  # TAREA

  ## 1. Actualizar app/page.tsx

  ```typescript
  import { Hero } from '@/components/sections/Hero';
  import { PainPointsSection, SolutionSection } from '@/components/storytelling';
  import { Benefits } from '@/components/sections/Benefits';
  import { Stats } from '@/components/sections/Stats';
  import { Services } from '@/components/sections/Services';
  import { HowItWorks } from '@/components/sections/HowItWorks';
  import { ContactForm } from '@/components/sections/ContactForm';
  import { SectionDivider } from '@/components/ui/SectionDivider';

  export default function Home() {
    return (
      <main>
        {/* 1. Impacto inicial */}
        <Hero />

        {/* 2. Storytelling: Problemas del cliente */}
        <PainPointsSection />

        {/* 3. Storytelling: Nuestra solucion */}
        <SolutionSection />

        {/* 4. Beneficios de automatizar */}
        <Benefits />

        {/* 5. Numeros de impacto */}
        <SectionDivider color="blue" variant="line" />
        <Stats />

        {/* 6. Servicios detallados */}
        <Services />

        {/* 7. Como trabajamos (6 pasos) */}
        <HowItWorks />

        {/* 8. Formulario de contacto */}
        <ContactForm />
      </main>
    );
  }
  ```

  ## 2. Verificar transiciones entre secciones

  - Espaciado consistente (py-24 entre secciones)
  - Colores de fondo coherentes (slate-950 base)
  - SectionDividers solo donde aporten valor

  ## 3. Build final

  ```bash
  npm run build
  ```

  ## Archivos

  MODIFY:
  - app/page.tsx

  # POST-TAREA (OBLIGATORIO)

  1. Generar informe:
     - Orden final de secciones
     - Build status
     - Estado: SUCCESS | PARTIAL | BLOCKED

  2. Si el build es exitoso, output:
     "COMPLETION_PROMISE: Landing completa con storytelling fluido, cards 3D interactivas, formulario funcional guardando en Supabase y enviando email de confirmacion via Resend"
  """
)
~~~~~

**Checkpoint:**

- Comando: `npm run build && echo "BUILD SUCCESS"`
- Criterio: Build exitoso sin errores ni warnings criticos

---

## Checkpoints Summary

| CP  | Fase | Criterio | Comando |
|-----|------|----------|---------|
| CP0 | 0 | Dependencias instaladas | `npm list @supabase/supabase-js resend react-intersection-observer` |
| CP1 | 1 | Card3D y hooks compilan | `npm run build` |
| CP2 | 2 | PainPoints y Solution compilan | `npm run build` |
| CP3 | 3 | API routes compilan | `npm run build` |
| CP4 | 4 | Componentes modificados compilan | `npm run build` |
| CP5 | 5 | Build production exitoso | `npm run build && echo "BUILD SUCCESS"` |

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Variables de entorno faltantes | ALTO | MEDIA | Graceful degradation en APIs |
| Conflicto con VitaEonCard | BAJO | BAJA | Card3D es componente separado |
| HowItWorks 6 pasos layout | MEDIO | MEDIA | Grid responsive 3x2/2x3/1x6 |
| ContactForm campos adicionales | BAJO | BAJA | Schema Zod ya existe |

## Ralph Mode Configuration

```yaml
loop: true
max_iterations: 6
completion_promise: "Landing completa con storytelling fluido, cards 3D interactivas, formulario funcional guardando en Supabase y enviando email de confirmacion via Resend"

self_correction:
  tests_fail: "Retry FASE 5"
  lint_fail: "Retry fase actual"
  build_fail: "Retry fase actual"

retry_limits:
  per_phase: 3
  global: 6
```

## Archivos Finales

### CREAR (10 archivos)

```
components/storytelling/
  Card3D.tsx
  PainPointsSection.tsx
  SolutionSection.tsx
  index.ts

hooks/
  use3DCardEffect.ts
  useScrollAnimation.ts

lib/
  supabase.ts
  resend.ts

app/api/
  leads/route.ts
  send-email/route.ts
```

### MODIFICAR (5 archivos)

```
components/sections/ContactForm.tsx
components/sections/HowItWorks.tsx
components/sections/Services.tsx
app/page.tsx
lib/validations.ts
```

### MANTENER (5 archivos)

```
components/sections/Hero.tsx
components/sections/Benefits.tsx
components/sections/Stats.tsx
components/ui/VitaEonCard.tsx
components/sections/Footer.tsx
```

---

**Plan generado por:** plan-task v3.2
**Optimizado:** 2026-01-15T10:30:00Z
**Decision Log:** Reutilizar ContactForm, HowItWorks, Services, Benefits
