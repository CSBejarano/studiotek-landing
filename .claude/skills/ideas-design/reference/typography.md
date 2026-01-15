# Typography Reference

Complete typography system for the Ideas platform, including font pairings, type scales, and usage guidelines.

## Font Philosophy

Ideas uses modern, professional fonts optimized for:
- **Readability**: High x-height, generous spacing
- **Performance**: Variable fonts for better loading
- **Versatility**: Works across dashboard data and marketing content

## Recommended Font Stack

### Primary: Plus Jakarta Sans + Inter

**Display & Headings**: Plus Jakarta Sans
- Geometric, modern, friendly
- Variable font (200-800 weight)
- Excellent for UI and marketing

**Body & Data**: Inter
- Optimized for screens
- Clear distinction between similar characters (I, l, 1)
- Variable font (100-900 weight)

**Installation**:
```tsx
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});
```

**Tailwind Config**:
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      display: ['var(--font-jakarta)', 'system-ui', 'sans-serif']
    }
  }
}
```

### Alternative: Geist Sans + Geist Mono

**All-purpose**: Geist Sans
- Designed by Vercel
- Excellent for code-heavy interfaces
- Modern, clean aesthetic

**Monospace**: Geist Mono
- For code snippets, API responses
- Pairs perfectly with Geist Sans

**Installation** (Next.js built-in):
```tsx
import { GeistSans, GeistMono } from 'geist/font';

<html className={`${GeistSans.variable} ${GeistMono.variable}`}>
```

### Fallback: System Font Stack

For maximum performance or Vite apps without custom fonts:

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;
```

## Type Scale

Modular scale with 1.25 ratio (Major Third) for visual hierarchy.

### Desktop Scale

```tsx
/* Display (Hero headings) */
text-5xl: 3rem / 48px        line-height: 1.1   font-weight: 700
          letter-spacing: -0.02em

/* Heading 1 (Page titles) */
text-4xl: 2.25rem / 36px     line-height: 1.2   font-weight: 700
          letter-spacing: -0.015em

/* Heading 2 (Section titles) */
text-3xl: 1.875rem / 30px    line-height: 1.3   font-weight: 600
          letter-spacing: -0.01em

/* Heading 3 (Subsection titles) */
text-2xl: 1.5rem / 24px      line-height: 1.4   font-weight: 600
          letter-spacing: -0.005em

/* Heading 4 (Card titles) */
text-xl: 1.25rem / 20px      line-height: 1.4   font-weight: 600
          letter-spacing: 0

/* Large Body */
text-lg: 1.125rem / 18px     line-height: 1.6   font-weight: 400
          letter-spacing: 0

/* Body (Default) */
text-base: 1rem / 16px       line-height: 1.6   font-weight: 400
          letter-spacing: 0

/* Small */
text-sm: 0.875rem / 14px     line-height: 1.5   font-weight: 400
          letter-spacing: 0

/* Extra Small */
text-xs: 0.75rem / 12px      line-height: 1.4   font-weight: 500
          letter-spacing: 0.025em (uppercase)
```

### Mobile Adjustments

Scale down display sizes on mobile:

```tsx
className="text-3xl sm:text-4xl lg:text-5xl"  // Display
className="text-2xl sm:text-3xl lg:text-4xl"  // H1
className="text-xl sm:text-2xl lg:text-3xl"   // H2
```

## Font Weight Hierarchy

```tsx
font-thin: 100       // Rarely used
font-extralight: 200 // Decorative only
font-light: 300      // Large display text
font-normal: 400     // Body text (default)
font-medium: 500     // Emphasis, labels
font-semibold: 600   // Headings, buttons
font-bold: 700       // Page titles, CTAs
font-extrabold: 800  // Hero displays
font-black: 900      // Rarely used
```

**Common Patterns**:
- Body text: `font-normal` (400)
- Form labels: `font-medium` (500)
- Headings: `font-semibold` (600)
- Page titles: `font-bold` (700)
- Hero text: `font-extrabold` (800)

## Letter Spacing (Tracking)

```tsx
tracking-tighter: -0.05em    // Large displays only
tracking-tight: -0.025em     // Headings
tracking-normal: 0           // Body text (default)
tracking-wide: 0.025em       // Uppercase labels
tracking-wider: 0.05em       // All-caps small text
tracking-widest: 0.1em       // Rare, decorative
```

**Usage**:
- Display headings: `tracking-tight`
- Body: `tracking-normal`
- Buttons/badges: `tracking-normal`
- All-caps labels: `tracking-wide`

## Line Height (Leading)

```tsx
leading-none: 1      // Decorative displays
leading-tight: 1.25  // Large headings
leading-snug: 1.375  // Small headings
leading-normal: 1.5  // Body text
leading-relaxed: 1.625 // Long-form content
leading-loose: 2     // Poetry, special cases
```

**Best Practices**:
- Display: `leading-none` or `leading-tight`
- Headings: `leading-tight` or `leading-snug`
- Body: `leading-normal` (1.5)
- Forms: `leading-normal`
- Buttons: `leading-none` (centered vertically)

## Usage by Context

### Dashboard Pages

**Page Title**
```tsx
<h1 className="text-2xl font-semibold tracking-tight">
  Reservas
</h1>
```

**Page Description**
```tsx
<p className="text-sm text-muted-foreground">
  Gestiona todas las reservas de tu negocio
</p>
```

**Section Heading**
```tsx
<h2 className="text-lg font-medium">
  Métricas del mes
</h2>
```

