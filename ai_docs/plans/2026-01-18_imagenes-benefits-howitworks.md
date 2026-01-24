# Plan de Ejecucion: Imagenes para Benefits y HowItWorks

> **Generado:** 2026-01-18
> **Issue:** N/A
> **Mode:** FAST
> **Complejidad:** 4/10

## Variables

```yaml
workflow_id: "2026-01-18_imagenes-benefits-howitworks"
branch: "main"
domain: "frontend"
agents: ["@frontend", "@testing", "@gentleman"]
estimated_duration: "15-20 min"
images_to_generate: 9
components_to_modify: 2
```

## Purpose

Agregar imagenes generadas por IA a las secciones Benefits (3 cards) y HowItWorks (6 cards) de la landing page de StudioTek, siguiendo el patron establecido en Services.tsx que ya tiene imagenes implementadas correctamente.

**Objetivo final:** Mejorar el impacto visual de la landing manteniendo consistencia con el estilo tech/futurista establecido.

## TDD Test Plan

Para este proyecto frontend sin tests unitarios establecidos:

| Test | Tipo | Comando | Criterio |
|------|------|---------|----------|
| Lint Check | Static | `npm run lint` | Sin errores criticos |
| Build Test | Build | `npm run build` | Exitoso |
| Visual Test | Manual | `npm run dev` | Imagenes visibles en Benefits y HowItWorks |
| Responsive Test | Manual | DevTools resize | Funciona en mobile/tablet/desktop |
| Animation Test | Manual | Hover/Scroll | Animaciones intactas |

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | No | N/A - Solo assets estaticos |
| A02 | Cryptographic Failures | No | N/A - Sin datos sensibles |
| A03 | Injection | No | N/A - Sin inputs de usuario |
| A04 | Insecure Design | No | N/A - Cambios de UI solamente |
| A05 | Security Misconfiguration | No | N/A - Imagenes estaticas |
| A06 | Vulnerable Components | Si | Verificar Next.js Image esta actualizado |
| A07 | Auth Failures | No | N/A - Sin autenticacion |
| A08 | Data Integrity | No | N/A - Sin datos de servidor |
| A09 | Logging Failures | No | N/A - Frontend estatico |
| A10 | SSRF | No | N/A - Sin requests externos |

## Architectural Review

**Verdict Inicial:** APPROVED (cambios de bajo riesgo)

**Justificacion:**
- Los cambios siguen el patron ya establecido en Services.tsx
- Solo se agregan propiedades opcionales a componentes existentes
- Las imagenes son assets estaticos sin logica de negocio
- Se mantiene la estructura y comportamiento actual de los componentes

## Code Structure

### CREATE:
```
public/images/generated/
  benefit-ahorro-costes.png     # Blue-cyan, ahorro financiero
  benefit-eficiencia.png        # Purple-pink, velocidad/procesos
  benefit-escalabilidad.png     # Orange-red, crecimiento
  step-analisis.png             # Blue-cyan, investigacion
  step-planificacion.png        # Violet-purple, estrategia
  step-implementacion.png       # Amber-orange, desarrollo
  step-monitoreo.png            # Emerald-green, dashboards
  step-optimizacion.png         # Pink-rose, mejora continua
  step-entrega.png              # Teal-cyan, exito
```

### MODIFY:
```
components/sections/
  Benefits.tsx      # Agregar campo image a 3 benefits, renderizar con Image
  HowItWorks.tsx    # Agregar campo image a 6 steps, renderizar con Image
```

### DELETE:
```
(ninguno)
```

### TESTS:
```
(verificacion manual + build)
```

---

## WORKFLOW

### Fase 1: Generar imagenes para Benefits (@frontend)

**Objetivo:** Crear 3 imagenes con estilo tech/futurista para la seccion Benefits

**PRE-TAREA:**
1. Leer `.claude/agents/frontend.md` para contexto del agente

**TAREA:**
Usar `/landing-images` para generar:

| Archivo | Prompt | Colores |
|---------|--------|---------|
| benefit-ahorro-costes.png | "Futuristic piggy bank with digital coins, blue cyan gradient, tech aesthetic, dark background" | blue-cyan |
| benefit-eficiencia.png | "Lightning bolt energy symbol with flowing data, purple pink gradient, efficiency visualization, dark tech" | purple-pink |
| benefit-escalabilidad.png | "Growing chart with upward arrows, orange red gradient, scalability concept, dark futuristic" | orange-red |

**Archivos:**
- CREATE: `public/images/generated/benefit-ahorro-costes.png`
- CREATE: `public/images/generated/benefit-eficiencia.png`
- CREATE: `public/images/generated/benefit-escalabilidad.png`

**POST-TAREA:**
1. Verificar: `ls public/images/generated/benefit-*.png`
2. Verificar tamaño: `ls -lh public/images/generated/benefit-*.png` (< 500KB)
3. Actualizar memoria del agente

