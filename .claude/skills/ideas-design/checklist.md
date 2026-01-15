# Pre-Delivery Component Checklist

Use this checklist before delivering any component to ensure quality, accessibility, and consistency.

---

## MCP Verification (REQUIRED)

### Pre-Creation

- [ ] **shadcn search**: Ejecute `mcp__shadcn__search_items_in_registries` para verificar si el componente ya existe
- [ ] **View examples**: Si existe, revise ejemplos con `mcp__shadcn__get_item_examples_from_registries`
- [ ] **magicui check**: Si es landing page, consulte efectos disponibles con MCP correspondiente (getBackgrounds, getTextAnimations, etc.)

### Post-Creation

- [ ] **Audit checklist**: Ejecute `mcp__shadcn__get_audit_checklist` para verificacion de calidad
- [ ] **Patterns match**: El componente sigue patrones de ejemplos del registry
- [ ] **No duplicates**: Confirme que no recreo un componente existente

---

## Visual Design

### Color & Theme

- [ ] **CSS variables only**: No hardcoded colors (use `hsl(var(--primary))` not `#3B82F6`)
- [ ] **Semantic tokens**: Use `bg-background`, `text-foreground`, `border-border`
- [ ] **Status colors**: Consistent mapping (pending=amber, confirmed=green, etc.)
- [ ] **Dark mode tested**: Toggle theme and verify all colors work
- [ ] **Contrast verified**: Text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] **Focus visible**: Focus ring has 3:1 contrast against background

### Typography

- [ ] **Font hierarchy**: Proper use of text-* classes (text-2xl for h1, text-lg for h2, etc.)
- [ ] **Font weights**: Correct weight for context (600 for headings, 400 for body)
- [ ] **Line height**: Minimum 1.5 for body text, 1.2-1.3 for headings
- [ ] **Letter spacing**: Applied correctly (tracking-tight for large, tracking-wide for uppercase)
- [ ] **Readable length**: Max 75 characters per line for body text
- [ ] **Responsive text**: Scales appropriately on mobile (text-2xl sm:text-3xl lg:text-4xl)

### Spacing & Layout

- [ ] **Consistent spacing**: Uses Tailwind scale (gap-2, gap-4, gap-6, gap-8)
- [ ] **Padding/margin**: Proper internal and external spacing
- [ ] **Grid/flex**: Appropriate layout system chosen
- [ ] **Container width**: Constrained for readability (max-w-7xl, container class)
- [ ] **Alignment**: Elements properly aligned (items-center, justify-between)
- [ ] **Whitespace**: Sufficient breathing room between sections

### Visual Effects

- [ ] **Shadows**: Appropriate elevation (shadow-md for cards, shadow-lg for modals)
- [ ] **Borders**: Consistent thickness (border, border-2) and color (border-border)
- [ ] **Border radius**: Matches design system (rounded-lg, rounded-md)
- [ ] **Hover states**: Visible on interactive elements (hover:bg-accent)
- [ ] **Transitions**: Smooth (transition-all duration-300)
- [ ] **Animations**: Subtle and purposeful (not distracting)

---

## Functional Requirements

### TypeScript

- [ ] **Types defined**: All props typed with interface/type
- [ ] **No `any` types**: Use proper typing or `unknown`
- [ ] **Exports**: Proper named exports
- [ ] **JSDoc comments**: Complex functions documented
- [ ] **Type inference**: Let TypeScript infer when obvious
- [ ] **Generic types**: Used appropriately for reusable components

### Component States

- [ ] **Loading state**: Shows skeleton or spinner while fetching
- [ ] **Empty state**: Meaningful message when no data
- [ ] **Error state**: User-friendly error message with retry option
- [ ] **Success state**: Confirmation feedback for actions
- [ ] **Disabled state**: Visual and functional disabled states
- [ ] **Pending state**: Loading indicators on async actions (buttons)

### Responsive Design

- [ ] **Mobile tested**: Works at 320px width minimum
- [ ] **Tablet tested**: Looks good at 768px
- [ ] **Desktop tested**: Optimized for 1024px+
- [ ] **Breakpoint classes**: Uses sm:, md:, lg:, xl: appropriately
- [ ] **Touch targets**: Minimum 44px × 44px on mobile
- [ ] **Horizontal scroll**: No unintended overflow
- [ ] **Flexible layout**: Adapts to different screen sizes

