# Component Patterns Reference

Reusable patterns and interfaces for common Ideas platform components.

## Booking Components

### TimeSlotPicker

Interactive time slot selection for booking creation.

**Interface**:
```tsx
interface TimeSlot {
  time: string;           // "09:00", "09:30", etc.
  available: boolean;     // Is slot bookable?
  employeeId?: string;    // Which employee (if filtered)
}

interface TimeSlotPickerProps {
  date: Date;
  serviceId: string;
  employeeId?: string;
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  interval?: 15 | 30 | 60;  // Minute intervals
}
```

**Implementation Notes**:
- Fetch availability from `useAvailability()` hook
- Display in 2-3 column grid
- Show disabled slots with reduced opacity
- Highlight selected slot with primary color
- Include timezone indicator if multi-location

**Visual Pattern**:
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
  {slots.map((slot) => (
    <Button
      key={slot.time}
      variant={selected === slot.time ? "default" : "outline"}
      disabled={!slot.available}
      onClick={() => onTimeSelect(slot.time)}
      className="font-mono"
    >
      {slot.time}
    </Button>
  ))}
</div>
```

---

### WeeklyScheduleView

Week-at-a-glance calendar with employee schedules.

**Interface**:
```tsx
interface ScheduleSlot {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime: string;
  type: 'available' | 'booked' | 'blocked';
  bookingId?: string;      // If type is 'booked'
  customerName?: string;   // If type is 'booked'
}

interface WeeklyScheduleViewProps {
  weekStart: Date;
  employees: Array<{ id: string; name: string }>;
  schedules: ScheduleSlot[];
  onSlotClick?: (slot: ScheduleSlot) => void;
  showCustomerNames?: boolean;
}
```

**Implementation Notes**:
- Use CSS Grid for day columns
- Each employee gets a row
- Slots positioned by time (use `top` CSS based on hour)
- Minimum slot height: 60px (1 hour)
- Show scrollbar if many employees
- Responsive: collapse to single day on mobile

**Visual Pattern**:
```tsx
<div className="overflow-x-auto">
  <div className="grid grid-cols-8 gap-px bg-border">
    {/* Header Row */}
    <div className="bg-background p-2">Employee</div>
    {days.map(day => (
      <div key={day} className="bg-background p-2 text-center">
        {formatDay(day)}
      </div>
    ))}
    {/* Employee Rows */}
    {employees.map(employee => (
      <>
        <div className="bg-background p-2 font-medium">
          {employee.name}
        </div>
        {days.map(day => (
          <div key={`${employee.id}-${day}`} className="bg-background relative min-h-[200px]">
            {/* Slots rendered here with absolute positioning */}
          </div>
        ))}
      </>
    ))}
  </div>
</div>
```

---

### AvailabilityMatrix

Heatmap-style availability overview.

**Interface**:
```tsx
interface AvailabilityCell {
  date: Date;
  availableSlots: number;
  totalSlots: number;
  density: 'none' | 'low' | 'medium' | 'high';  // 0%, <33%, 33-66%, >66%
}

interface AvailabilityMatrixProps {
  startDate: Date;
  endDate: Date;
  data: AvailabilityCell[];
  onDateClick?: (date: Date) => void;
  showLegend?: boolean;
}
```

**Implementation Notes**:
- Color code by density (green gradient)
- Grid layout (7 columns for week)
- Tooltip shows exact numbers
- Legend: "No availability" to "High availability"

**Color Mapping**:
```tsx
const densityColors = {
  none: "bg-slate-100 dark:bg-slate-800",
  low: "bg-green-200 dark:bg-green-900/30",
  medium: "bg-green-400 dark:bg-green-700/50",
  high: "bg-green-600 dark:bg-green-500/70"
};
```

---

### BookingCardCompact

List view item for bookings table.

**Interface**:
```tsx
interface BookingCardCompactProps {
  booking: {
    id: string;
    customerName: string;
    serviceName: string;
    employeeName: string;
    date: Date;
    startTime: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  };
  onStatusChange?: (id: string, status: BookingStatus) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
}
```

**Visual Pattern**:
```tsx
<Card className="p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>{getInitials(customerName)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{customerName}</p>
        <p className="text-sm text-muted-foreground">{serviceName}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium">{formatDate(date)}</p>
        <p className="text-sm text-muted-foreground">{startTime}</p>
      </div>
      <StatusBadge status={status} />
      <DropdownMenu>
        {/* Actions */}
      </DropdownMenu>
    </div>
  </div>
</Card>
```

---

### BookingCardExpanded

Detailed booking view with all information.

**Interface**:
```tsx
interface BookingCardExpandedProps {
  booking: {
    id: string;
    customer: { name: string; phone: string; email?: string };
    service: { name: string; duration: number; price: number };
    employee: { name: string; avatar?: string };
    date: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
  };
  onCancel?: () => void;
  onReschedule?: () => void;
  onEdit?: () => void;
}
```

**Visual Pattern**:
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Booking Details</CardTitle>
      <StatusBadge status={status} />
    </div>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Customer Section */}
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer</h3>
      <div className="flex items-center gap-3">
        <Avatar />
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.phone}</p>
        </div>
      </div>
    </div>

    {/* Service Section */}
    <Separator />
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Service</h3>
      <p className="font-medium">{service.name}</p>
      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
        <span>{service.duration} min</span>
        <span>${service.price}</span>
      </div>
    </div>

    {/* Date/Time Section */}
    <Separator />
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Date & Time</h3>
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        <p className="font-medium">{formatDate(date)}</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Clock className="h-4 w-4" />
        <p className="text-sm text-muted-foreground">{startTime} - {endTime}</p>
      </div>
    </div>

    {/* Employee Section */}
    <Separator />
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Provider</h3>
      <p className="font-medium">{employee.name}</p>
    </div>

    {/* Notes (if any) */}
    {notes && (
      <>
        <Separator />
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
          <p className="text-sm">{notes}</p>
        </div>
      </>
    )}
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" onClick={onCancel}>Cancel Booking</Button>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onReschedule}>Reschedule</Button>
      <Button onClick={onEdit}>Edit Details</Button>
    </div>
  </CardFooter>
</Card>
```