**Checkpoint:** `ls public/images/generated/benefit-*.png | wc -l` = 3

---

### Fase 2: Generar imagenes para HowItWorks (@frontend)

**Objetivo:** Crear 6 imagenes para los pasos del proceso

**PRE-TAREA:**
1. Leer `.claude/agents/frontend.md`

**TAREA:**
Usar `/landing-images` para generar:

| Archivo | Prompt | Colores |
|---------|--------|---------|
| step-analisis.png | "Magnifying glass analyzing data patterns, blue cyan, tech style, dark background" | blue-cyan |
| step-planificacion.png | "Blueprint roadmap with connected nodes, violet purple, strategic planning, dark tech" | violet-purple |
| step-implementacion.png | "Gears and code integration, amber orange, development process, dark futuristic" | amber-orange |
| step-monitoreo.png | "Dashboard with real-time metrics, emerald green, monitoring, dark tech" | emerald-green |
| step-optimizacion.png | "Settings and optimization graphs, pink rose, improvement concept, dark" | pink-rose |
| step-entrega.png | "Checkmark with success celebration, teal cyan, delivery visualization, dark tech" | teal-cyan |

**Archivos:**
- CREATE: `public/images/generated/step-analisis.png`
- CREATE: `public/images/generated/step-planificacion.png`
- CREATE: `public/images/generated/step-implementacion.png`
- CREATE: `public/images/generated/step-monitoreo.png`
- CREATE: `public/images/generated/step-optimizacion.png`
- CREATE: `public/images/generated/step-entrega.png`

**POST-TAREA:**
1. Verificar: `ls public/images/generated/step-*.png`
2. Verificar tamaño < 500KB
3. Actualizar memoria del agente

**Checkpoint:** `ls public/images/generated/step-*.png | wc -l` = 6

---

### Fase 3: Modificar Benefits.tsx (@frontend)

**Objetivo:** Integrar las imagenes en el componente Benefits

**PRE-TAREA:**
1. Leer `.claude/agents/frontend.md`
2. Leer `components/sections/Services.tsx` (referencia)
3. Leer `components/sections/Benefits.tsx` (a modificar)
4. Leer `components/ui/VitaEonCard.tsx` (componente usado)

**TAREA:**

1. **Agregar import de Image:**
```typescript
import Image from 'next/image';
```

2. **Agregar campo image a cada benefit:**
```typescript
const benefits = [
  {
    title: 'Ahorro de Costes',
    // ... campos existentes ...
    image: '/images/generated/benefit-ahorro-costes.png',
  },
  {
    title: 'Eficiencia Operativa',
    // ... campos existentes ...
    image: '/images/generated/benefit-eficiencia.png',
  },
  {
    title: 'Escalabilidad',
    // ... campos existentes ...
    image: '/images/generated/benefit-escalabilidad.png',
  },
];
```

3. **Modificar renderizado dentro de VitaEonCard:**
```tsx
<VitaEonCard glowColor="blue" showAccentLine className="h-full p-8">
  <div className="relative h-full">
    {/* Imagen de fondo sutil */}
    {benefit.image && (
      <div className="absolute inset-0 opacity-10 overflow-hidden rounded-xl">
        <Image src={benefit.image} alt="" fill className="object-cover" />
      </div>
    )}
    {/* Contenido existente */}
    <div className="relative z-10 flex flex-col items-center text-center h-full group">
      {/* ... icono, titulo, descripcion, boton ... */}
    </div>
  </div>
</VitaEonCard>
```

**Archivos:**
- MODIFY: `components/sections/Benefits.tsx`

**POST-TAREA:**
1. Verificar: `grep -c "image:" components/sections/Benefits.tsx` = 3
2. Actualizar memoria: Decision "SL051: Imagenes en Benefits como fondo con opacity-10"

**Checkpoint:** `grep -c "image:" Benefits.tsx` = 3

---

### Fase 4: Modificar HowItWorks.tsx (@frontend)

**Objetivo:** Integrar las imagenes en el componente HowItWorks

**PRE-TAREA:**
1. Leer `.claude/agents/frontend.md`
2. Leer `components/sections/Services.tsx` (referencia)
3. Leer `components/sections/HowItWorks.tsx` (a modificar)

**TAREA:**

1. **Agregar import de Image:**
```typescript
import Image from 'next/image';
```

2. **Agregar campo image a cada step:**
```typescript
const steps = [
  {
    number: '01',
    title: 'Analisis',
    // ... campos existentes ...
    image: '/images/generated/step-analisis.png',
  },
  // ... igual para los otros 5 steps
];
```

