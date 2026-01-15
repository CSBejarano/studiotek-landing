# MCP Integration Guide

Guía completa para usar los MCPs de **shadcn** y **magicui** en el desarrollo de componentes UI para Ideas.

---

## MCPs Disponibles

### 1. shadcn MCP (Componentes Base)

Registry configurado: `@shadcn`

| Herramienta | Descripción | Cuándo Usar |
|-------------|-------------|-------------|
| `mcp__shadcn__search_items_in_registries` | Buscar componentes por nombre/descripción | ANTES de crear cualquier componente |
| `mcp__shadcn__view_items_in_registries` | Ver código fuente detallado | Para entender implementación |
| `mcp__shadcn__get_item_examples_from_registries` | Ver ejemplos y demos | Para patterns de uso |
| `mcp__shadcn__get_add_command_for_items` | Obtener comando de instalación | Para agregar componentes |
| `mcp__shadcn__get_audit_checklist` | Checklist de verificación | POST-creación de componentes |

#### Ejemplos de Uso

```
# Buscar un componente
mcp__shadcn__search_items_in_registries(
  registries: ["@shadcn"],
  query: "calendar"
)

# Ver código de un componente
mcp__shadcn__view_items_in_registries(
  items: ["@shadcn/button", "@shadcn/card"]
)

# Ver ejemplos de uso
mcp__shadcn__get_item_examples_from_registries(
  registries: ["@shadcn"],
  query: "button-demo"
)

# Obtener comando de instalación
mcp__shadcn__get_add_command_for_items(
  items: ["@shadcn/calendar"]
)
```

---

### 2. magicui MCP (Efectos y Animaciones)

Usar para landing pages, efectos WOW y UI avanzada.

#### Herramientas por Categoría

| Herramienta | Categoría | Componentes |
|-------------|-----------|-------------|
| `mcp___magicuidesign_mcp__getBackgrounds` | Fondos | warp-background, flickering-grid, animated-grid-pattern, retro-grid, ripple, dot-pattern, grid-pattern, interactive-grid-pattern |
| `mcp___magicuidesign_mcp__getTextAnimations` | Texto | text-animate, aurora-text, number-ticker, animated-shiny-text, animated-gradient-text, text-reveal, hyper-text, word-rotate, typing-animation, sparkles-text, morphing-text, spinning-text |
| `mcp___magicuidesign_mcp__getButtons` | Botones | rainbow-button, shimmer-button, shiny-button, interactive-hover-button, pulsating-button, ripple-button |
| `mcp___magicuidesign_mcp__getSpecialEffects` | Efectos | animated-beam, border-beam, shine-border, magic-card, meteors, neon-gradient-card, confetti, particles, cool-mode |
| `mcp___magicuidesign_mcp__getComponents` | UI | marquee, terminal, hero-video-dialog, bento-grid, animated-list, dock, globe, tweet-card, orbiting-circles, avatar-circles, icon-cloud, animated-circular-progress-bar, file-tree, scroll-progress, lens, pointer |
| `mcp___magicuidesign_mcp__getDeviceMocks` | Mocks | safari, iphone, android |
| `mcp___magicuidesign_mcp__getAnimations` | Animaciones | blur-fade, progressive-blur |
| `mcp___magicuidesign_mcp__getUIComponents` | Lista completa | Todos los 70+ componentes |

---

## Workflow Recomendado

### Para Componentes de Dashboard

```
1. BUSCAR si existe en shadcn:
   → mcp__shadcn__search_items_in_registries(@shadcn, "nombre")
   
2. SI existe:
   → mcp__shadcn__view_items_in_registries para ver código
   → mcp__shadcn__get_item_examples_from_registries para ejemplos
   
3. SI NO existe:
   → Crear componente custom siguiendo patterns de @ideas/ui
   
4. POST-CREACIÓN:
   → mcp__shadcn__get_audit_checklist para verificar
```

### Para Landing Pages

