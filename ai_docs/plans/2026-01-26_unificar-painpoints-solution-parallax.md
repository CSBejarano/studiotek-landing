# Plan de Ejecucion: Unificar PainPoints + Solution con Parallax Scroll

> **Generado:** 2026-01-26
> **Issue:** N/A (Mejora Visual)
> **Mode:** FAST
> **Complejidad:** 5/10

## Variables

```yaml
workflow_id: "2026-01-26_unificar-painpoints-solution-parallax"
branch: "main"
domain: "frontend"
agents:
  - "@frontend"
  - "@testing"
  - "@gentleman"
```

## Purpose

Mejorar la experiencia visual de la landing unificando las secciones PainPoints y Solution en una unica seccion con efecto parallax scroll, y eliminando la seccion SocialProof redundante.

### Problema Actual
- Las secciones PainPoints y Solution estan separadas visualmente
- La seccion SocialProof (150+ | 98% | 40%) es redundante con Stats
- Se necesita una transicion mas fluida entre problema y solucion

### Solucion Propuesta
- Crear componente `TextParallaxContent` basado en 21st.dev
- Unificar PainPoints + Solution en una sola seccion con scroll parallax
- Eliminar SocialProof de la pagina

## TDD Test Plan

### Build Validation Tests
1. TypeScript compilation passes (`npm run build`)
2. No ESLint errors (`npm run lint`)
3. All imports resolve correctly

### Visual Validation Tests (Manual)
1. Parallax scroll effect activates on scroll
2. Sticky image scales down as user scrolls (1 -> 0.85)
3. Text overlay fades in/out correctly with y-transform
4. Pain section shows red gradient cards (from-red-500/20)
5. Solution section shows blue gradient cards (from-blue-500/20)
6. Mobile responsive: Cards stack vertically (grid-cols-1 md:grid-cols-2)
7. No console errors during scroll

### Integration Tests
1. ProblemSolutionParallax renders without errors
2. TextParallaxContent accepts and displays props correctly
3. Page loads with new component in correct position (after Hero)

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | No | Componente estatico, sin datos sensibles |
| A02 | Cryptographic Failures | No | No hay encriptacion |
| A03 | Injection | No | No hay inputs de usuario |
| A04 | Insecure Design | No | Componente de presentacion |
| A05 | Security Misconfiguration | No | Solo CSS/JS frontend |
| A06 | Vulnerable Components | Si | Verificar framer-motion v12.26.2 esta actualizado |
| A07 | Auth Failures | No | No hay autenticacion |
| A08 | Data Integrity Failures | No | No hay datos externos |
| A09 | Security Logging | No | No aplica |
| A10 | SSRF | No | No hay requests del servidor |

## Architectural Review

**Verdict Inicial:** PENDING

Consideraciones:
- Patron de componentes compuestos (TextParallaxContent + ContentSection)
- Uso correcto de framer-motion hooks (useScroll, useTransform)
- Separacion de responsabilidades (animacion vs contenido)
- Reutilizabilidad del componente base

## Code Structure

### CREATE:
- `components/sections/TextParallaxContent.tsx` - Componente base con parallax
- `components/sections/ProblemSolutionParallax.tsx` - Seccion unificada

### MODIFY:
- `app/page.tsx` - Reemplazar 3 componentes por 1

### DELETE (de imports, no archivos):
- Import de SocialProof
- Import de PainPointsSection
- Import de SolutionSection

### TESTS:
- Validacion via `npm run build`
- Testing visual manual en localhost:3000

## WORKFLOW

### Fase 1: Crear TextParallaxContent.tsx (@frontend)

**Agent:** @frontend
**Dependencias:** Ninguna
**Checkpoint:** `npm run build`

**Tareas:**
1. Crear archivo `components/sections/TextParallaxContent.tsx`
2. Implementar StickyImage con useScroll y useTransform
3. Implementar OverlayCopy con animaciones de y/opacity
4. Adaptar estilos al dark theme (slate-950, blue-400)
5. Exportar componente TextParallaxContent

**Archivos:**
- CREATE: `components/sections/TextParallaxContent.tsx`

### Fase 2: Crear ProblemSolutionParallax.tsx (@frontend)

**Agent:** @frontend
**Dependencias:** Fase 1
**Checkpoint:** `npm run build`

**Tareas:**
1. Crear archivo `components/sections/ProblemSolutionParallax.tsx`
2. Importar TextParallaxContent
3. Definir painItems con iconos Lucide (Clock, Users, Moon, Database)
4. Definir solutionItems con iconos Lucide (Zap, Headphones, BarChart, TrendingUp)
5. Implementar ContentSection con grid responsive
6. Usar URLs de Unsplash para imagenes de fondo

