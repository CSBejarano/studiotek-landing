# Accessibility Reference

Comprehensive accessibility guidelines for the Ideas platform to ensure WCAG AA compliance.

## Core Principles (POUR)

1. **Perceivable**: Information must be presentable to all users
2. **Operable**: UI components must be usable by everyone
3. **Understandable**: Content and operation must be clear
4. **Robust**: Content must work across assistive technologies

---

## WCAG AA Checklist

### Color & Contrast

- [ ] **Normal text** (< 18px): minimum 4.5:1 contrast ratio
- [ ] **Large text** (≥ 18px or ≥ 14px bold): minimum 3:1 contrast ratio
- [ ] **UI components** (borders, icons): minimum 3:1 contrast ratio
- [ ] **Color is not the only indicator**: use icons/text with status colors
- [ ] **Focus indicators**: visible focus state with 3:1 contrast
- [ ] **Tested with color blindness simulators**: protanopia, deuteranopia, tritanopia

**Testing Tools**:
- Chrome DevTools: Inspect > Contrast ratio
- WAVE browser extension
- axe DevTools

**Examples**:
```tsx
// ✅ Good: Color + icon
<Badge className="bg-green-100 text-green-800">
  <CheckCircle className="h-3 w-3 mr-1" />
  Confirmed
</Badge>

// ❌ Bad: Color only
<Badge className="bg-green-100">
  Confirmed
</Badge>
```

---

### Keyboard Navigation

- [ ] **All interactive elements** are keyboard accessible (Tab/Shift+Tab)
- [ ] **Focus order** is logical and predictable
- [ ] **No keyboard traps**: users can Tab away from all elements
- [ ] **Skip links** provided for main content
- [ ] **Escape key** closes modals and overlays
- [ ] **Arrow keys** navigate within composite widgets (menus, tabs)
- [ ] **Enter/Space** activates buttons and links
- [ ] **Custom shortcuts** documented and don't conflict with browser/AT

**Focus Management**:
```tsx
// Auto-focus first input in modal
useEffect(() => {
  if (open) {
    firstInputRef.current?.focus();
  }
}, [open]);

// Return focus when closing
const handleClose = () => {
  setOpen(false);
  triggerRef.current?.focus();
};
```

**Keyboard Patterns**:
```tsx
// Tabs
<Tabs onKeyDown={(e) => {
  if (e.key === 'ArrowLeft') navigatePrevTab();
  if (e.key === 'ArrowRight') navigateNextTab();
}} />

// Dropdown menu
<DropdownMenu>
  {/* Arrow keys navigate items, Enter selects, Escape closes */}
</DropdownMenu>
```

---

### Screen Readers

- [ ] **Semantic HTML**: use `<button>`, `<nav>`, `<main>`, `<header>`, etc.
- [ ] **ARIA labels** on icon-only buttons
- [ ] **ARIA live regions** for dynamic content updates
- [ ] **Form labels** properly associated with inputs
- [ ] **Error messages** announced to AT
- [ ] **Loading states** announced
- [ ] **Image alt text** provided (or `alt=""` for decorative)
- [ ] **Landmarks** used for page regions

**ARIA Patterns**:
```tsx
// Icon button with label
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Loading state
<div role="status" aria-live="polite">
  {isLoading ? "Loading..." : `${items.length} results`}
</div>

// Form field with error
<Label htmlFor="email">Email</Label>
<Input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && (
  <p id="email-error" className="text-destructive text-sm">
    {error}
  </p>
)}

// Expandable section
<Button
  aria-expanded={isExpanded}
  aria-controls="details-panel"
  onClick={toggle}
>
  View Details
</Button>
<div id="details-panel" hidden={!isExpanded}>
  {/* Content */}
</div>
```

---

### Focus Indicators

- [ ] **Visible focus states** on all interactive elements
- [ ] **Focus ring** has minimum 2px width and 3:1 contrast
- [ ] **Custom focus styles** don't obscure content
- [ ] **Focus visible** only on keyboard interaction (not click)

**Implementation**:
```tsx
// Default Tailwind focus ring (already WCAG compliant)
<Button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Click me
</Button>

// Custom focus style
<Card className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
  {/* Content */}
</Card>

// Remove focus ring on mouse click (keep for keyboard)
// Already handled by :focus-visible pseudo-class
```

---

