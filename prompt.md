# PLAN: Unificación Visual Landing Page - StudioTek

## Purpose

Unificar visualmente toda la landing page de StudioTek eliminando separaciones duras entre secciones, estandarizando la tipografía y creando un flujo visual continuo y cohesivo. Inspiración de referencia: landing page de vicio.com (adaptado al estilo dark/tech de StudioTek).

> **Dominio:** Frontend
> **Prioridad:** P0 - Visual Unification
> **Complejidad:** 8/10
> **Skill:** studiotek-landing-enhancer

---

## Contexto

### Problemas Visuales Detectados

```yaml
Problemas_Actuales:
  separaciones_duras:
    - "Hero (#0A0A0A) → Services (slate-950): línea visual dura entre secciones"
    - "Benefits panels: alternancia dark/light (#0A0A0A vs #F5F5F5) crea cortes abruptos"
    - "Services → ContactForm: transición sin suavizado entre backgrounds"
    - "Imagen 1 muestra línea recta visible entre Hero y Services"

  inconsistencias_tipograficas:
    - "Hero: mezcla de font-weights sin jerarquía clara"
    - "Services: títulos con font-weight diferente al resto de secciones"
    - "Benefits: WatermarkStat usa tamaños desproporcionados sin consistencia"
    - "ContactForm vs Hero: diferentes estilos de headings"
    - "Footer: tipografía no alineada con el resto"

  colores_de_fondo:
    hero: "#0A0A0A (custom dark)"
    benefits_dark: "#0A0A0A"
    benefits_light: "#F5F5F5 (rompe la cohesión dark)"
    services: "slate-950 (#020617)"
    contact: "slate-950"
    footer: "slate-950"
    nota: "Hero usa #0A0A0A mientras el resto usa slate-950 → discrepancia sutil"

  flujo_visual:
    - "Cada sección se siente como un bloque independiente, no como un flujo continuo"
    - "No hay elementos visuales que conecten secciones entre sí"
    - "Falta sensación de 'scroll journey' unificado"
```

### Referencia de Inspiración: vicio.com

```yaml
Patrones_Vicio_A_Adaptar:
  flujo_continuo:
    - "Sin líneas divisorias entre secciones"
    - "Las secciones fluyen como un lienzo continuo"
    - "Elementos visuales se superponen sutilmente entre secciones"
    - "Scroll se siente como un viaje, no como bloques apilados"

  tipografia:
    - "Consistencia total en font-family a lo largo de toda la página"
    - "Jerarquía tipográfica clara: display → heading → body → caption"
    - "Uso audaz de tipografía grande como elemento de diseño"
    - "Textos oversized que dan personalidad sin romper la cohesión"

  transiciones:
    - "Cambios de fondo sutiles con gradientes, no cortes bruscos"
    - "Elementos decorativos (stickers, badges) que rompen la rigidez del grid"
    - "Espaciado generoso entre contenido, sin sentirse apretado"

  mobile:
    - "Misma cohesión visual en mobile que en desktop"
    - "Tipografía se adapta proporcionalmente sin romper la jerarquía"
    - "Contenido fluye verticalmente de forma natural"

  que_NO_copiar:
    - "Collage caótico de imágenes → StudioTek es tech, más limpio"
    - "Colores rojos/naranjas → StudioTek es azul/oscuro"
    - "Estética streetwear → StudioTek es profesional/tech"
    - "Fondo claro principal → StudioTek mantiene dark theme"
```

### Secciones Activas (app/page.tsx)

```yaml
Orden_Actual:
  1_Hero: "Activo - bg-[#0A0A0A] con Particles"
  2_PainPointsPAS: "COMENTADO - no activo"
  3_Benefits: "Activo - GSAP horizontal scroll (desktop) / MobileBenefits (mobile)"
  4_Services: "Activo - Expanding card (desktop) / Grid cards (mobile)"
  5_HowItWorks: "COMENTADO - no activo"
  6_ContactForm: "Activo - Formulario con DotPattern"
  7_Footer: "Activo - Links y legal"
```

---

## Variables

