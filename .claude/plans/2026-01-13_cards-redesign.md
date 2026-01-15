# Plan de Ejecucion: Cards Redesign - StudioTek Landing

> **Generado:** 2026-01-13T18:00:00Z
> **Issue:** N/A (Mejora visual)
> **Estado:** COMPLETE

## Variables

```yaml
DOMAIN: "frontend"
COMPLETION_PROMISE: "CARDS REDESIGN COMPLETE"
```

## Purpose

Redisenar las cards de la landing StudioTek para:
1. Eliminar contraste blanco/negro - cards oscuras (slate-950)
2. Cambiar BorderBeam por ShineBorder (efecto mas sutil)
3. Reducir grosor del efecto de borde (borderWidth=1)
4. Agregar sombra/glow azul sutil en hover
5. Mantener iconos con gradiente sobre fondo oscuro

## Code Structure

**CREATE:**
- `components/magicui/shine-border.tsx` - Nuevo componente ShineBorder

**MODIFY:**
- `components/magicui/magic-card.tsx` - Agregar prop `background` para fondo customizable
- `components/sections/Benefits.tsx` - Aplicar nuevo diseno de cards
- `components/sections/Services.tsx` - Aplicar nuevo diseno de cards
- `components/sections/HowItWorks.tsx` - Aplicar nuevo diseno de cards

## Cambios Realizados

### FASE 1: ShineBorder Component

Creado `components/magicui/shine-border.tsx`:
- Props: `borderWidth` (default 1), `duration` (default 14s), `shineColor` (string | string[])
- Efecto de gradiente animado en borde usando CSS mask
- Animacion `shine` definida en globals.css

### FASE 2: MagicCard Enhancement

Modificado `components/magicui/magic-card.tsx`:
- Nueva prop `background` (default "bg-white")
- Permite customizar el fondo interno de la card
- Para dark theme usar `background="bg-slate-950"`

### FASE 3: Benefits Redesign

Modificado `components/sections/Benefits.tsx`:
- Reemplazado BorderBeam por ShineBorder
- MagicCard con `background="bg-slate-950"`
- Hover effects: `hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)]`
- ShineBorder colors: `['#3b82f6', '#8b5cf6']` (azul a violeta)

### FASE 4: Services Redesign

Modificado `components/sections/Services.tsx`:
- Reemplazado BorderBeam por ShineBorder
- MagicCard con `background="bg-slate-950"`
- Hover effects: `hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)]`
- ShineBorder colors: `['#6366f1', '#22d3ee']` (indigo a cyan)
- Feature dots cambiados a `bg-indigo-500`

### FASE 5: HowItWorks Redesign

Modificado `components/sections/HowItWorks.tsx`:
- Agregado ShineBorder (no tenia BorderBeam)
- MagicCard con `background="bg-slate-950"`
- Hover effects: `hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]`
- ShineBorder colors: `['#8b5cf6', '#6366f1']` (violeta a indigo)
- Step badges con shadow: `shadow-violet-500/30`

## Checkpoints

| CP | Fase | Criterio | Estado |
|----|------|----------|--------|
| CP1 | ShineBorder | Componente creado sin errores TypeScript | PASS |
| CP2 | MagicCard | Prop background funciona | PASS |
| CP3 | Benefits | Renderiza sin errores | PASS |
| CP4 | Services | Renderiza sin errores | PASS |
| CP5 | HowItWorks | Renderiza sin errores | PASS |
| CP6 | Build | `npm run build` pasa | PASS |
| CP7 | Lint | Codigo de produccion sin errores | PASS |

## Decisiones Tomadas

| ID | Decision | Confianza |
|----|----------|-----------|
| SL012 | ShineBorder (borderWidth=1, duration=12-16s) en lugar de BorderBeam | 0.95 |
| SL013 | Prop background en MagicCard para dark themes | 0.95 |
| SL014 | Hover con border-{color}-500/30 + shadow glow rgba 0.12 | 0.95 |

## Result

**Status:** SUCCESS
**Build:** PASS
**Lint:** PASS (codigo de produccion)

---

**CARDS REDESIGN COMPLETE**