```
1. DEFINIR secciones (hero, features, testimonials, etc.)

2. PARA CADA sección, consultar magicui:
   - Hero: getBackgrounds + getTextAnimations
   - Features: getComponents (bento-grid)
   - Stats: getComponents (number-ticker)
   - CTA: getButtons (rainbow, shimmer, pulsating)
   - Testimonials: getComponents (marquee, avatar-circles)
   
3. COMBINAR con componentes shadcn base

4. VERIFICAR con audit_checklist
```

### Para Efectos Especiales

```
1. IDENTIFICAR tipo de efecto:
   - Borde animado → border-beam, shine-border
   - Partículas → particles, meteors, confetti
   - Texto brillante → animated-shiny-text, sparkles-text
   - Fondo interactivo → interactive-grid-pattern, ripple
   
2. CONSULTAR MCP correspondiente

3. INTEGRAR con componente base
```

---

## Mapeo de Casos de Uso

| Necesidad | MCP | Herramienta | Componente Sugerido |
|-----------|-----|-------------|---------------------|
| Botón básico | shadcn | search_items_in_registries | button |
| CTA destacado | magicui | getButtons | rainbow-button, shimmer-button |
| Hero con efecto | magicui | getBackgrounds | retro-grid, flickering-grid |
| Título animado | magicui | getTextAnimations | aurora-text, typing-animation |
| Números animados | magicui | getComponents | number-ticker |
| Lista con entrada | magicui | getComponents | animated-list |
| Carousel de logos | magicui | getComponents | marquee |
| Globo 3D | magicui | getComponents | globe |
| Preview de app | magicui | getDeviceMocks | safari, iphone |
| Borde brillante | magicui | getSpecialEffects | border-beam, shine-border |
| Confetti en éxito | magicui | getSpecialEffects | confetti |
| Grid de features | magicui | getComponents | bento-grid |
| Avatares superpuestos | magicui | getComponents | avatar-circles |
| Nube de iconos | magicui | getComponents | icon-cloud |

---

## Best Practices

### DO (Hacer)

1. **Siempre buscar primero** - Antes de crear, verificar si existe
2. **Usar audit_checklist** - Después de crear cualquier componente
3. **Combinar shadcn + magicui** - Base sólida + efectos WOW
4. **Consultar ejemplos** - get_item_examples antes de implementar
5. **Revisar código fuente** - view_items para entender patterns

### DON'T (No Hacer)

1. **No crear componentes duplicados** - Si existe en shadcn, úsalo
2. **No abusar de efectos** - magicui es para puntos focales
3. **No ignorar accesibilidad** - Efectos deben ser opcionales
4. **No olvidar dark mode** - Todos los componentes deben soportarlo
5. **No hardcodear colores** - Usar CSS variables siempre

---

## Componentes Recomendados por Contexto

### Dashboard Admin
- shadcn: table, card, badge, tabs, dialog, form
- magicui: number-ticker (stats), animated-circular-progress-bar (métricas)

### Landing Page - Hero
- shadcn: button (base)
- magicui: retro-grid/flickering-grid (fondo), aurora-text (título), shimmer-button (CTA)

### Landing Page - Features
- shadcn: card (base)
- magicui: bento-grid (layout), border-beam (destacar cards)

### Landing Page - Social Proof
- shadcn: avatar, card
- magicui: marquee (logos), avatar-circles (testimonials)

### Landing Page - Pricing
- shadcn: card, badge, button
- magicui: shine-border (plan destacado), confetti (al elegir plan)

### Booking Calendar
- shadcn: calendar, popover, button
- magicui: N/A (funcionalidad > efectos)

---

## Troubleshooting

### "No items found" en shadcn search
- Probar con términos más genéricos
- Usar getUIComponents de magicui para lista completa
- Crear componente custom si realmente no existe

### Efectos magicui no funcionan
- Verificar que las dependencias estén instaladas (framer-motion, etc.)
- Revisar que el componente soporte dark mode
- Verificar imports correctos

### Performance con muchos efectos
- Limitar efectos a áreas focales
- Usar lazy loading para componentes pesados (globe, particles)
- Preferir CSS animations sobre JS cuando sea posible

---

## Referencias

- shadcn/ui docs: https://ui.shadcn.com
- Magic UI docs: https://magicui.design
- Radix UI primitives: https://radix-ui.com
- Framer Motion: https://framer.com/motion