```yaml
# Archivos principales a modificar
HERO: "components/sections/Hero.tsx"
BENEFITS_INDEX: "components/sections/Benefits/index.tsx"
BENEFITS_MOBILE: "components/sections/Benefits/MobileBenefits.tsx"
BENEFITS_PANEL: "components/sections/Benefits/BenefitPanel.tsx"
BENEFITS_DATA: "components/sections/Benefits/data/benefits-data.ts"
SERVICES: "components/sections/Services.tsx"
CONTACTFORM: "components/sections/ContactForm.tsx"
HEADER: "components/sections/Header.tsx"
FOOTER: "components/sections/Footer.tsx"
LAYOUT: "app/layout.tsx"
GLOBALS_CSS: "app/globals.css"
PAGE: "app/page.tsx"

# Design tokens a unificar
BG_PRIMARY: "#0A0A0A"           # Color de fondo principal unificado
BG_SURFACE: "rgba(255,255,255,0.03)"  # Superficies elevadas sutiles
ACCENT_BLUE: "#3B82F6"          # Azul principal (blue-500)
ACCENT_BLUE_LIGHT: "#60A5FA"    # Azul claro para hover (blue-400)
TEXT_PRIMARY: "#FFFFFF"          # Texto principal
TEXT_SECONDARY: "rgba(255,255,255,0.7)"  # Texto secundario
TEXT_MUTED: "rgba(255,255,255,0.4)"      # Texto terciario
BORDER_SUBTLE: "rgba(255,255,255,0.06)"  # Bordes casi invisibles

# Typography scale (Inter)
FONT_FAMILY: "Inter"
DISPLAY: "clamp(2.5rem, 5vw, 4.5rem)"     # Títulos hero/display
HEADING_1: "clamp(2rem, 4vw, 3.5rem)"      # Sección headings
HEADING_2: "clamp(1.5rem, 3vw, 2.25rem)"   # Sub-headings
HEADING_3: "clamp(1.25rem, 2vw, 1.75rem)"  # Card titles
BODY: "clamp(1rem, 1.5vw, 1.125rem)"       # Cuerpo de texto
CAPTION: "clamp(0.75rem, 1vw, 0.875rem)"   # Captions y labels
WEIGHT_BOLD: "700"
WEIGHT_SEMIBOLD: "600"
WEIGHT_MEDIUM: "500"
WEIGHT_REGULAR: "400"
WEIGHT_LIGHT: "300"
```

---

## Code Structure

### Archivos a Modificar

```yaml
Modificar:
  - app/globals.css                          # Design tokens CSS, typography scale, transiciones
  - app/layout.tsx                           # Verificar font configuration
  - app/page.tsx                             # Wrapper unificador entre secciones
  - components/sections/Hero.tsx             # Unificar bg, tipografía, eliminar bordes
  - components/sections/Benefits/index.tsx   # Transición suave desde Hero
  - components/sections/Benefits/BenefitPanel.tsx  # Eliminar variante light, unificar dark
  - components/sections/Benefits/MobileBenefits.tsx # Mismo tratamiento visual
  - components/sections/Benefits/data/benefits-data.ts  # Eliminar bgVariant light
  - components/sections/Services.tsx         # Unificar bg con resto, transición suave
  - components/sections/ContactForm.tsx      # Transición desde Services, tipografía
  - components/sections/Header.tsx           # Tipografía y estilo coherente
  - components/sections/Footer.tsx           # Eliminar border-top, fluir desde ContactForm

No_Crear_Archivos_Nuevos: true  # Usar CSS custom properties y Tailwind existente
```

---

## Instructions

### Fase 1: Design Tokens & Typography Foundation (@frontend)

**1.1 Crear CSS custom properties globales en globals.css:**
```css
:root {
  /* Background unificado */
  --bg-primary: #0A0A0A;
  --bg-surface: rgba(255, 255, 255, 0.03);
  --bg-surface-hover: rgba(255, 255, 255, 0.06);

  /* Accent */
  --accent: #3B82F6;
  --accent-hover: #60A5FA;

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.4);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);

  /* Spacing entre secciones (consistente) */
  --section-gap: clamp(4rem, 8vw, 8rem);
}
```

**1.2 Typography scale unificada:**
```css
/* Escala tipográfica consistente para toda la landing */
.text-display {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.text-h2 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-h3 {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 600;
  line-height: 1.3;
}

.text-body {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  font-weight: 400;
  line-height: 1.6;
}

.text-caption {
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

**1.3 Transición suave entre secciones:**
```css
/* Cada sección debe usar este background unificado */
.section-unified {
  background-color: var(--bg-primary);
  position: relative;
}