**Card Title**
```tsx
<h3 className="text-base font-semibold">
  Total de reservas
</h3>
```

**Data Label**
```tsx
<span className="text-sm font-medium text-muted-foreground">
  Cliente
</span>
```

**Data Value**
```tsx
<span className="text-base font-medium">
  Juan Pérez
</span>
```

**Metric Value**
```tsx
<div className="text-3xl font-bold">
  127
</div>
```

### Landing Pages

**Hero Heading**
```tsx
<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
  Gestiona tus reservas
  <span className="text-primary"> sin esfuerzo</span>
</h1>
```

**Hero Subheading**
```tsx
<p className="text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-2xl">
  Plataforma todo-en-uno para spas, salones y centros de bienestar
</p>
```

**Section Title**
```tsx
<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
  Características principales
</h2>
```

**Feature Heading**
```tsx
<h3 className="text-xl font-semibold">
  Calendario inteligente
</h3>
```

**Feature Description**
```tsx
<p className="text-muted-foreground">
  Visualiza disponibilidad en tiempo real
</p>
```

### Forms

**Form Label**
```tsx
<Label className="text-sm font-medium">
  Nombre del cliente
</Label>
```

**Input Placeholder**
```tsx
<Input placeholder="Ingresa el nombre..." className="text-base" />
```

**Helper Text**
```tsx
<p className="text-xs text-muted-foreground">
  Este campo es opcional
</p>
```

**Error Message**
```tsx
<p className="text-xs text-destructive font-medium">
  Este campo es requerido
</p>
```

### Buttons & CTAs

**Primary Button**
```tsx
<Button className="text-base font-semibold">
  Crear reserva
</Button>
```

**Secondary Button**
```tsx
<Button variant="outline" className="text-sm font-medium">
  Cancelar
</Button>
```

**Link Button**
```tsx
<Button variant="link" className="text-sm font-medium text-primary">
  Ver detalles
</Button>
```

### Tables

**Table Header**
```tsx
<TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
  Cliente
</TableHead>
```

**Table Cell**
```tsx
<TableCell className="text-sm font-medium">
  Juan Pérez
</TableCell>
```

**Table Caption**
```tsx
<TableCaption className="text-sm text-muted-foreground">
  Mostrando 10 de 127 resultados
</TableCaption>
```

### Badges & Labels

**Status Badge**
```tsx
<Badge className="text-xs font-medium">
  Confirmado
</Badge>
```

**Count Badge**
```tsx
<Badge variant="secondary" className="text-xs font-semibold">
  24
</Badge>
```

**Category Tag**
```tsx
<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
  Masajes
</span>
```

## Responsive Typography

### Mobile-First Approach

Start with mobile sizes, scale up:

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>
```

### Breakpoint Guide

- **Base** (< 640px): Mobile phones
- **sm** (≥ 640px): Large phones, small tablets
- **md** (≥ 768px): Tablets
- **lg** (≥ 1024px): Laptops
- **xl** (≥ 1280px): Desktops
- **2xl** (≥ 1536px): Large screens

### Common Patterns

**Hero Text**:
```tsx
className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
```

**Section Heading**:
```tsx
className="text-2xl sm:text-3xl lg:text-4xl"
```

**Body Text** (usually stays consistent):
```tsx
className="text-base"  // No breakpoint modifiers needed
```

## Text Utilities

### Truncation

**Single Line**:
```tsx
<p className="truncate">
  Very long text that will be cut off with ellipsis...
</p>
```

**Multi-Line** (2 lines):
```tsx
<p className="line-clamp-2">
  Longer text that will show maximum two lines before truncating
</p>
```

### Text Alignment

```tsx
text-left         // Default for LTR
text-center       // Centered
text-right        // Right-aligned
text-justify      // Justified (avoid for UI)
```

**Responsive**:
```tsx
className="text-center sm:text-left"
```

### Text Transform

```tsx
uppercase         // ALL CAPS (use sparingly)
lowercase         // all lowercase
capitalize        // First Letter Capitalized
normal-case       // Reset to normal
```

## Accessibility

### Contrast Requirements

- Normal text: 4.5:1 minimum
- Large text (≥18px or ≥14px bold): 3:1 minimum

### Best Practices

1. **Never rely on font weight alone**: Use size + weight together
2. **Maintain hierarchy**: Clear distinction between heading levels
3. **Readable line length**: 45-75 characters per line
4. **Sufficient line height**: Minimum 1.5 for body text
5. **Allow text zoom**: Test at 200% zoom level

### Screen Reader Considerations

```tsx
<h1 className="sr-only">Page Title</h1>  // Visually hidden but announced
<p aria-label="Descriptive label">...</p>  // Custom announcement
```

## Performance

### Font Loading Strategy

**Next.js** (automatic optimization):
```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

**Vite** (manual via Fontsource):
```bash
pnpm add @fontsource/inter
```

```tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

### Avoid FOUT/FOIT

Use `font-display: swap` to show fallback text while custom fonts load:

```css
@font-face {
  font-display: swap;
}
```

## Testing Checklist

- [ ] All headings use semantic HTML (h1-h6)
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] Body text has minimum 1.5 line height
- [ ] Text is readable at 200% zoom
- [ ] Contrast meets WCAG AA (4.5:1 for normal text)
- [ ] Long text content has max-width constraint (prose)
- [ ] Responsive sizes tested on mobile/tablet/desktop
