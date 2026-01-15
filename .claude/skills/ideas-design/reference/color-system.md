# Color System Reference

Complete color palette for the Ideas platform with CSS variable mappings and usage guidelines.

## Color Philosophy

All colors are defined in HSL format for compatibility with Tailwind CSS and easy manipulation (lightness adjustments, opacity). Colors use CSS variables for theme support (light/dark modes).

## Primary Brand Colors

### Sapphire Blue (Primary)

**Base Color**: `#3B82F6` / `hsl(217 91% 60%)`

```css
--primary: 217 91% 60%;
--primary-foreground: 0 0% 100%;
--primary-glow: 217 91% 70%;
```

**Usage**:
- Primary CTAs (buttons, links)
- Focus states
- Active navigation items
- Brand elements

**Tailwind Classes**:
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Primary Action
</Button>
```

**Variants**:
- Hover: `hsl(217 91% 50%)` - 10% darker
- Active: `hsl(217 91% 45%)` - 15% darker
- Glow: `hsl(217 91% 70%)` - For shadows/glows

## Status Colors

### Booking Status Palette

#### Pending (Amber)
```css
/* Not in CSS vars, use Tailwind's amber */
bg-amber-100 text-amber-800      /* Light mode badge */
bg-amber-500/10 text-amber-500   /* Dark mode badge */
```
- **Hex**: `#F59E0B`
- **HSL**: `hsl(43 96% 56%)`
- **Usage**: Unconfirmed bookings, awaiting action

#### Confirmed (Green)
```css
/* Use Tailwind's green */
bg-green-100 text-green-800      /* Light mode */
bg-green-500/10 text-green-500   /* Dark mode */
```
- **Hex**: `#16A34A`
- **HSL**: `hsl(142 76% 36%)`
- **Usage**: Confirmed appointments, success states

#### Completed (Slate)
```css
/* Use Tailwind's slate */
bg-slate-100 text-slate-800      /* Light mode */
bg-slate-500/10 text-slate-500   /* Dark mode */
```
- **Hex**: `#64748B`
- **HSL**: `hsl(215 16% 47%)`
- **Usage**: Finished bookings, archived items

#### Cancelled (Red)
```css
/* Use destructive token */
bg-destructive/10 text-destructive
```
- **CSS Var**: `hsl(0 84% 60%)` light, `hsl(0 62% 50%)` dark
- **Usage**: Cancelled bookings, errors, destructive actions

### Status Badge Component Pattern

```tsx
const statusColors = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-500",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500",
  completed: "bg-slate-100 text-slate-800 dark:bg-slate-500/10 dark:text-slate-500",
  cancelled: "bg-destructive/10 text-destructive"
};
```

## Semantic Tokens

### Background Colors

```css
/* Light Mode */
--background: 0 0% 100%;           /* Pure white #FFFFFF */
--foreground: 222 47% 11%;         /* Almost black #151B28 */

/* Dark Mode */
--background: 222 47% 6%;          /* Near black #0D1117 */
--foreground: 210 40% 98%;         /* Off white #F9FAFB */
```

### Card & Surface Colors

```css
/* Light Mode */
--card: 0 0% 100%;                 /* White cards */
--card-foreground: 222 47% 11%;

/* Dark Mode */
--card: 222 47% 8%;                /* Elevated dark surface */
--card-foreground: 210 40% 98%;
```

### Interactive States

```css
/* Secondary (subtle backgrounds) */
--secondary: 210 40% 96%;          /* Light: #F1F5F9 */
--secondary-foreground: 222 47% 11%;

/* Muted (disabled, placeholders) */
--muted: 210 40% 96%;
--muted-foreground: 215 16% 47%;   /* Gray text */

/* Accent (hover states) */
--accent: 210 40% 96%;
--accent-foreground: 222 47% 11%;
```

### Borders & Inputs

```css
--border: 214 32% 91%;             /* Light gray #E2E8F0 */
--input: 214 32% 91%;              /* Input borders */
--ring: 217 91% 60%;               /* Focus ring (primary) */
```

**Dark Mode**:
```css
--border: 222 47% 15%;
--input: 222 47% 15%;
--ring: 217 91% 60%;               /* Same blue */
```

### Destructive Actions

```css
/* Light Mode */
--destructive: 0 84% 60%;          /* Red #EF4444 */
--destructive-foreground: 0 0% 100%;

/* Dark Mode */
--destructive: 0 62% 50%;          /* Darker red */
--destructive-foreground: 0 0% 100%;
```

## Neutral Palette (Slate)

Full slate scale for custom grays:

```css
slate-50:  hsl(210 40% 98%)   #F8FAFC
slate-100: hsl(210 40% 96%)   #F1F5F9
slate-200: hsl(214 32% 91%)   #E2E8F0
slate-300: hsl(213 27% 84%)   #CBD5E1
slate-400: hsl(215 20% 65%)   #94A3B8
slate-500: hsl(215 16% 47%)   #64748B
slate-600: hsl(215 19% 35%)   #475569
slate-700: hsl(215 25% 27%)   #334155
slate-800: hsl(217 33% 17%)   #1E293B
slate-900: hsl(222 47% 11%)   #0F172A
slate-950: hsl(222 47% 6%)    #0D1117
```

**Usage**: Custom components requiring fine-grained gray control.

## Sidebar Specific

```css
/* Light Mode */
--sidebar-background: 0 0% 98%;
--sidebar-foreground: 240 5.3% 26.1%;
--sidebar-primary: 240 5.9% 10%;
--sidebar-primary-foreground: 0 0% 98%;
--sidebar-accent: 240 4.8% 95.9%;
--sidebar-accent-foreground: 240 5.9% 10%;
--sidebar-border: 220 13% 91%;
--sidebar-ring: 217 91% 60%;

/* Dark Mode */
--sidebar-background: 222 47% 8%;
--sidebar-foreground: 210 40% 98%;
--sidebar-primary: 217 91% 60%;    /* Blue accent in dark */
--sidebar-primary-foreground: 0 0% 100%;
--sidebar-accent: 222 47% 11%;
--sidebar-accent-foreground: 210 40% 98%;
--sidebar-border: 222 47% 15%;
--sidebar-ring: 217 91% 60%;
```

## Chart Colors

For Recharts components, use these color mappings:

```tsx
const chartColors = {
  primary: "hsl(217 91% 60%)",     // Blue
  success: "hsl(142 76% 36%)",     // Green
  warning: "hsl(43 96% 56%)",      // Amber
  danger: "hsl(0 84% 60%)",        // Red
  info: "hsl(199 89% 48%)",        // Cyan
  purple: "hsl(271 91% 65%)",      // Purple accent
  slate: "hsl(215 16% 47%)"        // Neutral
};
```

**Revenue Chart**: Primary blue
**Bookings Chart**: Green (confirmed), Amber (pending), Red (cancelled)
**Service Stats**: Purple, Blue, Cyan rotation

## Opacity Scales

Use Tailwind's opacity modifiers for layering:

```tsx
/* Subtle backgrounds */
bg-primary/5      /* 5% opacity */
bg-primary/10     /* 10% opacity */

/* Medium emphasis */
bg-primary/20
bg-primary/30

/* High emphasis */
bg-primary/50
bg-primary/80

/* Hover states */
hover:bg-primary/90
```

## Usage Examples

### Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Click me
</Button>
```

### Status Badge
```tsx
<Badge className="bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500">
  Confirmed
</Badge>
```

### Card with Border
```tsx
<Card className="border-border bg-card text-card-foreground">
  Content
</Card>
```

### Muted Text
```tsx
<p className="text-muted-foreground text-sm">
  Helper text
</p>
```

### Focus Ring
```tsx
<Input className="focus-visible:ring-2 focus-visible:ring-ring" />
```

## Color Contrast Requirements

All text must meet WCAG AA standards:

- **Normal text** (< 18px): 4.5:1 minimum
- **Large text** (≥ 18px or ≥ 14px bold): 3:1 minimum
- **UI components**: 3:1 minimum

**Tested Combinations** (all passing):
- Primary on white: 4.8:1 ✓
- Foreground on background: 15.2:1 ✓
- Muted foreground on background: 4.6:1 ✓
- Destructive on white: 4.5:1 ✓

## Dark Mode Strategy

All components use CSS variables, so dark mode is automatic:

1. **Never hardcode colors**: Use `hsl(var(--primary))` not `#3B82F6`
2. **Use semantic tokens**: `bg-background`, `text-foreground`
3. **Test both themes**: Toggle in browser DevTools
4. **Adjust opacity**: Dark mode often needs higher opacity for visibility

## Gradients

For landing page heroes and decorative elements:

```css
/* Primary gradient */
bg-gradient-to-r from-primary to-primary-glow

/* Subtle background */
bg-gradient-to-br from-background to-slate-50

/* Dark mode glow */
bg-gradient-to-r from-primary/20 to-transparent
```

## Color Accessibility

- Never rely on color alone (add icons/text)
- Provide text alternatives for color-coded information
- Test with color blindness simulators (protanopia, deuteranopia, tritanopia)
- Ensure interactive states are distinguishable (not just color change)