### Touch Targets

- [ ] **Minimum size**: 44px × 44px (iOS/Android standard)
- [ ] **Adequate spacing**: 8px minimum between targets
- [ ] **Large enough on mobile**: test at actual device size
- [ ] **No overlapping targets**

**Examples**:
```tsx
// ✅ Good: 44px minimum
<Button className="h-11 px-4">
  Submit
</Button>

// ✅ Good: Icon button with padding
<Button size="icon" className="h-10 w-10">
  <Trash className="h-4 w-4" />
</Button>

// ❌ Bad: Too small
<button className="h-6 w-6">X</button>
```

---

## Component-Specific Guidelines

### Booking Calendar

**Requirements**:
- Keyboard navigation with arrow keys
- Selected date announced to screen readers
- Disabled dates clearly indicated
- Today's date marked visually and semantically

**Implementation**:
```tsx
<div role="grid" aria-label="Booking calendar">
  <div role="row">
    {days.map(day => (
      <button
        key={day}
        role="gridcell"
        aria-label={formatDateForSR(day)}
        aria-selected={isSelected(day)}
        aria-disabled={isDisabled(day)}
        tabIndex={isSelected(day) ? 0 : -1}
        className={cn(
          "focus-visible:ring-2",
          isDisabled(day) && "opacity-50 cursor-not-allowed"
        )}
      >
        {day.getDate()}
      </button>
    ))}
  </div>
</div>
```

---

### Time Slot Picker

**Requirements**:
- Available vs. unavailable slots clearly distinguished
- Selected time announced
- Keyboard navigation support

**Implementation**:
```tsx
<div role="radiogroup" aria-label="Select appointment time">
  {slots.map(slot => (
    <Button
      key={slot.time}
      role="radio"
      aria-checked={selected === slot.time}
      aria-disabled={!slot.available}
      disabled={!slot.available}
      onClick={() => onSelect(slot.time)}
    >
      {slot.time}
      {!slot.available && (
        <span className="sr-only">Not available</span>
      )}
    </Button>
  ))}
</div>
```

---

### Data Tables

**Requirements**:
- Column headers with `<th>` and `scope="col"`
- Row headers where appropriate
- Sortable columns announce sort state
- Pagination controls keyboard accessible

