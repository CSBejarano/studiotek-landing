---
name: ideas-design
description: Design system and UI patterns for Ideas SaaS booking platform. Use when creating dashboard components, landing pages, booking calendars, time pickers, employee schedules, analytics views, or any UI for the Ideas project. Triggers design, style, create component, build UI, calendar, booking, dashboard, landing, form, table, chart, metric card.
---

# Ideas Design System

A comprehensive design system for the Ideas SaaS booking/scheduling platform. This skill guides the creation of dashboard admin components and marketing landing pages with consistent visual language.

## Quick Start

1. **Always start with existing components**: `@ideas/ui` exports 48+ shadcn/ui components
2. **Use MCP tools**: Search shadcn/magicui BEFORE creating new components
3. **Use CSS variables**: All colors defined in HSL format (`hsl(var(--primary))`)
4. **Import from root**: `import { Button, Card } from "@ideas/ui"`
5. **Check examples**: Review `examples/` directory for component templates

## MCP Tools Integration

### shadcn MCP - Componentes Base

Usar **ANTES** de crear cualquier componente:

| Herramienta | Uso |
|-------------|-----|
| `mcp__shadcn__search_items_in_registries` | Buscar componente por nombre |
| `mcp__shadcn__view_items_in_registries` | Ver codigo fuente detallado |
| `mcp__shadcn__get_item_examples_from_registries` | Ver ejemplos de uso |
| `mcp__shadcn__get_add_command_for_items` | Comando de instalacion |
| `mcp__shadcn__get_audit_checklist` | Verificacion post-creacion |

**Ejemplo de busqueda:**
```
mcp__shadcn__search_items_in_registries(
  registries: ["@shadcn"],
  query: "calendar"
)
```

### magicui MCP - Efectos y Animaciones

Usar para **landing pages** y efectos WOW:

| Categoria | MCP Tool | Componentes |
|-----------|----------|-------------|
| Fondos | `getBackgrounds` | retro-grid, flickering-grid, ripple, animated-grid |
| Texto | `getTextAnimations` | aurora-text, typing-animation, sparkles-text, number-ticker |
| Botones | `getButtons` | rainbow-button, shimmer-button, pulsating-button |
| Efectos | `getSpecialEffects` | border-beam, particles, confetti, meteors, shine-border |
| UI | `getComponents` | animated-list, bento-grid, globe, marquee, dock |
| Mocks | `getDeviceMocks` | safari, iphone, android |

**Workflow recomendado:**
1. Buscar en shadcn si existe el componente base
2. Si es landing page, consultar magicui para efectos
3. Combinar: shadcn base + magicui enhancement
4. Verificar con `get_audit_checklist`

See `reference/mcp-integration.md` for full MCP documentation.

## Design Principles

1. **Clarity Over Complexity**: Clean interfaces with clear hierarchy
2. **Data-First**: Information is the hero, design supports it
3. **Consistent Spacing**: 4px base unit (Tailwind scale: 1=4px)
4. **Accessible by Default**: WCAG AA minimum, keyboard navigation required

## Color System