/* Gradiente conector entre secciones (aplicar en pseudo-element) */
.section-connector::before {
  content: '';
  position: absolute;
  top: -4rem;
  left: 0;
  right: 0;
  height: 8rem;
  background: linear-gradient(to bottom, transparent, var(--bg-primary));
  pointer-events: none;
  z-index: 1;
}
```

### Fase 2: Unificar Background Color — Eliminar Cortes Duros (@frontend)

**Problema principal:** Hero usa `#0A0A0A`, Services/Contact/Footer usan `slate-950` (#020617). La diferencia es sutil pero crea una línea visible en la transición.

1. **Estandarizar TODAS las secciones a `var(--bg-primary)` (#0A0A0A)**
   - Hero.tsx: ya usa `#0A0A0A` ✓
   - Benefits: cambiar `bg-[#0A0A0A]` → `bg-[var(--bg-primary)]`
   - Services.tsx: cambiar `bg-slate-950` → `bg-[var(--bg-primary)]`
   - ContactForm.tsx: cambiar `bg-slate-950` → `bg-[var(--bg-primary)]`
   - Footer.tsx: cambiar `bg-slate-950` → `bg-[var(--bg-primary)]`

2. **Eliminar variante light de Benefits:**
   - En `benefits-data.ts`: eliminar `bgVariant: 'light'` de todos los panels
   - En `BenefitPanel.tsx`: eliminar lógica condicional para variante light
   - En `MobileBenefits.tsx`: eliminar cards con fondo `#F5F5F5`
   - Todo Benefits debe ser dark, consistente con el resto

3. **Eliminar borders entre secciones:**
   - Footer: eliminar `border-t border-white/5` o `border-white/10`
   - Cualquier `<hr>` o `<div>` con border entre secciones

4. **Aplicar gradientes conectores suaves donde sea necesario:**
   - Hero → Benefits: gradiente que difumina la transición
   - Benefits → Services: usar decorativo sutil (glow, radial gradient)
   - Services → ContactForm: gradiente continuo
   - ContactForm → Footer: sin separador visible

### Fase 3: Unificar Tipografía en Todas las Secciones (@frontend)

Aplicar la escala tipográfica definida en Fase 1 a cada sección:

**Hero.tsx:**
- Título principal: usar clase `text-display` o equivalente Tailwind `text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight`
- Subtítulo: usar `text-body` con `text-[var(--text-secondary)]`
- CTA: font-weight `600`, tamaño consistente

**Benefits:**
- Título de cada beneficio: usar `text-h1`
- Descripción: usar `text-body`
- Labels/categorías (como "AHORRO", "CAPACIDAD"): usar `text-caption`
- WatermarkStat: mantener oversized pero con el mismo font-family Inter

**Services.tsx:**
- Card titles: usar `text-h2`
- Card descriptions: usar `text-body`
- Labels de categoría: usar `text-caption`

**ContactForm.tsx:**
- Heading del form: usar `text-h1`
- Subtítulo: usar `text-body`
- Labels de inputs: usar `text-caption` o `text-sm font-medium`
- Placeholder text: `text-body` con `text-[var(--text-muted)]`

**Footer.tsx:**
- Section headers: usar `text-caption` (uppercase, tracking)
- Links: usar `text-body` con `text-[var(--text-secondary)]`
- Legal text: usar `text-caption` con `text-[var(--text-muted)]`

**Header.tsx:**
- Logo text: font-weight consistente con brand
- Nav links: `text-body` o `text-sm font-medium`
- CTA button: consistente con Hero CTA

### Fase 4: Crear Flujo Visual Continuo (Inspiración VICIO) (@frontend)

**Concepto:** La landing debe sentirse como un scroll continuo, no como bloques apilados.

1. **Eliminar márgenes/paddings que crean "gaps" entre secciones:**
   - Reducir `pt-*` de secciones para que se sientan más conectadas
   - Usar `--section-gap` consistente en todas las secciones

2. **Elementos de conexión visual entre secciones:**
   - Sutiles líneas de gradiente azul (`--accent`) que cruzan entre secciones
   - Dot pattern o noise texture muy sutil que se repite en todo el background (ya existe DotPattern en magicui)
   - Particles del Hero que se desvanecen gradualmente en la siguiente sección

3. **Overlapping sutil:**
   - Permitir que elementos de una sección "invadan" ligeramente la siguiente
   - Ejemplo: la última stat de Benefits puede tener un -margin-bottom que lo superponga sobre Services
   - Ejemplo: un gradiente glow azul entre secciones que actúa como conector

4. **Background texture unificada:**
   - Aplicar un noise/grain texture muy sutil al body completo (opacity 0.02-0.03)
   - Esto crea cohesión visual, como un papel o lienzo continuo
   - Implementar con CSS: `background-image: url('data:image/svg+xml,...')` o pseudo-element

5. **Scroll indicators sutiles:**
   - Considerar un indicador de progreso lateral minimalista
   - O simplemente que las animaciones de entrada refuercen la sensación de flujo

### Fase 5: Refinar Detalles por Sección (@frontend)

**Hero:**
- Asegurar que el gradiente inferior se mezcla perfectamente con Benefits
- Particles deben desvanecerse hacia abajo, no cortarse abruptamente

**Benefits:**
- Sin borde superior ni inferior
- Transición de entrada suave desde Hero
- Transición de salida suave hacia Services
- Desktop (GSAP scroll): el último panel debe tener un gradient-fade hacia la siguiente sección
- Mobile: las cards deben fluir sin separadores duros entre ellas

**Services:**
- Sin borde superior
- Background continuo desde Benefits
- Mobile: cards con bordes `var(--border-subtle)` en vez de bordes gruesos
- Desktop: el expanding card debe tener el mismo bg que el resto

**ContactForm:**
- Sin borde superior desde Services
- Gradient sutil de `--bg-primary` a ligeramente más oscuro para crear profundidad
- DotPattern existente es bueno, asegurar que se mezcla con el background

**Footer:**
- SIN border-top (actualmente tiene `border-white/5`)
- Fluir directamente desde ContactForm
- Separador interno (si necesario) con gradiente sutil, no línea recta
- Reducir contraste visual respecto al ContactForm

### Fase 6: Validación Visual por el Usuario (@frontend)

El testing visual lo realiza el usuario manualmente. El agente @frontend preguntará mediante `AskUserQuestion` tras cada grupo de cambios:

1. **Tras Fase 2 (backgrounds unificados):**
   - Preguntar: "¿Se ven líneas o cortes entre secciones? ¿El fondo se siente continuo?"
   - Opciones: "Se ve bien" / "Aún hay cortes visibles" / "Ha empeorado"

2. **Tras Fase 3 (tipografía unificada):**
   - Preguntar: "¿La tipografía se siente consistente en todas las secciones? ¿Algún texto se ve desproporcionado?"
   - Opciones: "Consistente" / "Hay inconsistencias" / "Tamaños incorrectos"

3. **Tras Fase 5 (refinamiento completo):**
   - Preguntar: "¿La landing se siente como un lienzo continuo al hacer scroll? ¿Qué ajustes necesita?"
   - Opciones: "Se ve unificada" / "Necesita ajustes menores" / "Necesita cambios grandes"

4. **Verificación mobile:**
   - Preguntar: "¿Puedes verificar en mobile (375-430px)? ¿Mantiene la cohesión visual?"
   - Opciones: "Bien en mobile" / "Problemas en mobile"

**Ciclo iterativo:** Si el usuario reporta problemas, el agente ajusta y vuelve a preguntar hasta obtener aprobación.

### Fase 7: Build & Deploy (@frontend)

```bash
npm run build
npm run dev  # Verificación visual
```

**Checklist final:**
- [ ] Todas las secciones usan `--bg-primary` (#0A0A0A) como base
- [ ] No hay `slate-950`, `bg-gray-900`, ni ningún otro dark color que no sea `--bg-primary`
- [ ] No hay líneas rectas (border-t, border-b, hr) entre secciones
- [ ] Tipografía sigue la escala unificada en todas las secciones
- [ ] Font-family es Inter en toda la página sin excepciones
- [ ] Font-weight sigue la jerarquía: display(700) > h1(700) > h2(600) > h3(600) > body(400) > caption(500)
- [ ] Transiciones entre secciones usan gradientes suaves
- [ ] Benefits NO tiene variante light (#F5F5F5)
- [ ] Footer NO tiene border-top visible
- [ ] Background se siente como un lienzo continuo al hacer scroll
- [ ] Mobile mantiene la misma cohesión visual que desktop
- [ ] Build compila sin errores
- [ ] No hay regresiones visuales en componentes existentes

---

## Workflow

### Agentes, Skills y Memorias

```yaml
Agentes_Asignados:

  "@frontend":
    fases: [1, 2, 3, 4, 5, 6]
    skills:
      - /tailwind        # Patrones Tailwind v4, custom properties, dark mode
      - /react-19        # Server Components, hooks
      - /nextjs          # App Router, layout, fonts
      - /studiotek-landing-enhancer  # Contexto específico del proyecto
      # Testing visual: lo hace el usuario, se pregunta via AskUserQuestion
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/frontend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/frontend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Insight sobre unificación visual y design tokens]
        2. [Patrones de transición entre secciones en dark theme]
        3. [Técnicas de cohesión visual aplicadas]

  "@gentleman":
    fases: [review post-fase 5]
    skills:
      - /code-analysis   # Análisis de consistencia, anti-patterns
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/backend.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/backend.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Observaciones sobre la coherencia del diseño]
        2. [Trade-offs identificados en la unificación visual]
        3. [Decisiones validadas o rechazadas con justificación]

  "@quality-reviewer":
    fases: [review post-fase 5]
    skills:
      - /code-analysis   # Clean code, CSS architecture, maintainability
    memoria:
      leer_al_inicio: "ai_docs/expertise/domain-experts/quality-reviewer.yaml"
      actualizar_al_final: "ai_docs/expertise/domain-experts/quality-reviewer.yaml"
      incluir_en_respuesta: |
        ## Aprendizajes Clave:
        1. [Calidad de la arquitectura CSS/design tokens]
        2. [Mantenibilidad de los patrones visuales]
        3. [Potenciales mejoras de organización]

  # @testing NO se usa en este plan.
  # Fase 6 es validación manual por el usuario via AskUserQuestion.
```

### Flujo de Ejecucion

```bash
# 1. PLANIFICACION (ESTE DOCUMENTO)
# Revisar y aprobar plan

# 2. CONFIRMAR PLAN
# Usuario aprueba: "Procede con la unificación visual"

# 3. PRE-EJECUCION
# Cada agente LEE su memoria antes de empezar:
#   @frontend → lee ai_docs/expertise/domain-experts/frontend.yaml

# 4. EJECUCION
# Fase 1:  @frontend (/tailwind) - Design tokens & typography foundation
# Fase 2:  @frontend (/tailwind, /studiotek-landing-enhancer) - Unificar backgrounds
# Fase 3:  @frontend (/tailwind) - Unificar tipografía en todas las secciones
# Fase 4:  @frontend (/studiotek-landing-enhancer) - Flujo visual continuo
# Fase 5:  @frontend (/tailwind) - Refinar detalles por sección
#
# --- REVIEW GATE ---
# Review: @gentleman (/code-analysis) - Coherencia y trade-offs
# Review: @quality-reviewer (/code-analysis) - Calidad CSS y maintainability
#
# Fase 6:  @frontend (AskUserQuestion) - Validación visual por el usuario
# Fase 7:  @frontend - Build & Deploy

# 5. POST-EJECUCION
# Cada agente ACTUALIZA su memoria al finalizar
# Cada agente incluye "## Aprendizajes Clave:" en su respuesta final

# 6. COMMIT
# git add .
# git commit -m "feat: unify visual design across all landing sections
#
# - Standardize background to #0A0A0A across all sections (remove slate-950 mix)
# - Establish unified typography scale with CSS custom properties
# - Remove hard borders and dividers between sections
# - Add smooth gradient transitions between sections
# - Eliminate Benefits light variant (#F5F5F5) for dark theme consistency
# - Remove Footer border-top for seamless visual flow
# - Apply consistent font-weight hierarchy throughout
# - Add subtle background texture for visual cohesion
# - Inspired by vicio.com's seamless scroll experience (adapted to dark tech theme)
#
# Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Report

```yaml
Expected_Output:
  archivos_modificados:
    - app/globals.css                          # Design tokens, typography scale, transitions
    - app/layout.tsx                           # Verificar font config
    - app/page.tsx                             # Wrapper unificador si necesario
    - components/sections/Hero.tsx             # Unificar bg, tipografía
    - components/sections/Benefits/index.tsx   # Transición suave
    - components/sections/Benefits/BenefitPanel.tsx  # Eliminar variante light
    - components/sections/Benefits/MobileBenefits.tsx # Dark only
    - components/sections/Benefits/data/benefits-data.ts  # Eliminar bgVariant light
    - components/sections/Services.tsx         # Unificar bg, tipografía
    - components/sections/ContactForm.tsx      # Unificar bg, tipografía, transición
    - components/sections/Header.tsx           # Tipografía coherente
    - components/sections/Footer.tsx           # Eliminar border-top, unificar

  archivos_nuevos: []  # No se crean archivos nuevos

  validation:
    - "Todas las secciones usan --bg-primary (#0A0A0A)"
    - "No existe ningún slate-950 en secciones activas"
    - "No hay border-t/border-b entre secciones"
    - "Tipografía sigue escala unificada (display > h1 > h2 > h3 > body > caption)"
    - "Font-family Inter en toda la página"
    - "Benefits NO tiene variante light"
    - "Footer NO tiene border-top"
    - "Transiciones entre secciones son gradientes suaves"
    - "Background se percibe como lienzo continuo"
    - "Build compila sin errores"
    - "Mobile mantiene cohesión visual"

  metricas_visuales:
    separadores_visibles: "0"
    colores_de_fondo_distintos: "1 (solo --bg-primary)"
    font_families: "1 (solo Inter)"
    variantes_tipograficas: "6 (display, h1, h2, h3, body, caption)"

  workflow_status: PENDING_APPROVAL
  phases_completed: 0/7
```

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|--------------|---------|------------|
| Eliminar bgVariant light rompe Benefits panels visualmente | Media | Alto | Verificar que todos los panels en benefits-data.ts ya usan dark; si alguno usa light, rediseñar con variante dark equivalente |
| Cambiar slate-950 a #0A0A0A causa diferencia en overlays/gradients existentes | Media | Medio | Revisar cada gradient que referencia slate-* y ajustar al nuevo token |
| Typography scale rompe layouts existentes (textos más grandes/pequeños) | Alta | Alto | Aplicar progresivamente sección por sección, verificando visualmente cada una |
| Eliminar border del Footer reduce la legibilidad de la separación legal | Baja | Bajo | Usar gradiente sutil o espaciado extra en su lugar |
| Background texture (noise/grain) impacta performance en mobile | Baja | Medio | Usar opacity muy baja (0.02) y CSS en vez de imagen externa |
| Particles del Hero no se difuminan bien hacia Benefits | Media | Medio | Ajustar gradient overlay inferior del Hero |
| DotPattern en ContactForm crea inconsistencia si no se extiende | Baja | Bajo | Mantener DotPattern pero asegurar que se funde con --bg-primary |

---

## Notes

### Principios de Diseno (Inspirados en VICIO, adaptados a StudioTek)

- **Lienzo continuo**: Toda la landing es un solo lienzo oscuro, no bloques apilados
- **Tipografía como sistema**: Una sola familia (Inter), una escala de 6 niveles, aplicada consistentemente
- **Sin líneas duras**: Las transiciones son gradientes, no borders
- **Dark theme cohesivo**: Un solo color de fondo (#0A0A0A) con variaciones sutiles de superficie
- **Flujo de scroll**: El usuario debe sentir que hace scroll en un documento continuo, no que "cambia de sección"
- **Detalles sutiles**: Noise texture, glows, dot patterns muy tenues que unifican el fondo
- **Jerarquía por contraste**: La separación visual viene del contenido (espaciado, tamaño, color de texto), no de bordes o cambios de fondo

### Lo que NO hacemos (diferencia con VICIO)
- NO usamos collage/overlap caótico → mantenemos grid limpio
- NO usamos fondo claro → mantenemos dark theme
- NO usamos colores llamativos (rojo/naranja) → mantenemos azul/blanco
- NO rompemos la profesionalidad tech → adaptamos solo la fluidez visual

---

*Ultima actualizacion: 02 Febrero 2026*
*Version: 5.0 - Visual Unification (VICIO-inspired)*