**Implementation**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">
        <button
          aria-label={`Sort by customer name, currently ${sortOrder}`}
          onClick={toggleSort}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" aria-hidden="true" />
        </button>
      </TableHead>
      <TableHead scope="col">Service</TableHead>
      <TableHead scope="col">Date</TableHead>
      <TableHead scope="col">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {bookings.map(booking => (
      <TableRow key={booking.id}>
        <TableCell>{booking.customerName}</TableCell>
        <TableCell>{booking.serviceName}</TableCell>
        <TableCell>
          <time dateTime={booking.date.toISOString()}>
            {formatDate(booking.date)}
          </time>
        </TableCell>
        <TableCell>
          <StatusBadge status={booking.status} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

{/* Pagination with screen reader announcements */}
<div role="navigation" aria-label="Pagination">
  <Button
    aria-label={`Go to page ${currentPage - 1}`}
    disabled={currentPage === 1}
  >
    Previous
  </Button>
  <span aria-current="page" aria-label={`Current page, page ${currentPage}`}>
    {currentPage}
  </span>
  <Button
    aria-label={`Go to page ${currentPage + 1}`}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>
```

---

### Forms

**Requirements**:
- All inputs have associated labels
- Required fields marked
- Errors announced to screen readers
- Fieldsets for grouped inputs
- Submit button clearly labeled

**Implementation**:
```tsx
<form onSubmit={handleSubmit} aria-label="Create booking form">
  <div className="space-y-4">
    {/* Text input */}
    <div>
      <Label htmlFor="customer-name">
        Customer Name <span aria-label="required">*</span>
      </Label>
      <Input
        id="customer-name"
        required
        aria-required="true"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : "name-hint"}
      />
      <p id="name-hint" className="text-xs text-muted-foreground">
        Full name of the customer
      </p>
      {errors.name && (
        <p id="name-error" className="text-xs text-destructive" role="alert">
          {errors.name}
        </p>
      )}
    </div>

    {/* Select */}
    <div>
      <Label htmlFor="service">Service</Label>
      <Select name="service">
        <SelectTrigger id="service" aria-label="Select service">
          <SelectValue placeholder="Choose a service" />
        </SelectTrigger>
        <SelectContent>
          {services.map(s => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Radio group */}
    <fieldset>
      <legend className="text-sm font-medium mb-2">
        Booking Type
      </legend>
      <RadioGroup defaultValue="in-person">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="in-person" id="in-person" />
          <Label htmlFor="in-person">In-person</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online">Online</Label>
        </div>
      </RadioGroup>
    </fieldset>

    {/* Submit */}
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Creating...</span>
        </>
      ) : (
        "Create Booking"
      )}
    </Button>
  </div>
</form>

{/* Success message */}
{success && (
  <div role="status" aria-live="polite" className="text-green-600">
    Booking created successfully!
  </div>
)}
```

---

### Modals & Dialogs

**Requirements**:
- Focus trapped within modal
- Escape key closes
- Return focus to trigger on close
- Screen reader announced as dialog
- Background content inert

**Implementation** (using shadcn Dialog):
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    {/* Focus automatically managed by Radix UI */}
    <DialogHeader>
      <DialogTitle>Booking Details</DialogTitle>
      <DialogDescription>
        Review and confirm the booking information below.
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Notifications & Toasts

**Requirements**:
- Announced to screen readers
- Don't auto-dismiss too quickly (min 5 seconds)
- Dismissible by keyboard
- Don't block critical content

**Implementation**:
```tsx
import { useToast } from "@ideas/ui";

const { toast } = useToast();

toast({
  title: "Booking created",
  description: "The booking has been added to your calendar.",
  // Automatically includes role="status" and aria-live="polite"
});

// Error toast
toast({
  title: "Error",
  description: "Could not create booking. Please try again.",
  variant: "destructive",
  // Automatically includes role="alert" and aria-live="assertive"
});
```

---

## Testing Checklist

### Automated Testing

Run these tools on every page:

- [ ] **axe DevTools** (browser extension): catches 30-50% of issues
- [ ] **WAVE** (browser extension): visual feedback on errors
- [ ] **Lighthouse** (Chrome DevTools): accessibility score
- [ ] **eslint-plugin-jsx-a11y**: catches JSX issues at build time

### Manual Testing

- [ ] **Keyboard only**: navigate entire page without mouse
- [ ] **Screen reader**: test with NVDA (Windows) or VoiceOver (macOS)
- [ ] **Zoom to 200%**: ensure layout doesn't break
- [ ] **High contrast mode**: test in Windows high contrast
- [ ] **Color blindness**: test with simulator
- [ ] **Touch devices**: test on actual phone/tablet

### Screen Reader Testing

**VoiceOver (macOS)**:
- Cmd+F5 to enable
- Ctrl+Option+arrow keys to navigate
- Ctrl+Option+Space to activate

**NVDA (Windows)**:
- Free and open source
- Insert+arrow keys to navigate
- Insert+Space to toggle focus/browse mode

---

## Common Mistakes to Avoid

### ❌ Bad Practices

```tsx
// Missing label
<input type="text" placeholder="Name" />

// Div button (not keyboard accessible)
<div onClick={handleClick}>Submit</div>

// Color-only status
<span className="text-green-600">Approved</span>

// Icon without label
<button><X /></button>

// Missing alt text
<img src="chart.png" />

// Fake button
<span className="cursor-pointer" onClick={...}>Click</span>

// Auto-dismissing important message
<Toast duration={1000}>Your data was deleted</Toast>
```

### ✅ Good Practices

```tsx
// Proper label
<Label htmlFor="name">Name</Label>
<Input id="name" placeholder="Enter your name" />

// Real button
<Button onClick={handleClick}>Submit</Button>

// Color + icon + text
<Badge className="bg-green-100 text-green-800">
  <CheckCircle className="h-3 w-3 mr-1" />
  Approved
</Badge>

// Icon with ARIA label
<Button aria-label="Close">
  <X className="h-4 w-4" />
</Button>

// Descriptive alt text
<img src="revenue-chart.png" alt="Revenue chart showing 25% increase in Q4" />

// Semantic button
<Button onClick={handleAction}>Click me</Button>

// Long duration for important messages
<Toast duration={10000}>Your data was deleted</Toast>
```

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [WebAIM Articles](https://webaim.org/articles/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Checklists
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