### Accessibility

- [ ] **Semantic HTML**: Uses proper elements (button, nav, main, header)
- [ ] **ARIA labels**: Icon-only buttons have aria-label
- [ ] **Keyboard navigation**: All interactive elements accessible via keyboard
- [ ] **Focus management**: Focus trapped in modals, returned on close
- [ ] **Screen reader tested**: Works with VoiceOver/NVDA
- [ ] **Color not sole indicator**: Icons/text accompany color coding
- [ ] **Alt text**: Images have descriptive alt attributes
- [ ] **Form labels**: All inputs have associated labels (htmlFor/id)
- [ ] **Error announcements**: Errors announced to screen readers (role="alert")
- [ ] **Live regions**: Dynamic content updates announced (aria-live)

### Interaction & UX

- [ ] **Immediate feedback**: Visual response to user actions
- [ ] **Confirmation dialogs**: Destructive actions ask for confirmation
- [ ] **Undo option**: When appropriate (deleted items, etc.)
- [ ] **Optimistic updates**: UI updates immediately, rollback on error
- [ ] **Progress indicators**: Long operations show progress
- [ ] **Debounced inputs**: Search/filter inputs debounced (300-500ms)
- [ ] **Keyboard shortcuts**: Document and implement if relevant
- [ ] **Double-click prevented**: Disable buttons during async operations

---

## Integration

### Component Imports

- [ ] **@ideas/ui imports**: Use package imports, not relative paths
- [ ] **Icon imports**: From lucide-react only
- [ ] **Utility imports**: cn() from @ideas/ui for conditional classes
- [ ] **No unused imports**: Cleaned up
- [ ] **Consistent import order**: React → third-party → @ideas → local

### API Integration

- [ ] **React Query hooks**: Use provided hooks from @ideas/api-client
- [ ] **Error handling**: Proper try/catch and error messages
- [ ] **Loading states**: isLoading, isPending handled
- [ ] **Cache invalidation**: Proper query invalidation after mutations
- [ ] **Stale time**: Appropriate caching strategy
- [ ] **Optimistic updates**: Implemented where UX benefits

### State Management

- [ ] **Local state**: useState for component-specific state
- [ ] **Form state**: React Hook Form for complex forms
- [ ] **Global state**: Zustand store for app-wide state
- [ ] **URL state**: Search params for shareable filters
- [ ] **Derived state**: useMemo for computed values
- [ ] **Effect cleanup**: useEffect cleanup functions implemented

### Forms

- [ ] **React Hook Form**: Used for form management
- [ ] **Zod validation**: Schema validation implemented
- [ ] **Error messages**: Field-level errors displayed
- [ ] **Required fields**: Marked visually and validated
- [ ] **Submit handling**: Async submission with loading state
- [ ] **Reset on success**: Form cleared after successful submission
- [ ] **Auto-focus**: First field focused on mount
- [ ] **Enter to submit**: Works as expected

---

## Performance

### Rendering Optimization

- [ ] **useMemo**: Used for expensive calculations
- [ ] **useCallback**: Used for functions passed as props
- [ ] **React.memo**: Used for pure components (when needed)
- [ ] **Key props**: Stable keys on list items (not index)
- [ ] **Lazy loading**: Code splitting for large components
- [ ] **Virtual scrolling**: Implemented for long lists (1000+ items)

### Asset Optimization

- [ ] **Image optimization**: Next.js Image or optimized assets
- [ ] **Icon usage**: Lucide icons only (tree-shakeable)
- [ ] **Bundle size**: No unnecessary dependencies
- [ ] **CSS purging**: Tailwind purges unused classes

### Data Fetching

- [ ] **Proper refetch**: Only when necessary
- [ ] **Pagination**: Implemented for large datasets
- [ ] **Infinite scroll**: Alternative to pagination where appropriate
- [ ] **Prefetching**: Next routes prefetched on hover

---

## Code Quality

### Code Style

