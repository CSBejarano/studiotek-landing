# Plan de Ejecucion: Transformacion Landing Page StudioTek v2.0

> **Generado:** 2026-01-24
> **Issue:** N/A (prompt.md)
> **Mode:** FULL
> **Complejidad:** 7/10

## Variables

```yaml
workflow_id: "2026-01-24_transformacion-landing-studiotek"
branch: "feature/landing-transformation-v2"
domain: frontend
agentes_principales:
  - "@frontend"
  - "@testing"
  - "@gentleman"
total_archivos_modificar: 11
total_archivos_crear: 1
correcciones_ortograficas: 40+
```

## Purpose

Transformacion profesional completa de la landing page de StudioTek:
- Correccion de 40+ errores ortograficos (tildes, puntuacion)
- Reorganizacion estrategica de secciones para maxima conversion
- Reescritura experta de todos los textos (copywriting orientado a ROI)
- Optimizacion SEO con keywords estrategicas
- Creacion de nuevo componente SocialProof

## TDD Test Plan

### Tests de Integracion

```yaml
test_build_success:
  precondicion: "Codigo modificado"
  accion: "npm run build"
  esperado: "Exit code 0"

test_ortografia_corregida:
  precondicion: "Fase 2 completada"
  accion: 'grep -r "podrian\|informacion\|Implementacion" components/'
  esperado: "0 coincidencias"

test_seo_meta_tags:
  precondicion: "Fase 3 completada"
  accion: 'grep "automatizacion con IA" app/layout.tsx'
  esperado: ">= 1 coincidencia"

test_social_proof_existe:
  precondicion: "Fase 4 completada"
  accion: "test -f components/sections/SocialProof.tsx"
  esperado: "Exit code 0"
```

### Tests E2E (Playwright - Opcional)

```yaml
test_navegacion_scroll:
  viewports: [320, 768, 1024, 1440]
  verificar: "Layout no se rompe"

test_formulario_contacto:
  accion: "Llenar y enviar formulario"
  esperado: "Mensaje de exito"

test_lighthouse:
  performance: "> 90"
  seo: "> 95"
  accessibility: "> 90"
```

## Security Checklist (OWASP)

| # | Vulnerabilidad | Aplica | Mitigacion |
|---|----------------|--------|------------|
| A01 | Broken Access Control | NO | Landing publica |
| A02 | Cryptographic Failures | NO | No datos sensibles |
| A03 | Injection | PARCIAL | Validacion en ContactForm (react-hook-form) |
| A04 | Insecure Design | NO | Sin cambios arquitectura |
| A05 | Security Misconfiguration | NO | Sin cambios config |
| A06 | Vulnerable Components | REVISAR | npm audit antes de deploy |
| A07 | Auth Failures | NO | Sin autenticacion |
| A08 | Software/Data Integrity | NO | Sin cambios pipelines |
| A09 | Security Logging | NO | N/A landing |
| A10 | SSRF | NO | Sin URLs externas nuevas |

## Architectural Review

**Verdict Inicial:** PENDING

**Observaciones:**
- Se mantiene arquitectura Next.js 16 existente
- No se modifican componentes de logica (HeroAIChat, formulario)
- Solo cambios de contenido y estructura visual
- Riesgo arquitectonico: BAJO

## Code Structure

### CREATE

```yaml
- components/sections/SocialProof.tsx
  description: "Mini stats bar despues del Hero"
  contenido:
    - "150+ Proyectos"
    - "98% Satisfaccion"
    - "40% Ahorro medio"
```

### MODIFY

```yaml
# SEO y Estructura
- app/layout.tsx          # Meta tags SEO
- app/page.tsx            # Reordenar secciones

# Secciones Principales
- components/sections/Hero.tsx
- components/sections/Benefits.tsx
- components/sections/Services.tsx
- components/sections/Stats.tsx
- components/sections/HowItWorks.tsx
- components/sections/ContactForm.tsx

# Storytelling
- components/storytelling/PainPointsSection.tsx
- components/storytelling/SolutionSection.tsx
```

### TESTS

```yaml
- npm run build          # Validacion de compilacion
- npm run lint           # Verificacion de estilo
- npx lighthouse         # Performance/SEO (opcional)
```

## WORKFLOW

### Fase 1: Preparacion (@frontend)
1. Verificar que `npm run dev` funciona
2. Crear branch de trabajo si es necesario
3. Leer componentes existentes para entender patrones