---

## Dashboard Components

### MetricCard (Extended)

Enhanced version with trend indicators and comparisons.

**Interface**:
```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;         // Percentage change
  changeLabel?: string;    // "vs last month"
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  loading?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}
```

**Implementation Notes**:
- Show change as percentage with arrow icon
- Color code trend (green up = good, red down = bad, unless inverted)
- Skeleton loader while fetching
- Optional icon in top-right corner

**Visual Pattern**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">
      {title}
    </CardTitle>
    {icon && <Icon className="h-4 w-4 text-muted-foreground" />}
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{value}</div>
    {change !== undefined && (
      <p className="text-xs text-muted-foreground mt-1">
        <span className={cn(
          "inline-flex items-center gap-1",
          trend === 'up' && "text-green-600",
          trend === 'down' && "text-red-600"
        )}>
          {trend === 'up' && <TrendingUp className="h-3 w-3" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3" />}
          {Math.abs(change)}%
        </span>
        {changeLabel && ` ${changeLabel}`}
      </p>
    )}
    {description && (
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    )}
  </CardContent>
</Card>
```

---

### EmptyState

Consistent empty state messaging.

**Interface**:
```tsx
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  illustration?: 'bookings' | 'customers' | 'services' | 'generic';
}
```

**Visual Pattern**:
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  {icon && (
    <div className="rounded-full bg-muted p-3 mb-4">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
  )}
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  {description && (
    <p className="text-sm text-muted-foreground max-w-sm mb-4">
      {description}
    </p>
  )}
  {action && (
    <Button variant={action.variant} onClick={action.onClick}>
      {action.label}
    </Button>
  )}
</div>
```

---

### DataTableWithFilters

Standard table pattern with search and filters.

**Interface**:
```tsx
interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableFilter {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date-range';
  options?: Array<{ value: string; label: string }>;
}

interface DataTableWithFiltersProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
}
```

**Visual Pattern**:
```tsx
<div className="space-y-4">
  {/* Filter Bar */}
  <div className="flex flex-col sm:flex-row gap-2">
    <Input
      placeholder={searchPlaceholder}
      className="sm:max-w-xs"
    />
    {filters?.map(filter => (
      <Select key={filter.key}>
        {/* Filter options */}
      </Select>
    ))}
  </div>

  {/* Table */}
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => (
            <TableHead key={col.key}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <TableRow key={i}>
              {columns.map(col => (
                <TableCell key={col.key}>{col.cell(row)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length}>
              {emptyState}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>
```

---

## Form Patterns

### MultiStepForm

Wizard-style form with progress indicator.

**Interface**:
```tsx
interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: React.ReactNode;
  validate?: () => Promise<boolean>;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onComplete: (data: any) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}
```

**Visual Pattern**:
```tsx
<Card>
  <CardHeader>
    {/* Progress Indicator */}
    <div className="flex items-center gap-2 mb-4">
      {steps.map((step, i) => (
        <>
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full",
            i === currentStep
              ? "bg-primary text-primary-foreground"
              : i < currentStep
              ? "bg-green-600 text-white"
              : "bg-muted text-muted-foreground"
          )}>
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "h-0.5 flex-1",
              i < currentStep ? "bg-green-600" : "bg-muted"
            )} />
          )}
        </>
      ))}
    </div>
    <CardTitle>{currentStepData.title}</CardTitle>
    {currentStepData.description && (
      <CardDescription>{currentStepData.description}</CardDescription>
    )}
  </CardHeader>
  <CardContent>
    {currentStepData.fields}
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button
      variant="outline"
      onClick={handleBack}
      disabled={currentStep === 0}
    >
      Back
    </Button>
    <Button onClick={handleNext}>
      {currentStep === steps.length - 1 ? submitLabel : 'Next'}
    </Button>
  </CardFooter>
</Card>
```

---

## Loading States

### SkeletonTable

Table loading placeholder.

```tsx
<div className="space-y-2">
  {[1, 2, 3, 4, 5].map(i => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  ))}
</div>
```

### SkeletonCards

Card grid loading placeholder.

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {[1, 2, 3, 4].map(i => (
    <Card key={i}>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Animation Patterns

### Stagger Children

Animate list items in sequence.

```tsx
<div className="space-y-2">
  {items.map((item, i) => (
    <div
      key={item.id}
      className="animate-fade-in opacity-0"
      style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
    >
      {item.content}
    </div>
  ))}
</div>
```

### Hover Lift

Interactive card elevation.

```tsx
<Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
  {/* Card content */}
</Card>
```

### Smooth Expand

Accordion-style reveal.

```tsx
<div className={cn(
  "transition-all duration-300 overflow-hidden",
  isExpanded ? "max-h-96" : "max-h-0"
)}>
  {content}
</div>
```