3. **Modificar renderizado de la card (dentro del motion.div):**
```tsx
<div className="relative overflow-hidden rounded-2xl bg-slate-900/80 ...">
  {/* Imagen de fondo con overlay */}
  {step.image && (
    <div className="absolute inset-0 opacity-15">
      <Image src={step.image} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
    </div>
  )}

  {/* Dot pattern existente - MANTENER */}
  {/* Glow effect existente - MANTENER */}

  {/* Content existente con z-10 */}
  <div className="relative z-10 ...">
    {/* ... */}
  </div>
</div>
```

**Consideraciones:**
- MANTENER todas las animaciones de framer-motion
- MANTENER el sistema de illuminatedSteps
- Overlay oscuro para legibilidad

**Archivos:**
- MODIFY: `components/sections/HowItWorks.tsx`

**POST-TAREA:**
1. Verificar: `grep -c "image" components/sections/HowItWorks.tsx` >= 12
2. Actualizar memoria: Decision "SL052: Imagenes en HowItWorks con overlay gradient"

**Checkpoint:** `grep -c "image" HowItWorks.tsx` >= 12

---

### Fase 5: Verificacion y Build Test (@testing)

**Objetivo:** Validar que todo funciona correctamente

**PRE-TAREA:**
1. Leer `.claude/agents/testing.md`

**TAREA:**

1. **Lint Check:**
```bash
npm run lint
```
Criterio: Sin errores criticos

2. **Build Test:**
```bash
npm run build
```
Criterio: Build exitoso

3. **Verificacion Visual:**
```bash
npm run dev
# Abrir http://localhost:3000
```
Checklist:
- [ ] Benefits: 3 cards con imagenes de fondo visibles
- [ ] HowItWorks: 6 cards con imagenes de fondo visibles
- [ ] Animaciones: Illumination progresiva funciona
- [ ] Responsive: Mobile, Tablet, Desktop
- [ ] Performance: Imagenes cargan rapido
- [ ] Legibilidad: Texto legible sobre imagenes

**POST-TAREA:**
1. Documentar resultado
2. Actualizar memoria del agente

**Checkpoint:** `npm run build` = Successfully

---

### Fase 6: Code Review Final (@gentleman)

**Objetivo:** Validacion arquitectonica final

**PRE-TAREA:**
1. Leer `.claude/agents/gentleman.md`

**TAREA:**

Revisar aspectos:

| Aspecto | Criterio |
|---------|----------|
| Consistencia | Patron igual que Services.tsx |
| Calidad | TypeScript correcto, codigo limpio |
| Performance | Imagenes < 500KB, Next.js Image |
| Accesibilidad | alt text, contraste |
| UX | Imagenes aportan valor, no distraen |

**Verdict:**
- **APPROVED**: Todo OK, listo para merge/deploy
- **NEEDS_REVISION**: Hay issues menores (listar)
- **REJECTED**: Hay issues criticos (explicar)

**POST-TAREA:**
1. Documentar verdict con justificacion
2. Actualizar memoria del agente

**Checkpoint:** `echo APPROVED` = APPROVED

---

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Imagenes muy pesadas | Alto | Media | Optimizar antes de commit, max 500KB |
| Layout incompatible | Medio | Baja | Usar overlay + mantener estructura |
| Animaciones rotas | Medio | Baja | Testing manual completo |
| Build falla | Alto | Baja | Verificar imports y paths |
| Inconsistencia visual | Medio | Media | Seguir estilo de Services |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| 1 | Gen Benefits | 3 imagenes | `ls public/images/generated/benefit-*.png \| wc -l` |
| 2 | Gen HowItWorks | 6 imagenes | `ls public/images/generated/step-*.png \| wc -l` |
| 3 | Benefits.tsx | 3 image fields | `grep -c "image:" Benefits.tsx` |
| 4 | HowItWorks.tsx | 12+ image refs | `grep -c "image" HowItWorks.tsx` |
| 5 | Build | Exitoso | `npm run build` |
| 6 | Review | Aprobado | `echo APPROVED` |

## Dependencias

```
Fase 1 (Benefits images) ──┬──> Fase 3 (Benefits.tsx)
                           │
Fase 2 (HowItWorks images) ┴──> Fase 4 (HowItWorks.tsx)
                                       │
                                       v
                               Fase 5 (Testing)
                                       │
                                       v
                               Fase 6 (Review)
```

## Referencias

### Estilo de Imagenes (Services existentes)
```
public/images/generated/
  service-implementacion-ia.png    # Referencia de estilo
  service-consultoria.png
  service-formacion.png
  service-ia-personalizada.png
```

### Integracion en VitaEonCard (Benefits)
- VitaEonCard es un componente de card con efecto glow y ShineBorder
- Agregar imagen como fondo con opacity baja (0.1)
- Mantener icono y texto sin cambios

### Integracion en HowItWorks Cards
- Cards usan motion.div con animaciones de illumination
- `illuminatedSteps` controla que cards estan "activas"
- Agregar imagen con z-index bajo, overlay gradient encima

---

**Estado:** READY FOR EXECUTION
**Ejecutar con:** `/ralph-execute`