**Archivos:**
- CREATE: `components/sections/ProblemSolutionParallax.tsx`

### Fase 3: Actualizar app/page.tsx (@frontend)

**Agent:** @frontend
**Dependencias:** Fase 2
**Checkpoint:** `npm run build`

**Cambios:**
```yaml
imports_eliminar:
  - "import { SocialProof } from '@/components/sections/SocialProof';"
  - "import { PainPointsSection, SolutionSection } from '@/components/storytelling';"

imports_agregar:
  - "import { ProblemSolutionParallax } from '@/components/sections/ProblemSolutionParallax';"

jsx_eliminar:
  - "<SocialProof />"
  - "<PainPointsSection />"
  - "<SolutionSection />"

jsx_agregar:
  - "<ProblemSolutionParallax />"
```

**Nuevo Orden de Secciones:**
1. Hero
2. ProblemSolutionParallax (reemplaza SocialProof + PainPoints + Solution)
3. Benefits
4. Services
5. SectionDivider
6. HowItWorks
7. Stats
8. ContactForm

**Archivos:**
- MODIFY: `app/page.tsx`

### Fase 4: Testing Visual (@testing)

**Agent:** @testing
**Dependencias:** Fase 3
**Checkpoint:** `npm run dev` (servidor inicia sin errores)

**Validaciones:**
1. Iniciar servidor de desarrollo
2. Verificar parallax scroll funciona correctamente
3. Verificar responsive (mobile/tablet/desktop)
4. Verificar que no hay errores en consola
5. Verificar transicion visual fluida entre secciones

### Fase 5: Code Review Final (@gentleman)

**Agent:** @gentleman
**Dependencias:** Fase 4
**Checkpoint:** `echo APPROVED`

**Criterios de Aprobacion:**
1. Flujo Problema -> Solucion es claro narrativamente
2. Transicion visual mejorada respecto al original
3. Codigo sigue patrones del proyecto
4. No hay regresiones visuales
5. Performance de scroll aceptable

**Verdict:** APPROVED | NEEDS_REVISION | REJECTED

### Fase 6: Verificacion Visual con Playwright MCP (@testing)

**Agent:** @testing
**Dependencias:** Fase 5
**Checkpoint:** Playwright verification completed

**Verificaciones Automatizadas:**
1. Navegar a http://localhost:3000 con Playwright
2. Capturar screenshot de pagina completa
3. Verificar que ProblemSolutionParallax renderiza
4. Verificar que Hero muestra "40%" en titulo
5. Verificar que SocialProof NO esta presente
6. Verificar que Benefits y ContactForm funcionan
7. Capturar errores de consola de Chrome DevTools
8. Simular scroll y verificar elementos sticky del parallax
9. Screenshot final como evidencia

**Criterios de Exito:**
- Pagina carga sin errores
- Consola de Chrome sin errores
- Todos los componentes esperados presentes
- Parallax scroll funciona (elementos sticky detectados)

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| framer-motion API changed | Alto | Baja | Verificar docs v12.x |
| Sticky positioning fails | Medio | Media | Probar overflow settings |
| Performance jank on mobile | Medio | Media | will-change CSS, test device |
| Unsplash images blocked | Bajo | Baja | Usar fallback local |
| Import paths incorrect | Bajo | Baja | Usar @/ alias consistente |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP1 | 1 | TextParallaxContent compila | `npm run build` |
| CP2 | 2 | ProblemSolutionParallax compila | `npm run build` |
| CP3 | 3 | page.tsx actualizado compila | `npm run build` |
| CP4 | 4 | Servidor dev inicia | `npm run dev` |
| CP5 | 5 | Review aprobado | Manual |
| CP6 | 6 | Playwright verification | Playwright MCP tools |

## Dependencies Verification

Verificadas en package.json:
- framer-motion: ^12.26.2 (instalado)
- lucide-react: ^0.562.0 (instalado)
- react: 19.2.3 (instalado)
- next: 16.1.1 (instalado)

## Notes

### Sobre las Imagenes
- Se usan URLs de Unsplash como placeholder
- Pain: Imagen de oficina estresante/caotica
- Solution: Imagen de equipo colaborando/tecnologia
- Posteriormente se pueden reemplazar con imagenes propias en /images/generated/

### Por que eliminar SocialProof
- Redundante: Los numeros (150+, 98%, 40%) ya aparecen en Stats
- Simplifica el flujo visual
- El parallax es mas impactante como primera impresion post-Hero

### No Modificar
- Hero.tsx (intacto)
- Benefits.tsx y secciones posteriores (intactas)
- Estructura de carpetas existente

---

*Generado por /plan-task v5.0*
*Fecha: 2026-01-26*