- [ ] **Consistent formatting**: Follows project Prettier config
- [ ] **ESLint passing**: No linting errors
- [ ] **TypeScript strict**: No type errors
- [ ] **Comments**: Complex logic explained
- [ ] **TODOs removed**: Or ticketed for future work
- [ ] **Console logs removed**: No debug logs in production code

### Component Organization

- [ ] **Single responsibility**: Component does one thing well
- [ ] **Reasonable size**: < 300 lines (split if larger)
- [ ] **Prop types**: Documented with TypeScript
- [ ] **Default props**: Sensible defaults provided
- [ ] **Composition**: Prefers composition over prop explosion
- [ ] **Reusability**: Can be used in multiple contexts

### File Structure

- [ ] **Proper location**: Component in correct directory
- [ ] **Named exports**: No default exports (except pages)
- [ ] **Co-location**: Related files together (component + styles + tests)
- [ ] **Index files**: Barrel exports where appropriate

---

## Testing (When Applicable)

- [ ] **Unit tests**: Critical logic tested
- [ ] **Integration tests**: User flows tested
- [ ] **Manual testing**: Tested in browser across states
- [ ] **Browser testing**: Tested in Chrome, Safari, Firefox
- [ ] **Device testing**: Tested on actual mobile device
- [ ] **Regression testing**: Existing features still work

---

## Documentation

- [ ] **JSDoc comments**: Public API documented
- [ ] **Props documented**: TypeScript interface has descriptions
- [ ] **Usage example**: Code example in component file or Storybook
- [ ] **Edge cases**: Known limitations documented
- [ ] **Migration notes**: If replacing old component

---

## Pre-Commit Final Checks

### Visual Review

- [ ] **Matches design**: Pixel-perfect or approved deviations
- [ ] **Consistent with app**: Feels like part of the system
- [ ] **No visual bugs**: No layout breaks, overlaps, or misalignments
- [ ] **Animations smooth**: No janky transitions
- [ ] **Loading pleasant**: Loading states not jarring

### Functional Review

- [ ] **Happy path works**: Primary user flow succeeds
- [ ] **Error handling works**: Errors handled gracefully
- [ ] **Edge cases handled**: Empty, loading, error states
- [ ] **No console errors**: Clean console (no warnings/errors)
- [ ] **No memory leaks**: Cleanup functions implemented

### Accessibility Final Check

- [ ] **Tab through component**: All interactive elements reachable
- [ ] **Screen reader tested**: Meaningful announcements
- [ ] **Keyboard shortcuts work**: Escape closes modals, etc.
- [ ] **Contrast checked**: All text readable
- [ ] **ARIA correct**: No invalid ARIA attributes

### Performance Final Check

- [ ] **Fast on slow network**: Tested with throttling
- [ ] **No unnecessary renders**: React DevTools profiler checked
- [ ] **Lighthouse score**: Accessibility 90+, Performance 80+
- [ ] **Bundle impact**: Not adding significant weight

---

## Sign-Off

Component Name: ________________________________

Reviewed by: ___________________________________

Date: __________________________________________

Notes:
_________________________________________________
_________________________________________________
_________________________________________________

**Ready to merge:** [ ] Yes [ ] No

---

## Quick Reference: Common Issues

### Color Issues
- ❌ `className="bg-[#3B82F6]"` → ✅ `className="bg-primary"`
- ❌ `style={{ color: '#000' }}` → ✅ `className="text-foreground"`

### TypeScript Issues
- ❌ `props: any` → ✅ `props: ComponentProps`
- ❌ `as any` → ✅ Proper type assertion or unknown

### Accessibility Issues
- ❌ `<div onClick={...}>` → ✅ `<Button onClick={...}>`
- ❌ `<img src={...} />` → ✅ `<img src={...} alt="..." />`
- ❌ Icon-only button → ✅ Add `aria-label`

### Responsive Issues
- ❌ Fixed widths → ✅ Responsive classes (w-full sm:w-auto)
- ❌ Absolute positioning → ✅ Flexbox/Grid
- ❌ Small touch targets → ✅ Minimum 44px × 44px

### Performance Issues
- ❌ Inline functions in render → ✅ useCallback
- ❌ Expensive calc in render → ✅ useMemo
- ❌ Missing cleanup → ✅ useEffect return function
