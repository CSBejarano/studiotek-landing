# Ideas Design System Skill

A comprehensive Claude Skill for creating consistent, accessible, and high-quality UI components for the Ideas SaaS booking platform.

## What This Skill Provides

This skill guides Claude in creating:
- Dashboard admin components (calendars, tables, metrics, forms)
- Landing page sections (heroes, features, pricing, testimonials)
- Booking-specific UI (time pickers, availability matrices, schedule views)
- Form patterns (multi-step wizards, validation, error handling)
- Data visualization (charts, metrics, KPI cards)

## Skill Structure

```
ideas-design/
├── SKILL.md                    # Main skill file (~800 tokens, quick reference)
├── README.md                   # This file
├── checklist.md                # Pre-delivery QA checklist
├── reference/                  # Detailed reference documentation
│   ├── color-system.md         # Complete color palette & usage
│   ├── typography.md           # Font system & type scale
│   ├── component-patterns.md   # Reusable component interfaces
│   └── accessibility.md        # WCAG AA compliance guide
└── examples/                   # Production-ready templates
    ├── booking-calendar.tsx    # Week-view calendar component
    ├── dashboard-page.tsx      # Standard dashboard layout
    └── landing-section.tsx     # Marketing section patterns
```

## When to Use This Skill

Claude will automatically activate this skill when you:
- Request UI component creation
- Ask for design improvements
- Need booking/scheduling interfaces
- Build dashboard pages
- Create landing page sections
- Work on forms, tables, or charts
- Ask about colors, typography, or spacing
- Need accessibility guidance

**Trigger keywords**: design, style, create component, build UI, calendar, booking, dashboard, landing, form, table, chart, metric card

## Key Features

### 1. Complete Design System
- **Color System**: HSL-based palette with light/dark mode support
- **Typography**: Modular type scale with Plus Jakarta Sans + Inter
- **Spacing**: 4px base unit with Tailwind scale
- **Shadows**: 3-level elevation system
- **Animations**: Float, fade-in, scale-in patterns

### 2. Component Patterns
- **Booking Components**: TimeSlotPicker, WeeklyScheduleView, AvailabilityMatrix
- **Dashboard Components**: MetricCard, EmptyState, DataTableWithFilters
- **Form Patterns**: MultiStepForm with validation
- **Loading States**: Skeleton loaders for all contexts

### 3. Accessibility First
- WCAG AA compliance checklist
- ARIA patterns for complex widgets
- Keyboard navigation support
- Screen reader testing guide
- Color contrast verification

### 4. Production-Ready Examples
All examples are:
- Fully typed with TypeScript
- Accessible (WCAG AA)
- Responsive (mobile-first)
- Dark mode compatible
- Performance optimized

## Quick Start Guide

### For Developers

1. **Browse examples first**: Check `examples/` for ready-to-use templates
2. **Reference documentation**: Use `reference/` for detailed specs
3. **Run checklist**: Use `checklist.md` before committing
4. **Follow patterns**: Copy examples and customize

### For Claude

When this skill is active, you should:
1. Always reference existing `@ideas/ui` components first
2. Use CSS variables from `reference/color-system.md`
3. Follow component patterns from `reference/component-patterns.md`
4. Check accessibility guidelines from `reference/accessibility.md`
5. Run through `checklist.md` before delivering code

## Color Reference Quick Copy

```tsx
// Primary brand
className="bg-primary text-primary-foreground"

// Status badges
className="bg-amber-100 text-amber-800"  // Pending
className="bg-green-100 text-green-800"  // Confirmed
className="bg-slate-100 text-slate-800"  // Completed
className="bg-destructive/10 text-destructive"  // Cancelled

// Semantic tokens
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="border-border"
className="text-muted-foreground"
```

## Typography Quick Copy

```tsx
// Page title
className="text-2xl font-semibold tracking-tight"

// Section heading
className="text-lg font-medium"

// Body text
className="text-base"

// Muted text
className="text-sm text-muted-foreground"

// Hero heading
className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
```

## Component Import Pattern

```tsx
// Always import from @ideas/ui
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Select,
  Table
} from '@ideas/ui';

// Icons from lucide-react
import { Calendar, Users, Settings } from 'lucide-react';

// API hooks from @ideas/api-client
import { useBookings, useCreateBooking } from '@ideas/api-client';
```

## File Organization

When creating new components:

```
apps/dashboard/src/components/
  ├── bookings/       # Booking-specific components
  ├── employees/      # Employee management UI
  ├── analytics/      # Charts and metrics
  ├── layout/         # Header, Sidebar, MainLayout
  └── shared/         # Reusable utilities (MetricCard, StatusBadge)
```

## Testing Guidelines

Before delivery, verify:
- [ ] Visual: Colors, typography, spacing match design system
- [ ] Functional: Loading, error, empty states work
- [ ] Responsive: Mobile (320px), tablet (768px), desktop (1024px+)
- [ ] Accessible: Keyboard navigation, screen reader, ARIA labels
- [ ] Performance: No unnecessary renders, proper memoization
- [ ] TypeScript: No type errors, proper interfaces

## Resources

- **SKILL.md**: Quick reference (read this first)
- **reference/**: Deep dives on each system aspect
- **examples/**: Copy-paste starting points
- **checklist.md**: Pre-commit verification

## Contributing to This Skill

When updating this skill:
1. Keep SKILL.md concise (~800 tokens)
2. Put detailed info in reference/ files
3. Make examples production-ready
4. Update checklist with new patterns
5. Test all code examples

## Tech Stack Reference

- **Framework**: React 18 + TypeScript
- **Build**: Vite (dashboard), Next.js 15 (landing)
- **Styling**: Tailwind CSS 3.4+
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: React Query + Zustand
- **Charts**: Recharts

## Version History

- **v1.0.0** (2025-12-12): Initial skill creation
  - Complete design system documentation
  - 3 production-ready example components
  - 4 comprehensive reference guides
  - Pre-delivery checklist with 100+ items

---

**Maintained by**: Ideas Frontend Team
**Last updated**: December 12, 2025
**Questions?**: Check reference/ docs or ask in #frontend-help