**Primary Brand**
- Primary: `hsl(217 91% 60%)` - Sapphire Blue (#3B82F6)
- Primary Glow: `hsl(217 91% 70%)` - Lighter for hover states

**Status Colors**
- Pending: Amber (`hsl(43 96% 56%)`)
- Confirmed: Green (`hsl(142 76% 36%)`)
- Completed: Slate (`hsl(215 16% 47%)`)
- Cancelled: Red (`hsl(0 84% 60%)`)

**Semantic Tokens**
- Destructive: `hsl(0 84% 60%)`
- Muted: `hsl(210 40% 96%)`
- Border: `hsl(214 32% 91%)`

See `reference/color-system.md` for full palette.

## Typography

**Font Stack**
- Display: Plus Jakarta Sans (recommended) or Geist Sans
- Body: Inter or Geist Sans
- Monospace: Geist Mono (for code/data)

**Type Scale** (Modular 1.25 ratio)
- Display: 3rem / 48px (text-5xl)
- Heading 1: 2.25rem / 36px (text-4xl)
- Heading 2: 1.875rem / 30px (text-3xl)
- Heading 3: 1.5rem / 24px (text-2xl)
- Body: 1rem / 16px (text-base)
- Small: 0.875rem / 14px (text-sm)

See `reference/typography.md` for full guidelines.

## Component Checklist

Before delivering any component, verify:

- [ ] Uses CSS variables for colors (not hardcoded hex)
- [ ] TypeScript types defined with proper exports
- [ ] Responsive design (mobile-first, `sm:`, `md:`, `lg:` breakpoints)
- [ ] Loading states with `<Skeleton>` component
- [ ] Empty states with `<EmptyState>` component
- [ ] Error boundaries or error UI
- [ ] ARIA labels and roles
- [ ] Keyboard navigation support
- [ ] Dark mode compatible (uses theme tokens)
- [ ] Lucide icons only (no other icon libraries)

See `checklist.md` for full pre-delivery checklist.

## Common Patterns by Domain

### Bookings UI
- **Calendar Grid**: 7-column grid, week view, event dots
- **Time Slot Picker**: 15/30min intervals, visual selection
- **Booking Cards**: Compact list view + expanded detail view
- **Status Flow**: pending → confirmed → completed/cancelled

See `reference/component-patterns.md` for interfaces.

### Dashboard Pages
- **Header Pattern**: Title + description + actions (right-aligned)
- **KPI Grid**: 4-column metric cards with trend indicators
- **Data Tables**: Filter bar + search + table + pagination
- **Charts**: Recharts with consistent color mapping

See `examples/dashboard-page.tsx` for template.

### Landing Pages
- **Hero Pattern**: Large heading + subtitle + CTA + illustration
- **Feature Grid**: 3-column responsive grid with icons
- **Social Proof**: Testimonials carousel, company logos
- **Animations**: `animate-float`, `fade-in`, `scale-in`

See `examples/landing-section.tsx` for template.

## Spacing System

Use Tailwind spacing scale (4px base):
- **Micro**: `gap-1` (4px) - Icon to text
- **Tight**: `gap-2` (8px) - Form label to input
- **Default**: `gap-4` (16px) - Between cards
- **Relaxed**: `gap-6` (24px) - Between sections
- **Loose**: `gap-8` (32px) - Between major sections

## Shadows & Elevation

Three elevation levels:
- **Level 1** (cards): `shadow-md` or `--shadow-elegant`
- **Level 2** (modals): `shadow-lg` or `--shadow-card`
- **Level 3** (focus): `shadow-glow` for primary actions

## Common Components

**From `@ideas/ui`**:
- Forms: `Button`, `Input`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Label`, `Form`
- Layout: `Card`, `Separator`, `Tabs`, `Accordion`, `ScrollArea`
- Overlays: `Dialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`
- Feedback: `Badge`, `Skeleton`, `Toast`, `Alert`
- Data: `Table`, `Calendar`, `Chart`

**Dashboard Custom**:
- `MetricCard` - KPI display with trend
- `StatusBadge` - Booking status indicator
- `EmptyState` - No data placeholder
- `BookingCalendar` - Week view calendar
- `EmployeeCard` - Staff profile card

## Accessibility Requirements

- All interactive elements have visible focus states
- Color is never the only indicator (use icons/text)
- Minimum 4.5:1 contrast ratio for text
- Touch targets minimum 44px × 44px
- Forms have proper labels and error messages

See `reference/accessibility.md` for WCAG checklist.

## File Organization

```
apps/dashboard/src/components/
  ├── bookings/       # Booking-specific components
  ├── employees/      # Employee management UI
  ├── analytics/      # Charts and metrics
  ├── layout/         # Header, Sidebar, MainLayout
  └── shared/         # Reusable utilities (MetricCard, StatusBadge)

packages/ui/src/
  ├── components/ui/  # shadcn/ui components
  ├── styles/         # globals.css, animations.css
  └── hooks/          # use-toast, use-mobile
```

## Development Workflow

1. **Start with existing**: Check if component exists in `@ideas/ui` first
2. **Use templates**: Copy from `examples/` directory as starting point
3. **Reference patterns**: Check `reference/component-patterns.md` for interfaces
4. **Verify checklist**: Run through `checklist.md` before completion
5. **Test states**: Verify loading, error, empty states

## Resources

- **Color Reference**: `reference/color-system.md`
- **Typography Guide**: `reference/typography.md`
- **Component Patterns**: `reference/component-patterns.md`
- **Accessibility**: `reference/accessibility.md`
- **Examples**: `examples/` directory
- **Checklist**: `checklist.md`

## Tech Stack Reference

- React 18 + TypeScript
- Tailwind CSS 3.4+ (utility-first)
- shadcn/ui (Radix UI primitives)
- Lucide icons only
- React Query (server state)
- Zustand (client state)
- React Hook Form + Zod (forms)
- Recharts (charts)

## Key Conventions

- **CSS Variables**: Use `hsl(var(--primary))` not hardcoded colors
- **Imports**: `@ideas/ui`, `@ideas/api-client`, `@ideas/types`
- **Icons**: Lucide only, 16px (h-4 w-4) or 20px (h-5 w-5)
- **Class naming**: Use `cn()` utility for conditional classes
- **Responsive**: Mobile-first, test at 320px, 768px, 1024px, 1440px
- **Dark mode**: All components must support dark theme via CSS variables