### Fase 2: Correccion Ortografica (@frontend)
Corregir 40+ errores en los siguientes archivos:
- Hero.tsx: "Cuentanos" -> "Cuentanos"
- PainPointsSection.tsx: 6 correcciones
- SolutionSection.tsx: 6 correcciones
- Benefits.tsx: 4 correcciones
- Services.tsx: 16 correcciones
- Stats.tsx: 5 correcciones
- HowItWorks.tsx: 7 correcciones
- ContactForm.tsx: 9 correcciones

### Fase 3: SEO Meta Tags (@frontend)
Actualizar app/layout.tsx:
```tsx
title: "StudioTek | Automatizacion con IA para PYMEs en Espana"
description: "Automatiza tu negocio con IA. Reduce un 40% los costes..."
keywords: "automatizacion IA, inteligencia artificial empresas..."
```

### Fase 4: Crear SocialProof.tsx (@frontend)
```tsx
// Mini stats bar con 3 metricas clave
<section className="py-8 bg-slate-900/50">
  <div className="container mx-auto px-4">
    <div className="flex justify-center items-center gap-8 md:gap-16">
      <div>150+ Proyectos</div>
      <div>98% Satisfaccion</div>
      <div>40% Ahorro medio</div>
    </div>
  </div>
</section>
```

### Fase 5: Reorganizar Secciones (@frontend)
Nuevo orden en app/page.tsx:
1. Hero
2. SocialProof (NUEVO)
3. PainPoints
4. Solution
5. Benefits
6. Services
7. HowItWorks
8. Stats (movido)
9. ContactForm

### Fase 6: Reescritura Hero (@frontend)
- H1: "Automatiza tu negocio con IA y ahorra un 40% en costes"
- Subtitulo: "En 4 semanas, tu negocio funciona 24/7. Sin contratar mas personal."

### Fase 7: Reescritura PainPoints + Solution (@frontend)
PainPoints nuevos:
1. "Pierdes 15+ horas/semana en tareas repetitivas"
2. "Tu equipo esta quemado"
3. "Pierdes clientes fuera de horario"
4. "Datos dispersos, decisiones a ciegas"

Soluciones nuevas:
1. "Automatizacion que trabaja por ti"
2. "Atencion 24/7 sin contratar"
3. "Datos que generan ventas"
4. "Escalas sin limites"

### Fase 8: Reescritura Benefits + Services (@frontend)
Benefits con ROI:
1. "Ahorra 2.500EUR/mes en operativa"
2. "Atiende 3x mas clientes"
3. "Nunca pierdas un cliente"

Services: Descripciones mas claras y orientadas a beneficio

### Fase 9: Reescritura Stats + HowItWorks + ContactForm (@frontend)
- Stats: Labels mas especificos con contexto
- HowItWorks: Pasos mas accionables
- ContactForm: CTA potente

### Fase 10: Testing y Validacion (@testing)
1. npm run build
2. npm run lint
3. Verificacion visual
4. Lighthouse check (opcional)

### Fase 11: Code Review Final (@gentleman)
1. Revision arquitectonica
2. Verificacion de consistencia de tono
3. Validacion de CTAs
4. Verdict: APPROVED / NEEDS_REVISION / REJECTED

## Risk Matrix

| Riesgo | Impacto | Probabilidad | Mitigacion |
|--------|---------|--------------|------------|
| Build roto | Alto | Media | Checkpoint en cada fase |
| Contenido inconsistente | Medio | Baja | Review final por @gentleman |
| SEO keywords artificiales | Bajo | Media | Review copywriting |
| Estilos rotos | Medio | Baja | No modificar CSS classes |
| Chat IA roto | Alto | Muy Baja | No tocar HeroAIChat.tsx |

## Checkpoints

| CP | Fase | Criterio | Comando |
|----|------|----------|---------|
| CP0 | Prep | Dev server funciona | `npm run dev` |
| CP1 | Ortografia | Build exitoso | `npm run build` |
| CP2 | SEO | Meta tags presentes | `grep "automatizacion" app/layout.tsx` |
| CP3 | SocialProof | Componente existe | `test -f components/sections/SocialProof.tsx` |
| CP4 | Page Order | Imports correctos | `grep "SocialProof" app/page.tsx` |
| CP5 | Hero | Nuevo titulo | `grep "40%" components/sections/Hero.tsx` |
| CP6 | Pain/Sol | Contenido nuevo | `grep "15+" components/storytelling/PainPointsSection.tsx` |
| CP7 | Benefits | ROI presente | `grep "2.500" components/sections/Benefits.tsx` |
| CP8 | Final Content | Build completo | `npm run build` |
| CP9 | Testing | Lint pass | `npm run lint` |
| CP10 | Review | Aprobacion | `echo APPROVED` |

---

*Plan generado por /plan-task v5.0*
*Ultima actualizacion: 2026-01-24*
